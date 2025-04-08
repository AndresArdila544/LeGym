// src/screens/ClassDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Modal,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigationBar from '../components/BottomNavigationBar';

export default function ClassDetailScreen({ route, navigation }) {
    const { classInfo, openCancelModal = false } = route.params
    console.log(classInfo);
    
    // || {
    //     classInfo: {
    //         id: '1',
    //         title: 'Hardcore',
    //         instructor: 'Coach Raymond',
    //         time: '4:30 – 5:15 PM',
    //         days: 'Monday and Wednesdays',
    //         location: 'SGW – Le Gym – Gymnasium',
    //         rating: '4.9',
    //         reviews: '231',
    //         description: 'A high intensity, cross-training session incorporating a blend of cardiovascular' +
    //                 ', strength and core exercises for an intense total body workout. I strive to mak' +
    //                 'e Hard Core as unique as possible, by coming up with creative and effective ways' +
    //                 ' to challenge and strengthen my participants. Expect lots of variety to challeng' +
    //                 'e all fitness levels, and be prepared to sweat!',
    //         image: 'https://via.placeholder.com/400'
    //     }
    // };

    const [confirmationVisible,
        setConfirmationVisible] = useState(false);
    const [isBooked,
        setIsBooked] = useState(false);
    const [cancelConfirmVisible,
        setCancelConfirmVisible] = useState(openCancelModal);
        const [activeUser, setActiveUser] = useState(null);


    function getDateOfCurrentWeekday(weekday) {
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date();
        const currentDay = today.getDay(); // 0 (Sun) - 6 (Sat)
        const targetDay = weekdays.indexOf(weekday);

        if (targetDay === -1) {
            throw new Error('Invalid weekday name');
        }

        const diff = targetDay - currentDay;
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + diff);

        return targetDate.toISOString(); // Returns "YYYY-MM-DD"
    }

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
    const getBookingKey = () => `classBookings_${activeUser?.email}`;

    const handleBookClass = async () => {
        if (!activeUser) return;
        const key = getBookingKey();
      
        const bookingsJson = await AsyncStorage.getItem(key);
        const bookings = bookingsJson ? JSON.parse(bookingsJson) : [];
      
        const newBooking = {
          ...classInfo,
          booked: true,
          date: new Date().toISOString(),
          classDate: getDateOfCurrentWeekday(classInfo.days)
        };
      
        const updatedBookings = [...bookings, newBooking];
        await AsyncStorage.setItem(key, JSON.stringify(updatedBookings));
      
        setIsBooked(true);
        setConfirmationVisible(true);
      };
      

      const handleCancelBooking = async () => {
        if (!activeUser) return;
        const key = getBookingKey();
      
        const bookingsJson = await AsyncStorage.getItem(key);
        const bookings = bookingsJson ? JSON.parse(bookingsJson) : [];
      
        const updatedBookings = bookings.filter(booking => booking.id !== classInfo.id);
        await AsyncStorage.setItem(key, JSON.stringify(updatedBookings));
      
        setIsBooked(false);
        setCancelConfirmVisible(false);
        navigation.goBack();
      };
      

    // Check if class is already booked when component mounts
    React.useEffect(() => {
        const checkBookingStatus = async () => {
            if (!activeUser) return;
            const key = getBookingKey();
            const bookingsJson = await AsyncStorage.getItem(key);
            if (bookingsJson) {
              const bookings = JSON.parse(bookingsJson);
              const isAlreadyBooked = bookings.some(booking => booking.id === classInfo.id);
              setIsBooked(isAlreadyBooked);
            }
          };
          

        checkBookingStatus();
    }, [classInfo.id,, activeUser]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Image
                        source={classInfo.image ? classInfo.image : { uri: classInfo.imageUrl } }
                        style={styles.classImage}
                        resizeMode="cover" />
                </View>

                <View style={styles.classInfo}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{classInfo.title}</Text>
                        <TouchableOpacity style={styles.bookmarkButton}>
                            <Ionicons name="bookmark-outline" size={20} color="#912338" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>👤 {classInfo.instructor}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="location-outline" size={16} color="#555" />
                        <Text style={styles.infoText}>{classInfo.location}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="star" size={16} color="#f5a623" />
                        <Text style={styles.infoText}>{classInfo.rating}
                            ({classInfo.reviews}
                            reviews)</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={16} color="#555" />
                        <Text style={styles.infoText}>{classInfo.days}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="time-outline" size={16} color="#555" />
                        <Text style={styles.infoText}>{classInfo.time}</Text>
                    </View>

                </View>

                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>{classInfo.description}</Text>
                </View>

                {isBooked
                    ? (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.cancelButton]}
                            onPress={() => setCancelConfirmVisible(true)}>
                            <Text style={styles.actionButtonText}>Cancel Booking</Text>
                        </TouchableOpacity>
                    )
                    : (
                        <TouchableOpacity style={styles.actionButton} onPress={handleBookClass}>
                            <Text style={styles.actionButtonText}>Book Class</Text>
                        </TouchableOpacity>
                    )}
            </ScrollView>

            {/* Confirmation Modal */}
            <Modal visible={confirmationVisible} transparent={true} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Image
                            source={require('../../assets/images/sucess.png')}
                            style={styles.modalImage}
                            resizeMode="contain" />
                        <Text style={styles.modalTitle}>Your booking has been confirmed!</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                setConfirmationVisible(false);
                                navigation.goBack();
                            }}>

                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Cancel Confirmation Modal */}
            <Modal visible={cancelConfirmVisible} transparent={true} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Are you sure?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelModalButton]}
                                onPress={() => setCancelConfirmVisible(false)}>
                                <Text style={styles.cancelModalButtonText}>No, Go back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmModalButton]}
                                onPress={handleCancelBooking}>
                                <Text style={styles.confirmModalButtonText}>Yes, Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        //padding: 16
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    classImage: {
        width: '100%',
        height: 220,
        //borderBottomLeftRadius: 16, borderBottomRightRadius: 16,
    },
    classInfo: {
        padding: 16
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    bookmarkButton: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 6
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6
    },
    infoText: {
        marginLeft: 6,
        color: '#333',
        fontSize: 14
    },
    badge: {
        alignSelf: 'flex-start',
        backgroundColor: '#333',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginVertical: 8
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600'
    },
    instructor: {
        fontSize: 18,
        marginBottom: 8
    },
    timeContainer: {
        marginBottom: 8
    },
    time: {
        fontSize: 16,
        fontWeight: '500'
    },
    days: {
        fontSize: 16,
        color: '#666'
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    rating: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 4
    },
    reviews: {
        fontSize: 14,
        color: '#666'
    },
    location: {
        fontSize: 16,
        color: '#666'
    },
    descriptionContainer: {
        padding: 16
    },
    description: {
        fontSize: 16,
        lineHeight: 24
    },
    actionButton: {
        backgroundColor: '#912338',
        margin: 16,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center'
    },
    cancelButton: {
        backgroundColor: '#912338'
    },
    actionButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        width: '80%',
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24
    },
    closeButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        backgroundColor: '#912338'
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 8
    },
    cancelModalButton: {
        backgroundColor: '#f1f1f1'
    },
    confirmModalButton: {
        backgroundColor: '#912338'
    },
    cancelModalButtonText: {
        color: '#333',
        fontWeight: 'bold'
    },
    confirmModalButtonText: {
        color: 'white',
        fontWeight: 'bold'
    }
});
