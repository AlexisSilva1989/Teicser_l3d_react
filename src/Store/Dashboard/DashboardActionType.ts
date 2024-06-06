import { 
	LOGIN, LOGOUT, CHANGE_LOCALE, PUSH_ERRORS, LOAD_USER_MENU, RESET_DASHBOARD, 
	SET_LOADING, DISMISS_ERROR, SET_PERMISSIONS, DISMISS_ALL, SET_NOTIFICATION_MODULE, SET_BADGES
} from './DashboardActions';
import { IUserInfo, IErrorSummary, INotificationModule, IBadges, IMenuLayout } from './IDashboardState';
import { IUserPermission } from '../../Common/Utils/IUserPermission';

export interface ILogin {
	type: typeof LOGIN;
	user: IUserInfo;
}

export interface ILogout {
	type: typeof LOGOUT;
}

export interface IChangeLocale {
	type: typeof CHANGE_LOCALE;
	locale: string;
}

export interface IPushErrors {
	type: typeof PUSH_ERRORS;
	errors: IErrorSummary[];
}

export interface ILoadUserMenu {
	type: typeof LOAD_USER_MENU;
	permissions: IUserPermission[];
}

export interface IResetDashboard {
	type: typeof RESET_DASHBOARD;
	menus?: IMenuLayout
}

export interface ISetLoading {
	type: typeof SET_LOADING;
	loading: boolean;
}

export interface IDismissError {
	type: typeof DISMISS_ERROR;
	error: number;
}

export interface IDismissAll {
	type: typeof DISMISS_ALL;
}

export interface ISetPermissions {
	type: typeof SET_PERMISSIONS;
	permissions: IUserPermission[];
}

export interface ISetNotificationModule {
	type: typeof SET_NOTIFICATION_MODULE;
	notificationModule: INotificationModule
}

export interface ISetBadges {
	type: typeof SET_BADGES;
	badges: IBadges
}

export type DashboardActionType = ILogin | ILogout | IChangeLocale | IPushErrors | 
	ILoadUserMenu | IResetDashboard | ISetLoading | IDismissError | IDismissAll | 
	ISetPermissions | ISetNotificationModule | ISetBadges;
