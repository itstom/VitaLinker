//components/UserAreaComponent.tsx

import React from 'react';
import { View, Button } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

type DrawerParamList = {
  Home: undefined;
  Dashboard: undefined;
  Settings: undefined;
  ResetPassword: undefined;
};

type UserAreaComponentProps = {
  navigation: DrawerNavigationProp<DrawerParamList, 'Home'>;
};

const UserAreaComponent: React.FC<UserAreaComponentProps> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Go to Dashboard" onPress={() => navigation.navigate('Dashboard')} />
      <Button title="Go to Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
};

export default UserAreaComponent;
