import es from '../../Config/locales/es.json';
import en from '../../Config/locales/en.json';
import userMenus from '../../Config/Menus';
import { IUserPermission } from '../../Common/Utils/IUserPermission';
import { Interface } from 'readline';

/* State partials */
export interface IUserInfo {
	username: string;
	fullname: string;
	picture?: string;
	permissions: IUserPermission[];
	id_trabajador?: number
}

export interface IErrorSummary {
	error: string;
	params?: any;
}

type LocaleConfig = { [id: string]: { [id: string]: string } };

interface ILocale {
	locale: string;
	messages: LocaleConfig;
}

export interface IModule {
	name: string;
	path: string;
	permission?: string;
	icon?: string;
	permission_level?: number;
	linked?: IModule[];
	badgeId?: string;
}

export interface ISubmenu {
	name: string;
	icon?: string;
	modules?: IModule[];
}

export interface IMenu {
	name: string;
	icon?: string;
	submenus?: ISubmenu[];
	modules?: IModule[];
}

export interface IMenuLayout {
	top: IMenu[];
	side: IMenu[];
}

export interface INotificationModule{
	module: string | undefined;
	action: string | undefined;
}

export type IBadges = { [key: string]: number }

/* Actual state */
export interface IDashboardState {
	authenticated: boolean;
	user?: IUserInfo;
	errors: IErrorSummary[];
	localization: ILocale;
	menus: IMenuLayout;
	loading: boolean;
	weekDays: {
		day: number;
		label: string;
	}[];
	notificationModule: INotificationModule,
	badges: IBadges,
}


export const initialState: IDashboardState = {
	authenticated: false,
	user: undefined,
	errors: [],
	localization: {
		locale: 'es',
		messages: {
			es: es,
			en: en
		}
	},
	menus: userMenus,
	loading: false,
	weekDays: [
		{ day: 0, label: 'labels:days.monday' },
		{ day: 1, label: 'labels:days.tuesday' },
		{ day: 2, label: 'labels:days.wednesday' },
		{ day: 3, label: 'labels:days.thursday' },
		{ day: 4, label: 'labels:days.friday' },
		{ day: 5, label: 'labels:days.saturday' },
		{ day: 6, label: 'labels:days.sunday' }
	],
	notificationModule: {
		module: undefined,
		action: undefined
	},
	badges: { }
};

interface ICommonsMenuRequest {
	name: string,
	icon: string,
}

export type Moduls = ICommonsMenuRequest & {
	order: number;
	permiso: string;
	path: string;
	badgeId?: string
}

type SubmenuRequest = ICommonsMenuRequest & {
	moduls: Moduls
}

export type IMenuRequest = ICommonsMenuRequest & {
	order: number;
	posicion: string;
	submenu?: SubmenuRequest
	moduls?: Moduls
}