import { initialState, IDashboardState } from "./IDashboardState";
import { DashboardActionType } from "./DashboardActionType";
import {
  LOAD_USER_MENU,
  SET_LOADING,
  DISMISS_ERROR,
  LOGOUT,
  PUSH_ERRORS,
  RESET_DASHBOARD,
  LOGIN,
  CHANGE_LOCALE,
  SET_PERMISSIONS,
  DISMISS_ALL,
  SET_NOTIFICATION_MODULE,
  SET_BADGES,
} from "./DashboardActions";
import userMenus from "../../Config/Menus";
import { buildMenu } from "../../Common/Utils/NavigationUtils";
import { $u } from "../../Common/Utils/Reimports";

export function dashboardReducer(
  state: IDashboardState = initialState,
  action: DashboardActionType
): IDashboardState {
  switch (action.type) {
    case SET_PERMISSIONS:
      return $u(state, {
        user: {
          $merge: {
            permissions: action.permissions?.filter((x) => x.permission > 0),
          },
        },
      });
    case LOAD_USER_MENU:
      const lsMenu = localStorage.getItem("menu");
      const menu = lsMenu ? JSON.parse(lsMenu) : state.menus;
      const side = buildMenu(
        menu.side,
        action.permissions?.filter((x) => x.permission > 0)
      );
      const top = buildMenu(
        menu.top,
        action.permissions?.filter((x) => x.permission > 0)
      );
      return $u(state, {
        menus: { $merge: { side: side ?? [], top: top ?? [] } },
      });
    case SET_LOADING:
      return $u(state, { loading: { $set: action.loading } });
    case DISMISS_ERROR:
      return $u(state, {
        errors: { $set: state.errors.filter((e, i) => i !== action.error) },
      });
    case DISMISS_ALL:
      return $u(state, { errors: { $set: [] } });
    case LOGOUT:
      return $u(initialState, { localization: { $set: state.localization } });
    case PUSH_ERRORS:
      return $u(state, { errors: { $push: action.errors } });
    case RESET_DASHBOARD:
      if (action.menus) {
        return $u(state, { menus: { $set: action.menus } });
      }
      return $u(state, { menus: { $set: userMenus } });
    case LOGIN:
      return $u(state, {
        authenticated: { $set: true },
        user: { $set: action.user },
      });
    case CHANGE_LOCALE:
      return $u(state, { localization: { locale: { $set: action.locale } } });
    case SET_NOTIFICATION_MODULE:
      return $u(state, {
        notificationModule: {
          module: { $set: action.notificationModule.module },
          action: { $set: action.notificationModule.action },
        },
      });
    case SET_BADGES:
      return $u(state, { badges: { $set: action.badges } });
    default:
      return state;
  }
}
