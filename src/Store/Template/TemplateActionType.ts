import {
  SET_CONTENT_ONLY,
  TOGGLE_NAV,
  TOGGLE_MENU,
  SET_FULLSCREEN,
  SET_LAYOUT,
  NAV_COLLAPSE_LEAVE,
  SET_LAYOUT_TYPE,
  SET_HEADER_COLOR,
  TOGGLE_RTL,
  TOGGLE_FIXED_NAV,
  TOGGLE_FIXED_HEADER,
  TOGGLE_BOX_MODE,
  RESET,
  NAV_CONTENT_LEAVE,
} from "./TemplateActions";
import { ITemplateMenu } from "./ITemplateState";

export interface ISetContentOnly {
  type: typeof SET_CONTENT_ONLY;
  contentOnly: boolean;
}

export interface IToggleNav {
  type: typeof TOGGLE_NAV;
}

export interface IToggleMenu {
  type: typeof TOGGLE_MENU;
  menu: ITemplateMenu;
}

export interface INavContentLeave {
  type: typeof NAV_CONTENT_LEAVE;
}

export interface INavCollapseLeave {
  type: typeof NAV_COLLAPSE_LEAVE;
  menu: ITemplateMenu;
}

export interface ISetFullscreen {
  type: typeof SET_FULLSCREEN;
  fullscreen: boolean;
}

export interface ISetLayout {
  type: typeof SET_LAYOUT;
  layout: string;
}

export interface ISetLayoutType {
  type: typeof SET_LAYOUT_TYPE;
  layoutType: string;
}

export interface ISetHeaderColor {
  type: typeof SET_HEADER_COLOR;
  headerBackColor: string;
}

export interface IToggleRtl {
  type: typeof TOGGLE_RTL;
}

export interface IToggleFixedNav {
  type: typeof TOGGLE_FIXED_NAV;
}

export interface IToggleFixedHeader {
  type: typeof TOGGLE_FIXED_HEADER;
}

export interface IToggleBoxMode {
  type: typeof TOGGLE_BOX_MODE;
}

export interface IReset {
  type: typeof RESET;
}

export type TemplateActionType =
  | ISetContentOnly
  | IToggleNav
  | IToggleMenu
  | INavContentLeave
  | INavCollapseLeave
  | ISetFullscreen
  | ISetLayout
  | ISetLayoutType
  | ISetHeaderColor
  | IToggleRtl
  | IToggleFixedNav
  | IToggleFixedHeader
  | IToggleBoxMode
  | IReset;
