// DrawerNavigator.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useSelector, useDispatch } from 'react-redux';
import { Drawer as PaperDrawer, Switch, Divider, List } from 'react-native-paper';
import { View } from 'react-native';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import { logoutUser } from '../redux/actions/authActions';
import { User } from 'firebase/auth';
import { RootState } from '../redux/store';

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: { navigation: { navigate: (arg0: string) => void; }; }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const onLogout = () => {
    dispatch(logoutUser() as any);
  };

  return (
    <PaperDrawer.Section title="Preferences">
      <View>
        <Switch />
        <Divider />
      </View>
      {isAuthenticated && (
        <PaperDrawer.Section title="Navigation">
          <List.Item 
            title="Home" 
            onPress={() => props.navigation.navigate('Home')} 
          />
          <List.Item 
            title="Dashboard" 
            onPress={() => props.navigation.navigate('Dashboard')}
          />
          <List.Item 
            title="Settings" 
            onPress={() => props.navigation.navigate('Settings')}
          />
          <List.Item
            title="Reset Password"
            onPress={() => props.navigation.navigate('ResetPassword')}
          />
        </PaperDrawer.Section>
      )}
      {isAuthenticated && (
        <PaperDrawer.Item label="Logout" onPress={onLogout} />
      )}
    </PaperDrawer.Section>
  );
};

export default function DrawerNavigator() {
    return (
      <Drawer.Navigator
        initialRouteName="App"
        drawerContent={props => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="App" component={AppNavigator} />
      </Drawer.Navigator>
    );
  }