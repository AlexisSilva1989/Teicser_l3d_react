import { useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';
import { Permissions } from '../Utils/Permissions';
import { IAppState } from '../../Store/AppStore';
import { IUserPermission } from '../Utils/IUserPermission';

export type UserPermission = 'gemelo_digital' | 'information_load' | 'reports' | 'configuration' | 'masters';

export const usePermissions = () => {
	const permissions = useSelector<IAppState, IUserPermission[]>((s) => s.dashboard.user?.permissions ?? []);

	const canReadCallback = useCallback((entity: UserPermission) => {
		const p = permissions.find((x) => x.entity === entity);
		return p == null ? false : p.permission >= Permissions.Read;
	}, [permissions]);

	const canCreateCallback = useCallback((entity: UserPermission) => {
		const p = permissions.find((x) => x.entity === entity);
		return p == null ? false : p.permission >= Permissions.Create;
	}, [permissions]);

	const canUpdateCallback = useCallback((entity: UserPermission) => {
		const p = permissions.find((x) => x.entity === entity);
		return p == null ? false : p.permission >= Permissions.Update;
	}, [permissions]);

	const canDeleteCallback = useCallback((entity: UserPermission) => {
		const p = permissions.find((x) => x.entity === entity);
		return p == null ? false : p.permission >= Permissions.Delete;
	}, [permissions]);

	const hasPermissionCallback = useCallback((entity: UserPermission) => {
		return permissions.find((x) => x.entity === entity) != null;
	}, [permissions]);

	const resultMemo = useMemo(() => {
		return { 
			canRead: canReadCallback, 
			canCreate: canCreateCallback, 
			canUpdate: canUpdateCallback, 
			canDelete: canDeleteCallback, 
			hasPermission: hasPermissionCallback };
	}, [canCreateCallback, canReadCallback, canDeleteCallback, canUpdateCallback, hasPermissionCallback]);

	return resultMemo;
};
