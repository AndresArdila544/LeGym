import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from 'moment';
import { Swipeable } from 'react-native-gesture-handler';

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('activeUser');
        if (!storedUser) return;
  
        const user = JSON.parse(storedUser);
        const notifKey = `notifications_${user.email.toLowerCase()}`;
  
        const storedNotifications = await AsyncStorage.getItem(notifKey);
        if (storedNotifications) {
          setNotifications(JSON.parse(storedNotifications).reverse());
        }
      } catch (error) {
        console.error("Failed to load notifications:", error);
      }
    };
  
    loadNotifications();
  }, []);
  

  const getIconName = (type) => {
    switch (type) {
      case 'bookClass':
        return 'people-circle-outline';
      case 'cancelClass':
        return 'close-circle-outline';
      case 'addWorkout':
        return 'fitness-outline';
      case 'lockerRental':
        return 'lock-closed-outline';
      case 'membershipUpdate':
        return 'person-add-outline';
      default:
        return 'notifications';
    }
  };

  const renderRightActions = (onDelete) => (
    <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
      <Ionicons name="trash" size={24} color="red" style={{
        padding: 10,
      }} />
    </TouchableOpacity>
  );

  const handleDelete = async (id) => {
    try {
      const storedUser = await AsyncStorage.getItem('activeUser');
      if (!storedUser) return;
  
      const user = JSON.parse(storedUser);
      const notifKey = `notifications_${user.email.toLowerCase()}`;
  
      const stored = await AsyncStorage.getItem(notifKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        const updated = parsed.filter((item) => item.id !== id);
        setNotifications(updated);
        await AsyncStorage.setItem(notifKey, JSON.stringify(updated));
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };
  

  const renderItem = ({ item }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(() => handleDelete(item.id))}
    >
      <View style={styles.notificationCard}>
        <View style={styles.notifIcon}>
          <Ionicons name={getIconName(item.type)} size={24} color="#912338" />
        </View>

        <View style={styles.rhs}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.body}>{item.body}</Text>
          <Text style={styles.timestamp}>
            {moment(item.timestamp, 'YYYY-MM-DDTHH:mm:ssZ').fromNow()}
          </Text>
        </View>

      </View>
    </Swipeable>
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



      {notifications.length === 0 || !notifications ? (
        <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 16 }}>
          You have no notifications yet.
        </Text>
      ) : (
        <View style={{ flex: 1 }}>
          <Text style={styles.deleteMsg}>Swipe right to delete notification.</Text>
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        </View>


      )}
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
    // backgroundColor: '#f9f9f9',
    padding: 14,
    borderBottomColor: '#F0F1F3',
    borderBottomWidth: 1,
    flexDirection: 'row',
    borderRightColor: '#F0F1F3',
    borderRightWidth: 1,
    // backgroundColor: 'red'
    // borderRadius: 10,
    // marginBottom: 12,
    // borderLeftWidth: 4,
    // borderLeftColor: '#912338',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
    color: '#667085'
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rhs: {
    // backgroundColor: 'blue',
    flex: 1
  },
  body: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 24,
    // color: '#444',
    color: '#0C1523'
  },
  timestamp: {
    marginTop: 8,
    fontSize: 13,
    // color: '#888',
    color: '#667085'
  },
  deleteButton: {
    backgroundColor: 'whitesmoke',
    width: 60,
    // height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: 10,
  },
  deleteMsg: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    color: '#667085'
  }
});
