// App.tsx
import React, { useEffect } from 'react';
import SplashScreen from './screens/SplashScreen';
import RootNavigator from './navigation/RootNavigator';
import DrawerNavigator from './navigation/DrawerNavigator';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store, RootState } from './redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { persistTheme, loadTheme } from './redux/themeSlice';
import { lightTheme, darkTheme, AppTheme } from './design/themes';
import { AppDispatch } from './redux/store';
import Toast from 'react-native-toast-message';  // Add this

const AppContent = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return isAuthenticated ? <DrawerNavigator /> : <RootNavigator />;
};

export default function App() {
  const [isAppFirstLaunched, setIsAppFirstLaunched] = React.useState(true);

  useEffect(() => {
    if (isAppFirstLaunched) {
      setTimeout(() => {
        setIsAppFirstLaunched(false);
      }, 3000);
    } 
  }, [isAppFirstLaunched]);

  if (isAppFirstLaunched) {
    return <SplashScreen />;
  }

  return (
    <Provider store={store}>
      <AppContentWithTheme/>
      <Toast />
    </Provider>
  );
}

// Now, we have the theme related code in a separate component, which is wrapped by the Provider
const AppContentWithTheme = () => {
  const { dark } = useSelector((state: RootState) => state.theme);
  const theme = dark ? darkTheme : lightTheme;
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadTheme());
  }, [dispatch]);

  return (
    <PaperProvider theme={theme as AppTheme}>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </PaperProvider>
  );
}