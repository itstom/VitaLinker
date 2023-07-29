// userSlice.ts file
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';

export interface UserState {
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  currentUser: User | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  isEmailVerified: false,
  currentUser: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logIn: (state) => {
      state.isAuthenticated = true;
    },
    logOut: (state) => {
      state.isAuthenticated = false;
    },
    setEmailVerified: (state, action: PayloadAction<boolean>) => {
      state.isEmailVerified = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = action.payload !== null;
    },
  },
});

export const { logIn, logOut, setEmailVerified, setUser } = userSlice.actions;

export default userSlice.reducer;