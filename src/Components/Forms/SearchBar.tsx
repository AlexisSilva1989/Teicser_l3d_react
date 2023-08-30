import React, { useState } from 'react';
import { useFullIntl } from '../../Common/Hooks/useFullIntl';
import { useLocalization } from '../../Common/Hooks/useLocalization';

interface Props {
	noLabel?: boolean
	className?: string
	placeholder?: string
	outerClassName?: string
	onChange?: (text: string) => void
}

export const SearchBar = (props: Props) => {
	const { capitalize: caps } = useFullIntl();
	const { placeholder } = useLocalization();
	const [value, setValue] = useState('');

	function onChange(e: React.ChangeEvent<HTMLInputElement>) {
		const val = e.target.value;
		setValue(() => val);
		if (props.onChange != null) {
			props.onChange(val);
		}
	}

	function onClickClear() {
		setValue(() => '');
		if (props.onChange != null) {
			props.onChange('');
		}
	}

	return <div className={['form-group msig-search', props.outerClassName].join(' ')}>
		<div className={['input-group', props.className].join(' ')}>
			<div className='input-group-prepend btn btn-primary'>
				<i className='fas fa-search m-t-7-px' />
			</div>
			<input type='search' value={value} onChange={onChange} className='form-control border-0 msig-search-input' 
				placeholder={props.placeholder ? caps(props.placeholder) : placeholder('search')} />
			{value && <div className='input-group-append text-danger msig-search-clear' style={{ cursor: 'pointer' }}>
				{/* <i className='p-3 fas fa-times fa-lg' onClick={onClickClear} /> */}
			</div>}
		</div>
	</div>;
};
