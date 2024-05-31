import { initialState, ITemplateState } from "./ITemplateState";
import { TemplateActionType } from "./TemplateActionType";
import {
  SET_CONTENT_ONLY,
  TOGGLE_NAV,
  TOGGLE_MENU,
  NAV_CONTENT_LEAVE,
  NAV_COLLAPSE_LEAVE,
  SET_FULLSCREEN,
  SET_LAYOUT,
  SET_LAYOUT_TYPE,
  SET_HEADER_COLOR,
  TOGGLE_RTL,
  TOGGLE_FIXED_NAV,
  TOGGLE_FIXED_HEADER,
  TOGGLE_BOX_MODE,
  RESET,
} from "./TemplateActions";

export function templateReducer(
  state: ITemplateState = initialState,
  action: TemplateActionType
): ITemplateState {
  let open: string[];
  let trigger: string[];
  switch (action.type) {
    case SET_CONTENT_ONLY:
      return {
        ...state,
        contentOnly: action.contentOnly,
      };
    case TOGGLE_NAV:
      return {
        ...state,
        collapseMenu: !state.collapseMenu,
      };
    case TOGGLE_MENU:
      if (action.menu.type === "sub") {
        open = state.open;
        trigger = state.trigger;

        const triggerIndex = trigger.indexOf(action.menu.id);
        if (triggerIndex > -1) {
          open = open.filter((item) => item !== action.menu.id);
          trigger = trigger.filter((item) => item !== action.menu.id);
        }

        if (triggerIndex === -1) {
          open = [...open, action.menu.id];
          trigger = [...trigger, action.menu.id];
        }
      } else {
        open = state.open;
        const triggerIndex = state.trigger.findIndex(
          (id) => id === action.menu.id
        );
        trigger = triggerIndex === -1 ? [action.menu.id] : [];
        open = triggerIndex === -1 ? [action.menu.id] : [];
      }

      return {
        ...state,
        open: open,
        trigger: trigger,
      };
    case NAV_CONTENT_LEAVE:
      return {
        ...state,
        open: [],
        trigger: [],
      };
    case NAV_COLLAPSE_LEAVE:
      if (action.menu.type === "sub") {
        open = state.open;
        trigger = state.trigger;

        const triggerIndex = trigger.indexOf(action.menu.id);
        if (triggerIndex > -1) {
          open = open.filter((item) => item !== action.menu.id);
          trigger = trigger.filter((item) => item !== action.menu.id);
        }
        return {
          ...state,
          open: open,
          trigger: trigger,
        };
      }
      return { ...state };
    case SET_FULLSCREEN:
      return {
        ...state,
        fullscreen: action.fullscreen,
      };
    case SET_LAYOUT:
      return {
        ...state,
        layout: action.layout,
      };
    case SET_LAYOUT_TYPE:
      return {
        ...state,
        layoutType: action.layoutType,
        headerColor: initialState.headerColor,
      };
    case SET_HEADER_COLOR:
      return {
        ...state,
        headerColor: action.headerBackColor,
      };
    case TOGGLE_RTL:
      return {
        ...state,
        rtl: !state.rtl,
      };
    case TOGGLE_FIXED_NAV:
      return {
        ...state,
        fixedNav: !state.fixedNav,
      };
    case TOGGLE_FIXED_HEADER:
      return {
        ...state,
        fixedHeader: !state.fixedHeader,
        headerColor:
          !state.fixedHeader && initialState.headerColor === "header-default"
            ? "header-dark"
            : state.headerColor,
      };
    case TOGGLE_BOX_MODE:
      return {
        ...state,
        boxMode: !state.boxMode,
      };
    case RESET:
      return {
        ...state,
        layout: initialState.layout,
        subLayout: initialState.subLayout,
        collapseMenu: initialState.collapseMenu,
        layoutType: initialState.layoutType,
        headerColor: initialState.headerColor,
        rtl: initialState.rtl,
        fixedNav: initialState.fixedNav,
        fixedHeader: initialState.fixedHeader,
        boxMode: initialState.boxMode,
      };
    default:
      return state;
  }
}
