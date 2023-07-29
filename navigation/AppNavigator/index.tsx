// navigation/AppNavigator/index.tsx
import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../screens/HomeScreen'
import DashboardScreen from '../../screens/DashboardScreen'
import SettingsScreen from  '../../screens/SettingsScreen'

const Stack = createStackNavigator();

const AppNavigator = () => {
  useEffect(() => {
    console.log("Rendering AppNavigator");
  }, []);
  
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;