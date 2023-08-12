// userSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import { User } from '../types/types';

export interface UserState {
  currentUser: User | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isEmailVerified: false,
  isPhoneVerified: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    clearUser: (state) => {
      state.currentUser = null;
    },
    setEmailVerified: (state, action: PayloadAction<boolean>) => {
      state.isEmailVerified = action.payload;
    },
    setPhoneVerificationStatus: (state, action: PayloadAction<boolean>) => {
      state.isPhoneVerified = action.payload;
    },
    markEmailAsVerified: (state) => {
      state.isEmailVerified = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userProfileUpdate.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })
      .addCase(userProfileUpdate.rejected, (state, action) => {
        console.log(action.error);
      });
  },
});

export const {
  setUser,
  clearUser,
  setEmailVerified,
  setPhoneVerificationStatus,
  markEmailAsVerified
} = userSlice.actions;

export const userProfileUpdate = createAsyncThunk<User, any>(
  'user/updateProfile',
  async (updatedData, thunkAPI) => {
    const user = auth().currentUser;
    if (user) {
      await user.updateProfile(updatedData);
      return {
        uid: user.uid,
        email: user.email || null,
        displayName: user.displayName || null,
        isEmailVerified: user.emailVerified,
        isAnonymous: user.isAnonymous,
        phoneNumber: user.phoneNumber || null,
        photoURL: user.photoURL || null,
      };
    } else {
      throw new Error('No user found');
    }
  }
);

export default userSlice.reducer;