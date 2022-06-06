import { Fragment } from 'react';
import React from 'react';
import { useFullIntl } from '../../Common/Hooks/useFullIntl';
import { FieldError } from 'react-hook-form';

interface Props {
	label?: string
	name?: string
	rows?: number
	errors?: string[]
	value?: string
	readonly?: boolean
	className?: string
	placeholder?: string
	maxLength?: number
	onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
	errorForm?: FieldError
}

export const TextArea = React.forwardRef((props: Props, ref: React.Ref<HTMLTextAreaElement>) => {
	const { capitalize: caps } = useFullIntl();

	return (
		<Fragment>
			{props.label && (
				<label>
					<b>{caps(props.label)}:</b>
				</label>
			)}
			<textarea
				ref={ref}
				rows={props.rows ?? 5}
				style={{ resize: 'none' }}
				value={props.value}
				readOnly={props.readonly}
				onChange={props.onChange}
				className={'form-control border rounded p-2 ' + props.className}
				name={props.name}
				maxLength={props.maxLength}
				placeholder={props.placeholder == null ? undefined : caps(props.placeholder)}

			/>
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

			{props.errorForm && (
				<div>
					<small className="text-danger">
						{props.errorForm.message}
					</small>
				</div>
			)}
		</Fragment>
	);
});
