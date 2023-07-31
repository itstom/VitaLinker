// designs/ThemeContext.tsx
import React from 'react';
import { MD2LightTheme, MD2DarkTheme } from 'react-native-paper';

// Define the type of AppTheme
export type AppTheme = typeof MD2LightTheme;

interface ThemeContextProps {
  theme: AppTheme;
  toggleTheme: () => void; // function signature for toggleTheme
}

// Just defining an initial default context
const ThemeContext = React.createContext<ThemeContextProps>({
  theme: MD2LightTheme,
  toggleTheme: () => {},
});

export default ThemeContext;
