//index.js
/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import FirebaseInitializer from './config/FirebaseInitializer';

AppRegistry.registerComponent(appName, () => FirebaseInitializer);
