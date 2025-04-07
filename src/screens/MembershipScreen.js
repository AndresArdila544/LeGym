
// src/screens/MembershipScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MembershipScreen({ navigation }) {
  const [currentMembership, setCurrentMembership] = useState('Monthly');
  const [renewalDate, setRenewalDate] = useState(new Date());
  
  useEffect(() => {
    const loadMembershipData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        console.log(userData);
        
        if (userData) {
          const parsedData = JSON.parse(userData);
          setCurrentMembership(parsedData.membership || 'Monthly');
          
          // Calculate renewal date based on membership type
          const startDate = new Date(parsedData.memberSince);
          const newRenewalDate = new Date(startDate);
          
          switch (parsedData.membership) {
            case 'Monthly':
              newRenewalDate.setMonth(newRenewalDate.getMonth() + 1);
              break;
            case 'Annual':
              newRenewalDate.setFullYear(newRenewalDate.getFullYear() + 1);
              break;
            case 'Weekly':
              newRenewalDate.setMonth(newRenewalDate.getDay() + 7);
              break;
            default:
              newRenewalDate.setMonth(newRenewalDate.getMonth() + 1);
          }
          
          setRenewalDate(newRenewalDate);
        }
      } catch (error) {
        console.error('Failed to load membership data:', error);
      }
    };
    
    loadMembershipData();
  }, []);
  
  const handleChangeMembership = async (newMembership) => {
    try {
      // Get current user data
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        
        // Update membership
        parsedData.membership = newMembership;
        
        // Save updated user data
        await AsyncStorage.setItem('userData', JSON.stringify(parsedData));
        
        // Update state
        setCurrentMembership(newMembership);
        
        // Update renewal date
        const startDate = new Date();
        const newRenewalDate = new Date(startDate);
        
        switch (newMembership) {
          case 'Monthly':
            newRenewalDate.setMonth(newRenewalDate.getMonth() + 1);
            break;
          case 'Annual':
            newRenewalDate.setFullYear(newRenewalDate.getFullYear() + 1);
            break;
          case 'Weekly':
            newRenewalDate.setMonth(newRenewalDate.getDay() + 7); // Semester
            break;
          default:
            newRenewalDate.setMonth(newRenewalDate.getMonth() + 1);
        }
        
        setRenewalDate(newRenewalDate);
      }
    } catch (error) {
      console.error('Failed to update membership:', error);
    }
  };
  
  const getMembershipPrice = (type) => {
    switch (type) {
      case 'Monthly':
        return '$50/month';
      case 'Annual':
        return '$275/year';
      case 'Weekly':
        return '$35/month';
      default:
        return '$50/month';
    }
  };
  
  const getMembershipDescription = (type) => {
    switch (type) {
      case 'Monthly':
        return 'Full access to all gym facilities and classes. Pay Monthly, cancel anytime.';
      case 'Annual':
        return 'Full access to all gym facilities and classes. Pay for a full year.';
      case 'Weekly':
        return 'Full access to all gym facilities and classes. Pay Weekly, cancel anytime. ';
      default:
        return 'Full access to all gym facilities and classes.';
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Membership</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.currentMembershipContainer}>
          <Text style={styles.sectionTitle}>Current Membership</Text>
          <View style={styles.membershipCard}>
            <View style={styles.membershipHeader}>
              <Text style={styles.membershipType}>{currentMembership}</Text>
              <Text style={styles.membershipPrice}>{getMembershipPrice(currentMembership)}</Text>
            </View>
            <Text style={styles.membershipDescription}>
              {getMembershipDescription(currentMembership)}
            </Text>
            <Text style={styles.renewalDate}>
              Renews on: {renewalDate.toLocaleDateString()}
            </Text>
          </View>
        </View>
        
        <View style={styles.changeMembershipContainer}>
          <Text style={styles.sectionTitle}>Change Membership</Text>
          
          <TouchableOpacity 
            style={[
              styles.membershipOption,
              currentMembership === 'Monthly' && styles.selectedOption
            ]}
            onPress={() => handleChangeMembership('Monthly')}
          >
            <View style={styles.optionHeader}>
              <Text style={styles.optionType}>Monthly</Text>
              <Text style={styles.optionPrice}>$49.99/month</Text>
            </View>
            <Text style={styles.optionDescription}>
              Full access to all gym facilities and classes. Cancel anytime.
            </Text>
            {currentMembership === 'Monthly' && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Current</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.membershipOption,
              currentMembership === 'Annual' && styles.selectedOption
            ]}
            onPress={() => handleChangeMembership('Annual')}
          >
            <View style={styles.optionHeader}>
              <Text style={styles.optionType}>Annual</Text>
              <Text style={styles.optionPrice}>$499.99/year</Text>
            </View>
            <Text style={styles.optionDescription}>
              Full access to all gym facilities and classes. Save 15% compared to monthly.
            </Text>
            {currentMembership === 'Annual' && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Current</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.membershipOption,
              currentMembership === 'Weekly' && styles.selectedOption
            ]}
            onPress={() => handleChangeMembership('Weekly')}
          >
            <View style={styles.optionHeader}>
              <Text style={styles.optionType}>Student</Text>
              <Text style={styles.optionPrice}>$29.99/month</Text>
            </View>
            <Text style={styles.optionDescription}>
              Full access to all gym facilities and classes. Valid student ID required.
            </Text>
            {currentMembership === 'Student' && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Current</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  currentMembershipContainer: {
    marginBottom: 32,
  },
  membershipCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
  },
  membershipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  membershipType: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  membershipPrice: {
    fontSize: 18,
    fontWeight: '500',
    color: '#800000',
  },
  membershipDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  renewalDate: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  changeMembershipContainer: {
    marginBottom: 32,
  },
  membershipOption: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: '#800000',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionType: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#800000',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
  currentBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#800000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  currentBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
