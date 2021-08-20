import React, { useState, useCallback, useEffect, Fragment ,useRef ,  MouseEvent , useMemo} from 'react';
import { useFullIntl } from '../../Common/Hooks/useFullIntl';
import { usePushError } from '../../Common/Hooks/usePushError';
import { ax } from '../../Common/Utils/AxiosCustom';
import { $u, $v } from '../../Common/Utils/Reimports';

import Select, { ValueType } from "react-select";
import './test.css';

interface Props<T> {
	name?: string
	label?: string
	span?: number
	errors?: string[]
	source: string | T[]
	value?: string
	placeholder?: string
	noneLabel?: string
	queryParams?: any
	showNone?: boolean
	className?: string
	multiple?: boolean
	filter?: (x: ValueDisplay) => boolean
	onChange?: (value: string) => void
	onChangeMultiple?: (value: string[]) => void
	selector: (data: T) => ValueDisplay
	isDisabled?: boolean
}

interface State<T> {
	data: T[]
	loading: boolean
	init: boolean
}

export interface ValueDisplay {
	value: string
	display: string
}

type OptionType = {
  value: string;
  label: string;
};

export const ApiSelect = <T extends unknown>(props: Props<T>) => {
	const { capitalize: caps } = useFullIntl();
	const { onChange, selector, filter } = props;
	const { pushError } = usePushError();
	const [value, setValue] = useState<string>();

	const initial: State<T> = {
		data: [],
		loading: true,
		init: false
	};
	const [state, setState] = useState(initial);

	const setLoading = useCallback((loading: boolean) => {
		setState((s) => $u(s, { $merge: { loading } }));
	}, []);
    

    const [valueOptionProps, setValueOptionProps] = useState<OptionType>();


	useEffect(() => {
		if (state.data == null || state.data.length <= 0 || state.init) {
			return;
		}
		setState((s) => $u(s, { init: { $set: true } }));

		if (onChange != null) {
			if (props.value != null) { 
				onChange(props.value);
			} else {
				onChange(selector(state.data[0]).value);
			}
		}
	}, [state.data, onChange, selector, state.init, props.value]);

	const mappingSourceArray = () => {
		if ( Array.isArray( props.source ) ) {
			const d = filter == null ? props.source : props.source.filter((x) => filter(selector(x)));
			setState((s) => $u(s, { $merge: { data: d ?? [] } }));
		}

	}

	useEffect(() => {
		async function fetch() {
			setLoading(true);
			if (typeof props.source === 'string') {
				const result = await ax
					.get<T[]>(props.source, { params: props.queryParams })
					.catch(() => null);
				if (result == null || result.data == null) {
					pushError('errors.enumLoad');
				} else {
					const d = filter == null ? result.data : result.data.filter((x) => filter(selector(x)));
					setState((s) => $u(s, { $merge: { data: d ?? [] } }));
					if(d.length > 0 && onChange != null && props.value == null) {
						onChange(selector(d[0]).value);
					}
				}
			} else {
				mappingSourceArray();
			}
			setLoading(false);
		}
		if (state.init) {
			return;
		}
		fetch();
	}, []);
	// }, [props.source, setLoading, pushError, props.queryParams, state.init, filter, selector, onChange, props.value]);


	useEffect( () => {
		mappingSourceArray();
	}, [props.source])

	function handleChange(e: any ) {
		
	    const value = e;
		setValueOptionProps(value); 
		setValue(e.value)

		if (props.onChange != null) {
		   props.onChange(e.value);
		}
	}


	const options = state.data.map((e) => {
		const val = selector(e);
		return {
			value: val.value,
			label: $v.titleCase(val.display)
		}
	});
	
	const optionsValue = options?.filter((o , i) => {
		if(props.value?.toString() != undefined){
			if(o.value.toString() === props.value?.toString()){
				return { label: caps(o.label) , value: o.value }
			}
		}else{
			if(o.value.toString() === props.value?.toString() || o.value === value ){
				return { label: caps(o.label) , value: o.value }
			}
		}
	});

	return <div className={'ServerSelect form-group ' + (props.span ? 'col-' + props.span : '')}>
		{props.label && <label>
			<b>{caps(props.label)}:</b>
		</label>}
		

		<Select
			id='select' 
			name={props.name}
			placeholder={props.placeholder == null ? undefined : caps(props.placeholder)}
			options={options} 
			getOptionLabel = {({ label }) => label}
			getOptionValue = {({ value }) => value}
			menuPortalTarget={document.parentElement}
			// menuPosition={'absolute'} 
			onChange={handleChange}
			value={optionsValue}  
			isDisabled={props.isDisabled}
		/>

		
		{props.errors && <div>
			{props.errors.map((e, i) => {
				return <Fragment key={i}>
					<small className='text-danger'>{e}</small>
					<br />
				</Fragment>;
			})}
		</div>}
	</div>;



};


