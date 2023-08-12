//index.js
/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { name as appName } from './app.json';
import Root from './Root';

// Exporting screens
export { default as HomeScreen } from './screens/HomeScreen';
export { default as LoginScreen } from './screens/LoginScreen';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => Root);