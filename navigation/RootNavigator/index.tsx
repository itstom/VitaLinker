// RootNavigator/index.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppNavigator from '../AppNavigator';
import AuthNavigator from '../AuthNavigator';
import SplashScreen from '../../screens/SplashScreen';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store'; // assuming this is the correct path

const RootStack = createStackNavigator();

interface RootNavigatorProps {
  isAuthenticated: boolean;
}

const RootNavigator: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  console.log(`isAuthenticated: ${isAuthenticated}`);
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated == null && (
          <RootStack.Screen 
            name="Splash" 
            component={SplashScreen}
            options={{ headerShown: false }} 
          />
        )}
        {isAuthenticated ? (
          <RootStack.Screen name="App" component={AppNavigator} options={{ headerShown: false }}/>
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} options={{ headerShown: false }}/>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;