// src/screens/ClassDetailScreen.js
import React, {useState} from 'react';
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
import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigationBar from '../components/BottomNavigationBar';

export default function ClassDetailScreen({route, navigation}) {
    const {classInfo,openCancelModal = false} = route.params || {
        classInfo: {
            id: '1',
            title: 'Hardcore',
            instructor: 'Coach Raymond',
            time: '4:30 – 5:15 PM',
            days: 'Monday and Wednesdays',
            location: 'SGW – Le Gym – Gymnasium',
            rating: '4.9',
            reviews: '231',
            description: 'A high intensity, cross-training session incorporating a blend of cardiovascular' +
                    ', strength and core exercises for an intense total body workout. I strive to mak' +
                    'e Hard Core as unique as possible, by coming up with creative and effective ways' +
                    ' to challenge and strengthen my participants. Expect lots of variety to challeng' +
                    'e all fitness levels, and be prepared to sweat!',
            image: 'https://via.placeholder.com/400'
        }
    };

    const [confirmationVisible,
        setConfirmationVisible] = useState(false);
    const [isBooked,
        setIsBooked] = useState(false);
    const [cancelConfirmVisible,
        setCancelConfirmVisible] = useState(openCancelModal);

    const handleBookClass = async() => {
        try {
            // Get existing bookings
            const bookingsJson = await AsyncStorage.getItem('classBookings');
            const bookings = bookingsJson
                ? JSON.parse(bookingsJson)
                : [];

            // Add new booking
            const newBooking = {
                id: classInfo.id,
                title: classInfo.title,
                instructor: classInfo.instructor,
                time: classInfo.time,
                date: new Date().toISOString(),
                location: classInfo.location
            };

            const updatedBookings = [
                ...bookings,
                newBooking
            ];

            console.log(updatedBookings)

            // Save to AsyncStorage
            await AsyncStorage.setItem('classBookings', JSON.stringify(updatedBookings));

            // Show confirmation
            setIsBooked(true);
            setConfirmationVisible(true);
        } catch (error) {
            console.error('Error booking class:', error);
        }
    };

    const handleCancelBooking = async() => {
        try {
            // Get existing bookings
            const bookingsJson = await AsyncStorage.getItem('classBookings');
            const bookings = bookingsJson
                ? JSON.parse(bookingsJson)
                : [];

            // Remove this booking
            const updatedBookings = bookings.filter(booking => booking.id !== classInfo.id);

            // Save to AsyncStorage
            await AsyncStorage.setItem('classBookings', JSON.stringify(updatedBookings));

            // Update state
            setIsBooked(false);
            setCancelConfirmVisible(false);

            // Navigate back
            navigation.goBack();
        } catch (error) {
            console.error('Error canceling booking:', error);
        }
    };

    // Check if class is already booked when component mounts
    React.useEffect(() => {
        const checkBookingStatus = async() => {
            try {
                const bookingsJson = await AsyncStorage.getItem('classBookings');
                if (bookingsJson) {
                    const bookings = JSON.parse(bookingsJson);
                    const isAlreadyBooked = bookings.some(booking => booking.id === classInfo.id);
                    setIsBooked(isAlreadyBooked);
                }
            } catch (error) {
                console.error('Error checking booking status:', error);
            }
        };

        checkBookingStatus();
    }, [classInfo.id]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000"/>
                    </TouchableOpacity>
                    <Image
                        source={require('../../assets/images/classes/ClassDefault.png')}
                        style={styles.classImage}
                        resizeMode="cover"/>
                </View>

                <View style={styles.classInfo}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{classInfo.title}</Text>
                        <TouchableOpacity style={styles.bookmarkButton}>
                            <Ionicons name="bookmark-outline" size={20} color="#8B1C3B"/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>👤 {classInfo.instructor}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="location-outline" size={16} color="#555"/>
                        <Text style={styles.infoText}>{classInfo.location}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="star" size={16} color="#f5a623"/>
                        <Text style={styles.infoText}>{classInfo.rating}
                            ({classInfo.reviews}
                            reviews)</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={16} color="#555"/>
                        <Text style={styles.infoText}>{classInfo.days}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="time-outline" size={16} color="#555"/>
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
                        resizeMode="contain"/>
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
        backgroundColor: '#8B1C3B',
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
