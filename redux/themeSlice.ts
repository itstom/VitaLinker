//redux/themeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, AppTheme } from '../design/themes';
import { DefaultTheme } from '@react-navigation/native';

export type Theme = typeof lightTheme | typeof darkTheme;

export interface ThemeState {
  current: Theme;
  dark: boolean;
}

// Define the initial state:
const initialState: ThemeState = {
  current: lightTheme,
  dark: false,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.current = action.payload;
      state.dark = action.payload === darkTheme;
    },
    toggleTheme: (state) => {
      console.log("Toggling theme");
      if (state.dark) {
        state.current = lightTheme;
        state.dark = false;
      } else {
        state.current = darkTheme;
        state.dark = true;
      }
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;

export const persistTheme = (theme: 'light' | 'dark') => async (dispatch: any) => {
  const themeToSet = theme === 'dark' ? darkTheme : lightTheme;
  dispatch(setTheme(themeToSet));
  await AsyncStorage.setItem('theme', theme);
};

export const loadTheme = () => async (dispatch: any) => {
  const storedTheme = await AsyncStorage.getItem('theme');
  if (storedTheme !== null) {
    dispatch(setTheme(storedTheme === 'dark' ? darkTheme : lightTheme));
  } else {
    // Default to light theme if no theme was stored.
    dispatch(setTheme(lightTheme));
  }
};

// Helper function to transform your PaperTheme into react-navigation's Theme
const mapTheme = (theme: AppTheme): typeof DefaultTheme => {
  return {
    ...DefaultTheme,
    dark: theme.dark,
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.placeholder,
      notification: theme.colors.onPrimary,
    }
  };
};

export { mapTheme };

export default themeSlice.reducer;