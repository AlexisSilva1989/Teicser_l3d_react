import { 
	ILoadUserMenu, IDismissError, IChangeLocale, 
	IPushErrors, ISetLoading, ILogin, ILogout, 
	IResetDashboard, ISetPermissions, IDismissAll,
	ISetNotificationModule, ISetBadges
} from './DashboardActionType';
import { 
	LOAD_USER_MENU, DISMISS_ERROR, CHANGE_LOCALE, 
	LOGIN, LOGOUT, RESET_DASHBOARD, SET_LOADING, PUSH_ERRORS, 
	SET_PERMISSIONS, DISMISS_ALL, SET_NOTIFICATION_MODULE, SET_BADGES
} from './DashboardActions';
import { ThunkResult } from '../ThunkResult';
import { Links } from '../../Config/Links';
import { SET_CONTENT_ONLY } from '../Template/TemplateActions';
import { IErrorSummary, IUserInfo, INotificationModule, IBadges, IMenuLayout, Moduls, IModule, IMenuRequest } from './IDashboardState';
import { ISetContentOnly } from '../Template/TemplateActionType';
import { IUserPermission } from '../../Common/Utils/IUserPermission';
import { ax, axf } from '../../Common/Utils/AxiosCustom';
import { AxiosError } from 'axios';

function pushErrors(errors: IErrorSummary[]): IPushErrors {
	return {
		type: PUSH_ERRORS,
		errors: errors
	};
}

export function setLoading(loading: boolean): ISetLoading {
	return {
		type: SET_LOADING,
		loading
	};
}

function resetDashboard(menus?: IMenuLayout): IResetDashboard {
	return {
		type: RESET_DASHBOARD,
		menus
	};
}

function getLoadUserMenu(permissions: IUserPermission[]): ILoadUserMenu {
	return {
		type: LOAD_USER_MENU,
		permissions
	};
}

function loadUserMenu(permissions: IUserPermission[]): ThunkResult {
	return async (dispatch) => {
		dispatch(getLoadUserMenu(permissions));
		dispatch(setContentOnly(false));
		dispatch(setLoading(false));
	};
}

function setContentOnly(contentOnly: boolean): ISetContentOnly {
	return {
		type: SET_CONTENT_ONLY,
		contentOnly
	};
}

function getLogin(user: IUserInfo): ILogin {
	return {
		type: LOGIN,
		user
	};
}

function setPermissions(permissions: IUserPermission[]): ISetPermissions {
	return {
		type: SET_PERMISSIONS,
		permissions
	};
}

export function dismissError(error: number): IDismissError {
	return {
		type: DISMISS_ERROR,
		error
	};
}

export function dismissAll(): IDismissAll {
	return { type: DISMISS_ALL };
}

export function changeLocale(locale: string): IChangeLocale {
	return {
		type: CHANGE_LOCALE,
		locale
	};
}

export function forwardUserToken(): ThunkResult {
	return async (dispatch) => {
		const token = localStorage.getItem('api-token');
		if (token != null) {
			dispatch(setLoading(true));
			const user = await ax.get<IUserInfo>(Links.USER_INFO).catch(() => null);
			if (user == null) {
				return;
			}
			const permissions = await ax.get<IUserPermission[]>(Links.USER_PERMISSIONS);

			if (permissions == null) {
				dispatch(pushError('errors.user.permissions'));
			}

			dispatch(
				getLogin(
					user?.data ?? {
						username: '',
						fullname: ''
					}
				)
			);
			dispatch(setPermissions(permissions?.data ?? []));
			dispatch(loadUserMenu(permissions?.data));
			

		}
	};
}

