// src/components/BottomNavigationBar.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BottomNavigationBar({ active, navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons
          name={active === 'home' ? 'home' : 'home-outline'}
          size={24}
          color={active === 'home' ? '#800000' : '#666'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('Calendar')}
      >
        <Ionicons
          name={active === 'calendar' ? 'calendar' : 'calendar-outline'}
          size={24}
          color={active === 'calendar' ? '#800000' : '#666'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('FitnessTracker')}
      >
        <Ionicons
          name={active === 'fitness' ? 'fitness' : 'fitness-outline'}
          size={24}
          color={active === 'fitness' ? '#800000' : '#666'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('Chat')}
      >
        <Ionicons
          name={active === 'chat' ? 'chatbubble' : 'chatbubble-outline'}
          size={24}
          color={active === 'chat' ? '#800000' : '#666'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <Ionicons
          name={active === 'profile' ? 'person' : 'person-outline'}
          size={24}
          color={active === 'profile' ? '#800000' : '#666'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
