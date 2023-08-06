//screens\HomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { RootState, useAppSelector } from '../redux/store';
import { HomeScreenProps, UserStackNavigationProp } from '../types/types';
import { GuestNavigator, UserNavigator } from '../navigation/NavigationRoutes';
import { useNavigation } from '@react-navigation/native';


const HomeScreen: React.FC<HomeScreenProps> = ({ route }) => {
  const navigation = useNavigation<UserStackNavigationProp<'Home'>>();
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useAppSelector((state: RootState) => state.auth.user);
  const avg24h = useAppSelector((state: RootState) => state.sensor.avg24h);
  const avg7d = useAppSelector((state: RootState) => state.sensor.avg7d);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 28, marginBottom: 10 }}>{`Welcome, ${user ? user.displayName: "Guest"}`}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
          <Text style={{ fontSize: 20 }}>24h Average: {avg24h}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
          <Text style={{ fontSize: 20 }}>7d Average: {avg7d}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default HomeScreen;