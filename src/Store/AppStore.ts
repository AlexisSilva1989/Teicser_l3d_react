import { IDashboardState } from './Dashboard/IDashboardState';
import { ITemplateState } from './Template/ITemplateState';
import { DashboardActionType } from './Dashboard/DashboardActionType';
import { TemplateActionType } from './Template/TemplateActionType';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { dashboardReducer } from './Dashboard/DashboardReducer';
import { templateReducer } from './Template/TemplateReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk, { ThunkMiddleware } from 'redux-thunk';

export interface IAppState {
	dashboard: IDashboardState;
	template: ITemplateState;
}

export type AppActionType = DashboardActionType | TemplateActionType;

const AppReducer = combineReducers<IAppState>({
	dashboard: dashboardReducer,
	template: templateReducer
});

export const AppStore = createStore(AppReducer, composeWithDevTools(applyMiddleware(thunk as ThunkMiddleware<IAppState, AppActionType>)));
