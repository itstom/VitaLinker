// App.tsx
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { loadTheme } from './redux/themeSlice';
import { store, useAppDispatch, useAppSelector } from './redux/store';
import { Appearance, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import SplashScreen from './screens/SplashScreen';
import { RootNavigator } from './navigation/NavigationRoutes';
import { DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { DefaultTheme as PaperDefaultTheme, MD2DarkTheme as PaperDarkTheme } from 'react-native-paper';
import { lightTheme, darkTheme } from './design/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeFirebase, setupFirebaseMessaging } from './config/firebase';
import { RNSerialport, definitions } from 'react-native-serialport';
import { setupListeners, cleanupListeners } from './components/fetchUSBData'

const CombinedDefaultTheme = {
  ...NavigationDefaultTheme,
  ...PaperDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    ...PaperDefaultTheme.colors,
    ...lightTheme.colors,
  },
};

const CombinedDarkTheme = {
  ...NavigationDarkTheme,
  ...PaperDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    ...PaperDarkTheme.colors,
    ...darkTheme.colors,
  },
};

interface AppProps {
  isFirebaseInitialized: boolean;
}

const SPLASH_DISPLAY_INTERVAL = 1000 * 60 * 30;

const App: React.FC<AppProps> = ({ isFirebaseInitialized }) => {
  const [showSplash, setShowSplash] = useState(false);
  const dispatch = useAppDispatch();
  const reduxTheme = useAppSelector((state) => state.theme.current);
  const systemThemePreference = Appearance.getColorScheme();
  const appliedThemePreference = reduxTheme || systemThemePreference || 'light';
  const appliedTheme = appliedThemePreference === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme;

  const displaySplash = async () => {
    const lastOpened = await AsyncStorage.getItem('lastOpenedApp');
    if (!lastOpened || Date.now() - parseInt(lastOpened) > SPLASH_DISPLAY_INTERVAL) {
      setShowSplash(true);
      setTimeout(() => setShowSplash(false), 4000);
    }
    await AsyncStorage.setItem('lastOpenedApp', Date.now().toString());
  };

  useEffect(() => {
    dispatch(loadTheme());
    displaySplash();

    if (isFirebaseInitialized) {
        initializeFirebase();
        setupFirebaseMessaging();

        // USB Serial port setup
        RNSerialport.connectDevice('COM6', 115200); 
        RNSerialport.setReturnedDataType(definitions.RETURNED_DATA_TYPES.HEXSTRING as any);

        // Setup Listeners
        setupListeners({
            onReadData: (data: any) => {
                // Handle the data read from the USB device here...
                // For example, parsing the data and dispatching it to the Redux store
            },
            onError: (error: any) => {
                console.error("Serial port error:", error);
                // Handle the error or inform the user
            },
            // Add other necessary callbacks here...
        });
    }

    return () => {
        RNSerialport.disconnect();
        cleanupListeners(); // cleanup the listeners when the App component is unmounted
    };
}, [isFirebaseInitialized, dispatch]);


  if (!isFirebaseInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Failed to initialize Firebase. Please check your network connection and restart the app.</Text>
      </View>
    );
  }

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Provider store={store}>
      <PaperProvider theme={appliedTheme}>
        <NavigationContainer theme={appliedTheme}>
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

export default App;