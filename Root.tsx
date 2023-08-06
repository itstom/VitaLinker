// Root.tsx
import React from 'react';
import { Provider } from 'react-redux';
import {store} from './redux/store';
import FirebaseInitializer from './config/FirebaseInitializer'; // Import your FirebaseInitializer

const Root: React.FC = () => {
  return (
    <Provider store={store}>
      <FirebaseInitializer />
    </Provider>
  );
};

export default Root;
