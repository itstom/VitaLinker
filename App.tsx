// App.tsx
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { loadTheme } from './redux/themeSlice';
import { store, useAppDispatch, useAppSelector } from './redux/store';
import { Appearance, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import SplashScreen from './screens/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootNavigator } from './navigation/NavigationRoutes';
import { DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { DefaultTheme as PaperDefaultTheme, MD2DarkTheme as PaperDarkTheme } from 'react-native-paper';
import { lightTheme, darkTheme } from './design/themes';
import messaging from '@react-native-firebase/messaging';
import { startDataPolling, stopDataPolling } from './components/fetchSensorData';
import notifee, { EventType } from '@notifee/react-native';

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
    // Get theme from redux state
    const reduxTheme = useAppSelector((state) => state.theme.current);
      // Detect system's theme preference
  const systemThemePreference = Appearance.getColorScheme();
  // Determine the applied theme based on Redux state, or fall back to system preference
  const appliedThemePreference = reduxTheme || systemThemePreference || 'light';
  const appliedTheme = appliedThemePreference === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme;

  useEffect(() => {
    dispatch(loadTheme());  // Load theme from storage into redux state on app start
  }, [dispatch]);
  

  const displaySplash = async () => {
    const lastOpened = await AsyncStorage.getItem('lastOpenedApp');
    if (!lastOpened || Date.now() - parseInt(lastOpened) > SPLASH_DISPLAY_INTERVAL) {
      setShowSplash(true);
      setTimeout(() => setShowSplash(false), 4000);
    }
    await AsyncStorage.setItem('lastOpenedApp', Date.now().toString());
  };

  const handleNotifeeBackgroundEvent = async (event: any) => {
    if (event.type === 'ACTION_PRESS' || event.type === 'DELIVERED') {
      console.log('Background event:', event.detail.notification);
    }
  };
  
  notifee.onBackgroundEvent(handleNotifeeBackgroundEvent);

  const initializeFirebaseListener = (): (() => void) => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage.notification) {
        const { title = 'Default Title', body = 'Default Message' } = remoteMessage.notification;
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
        });

        await notifee.displayNotification({
          title,
          body,
          android: {
            channelId,
          },
        });
      }
    });

    return unsubscribe;
  };

  useEffect(() => {
    dispatch(loadTheme());
    displaySplash();
  }, [dispatch]);

  useEffect(() => {
    let unsubscribe: () => void;
    let intervalId: NodeJS.Timeout | undefined;

    if (isFirebaseInitialized) {
      unsubscribe = initializeFirebaseListener();
      dispatch(startDataPolling(5000)).then((interval) => {
        intervalId = interval;
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
      if (intervalId) clearInterval(intervalId);
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
      <NavigationContainer theme={appliedThemePreference === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme}>
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

export default App;