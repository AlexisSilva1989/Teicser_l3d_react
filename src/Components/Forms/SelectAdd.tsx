import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { useFullIntl } from '../../Common/Hooks/useFullIntl';
import { usePushError } from '../../Common/Hooks/usePushError';
import { ax } from '../../Common/Utils/AxiosCustom';
import { $u, $v } from '../../Common/Utils/Reimports';

import CreatableSelect from "react-select/creatable";
import { useReload } from '../../Common/Hooks/useReload';

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
	placeholderAddElement?: string
	onCreateOption?: (inputValue: string) => void
	isLoading?: boolean
	onFinishLoad?: (optionsSize: number) => void
	onStartLoad?: () => void
	reload?: boolean;
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

export const SelectAdd = <T extends unknown>(props: Props<T>) => {
	const { capitalize: caps } = useFullIntl();
	const { onChange, selector, filter } = props;
	const { pushError } = usePushError();
	const [value, setValue] = useState<string>();
	const [isLoading, setIsLoading] = useState(false);
	const formatCreateLabel = (inputValue: string) => `${props.placeholderAddElement ?? `Crear item`}  ${inputValue}`;

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
		if (Array.isArray(props.source)) {
			const d = filter == null ? props.source : props.source.filter((x) => filter(selector(x)));
			setState((s) => $u(s, { $merge: { data: d ?? [] } }));
		}

	}

	const fetch = useCallback(
		async () => {
			setIsLoading(true);
			props.onStartLoad && props.onStartLoad();
			if (typeof props.source === 'string') {
				const result = await ax
					.get<T[]>(props.source, { params: props.queryParams })
					.catch(() => null);
				if (result == null || result.data == null) {
					pushError('errors.enumLoad');
				} else {
					const d = filter == null ? result.data : result.data.filter((x) => filter(selector(x)));
					setState((s) => $u(s, { $merge: { data: d ?? [] } }));
					if (d.length > 0 && onChange != null && props.value == null) {
						console.log({ d })
						onChange(selector(d[0]).value);
					}

					props.onFinishLoad && props.onFinishLoad(d.length)
				}
			} else {
				mappingSourceArray();
			}
			setIsLoading(false);
		},
		[props.source, props.queryParams, filter, selector, onChange, props.value, setLoading, pushError],
	)


	useEffect(() => {
		if (state.init) {
			return;
		}
		fetch();
	}, [state.init]);


	useEffect(() => {
		mappingSourceArray();
	}, [props.source])

	useEffect(() => {
		setValue(props.value);
	}, [props.value])

	function handleChange(e: any) {
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

	const optionsValue = options?.filter((o, i) => o.value == value);

	const onCreateOption = async (inputValue: string) => {
		if (props.onCreateOption) {
			await props.onCreateOption(inputValue);
		}
	}

	useEffect(() => {
		if (props.reload) {
			fetch();
		}
	}, [props.reload])


	return <div className={'ServerSelect form-group ' + (props.span ? 'col-' + props.span : '')}>
		{props.label && <label>
			<b>{caps(props.label)}:</b>
		</label>}

		<CreatableSelect
			isLoading={isLoading}
			onCreateOption={onCreateOption}
			formatCreateLabel={formatCreateLabel}
			id='select'
			name={props.name}
			placeholder={props.placeholder == null ? undefined : caps(props.placeholder)}
			options={options}
			getOptionLabel={({ label }) => label}
			getOptionValue={({ value }) => value}
			menuPortalTarget={document.parentElement}
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