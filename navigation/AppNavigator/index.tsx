// navigation/AppNavigator/index.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../screens/HomeScreen'
import DashboardScreen from '../../screens/DashboardScreen';

const AppStack = createStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    <AppStack.Navigator>
      <AppStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
      <AppStack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }}/>
    </AppStack.Navigator>
  );
};

export default AppNavigator;
