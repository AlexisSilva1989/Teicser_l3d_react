import { IUserPermission } from './IUserPermission';
import { IModule, ISubmenu, IMenu } from '../../Store/Dashboard/IDashboardState';

const deleteUnusedMods = (modules: IModule[], permissions: IUserPermission[]) => {
	if (modules == null || permissions == null) {
		return undefined;
	}
	for (const i in modules) {
		const mod = modules[i];
		const perm = permissions.find((x) => x.entity === mod.permission);
		if (perm == null && mod.permission != null) {
			delete modules[i];
		} else {
			mod.permission_level = perm?.permission ?? 4;
			const temp = deleteUnusedMods(mod.linked ?? [], permissions);
			if (temp != null) {
				mod.linked = temp;
			}
		}
	}
	return modules.filter((x) => x != null);
};

const deleteUnusedSubmenus = (submenus: ISubmenu[], permissions: IUserPermission[]) => {
	if (submenus == null || permissions == null) {
		return undefined;
	}
	for (const submenu of submenus) {
		submenu.modules = deleteUnusedMods(submenu.modules ?? [], permissions);
	}
	return submenus.filter((sm) => sm.modules && sm.modules.length > 0);
};

const deleteUnusedMenus = (menus: IMenu[], permissions: IUserPermission[]) => {
	if (menus == null || permissions == null) {
		return undefined;
	}
	for (const menu of menus) {
		menu.submenus = deleteUnusedSubmenus(menu.submenus ?? [], permissions);
		menu.modules = deleteUnusedMods(menu.modules ?? [], permissions);
	}

	return menus.filter((m) => (m.submenus && m.submenus.length > 0) || (m.modules && m.modules.length > 0));
};

export const buildMenu = deleteUnusedMenus;
