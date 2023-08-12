// ThemeToggleButton.ts
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, ThemeState, persistTheme } from '../redux/themeSlice';
import getStyles from '../design/styles';
import { darkTheme, lightTheme } from '../design/themes';  // Import the themes

// The extracted function to toggle the theme.
export const onToggleTheme = (dispatch: Function, actualTheme: typeof darkTheme | typeof lightTheme) => {
  dispatch(toggleTheme());
  // Toggle the theme based on the actual theme.
  const themeToPersist = actualTheme === darkTheme ? 'light' : 'dark';
  dispatch(persistTheme(themeToPersist));
};

const ThemeToggleButton: React.FC = () => {
  const dispatch = useDispatch();
  
  const actualTheme = useSelector((state: { theme: ThemeState }) => {
    const type = state.theme.current;
    return type === 'dark' ? darkTheme : lightTheme;
  });

  // Get styles for the actual theme.
  const styles = getStyles(actualTheme);

  return (
    <TouchableOpacity onPress={() => onToggleTheme(dispatch, actualTheme)} style={styles.themeToggle}>
      <Text>Toggle Theme</Text>
    </TouchableOpacity>
  );
};

export default ThemeToggleButton;