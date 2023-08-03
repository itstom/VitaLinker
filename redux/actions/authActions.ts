//redux\actions\authActions.ts
import { AppThunk } from '../store'
import { getAuth, sendEmailVerification, signInWithEmailAndPassword, signOut, User, sendPasswordResetEmail } from "@firebase/auth";
import { userLogin, userLogout, setLoading, setEmailVerified, phoneLoginFailure } from '../userSlice'
import { signInWithPhoneNumber } from 'firebase/auth';
import AuthService from '../../services/AuthService';
import auth from '@react-native-firebase/auth';
import { ConfirmationResult } from 'firebase/auth';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';


export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILED = 'LOGIN_FAILURE';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILED = 'LOGOUT_FAILED';
export const SET_LOADING = 'SET_LOADING';
export const SET_EMAIL_VERIFIED = 'SET_EMAIL_VERIFIED';
export const SET_SIGNUP_SUCCESS = 'SET_SIGNUP_SUCCESS';
export const SET_SIGNUP_FAILED = 'SET_SIGNUP_FAILED';
export const SET_RESET_SUCCESS = 'SET_RESET_SUCCESS';
export const SET_RESET_FAILED = 'SET_RESET_FAILED';
export const PHONE_LOGIN_REQUEST = 'PHONE_LOGIN_REQUEST';
export const PHONE_LOGIN_SUCCESS = 'PHONE_LOGIN_SUCCESS';
export const PHONE_LOGIN_FAILED = 'PHONE_LOGIN_FAILED';
export const SAVE_CONFIRMATION_RESULT = 'SAVE_CONFIRMATION_RESULT';

export const checkAuth = (): AppThunk => async (dispatch) => {
  const auth = getAuth();
  auth.onAuthStateChanged(user => {
    if (user) {
      dispatch(userLogin(user.email || '', user.uid));
      console.log('User is logged in');
    } else {
      dispatch(userLogout());
      console.log('User is logged out');
    }
  });
};

export const setCurrentUser = (user: User | null) => ({
    type: 'SET_CURRENT_USER',
    payload: user
});

export const loginSuccess = (user: SimpleUser | null) => ({
  type: LOGIN_SUCCESS,
  payload: user,
});

export const loginFailed = (error: any) => ({
  type: LOGIN_FAILED,
  payload: error,
});

export interface SimpleUser {
  uid: string;
  email: string;
  // add any other fields you may need
}

export const loginUser = (email: string, password: string): AppThunk => async (dispatch) => {
  const auth = getAuth();
  try {
    await signInWithEmailAndPassword(auth, email, password);
    dispatch(userLogin(email, password));
    console.log('User is logged in');
  } catch (error) {
    console.log(error);
    // handle error
  }
};

export const loginUserWithPhone = (phoneNumber: string): AppThunk => async (dispatch) => {
  try {
    const confirmationResult = await auth().signInWithPhoneNumber(phoneNumber);
        // Save the confirmationResult in your state, you'll need it later to confirm the code
    dispatch(saveConfirmationResult(confirmationResult));
    console.log('SMS code request sent');
  } catch (error) {
    console.log(error);
    // handle error
  }
};

  export const phoneLoginRequest = (phoneNumber: string) => ({
    type: PHONE_LOGIN_REQUEST,
    payload: phoneNumber,
  });

  export const phoneLoginSuccess = (user: SimpleUser) => ({
    type: PHONE_LOGIN_SUCCESS,
    payload: user,
  });

  export const phoneLoginFailed = (error: any) => ({
    type: PHONE_LOGIN_FAILED,
    payload: error,
  });

  export const logoutUser = (): AppThunk => async (dispatch) => {
  const auth = getAuth();
    try {
      await signOut(auth);
      dispatch(userLogout());
      console.log('User is logged out');
    } catch (error) {
      console.log(error);
      // handle error
    }
  };

  export const saveConfirmationResult = (confirmationResult: FirebaseAuthTypes.ConfirmationResult) => ({
    type: SAVE_CONFIRMATION_RESULT,
    payload: confirmationResult,
  });

  export const verifyEmail = (): AppThunk => async (dispatch) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
      if (user.emailVerified) {
        dispatch(setEmailVerified(true));
        console.log('Email is verified');
      }
    }
  };

  export const confirmSmsCode = (confirmationResult: FirebaseAuthTypes.ConfirmationResult, smsCode: string): AppThunk => async (dispatch) => {
    try {
      const userCredential = await confirmationResult.confirm(smsCode);
      if(userCredential !== null) {
        const simpleUser: SimpleUser = {
          uid: userCredential.user.uid,
          email: userCredential.user.email ?? '',
          // Add additional fields from `userCredential.user` as needed
        };
        dispatch(loginSuccess(simpleUser));
        console.log('User is logged in with phone number');
      } else {
        console.log('User credential is null');
        // handle error
      }
    } catch (error) {
      console.log(error);
      // handle error
    }
  };

  export const resetPassword = (email: string): AppThunk => async (dispatch) => {
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('Reset password email sent');
    } catch (error) {
      console.log(error);
      // handle error
    }
  };

export { setEmailVerified };