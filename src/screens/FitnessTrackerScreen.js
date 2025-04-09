// src/screens/FitnessTrackerScreen.js
import React, {useState, useEffect,useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigationBar from '../components/BottomNavigationBar';
import WorkoutChart from '../components/WorkoutChart';
import { useIsFocused } from '@react-navigation/native';

export default function FitnessTrackerScreen({navigation}) {
    const [workouts,
        setWorkouts] = useState([]);
    const [totalCalories,
        setTotalCalories] = useState(0);
    const [totalTime,
        setTotalTime] = useState(0);
    const [streakDays,
        setStreakDays] = useState(0);
    const [selectedPeriod,
        setSelectedPeriod] = useState('1 week');
        const [user, setUser] = useState(null);

const isFocused = useIsFocused();


    useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem('activeUser');
        const parsedUser = stored ? JSON.parse(stored) : null;
        setUser(parsedUser);
  
        if (parsedUser?.email) {
          const key = `workouts_${parsedUser.email}`;
          const storedWorkouts = await AsyncStorage.getItem(key);
          const parsedWorkouts = storedWorkouts ? JSON.parse(storedWorkouts) : [];
          setWorkouts(parsedWorkouts);

          console.log(`📥 Loaded ${parsedWorkouts.length} workouts for ${parsedUser?.email}`);

          // Calculate calories and time
          let calories = 0;
          let minutes = 0;
          parsedWorkouts.forEach(workout => {
            calories += workout.calories || 0;
            minutes += workout.duration || 0;
          });
  
          setTotalCalories(calories);
          setTotalTime(minutes);
  
          // Calculate streak
          const toISODate = (d) => {
            const date = new Date(d);
            return date.toISOString().split('T')[0]; // "2025-04-08"
          };
          
          const uniqueWorkoutDays = new Set(parsedWorkouts.map(w => toISODate(w.date)));
  
          let streak = 0;
        const today = new Date();

        for (let i = 0; ; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const key = toISODate(checkDate);

        if (uniqueWorkoutDays.has(key)) {
            streak++;
        } else {
            break;
        }
        }
  
          setStreakDays(streak);
        }
      } catch (error) {
        console.error('❌ Failed to load user-specific workouts:', error);
      }
    };
  
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

    // Format time as hours and minutes
    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}min`;
    };
    const getFilteredWorkouts = () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0); // normalize current date
    
      return workouts.filter(w => {
        const workoutDate = new Date(w.date);
        workoutDate.setHours(0, 0, 0, 0); // normalize workout date
    
        const diffTime = now - workoutDate;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
        if (selectedPeriod === '1 week') return diffDays >= 0 && diffDays <= 7;
        if (selectedPeriod === '1 month') return diffDays >= 0 && diffDays <= 30;
        if (selectedPeriod === '3 months') return diffDays >= 0 && diffDays <= 90;
        if (selectedPeriod === '1 year') return diffDays >= 0 && diffDays <= 365;
    
        return true; // fallback
      });
    };
    
    const filteredWorkouts = useMemo(() => getFilteredWorkouts(), [workouts, selectedPeriod]);
    console.log(`Showing ${filteredWorkouts.length} workouts for period: ${selectedPeriod}`);
    
    filteredWorkouts.forEach(w =>
      console.log(`Workout: ${w.activity}, Date: ${new Date(w.date).toLocaleDateString()}`)
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Fitness Tracker</Text>
                    <View style={{
                        width: 24
                    }}/>
                </View>

                <ScrollView style={styles.content}>

                    <View style={styles.activityCard}>
                        <Text style={styles.activityTitle}>This week's activity</Text>
                        <View style={styles.activityDetails}>
                            <Text style={styles.activityDetail}>Workouts this week: {workouts.filter(w => {
                                    const workoutDate = new Date(w.date);
                                    const today = new Date();
                                    const diffTime = Math.abs(today - workoutDate);
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                    return diffDays <= 7;
                                }).length}</Text>
                            <Text style={styles.activityStreak}>🔥 Streak: {streakDays}{' '}
                                Days</Text>
                        </View>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <Ionicons name="flame-outline" size={24} color="#912338"/>
                            <View style={styles.statTextWrapper}>
                                <Text style={styles.statLabel}>Calories</Text>
                                <Text style={styles.statValue}>{totalCalories}
                                    kcal</Text>
                            </View>
                        </View>

                        <View style={styles.statCard}>
                            <Ionicons name="time-outline" size={24} color="#912338"/>
                            <View style={styles.statTextWrapper}>
                                <Text style={styles.statLabel}>Time Spent</Text>
                                <Text style={styles.statValue}>{formatTime(totalTime)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* <View style={styles.chartCard}> */}

                        <WorkoutChart workouts={workouts} selectedPeriod={selectedPeriod}/>

                    {/* </View> */}

                    <TouchableOpacity
                            style={styles.addWorkoutButton}
                            onPress={() => navigation.navigate('AddWorkout')}>
                            <Text style={styles.addWorkoutButtonText}>Add workout</Text>
                        </TouchableOpacity>

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
                            }}>
                                <Text style={styles.periodText}>{selectedPeriod}</Text>
                                <Ionicons name="chevron-down" size={16} color="#912338"/>
                            </TouchableOpacity>
                        </View>

                        {filteredWorkouts.length > 0
                          ? (filteredWorkouts.map((workout, index) => (
                              
                                <View key={index} style={styles.workoutCard}>
                                    <Text style={styles.workoutDate}>Date: {new Date(workout.date).toLocaleDateString()}</Text>
                                    <Text style={styles.workoutActivity}>Activity: {workout.activity}</Text>
                                    <Text style={styles.workoutDuration}>Duration: {workout.duration}
                                        min</Text>
                                    <Text style={styles.workoutCalories}>Calories: {workout.calories}
                                        kcal</Text>
                                    {workout.notes && <Text style={styles.workoutNotes}>Notes: "{workout.notes}"</Text>}

                                    <View style={{ flexDirection: 'row', marginTop: 10, gap: 12 }}>
                                    <TouchableOpacity 
                                      style={[styles.editButton]} 
                                      onPress={() => navigation.navigate('AddWorkout', { workoutToEdit: workout })}
                                    >
                                      <Text style={styles.buttonText}>Edit</Text>
                                    </TouchableOpacity>

                                    </View>


                                </View>
                            )))
                            : (
                                <Text style={styles.noWorkouts}>No workouts recorded yet</Text>
                            )}

                        
                    </View>
                </ScrollView>

                <BottomNavigationBar active="fitness" navigation={navigation}/>
            </View>
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
        paddingBottom: 8
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#912338"
    },
    content: {
        flex: 1,
        padding: 16,
        //marginBottom: 70
    },
    statTextWrapper: {
        marginLeft: 10
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24
    },
    statCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        width: '48%'
    },
    statLabel: {
        fontSize: 16,
        color: '#666'
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 4
    },
    activityCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2
    },
    activityTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#912338',
        marginBottom: 8
    },
    activityDetail: {
        fontSize: 14,
        color: '#333'
    },
    activityStreak: {
        fontSize: 14,
        color: '#333',
        marginTop: 4
    },
    chartCard: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 16,
        marginBottom: 24,
        width: '100%'
    },
    chartFilters: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333'
    },
    chartPlaceholder: {
        height: 120,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },

    weekActivityContainer: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 16,
        marginBottom: 24
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8
    },
    activityDetails: {
        marginTop: 8
    },
    activityText: {
        fontSize: 16,
        marginBottom: 4
    },
    workoutsContainer: {
        flex: 1
    },
    workoutsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
    },
    periodSelector: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    periodText: {
        fontSize: 16,
        color: '#912338',
        marginRight: 4
    },
    workoutCard: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16
    },
    workoutDate: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    workoutActivity: {
        fontSize: 16,
        marginTop: 4
    },
    workoutDuration: {
        fontSize: 16,
        marginTop: 4
    },
    workoutCalories: {
        fontSize: 16,
        marginTop: 4
    },
    workoutNotes: {
        fontSize: 16,
        marginTop: 4,
        fontStyle: 'italic'
    },
    noWorkouts: {
        fontStyle: 'italic',
        color: '#999',
        textAlign: 'center',
        marginTop: 24
    },
    addButton: {
        backgroundColor: '#912338',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 16
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    addWorkoutButton: {
        backgroundColor: '#912338',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        marginVertical: 20
    },
    addWorkoutButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    editButton: {
      backgroundColor: '#912338',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    
});
