// redux/store.ts
import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import authReducer from './authSlice';
import userReducer from './userSlice';
import themeReducer from '../redux/themeSlice';
import sensorReducer from '../redux/sensorSlice';
import notificationReducer from '../redux/notificationSlice';
import dataReducer from '../redux/dataSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    theme: themeReducer,
    sensor: sensorReducer,
    notification: notificationReducer,
    data: dataReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;