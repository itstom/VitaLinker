
// NavigationRoutes.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ResetPasswordScreen from '../screens/ResetPassword';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';
import { GuestStackParamList, UserStackParamList } from '../types/types';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { mapTheme } from '../redux/themeSlice';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../redux/store';
import { logoutUser } from '../redux/authSlice';
import { View } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import auth from '@react-native-firebase/auth';
import { createDrawerNavigator } from '@react-navigation/drawer';


type NavigationRoutesProps = {
  isAuthenticated: boolean;
};

type UserNavigatorProps = {
  isAuthenticated: boolean;
};


const UserNavigatorWrapper = () => <UserNavigator isAuthenticated={true} />;
const GuestNavigatorWrapper = () => <GuestNavigator isAuthenticated={false} />;


const GuestStack = createStackNavigator<GuestStackParamList>();
const UserDrawer = createDrawerNavigator<UserStackParamList>();
const RootStack = createStackNavigator();

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
 };
 
  return (
    <DrawerContentScrollView {...props} style={{ flex: 1 }}>
      <DrawerItemList {...props} />
      <View style={{ height: 1, backgroundColor: 'gray', marginVertical: 10 }}></View>
      <DrawerItem label="Sign Out" onPress={handleLogout} />
    </DrawerContentScrollView>
  );
}

export const GuestNavigator: React.FC<NavigationRoutesProps> = ({ isAuthenticated }) => {
  return (
    <GuestStack.Navigator initialRouteName='Login'>
      <GuestStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false, title: 'Login' }}
      />
      <GuestStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false, title: 'Register'}}
      />
      <GuestStack.Screen
        name="VerifyEmail"
        component={VerifyEmailScreen}
        options={{ headerShown: false }}
      />
      <GuestStack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ headerShown: false }}
      />
    </GuestStack.Navigator>
  );
};

export const UserNavigator: React.FC<UserNavigatorProps> = ({ isAuthenticated }) => {
  return (
    <UserDrawer.Navigator initialRouteName="Home" drawerContent={props => <CustomDrawerContent {...props} />}>
      <UserDrawer.Screen name="Home">
       {(props) => <HomeScreen {...props} />}
      </UserDrawer.Screen>
      <UserDrawer.Screen name="Dashboard" component={DashboardScreen} />
      <UserDrawer.Screen name="Settings" component={SettingsScreen} />
    </UserDrawer.Navigator>
  );
};

export const RootNavigator = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return (
    <RootStack.Navigator >
      { isAuthenticated ? (
          <RootStack.Screen name="Main" component={UserNavigatorWrapper} />
        )  : (
          <RootStack.Screen name="Guest" component={GuestNavigatorWrapper} />
        )
      }
    </RootStack.Navigator>
  );
};