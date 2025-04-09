// src/screens/ClassDetailScreen.js
import React, { useState, useEffect,useCallback  } from 'react';
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
import uuid from 'react-native-uuid';
import { useFocusEffect } from '@react-navigation/native';

export default function ClassDetailScreen({ route, navigation }) {
    const { classInfo, openCancelModal = false, bookedDay = null } = route.params
    console.log(classInfo);
    const [bookedDays, setBookedDays] = useState([]);

    const [confirmationVisible,
        setConfirmationVisible] = useState(false);
    const [isBooked,
        setIsBooked] = useState(false);
    const [cancelConfirmVisible,
        setCancelConfirmVisible] = useState(openCancelModal);
        const [activeUser, setActiveUser] = useState(null);
        const [pendingCancelDay, setPendingCancelDay] = useState(null);


        const getBaseClassId = (id) => {
            return id.includes('_') ? id.split('_')[0] : id;
          };

        function getDateOfCurrentWeekday(weekday) {
            const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            if (!weekday || !weekdays.includes(weekday)) {
              console.warn('Invalid weekday:', weekday);
              return null;
            }
          
            const today = new Date();
            const currentDay = today.getDay();
            const targetDay = weekdays.indexOf(weekday);
            const diff = targetDay - currentDay;
          
            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + diff);
          
            return targetDate.toISOString();
          }
          
          function getNextDateOfWeekday(weekday) {
            const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          
            if (typeof weekday !== 'string' || !weekdays.includes(weekday)) {
              console.warn('Invalid weekday:', weekday);
              return null;
            }
          
            const today = new Date();
            const todayIndex = today.getDay();
            const targetIndex = weekdays.indexOf(weekday);
          
            const diff = (targetIndex - todayIndex + 7) % 7 || 7; // ensures next occurrence, even if today
            const targetDate = new Date();
            targetDate.setDate(today.getDate() + diff);
            return targetDate.toISOString();
          }
          

          useFocusEffect(
            useCallback(() => {
              const loadAndCheck = async () => {
                const stored = await AsyncStorage.getItem('activeUser');
                if (!stored) return;
          
                const parsed = JSON.parse(stored);
                setActiveUser(parsed);
          
                if (classInfo.title !== 'Personal Trainer') return;
          
                const key = `classBookings_${parsed.email}`;
                const bookingsJson = await AsyncStorage.getItem(key);
                const bookings = bookingsJson ? JSON.parse(bookingsJson) : [];
          
                const booked = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].filter(day =>
                  bookings.some(b => b.id === `${classInfo.id}_${day}`)
                );
          
                setBookedDays(booked);
              };
          
              loadAndCheck();
            }, [classInfo.id, confirmationVisible, cancelConfirmVisible])
          );
          
    const getBookingKey = () => `classBookings_${activeUser?.email}`;

    const addNotification = async (title, body, type = 'general') => {
        try {
          if (!activeUser) return;
      
          const notifKey = `notifications_${activeUser.email.toLowerCase()}`;
          const notificationsJson = await AsyncStorage.getItem(notifKey);
          const notifications = notificationsJson ? JSON.parse(notificationsJson) : [];
      
          const newNotification = {
            id: uuid.v4(),
            title,
            body,
            type,
            timestamp: new Date().toISOString(),
          };
      
          const updatedNotifications = [newNotification, ...notifications];
          await AsyncStorage.setItem(notifKey, JSON.stringify(updatedNotifications));
        } catch (error) {
          console.error('Error adding notification:', error);
        }
      };
      

      const handleBookClass = async (dayOverride = null) => {
        console.log(activeUser)
        if (!activeUser) return;
      
        const key = getBookingKey();
        const isPersonalTrainer = classInfo.title === 'Personal Trainer';
      
        let weekday = typeof dayOverride === 'string' ? dayOverride : null;
        console.log('Booking weekday:', weekday);
        if (!weekday && typeof classInfo.days === 'string') {
        const possibleDay = classInfo.days.split(' ')[0];
        const validWeekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        if (validWeekdays.includes(possibleDay)) {
            weekday = possibleDay;
        }
        }



        let classDate;

        if (isPersonalTrainer) {
            const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const today = new Date();
            const todayIndex = today.getDay(); // 0 = Sunday
            const targetIndex = weekdays.indexOf(weekday);
          
            if (targetIndex === -1) {
              alert(`Invalid weekday: ${weekday}`);
              return;
            }
          
            const isPastDay = targetIndex < todayIndex;
            if (isPastDay) {
              alert(`You can only book Personal Trainer sessions for today or later. ${weekday} has already passed.`);
              return;
            }
          
            classDate = getDateOfCurrentWeekday(weekday); 
        } else {
        // Check that the day is today or later in the same week
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date();
        const todayIndex = today.getDay(); // 0 = Sunday
        const targetIndex = weekdays.indexOf(weekday);

        if (targetIndex === -1) {
            alert(`Invalid weekday: ${weekday}`);
            return;
        }

        const isPastDay = targetIndex < todayIndex;
        if (isPastDay) {
            alert(`You can only book classes from today onward. This class runs on ${weekday}.`);
            return;
        }

        classDate = getDateOfCurrentWeekday(weekday); // same-week booking
        }



      
        const bookingsJson = await AsyncStorage.getItem(key);
        const bookings = bookingsJson ? JSON.parse(bookingsJson) : [];
      
        const newBooking = isPersonalTrainer
          ? {
              ...classInfo,
              booked: true,
              time: '6:00 AM',
              date: new Date().toISOString(),
              classDate,
              days: weekday,
              id: `${classInfo.id}_${weekday}`, // Unique ID per day
            }
          : {
              ...classInfo,
              booked: true,
              date: new Date().toISOString(),
              classDate,
              id: classInfo.id,
            };
    
        const alreadyBooked = bookings.some(b => b.id === newBooking.id);
        if (alreadyBooked) {
            console.log('Class already booked:', newBooking.id);
            return;
          }
            
        const updatedBookings = [...bookings, newBooking];
        await AsyncStorage.setItem(key, JSON.stringify(updatedBookings));
      
        if (isPersonalTrainer) {
          setBookedDays(prev => [...prev, weekday]);
        } else {
          setIsBooked(true);
        }
      
        setConfirmationVisible(true);
      
        await addNotification(
          'Class Booking Confirmed',
          isPersonalTrainer
            ? `Your ${classInfo.title} session for ${weekday} at 6:00 AM is confirmed!`
            : `Your ${classInfo.title} class for ${classInfo.days} is confirmed!`,
          'bookClass'
        );
      };
      
      
      
      

      const handleCancelBooking = async (dayOverride = null) => {
        if (!activeUser) return;
        const key = getBookingKey();
      
        const bookingsJson = await AsyncStorage.getItem(key);
        const bookings = bookingsJson ? JSON.parse(bookingsJson) : [];
      
        const isPersonalTrainer = classInfo.title === 'Personal Trainer';
        const idToCancel = isPersonalTrainer && (dayOverride || pendingCancelDay)
          ? `${classInfo.id}_${dayOverride || pendingCancelDay}`
          : classInfo.id;
      
        const updatedBookings = bookings.filter(booking => booking.id !== idToCancel);
        await AsyncStorage.setItem(key, JSON.stringify(updatedBookings));
      
        await addNotification(
          'Class Cancelled',
          isPersonalTrainer
            ? `Your Personal Trainer session on ${dayOverride || pendingCancelDay} at 6:00 AM has been cancelled.`
            : `Your booking for ${classInfo.title} class has been cancelled.`,
          'cancelClass'
        );
      
        setCancelConfirmVisible(false);
        if (isPersonalTrainer && (dayOverride || pendingCancelDay)) {
          setBookedDays(prev => prev.filter(d => d !== (dayOverride || pendingCancelDay)));
          setPendingCancelDay(null);
        } else {
          setIsBooked(false);
        }
      };
      
      


    // Check if class is already booked when component mounts
    useEffect(() => {
        const checkBookingStatus = async () => {
          if (!activeUser) return;
          const key = getBookingKey();
          const bookingsJson = await AsyncStorage.getItem(key);
          if (!bookingsJson) return;
      
          const bookings = JSON.parse(bookingsJson);
          const isPersonalTrainer = classInfo.title === 'Personal Trainer';
      
          if (!isPersonalTrainer) {
            const booked = bookings.some(b => b.id === classInfo.id);
            setIsBooked(booked);
          }
        };
      
        checkBookingStatus();
      }, [classInfo.id, activeUser]);
      

      useEffect(() => {
        const checkBookedDays = async () => {
          if (!activeUser || classInfo.title !== 'Personal Trainer') return;
          const key = getBookingKey();
          const bookingsJson = await AsyncStorage.getItem(key);
          const bookings = bookingsJson ? JSON.parse(bookingsJson) : [];
      
          const booked = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].filter(day =>
            bookings.some(b => b.id === `${getBaseClassId(classInfo.id)}_${day}`)
          );
          setBookedDays(booked);
        };
      
        checkBookedDays();
      }, [activeUser, classInfo.id, confirmationVisible, cancelConfirmVisible]);
      
      



    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                <View style={styles.imageWrapper}>
                <Image
                    source={classInfo.image ? classInfo.image : { uri: classInfo.imageUrl }}
                    style={styles.classImage}
                    resizeMode="cover"
                />
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                </View>

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

                {classInfo.title === 'Personal Trainer' ? (
  <View style={{ padding: 16 }}>
    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
      <View key={day} style={styles.trainerCard}>
        <View style={styles.cardRow}>
          <Ionicons name="location-outline" size={16} color="#555" />
          <Text style={styles.cardText}>{classInfo.location}</Text>
        </View>
        <View style={styles.cardRow}>
          <Ionicons name="star" size={16} color="#f5a623" />
          <Text style={styles.cardText}>{classInfo.rating} ({classInfo.reviews} reviews)</Text>
        </View>
        <View style={styles.cardRow}>
          <Ionicons name="calendar-outline" size={16} color="#555" />
          <Text style={styles.cardText}>{day}</Text>
        </View>
        <View style={styles.cardRow}>
          <Ionicons name="time-outline" size={16} color="#555" />
          <Text style={styles.cardText}>6:00 AM</Text>
        </View>
        {activeUser && (
        <TouchableOpacity
        style={styles.bookButton}
        onPress={() => {
          if (bookedDays.includes(day)) {
            setPendingCancelDay(day);
            setCancelConfirmVisible(true);
          } else {
            handleBookClass(day);
          }
        }}
      >
        <Text style={styles.bookButtonText}>
          {bookedDays.includes(day) ? `Cancel ${day} Booking` : `Book for ${day}`}
        </Text>
      </TouchableOpacity>
      
        )}

      </View>
    ))}
  </View>
) : (
  isBooked ? (
    <TouchableOpacity
      style={[styles.actionButton, styles.cancelButton]}
      onPress={() => setCancelConfirmVisible(true)}>
      <Text style={styles.actionButtonText}>Cancel Booking</Text>
    </TouchableOpacity>
  ) : (
    
    <TouchableOpacity style={styles.actionButton} onPress={handleBookClass}>
      <Text style={styles.actionButtonText}>Book Class</Text>
    </TouchableOpacity>

    
  )
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
                            onPress={() => {
                                if (classInfo.title === 'Personal Trainer') {
                                handleCancelBooking(pendingCancelDay);
                                } else {
                                handleCancelBooking(); // no argument
                                }
                            }}>
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
    imageWrapper: {
        position: 'relative',
        width: '100%',
        height: 220,
      },
      
      classImage: {
        width: '100%',
        height: '100%',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
      },
      
      backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.6)', // optional for contrast
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
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
        alignItems: 'center',
        borderRadius: 20,
    },
    cancelButton: {
        backgroundColor: '#912338',
        borderRadius: 20,
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
        //borderRadius: 8,
        backgroundColor: '#912338',
        borderRadius: 20,
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
        backgroundColor: '#f1f1f1',
        borderRadius: 20,
    },
    confirmModalButton: {
        backgroundColor: '#912338',
        borderRadius: 20,
    },
    cancelModalButtonText: {
        color: '#333',
        fontWeight: 'bold'
    },
    confirmModalButtonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    trainerCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ddd',
      },
      cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
      },
      cardText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#333',
      },
      bookButton: {
        marginTop: 12,
        backgroundColor: '#912338',
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
      },
      bookButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
      }
      
});
