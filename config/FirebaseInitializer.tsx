//config/FirebaseInitializer.tsx
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { initializeFirebase } from '../config/firebase'
import App from '../App';

const FirebaseInitializer = () => {
  const [isFirebaseInitialized, setFirebaseInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      initializeFirebase();
      setFirebaseInitialized(true);
      console.log('Firebase initialization succeeded.');
    } catch (error) {
      console.log('Failed to initialize Firebase:', error);
      setInitializationError(error as Error);
    }
  }, []);

  if (!isFirebaseInitialized) {
    if (initializationError) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Failed to initialize Firebase. Please check your network connection and restart the app.</Text>
        </View>
      );
    } 
    // If not an error, it's initializing
    return null; // or a loading spinner
  }

  return <App />;
};

export default FirebaseInitializer;
