import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockNotifications = [
  {
    id: '1',
    title: 'Booking Confirmed',
    body: 'Your Hardcore class for Monday is confirmed!',
    timestamp: '2025-04-07T10:30:00Z',
  },
  {
    id: '2',
    title: 'Class Cancelled',
    body: 'Zumba Fitness on Wednesday has been cancelled.',
    timestamp: '2025-04-06T15:00:00Z',
  },
];

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // You can replace this with AsyncStorage or Firebase calls later
    setNotifications(mockNotifications);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>
      <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#912338" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#912338",
  },
  list: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#912338',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#222',
  },
  body: {
    fontSize: 14,
    color: '#444',
  },
  timestamp: {
    marginTop: 6,
    fontSize: 12,
    color: '#888',
  },
});
