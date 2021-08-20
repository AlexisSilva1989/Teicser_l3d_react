export interface ITemplateMenu {
	id: string;
	type: string;
}

export interface ITemplateState {
	/* Menu */
	open: string[];
	trigger: string[];
	collapseMenu: boolean;
	/* Routing */
	defaultRoute: string;
	basename: string;
	/* Layout */
	contentOnly: boolean;
	layout: string;
	subLayout: string;
	fullscreen: boolean;
	layoutType: string;
	headerColor: string;
	rtl: boolean;
	boxMode: boolean;
	fixedNav: boolean;
	fixedHeader: boolean;
	showConfiguration: boolean;
}

export const initialState: ITemplateState = {
	/* Menu */
	open: [], //for active default menu
	trigger: [], //for active default menu, set blank for horizontal
	collapseMenu: false, // mini-menu
	/* Routing */
	defaultRoute: '/',
	basename: '', // only at build time to set, like ///able-pro/react/default
	/* Layout */
	layout: 'vertical', // vertical, horizontal
	subLayout: '', // horizontal-2
	fullscreen: false, // static can't change,
	layoutType: 'menu-dark', // menu-dark, menu-light, dark
	headerColor: 'header-dark', // background-blue, background-red, background-purple, background-info, background-green, background-dark, background-grd-blue, background-grd-red, background-grd-purple, background-grd-info, background-grd-green, background-grd-dark, background-img-1, background-img-2, background-img-3, background-img-4, background-img-5, background-img-6
	rtl: false,
	boxMode: false,
	fixedNav: true,
	fixedHeader: true,
	showConfiguration: false,
	contentOnly: true
};
