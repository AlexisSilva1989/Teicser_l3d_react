import React from 'react';
import { IAppState } from '../../../Store/AppStore';
import { useSelector } from 'react-redux';

interface Props {
	icon: string
	isChild?: boolean
	badge?: boolean
}

export const NavIcon = (props: Props) => {
	const collapsed = useSelector<IAppState, boolean>((s) => s.template.collapseMenu);

	return <span className='pcoded-micon'>
		<i className={props.icon + ' ' + (props.badge && (!props.isChild || !collapsed) && 'text-warning')} />
	</span>;
};
