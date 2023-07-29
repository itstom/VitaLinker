// redux/reducers/userReducer.ts
import { User } from '@firebase/auth';

type UserState = {
    currentUser: User | null;
};
  
type UserAction = {
    type: string;
    payload?: any;
};
  
const initialState: UserState = {
    currentUser: null,
};
  
const userReducer = (state = initialState, action: UserAction): UserState => {
    switch (action.type) {
      case 'SET_CURRENT_USER':
        return {
          ...state,
          currentUser: action.payload,
        };
      default:
        return state;
    }
};
  
export default userReducer;
