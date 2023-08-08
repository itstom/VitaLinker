// SettingsScreen.tsx
import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store'; // Adjust the import path based on your folder structure.
import { toggleTheme } from '../redux/themeSlice'; // Adjust the import path.

interface SettingsScreenProps {
  // Add props here if any
}

const SettingsScreen: React.FC<SettingsScreenProps> = (props) => {
  const dispatch = useDispatch();
  const isDarkTheme = useSelector((state: RootState) => state.theme.dark);

  const toggleThemeHandler = () => {
    dispatch(toggleTheme());
  };

  return (
    <View style={styles.container}>
      <Text>Settings Screen</Text>

      <View style={styles.themeToggleContainer}>
        <Text>{isDarkTheme ? 'Dark Mode' : 'Light Mode'}</Text>
        <Switch 
          value={isDarkTheme} 
          onValueChange={toggleThemeHandler}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20
  }
});

export default SettingsScreen;
