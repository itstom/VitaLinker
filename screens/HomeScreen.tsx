//screens\HomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { RootState, useAppSelector } from '../redux/store';
import { UserStackParamList } from '../types/types';
import { RouteProp } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

type HomeScreenProps = {
  route: RouteProp<UserStackParamList, 'Home'>;
  navigation: DrawerNavigationProp<UserStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ route, navigation }) => {
  const actualTheme = useAppSelector((state: RootState) => state.theme.current);
  const user = useAppSelector((state: RootState) => state.auth.user);
  const avg24h = useAppSelector((state: RootState) => state.sensor.avg24h);
  const avg7d = useAppSelector((state: RootState) => state.sensor.avg7d);

  return (
    <View>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 28, marginBottom: 10 }}>{`Bienvenido, ${user ? user.displayName: "Invitado"}`}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
          <Text style={{ fontSize: 20 }}>Últimas 24 horas: {avg24h}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
          <Text style={{ fontSize: 20 }}>Esta semana: {avg7d}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default HomeScreen;
