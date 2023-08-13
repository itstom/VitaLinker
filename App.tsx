// App.tsx
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { loadTheme, mapTheme } from './redux/themeSlice';
import { store, useAppDispatch, useAppSelector } from './redux/store';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import SplashScreen from './screens/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootNavigator} from './navigation/NavigationRoutes';
import { DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { DefaultTheme as PaperDefaultTheme, MD2DarkTheme as PaperDarkTheme } from 'react-native-paper';
import merge from 'lodash/merge';
import { lightTheme, darkTheme } from './design/themes';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

const CombinedDefaultTheme = merge(NavigationDefaultTheme, PaperDefaultTheme, lightTheme, { mode: "adaptive" });
const CombinedDarkTheme = merge(NavigationDarkTheme, PaperDarkTheme, darkTheme, { mode: "adaptive" });

interface AppProps {
  isFirebaseInitialized: boolean;
}

const SPLASH_DISPLAY_INTERVAL = 1000 * 60 * 30;

const App: React.FC<AppProps> = ({ isFirebaseInitialized }) => {
  const [showSplash, setShowSplash] = useState(false);
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.current);
  const appliedTheme = theme === 'light' ? CombinedDefaultTheme : CombinedDarkTheme;

  useEffect(() => {
    dispatch(loadTheme());

    const displaySplash = async () => {
      const lastOpened = await AsyncStorage.getItem('lastOpenedApp');
      if (!lastOpened || (Date.now() - parseInt(lastOpened) > SPLASH_DISPLAY_INTERVAL)) {
        setShowSplash(true);
        setTimeout(() => setShowSplash(false), 4000);
      }
      await AsyncStorage.setItem('lastOpenedApp', Date.now().toString());
    };
    displaySplash();
    
        // Set up the listener for foreground FCM messages
        const unsubscribe = messaging().onMessage(async remoteMessage => {
          if (remoteMessage.notification) {
            const { title = "Default Title", body = "Default Message" } = remoteMessage.notification;

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
        }, [dispatch]);

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
        <NavigationContainer theme={theme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme}>
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

export default App;