//redux/reducers/authReducer.tsx
import { Reducer, AnyAction } from '@reduxjs/toolkit';
import { LOGIN_SUCCESS, LOGIN_FAILED } from '../actions/authActions';
import { User } from "@firebase/auth-types";

// Define the shape of your state
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

// Define the shape of your action objects
export interface AuthAction {
  type: string;
  payload: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

// Check whether a given AnyAction is an AuthAction
function isAuthAction(action: AnyAction): action is AuthAction {
  return 'payload' in action;
}

const authReducer: Reducer<AuthState, AnyAction> = (state = initialState, action: AnyAction) => {
  if (isAuthAction(action)) {
    switch (action.type) {
      case LOGIN_SUCCESS:
        return {
          ...state,
          isAuthenticated: true,
          user: action.payload,
        };
      case LOGIN_FAILED:
        return {
          ...state,
          isAuthenticated: false,
          user: null,
        };
      default:
        return state;
    }
  }
  return state;
};

export default authReducer;
