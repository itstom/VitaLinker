// NavigationRoutes.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ResetPasswordScreen from '../screens/ResetPassword';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';
import { GuestStackParamList, HomeScreenProps, LoginScreenProps, UserStackParamList } from '../types/types';
import { createDrawerNavigator } from '@react-navigation/drawer';

const GuestStack = createStackNavigator<GuestStackParamList>();
const UserStack = createStackNavigator<UserStackParamList>();
const Drawer = createDrawerNavigator();

export const GuestNavigator = () => {
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

export const UserNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen 
        name="Home" 
        component={HomeStack} 
      />
      <Drawer.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen} 
      />
    </Drawer.Navigator>
  );
};

const HomeStack = () => {
  return (
    <UserStack.Navigator>
      <UserStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false, title: 'Home' }}
      />
      <UserStack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ headerShown: false, title: 'Dashboard' }}
      />
      <UserStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false, title: 'Settings' }}
      />
      <UserStack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ headerShown: false, title: 'Reset Password' }}
      />
    </UserStack.Navigator>
  );
};
