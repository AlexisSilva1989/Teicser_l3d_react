import {
	ISetHeaderColor,
	ISetLayoutType,
	IReset,
	IToggleRtl,
	IToggleFixedNav,
	IToggleFixedHeader,
	IToggleBoxMode,
	IToggleMenu,
	ISetFullscreen,
	INavCollapseLeave,
	INavContentLeave,
	IToggleNav,
	ISetLayout
} from './TemplateActionType';
import {
	SET_HEADER_COLOR,
	SET_LAYOUT_TYPE,
	RESET,
	TOGGLE_RTL,
	TOGGLE_FIXED_NAV,
	TOGGLE_FIXED_HEADER,
	TOGGLE_BOX_MODE,
	TOGGLE_MENU,
	NAV_COLLAPSE_LEAVE,
	NAV_CONTENT_LEAVE,
	TOGGLE_NAV,
	SET_LAYOUT,
	SET_FULLSCREEN
} from './TemplateActions';
import { ITemplateMenu } from './ITemplateState';

export function setHeaderColor(color: string): ISetHeaderColor {
	return {
		type: SET_HEADER_COLOR,
		headerBackColor: color
	};
}

export function setLayoutType(type: string): ISetLayoutType {
	return {
		type: SET_LAYOUT_TYPE,
		layoutType: type
	};
}

export function reset(): IReset {
	return {
		type: RESET
	};
}

export function toggleRtl(): IToggleRtl {
	return {
		type: TOGGLE_RTL
	};
}

export function toggleFixedNav(): IToggleFixedNav {
	return {
		type: TOGGLE_FIXED_NAV
	};
}

export function toggleFixedHeader(): IToggleFixedHeader {
	return {
		type: TOGGLE_FIXED_HEADER
	};
}

export function toggleBoxMode(): IToggleBoxMode {
	return {
		type: TOGGLE_BOX_MODE
	};
}

export function toggleMenu(menu: ITemplateMenu): IToggleMenu {
	return {
		type: TOGGLE_MENU,
		menu
	};
}

export function navCollapseLeave(menu: ITemplateMenu): INavCollapseLeave {
	return {
		type: NAV_COLLAPSE_LEAVE,
		menu
	};
}

export function navContentLeave(): INavContentLeave {
	return {
		type: NAV_CONTENT_LEAVE
	};
}

export function toggleNav(): IToggleNav {
	return {
		type: TOGGLE_NAV
	};
}

export function setLayout(layout: string): ISetLayout {
	return {
		type: SET_LAYOUT,
		layout
	};
}

export function setFullscreen(fullscreen: boolean): ISetFullscreen {
	return {
		type: SET_FULLSCREEN,
		fullscreen
	};
}
