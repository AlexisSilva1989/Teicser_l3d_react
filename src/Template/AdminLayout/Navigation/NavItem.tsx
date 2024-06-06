import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { NavIcon } from './NavIcon';
import { IAppState } from '../../../Store/AppStore';
import { toggleNav, navContentLeave } from '../../../Store/Template/TemplateActionCreators';
import { Dispatch, bindActionCreators } from 'redux';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { IModule } from '../../../Store/Dashboard/IDashboardState';
import { Badge } from 'react-bootstrap';
import { useFullLocation } from '../../../Common/Hooks/useFullLocation';

interface Props {
	item: IModule
	badgeCount?:number
	collapseMenu: boolean
	layout: string
	isChild?: boolean
	navContentLeave: () => void
	toggleNav: () => void
}

const NavItem = (props: Props) => {
	const { location } = useFullLocation();
	const { capitalize: caps, localize } = useFullIntl();

	let itemTitle = <span>{caps(props.item.name)}</span>;
	if (props.item.icon) {
		itemTitle = <span className='pcoded-mtext'>
			{caps(props.item.name)}
		</span>;
	}

	const itemTarget = '';
	const paths = location.pathname.split('/');
	const path = localize(props.item.path);
	const highlight = paths.findIndex(x => x === path) !== -1;

	const subContent = <NavLink color={highlight ? '#00bcd4 !important' : undefined} className='nav-item'
		to={'/' + localize(props.item.path ? props.item.path : 'routes:base.not_found')} exact={true} target={itemTarget}>
		{props.item.icon && <NavIcon isChild={props.isChild == null ? false : props.isChild} icon={props.item.icon} badge={props.badgeCount ? true : false} />}
		{itemTitle}		
		{props.badgeCount && <Badge className='label ml-2 badge-warning'> { props.badgeCount }  </Badge>}
	</NavLink>;

	let mainContent: JSX.Element;
	if (props.layout === 'horizontal') {
		mainContent = <li onClick={props.navContentLeave}>{subContent}</li>;
	} else {
		if (window.outerWidth < 992) {
			mainContent = <li onClick={props.toggleNav}>{subContent}</li>;
		} else {
			mainContent = <li>{subContent}</li>;
		}
	}

	return <Fragment>{mainContent}</Fragment>;
};

const mapProps = (state: IAppState): Pick<Props, 'layout' | 'collapseMenu'> => {
	return {
		layout: state.template.layout,
		collapseMenu: state.template.collapseMenu
	};
};

const mapDispatchToProps = (dispatch: Dispatch): Pick<Props, 'navContentLeave' | 'toggleNav'> => {
	return bindActionCreators(
		{
			navContentLeave,
			toggleNav
		},
		dispatch
	);
};

export const EnhancedNavItem = connect(mapProps, mapDispatchToProps)(NavItem);
