//config/FirebaseInitializer.tsx
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { initializeFirebase } from './firebase'
import App from '../App';
import { ActivityIndicator } from 'react-native-paper';

const FirebaseInitializer = () => {
  const [isFirebaseInitialized, setFirebaseInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<Error | null>(null);

  useEffect(() => {
    initializeFirebase()
      .then(() => {
        setFirebaseInitialized(true);
        console.log('Firebase initialization succeeded.');
      })
      .catch((error) => {
        console.log('Failed to initialize Firebase:', error);
        setInitializationError(error);
      });
  }, []);

  if (!isFirebaseInitialized) {
    if (initializationError) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Failed to initialize Firebase. Please check your network connection and restart the app.</Text>
        </View>
      );
    } 
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator animating={true} size='large' />
      </View>
    );
  }

  return <App />;
};

export default FirebaseInitializer;
