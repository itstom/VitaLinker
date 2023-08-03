//redux/authSlice.tsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@firebase/auth-types';
import { ConfirmationResult } from 'firebase/auth';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  confirmationResult: ConfirmationResult | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  confirmationResult: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    loginFailed: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    saveConfirmationResult: (state, action: PayloadAction<ConfirmationResult>) => {
      state.confirmationResult = action.payload;
    },
  },
});

export const { loginSuccess, loginFailed, saveConfirmationResult } = authSlice.actions;

export default authSlice.reducer;
