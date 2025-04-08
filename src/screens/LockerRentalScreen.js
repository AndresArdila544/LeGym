// src/screens/LockerRentalScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LockerRentalScreen({ navigation }) {
  const [location, setLocation] = useState('SGW – EV Building');
  const [duration, setDuration] = useState('Day Pass');
  const [includesPadlock, setIncludesPadlock] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);
  
  const locations = [
    'SGW – EV Building',
    'SGW – Hall Building',
    'SGW – Library Building',
    'Loyola – Athletics Complex'
  ];
  
  const durations = [
    'Day Pass',
    'Week Pass',
    'Month Pass',
    'Semester Pass'
  ];
  
  const getPrice = () => {
    // Lockers are free, only charge for padlock
    return includesPadlock ? 10 : 0;
  };
  
  const handleRentLocker = async () => {
    try {
      // Create locker rental object
      const lockerRental = {
        id: Date.now().toString(),
        location,
        duration,
        includesPadlock,
        price: getPrice(),
        date: new Date().toISOString(),
      };
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('currentLockerRental', JSON.stringify(lockerRental));
      
      // Show confirmation
      setConfirmationVisible(true);
    } catch (error) {
      console.error('Error renting locker:', error);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Locker Rental</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Location</Text>
          <View style={styles.optionsContainer}>
            {locations.map((loc, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  location === loc && styles.selectedOption
                ]}
                onPress={() => setLocation(loc)}
              >
                <Text style={[
                  styles.optionText,
                  location === loc && styles.selectedOptionText
                ]}>
                  {loc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Duration</Text>
          <View style={styles.optionsContainer}>
            {durations.map((dur, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  duration === dur && styles.selectedOption
                ]}
                onPress={() => setDuration(dur)}
              >
                <Text style={[
                  styles.optionText,
                  duration === dur && styles.selectedOptionText
                ]}>
                  {dur}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <View style={styles.switchContainer}>
            <View>
              <Text style={styles.switchLabel}>Include Padlock</Text>
              <Text style={styles.switchSubLabel}>One-time purchase for $10</Text>
            </View>
            <Switch
              value={includesPadlock}
              onValueChange={setIncludesPadlock}
              trackColor={{ false: '#767577', true: '#800000' }}
              thumbColor={includesPadlock ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total</Text>
          <Text style={styles.price}>
            {getPrice() === 0 ? 'FREE' : `$${getPrice()}`}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.rentButton}
          onPress={() => setSummaryVisible(true)}
        >
          <Text style={styles.rentButtonText}>Reserve Locker</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Summary Modal */}
      <Modal
        visible={summaryVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reservation Summary</Text>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Location:</Text>
              <Text style={styles.summaryValue}>{location}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Duration:</Text>
              <Text style={styles.summaryValue}>{duration}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Padlock:</Text>
              <Text style={styles.summaryValue}>
                {includesPadlock ? 'Yes (+$10)' : 'Not included'}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total:</Text>
              <Text style={styles.summaryValue}>
                {getPrice() === 0 ? 'FREE' : `$${getPrice()}`}
              </Text>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => setSummaryVisible(false)}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmModalButton]}
                onPress={() => {
                  setSummaryVisible(false);
                  handleRentLocker();
                }}
              >
                <Text style={styles.confirmModalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Confirmation Modal */}
      <Modal
        visible={confirmationVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Locker Reserved Successfully!</Text>
            <Text style={styles.confirmationText}>
              Your {duration.toLowerCase()} locker at {location} is confirmed.
            </Text>
            {includesPadlock && (
              <Text style={styles.confirmationText}>
                Please pick up your padlock at the front desk.
              </Text>
            )}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => {
                setConfirmationVisible(false);
                navigation.goBack();
              }}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'column',
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#800000',
    borderColor: '#800000',
  },
  optionText: {
    fontSize: 16,
  },
  selectedOptionText: {
    color: 'white',
    fontWeight: '500',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  switchSubLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  priceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#800000',
  },
  rentButton: {
    backgroundColor: '#800000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  rentButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  confirmationText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
    color: '#666',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelModalButton: {
    backgroundColor: '#f1f1f1',
  },
  confirmModalButton: {
    backgroundColor: '#800000',
  },
  cancelModalButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  confirmModalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#800000',
    alignSelf: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});