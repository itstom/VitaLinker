// ThemeToggleButton.ts
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, ThemeState, persistTheme } from '../redux/themeSlice';
import getStyles from '../design/styles';

const ThemeToggleButton: React.FC = () => {
  const dispatch = useDispatch();
  const { dark, current } = useSelector((state: { theme: ThemeState }) => state.theme);
  
  const onToggleTheme = () => {
    dispatch(toggleTheme());
    const themeToPersist: 'light' | 'dark' = dark ? 'light' : 'dark';
    dispatch(persistTheme(themeToPersist));
  };

  const styles = getStyles(current);
  
  return (
    <TouchableOpacity onPress={onToggleTheme} style={styles.themeToggle}>
      <Text>Toggle Theme</Text>
    </TouchableOpacity>
  );
};

export default ThemeToggleButton;
