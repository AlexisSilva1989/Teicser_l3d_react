import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useLocalization } from '../../Common/Hooks/useLocalization';
import { useInit } from '../../Common/Hooks/useInit';
import { useNotifications } from '../../Common/Hooks/useNotifications';
import { ax } from '../../Common/Utils/AxiosCustom';
import { AxiosError } from 'axios';
import { $u } from '../../Common/Utils/Reimports';
import { useFullIntl } from '../../Common/Hooks/useFullIntl';
import Select, { ValueType } from "react-select";

export interface DropdownOption {
	name: string
	value: string
}

interface Props<T> {
	id?: string
	name?: string
	value?: string
	readonly?: boolean
	localizeOptions?: boolean
	wildcardOption?: DropdownOption

	source: DropdownOption[] | string
	params?: any
	mapSource?: (e: T) => DropdownOption
	onChange?: (e: string) => void
}
 
export const Dropdown = <T extends unknown>(props: Props<T>) => {
	const ref = useRef<HTMLSelectElement>(null);
	const { onChange, mapSource } = props;
	const { push } = useNotifications();
	const { input, label } = useLocalization();
	const { capitalize: caps } = useFullIntl();

	const [init, doInit] = useInit();
	const [initFetch, doInitFetch] = useInit();
	const [value, setValue] = useState<string>();
	const [options, setOptions] = useState<DropdownOption[]>([]);

	useEffect(() => {
		async function fetch() {
			if (typeof (props.source) === 'string') {
				if (mapSource == null) { throw new Error('Can\'t fetch dropdown data without source mapper'); }
				await ax.get<T[]>(props.source, { params: props.params }).then(e => {
					const mapped = e.data.map(mapSource);
					if(props.wildcardOption != null) { setOptions(s => $u(s, { $push: mapped })); }
					else { setOptions(s => $u(s, { $set: mapped })); }
					if(onChange) {
						if(props.wildcardOption != null ) {
							onChange(props.wildcardOption.value); 
						} else if(mapped.length > 0 && props.value == null) {
							onChange(mapped[0].value); 
						}
					} 
				}).catch((e: AxiosError) => push.error('base.load', { code: e.response?.status }));
			} else {
				const source = props.source as DropdownOption[];
				setOptions(s => $u(s, { $push: source }));
				if(onChange) {
					if(props.wildcardOption != null ) {
						onChange(props.wildcardOption.value); 
					} else if(source.length > 0 && props.value == null) {
						onChange(source[0].value); 
					}
				} 
			}
			doInitFetch();
		}

		if(!initFetch) {
			if (props.wildcardOption) {
				setOptions([props.wildcardOption]);
				if(onChange) { onChange(props.wildcardOption.value); }
			} else {
				setOptions([]);
			}
			fetch();
		}
	}, [props.source, push, mapSource, props.wildcardOption, onChange, props.params, props.value, initFetch, doInitFetch]);

	useEffect(() => {
		setValue(props.value);
	}, [props.value]);

	useEffect(() => {
		if (!init && props.value) {
			doInit();
			setValue(props.value);
			if (onChange) { onChange(props.value); }
		}
	}, [init, doInit, props.value, onChange]);


	const optionsComponents = useMemo(() => {
	  return options.map((o, i) => {
		return {
			label:props.localizeOptions == null || props.localizeOptions || (props.wildcardOption != null && i === 0) ? label(o.name) : o.name,
			value: o.value
		}
	  });
	}, [options, label, props.localizeOptions, props.wildcardOption]);


	function onChangeOption(e: any) {
		const val = e.value;
		setValue(val);
		if (props.onChange != null) { props.onChange(val); }
	}

	const groupClasses = ['input-group'];
	if(props.readonly) { groupClasses.push('disabled'); }

	const optionsValue = optionsComponents?.filter((o , i) => {
		if(o.value === props.value || o.value === value){
		  return { label: caps(o.label) , value: o.value }
		}
	});

	return <>
		{props.name && <label><b>{input(props.name)}:</b></label>}
		
		<Select 
			name={props.id}  
			options={optionsComponents} 
			onChange={onChangeOption}   
			disabled={props.readonly}
			value={optionsValue}
		/>
		
	</>;
};
