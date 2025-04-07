// src/screens/CalendarScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigationBar from '../components/BottomNavigationBar';
import DatePicker from '../components/DatePicker';

export default function CalendarScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  const eventsData = [
    {
      eventName: 'Rumba Class',
      location: 'SGW – Le Gym – Gymnasium',
      instructor: 'Coach Raymond',
      instructorImage: 'https://images.unsplash.com/photo-1724984430472-2b79b1c0dd13',
      dateTime: '2025-04-05T20:00:00.000Z',
      duration: '1hr',
      id: 'hstd7hebgfhsgfdjudg'
    }, {
      eventName: 'Yoga Class',
      location: 'SGW – Le Gym – Gymnasium',
      instructor: 'Julie Watson',
      instructorImage: 'https://images.unsplash.com/photo-1724984430472-2b79b1c0dd13',
      dateTime: '2025-04-05T18:00:00.000Z',
      duration: '45m',
      id: 'hstd7hebdfegfdjudg'
    }, {
      eventName: 'Rumba Class',
      location: 'SGW – Le Gym – Gymnasium',
      instructor: 'Coach Raymond',
      instructorImage: 'https://images.unsplash.com/photo-1724984430472-2b79b1c0dd13',
      dateTime: '2025-04-06T09:00:00.000Z',
      duration: '1hr',
      id: '746hssfhsgfdjudg'
    }]

  // Load events from AsyncStorage
  useEffect(() => {
    const loadEvents = async () => {
      try {
        // const storedEvents = await AsyncStorage.getItem('calendarEvents');
        // console.log(await AsyncStorage.getItem('calendarEvents'))
        // if (storedEvents) {
        //   setEvents(JSON.parse(storedEvents));
        // } else {
        await AsyncStorage.clear();
        await AsyncStorage.setItem('calendarEvents', JSON.stringify(eventsData));
        setEvents(eventsData);
        // }
      } catch (error) {
        console.error('Failed to load events:', error);
      }
    };

    loadEvents();
  }, []);

  // Filter events for selected date
  const todayEvents = events.filter(event => {

    const eventDate = new Date(event.dateTime);
    return eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear();
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Calendar</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.eventsContainer}>
        <View style={{ marginTop: 20 }}>
          <DatePicker onDateChange={(date) => setSelectedDate(date)} />
        </View>

        <View style={{ marginTop: 20, paddingHorizontal: 16, backgroundColor: "#F2F4F5", height: "fit-content", paddingVertical: 5 }}>
          <Text style={styles.dayTitle}>{selectedDate.toDateString()}</Text>
        </View>

        <View style={styles.dayEventsContainer}>
          {todayEvents.length > 0 ? (
            todayEvents.map((event, index) => (
              <View key={index} style={styles.eventCard}>
                <View>
                  <Text style={styles.eventTime}>{new Date(event.dateTime).getHours() + ":" + new Date(event.dateTime).getMinutes().toString().padStart(2, '0')}</Text>
                  <Text style={styles.eventDuration}>{event.duration}</Text>
                </View>

                <View style={styles.eventDetailsCard}>
                  <TouchableOpacity onPress={() => navigation.navigate('ClassDetail', { classInfo: event })}>
                    <Text style={styles.eventTitle}>{event.eventName}</Text>

                  <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 15 }}>
                    <Ionicons name="location-outline" size={24} color="#fff" /> 
                    <Text style={styles.eventLocation}>{event.location}</Text>
                  </View>

                  <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 10 }}>
                    <Image
                      source={{ uri: event.instructorImage }}
                      style={{ width: 25, height: 25, borderRadius: 20 }}
                    />

                    <Text style={styles.eventInstructor}>{event.instructor}</Text>
                  </View>
                  </TouchableOpacity>
                  
                </View>

              </View>
            ))
          ) : (
            <Text style={styles.noEvents}>No events scheduled</Text>
          )}
        </View>

      </ScrollView>

      <BottomNavigationBar active="calendar" navigation={navigation} />
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
  calendarHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  weekday: {
    width: 40,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 8,
  },
  dayCell: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveDay: {
    opacity: 0.3,
  },
  selectedDay: {
    backgroundColor: '#800000',
    borderRadius: 20,
  },
  dayText: {
    textAlign: 'center',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  eventsContainer: {
    flex: 1,
    // paddingHorizontal: 16,
  },
  dayEventsContainer: {
    marginVertical: 16,
    paddingHorizontal: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 30
  },
  dayTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  eventCard: {
    // backgroundColor: 'red',
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // borderRadius: 8,
    // padding: 12,
    // marginBottom: 8,
  },
  eventDetailsCard: {
    backgroundColor: '#93243A',
    borderRadius: 16,
    minHeight: 'fit-content',
    // width: '60%',
    padding: 16,
    marginLeft: 30,
    flex: 1,
  },
  eventTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  eventDuration: {
    fontSize: 14,
    color: '#666',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF'
    // marginTop: 4,
  },
  eventInstructor: {
    fontSize: 15,
    color: '#FFFFFF',
  },
  eventLocation: {
    fontSize: 15,
    color: '#FFFFFF',
  },
  noEvents: {
    fontStyle: 'italic',
    color: '#999',
    marginTop: 8,
  },
});