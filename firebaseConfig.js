import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

let auth;

const firebaseConfig = {
  apiKey: "AIzaSyB3CxqdbmPEjmbkkA5NDG0K5uQgwWv53W8",
  authDomain: "legymapp.firebaseapp.com",
  projectId: "legymapp",
  storageBucket: "legymapp.firebasestorage.app",
  messagingSenderId: "240547884047",
  appId: "1:240547884047:web:5965f3d967fed8f5d7877a"
};

const app = initializeApp(firebaseConfig);

// Platform-specific auth
if (Platform.OS === 'web') {
  auth = getAuth(app); // Web doesn't use persistence config
} else {
  // Mobile only
  import('@react-native-async-storage/async-storage').then((AsyncStorage) => {
    const { getReactNativePersistence } = require('firebase/auth');
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage.default),
    });
  });
}

export { auth, app };