// HomeScreen.tsx

import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface HomeScreenProps {
  // Add props here
}

const HomeScreen: React.FC<HomeScreenProps> = (props) => {
  // Use useSelector hook here to access state from Redux store
  const theme = useSelector((state: RootState) => state.theme.current);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View>
        <Text>Welcome to the Home Screen!</Text>
        <Text>Authentication Status: {isAuthenticated ? "Logged In" : "Logged Out"}</Text>
        {isAuthenticated && <Text>Welcome, {user?.displayName}</Text>}
      </View>
    </View>
  );
}

export default HomeScreen;
