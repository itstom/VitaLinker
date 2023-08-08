// types.ts
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, ParamListBase } from '@react-navigation/native';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { DrawerNavigationProp } from '@react-navigation/drawer';

export type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  isEmailVerified: boolean;
  isAnonymous: boolean;
  phoneNumber: string | null;
  photoURL: string | null;
}

export type ConfirmationResult = FirebaseAuthTypes.ConfirmationResult;

// Define the list of screens in the Auth stack navigator
export type GuestStackParamList = {
  Login: undefined;
  Register: undefined;
  VerifyEmail: undefined;
  ResetPassword: undefined;
};

export type UserStackParamList = {
  Home: undefined;
  Dashboard: undefined;
  Settings: undefined;
  ResetPassword: undefined;
};

export type LoginScreenProps = {
  navigation: StackNavigationProp<GuestStackParamList, 'Login'>;
  route: RouteProp<GuestStackParamList, 'Login'>;
};

export type RegisterScreenProps = {
  navigation: StackNavigationProp<GuestStackParamList, 'Register'>;
  route: RouteProp<GuestStackParamList, 'Register'>;
};

export type VerifyEmailScreenProps = {
  navigation: StackNavigationProp<GuestStackParamList, 'VerifyEmail'>;
  route: RouteProp<GuestStackParamList, 'VerifyEmail'>;
};

export type ResetPasswordScreenProps = {
  navigation: StackNavigationProp<GuestStackParamList, 'ResetPassword'>;
  route: RouteProp<GuestStackParamList, 'ResetPassword'>;
};

export type HomeScreenProps = {
  navigation: UserDrawerNavigationProp<'Home'>;
  route: UserDrawerRouteProp<'Home'>;
};

export type DashboardScreenProps = {
  navigation: UserDrawerNavigationProp<'Dashboard'>;
  route: UserDrawerRouteProp<'Dashboard'>;
};

export type SettingsScreenProps = {
  navigation: UserDrawerNavigationProp<'Settings'>;
  route: UserDrawerRouteProp<'Settings'>;
};

export type NavigationProps<ParamList extends ParamListBase, RouteName extends keyof ParamList> = {
    navigation: StackNavigationProp<ParamList, RouteName>;
    route: RouteProp<ParamList, RouteName>;
};

// For GuestStackParamList
export type GuestStackNavigationProp<T extends keyof GuestStackParamList> = StackNavigationProp<GuestStackParamList, T>;
export type GuestStackRouteProp<T extends keyof GuestStackParamList> = RouteProp<GuestStackParamList, T>;

// For UserStackParamList
export type UserDrawerNavigationProp<T extends keyof UserStackParamList> = DrawerNavigationProp<UserStackParamList, T>;
export type UserDrawerRouteProp<T extends keyof UserStackParamList> = RouteProp<UserStackParamList, T>;

// For UserStackParamList
export type UserStackNavigationProp<T extends keyof UserStackParamList> = StackNavigationProp<UserStackParamList, T>;
export type UserStackRouteProp<T extends keyof UserStackParamList> = RouteProp<UserStackParamList, T>;