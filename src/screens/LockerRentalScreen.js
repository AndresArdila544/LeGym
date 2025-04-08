// src/screens/LockerRentalScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  Switch,
  Alert,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LockerRentalScreen({ navigation }) {
  const [location, setLocation] = useState('SGW – EV Building');
  const [duration, setDuration] = useState('Day Pass');
  const [includesPadlock, setIncludesPadlock] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');
  
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
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem('activeUser');
      if (stored) {
        setActiveUser(JSON.parse(stored));
      }
    };
    loadUser();
  }, []);
  const getLockerKey = () => `lockerReservations_${activeUser?.email}`;


  
  useEffect(() => {
    const loadReservations = async () => {
      try {
        if (!activeUser) return;
        const storedReservations = await AsyncStorage.getItem(getLockerKey());
        if (storedReservations) {
          setReservations(JSON.parse(storedReservations));
        }
      } catch (error) {
        console.error('Error loading reservations:', error);
      }
    };
    loadReservations();
  }, [activeUser]);
  
  
  const getPrice = () => {
    return includesPadlock ? 10 : 0;
  };
  
  const isLockerAlreadyReserved = (loc) => {
    return reservations.some(res => res.location === loc);
  };
  
  const handleRentLocker = async () => {
    try {
      if (!activeUser) return;
      if (isLockerAlreadyReserved(location)) {
        setError('This locker is already reserved. Please choose a different one.');
        setSummaryVisible(false);
        return;
      }
  
      const newReservation = {
        id: Date.now().toString(),
        location,
        duration,
        includesPadlock,
        price: getPrice(),
        date: new Date().toISOString(),
      };
  
      const updatedReservations = [...reservations, newReservation];
      await AsyncStorage.setItem(getLockerKey(), JSON.stringify(updatedReservations));
      setReservations(updatedReservations);
      setConfirmationVisible(true);
    } catch (error) {
      console.error('Error renting locker:', error);
      Alert.alert('Error', 'Failed to reserve locker. Please try again.');
    }
  };
  
  
  const handleCancelReservation = async (id) => {
    try {
      if (!activeUser) return;
      const updatedReservations = reservations.filter(res => res.id !== id);
      await AsyncStorage.setItem(getLockerKey(), JSON.stringify(updatedReservations));
      setReservations(updatedReservations);
    } catch (error) {
      console.error('Error canceling reservation:', error);
      Alert.alert('Error', 'Failed to cancel reservation. Please try again.');
    }
  };
  

  const renderReservationItem = ({ item }) => (
    <View style={styles.reservationCard}>
      <View style={styles.reservationRow}>
        <Text style={styles.reservationLabel}>Location:</Text>
        <Text style={styles.reservationValue}>{item.location}</Text>
      </View>
      <View style={styles.reservationRow}>
        <Text style={styles.reservationLabel}>Duration:</Text>
        <Text style={styles.reservationValue}>{item.duration}</Text>
      </View>
      <View style={styles.reservationRow}>
        <Text style={styles.reservationLabel}>Padlock:</Text>
        <Text style={styles.reservationValue}>
          {item.includesPadlock ? 'Yes (+$10)' : 'Not included'}
        </Text>
      </View>
      <View style={styles.reservationRow}>
        <Text style={styles.reservationLabel}>Total:</Text>
        <Text style={styles.reservationValue}>
          {item.price === 0 ? 'FREE' : `$${item.price}`}
        </Text>
      </View>
      <View style={styles.divider} />
      <TouchableOpacity 
        style={styles.cancelReservationButton}
        onPress={() => handleCancelReservation(item.id)}
      >
        <Text style={styles.cancelReservationButtonText}>Cancel Reservation</Text>
      </TouchableOpacity>
    </View>
  );

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
        {reservations.length > 0 && (
          <View style={styles.existingReservationContainer}>
            <Text style={styles.sectionTitle}>Your Reservations</Text>
            <FlatList
              data={reservations}
              renderItem={renderReservationItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.reservationsList}
            />
          </View>
        )}
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Location</Text>
          <View style={styles.optionsContainer}>
            {locations.map((loc, index) => {
              const isReserved = isLockerAlreadyReserved(loc);
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    location === loc && styles.selectedOption,
                    isReserved && styles.reservedOption
                  ]}
                  onPress={() => {
                    if (!isReserved) setLocation(loc);
                  }}
                  disabled={isReserved}
                >
                  <Text style={[
                    styles.optionText,
                    location === loc && styles.selectedOptionText,
                    isReserved && styles.reservedOptionText
                  ]}>
                    {loc} {isReserved && '(Reserved)'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
          onPress={() => {
            setError('');
            setSummaryVisible(true);
          }}
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
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Location:</Text>
              <Text style={styles.summaryValue}>{location}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Duration:</Text>
              <Text style={styles.summaryValue}>{duration}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Padlock:</Text>
              <Text style={styles.summaryValue}>
                {includesPadlock ? 'Yes (+$10)' : 'Not included'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
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
          <View style={styles.confirmationContent}>
            <Text style={styles.confirmationTitle}>Your booking has been confirmed!</Text>
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
                setLocation('SGW – EV Building');
                setDuration('Day Pass');
                setIncludesPadlock(false);
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
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  existingReservationContainer: {
    marginBottom: 24,
  },
  reservationsList: {
    paddingBottom: 16,
  },
  reservationCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reservationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reservationLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  reservationValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  cancelReservationButton: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#800000',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelReservationButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  optionsContainer: {
    flexDirection: 'column',
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#800000',
    borderColor: '#800000',
  },
  reservedOption: {
    backgroundColor: '#f9f9f9',
    borderColor: '#e0e0e0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: 'white',
    fontWeight: '500',
  },
  reservedOptionText: {
    color: '#999',
  },
  errorText: {
    color: '#f44336',
    marginTop: 8,
    fontSize: 14,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
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
    color: '#333',
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
  confirmationContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 16,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  confirmationText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
    color: '#666',
    lineHeight: 24,
  },
  summaryRow: {
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
    color: '#333',
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
    marginTop: 16,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});