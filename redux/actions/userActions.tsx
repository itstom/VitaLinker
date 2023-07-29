//actions/userActions.tsx
import { Dispatch } from 'redux';

// Action Types
export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';
export const USER_PROFILE_UPDATE = 'USER_PROFILE_UPDATE';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_ERROR = 'RESET_PASSWORD_ERROR';

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
export const userLogin = (userData: any) => (dispatch: Dispatch) => { // Replace 'any' with the type of your user data
  dispatch({ type: USER_LOGIN, payload: userData });
};

export const userLogout = () => (dispatch: Dispatch) => {
  dispatch({ type: USER_LOGOUT });
};

export const userProfileUpdate = (updatedData: any) => (dispatch: Dispatch) => { // Replace 'any' with the type of the updated data
  dispatch({ type: USER_PROFILE_UPDATE, payload: updatedData });
};

export const resetPasswordSuccess = (message: String) => (dispatch: Dispatch) => { // Replace 'any' with the type of the success message
  dispatch({ type: RESET_PASSWORD_SUCCESS, payload: message });
};

export const resetPasswordError = (errorMessage: String) => (dispatch: Dispatch) => { // Replace 'any' with the type of the error message
  dispatch({ type: RESET_PASSWORD_ERROR, payload: errorMessage });
};