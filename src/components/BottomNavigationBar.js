// src/components/BottomNavigationBar.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const homeiconPath = '../../assets/images/Homebaricon.png';
const calendariconPath = '../../assets/images/Calendarbaricon.png';
const ChartbariconPath = '../../assets/images/Chartbaricon.png';
const ProfilebariconPath = '../../assets/images/Profilebaricon.png';


export default function BottomNavigationBar({ active, navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Image
          source={require(homeiconPath)}
          style={[
            styles.icon,
            { tintColor: active === 'home' ? '#FFFFFF' : '#666' }
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('Calendar')}
      >
        <Image
          source={require(calendariconPath)}
          style={[
            styles.icon,
            { tintColor: active === 'calendar' ? '#FFFFFF' : '#666' }
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('FitnessTracker')}
      >
        <Image
          source={require(ChartbariconPath)}
          style={[
            styles.icon,
            { tintColor: active === 'fitness' ? '#FFFFFF' : '#666' }
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('Chat')}
      >
        <Ionicons
          name={active === 'chat' ? 'chatbubble' : 'chatbubble-outline'}
          size={24}
          color={active === 'chat' ? '#FFFFFF' : '#666'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <Image
          source={require(ProfilebariconPath)}
          style={[
            styles.icon,
            { tintColor: active === 'profile' ? '#FFFFFF' : '#666' }
          ]}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#141414',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#141414' 
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    opacity: 1,
  }
});
