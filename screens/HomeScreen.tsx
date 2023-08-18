//screens\HomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
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
  const user = useAppSelector((state: RootState) => state.user.currentUser);
  const avg24h = useAppSelector((state: RootState) => state.sensor.avg24h);
  const avg7d = useAppSelector((state: RootState) => state.sensor.avg7d);

  return (
    <View style={styles.container}>
      <View style={styles.greetingContainer}>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>
          {`Bienvenido, ${user?.name || user?.lastName ? `${user?.name || ''} ${user?.lastName || ''}`.trim() : "Invitado"}`}
        </Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Temperatura</Title>
          <Paragraph>promedio del día: 32°.</Paragraph>
          <Paragraph>promedio de la semana: 31.4°.</Paragraph>
          <Paragraph>promedio del mes: 31.9°</Paragraph>
        </Card.Content>
      </Card>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Frecuencia Cardíaca</Title>
          <Paragraph>promedio del día: 70 BPM.</Paragraph>
          <Paragraph>promedio de la semana: 75 BPM.</Paragraph>
          <Paragraph>promedio del mes: 78 BPM</Paragraph>
        </Card.Content>
      </Card>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Saturación de oxígeno en la sangre</Title>
          <Paragraph>promedio del día: 750.</Paragraph>
          <Paragraph>promedio de la semana: 766.</Paragraph>
          <Paragraph>promedio del mes: 724.</Paragraph>
        </Card.Content>
      </Card>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Ubicación</Title>
          <Paragraph>Ver sus últimos movimientos</Paragraph>
        </Card.Content>
      </Card>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  greetingContainer: {
    marginBottom: 20,
  },
  card: {
    marginBottom: 15,
  },
  bottomContainer: {
    marginTop: 20,
  },
});

export default HomeScreen;
