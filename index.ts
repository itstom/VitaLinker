//index.ts
/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { name as appName } from './app.json';
import Root from './Root';

// Exporting screens
export { default as HomeScreen } from './screens/HomeScreen';
export { default as LoginScreen } from './screens/LoginScreen';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  
  // Check if the notification property exists in the remoteMessage
  if (remoteMessage.notification) {
    const { title, body } = remoteMessage.notification;

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    await notifee.displayNotification({
      title: title || "Default title",
      body: body || "Default message",
      android: {
        channelId,
      },
    });
  }
});

AppRegistry.registerComponent(appName, () => Root);