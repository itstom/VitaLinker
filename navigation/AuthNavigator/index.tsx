// navigation/AuthNavigator/index.tsx
import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../../screens/LoginScreen'
import RegisterScreen from '../../screens/RegisterScreen'
import VerifyEmailScreen from '../../screens/VerifyEmailScreen'
import { AuthStackParamList } from '../../types/types';

const AuthStack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  useEffect(() => {
    console.log("Rendering AuthNavigator");
  }, []);
  
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
      <AuthStack.Screen name="ResetPassword" component={VerifyEmailScreen} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;