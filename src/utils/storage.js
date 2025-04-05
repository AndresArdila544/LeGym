// src/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// User data
export const saveUserData = async (userData) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Workouts
export const saveWorkout = async (workout) => {
  try {
    const workouts = await getWorkouts();
    const updatedWorkouts = [workout, ...workouts];
    await AsyncStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
    return true;
  } catch (error) {
    console.error('Error saving workout:', error);
    return false;
  }
};

export const getWorkouts = async () => {
  try {
    const workouts = await AsyncStorage.getItem('workouts');
    return workouts ? JSON.parse(workouts) : [];
  } catch (error) {
    console.error('Error getting workouts:', error);
    return [];
  }
};

// Class bookings
export const saveClassBooking = async (booking) => {
  try {
    const bookings = await getClassBookings();
    const updatedBookings = [...bookings, booking];
    await AsyncStorage.setItem('classBookings', JSON.stringify(updatedBookings));
    return true;
  } catch (error) {
    console.error('Error saving class booking:', error);
    return false;
  }
};

export const getClassBookings = async () => {
  try {
    const bookings = await AsyncStorage.getItem('classBookings');
    return bookings ? JSON.parse(bookings) : [];
  } catch (error) {
    console.error('Error getting class bookings:', error);
    return [];
  }
};

export const cancelClassBooking = async (classId) => {
  try {
    const bookings = await getClassBookings();
    const updatedBookings = bookings.filter(booking => booking.id !== classId);
    await AsyncStorage.setItem('classBookings', JSON.stringify(updatedBookings));
    return true;
  } catch (error) {
    console.error('Error canceling class booking:', error);
    return false;
  }
};

// Payment methods
export const savePaymentMethod = async (paymentMethod) => {
  try {
    const methods = await getPaymentMethods();
    const updatedMethods = [...methods, paymentMethod];
    await AsyncStorage.setItem('paymentMethods', JSON.stringify(updatedMethods));
    return true;
  } catch (error) {
    console.error('Error saving payment method:', error);
    return false;
  }
};

export const getPaymentMethods = async () => {
  try {
    const methods = await AsyncStorage.getItem('paymentMethods');
    return methods ? JSON.parse(methods) : [];
  } catch (error) {
    console.error('Error getting payment methods:', error);
    return [];
  }
};
