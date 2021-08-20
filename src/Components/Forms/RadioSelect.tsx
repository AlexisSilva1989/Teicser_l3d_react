import { useFullIntl } from '../../Common/Hooks/useFullIntl';
import React, { Fragment, useMemo } from 'react';
import { Utils } from '../../Common/Utils/Utils';

interface Props {
	options?: {
		label: string
		value: string
	}[]
	value?: any
	name?: string
	label?: string
	errors?: string[] 
	disabled?: boolean
	onChange?: (e: string) => void
	style?: React.CSSProperties
}

export const RadioSelect = (props: Props) => {
	const { capitalize: caps } = useFullIntl();
	const guid = useMemo(Utils.getGuid, [Utils.getGuid]);

	function onChange(e: React.ChangeEvent<HTMLInputElement>) {
		const val = e.currentTarget.value;
		if (props.onChange != null) {
			props.onChange(val);
		}
	}

	return (
		<Fragment>
			{props.label && (
				<div>
					<label>
						<b>{caps(props.label)}:</b>
					</label>
				</div>
			)}
			{props.options &&
				props.options.map((x, i) => (
					<div className={"mr-2"} style={props.style} key={i}>
						<label>{caps(x.label)} </label>
						<input style={{marginLeft: 10}} 
							type='radio' 
							checked = { props.value === x.value } 
							disabled={props.disabled}
							name={props.name ?? guid} 
							value={x.value} onChange={onChange} />
					</div>
				))}
			{props.errors && props.errors.length > 0 && (
				<div>
					{props.errors.map((e, i) => {
						return (
							<Fragment key={i}>
								<small className='text-danger' key={i}>
									{e}
								</small>
								<br />
							</Fragment>
						);
					})}
				</div>
			)}
		</Fragment>
	);
};
