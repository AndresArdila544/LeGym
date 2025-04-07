// src/screens/FitnessTrackerScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigationBar from '../components/BottomNavigationBar';

export default function FitnessTrackerScreen({ navigation }) {
  const [workouts, setWorkouts] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('1 month');
  
  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const storedWorkouts = await AsyncStorage.getItem('workouts');
        if (storedWorkouts) {
          const parsedWorkouts = JSON.parse(storedWorkouts);
          setWorkouts(parsedWorkouts);
          
          // Calculate total calories and time
          let calories = 0;
          let minutes = 0;
          parsedWorkouts.forEach(workout => {
            calories += workout.calories || 0;
            minutes += workout.duration || 0;
          });
          
          setTotalCalories(calories);
          setTotalTime(minutes);
        }
        
        // Load streak days
        const storedStreak = await AsyncStorage.getItem('streakDays');
        if (storedStreak) {
          setStreakDays(parseInt(storedStreak));
        }
      } catch (error) {
        console.error('Failed to load workouts:', error);
      }
    };
    
    loadWorkouts();
  }, []);
  
  // Format time as hours and minutes
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Fitness Tracker</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Calories</Text>
            <Text style={styles.statValue}>{totalCalories} kcal</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Time Spent</Text>
            <Text style={styles.statValue}>{formatTime(totalTime)}</Text>
          </View>
        </View>
        
        <View style={styles.weekActivityContainer}>
          <Text style={styles.sectionTitle}>This weeks activity</Text>
          <View style={styles.activityDetails}>
            <Text style={styles.activityText}>Workouts this week: {workouts.filter(w => {
              const workoutDate = new Date(w.date);
              const today = new Date();
              const diffTime = Math.abs(today - workoutDate);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays <= 7;
            }).length}</Text>
            <Text style={styles.activityText}>Streak: {streakDays} Days</Text>
          </View>
        </View>
        
        <View style={styles.workoutsContainer}>
          <View style={styles.workoutsHeader}>
            <Text style={styles.sectionTitle}>Workouts</Text>
            <TouchableOpacity 
              style={styles.periodSelector}
              onPress={() => {
                const periods = ['1 week', '1 month', '3 months', '1 year'];
                const currentIndex = periods.indexOf(selectedPeriod);
                const nextIndex = (currentIndex + 1) % periods.length;
                setSelectedPeriod(periods[nextIndex]);
              }}
            >
              <Text style={styles.periodText}>{selectedPeriod}</Text>
              <Ionicons name="chevron-down" size={16} color="#800000" />
            </TouchableOpacity>
          </View>
          
          {workouts.length > 0 ? (
            workouts.map((workout, index) => (
              <View key={index} style={styles.workoutCard}>
                <Text style={styles.workoutDate}>Date: {new Date(workout.date).toLocaleDateString()}</Text>
                <Text style={styles.workoutActivity}>Activity: {workout.activity}</Text>
                <Text style={styles.workoutDuration}>Duration: {workout.duration} min</Text>
                <Text style={styles.workoutCalories}>Calories: {workout.calories} kcal</Text>
                {workout.notes && <Text style={styles.workoutNotes}>Notes: "{workout.notes}"</Text>}
              </View>
            ))
          ) : (
            <Text style={styles.noWorkouts}>No workouts recorded yet</Text>
          )}
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('AddWorkout')}
          >
            <Text style={styles.addButtonText}>Add workout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <BottomNavigationBar active="fitness" navigation={navigation} />
    </View>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    width: '48%',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  weekActivityContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  activityDetails: {
    marginTop: 8,
  },
  activityText: {
    fontSize: 16,
    marginBottom: 4,
  },
  workoutsContainer: {
    flex: 1,
  },
  workoutsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  periodText: {
    fontSize: 16,
    color: '#800000',
    marginRight: 4,
  },
  workoutCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  workoutDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  workoutActivity: {
    fontSize: 16,
    marginTop: 4,
  },
  workoutDuration: {
    fontSize: 16,
    marginTop: 4,
  },
  workoutCalories: {
    fontSize: 16,
    marginTop: 4,
  },
  workoutNotes: {
    fontSize: 16,
    marginTop: 4,
    fontStyle: 'italic',
  },
  noWorkouts: {
    fontStyle: 'italic',
    color: '#999',
    textAlign: 'center',
    marginTop: 24,
  },
  addButton: {
    backgroundColor: '#800000',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
