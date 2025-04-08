import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  SafeAreaView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PaymentMethodScreen({ navigation }) {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [defaultMethod, setDefaultMethod] = useState(null);
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem('activeUser');
      if (stored) {
        const parsed = JSON.parse(stored);
        setActiveUser(parsed);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const loadPaymentMethods = async () => {
      if (!activeUser) return;
      const key = `paymentMethods_${activeUser.email}`;
      try {
        const storedMethods = await AsyncStorage.getItem(key);
        if (storedMethods) {
          const parsedMethods = JSON.parse(storedMethods);
          setPaymentMethods(parsedMethods);

          const defaultCard = parsedMethods.find(m => m.isDefault);
          setDefaultMethod(defaultCard ? defaultCard.id : parsedMethods[0]?.id);
        }
      } catch (error) {
        console.error('Failed to load payment methods:', error);
      }
    };

    loadPaymentMethods();
  }, [activeUser]);

  const getStorageKey = () => `paymentMethods_${activeUser?.email}`;

  const handleSetDefault = async (id) => {
    try {
      const updatedMethods = paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id,
      }));
      setPaymentMethods(updatedMethods);
      setDefaultMethod(id);

      await AsyncStorage.setItem(getStorageKey(), JSON.stringify(updatedMethods));
    } catch (error) {
      console.error('Failed to set default payment method:', error);
    }
  };

  const handleDeleteMethod = (id) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: async () => {
            try {
              const updatedMethods = paymentMethods.filter(method => method.id !== id);
              if (id === defaultMethod && updatedMethods.length > 0) {
                updatedMethods[0].isDefault = true;
                setDefaultMethod(updatedMethods[0].id);
              }
              setPaymentMethods(updatedMethods);
              await AsyncStorage.setItem(getStorageKey(), JSON.stringify(updatedMethods));
            } catch (error) {
              console.error('Failed to delete payment method:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const maskCardNumber = (number) => `•••• •••• •••• ${number.slice(-4)}`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#912338" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {paymentMethods.length > 0 ? (
          paymentMethods.map((method) => (
            <View key={method.id} style={styles.paymentCard}>
              <View style={styles.cardTypeContainer}>
                <Ionicons
                  name={method.type === 'Visa' ? 'card' : 'card-outline'}
                  size={24}
                  color="#912338"
                />
                <Text style={styles.cardType}>{method.type}</Text>
              </View>

              <Text style={styles.cardNumber}>{maskCardNumber(method.cardNumber)}</Text>
              <Text style={styles.cardHolder}>{method.cardHolder}</Text>

              <View style={styles.cardActions}>
                {method.id === defaultMethod ? (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.setDefaultButton}
                    onPress={() => handleSetDefault(method.id)}
                  >
                    <Text style={styles.setDefaultText}>Set as Default</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteMethod(method.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#800000" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="card-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No payment methods added yet</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddCard')}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Add Payment Method</Text>
        </TouchableOpacity>
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
  paymentCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardType: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardHolder: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  defaultBadge: {
    backgroundColor: '#912338',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  defaultText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  setDefaultButton: {
    paddingVertical: 6,
  },
  setDefaultText: {
    color: '#912338',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#912338',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
