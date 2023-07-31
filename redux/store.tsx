// redux/store.ts
import { Action, configureStore, combineReducers } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk'; // Import ThunkAction from redux-thunk
import userReducer, { UserState } from './userSlice';
import authReducer, { AuthState } from './reducers/authReducer';
import themeReducer, { ThemeState } from '../redux/themeSlice';
import { useDispatch } from 'react-redux/es/hooks/useDispatch';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

export interface RootState {
  auth: AuthState;
  user: UserState;
  theme: ThemeState; // Add theme state
}

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  theme: themeReducer, // Combine themeReducer with other reducers
});

export const store = configureStore({
  reducer: rootReducer,
});