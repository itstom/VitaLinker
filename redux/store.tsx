//redux/store.ts
import { Action, ThunkAction, configureStore, Reducer, AnyAction } from '@reduxjs/toolkit';
import userReducer, { UserState } from './userSlice';
import authReducer, { AuthState, AuthAction } from './reducers/authReducer'

export interface RootState {
  auth: AuthState;
  user: UserState;
}

type AppAction = AnyAction;

const rootReducer: {
  auth: Reducer<AuthState, AppAction>,
  user: Reducer<UserState, AppAction>,
} = {
  auth: authReducer,
  user: userReducer,
};

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export const store = configureStore({
  reducer: rootReducer
});
