// userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/types'
import { AppThunk } from './store'
import auth from '@react-native-firebase/auth';
import { loginSuccess, SimpleUser } from './actions/authActions';

export interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isLoading: boolean;
  error: any;
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  isEmailVerified: false,
  isLoading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<any>) => {
      state.error = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logoutSuccess: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    logoutFailure: (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setEmailVerified: (state, action: PayloadAction<boolean>) => {
      state.isEmailVerified = action.payload;
    },
    setSignupSuccess: (state, action: PayloadAction<boolean>) => {
      state.isEmailVerified = action.payload;
    },
    setSignupFailure: (state, action: PayloadAction<any>) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setError, loginFailure, logoutSuccess, logoutFailure, setEmailVerified } = userSlice.actions;

export const userLogin = (email: string, password: string): AppThunk => async dispatch => {
  dispatch(setLoading(true));
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    const { email: userEmail, emailVerified, uid } = userCredential.user;
    const emailToUse = userEmail || '';
    dispatch(loginSuccess({ email: emailToUse, uid }));
  } catch (error) {
    dispatch(setError(error));
    dispatch(setLoading(false));
  }
};

export const userLogout = (): AppThunk => async dispatch => {
  try {
    await auth().signOut();
    dispatch(logoutSuccess());
  } catch (error) {
    dispatch(setError(error));
    dispatch(logoutFailure(error));
  }
};

export const userProfileUpdate = (updatedData: any): AppThunk => async dispatch => { 
  const user = auth().currentUser;
  
  if (user) {
    try {
      await user.updateProfile(updatedData);
      const updatedUser: SimpleUser = {
        uid: user.uid,
        email: user.email || '',
        // Add additional fields from `updatedData` or `user` as needed
      };
      dispatch(loginSuccess(updatedUser));
    } catch (error) {
      dispatch(setError(error));
    }
  }
};

export const userSignup = (email: string, password: string): AppThunk => async dispatch => {
  dispatch(setLoading(true));
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const {email: userEmail, uid} = userCredential.user;
    const emailToUse = userEmail || '';
    dispatch(loginSuccess({ email: emailToUse, uid }));
  } catch (error) {
    dispatch(setError(error));
    dispatch(setLoading(false));
  }
};

export default userSlice.reducer;