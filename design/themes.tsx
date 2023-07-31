//design/themes.tsx
import { MD2DarkTheme, MD2LightTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD2LightTheme,
  colors: {
    ...MD2LightTheme.colors,
    primary: "rgb(32, 95, 166)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(213, 227, 255)",
    onPrimaryContainer: "rgb(0, 28, 59)",
    secondary: "rgb(0, 104, 116)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(151, 240, 255)",
    onSecondaryContainer: "rgb(0, 31, 36)",
    surface: 'white',
    background: 'white'
  },
};

export const darkTheme = {
  ...MD2DarkTheme,
  colors: {
    ...MD2DarkTheme.colors,
    primary: "rgb(166, 200, 255)",
    onPrimary: "rgb(0, 49, 95)",
    primaryContainer: "rgb(0, 71, 135)",
    onPrimaryContainer: "rgb(213, 227, 255)",
    secondary: "rgb(79, 216, 235)",
    onSecondary: "rgb(0, 54, 61)",
    secondaryContainer: "rgb(0, 79, 88)",
    onSecondaryContainer: "rgb(151, 240, 255)",
    surface: 'black',
    background: 'black'
  },
};

// Define our custom theme type here:
export type AppTheme = typeof lightTheme | typeof darkTheme;