//design/themes.tsx
import { MD2DarkTheme, MD2LightTheme, configureFonts } from 'react-native-paper';
import darkLogo from '../assets/darkLogo.png';
import lightLogo from '../assets/lightLogo.png';
import { Fonts } from 'react-native-paper/lib/typescript/types';
import { DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';

export type ThemeColors = {
  primary: string;
  secondary: string;
  surface: string;
  background: string;
  placeholder: string;
  text: string;
  error: string;
  disabled: string;
  backdrop: string;
  notification: string;
  tooltip: string;
  onSurface: string; 
};

export type ThemeType = {
  fonts: Fonts;
  colors: ThemeColors;
  dark: boolean;
  logo: typeof darkLogo | typeof lightLogo;
  isV3: boolean;
  mode: 'adaptive';
  version: 2;
};

export const fontConfig = {
  default: {
    regular: {
      fontFamily: 'acumin-pro-regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'acumin-pro-medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'acumin-pro-light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'acumin-pro-thin',
      fontWeight: 'normal',
    },
  },
} as const;

export const lightTheme: ThemeType = {
  ...MD2LightTheme,
  ...NavigationDefaultTheme,
  mode: 'adaptive',
  version: 2,
  colors: {
    ...MD2LightTheme.colors,
    primary: "rgb(0, 141, 182)", // primary color for your interface
    secondary: "rgb(0, 141, 182)", // secondary color for your interface
    surface: "rgb(255, 255, 255)", // color for the surfaces of components
    background: "rgb(246, 246, 252)", // color for the background of your app
    placeholder: "rgb(120, 120, 120)", // Input fields
    text: "rgb(0, 0, 0)", // Color for Words
    error: "rgb(214, 0, 0)", // Color for errors
    disabled: "rgb(170, 170, 170)", // Color for disabled elements
    backdrop: "rgb(245, 245, 245)", // Color for backdrops of various components such as modals
    notification: "rgb(0, 122, 255)", // Color for notifications
    tooltip: "rgb(33, 33, 33)", // Color for tooltips
    onSurface: "rgb(0, 0, 0)", // Color for content on surfaces
  },
  logo: lightLogo,
  isV3: false,
  fonts: configureFonts({config: fontConfig, isV3: false}) as Fonts,
};

export const darkTheme: ThemeType = {
  ...MD2DarkTheme,
  ...NavigationDarkTheme,
  mode: 'adaptive',
  version: 2,
  colors: {
    ...MD2DarkTheme.colors,
    primary: "rgb(0, 141, 182)", // primary color for your interface
    secondary: "rgb(0, 141, 182)", // secondary color for your interface
    surface: "rgb(18, 18, 18)", // color for the surfaces of components
    background: "rgb(13, 24, 33)", // color for the background of your app
    placeholder: "rgb(120, 120, 120)", // Input fields
    text: "rgb(255, 255, 255)", // Color for Words
    error: "rgb(255, 61, 61)", // Color for errors
    disabled: "rgb(120, 120, 120)", // Color for disabled elements
    backdrop: "rgb(51, 51, 51)", // Color for backdrops of various components such as modals
    notification: "rgb(0, 174, 255)", // Color for notifications
    tooltip: "rgb(255, 255, 255)", // Color for tooltips
    onSurface: "rgb(255, 255, 255)", // Color for content on surfaces
  },
  logo: darkLogo,
  isV3: false,
  fonts: configureFonts({config: fontConfig, isV3: false}) as Fonts,
};

// Define our custom theme type here:
export type AppTheme = ThemeType;