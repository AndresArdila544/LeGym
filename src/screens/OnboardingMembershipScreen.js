import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Modal,
  Image,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PaymentMethod from './PaymentMethodScreen';

export default function OnboardingMembershipScreen({ route, navigation }) {
  const [selectedMembership, setSelectedMembership] = useState('Monthly');
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const { userInfo } = route.params || {};

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
  

  const renderOption = (type) => (
    <TouchableOpacity
      style={[
        styles.membershipOption,
        selectedMembership === type && styles.selectedOption,
      ]}
      onPress={() => setSelectedMembership(type)}
    >
      <View style={styles.optionRow}>
        <Text style={styles.optionText}>{type}</Text>
        <Text style={styles.optionPrice}>{getMembershipPrice(type)}</Text>
      </View>
      <Text style={styles.optionDescription}>{getMembershipDescription(type)}</Text>
      {selectedMembership === type && (
        <Ionicons
          name="checkmark-circle"
          size={20}
          color="#fff"
          style={styles.checkIcon}
        />
      )}
    </TouchableOpacity>
  );
  

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../assets/images/membership.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
            <View style={styles.topSpace}>
                                <View style={styles.titleContainer}>
                                    
                                    <Image source={require("../../assets/le_gym.png")} style={styles.logo}/>
                                </View>
                            </View>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Memberships</Text>
            <Text style={styles.subtitle}>
              Get unlimited access
            </Text>
            <Text style={styles.subtext}>
              When you subscribe, you’ll get instant unlimited access
            </Text>

            <View style={styles.optionsContainer}>
              {renderOption('Weekly')}
              {renderOption('Monthly')}
              {renderOption('Annual')}
            </View>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => navigation.navigate('PaymentMethod', {  userInfo, selectedMembership })}
            >
              <Text style={styles.confirmText}>Confirm membership</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setCancelModalVisible(true)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ImageBackground>

      {/* Cancel Confirmation Modal */}
      <Modal visible={cancelModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Cancel setup?</Text>
            <Text style={{ marginBottom: 16, textAlign: 'center' }}>
              This will discard your onboarding progress.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setCancelModalVisible(false)} style={[styles.modalBtn, styles.modalCancel]}>
                <Text style={styles.modalCancelText}>No, go back</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.modalBtn, styles.modalConfirm]}>
                <Text style={styles.modalConfirmText}>Yes, cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  topSpace: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
},
titleContainer: {
    alignItems: "center",
    marginTop:25,
    marginBottom: 60
},
logo: {
    width: 150,
    height: 53,
    resizeMode: "contain"
},
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    marginTop: 24,
    fontWeight: '600',
    marginBottom: 30,
  },
  subtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 16,
  },
  membershipOption: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedOption: {
    borderColor: '#912338',
    //backgroundColor: '#912338',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
  optionPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkIcon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  confirmButton: {
    marginTop: 24,
    backgroundColor: '#912338',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  confirmText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 12,
    padding: 14,
    borderColor: '#912338',
    borderWidth: 2,
    borderRadius: 30,
    alignItems: 'center',
  },
  cancelText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 24,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancel: {
    backgroundColor: '#f1f1f1',
  },
  modalCancelText: {
    fontWeight: 'bold',
  },
  modalConfirm: {
    backgroundColor: '#912338',
  },
  modalConfirmText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  optionDescription: {
    color: '#ccc',
    fontSize: 13,
    marginTop: 6,
  },
  
});
