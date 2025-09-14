// /**
//  * @format
//  */

// import { AppRegistry } from 'react-native';
// import App from './App';
// import { name as appName } from './app.json';

// AppRegistry.registerComponent(appName, () => App);

/**
 * @format
 */

import { AppRegistry, LogBox, Platform } from 'react-native';
import App from './beforeApp';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
// import firebase from '@react-native-firebase/app';
import firebase from '@react-native-firebase/app';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  projectId: 'isbabymama',
  apiKey: 'AIzaSyCsr-ltxKdIBTEBGsba1P2QiGLTGNlYa8s',
  appId: '1:430571800538:android:c52318cd7bea4114fe22e3',
  databaseURL: 'https://isbabymama-default-rtdb.firebaseio.com/',
  storageBucket: 'isbabymama.appspot.com',
  messagingSenderId: '430571800538',
};


// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Configure push notifications
PushNotification.configure({
  onRegister: function (token) {
    console.log('APNs Token:');
  },
  onNotification: function (notification) {
    console.log('Notification received:');

    // Required for iOS - process the notification
    if (Platform.OS === 'ios') {
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    }
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: Platform.OS === 'ios',
});

// iOS-specific: Request notification permissions
const requestUserPermission = async () => {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('iOS Notification permissions granted');
    }
    return enabled;
  }
  return true; // For iOS-only app, always true for other platforms
};

// Get FCM token
const getFCMToken = async () => {
  try {
    // ✅ Register for remote messages first (iOS only)
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      // console.log('✅ FCM Token:', fcmToken);
      await AsyncStorage.setItem('@fcmToken', fcmToken);

      // Send to your backend here
    }
    return fcmToken;
  } catch (error) {
    console.log('❌ Error getting FCM token:', error);
    return null;
  }
};

// Foreground message handler
messaging().onMessage(async remoteMessage => {
  console.log('📩 Foreground message received:');

  // Show local notification using react-native-push-notification
  PushNotification.localNotification({
    title: remoteMessage.notification?.title || 'New Message',
    message: remoteMessage.notification?.body || 'You have a new notification',
    playSound: true,
    soundName: 'default',
    importance: 'max', // Android only
    userInfo: remoteMessage.data, // Optional: attach data

    // largeIcon: largeIconPath || 'ic_launcher', // Use downloaded image or fallback
    //   bigLargeIcon: largeIconPath || 'ic_launcher',
    vibrate: true,
  });
});

// Background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📩 Background message:');
});

// Initialize notification setup
const initializeNotifications = async () => {
  try {
    const hasPermission = await requestUserPermission();
    if (hasPermission) {
      await getFCMToken();
    }
  } catch (error) {
    console.log('❌ Error initializing notifications:', error);
  }
};

// Call initialization
initializeNotifications();

LogBox.ignoreLogs(['Possible Unhandled Promise Rejection']);
AppRegistry.registerComponent(appName, () => App);
