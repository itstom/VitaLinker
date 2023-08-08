// NavigationRoutes.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ResetPasswordScreen from '../screens/ResetPassword';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';
import { GuestStackParamList, UserStackParamList } from '../types/types';
import UserAreaComponent from '../components/UserAreaComponent';

const GuestStack = createStackNavigator<GuestStackParamList>();
const UserStack = createStackNavigator<UserStackParamList>();

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
    <UserStack.Navigator initialRouteName="Home">
      <UserStack.Screen 
        name="Home" 
        component={UserAreaComponent} 
        options={{ headerShown: false }}
      />
      <UserStack.Screen 
        name="Dashboard" 
        component={UserAreaComponent} 
        options={{ headerShown: false }}
      />
      <UserStack.Screen 
        name="Settings" 
        component={UserAreaComponent} 
        options={{ headerShown: false }}
      />
    </UserStack.Navigator>
  );
};