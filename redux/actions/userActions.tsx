//actions/userActions.tsx
import { Dispatch } from 'redux';
import auth from '@react-native-firebase/auth';

// Action Types
export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';
export const USER_PROFILE_UPDATE = 'USER_PROFILE_UPDATE';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_ERROR = 'RESET_PASSWORD_ERROR';
export const USER_SIGNUP = 'USER_SIGNUP';
export const USER_SIGNUP_SUCCESS = 'USER_SIGNUP_SUCCESS';
export const USER_SIGNUP_ERROR = 'USER_SIGNUP_ERROR';

// Action Interfaces
interface UserLoginAction {
  type: typeof USER_LOGIN;
  payload: any; // Replace 'any' with the type of your user data
}

interface UserLogoutAction {
  type: typeof USER_LOGOUT;
}

interface UserProfileUpdateAction {
  type: typeof USER_PROFILE_UPDATE;
  payload: any; // Replace 'any' with the type of the updated data
}

interface ResetPasswordSuccessAction {
  type: typeof RESET_PASSWORD_SUCCESS;
  payload: any; // Replace 'any' with the type of the success message
}

interface ResetPasswordErrorAction {
  type: typeof RESET_PASSWORD_ERROR;
  payload: any; // Replace 'any' with the type of the error message
}

export type UserActionTypes = UserLoginAction | UserLogoutAction | UserProfileUpdateAction | ResetPasswordSuccessAction | ResetPasswordErrorAction;

// Action Creators
export const userLogin = (email: string, password: string) => async (dispatch: Dispatch) => { 
  dispatch(setLoading(true));
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    dispatch({ type: USER_LOGIN, payload: userCredential.user });
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error));
    dispatch(setLoading(false));
  }
};

export const userLogout = () => async (dispatch: Dispatch) => {
  try {
    await auth().signOut();
    dispatch({ type: USER_LOGOUT });
  } catch (error) {
    console.error(error);
    // handle error here or dispatch another action to handle error
  }
};

export const userProfileUpdate = (updatedData: any) => async (dispatch: Dispatch) => { 
  const user = auth().currentUser;
  
  if (user) {
    try {
      await user.updateProfile(updatedData);
      dispatch({ type: USER_PROFILE_UPDATE, payload: updatedData });
    } catch (error) {
      console.error(error);
      // handle error here or dispatch another action to handle error
    }
  }
};

export const resetPassword = (email: string) => async (dispatch: Dispatch) => {
  try {
    await auth().sendPasswordResetEmail(email);
    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: 'Reset password email sent.' });
  } catch (error: any) {
    console.error(error);
    dispatch({ type: RESET_PASSWORD_ERROR, payload: error.message });
  }
};

export const resetPasswordSuccess = (message: String) => (dispatch: Dispatch) => { // Replace 'any' with the type of the success message
  dispatch({ type: RESET_PASSWORD_SUCCESS, payload: message });
};

export const resetPasswordError = (errorMessage: String) => (dispatch: Dispatch) => { // Replace 'any' with the type of the error message
  dispatch({ type: RESET_PASSWORD_ERROR, payload: errorMessage });
};

export const setLoading = (isLoading: boolean) => ({
  type: 'SET_LOADING',
  payload: isLoading,
});

export const userSignup = (email: string, password: string) => async (dispatch: Dispatch) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    dispatch({ type: USER_SIGNUP_SUCCESS, payload: userCredential.user });
  } catch (error: any) {
    console.error(error);
    dispatch({ type: USER_SIGNUP_ERROR, payload: error.message });
  }
};

export const setError = (error: any) => ({
  type: 'SET_ERROR',
  payload: error,
});

