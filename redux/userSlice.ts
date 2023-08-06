// userSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/types';
import { AppThunk } from './store';
import auth from '@react-native-firebase/auth';
import { loginUser, logoutUser, resetPassword, SimpleUser, verifyEmail } from './actions/authActions';
import { ConfirmationResult } from 'firebase/auth';

export interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isLoading: boolean;
  isPhoneVerified: boolean;
  phoneVerificationCode: string | null;
  error: any;
  phoneAuth: {
    isFetching: boolean;
    confirmationResult: ConfirmationResult | null;
    verificationStatus: 'confirmed' | 'pending' | null;
    error: any;
    isCodeSent?: boolean;
  };
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  isEmailVerified: false,
  isLoading: false,
  isPhoneVerified: false,
  phoneVerificationCode: null,
  error: null,
  phoneAuth: {
    isFetching: false,
    verificationStatus: null,
    confirmationResult: null,
    error: null,
    isCodeSent: false,
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<any>) => {
      state.error = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = action.payload.isEmailVerified || state.isPhoneVerified;
      state.isLoading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    phoneLoginRequest: (state, action: PayloadAction<string>) => {
      state.phoneAuth.isFetching = true;
      state.phoneAuth.confirmationResult = null;
      state.phoneAuth.error = null;
    },
    phoneLoginSuccess: (state, action: PayloadAction<ConfirmationResult>) => {
      state.phoneAuth.isFetching = false;
      state.phoneAuth.confirmationResult = action.payload;
      state.phoneAuth.error = null;
    },
    phoneLoginFailure: (state, action: PayloadAction<ConfirmationResult>) => {
      state.phoneAuth.isFetching = false;
      state.phoneAuth.confirmationResult = null;
      state.phoneAuth.error = action.payload;
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
    setPhoneVerificationStatus: (state, action: PayloadAction<boolean>) => {
      state.isPhoneVerified = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.currentUser = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(userLoginWithPhone.fulfilled, (state, action: PayloadAction<any>) => {
        state.phoneAuth.confirmationResult = action.payload;
        state.phoneAuth.isFetching = false;
        state.phoneAuth.error = null;
      })
      .addCase(verifyPhoneCode.fulfilled, (state, action) => {
        state.phoneAuth.isFetching = false;
        if (action.payload?.isPhoneVerified) {
          state.phoneAuth.verificationStatus = 'confirmed';
        } else {
          state.phoneAuth.verificationStatus = 'pending';
        }
        state.phoneAuth.error = null;
      })
      .addCase(verifyPhoneCode.rejected, (state, action) => {
        state.phoneAuth.isFetching = false;
        state.phoneAuth.verificationStatus = 'pending';
        state.phoneAuth.error = action.payload;
      })
  },
});

export const {
  setUser,
  clearUser,
  setLoading,
  setError,
  loginSuccess,
  loginFailure,
  phoneLoginRequest,
  phoneLoginSuccess,
  phoneLoginFailure,
  logoutSuccess,
  logoutFailure,
  setEmailVerified,
  setPhoneVerificationStatus
} = userSlice.actions;

export const userLogin = createAsyncThunk(
  'user/login',
  async (credentials: { email: string; password: string }) => {
    const userCredential = await loginUser(credentials.email, credentials.password);
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email || '',
      displayName: userCredential.user.displayName || null,
      isEmailVerified: userCredential.user.emailVerified || false,
      isAnonymous: userCredential.user.isAnonymous || false, 
      phoneNumber: userCredential.user.phoneNumber || null, 
      photoURL: userCredential.user.photoURL || null, 
    };
  }
);

export const userLoginWithPhone = createAsyncThunk(
  'user/userLoginWithPhone',
  async (phoneNumber: string, thunkAPI) => {
    try {
      const confirmationResult = await auth().signInWithPhoneNumber(phoneNumber);
      return confirmationResult;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const verifyPhoneCode = createAsyncThunk(
  'user/verifyPhoneCode',
  async (verificationCode: string, thunkAPI) => {
    // You'll need access to the confirmationResult from the previous step.
    const state: any = thunkAPI.getState();  // Type this properly for your application
    const confirmationResult = state.user.phoneAuth.confirmationResult;

    if (confirmationResult) {
      try {
        const result = await confirmationResult.confirm(verificationCode);
        if (result.user) {
          return {
            isPhoneVerified: true,
          };
        }
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
    return thunkAPI.rejectWithValue(new Error('No confirmation result found.'));
  }
);

export const userLogout = createAsyncThunk(
  'user/logout',
  async () => {
    await logoutUser();
  }
);

export const userProfileUpdate = (updatedData: any): AppThunk => async (dispatch) => {
  const user = auth().currentUser;
  if (user) {
    try {
      await user.updateProfile(updatedData);
      const updatedUser: User = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || null,
        isEmailVerified: user.emailVerified || false,
        isAnonymous: user.isAnonymous || false,
        phoneNumber: user.phoneNumber || null,
        photoURL: user.photoURL || null,
      };
      dispatch(loginSuccess(updatedUser));
    } catch (error) {
      dispatch(setError(error));
    }
  }
};

export const userSignup = (email: string, password: string): AppThunk => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const { email: userEmail, uid } = userCredential.user;
    dispatch(loginSuccess({
      email: userEmail || '', uid,
      displayName: null,
      isEmailVerified: false,
      isAnonymous: false,
      phoneNumber: null,
      photoURL: null
    }));
  } catch (error) {
    dispatch(setError(error));
    dispatch(setLoading(false));
  }
};

export const verifyUserEmail = (): AppThunk => async (dispatch) => {
  try {
    await verifyEmail();
    dispatch(setEmailVerified(true));
  } catch (error) {
    dispatch(setError(error));
  }
};

export const userPasswordReset = (email: string): AppThunk => async (dispatch) => {
  try {
    await resetPassword(email);
  } catch (error) {
    dispatch(setError(error));
  }
};

export default userSlice.reducer;
