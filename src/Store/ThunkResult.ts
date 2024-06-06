import { ThunkAction } from 'redux-thunk';
import { IAppState, AppActionType } from './AppStore';

export type ThunkResult<T = void> = ThunkAction<T, IAppState, undefined, AppActionType>;
