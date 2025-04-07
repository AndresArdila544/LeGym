// src/screens/ClassesScreen.js
import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import ClassCard from '../components/ClassCard';
import BottomNavigationBar from '../components/BottomNavigationBar';

const classData = [
    {
      id: '1',
      title: 'Hardcore',
      image: require('../../assets/images/classes/hardcore.png'),
      instructor: 'Coach Raymond',
      time: '4:30 – 5:15 PM',
      days: 'Monday and Wednesdays',
      location: 'SGW – Le Gym – Gymnasium',
      rating: '4.9',
      reviews: '231',
      description:
        'A high intensity, cross-training session incorporating a blend of cardiovascular, strength and core exercises for an intense total body workout. I strive to make Hard Core as unique as possible, by coming up with creative and effective ways to challenge and strengthen my participants. Expect lots of variety to challenge all fitness levels, and be prepared to sweat!',
    },
    {
      id: '2',
      title: 'Yoga',
      image: require('../../assets/images/classes/yoga.png'),
      instructor: 'Coach Priya',
      time: '7:00 – 8:00 AM',
      days: 'Tuesdays and Thursdays',
      location: 'SGW – Le Gym – Studio A',
      rating: '4.8',
      reviews: '198',
      description:
        'A calming class that focuses on improving flexibility, breathing techniques, and mental clarity through a variety of traditional yoga poses. Perfect for beginners or those seeking a restorative experience.',
    },
    {
      id: '3',
      title: 'Kinesis',
      image: require('../../assets/images/classes/kinessis.png'),
      instructor: 'Coach Alex',
      time: '12:00 – 12:45 PM',
      days: 'Fridays',
      location: 'SGW – Le Gym – Functional Zone',
      rating: '4.6',
      reviews: '142',
      description:
        'A functional movement class using Kinesis wall equipment to improve strength, flexibility, and coordination. Great for injury prevention and athletic performance.',
    },
    {
      id: '4',
      title: 'Zumba Fitness',
      image: require('../../assets/images/classes/zumba.png'),
      instructor: 'Coach Isabella',
      time: '6:00 – 7:00 PM',
      days: 'Wednesdays and Fridays',
      location: 'SGW – Le Gym – Studio B',
      rating: '4.9',
      reviews: '312',
      description:
        'An energetic dance fitness class that combines Latin and international music with fun choreography to make cardio exercise exciting and addictive.',
    },
    {
      id: '5',
      title: 'Yoga II',
      image: require('../../assets/images/classes/yoga.png'),
      instructor: 'Coach Priya',
      time: '6:00 – 7:00 PM',
      days: 'Mondays',
      location: 'SGW – Le Gym – Studio A',
      rating: '4.7',
      reviews: '102',
      description:
        'An intermediate-level yoga class that explores deeper postures, longer holds, and more challenging flows. Ideal for those with previous yoga experience.',
    },
    {
      id: '6',
      title: 'Personal Trainer',
      image: require('../../assets/images/classes/personal.png'),
      instructor: 'Coach Nathan',
      time: 'By Appointment',
      days: 'Custom Schedule',
      location: 'SGW – Le Gym – Weight Room',
      rating: '5.0',
      reviews: '89',
      description:
        'A one-on-one training session tailored to your personal fitness goals. Whether it’s building muscle, losing weight, or improving your performance, our certified trainers will guide and support you throughout your journey.',
    },
  ];
  

// Get today
const today = new Date();

// Get the day of the week (0 = Sunday, 6 = Saturday)
const dayOfWeek = today.getDay();

// Calculate the previous Saturday
const saturday = new Date(today);
saturday.setDate(today.getDate() - dayOfWeek - 1 + 7); // Ensures it goes to Saturday of the current week

// Calculate the next Sunday after that Saturday
const nextSunday = new Date(saturday);
nextSunday.setDate(saturday.getDate() + 8); // Next week's Sunday

// Format the dates
const formatDate = (date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const dateRange = `Week of ${formatDate(saturday)} to ${formatDate(nextSunday)}`;

export default function ClassesScreen({navigation}) {
    return (
      <View style ={styles.container}>
        
        <Text style={styles.header}>Available Classes</Text>
        <Text style={styles.subHeader}>{dateRange}</Text>
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
                

        <BottomNavigationBar active="home" navigation={navigation} />
        </View>
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#912338',
        marginVertical: 12,
        paddingHorizontal: 12
    },
    subHeader: {
        fontSize: 14,
        fontWeight: '500',
        //color: '#333',
        marginBottom: 8,
        marginTop: -8,
        paddingHorizontal: 12
      },
    grid: {
        paddingBottom: 22,
        paddingHorizontal: 12

    }
});
