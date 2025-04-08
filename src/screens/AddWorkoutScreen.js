// src/screens/AddWorkoutScreen.js
import React, { useState, useEffect } from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddWorkoutScreen({ navigation, route }) {
  const workoutToEdit = route.params?.workoutToEdit;

  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (workoutToEdit) {
      setActivity(workoutToEdit.activity);
      setDuration(workoutToEdit.duration.toString());
      setCalories(workoutToEdit.calories.toString());
      setNotes(workoutToEdit.notes || '');
      setDate(new Date(workoutToEdit.date));
    }
  }, [workoutToEdit]);

  const handleSave = async () => {
    if (!activity || !duration) {
      Alert.alert('Missing Information', 'Please enter activity and duration');
      return;
    }

    try {
      const existingWorkoutsJson = await AsyncStorage.getItem('workouts');
      const existingWorkouts = existingWorkoutsJson ? JSON.parse(existingWorkoutsJson) : [];

      const updatedWorkout = {
        id: workoutToEdit?.id || Date.now().toString(),
        activity,
        duration: parseInt(duration),
        calories: parseInt(calories) || 0,
        notes,
        date: date.toISOString(),
      };

      let updatedWorkouts;
      if (workoutToEdit) {
        // Editing
        updatedWorkouts = existingWorkouts.map(w =>
          w.id === workoutToEdit.id ? updatedWorkout : w
        );
      } else {
        // Creating
        updatedWorkouts = [updatedWorkout, ...existingWorkouts];
      }

      await AsyncStorage.setItem('workouts', JSON.stringify(updatedWorkouts));

      Alert.alert('Success', `Workout ${workoutToEdit ? 'updated' : 'added'} successfully`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert('Error', 'Failed to save workout');
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Workout', 'Are you sure you want to delete this workout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const existingWorkoutsJson = await AsyncStorage.getItem('workouts');
            const existingWorkouts = existingWorkoutsJson ? JSON.parse(existingWorkoutsJson) : [];

            const updatedWorkouts = existingWorkouts.filter(w => w.id !== workoutToEdit.id);
            await AsyncStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
            navigation.goBack();
          } catch (err) {
            console.error('Error deleting workout:', err);
            Alert.alert('Error', 'Failed to delete workout');
          }
        },
      },
    ]);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {workoutToEdit ? 'Edit Workout' : 'Add Workout'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Activity</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Activity"
            value={activity}
            onChangeText={setActivity}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Duration (minutes)</Text>
          <TextInput
            style={styles.input}
            placeholder="Duration in minutes"
            keyboardType="numeric"
            value={duration}
            onChangeText={setDuration}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Calories</Text>
          <TextInput
            style={styles.input}
            placeholder="Calories burned (optional)"
            keyboardType="numeric"
            value={calories}
            onChangeText={setCalories}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity style={styles.dateSelector} onPress={() => setShowDatePicker(true)}>
            <Text>{date.toLocaleDateString()}</Text>
            <Ionicons name="calendar" size={20} color="#800000" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Add notes about your workout"
            multiline
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {workoutToEdit ? 'Update Workout' : 'Save Workout'}
          </Text>
        </TouchableOpacity>

        {workoutToEdit && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete Workout</Text>
          </TouchableOpacity>
        )}
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
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  saveButton: {

      backgroundColor: '#800000',
      paddingVertical: 14,
      borderRadius: 30,
      alignItems: 'center',
      marginVertical: 20

  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#800000',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 20,
    marginTop: 10,
    marginBottom: 40,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
