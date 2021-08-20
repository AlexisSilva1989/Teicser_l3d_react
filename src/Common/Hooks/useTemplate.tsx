import { useSelector, useDispatch } from 'react-redux';
import { IAppState } from '../../Store/AppStore';
import { useCallback, useMemo } from 'react';
import { setFullscreen, toggleNav } from '../../Store/Template/TemplateActionCreators';

export const useTemplate = () => {
	const dispatch = useDispatch();

	const fullscreen = useSelector<IAppState, boolean>(state => state.template.fullscreen);
	const collapseMenu = useSelector<IAppState, boolean>(state => state.template.collapseMenu);
	const layout = useSelector<IAppState, string>(state => state.template.layout);
	const sublayout = useSelector<IAppState, string>(state => state.template.subLayout);
	const contentOnly = useSelector<IAppState, boolean>(state => state.template.contentOnly);
	const showConfiguration = useSelector<IAppState, boolean>(state => state.template.showConfiguration);

	const toggleNavCallback = useCallback(() => dispatch(toggleNav()), [dispatch]);
	const setFullscreenCallback = useCallback((fullscreen) => dispatch(setFullscreen(fullscreen)), [dispatch]);

	const result = useMemo(() => {
		return { 
			fullscreen, collapseMenu, layout, sublayout, contentOnly, showConfiguration,
			toggleNav: toggleNavCallback, setFullscreen: setFullscreenCallback 
		};
	}, [fullscreen, collapseMenu, layout, sublayout, contentOnly, showConfiguration, toggleNavCallback, setFullscreenCallback]);

	return result;
};