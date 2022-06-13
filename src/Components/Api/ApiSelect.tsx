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
	filter?: (x: OptionType) => boolean
	onChange?: (value: any) => void
	onChangeMultiple?: (value: string[]) => void
	selector: (data: T) => OptionType
	isDisabled?: boolean
	valueInObject? : boolean
	menuPortalTarget?: "body" | "parent"
	firtsOptions?: OptionType
	isLoading?: boolean
  isSelectFirtsOption?: boolean
}

interface State<T> {
	data: T[]
	loading: boolean
	init: boolean
    disabled: boolean
}

export interface ValueDisplay {
	value: string
	display: string
}

export type OptionType = {
  value: string;
  label: string;
};

export const ApiSelect = <T extends unknown>(props: Props<T>) => {
	const { capitalize: caps } = useFullIntl();
	const { onChange, selector, filter, valueInObject } = props;
	const { pushError } = usePushError();
	const [value, setValue] = useState<string>();

	const initial: State<T> = {
		data: [],
		loading: true,
		disabled: true,
		init: false
	};
	const [state, setState] = useState(initial);

	const setLoading = useCallback((loading: boolean) => {
		setState((s) => $u(s, { $merge: { loading } }));
        if(!props.isDisabled){
            setState((s) => $u(s, { disabled: { $set: loading } }));
        }

	}, []);
    
    const [valueOptionProps, setValueOptionProps] = useState<OptionType>();

	useEffect(() => {
		props.isLoading !== undefined && setLoading(props.isLoading)
	},[props.isLoading])
	
	useEffect(() => {
		if (state.data == null || state.data.length <= 0 || state.init) {
			return;
		}
		setState((s) => $u(s, { init: { $set: true } }));

		if (onChange != null) {
			if (props.value != undefined) { 
				onChange(props.value);
			} else {
				onChange(valueInObject ? state.data[0] as string : selector(state.data[0]).value);
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
					.get<T[]>(props.source, { params: props.queryParams }).then((response)=>{
						if(response.data){
							const d = filter == null ? response.data : response.data.filter((x) => filter(selector(x)));
					
							setState((s) => $u(s, { $merge: { data: d ?? [] } }));
		
							if(d.length > 0 && onChange != null && props.value == undefined) {
								if(props.isSelectFirtsOption === undefined || props.isSelectFirtsOption){
									handleChange(selector(d[0]));
								}
								// onChange(valueInObject ? selector(d[0]) :  selector(d[0]).value );
							}
						}
					})
					.catch(() => pushError('errors.enumLoad'));
			
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
			props.onChange(valueInObject ? e : e.value);
		}
	}

	const optionsMapped  = () => {

		let options = state.data.map((e) => {
			const val = selector(e);
			return val

		})

		props.firtsOptions && options.unshift(props.firtsOptions);
		return options;
	} ;

	const options = optionsMapped();

	const optionsValue = options?.filter((o , i) => {
		if(props.value?.toString() != undefined){
			if((o.value.toString() === props.value?.toString()) || (o.value.toString() ===   (props.value as any).value) ){
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
			onChange={handleChange}
			value={optionsValue}  
			isDisabled={props.isDisabled}
			styles={{
				control: base => ({
					...base, 
					minHeight: 'calc(1.5em + 1.25rem + 1.75px)', 
					borderColor: '#e3eaef',
					borderRadius: '0.25rem'
				}),
				indicatorsContainer: base => ({
					...base,
					div: {padding: 5 }
				})
			}}
            isLoading={state.loading}
            menuPortalTarget={props.menuPortalTarget == "body" ? document.body : document.parentElement}
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


