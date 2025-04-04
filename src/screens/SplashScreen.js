import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import * as ExpoSplashScreen from 'expo-splash-screen';

ExpoSplashScreen.preventAutoHideAsync();

export default function SplashScreen({ navigation }) {
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    if (logoLoaded) {
      // Hide the native splash screen as soon as logo is loaded
      ExpoSplashScreen.hideAsync();

      // Then wait 5 seconds before navigating
      const timer = setTimeout(() => {
        navigation.replace('Welcome');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [logoLoaded]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/le_gym.png')}
        style={styles.logo}
        onLoad={() => setLogoLoaded(true)} // Trigger once the image loads
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 94,
    height: 33,
    resizeMode: 'contain',
  },
});
