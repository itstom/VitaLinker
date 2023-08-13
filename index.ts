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
    // Extract the notification details
    const { title, body } = remoteMessage.notification;

    // Create a channel for the notifications
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display the notification using Notifee
    await notifee.displayNotification({
      title: title || "Default title",  // Default value if title doesn't exist
      body: body || "Default message",  // Default value if body doesn't exist
      android: {
        channelId,
      },
    });
  }
});

AppRegistry.registerComponent(appName, () => Root);