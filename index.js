//index.js
/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import FirebaseInitializer from './config/FirebaseInitializer';
import Root from './Root';

export { default as HomeScreen } from './screens/HomeScreen';
export { default as LoginScreen } from './screens/LoginScreen';

AppRegistry.registerComponent(appName, () => Root);
