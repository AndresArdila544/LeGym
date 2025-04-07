// src/screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { useIsFocused } from '@react-navigation/native';


export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    memberSince: '2023-09-01',
    membership: 'Monthly',
  });
  const isFocused = useIsFocused();

  useEffect(() => {
    
    const loadUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        
        if (storedUserData) {
          const parsed = JSON.parse(storedUserData);
          setUserData({
            firstName: parsed.firstName || 'John',
            lastName: parsed.lastName || 'Smith',
            email: parsed.email || 'john.smith@example.com',
            memberSince: parsed.memberSince || '2023-09-01',
            membership: parsed.membership || 'Monthly',
          });
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };
    if (isFocused) {
      loadUserData(); 
    }
  }, [isFocused]);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              // Clear user session
              await AsyncStorage.removeItem('userSession');
              // Navigate to welcome screen
              navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
              });
            } catch (error) {
              console.error('Error during logout:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View> */}
      <View style={styles.header}>
              <Text style={styles.headerTitle}>My Profile</Text>
              <View style={{ width: 24 }} />
            </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitials}>
                {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
              </Text>
            </View>
          </View>

          <Text style={styles.profileName}>{userData.firstName} {userData.lastName}</Text>
          <Text style={styles.profileEmail}>{userData.email}</Text>

          <View style={styles.membershipInfo}>
            <Text style={styles.memberSince}>Member since: {new Date(userData.memberSince).toLocaleDateString()}</Text>
            <View style={styles.membershipBadge}>
              <Text style={styles.membershipType}>{userData.membership}</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Membership')}
          >
            <Ionicons name="card-outline" size={24} color="#800000" />
            <Text style={styles.menuItemText}>Membership</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('PaymentMethod')}
          >
            <Ionicons name="wallet-outline" size={24} color="#800000" />
            <Text style={styles.menuItemText}>Payment Methods</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={24} color="#800000" />
            <Text style={styles.menuItemText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ProfileSetting')}>
            <Ionicons name="settings-outline" size={24} color="#800000" />
            <Text style={styles.menuItemText}>Update Profile</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={24} color="#800000" />
            <Text style={styles.menuItemText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.logoutItem]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#800000" />
            <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNavigationBar active="profile" navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    //borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#800000",
    //paddingLeft:16
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#800000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  membershipInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberSince: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  membershipBadge: {
    backgroundColor: '#800000',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  membershipType: {
    color: 'white',
    fontWeight: '500',
  },
  menuSection: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
  },
  logoutItem: {
    borderBottomWidth: 0,
    marginTop: 16,
  },
  logoutText: {
    color: '#800000',
  },
});
