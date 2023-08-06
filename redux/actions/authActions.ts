//redux\actions\authActions.ts
import { AppThunk } from '../store';
import { userLogin, userLogout, setEmailVerified, setUser, clearUser } from '../userSlice';
import auth from '@react-native-firebase/auth';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILED = 'LOGIN_FAILURE';
export const PHONE_LOGIN_REQUEST = 'PHONE_LOGIN_REQUEST';
export const PHONE_LOGIN_SUCCESS = 'PHONE_LOGIN_SUCCESS';
export const PHONE_LOGIN_FAILED = 'PHONE_LOGIN_FAILED';
export const SAVE_CONFIRMATION_RESULT = 'SAVE_CONFIRMATION_RESULT';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAILED = 'RESET_PASSWORD_FAILED';

export interface SimpleUser {
  uid?: string;
  email?: string;
  phoneNumber?: string;
  confirmationResult?: FirebaseAuthTypes.ConfirmationResult;
}

export const checkAuth = (): AppThunk => async (dispatch) => {
  auth().onAuthStateChanged(user => {
    if (user) {
      dispatch(setUser({
        email: user.email || '', uid: user.uid,
        displayName: null,
        isEmailVerified: false,
        isAnonymous: false,
        phoneNumber: null,
        photoURL: null
      }));
      console.log('User is logged in');
    } else {
      dispatch(clearUser());
      console.log('User is logged out');
    }
  });
};

export const setCurrentUser = (user: SimpleUser) => ({
    type: 'SET_CURRENT_USER',
    payload: user
});

export const loginSuccess = (user: SimpleUser) => ({
  type: LOGIN_SUCCESS,
  payload: user,
});

export const loginFailed = (error: any) => ({
  type: LOGIN_FAILED,
  payload: error,
});

export const loginUser = (email: string, password: string) => {
  return auth().signInWithEmailAndPassword(email, password);
};

export const loginUserWithPhone = (phoneNumber: string) => {
  return auth().signInWithPhoneNumber(phoneNumber);
};

export const logoutUser = () => {
  return auth().signOut();
};

export const verifyEmail = () => {
  const user = auth().currentUser;
  return user && user.sendEmailVerification();
};

export const resetPassword = (email: string) => {
  return auth().sendPasswordResetEmail(email);
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

export const saveConfirmationResult = (confirmationResult: FirebaseAuthTypes.ConfirmationResult) => ({
    type: SAVE_CONFIRMATION_RESULT,
    payload: confirmationResult,
});

export const confirmSmsCode = (confirmationResult: FirebaseAuthTypes.ConfirmationResult, smsCode: string): AppThunk => async (dispatch) => {
    try {
      const userCredential = await confirmationResult.confirm(smsCode);
      if(userCredential !== null) {
        const simpleUser: SimpleUser = {
          uid: userCredential.user.uid,
          email: userCredential.user.email ?? '',
          phoneNumber: userCredential.user.phoneNumber ?? '',
          confirmationResult: confirmationResult,
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

export const resetPasswordSuccess = (message: string) => ({
    type: RESET_PASSWORD_SUCCESS,
    payload: message
});

export const resetPasswordFailed = (error: any) => ({
    type: RESET_PASSWORD_FAILED,
    payload: error
});