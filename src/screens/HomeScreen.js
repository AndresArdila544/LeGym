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
  const [isNotificationListEmpty, setIsNotificationListEmpty] = useState(true);


  const calculateStreak = (workouts) => {
    const toISODate = (date) => {
      const d = new Date(date);
      return d.toISOString().split('T')[0]; // yyyy-mm-dd
    };
  
    const uniqueWorkoutDays = new Set(
      workouts.map(w => toISODate(w.date))
    );
  
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
  
    return streak;
  };
  
  

  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem('activeUser');
        const parsedUser = stored ? JSON.parse(stored) : null;
        setUser(parsedUser);
        console.log('🧑‍💻 Loaded activeUser:', parsedUser);
  
        if (parsedUser?.email) {
          // Load workouts
          const workoutsKey = `workouts_${parsedUser.email}`;
          const storedWorkouts = await AsyncStorage.getItem(workoutsKey);
          const parsedWorkouts = storedWorkouts ? JSON.parse(storedWorkouts) : [];
          setWorkouts(parsedWorkouts);
          setStreakDays(calculateStreak(parsedWorkouts));
  
          // Load class bookings
          const bookingsKey = `classBookings_${parsedUser.email}`;
          const storedBookings = await AsyncStorage.getItem(bookingsKey);
          const parsedBookings = storedBookings ? JSON.parse(storedBookings) : [];
          setBookedClasses(parsedBookings);
        }

        if (parsedUser?.email) {
          const notifKey = `notifications_${parsedUser.email.toLowerCase()}`;
          const notifications = await AsyncStorage.getItem(notifKey);
          if (notifications) {
            const parsedNotifications = JSON.parse(notifications);
            setIsNotificationListEmpty(parsedNotifications.length === 0);
          } else {
            setIsNotificationListEmpty(true);
          }
        }
        
  
      } catch (e) {
        console.error('Failed to load home screen data', e);
      }
    };
  
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);
  
  const formatClassDate = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const sortedClasses = [...bookedClasses].sort(
    (a, b) => new Date(a.classDate) - new Date(b.classDate)
  );

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

          <TouchableOpacity onPress={() => navigation.navigate('NotificationsScreen')}>
            {
              isNotificationListEmpty === true ? (
                <Ionicons name="notifications-outline" size={24} color="#333" />
              ) : (
                <Ionicons name="notifications" size={24} color="#333" />
              )
            }
          </TouchableOpacity>

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

            {sortedClasses.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ fontSize: 16, color: '#666' }}>
                  You don't have any classes booked this week.
                </Text>
              </View>
            ) : (sortedClasses.map((classItem, index) => (
              
              <TouchableOpacity
                key={index}
                style={styles.classCard}
                onPress={() => navigation.navigate('ClassDetail', { classInfo: classItem })}
              >
                <View style={styles.classImageWrapper}>
                  <Image
                    source={
                      typeof classItem.image === 'number'
                        ? classItem.image
                        : { uri: classItem.imageUrl }
                    }
                    style={styles.classImage}
                    resizeMode="cover"
                  />
                  <View style={styles.classRatingContainer}>
                    <Ionicons name="star" size={12} color="#fff" />
                    <Text style={styles.classRating}>{classItem.rating}</Text>
                  </View>
                </View>

                <View style={styles.classInfo}>
                <View style={styles.classHeaderRow}>
                  <Text style={styles.classTitle}>{classItem.title}</Text>
                  <View style={styles.classDateBadge}>
                    <Ionicons name="calendar-outline" size={12} color="#fff" />
                    <Text style={styles.classDateText}>
                      {formatClassDate(classItem.classDate)}
                    </Text>
                  </View>
                </View>

                <View style={styles.classMetaContainer}> 
                  <View style={styles.classBadge}>
                    <Ionicons name="time-outline" size={14} color="white" />
                    <Text style={styles.classBadgeText}>{classItem.time}</Text>
                  </View>
                  <View style={styles.classBadge}>
                    <Ionicons name="person-outline" size={14} color="white" />
                    <Text style={styles.classBadgeText}>{classItem.instructor}</Text>
                  </View>
                </View>


                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() =>
                      navigation.navigate('ClassDetail', {
                        classInfo: classItem,
                        openCancelModal: true,
                      })
                    }
                  >
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
    backgroundColor: '#912338',
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
    color: '#912338',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  classHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  
  classDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#912338',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    gap: 4,
  },
  
  classDateText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
  },
  
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EAF0F6',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  
  classImageWrapper: {
    position: 'relative',
    width: '100%',
    height: 120,
  },
  
  classImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  
  classRatingContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#912338',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  classRating: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  
  classInfo: {
    padding: 12,
  },
  
  classTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222',
  },
  
  classMetaContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  
  classBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
  },
  
  classBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  
  cancelButton: {
    backgroundColor: '#912338',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  
  cancelButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  
});
