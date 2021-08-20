import React, { Fragment, useEffect, useState, useMemo } from 'react';
import { useFullIntl } from '../../Common/Hooks/useFullIntl';
import { useInit } from '../../Common/Hooks/useInit';

/*

!DEPRECADO..... OJO
**/

interface ISelectOption {
	label: string
	value: string
}

interface Props {
	options?: ISelectOption[]
	value?: string
	name?: string
	label?: string

	onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
	onChangeString?: (e: string) => void
}

export const Select = (props: Props) => {
	const { capitalize: caps } = useFullIntl();
	const { onChangeString } = props;
	const [init, doInit] = useInit();
	const [value, setValue] = useState<string>();

	useEffect(() => {
		setValue(props.value);
	}, [props.value]);

	useEffect(() => {
		if (!init && props.value) {
			doInit();
			setValue(props.value);
			if (onChangeString) { onChangeString(props.value); }
		}
	}, [init, doInit, props.value, onChangeString, setValue]);

	const options = useMemo(() => {
		if (props.options) {
			return props.options.map((o, i) => <option value={o.value} key={i}>
				{caps(o.label)}
			</option>);
		}
		return [];
	}, [props.options, caps]);

	function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
		const val = e.currentTarget.value;
		setValue(val);
		if (props.onChange) { props.onChange(e); }
		if (props.onChangeString) { props.onChangeString(val); }
	}

	return <Fragment>
		{props.label && <label><b>{caps(props.label)}:</b></label>}
		 <select name={props.name} onChange={onChange} className='border rounded form-control'
			value={value} defaultValue={value}>
			{options}
		</select>
		
	</Fragment>;
};
