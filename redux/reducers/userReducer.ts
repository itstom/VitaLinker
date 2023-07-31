// redux/reducers/userReducer.ts
import { User } from '@firebase/auth';

type UserState = {
    currentUser: User | null;
    isLoading: boolean;
    error: any;
};
  
type UserAction = {
    type: string;
    payload?: any;
};
  
const initialState: UserState = {
    currentUser: null,
    isLoading: false,
    error: null,
};
  
const userReducer = (state = initialState, action: UserAction): UserState => {
    switch (action.type) {
      case 'SET_CURRENT_USER':
        return {
          ...state,
          currentUser: action.payload,
        };
      case 'LOGIN_SUCCESS':
        return {
          ...state,
          currentUser: action.payload,
          isLoading: false,
          error: null,
        };
      case 'LOGIN_FAILURE':
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      case 'LOGOUT_SUCCESS':
        return {
          ...state,
          currentUser: null,
          isLoading: false,
          error: null,
        };
      case 'LOGOUT_FAILURE':
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
        case 'SET_LOADING':
        return {
          ...state,
          isLoading: action.payload,
        };
        case 'SET_ERROR':
        return {
          ...state,
          error: action.payload,
        };
      default:
        return state;
    }
};
  
export default userReducer;
