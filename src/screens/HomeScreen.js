// src/screens/HomeScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import WeeklyWorkout from '../components/WeeklyWorkout';
import CrowdMeterCard from '../components/CrowdMeterCard';
import crowded from '../../assets/images/crowded.png';
import BottomNavigationBar from '../components/BottomNavigationBar';
import LockerPromoCard from '../components/LockerPromoCard';

export default function HomeScreen({ navigation }) {
  const bookedClasses = [
    {
      id: '1',
      title: 'STRENGTH TRAINING CLASS',
      time: '5:30 PM',
      instructor: 'Coach Raymond',
      location: 'SGW – Le Gym – Gymnasium',
      rating: '4.8'
    }, {
      id: '2',
      title: 'YOGA CLASS',
      time: '5:30 PM',
      instructor: 'Coach Ashley',
      location: 'SGW – Le Gym – Studio',
      rating: '4.8'
    }
  ];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/le_gym.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <View style={styles.headerIcons}>
          <Ionicons name="notifications-outline" size={24} color="#333"/>
          <TouchableOpacity 
            style={styles.profileCircle}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileInitials}>JS</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
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
            <Text style={styles.heroTitle}>Hi John! 👋</Text>
            <Text style={styles.heroSub}>Ready for your next workout?</Text>
            <Text style={styles.streak}>🔥 Streak: 5 Days</Text>
          </View>
        </ImageBackground>

        <View style={styles.cards}>
          {/* WEEKLY WORKOUTS */}
          <WeeklyWorkout />

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
            <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {bookedClasses.map((classItem, index) => (
            <TouchableOpacity
              key={index}
              style={styles.classCard}
              onPress={() => navigation.navigate('ClassDetail', { classInfo: classItem })}
            >
              <View style={styles.classInfo}>
                <View style={styles.classRatingContainer}>
                  <Text style={styles.classRating}>{classItem.rating}</Text>
                </View>
                <Text style={styles.classTitle}>{classItem.title}</Text>
                <Text style={styles.classTime}>{classItem.time}</Text>
                <Text style={styles.classInstructor}>{classItem.instructor}</Text>
                <TouchableOpacity style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <LockerPromoCard 
          title="Need a Locker while you workout? It's free!"
          subtitle="Padlock for $10"
          onPress={() => navigation.navigate('LockerRental')}
        />
      </ScrollView>

      <BottomNavigationBar active="home" navigation={navigation} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
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
    padding: 16,
  },
  cardSpacing: {
    marginTop: 16,
  },
  classesContainer: {
    padding: 16,
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
  },
  classCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  classInfo: {
    flex: 1,
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
  classTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
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
    borderWidth: 1,
    borderColor: '#800000',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  cancelButtonText: {
    color: '#800000',
    fontSize: 12,
    fontWeight: '500',
  },
});
