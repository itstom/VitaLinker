// RootNavigator/index.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from '../AuthNavigator';
import DrawerNavigator from '../DrawerNavigator';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import SplashScreen from '../../screens/SplashScreen';

const RootStack = createStackNavigator();

const RootNavigator: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  console.log(`isAuthenticated: ${isAuthenticated}`);
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated == null && (
        <RootStack.Screen 
          name="Splash" 
          component={SplashScreen}
          options={{ headerShown: false }} 
        />
      )}
      {isAuthenticated ? (
        <RootStack.Screen name="Drawer" component={DrawerNavigator} options={{ headerShown: false }}/>
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} options={{ headerShown: false }}/>
      )}
    </RootStack.Navigator>
  );
};

export default RootNavigator;