import { useFullIntl } from '../../Common/Hooks/useFullIntl';
import React, { Fragment } from 'react';

interface Props {
	checked?: boolean
	name?: string
	label?: string
	errors?: string[]
	onChange?: (e: boolean) => void
}

export const Checkbox = (props: Props) => {
	const { capitalize: caps } = useFullIntl();

	function onChange(e: React.ChangeEvent<HTMLInputElement>) {
		const val = e.currentTarget.checked;
		if (props.onChange != null) {
			props.onChange(val);
		}
	}

	return (
		<Fragment>
			<div className='form-check'>
				<input type='checkbox' name={props.name} checked={props.checked} onChange={onChange} />
				{props.label && <label className='ml-3'>{caps(props.label)}</label>}
			</div>
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
