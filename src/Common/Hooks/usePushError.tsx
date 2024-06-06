import { useDispatch } from 'react-redux';
import { useCallback, useMemo } from 'react';
import { pushError } from '../../Store/Dashboard/DashboardActionCreators';

export const usePushError = () => {
	const dispatch = useDispatch();
	const pushErrorCallback = useCallback((error: string, params?: any) => {
		dispatch(pushError(error, params));
	}, [dispatch]);

	const resultMemo = useMemo(() => {
		return { pushError: pushErrorCallback };
	}, [pushErrorCallback]);

	return resultMemo;
};
