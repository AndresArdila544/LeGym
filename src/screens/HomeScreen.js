// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  ImageBackground

} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import WeeklyWorkout from '../components/WeeklyWorkout';
import CrowdMeterCard from '../components/CrowdMeterCard';
import crowded from '../../assets/images/crowded.png';
import BottomNavigationBar from '../components/BottomNavigationBar';
import LockerPromoCard from '../components/LockerPromoCard';

export default function HomeScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [bookedClasses, setBookedClasses] = useState([]);
  const [user, setUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [streakDays, setStreakDays] = useState(0);



  const calculateStreak = (workouts) => {
    const uniqueWorkoutDays = new Set(
      workouts.map(w => {
        const d = new Date(w.date);
        d.setHours(0, 0, 0, 0); // normalize time
        return d.getTime();
      })
    );
  
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize today
  
    for (let i = 0; ; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
  
      if (uniqueWorkoutDays.has(checkDate.getTime())) {
        streak++;
      } else {
        break;
      }
    }
  
    return streak;
  };
  

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const stored = await AsyncStorage.getItem('userData');
        const parsed = stored ? JSON.parse(stored) : null;
        setUser(parsed);
      } catch (e) {
        console.error('Failed to load user data', e);
      }
    };

    const loadWorkouts = async () => {
      try {
        const stored = await AsyncStorage.getItem('workouts');
        const parsed = stored ? JSON.parse(stored) : [];
        setWorkouts(parsed);
        setStreakDays(calculateStreak(parsed));
      } catch (e) {
        console.error('Failed to load workouts', e);
      }
    };

    const loadBookedClasses = async () => {
      try {
        const stored = await AsyncStorage.getItem('classBookings');
        // console.log(stored);

        if (stored) {
          const parsed = JSON.parse(stored);
          setBookedClasses(parsed);
        }
      } catch (e) {
        console.error('Failed to load booked classes', e);
      }
    };
    

    if (isFocused) {
      loadUserData();
      loadBookedClasses();
      loadWorkouts();
    }
  }, [isFocused]);


  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.header}>

          <Image
            source={require('../../assets/le_gym.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />

          <View style={styles.headerIcons}>

            <Ionicons name="notifications-outline" size={24} color="#333" />

            <TouchableOpacity
              style={styles.profileCircle}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.profileInitials}>
                {user?.firstName?.charAt(0).toUpperCase() || ''}
                {user?.lastName?.charAt(0).toUpperCase() || ''}
              </Text>

            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {/* GREETING CARD */}

          <ImageBackground
            source={require('../../assets/images/HomeHead.png')}
            style={styles.hero}
            resizeMode="cover"
          >
            <Image
              source={require('../../assets/images/Overlay.png')}
              style={styles.gradientOverlay}
              resizeMode="cover"
            />

            <View style={styles.heroTextWrapper}>
              <Text style={styles.heroTitle}>
                Hi {user?.firstName || 'there'}! 👋
              </Text>
              <Text style={styles.heroSub}>Ready for your next workout?</Text>
              <Text style={styles.streak}>🔥 Streak: {streakDays} Days</Text>
            </View>

          </ImageBackground>

          <View style={styles.cards}>
            {/* WEEKLY WORKOUTS */}
            <WeeklyWorkout workouts={workouts} navigation={navigation}/>

            {/* CROWD METER */}
            <CrowdMeterCard
              current={15}
              max={250}
              image={crowded}
              crowdLevel="Not Crowded"
              location="SGW – Le Gym"
              waitTime="No wait time"
              style={styles.cardSpacing}
            />
          </View>

          <View style={styles.classesContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Booked Classes</Text>
              <TouchableOpacity onPress={() => navigation.navigate('ClassesScreen')}>
                <Text style={styles.seeAllText}>See all available classes</Text>
              </TouchableOpacity>
            </View>

            {bookedClasses.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ fontSize: 16, color: '#666' }}>
                  You don't have any classes booked this week.
                </Text>
              </View>
            ) : (bookedClasses.map((classItem, index) => (
              <TouchableOpacity
                key={index}
                style={styles.classCard}
                onPress={() => navigation.navigate('ClassDetail', { classInfo: classItem })}
              >
                <Image
                  source={
                    typeof classItem.image === 'number'
                      ? classItem.image
                      : classItem.imageUrl
                  }
                  style={styles.classImage}
                  resizeMode="cover"
                />
                <View style={styles.classInfo}>

                  <View style={styles.classRatingContainer}>
                    <Text style={styles.classRating}>{classItem.rating}</Text>
                  </View>
                  <Text style={styles.classTitle}>{classItem.title}</Text>
                  <View style={styles.classMetaContainer}>
                    <View style={styles.classBadge}>
                      <Ionicons name="time-outline" size={16} color="white" />
                      <Text style={styles.classBadgeText}>{classItem.time}</Text>
                    </View>
                    <View style={styles.classBadge}>
                      <Ionicons name="person-outline" size={16} color="white" />
                      <Text style={styles.classBadgeText}>{classItem.instructor}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.cancelButton}
                    onPress={() => navigation.navigate('ClassDetail', {
                      classInfo: classItem,
                      openCancelModal: true
                    })}>
                    <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )))}
          </View>

          <LockerPromoCard
            title="Need a Locker while you workout? It's free!"
            subtitle="Padlock for $10"
            onPress={() => navigation.navigate('LockerRental')}
          />
        </ScrollView>

        <BottomNavigationBar active="home" navigation={navigation} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    // paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  logoImage: {
    height: 30,
    width: 120,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#800000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    color: 'white',
    fontWeight: 'bold',
  },
  hero: {
    height: 180,
    width: '100%',
    position: 'relative',
  },
  gradientOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  heroTextWrapper: {
    padding: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  streak: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  cards: {
    // padding: 16,
    width: '92%',
    margin: 'auto',
    marginTop: 16,
  },
  cardSpacing: {
    marginTop: 16,
  },
  classesContainer: {
    // padding: 16,
    width: '92%',
    margin: 'auto',
    marginVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#800000',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  classCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAF0F6',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
  },
  classInfo: {
    flex: 1,
    padding: 8,
  },
  classImage: {
    width: '20%',
    height: '100%',
  },
  classTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    paddingLeft: 4,
    marginTop: 10,
  },
  classTime: {
    fontSize: 14,
    marginBottom: 4,
  },
  classInstructor: {
    fontSize: 14,
    marginBottom: 12,
  },
  cancelButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#800000',
    borderWidth: 'none',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  classMetaContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 12,
    width: '100%',
    gap: 8, // Increased spacing between badges
  },
  classBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222222',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 6,
    width: 'fit-content',
  },
  classBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  classRatingContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#800000',
    borderRadius: 4,
    padding: 4,
  },
  classRating: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
