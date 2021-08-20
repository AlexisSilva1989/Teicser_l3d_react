/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { NavIcon } from './NavIcon';
import { EnhancedNavItem } from './NavItem';
import { ITemplateMenu } from '../../../Store/Template/ITemplateState';
import { ISubmenu } from '../../../Store/Dashboard/IDashboardState';
import { IAppState } from '../../../Store/AppStore';
import { Dispatch, bindActionCreators } from 'redux';
import { navCollapseLeave, toggleMenu } from '../../../Store/Template/TemplateActionCreators';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { Badge } from 'react-bootstrap';
import { useFullLocation } from '../../../Common/Hooks/useFullLocation';

type BadgeData = { [key: string]: number };

interface Props {
	toggleMenu: (menu: ITemplateMenu) => void
	navCollapseLeave: (menu: ITemplateMenu) => void
	collapse: ISubmenu
	type: string
	open: string[]
	trigger: string[]
	layout: string
	collapseMenu: boolean
	badgeData?: BadgeData
}

const NavCollapse = (props: Props) => {
	const { location } = useFullLocation();
	const { capitalize: caps } = useFullIntl();

	useEffect(() => {
		const currentIndex = document.location.pathname
			.toString()
			.split('/')
			.findIndex((id) => id === props.collapse.name);
		if (currentIndex > -1) {
			props.toggleMenu({ id: props.collapse.name, type: props.type });
		}
	}, [props]);

	function badgeCount(badge?: string) {
		if (badge == null || props.badgeData == null) { return undefined; }
		return props.badgeData[badge];
	}

	const { open, trigger } = props;

	const navItems = props.collapse.modules?.map((item) => {
		return <EnhancedNavItem isChild key={item.name} item={item} badgeCount={badgeCount(item.badgeId)} />;
	});

	let itemTitle = <span>{props.collapse.name}</span>;
	if (props.collapse.icon) {
		itemTitle = <span className='pcoded-mtext'>{caps(props.collapse.name)}</span>;
	}

	let navLinkClass = [''];

	let navItemClass = ['nav-item', 'pcoded-hasmenu'];
	const openIndex = open.findIndex((id) => id === props.collapse.name);
	if (openIndex > -1) {
		navItemClass = [...navItemClass, 'active'];
		if (props.layout !== 'horizontal') {
			navLinkClass = [...navLinkClass, 'active'];
		}
	}

	const triggerIndex = trigger.findIndex((id) => id === props.collapse.name);
	if (triggerIndex > -1) {
		navItemClass = [...navItemClass, 'pcoded-trigger'];
	}

	const currentIndex = location.pathname
		.split('/')
		.findIndex(x => x === props.collapse.name);
	if (currentIndex > -1) {
		navItemClass = [...navItemClass, 'active'];
		if (props.layout !== 'horizontal') {
			navLinkClass = [...navLinkClass, 'active'];
		}
	}

	function sumBadges(navItems?: any) {
		let sum = 0;
		navItems.forEach((a: any) => sum += a.props.badgeCount);
		return sum > 0 ? sum : false;
	}
	
	const subContent = (
		<Fragment>
			<a style={{ cursor: 'pointer', userSelect: 'none' }} className={navLinkClass.join(' ')} onClick={() => props.toggleMenu({ id: props.collapse.name, type: props.type })}>
				{props.collapse.icon && <NavIcon icon={props.collapse.icon} badge={sumBadges(navItems) ? true : false} />}
				{itemTitle}
				{!props.collapseMenu && sumBadges(navItems) && <Badge className='label ml-2 badge-warning'>{sumBadges(navItems)}</Badge>}
			</a>
			<ul className='pcoded-submenu'>{navItems}</ul>
		</Fragment>
	);

	let mainContent: JSX.Element;
	if (props.layout === 'horizontal') {
		mainContent = (
			<li
				className={navItemClass.join(' ')}
				onMouseLeave={() => props.navCollapseLeave({ id: props.collapse.name, type: props.type })}
				onMouseEnter={() => props.toggleMenu({ id: props.collapse.name, type: props.type })}>
				{subContent}
			</li>
		);
	} else {
		mainContent = <li className={navItemClass.join(' ')}>{subContent}</li>;
	}

	return <Fragment>{mainContent}</Fragment>;
};

const mapProps = (state: IAppState): Pick<Props, 'layout' | 'open' | 'trigger' | 'collapseMenu'> => {
	return {
		layout: state.template.layout,
		open: state.template.open,
		trigger: state.template.trigger,
		collapseMenu: state.template.collapseMenu
	};
};

const mapDispatch = (dispatch: Dispatch): Pick<Props, 'toggleMenu' | 'navCollapseLeave'> => {
	return bindActionCreators(
		{
			toggleMenu,
			navCollapseLeave
		},
		dispatch
	);
};

export const EnhancedNavCollapse = connect(mapProps, mapDispatch)(NavCollapse);