export function login(username: string, password: string): ThunkResult {
	
	return async (dispatch) => {
		
		localStorage.clear();
        sessionStorage.clear();

		dispatch(setLoading(true));

		await axf
			.post(Links.USER_LOGIN, { username, password })
			.then(async (e) => {
				localStorage.setItem('api-token', e.data.access_token);
				localStorage.setItem('industry', e.data.industry);
				const userTask = ax.get<IUserInfo>(Links.USER_INFO);
				const permissionsTask = ax.get<IUserPermission[]>(Links.USER_PERMISSIONS);

				const [user, permissions] = await Promise.all([userTask, permissionsTask]);

				if (permissions == null) {
					dispatch(pushError('errors.user.permissions'));
				}

				dispatch(
					getLogin(
						user.data ?? {
							username,
							fullname: ''
						}
					)
				);	
				

				function getIndexByName (array: any[], name: string) {
					const index: number = array.findIndex( item => item.name === `menus:${name}` );
					const exist = index !== -1;
					return {
						index,
						exist
					}
				}

				function getMappingModule (module: Moduls): IModule {
					const mapping: any = {
						permission:  module.permiso,
						name: `menus:${module.name}`,
						path: `routes:base.${module.path}`,
						icon: module.icon,
					}
					if (module.badgeId) {
						mapping['badgeId'] = module.badgeId;
					}
					return mapping;
				}

				let resetMenu: any = {
					side: [],
					top: []
				}
				e.data.menus.forEach( (menu: IMenuRequest, index: number) => {
					const positionMenu: string = menu.posicion.toLowerCase() as string;
					const hasSubmenu = menu.submenu ? true : false;

					const searchedMenu = getIndexByName(resetMenu[positionMenu], menu.name);

					if (!searchedMenu.exist) {
						resetMenu[positionMenu] = [...resetMenu[positionMenu], {
							name: `menus:${menu.name}`
						}];
					}

					const indexMenu = searchedMenu.index === -1 ? resetMenu[positionMenu].length === 0 ? 0 : resetMenu[positionMenu].length - 1 : searchedMenu.index;
					
					if (hasSubmenu) {
						const searchedSubmenu = getIndexByName(resetMenu[positionMenu][indexMenu]['submenus'] ?? [], menu.submenu!.name);
						const indexSubmenu = searchedSubmenu.index === -1 ? 0 : searchedSubmenu.index;

							if (searchedSubmenu.exist) {
							const modulesArray = resetMenu[positionMenu][indexMenu]['submenus'][indexSubmenu]['modules'] ?? [];
							resetMenu[positionMenu][indexMenu]['submenus'][indexSubmenu] = {
								...resetMenu[positionMenu][indexMenu]['submenus'][indexSubmenu],
								modules: [...modulesArray, getMappingModule(menu.submenu!.moduls)]
							}
						}else{
							const submenuArray = resetMenu[positionMenu][indexMenu]['submenus'] ?? [];

							resetMenu[positionMenu][indexMenu]['submenus'] = [...submenuArray, {
								name: `menus:${menu.submenu!.name}`,
								icon: menu.submenu!.icon,
								modules: [...[], getMappingModule(menu.submenu!.moduls)]
							}]
						}
					}else{
						const modulesArray = resetMenu[positionMenu][indexMenu]['modules'] ?? [];
						resetMenu[positionMenu][indexMenu]['modules'] = [...modulesArray, getMappingModule(menu.moduls!)]
					}
				});

				localStorage.setItem('menu', JSON.stringify(resetMenu));
				
				dispatch(resetDashboard(resetMenu));
			
				dispatch(setPermissions(permissions?.data ?? []));
				dispatch(loadUserMenu(permissions?.data));

				

			})
			.catch((e: AxiosError) => {
				if (e.response) {
					dispatch(pushError('errors:auth.login', { code: e.response.status }));
					dispatch(setLoading(false));
				}
			});
	};
}



function getLogout(): ILogout {
	return {
		type: LOGOUT
	};
}

export function logout(): ThunkResult {
	return async (dispatch) => {
		dispatch(setLoading(true));
		const rs = await ax.get('auth/logout');

		//posible solucion
		//localStorage.removeItem('api-token');
        localStorage.clear();
        sessionStorage.clear();

		dispatch(getLogout());
		dispatch(resetDashboard());
		if (!rs) {
			dispatch(
				pushErrors([
					{
						error: 'errors.session.logout'
					}
				])
			);
		}
		dispatch(setLoading(false));

		// window.location.pathname = Links.BASE_PATH;

	};
}

export function pushError(error: string, params?: unknown): IPushErrors {
	return {
		type: PUSH_ERRORS,
		errors: [{ error, params }]
	};
}

export function setNotificationModule(data: INotificationModule): ISetNotificationModule {
	return {
		type: SET_NOTIFICATION_MODULE,
		notificationModule: data
	};
}

export function setBadges(badges: IBadges): ISetBadges {
	return {
		type: SET_BADGES,
		badges
	};
}