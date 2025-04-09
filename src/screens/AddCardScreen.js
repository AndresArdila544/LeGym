import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddCardScreen({  route, navigation  }) {
  const { userInfo, selectedMembership } = route.params || {};
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [setAsDefault, setSetAsDefault] = useState(true);
  const [activeUser, setActiveUser] = useState(userInfo || null);

  useEffect(() => {
    console.log("🛠️ AddCard route params:", route?.params);
  }, []);

  useEffect(() => {
    const loadActiveUser = async () => {
      const stored = await AsyncStorage.getItem('activeUser');
      if (stored) {
        setActiveUser(JSON.parse(stored));
      }
    };
    loadActiveUser();
  }, []);

  const handleSave = async () => {
    if (!activeUser) return;

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
      const key = getStorageKey();
      const newPaymentMethod = {
        id: Date.now().toString(),
        cardHolder,
        cardNumber,
        expiryDate,
        cvv,
        type: getCardType(cardNumber),
        isDefault: setAsDefault,
      };

      const existingMethodsJson = await AsyncStorage.getItem(key);
      const existingMethods = existingMethodsJson ? JSON.parse(existingMethodsJson) : [];

      let updatedMethods = existingMethods;
      if (setAsDefault) {
        updatedMethods = existingMethods.map(method => ({
          ...method,
          isDefault: false
        }));
      }

      const finalMethods = [...updatedMethods, newPaymentMethod];

      await AsyncStorage.setItem(key, JSON.stringify(finalMethods));
      console.log(`Saving card with key:`, key)
      Alert.alert('Success', 'Payment method added successfully', [
        {
          text: 'OK',
          onPress: () => {
            if (userInfo && selectedMembership) {
              navigation.navigate('PaymentMethod', { userInfo, selectedMembership });
            } else {
              navigation.navigate('PaymentMethod');
            }
          },
        },
      ]);
    } catch (error) {
      console.error('Error saving payment method:', error);
      Alert.alert('Error', 'Failed to save payment method');
    }
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const formatted = cleaned.substring(0, 16);
    let result = '';
    for (let i = 0; i < formatted.length; i++) {
      if (i > 0 && i % 4 === 0) result += ' ';
      result += formatted[i];
    }
    setCardNumber(result);
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/[^0-9]/gi, '').substring(0, 4);
    setExpiryDate(cleaned.length > 2 ? `${cleaned.substring(0, 2)}/${cleaned.substring(2)}` : cleaned);
  };

  const getCardType = (number) => {
    const firstDigit = number.charAt(0);
    const firstTwo = number.substring(0, 2);
    if (firstDigit === '4') return 'Visa';
    if (['51', '52', '53', '54', '55'].includes(firstTwo)) return 'MasterCard';
    if (['34', '37'].includes(firstTwo)) return 'American Express';
    return 'Card';
  };
  const getStorageKey = () => {
    if (userInfo && !activeUser) {
      return `paymentMethods_pending_${userInfo.email}`;
    }
    return `paymentMethods_${activeUser.email}`;
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#912338" />
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
    color:"#912338"
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
    borderColor: '#912338',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#912338',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#912338',
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

