//redux/themeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, AppTheme } from '../design/themes';
import { DefaultTheme } from '@react-navigation/native';

export type Theme = typeof lightTheme | typeof darkTheme;

export interface ThemeState {
  current: 'light' | 'dark',
  dark: boolean;
}

// Define the initial state:
const initialState: ThemeState = {
  current: 'light',
  dark: false,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      if (action.payload === darkTheme) {
      state.current = 'dark';
      state.dark = true;
    } else {
      state.current = 'light';
      state.dark = false;
        }
      },
    toggleTheme: (state) => {
      console.log("Toggling theme");
      if (state.dark) {
        state.current = 'light';
        state.dark = false;
      } else {
        state.current = 'dark';
        state.dark = true;
      }
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;

export const persistTheme = (theme: 'light' | 'dark') => async (dispatch: any) => {
  try {
  const themeToSet = theme === 'dark' ? darkTheme : lightTheme;
  dispatch(setTheme(themeToSet));
  await AsyncStorage.setItem('theme', theme);
  } catch (error) {
  console.error("Error persisting theme", error);
  }
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
      notification: theme.colors.notification,
    }
  };
};

export { mapTheme };

export default themeSlice.reducer;