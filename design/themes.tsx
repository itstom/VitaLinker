//design/themes.tsx
import { MD2DarkTheme, MD2LightTheme, configureFonts } from 'react-native-paper';
import darkLogo from '../assets/darkLogo.png';
import lightLogo from '../assets/lightLogo.png';

const fontConfig = {
  web: {
    regular: {
      fontFamily: 'acumin-pro-reg',
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
  ios: {
    regular: {
      fontFamily: 'acumin-pro-reg',
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
  android: {
    regular: {
      fontFamily: 'acumin-pro-reg',
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
  }
} as const;


export const lightTheme = {
  ...MD2LightTheme,
  fonts: configureFonts({config: fontConfig, isV3: false}),
  colors: {
    ...MD2LightTheme.colors,
    primary: "rgb(0, 141, 182)", // primary color for your interface
    onPrimary: "rgb(0, 49, 95)", // color for content on primary color
    primaryContainer: "rgb(0, 71, 135)", // lighter version of the primary color
    onPrimaryContainer: "rgb(213, 227, 255)", // color for content on the primary container
    secondary: "rgb(79, 216, 235)", // secondary color for your interface
    onSecondary: "rgb(0, 54, 61)", // color for content on secondary color
    secondaryContainer: "rgb(0, 79, 88)", // lighter version of the secondary color
    onSecondaryContainer: "rgb(151, 240, 255)", // color for content on the secondary container
    surface: 'black', // color for the surfaces of components
    background: "rgb(246, 246, 252)", // color for the background of your app
    placeholder: "rgb(0, 27, 23)", // Input fields
    text: "rgb(0, 27, 23)", // Color for Words

  
  },
  logo: lightLogo,
};

export const darkTheme = {
  ...MD2DarkTheme,
  fonts: configureFonts({config: fontConfig, isV3: false}),
  colors: {
    ...MD2DarkTheme.colors,
    primary: "rgb(0, 141, 182)", // primary color for your interface
    onPrimary: "rgb(0, 49, 95)", // color for content on primary color
    primaryContainer: "rgb(0, 71, 135)", // lighter version of the primary color
    onPrimaryContainer: "rgb(213, 227, 255)", // color for content on the primary container
    secondary: "rgb(79, 216, 235)", // secondary color for your interface
    onSecondary: "rgb(0, 54, 61)", // color for content on secondary color
    secondaryContainer: "rgb(0, 79, 88)", // lighter version of the secondary color
    onSecondaryContainer: "rgb(151, 240, 255)", // color for content on the secondary container
    surface: 'black', // color for the surfaces of components
    background: "rgb(13, 24, 33)", // color for the background of your app
    placeholder: "rgb(168, 203, 225)", // Input fields
    text: "rgb(105, 124, 141)", // Color for Words
  },
  logo: darkLogo,
};

// Define our custom theme type here:
export type AppTheme = typeof lightTheme | typeof darkTheme;