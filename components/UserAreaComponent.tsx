//components/UserAreaComponent.tsx
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserStackNavigationProp } from '../types/types';  // make sure the path is correct

const UserAreaComponent: React.FC = () => {
  const navigation = useNavigation<UserStackNavigationProp<'Home'>>();

  return (
    <View style={styles.container}>
      <Button title="Go to Dashboard" onPress={() => navigation.navigate('Dashboard')} />
      <Button title="Go to Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 50,
  },
});

export default UserAreaComponent;

