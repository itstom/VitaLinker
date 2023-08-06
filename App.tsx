// App.tsx
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { loadTheme } from './redux/themeSlice';
import { store, RootState, useAppDispatch, useAppSelector } from './redux/store';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import MainNavigator from './navigation/MainNavigator';
import SplashScreen from './screens/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppProps {
  isFirebaseInitialized: boolean;
}

const SPLASH_DISPLAY_INTERVAL = 1000 * 60 * 30;

const App: React.FC<AppProps> = ({ isFirebaseInitialized }) => {
  const [showSplash, setShowSplash] = useState(false);
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.current);

  useEffect(() => {
    dispatch(loadTheme());

    const displaySplash = async () => {
      const lastOpened = await AsyncStorage.getItem('lastOpenedApp');
      if (!lastOpened || (Date.now() - parseInt(lastOpened) > SPLASH_DISPLAY_INTERVAL)) {
        setShowSplash(true);
        setTimeout(() => setShowSplash(false), 3000);
      }
      await AsyncStorage.setItem('lastOpenedApp', Date.now().toString());
    };
    displaySplash();
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
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <MainNavigator /> 
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

export default App;