//redux\actions\authActions.ts
import { AppThunk } from '../store'
import { getAuth, sendEmailVerification, signInWithEmailAndPassword, signOut, User, sendPasswordResetEmail } from "@firebase/auth";
import { userLogin, userLogout, setLoading, setEmailVerified } from '../userSlice'

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

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export const loginSuccess = (user: SimpleUser | null) => ({
  type: LOGIN_SUCCESS,
  payload: user,
});

export const LOGIN_FAILED = 'LOGIN_FAILURE';

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
}

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