// AppContentWithTheme.tsx
import React, { useEffect } from 'react';
import RootNavigator from './navigation/RootNavigator';
import DrawerNavigator from './navigation/DrawerNavigator';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { loadTheme } from './redux/themeSlice';
import { lightTheme, darkTheme, AppTheme } from './design/themes';
import { AppDispatch } from './redux/store';

const AppContent = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return isAuthenticated ? <DrawerNavigator /> : <RootNavigator />;
};

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

export default AppContentWithTheme;