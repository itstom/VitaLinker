// redux/store.ts
import { Action, configureStore, combineReducers } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk'; // Import ThunkAction from redux-thunk
import userReducer, { UserState } from './userSlice';
import authReducer, { AuthState } from './authSlice';
import themeReducer, { ThemeState } from '../redux/themeSlice';
import { useDispatch } from 'react-redux/es/hooks/useDispatch';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import sensorReducer from '../redux/sensorSlice';

export interface RootState {
  auth: AuthState;
  user: UserState;
  theme: ThemeState;
  sensor: any;
}

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  theme: themeReducer,
  sensor: sensorReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});