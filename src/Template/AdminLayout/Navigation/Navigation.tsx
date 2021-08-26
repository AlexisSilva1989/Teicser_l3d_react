import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';

import { IMenu } from '../../../Store/Dashboard/IDashboardState';
import { IAppState } from '../../../Store/AppStore';
import { Dispatch, bindActionCreators } from 'redux';
import { toggleNav, setLayout } from '../../../Store/Template/TemplateActionCreators';
import { EnhanceNavContent as EnhancedNavContent } from './NavContent';
import { EnhancedOutsideClick } from './OutsideClick';

interface Props {
	layout: string;
	sublayout: string;
	layoutType: string;
	fixedNav: boolean;
	fixedHeader: boolean;
	collapseMenu: boolean;
	rtl: boolean;
	boxMode: boolean;
	menus: IMenu[];
	setLayout: (layout: string) => void;
	toggleNav: () => void;
}

const Navigation = (props: Props) => {
	function resize() {
		const contentWidth = document.getElementById('root')!.clientWidth;

		if (props.layout === 'horizontal' && contentWidth < 992) {
			props.setLayout('vertical');
		}
	}

	useEffect(() => {
		resize();
		window.addEventListener('resize', resize);

		return () => {
			window.removeEventListener('resize', resize);
		};
	});

	function scroll() {
		if (props.fixedNav && props.fixedHeader === false) {
			const el = document.querySelector('.pcoded-navbar.menupos-fixed')! as HTMLElement;
			const scrollPosition = window.pageYOffset;
			if (scrollPosition > 60) {
				el.style.position = 'fixed';
				el.style.transition = 'none';
				el.style.marginTop = '0';
			} else {
				el.style.position = 'absolute';
				el.style.marginTop = '60px';
			}
		} else {
			document.querySelector('.pcoded-navbar')?.removeAttribute('style');
		}
	}

	let navClass = ['pcoded-navbar'];

	navClass = [...navClass, props.layoutType];

	if (props.layout === 'horizontal') {
		navClass = [...navClass, 'theme-horizontal'];
	} else {
		if (props.fixedNav) {
			navClass = [...navClass, 'menupos-fixed'];
		}

		if (props.fixedNav && !props.fixedHeader) {
			window.addEventListener('scroll', scroll, true);
			window.scrollTo(0, 0);
		} else {
			window.removeEventListener('scroll', scroll, false);
		}
	}

	if (window.outerWidth < 992 && props.collapseMenu) {
		navClass = [...navClass, 'mob-open'];
	} else if (props.collapseMenu) {
		navClass = [...navClass, 'navbar-collapsed'];
	}

	if (props.layoutType === 'dark') {
		document.body.classList.add('able-pro-dark');
	} else {
		document.body.classList.remove('able-pro-dark');
	}

	if (props.rtl) {
		document.body.classList.add('able-pro-rtl');
	} else {
		document.body.classList.remove('able-pro-rtl');
	}

	if (props.boxMode) {
		document.body.classList.add('container');
		document.body.classList.add('box-layout');
	} else {
		document.body.classList.remove('container');
		document.body.classList.remove('box-layout');
	}

	let navBarClass = ['navbar-wrapper'];
	if (props.layout === 'horizontal' && props.sublayout === 'horizontal-2') {
		navBarClass = [...navBarClass, 'container'];
	}

	let navContent = (
		<div className={navBarClass.join(' ')}>
			<EnhancedNavContent menus={props.menus} />
		</div>
	);
	if (window.outerWidth < 992) {
		// navContent = (
		// 	<EnhancedOutsideClick>
		// 		<div className='navbar-wrapper'>
		// 			<EnhancedNavContent menus={props.menus} />
		// 		</div>
		// 	</EnhancedOutsideClick>
		// );
	}

	return (
		<Fragment>
			<nav className={navClass.join(' ')}>{navContent}</nav>
		</Fragment>
	);
};

const mapStateToProps = (state: IAppState): Pick<Props, 'layout' | 'sublayout' | 'collapseMenu' | 'layoutType' | 'rtl' | 'fixedNav' | 'fixedHeader' | 'boxMode' | 'menus'> => {
	return {
		layout: state.template.layout,
		sublayout: state.template.subLayout,
		collapseMenu: state.template.collapseMenu,
		layoutType: state.template.layoutType,
		rtl: state.template.rtl,
		fixedNav: state.template.fixedNav,
		fixedHeader: state.template.fixedHeader,
		boxMode: state.template.boxMode,
		menus: state.dashboard.menus.side
	};
};

const mapDispatchToProps = (dispatch: Dispatch): Pick<Props, 'toggleNav' | 'setLayout'> => {
	return bindActionCreators(
		{
			toggleNav,
			setLayout
		},
		dispatch
	);
};

export const EnhancedNavigation = connect(mapStateToProps, mapDispatchToProps)(Navigation);