// src/screens/ClassesScreen.js
import React from 'react';
import {View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, ScrollView} from 'react-native';
import ClassCard from '../components/ClassCard';
import { Ionicons } from "@expo/vector-icons";
import BottomNavigationBar from '../components/BottomNavigationBar';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested'
]);

const classData = [
    {
      id: '1',
      title: 'Hardcore',
      image: require('../../assets/images/classes/hardcore.png'),
      imageUrl: 'https://images.unsplash.com/photo-1695835743477-68f580122cc1',
      instructor: 'Coach Raymond',
      time: '4:30 – 5:15 PM',
      days: 'Monday',
      location: 'SGW – Le Gym – Gymnasium',
      rating: '4.9',
      reviews: '231',
      duration: '1hr',
      description:
        'A high intensity, cross-training session incorporating a blend of cardiovascular, strength and core exercises for an intense total body workout. I strive to make Hard Core as unique as possible, by coming up with creative and effective ways to challenge and strengthen my participants. Expect lots of variety to challenge all fitness levels, and be prepared to sweat!',
    },
    {
      id: '2',
      title: 'Yoga',
      image: require('../../assets/images/classes/yoga.png'),
      instructor: 'Coach Priya',
      time: '7:00 – 8:00 AM',
      days: 'Tuesday',
      location: 'SGW – Le Gym – Studio A',
      rating: '4.8',
      reviews: '198',
      duration: '1hr',
      description:
        'A calming class that focuses on improving flexibility, breathing techniques, and mental clarity through a variety of traditional yoga poses. Perfect for beginners or those seeking a restorative experience.',
    },
    {
      id: '3',
      title: 'Kinesis',
      image: require('../../assets/images/classes/kinessis.png'),
      instructor: 'Coach Alex',
      time: '12:00 – 12:45 PM',
      days: 'Friday',
      location: 'SGW – Le Gym – Functional Zone',
      rating: '4.6',
      reviews: '142',
      duration: '1hr',
      description:
        'A functional movement class using Kinesis wall equipment to improve strength, flexibility, and coordination. Great for injury prevention and athletic performance.',
    },
    {
      id: '4',
      title: 'Zumba Fitness',
      image: require('../../assets/images/classes/zumba.png'),
      instructor: 'Coach Isabella',
      time: '6:00 – 7:00 PM',
      days: 'Wednesday',
      location: 'SGW – Le Gym – Studio B',
      rating: '4.9',
      reviews: '312',
      duration: '45m',
      description:
        'An energetic dance fitness class that combines Latin and international music with fun choreography to make cardio exercise exciting and addictive.',
    },
    {
      id: '5',
      title: 'Yoga II',
      image: require('../../assets/images/classes/yoga.png'),
      instructor: 'Coach Priya',
      time: '6:00 – 7:00 PM',
      days: 'Monday',
      location: 'SGW – Le Gym – Studio A',
      rating: '4.7',
      reviews: '102',
      duration: '30m',
      description:
        'An intermediate-level yoga class that explores deeper postures, longer holds, and more challenging flows. Ideal for those with previous yoga experience.',
    },
    {
      id: '6',
      title: 'Personal Trainer',
      image: require('../../assets/images/classes/personal.png'),
      instructor: 'Coach Nathan',
      time: 'By Appointment',
      days: 'Monday',
      location: 'SGW – Le Gym – Weight Room',
      rating: '5.0',
      reviews: '89',
      duration: '1hr',
      description:
        'A one-on-one training session tailored to your personal fitness goals. Whether it’s building muscle, losing weight, or improving your performance, our certified trainers will guide and support you throughout your journey.',
    },
    {
      id: '7',
      title: 'Cycling Blast',
      image: require('../../assets/images/classes/cycling.jpg'),
      instructor: 'Coach Liam',
      time: '7:30 – 8:30 PM',
      days: 'Wednesday',
      location: 'SGW – Le Gym – Studio B',
      rating: '4.8',
      reviews: '87',
      duration: '45m',
      description:
        'A high-energy indoor cycling class designed to build endurance and burn calories through intense intervals and motivating music. Perfect for all fitness levels looking for a cardio challenge.',
    },
    {
      id: '8',
      title: 'Kickboxing',
      image: require('../../assets/images/classes/savatekickboxing.jpg'),
      instructor: 'Coach Marc',
      time: '5:00 – 6:00 PM',
      days: 'Thursday',
      location: 'SGW – Le Gym – Studio C',
      rating: '4.6',
      reviews: '73',
      duration: '60m',
      description:
        'A dynamic French martial arts class combining precision kicks and fluid boxing techniques. Focuses on agility, coordination, and self-defense. Suitable for all levels, from curious beginners to seasoned fighters.',
    },
    {
      id: '9',
      title: 'Pilates',
      image: require('../../assets/images/classes/pilates.jpg'),
      instructor: 'Coach Elena',
      time: '12:00 – 1:00 PM',
      days: 'Saturday',
      location: 'SGW – Le Gym – Studio A',
      rating: '4.8',
      reviews: '94',
      duration: '60m',
      description:
        'A core-focused Pilates class that enhances flexibility, balance, and posture through controlled movements and mindful breathing. Great for building strength without impact. All levels welcome.',
    },
    {
      id: '10',
      title: 'Basketball',
      image: require('../../assets/images/classes/basketball.webp'),
      instructor: 'Coach Jordan',
      time: '6:30 – 8:00 PM',
      days: 'Friday',
      location: 'SGW – Le Gym – Main Court',
      rating: '4.9',
      reviews: '120',
      duration: '90m',
      description:
        'Sharpen your dribbling, shooting, and defensive skills in this energetic basketball class. Includes skill drills followed by team scrimmages. Open to players of all levels.',
    }
  ];
  

// Get today
const today = new Date();

// Get the day of the week (0 = Sunday, 6 = Saturday)
const dayOfWeek = today.getDay();

// Calculate past Sunday
const pastSunday = new Date(today);
pastSunday.setDate(today.getDate() - dayOfWeek);

// Calculate next Saturday
const nextSaturday = new Date(pastSunday);
nextSaturday.setDate(pastSunday.getDate() + 6);


const formatDate = (date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const dateRange = `Week of ${formatDate(pastSunday)} to ${formatDate(nextSaturday)}`;


export default function ClassesScreen({navigation}) {
    return (
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
                          <TouchableOpacity onPress={() => navigation.goBack()}>
                              <Ionicons name="arrow-back" size={24} color="#912338" />
                          </TouchableOpacity>
                          <Text style={styles.headerTitle}>Available Classes</Text>
                          <View style={{ width: 24 }} />
                      </View>
            <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.subHeader}>{dateRange}</Text>
            <Text style={styles.helperText}>Classes update every Sunday</Text>

            <FlatList
                data={classData}
                renderItem={({item}) => (<ClassCard
                title={item.title}
                image={item.image}
                onPress={() => navigation.navigate('ClassDetail', {classInfo: item})}/>)}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.grid}
                showsVerticalScrollIndicator={false}/>

            </ScrollView>
                <BottomNavigationBar active="home" navigation={navigation} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#fff',
    },
    body: {
      backgroundColor: '#fff',
      //
      
  },

    header: {
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
  },
  headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color:"#912338"
  },
  helperText: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginBottom: 10,
  },
  
    subHeader: {
        fontSize: 15,
        fontWeight: '600',
        color: '#912338',
        marginBottom: 15,
        textAlign: 'center',
        marginTop: 10,
      },
    grid: {
        paddingBottom: 80,
        paddingHorizontal: 10
    }
});
