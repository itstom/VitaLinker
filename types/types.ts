// types.ts
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, ParamListBase } from '@react-navigation/native';
import { SAVE_CONFIRMATION_RESULT } from '../redux/actions/authActions';
import auth from '@react-native-firebase/auth';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

// Define the list of screens in the Root stack navigator
export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
    App: undefined;
  };

// Define the list of screens in the Auth stack navigator
export type AuthStackParamList = {
  Login: undefined; // No parameters expected
  Register: undefined; // No parameters expected
  VerifyEmail: undefined; // No parameters expected
  ResetPassword: undefined; // No parameters expected
};

// Define the list of screens in the Main stack navigator
export type MainStackParamList = {
  Home: undefined; // No parameters expected
  Dashboard: undefined; // No parameters expected
  Settings: undefined; // No parameters expected
  ResetPassword: undefined; // No parameters expected
};

export interface SaveConfirmationResultAction {
  type: typeof SAVE_CONFIRMATION_RESULT;
  payload: FirebaseAuthTypes.ConfirmationResult;
}

export type NavigationProps<ParamList extends ParamListBase, RouteName extends keyof ParamList> = {
    navigation: StackNavigationProp<ParamList, RouteName>;
    route: RouteProp<ParamList, RouteName>;
  };

// Create general types that can be used in all screens
export type AuthStackNavigationProp<T extends keyof AuthStackParamList> = StackNavigationProp<
  AuthStackParamList,
  T
>;

export type AuthStackRouteProp<T extends keyof AuthStackParamList> = RouteProp<AuthStackParamList, T>;

export type MainStackNavigationProp<T extends keyof MainStackParamList> = StackNavigationProp<
  MainStackParamList,
  T
>;

export type MainStackRouteProp<T extends keyof MainStackParamList> = RouteProp<MainStackParamList, T>;
