//redux/authSlice.tsx
import { createAsyncThunk, createSlice, PayloadAction, Slice } from '@reduxjs/toolkit';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

type AuthState = {
  isAuthenticated: boolean;
  phoneConfirmationId: string | null;
  isEmailVerifying: boolean;
  phoneConfirmation: FirebaseAuthTypes.ConfirmationResult | null;
  error: string | null;
  user: SimpleUser | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  phoneConfirmationId: null,
  isEmailVerifying: false,
  phoneConfirmation: null,
  error: null,
  user: null,
};

export type SimpleUser = {
  name: string | null;
  uid: string;
  email: string | null;
  phoneNumber: string | null;
  displayName: string | null;
  lastName: string | null;
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string; }, thunkAPI) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      if (userCredential.user && !userCredential.user.emailVerified) {
        return thunkAPI.rejectWithValue('Email not verified. Please verify your email address.');
      }
      return userCredential.user ? true : thunkAPI.rejectWithValue('Authentication failed.');
    } catch (error) {
      return thunkAPI.rejectWithValue((error as any).message || 'An error occurred during login.');
    }
  }
);

export const loginWithPhone = createAsyncThunk(
  'auth/loginWithPhone',
  async ({ phoneNumber }: { phoneNumber: string; }, thunkAPI) => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      return confirmation;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as any).message || 'An error occurred during phone login.');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password, name, lastName }: { email: string; password: string; name: string; lastName: string; }, thunkAPI) => {
    try {
      const response = await auth().createUserWithEmailAndPassword(email, password);
      if (response.user) {
        await response.user.updateProfile({
          displayName: `${name} ${lastName}`
        });
        return true;
      } else {
        return thunkAPI.rejectWithValue('Registration failed.');
      }
    } catch (error) {
      return thunkAPI.rejectWithValue((error as any).message || 'An error occurred during registration.');
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (_, thunkAPI) => {
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        await currentUser.sendEmailVerification();
        return true;
      } else {
        return thunkAPI.rejectWithValue('No user is currently logged in.');
      }
    } catch (error) {
      return thunkAPI.rejectWithValue((error as any).message || 'An error occurred while sending verification email.');
    }
  }
);

export const confirmSmsCode = createAsyncThunk(
  'auth/confirmSmsCode',
  async ({ confirmationResult, smsCode }: { confirmationResult: FirebaseAuthTypes.ConfirmationResult; smsCode: string; }, thunkAPI) => {
    try {
      const userCredential = await confirmationResult.confirm(smsCode);
      
      // Check if userCredential is null or if userCredential.user is null/undefined
      if (!userCredential || !userCredential.user) {
        return thunkAPI.rejectWithValue('SMS code confirmation failed.');
      }

      // If everything is fine, return true (or userCredential.user if you need to)
      return true;
      
    } catch (error) {
      return thunkAPI.rejectWithValue((error as any).message || 'An error occurred during SMS code confirmation.');
    }
  }
);

export const logoutUser = createAsyncThunk<void, void | undefined>(
  'auth/logoutUser',
  async (_, thunkAPI) => {
    try {
      await auth().signOut();
    } catch (error) {
      return thunkAPI.rejectWithValue((error as any).message || 'An error occurred during logout.');
    }
  }
);

export const checkEmailVerification = createAsyncThunk(
  'auth/checkEmailVerification',
  async (_, thunkAPI) => {
    try {
      const currentUser = auth().currentUser;

      if (currentUser) {
        await currentUser.reload();  // This line refreshes the user object
        if (currentUser.emailVerified) {
          return true;
        } else {
          return thunkAPI.rejectWithValue('Email not yet verified.');
        }
      } else {
        return thunkAPI.rejectWithValue('No user is currently logged in.');
      }
    } catch (error) {
      return thunkAPI.rejectWithValue((error as any).message || 'An error occurred while checking email verification.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUserSuccess: (state, action: PayloadAction<SimpleUser>) => {
      state.isAuthenticated = true;
      state.error = null;
    },
    loginUserFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    resetPasswordSuccess: (state) => {
      state.isAuthenticated = true;
      state.error = null;
    },
    resetPasswordFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    forgotPasswordSuccess: (state) => {
      state.isAuthenticated = false;
      state.error = null;
    },
    forgotPasswordFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state) => {
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      .addCase(loginWithPhone.fulfilled, (state, action) => {
        state.phoneConfirmation = action.payload;
      })
      .addCase(loginWithPhone.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.isEmailVerifying = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.isEmailVerifying = true;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isEmailVerifying = false;
        state.isAuthenticated = true;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isEmailVerifying = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      .addCase(checkEmailVerification.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.isEmailVerifying = false;
      })
      .addCase(checkEmailVerification.rejected, (state, action) => {
        state.isEmailVerifying = true;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      .addCase(confirmSmsCode.fulfilled, (state) => {
        state.isAuthenticated = true;
      })
      .addCase(confirmSmsCode.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });
  }
});

export default authSlice.reducer;

export const { loginUserSuccess, loginUserFailure, resetPasswordSuccess, resetPasswordFailure } = authSlice.actions;