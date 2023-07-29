// App.tsx
import React, { useEffect, useState } from 'react';
import SplashScreen from './screens/SplashScreen';
import RootNavigator from './navigation/RootNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider, useSelector } from 'react-redux';
import {store, RootState} from './redux/store';
import AuthService from './services/AuthService';


const AppContent = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return <RootNavigator />;
};

export default function App() {
  const [isAppFirstLaunched, setIsAppFirstLaunched] = useState(true);

  useEffect(() => {
    if (isAppFirstLaunched) {
      setTimeout(() => {
        setIsAppFirstLaunched(false);
      }, 3000); // Display SplashScreen for 3 seconds
    }
  }, [isAppFirstLaunched]);

  if (isAppFirstLaunched) {
    return <SplashScreen />;
  }

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}