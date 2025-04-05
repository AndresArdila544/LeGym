// src/screens/AddCardScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddCardScreen({ navigation }) {
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [setAsDefault, setSetAsDefault] = useState(true);
  
  const handleSave = async () => {
    // Basic validation
    if (!cardHolder || !cardNumber || !expiryDate || !cvv) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }
    
    if (cardNumber.length < 16) {
      Alert.alert('Invalid Card Number', 'Please enter a valid card number');
      return;
    }
    
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      Alert.alert('Invalid Expiry Date', 'Please use MM/YY format');
      return;
    }
    
    if (cvv.length < 3) {
      Alert.alert('Invalid CVV', 'Please enter a valid CVV');
      return;
    }
    
    try {
      // Create new payment method object
      const newPaymentMethod = {
        id: Date.now().toString(),
        cardHolder,
        cardNumber,
        expiryDate,
        cvv,
        type: getCardType(cardNumber),
        isDefault: setAsDefault,
      };
      
      // Get existing payment methods
      const existingMethodsJson = await AsyncStorage.getItem('paymentMethods');
      const existingMethods = existingMethodsJson ? JSON.parse(existingMethodsJson) : [];
      
      // If this is set as default, update all other cards
      let updatedMethods = existingMethods;
      if (setAsDefault) {
        updatedMethods = existingMethods.map(method => ({
          ...method,
          isDefault: false
        }));
      }
      
      // Add new payment method
      const finalMethods = [...updatedMethods, newPaymentMethod];
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('paymentMethods', JSON.stringify(finalMethods));
      
      Alert.alert('Success', 'Payment method added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error saving payment method:', error);
      Alert.alert('Error', 'Failed to save payment method');
    }
  };
  
  // Format card number with spaces
  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const limit = 16;
    const formatted = cleaned.substring(0, limit);
    
    // Add spaces after every 4 digits
    let result = '';
    for (let i = 0; i < formatted.length; i++) {
      if (i > 0 && i % 4 === 0) {
        result += ' ';
      }
      result += formatted[i];
    }
    
    setCardNumber(result);
  };
  
  // Format expiry date
  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/[^0-9]/gi, '');
    const limit = 4;
    const formatted = cleaned.substring(0, limit);
    
    if (formatted.length > 2) {
      setExpiryDate(`${formatted.substring(0, 2)}/${formatted.substring(2)}`);
    } else {
      setExpiryDate(formatted);
    }
  };
  
  // Determine card type based on first digits
  const getCardType = (number) => {
    const firstDigit = number.charAt(0);
    const firstTwoDigits = number.substring(0, 2);
    
    if (firstDigit === '4') {
      return 'Visa';
    } else if (['51', '52', '53', '54', '55'].includes(firstTwoDigits)) {
      return 'MasterCard';
    } else if (['34', '37'].includes(firstTwoDigits)) {
      return 'American Express';
    } else {
      return 'Card';
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Payment Method</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.formGroup}>
        <Text style={styles.label}>Card Holder Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Name on card"
            value={cardHolder}
            onChangeText={setCardHolder}
            autoCapitalize="words"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Card Number</Text>
          <TextInput
            style={styles.input}
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChangeText={formatCardNumber}
            keyboardType="numeric"
            maxLength={19} // 16 digits + 3 spaces
          />
        </View>
        
        <View style={styles.formRow}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Expiry Date</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              value={expiryDate}
              onChangeText={formatExpiryDate}
              keyboardType="numeric"
              maxLength={5} // MM/YY
            />
          </View>
          
          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder="123"
              value={cvv}
              onChangeText={setCvv}
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />
          </View>
        </View>
        
        <View style={styles.checkboxContainer}>
          <TouchableOpacity 
            style={styles.checkbox}
            onPress={() => setSetAsDefault(!setAsDefault)}
          >
            <View style={[
              styles.checkboxInner,
              setAsDefault && styles.checkboxChecked
            ]}>
              {setAsDefault && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Set as default payment method</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Card</Text>
        </TouchableOpacity>
        
        <View style={styles.secureNotice}>
          <Ionicons name="lock-closed" size={16} color="#666" />
          <Text style={styles.secureText}>
            Your payment information is stored securely
          </Text>
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
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#800000',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#800000',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#800000',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secureNotice: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  secureText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
});

