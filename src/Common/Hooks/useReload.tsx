import { useState, useCallback, useEffect, useMemo } from 'react';

/**
 * @param callback Gets called after doReload gets invoked
 * @param initial Initial state, true enables initial loading
 * @returns An array with the current state and a method to set the state to true, thus reloading
 */
export const useReload = (initial = true, callback?: () => void) : [boolean, () => void] => {
	const [reload, setReload] = useState(initial);

	useEffect(() => {
		if (!reload) {
			return;
		}
		if (callback != null) {
			callback();
		}
		setReload(() => false);
	}, [reload, setReload, callback]);

	const doReloadCallback = useCallback(() => setReload(() => true), [setReload]);

	const resultMemo = useMemo(() : [boolean, () => void] => {
		return [reload, doReloadCallback];
	}, [reload, doReloadCallback]);

	return resultMemo;
};
