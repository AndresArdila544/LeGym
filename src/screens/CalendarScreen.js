// src/screens/CalendarScreen.js
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

export default function CalendarScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  
  // Current month days
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
  
  // Get calendar days
  const getDays = () => {
    const days = [];
    // Previous month days
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    return days;
  };
  
  const days = getDays();
  
  // Get month name
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
  // Load events from AsyncStorage
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const storedEvents = await AsyncStorage.getItem('calendarEvents');
        if (storedEvents) {
          setEvents(JSON.parse(storedEvents));
        }
      } catch (error) {
        console.error('Failed to load events:', error);
      }
    };
    
    loadEvents();
  }, []);
  
  // Filter events for selected date
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getDate() === selectedDate.getDate() &&
           eventDate.getMonth() === selectedDate.getMonth() &&
           eventDate.getFullYear() === selectedDate.getFullYear();
  });
  
  // Get tomorrow's date
  const tomorrow = new Date(selectedDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Filter events for tomorrow
  const tomorrowEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getDate() === tomorrow.getDate() &&
           eventDate.getMonth() === tomorrow.getMonth() &&
           eventDate.getFullYear() === tomorrow.getFullYear();
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
      
      <View style={styles.calendarHeader}>
        <Text style={styles.monthYear}>{monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</Text>
      </View>
      
      <View style={styles.weekdaysRow}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <Text key={index} style={styles.weekday}>{day}</Text>
        ))}
      </View>
      
      <View style={styles.daysContainer}>
        {days.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayCell,
              !item.isCurrentMonth && styles.inactiveDay,
              item.day === selectedDate.getDate() && styles.selectedDay
            ]}
            onPress={() => {
              if (item.day && item.isCurrentMonth) {
                const newDate = new Date(selectedDate);
                newDate.setDate(item.day);
                setSelectedDate(newDate);
              }
            }}
          >
            <Text style={[
              styles.dayText,
              item.day === selectedDate.getDate() && styles.selectedDayText
            ]}>
              {item.day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <ScrollView style={styles.eventsContainer}>
        <View style={styles.dayEventsContainer}>
          <Text style={styles.dayTitle}>Today - {selectedDate.toDateString()}</Text>
          {todayEvents.length > 0 ? (
            todayEvents.map((event, index) => (
              <View key={index} style={styles.eventCard}>
                <Text style={styles.eventTime}>{event.time}</Text>
                <Text style={styles.eventDuration}>{event.duration}</Text>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventInstructor}>{event.instructor}</Text>
                <Text style={styles.eventLocation}>{event.location}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noEvents}>No events scheduled</Text>
          )}
        </View>
        
        <View style={styles.dayEventsContainer}>
          <Text style={styles.dayTitle}>{tomorrow.toDateString()}</Text>
          {tomorrowEvents.length > 0 ? (
            tomorrowEvents.map((event, index) => (
              <View key={index} style={styles.eventCard}>
                <Text style={styles.eventTime}>{event.time}</Text>
                <Text style={styles.eventDuration}>{event.duration}</Text>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventInstructor}>{event.instructor}</Text>
                <Text style={styles.eventLocation}>{event.location}</Text>
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
    paddingHorizontal: 16,
  },
  dayEventsContainer: {
    marginBottom: 16,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  eventCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  eventTime: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDuration: {
    fontSize: 14,
    color: '#666',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  eventInstructor: {
    fontSize: 14,
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
  },
  noEvents: {
    fontStyle: 'italic',
    color: '#999',
    marginTop: 8,
  },
});
