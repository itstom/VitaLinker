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
import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

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

const SPLASH_DISPLAY_INTERVAL = 1000 * 60 * 30;

const App: React.FC<{ isFirebaseInitialized: boolean }> = ({ isFirebaseInitialized }) => {
  const [showSplash, setShowSplash] = useState(false);
  const dispatch = useAppDispatch();
  const reduxTheme = useAppSelector((state) => state.theme.current);
  const systemThemePreference = Appearance.getColorScheme();
  const appliedThemePreference = reduxTheme || systemThemePreference || 'light';
  const appliedTheme = appliedThemePreference === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme;

  useEffect(() => {
    dispatch(loadTheme());

    // Splash display logic
    const displaySplash = async () => {
      const lastOpened = await AsyncStorage.getItem('lastOpenedApp');
      if (!lastOpened || Date.now() - parseInt(lastOpened) > SPLASH_DISPLAY_INTERVAL) {
        setShowSplash(true);
        setTimeout(() => setShowSplash(false), 4000);
      }
      await AsyncStorage.setItem('lastOpenedApp', Date.now().toString());
    };
    
    displaySplash();

    if (isFirebaseInitialized) {
      initializeFirebase();
      setupFirebaseMessaging();
      
      // Handle foreground messages
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('Foreground message received', remoteMessage);

        // Check if the notification property exists in the remoteMessage
        if (remoteMessage.notification) {
          const { title, body } = remoteMessage.notification;

          const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
          });

          await notifee.displayNotification({
            title: title || "Default title",
            body: body || "Default message",
            android: {
              channelId,
            },
          });
        }
      });

      return () => {
        unsubscribe();
      };
    }
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