import { useLocation, useHistory, useParams } from 'react-router-dom';
import { useFullIntl } from './useFullIntl';
import { useCallback, useMemo } from 'react';
import { $j } from '../Utils/Reimports';

export const useNavigation = (localization = true) => {
	const { localize } = useFullIntl();
	const history = useHistory();
	const location = useLocation();
	const params = useParams();

	const absoluteCallback = useCallback((to: string, element?: string) => {
		return $j('/', localization ? localize('routes:' + to, element ? { element: localize(element) } : null) : to);
	}, [localization, localize]);

	const relativeCallback = useCallback((to: string, element?: string) => {
		return $j(location.pathname, localization ? localize('routes:' + to, element ? { element: localize(element) } : null) : to);
	}, [localization, localize, location.pathname]);

	const gotoRelativeCallback = useCallback((to: string, state?: any, element?: string) => history.push(relativeCallback(to, element), state), [history, relativeCallback]);
	const gotoAbsoluteCallback = useCallback((to: string, state?: any, element?: string) => history.push(absoluteCallback(to, element), state), [absoluteCallback, history]);

	const stateAsCallback = useCallback(<T extends unknown>() => (location.state as T), [location.state]);

	const goBackCallback = useCallback(() => history.goBack(), [history]);

	const getParams = useCallback(<T extends unknown>() => (params as T), [params]);

	const mayBackMemo = useMemo(() => {
		const s = stateAsCallback<{ mayBack: true }>();
		return s != null && s.mayBack;
	}, [stateAsCallback]);

	const resultMemo = useMemo(() => {
		return {
			history, 
			location, 
			mayBack: mayBackMemo, 
			stateAs: stateAsCallback, 
			goBack: goBackCallback,
			goto: {
				relative: gotoRelativeCallback,
				absolute: gotoAbsoluteCallback
			},
			getParams
		};
	}, [history, location, mayBackMemo, stateAsCallback, goBackCallback, gotoRelativeCallback, gotoAbsoluteCallback, params]);

	return resultMemo;
};
