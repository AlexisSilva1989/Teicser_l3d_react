import { useLocation, useHistory, Redirect } from 'react-router-dom';
import { useFullIntl } from './useFullIntl';
import { useCallback, useMemo } from 'react';
import React from 'react';
import { $j } from '../Utils/Reimports';

export const useFullLocation = (localization = true) => {
	const { localize } = useFullIntl();
	const history = useHistory();
	const location = useLocation();

	const absoluteCallback = useCallback((path: string, element?: string) => {
		return $j('/', localization ? localize(path, element ? { element: localize(element) } : null) : path);
	}, [localization, localize]);
	const relativeCallback = useCallback((path: string, element?: string) => {
		return $j(location.pathname, localization ? localize(path, element ? { element: localize(element) } : null) : path);
	}, [localization, localize, location.pathname]);
	const pushToCallback = useCallback((path: string, state?: any, element?: string) => history.push(relativeCallback(path, element), state), [history, relativeCallback]);
	const pushAbsoluteCallback = useCallback((path: string, state?: any, element?: string) => history.push(absoluteCallback(path, element), state), [absoluteCallback, history]);
	const getStateCallback = useCallback(<T extends unknown>() => ((location.state as T) ?? {}) as Partial<T>, [location.state]);
	const getStateRedirectCallback = useCallback(<T extends unknown>(path?: string) => {
		const state = getStateCallback();
		if (state == null) {
			pushAbsoluteCallback(localize(path ?? 'routes:meta.not_found'));
		}
		return state as T;
	}, [getStateCallback, localize, pushAbsoluteCallback]);

	const mayBackMemo = useMemo(() => {
		const state = getStateCallback<{ mayBack: true }>();
		return state != null && state.mayBack;
	}, [getStateCallback]);

	const notFoundComponent = <Redirect to={absoluteCallback('routes:meta.not_found')} />;

	const resultMemo = useMemo(() => {
		return {
			history, location, mayBack: mayBackMemo, notFound: notFoundComponent, 
			relative: relativeCallback, 
			absolute: absoluteCallback, 
			pushAbsolute: pushAbsoluteCallback, 
			getState: getStateCallback, 
			getStateRedirect: getStateRedirectCallback,
			pushTo: pushToCallback
		};
	}, [history, location, mayBackMemo, notFoundComponent, relativeCallback, absoluteCallback, pushAbsoluteCallback, getStateCallback, getStateRedirectCallback, pushToCallback]);

	return resultMemo;
};
