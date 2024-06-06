import { Fragment, useCallback } from 'react';
import React from 'react';
import { useLocalization } from '../../Common/Hooks/useLocalization';

interface Props {
	name?: string
	rows?: number
	value?: string
	readonly?: boolean
	className?: string
	placeholder?: string
	onChange?: (text: string) => void
}

export const TextArea = (props: Props) => {
	const { input, placeholder } = useLocalization();
	const { onChange } = props;

	const onChangeCallback = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = event.currentTarget.value;
		if(onChange) { onChange(value); }
	}, [onChange]);

	return <Fragment>
		{props.name && <label>
			<b>{input(props.name)}:</b>
		</label>}
		<textarea
			rows={props.rows ?? 5}
			style={{ resize: 'none' }}
			value={props.value}
			readOnly={props.readonly}
			onChange={onChangeCallback}
			className={'form-control border rounded p-2'}
			name={props.name}
			placeholder={props.placeholder == null ? undefined : placeholder(props.placeholder)}
		/>
	</Fragment>;
};
