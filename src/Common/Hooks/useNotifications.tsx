import { usePushError } from './usePushError';
import { useMemo } from 'react';

export const useNotifications = () => {
	const { pushError } = usePushError();

	const pushMemo = useMemo(() => {
		return { error: pushError };
	}, [pushError]);

	const resultMemo = useMemo(() => {
		return { push: pushMemo };
	}, [pushMemo]);

	return resultMemo;
};