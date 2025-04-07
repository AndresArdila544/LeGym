import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MembershipScreen({ navigation }) {
  const [currentMembership, setCurrentMembership] = useState('Monthly');
  const [renewalDate, setRenewalDate] = useState(new Date());
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  useEffect(() => {
    const loadMembershipData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        
        if (userData) {
          const parsedData = JSON.parse(userData);
          const membership = parsedData.membership || 'Monthly';
          const startDate = parsedData.memberSince
            ? new Date(parsedData.memberSince)
            : new Date();
          const newRenewalDate = new Date(startDate);

          switch (membership) {
            case 'Monthly':
              newRenewalDate.setMonth(newRenewalDate.getMonth() + 1);
              break;
            case 'Annual':
              newRenewalDate.setFullYear(newRenewalDate.getFullYear() + 1);
              break;
            case 'Weekly':
              newRenewalDate.setDate(newRenewalDate.getDate() + 7);
              break;
            default:
              newRenewalDate.setMonth(newRenewalDate.getMonth() + 1);
          }

          setCurrentMembership(membership);
          setRenewalDate(newRenewalDate);
        }
      } catch (error) {
        console.error('Failed to load membership data:', error);
      }
    };

    loadMembershipData();
  }, []);

  const openConfirmationModal = (membership) => {
    setSelectedMembership(membership);
    setConfirmModalVisible(true);
  };

  const confirmMembershipChange = async () => {
    if (!selectedMembership || selectedMembership === currentMembership) {
      setConfirmModalVisible(false);
      return;
    }
  
    try {
      const userData = await AsyncStorage.getItem('userData');
      console.log(userData)
      if (userData) {
        const parsedData = JSON.parse(userData);
        const startDate = new Date();
  
        parsedData.membership = selectedMembership;
        parsedData.memberSince = startDate.toISOString();
  
        await AsyncStorage.setItem('userData', JSON.stringify(parsedData));
        setCurrentMembership(selectedMembership);
        console.log(selectedMembership)

        setSelectedMembership(null);
        setConfirmModalVisible(false);
  
        const newRenewalDate = new Date(startDate);
        switch (selectedMembership) {
          case 'Monthly':
            newRenewalDate.setMonth(newRenewalDate.getMonth() + 1);
            break;
          case 'Annual':
            newRenewalDate.setFullYear(newRenewalDate.getFullYear() + 1);
            break;
          case 'Weekly':
            newRenewalDate.setDate(newRenewalDate.getDate() + 7);
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
        return '$35/week';
      default:
        return '$50/month';
    }
  };

  const getMembershipDescription = (type) => {
    switch (type) {
      case 'Monthly':
        return 'Full access to all gym facilities and classes. Pay Monthly, cancel anytime.';
      case 'Annual':
        return 'Full access to all gym facilities and classes. Pay once per year, save more.';
      case 'Weekly':
        return 'Flexible weekly access. Ideal for short-term users. Cancel anytime.';
      default:
        return 'Full access to all gym facilities and classes.';
    }
  };

  const renderMembershipOption = (type, price) => (
    <TouchableOpacity
      style={[
        styles.membershipOption,
        currentMembership === type && styles.selectedOption,
      ]}
      onPress={() => openConfirmationModal(type)}
    >
      <View style={styles.optionHeader}>
        <Text style={styles.optionType}>{type}</Text>
        <Text style={styles.optionPrice}>{price}</Text>
      </View>
      <Text style={styles.optionDescription}>
        {getMembershipDescription(type)}
      </Text>
      {currentMembership === type && (
        <View style={styles.currentBadge}>
          <Text style={styles.currentBadgeText}>Current</Text>
        </View>
      )}
    </TouchableOpacity>
  );

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
              <Text style={styles.membershipPrice}>
                {getMembershipPrice(currentMembership)}
              </Text>
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
          {renderMembershipOption('Weekly', '$35/week')}
          {renderMembershipOption('Monthly', '$50/month')}
          {renderMembershipOption('Annual', '$275/year')}
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal visible={confirmModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              Confirm switch to {selectedMembership} membership?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text style={styles.cancelText}>No, Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmMembershipChange}
              >
                <Text style={styles.confirmText}>Yes, Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  currentMembershipContainer: { marginBottom: 32 },
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
  membershipType: { fontSize: 20, fontWeight: 'bold' },
  membershipPrice: { fontSize: 18, fontWeight: '500', color: '#800000' },
  membershipDescription: { fontSize: 16, color: '#666', marginBottom: 16 },
  renewalDate: { fontSize: 14, fontStyle: 'italic' },
  changeMembershipContainer: { marginBottom: 32 },
  membershipOption: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
  },
  selectedOption: { borderWidth: 2, borderColor: '#800000' },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionType: { fontSize: 18, fontWeight: 'bold' },
  optionPrice: { fontSize: 16, fontWeight: '500', color: '#800000' },
  optionDescription: { fontSize: 14, color: '#666' },
  currentBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#800000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  currentBadgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#f1f1f1',
  },
  confirmButton: {
    backgroundColor: '#800000',
  },
  cancelText: {
    color: '#333',
    fontWeight: 'bold',
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
