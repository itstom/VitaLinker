// App.tsx
import React, { useEffect } from 'react';
import SplashScreen from './screens/SplashScreen';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store, RootState } from './redux/store';
import { AppDispatch } from './redux/store';
import Toast from 'react-native-toast-message';
import AppContentWithTheme from './AppContentWithTheme';

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