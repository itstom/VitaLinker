//redux/themeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../design/themes'

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

export const persistTheme = (theme: Theme) => async (dispatch: any) => {
  dispatch(setTheme(theme));
  await AsyncStorage.setItem('theme', theme === darkTheme ? 'dark' : 'light');
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

export default themeSlice.reducer;
