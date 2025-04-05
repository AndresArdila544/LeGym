// src/screens/ChatScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigationBar from '../components/BottomNavigationBar';

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef();
  
  // Load chat history from AsyncStorage
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem('chatMessages');
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        } else {
          // If no messages, add welcome message
          const welcomeMessage = {
            id: Date.now().toString(),
            text: "Hello, I'm StingerBot! I'm your personal Le Gym assistant. How can I help you?",
            sender: 'bot',
            timestamp: new Date().toISOString(),
          };
          setMessages([welcomeMessage]);
          await AsyncStorage.setItem('chatMessages', JSON.stringify([welcomeMessage]));
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };
    
    loadMessages();
  }, []);
  
  // Save messages to AsyncStorage whenever they change
  useEffect(() => {
    const saveMessages = async () => {
      try {
        await AsyncStorage.setItem('chatMessages', JSON.stringify(messages));
      } catch (error) {
        console.error('Failed to save messages:', error);
      }
    };
    
    if (messages.length > 0) {
      saveMessages();
    }
  }, [messages]);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);
  
  const handleSend = async () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "I can help you with class schedules, locker rentals, or workout tracking. What would you like to know?",
        "You can book a class through the Classes section in the app. Would you like me to show you how?",
        "Our gym hours are 6am-10pm on weekdays and 8am-8pm on weekends.",
        "You can rent a locker for a day, week, month, or semester. Would you like to see pricing?",
        "The gym is currently not crowded. It's a great time to visit!",
        "Is there anything else I can help you with?",
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage = {
        id: Date.now().toString(),
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
    }, 1000);
  };
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stinger Bot</Text>
        <Text style={styles.headerSubtitle}>Always active</Text>
      </View>
      
      <ScrollView 
        style={styles.messagesContainer}
        ref={scrollViewRef}
      >
        {messages.map((message) => (
          <View 
            key={message.id}
            style={[
              styles.messageWrapper,
              message.sender === 'user' ? styles.userMessageWrapper : styles.botMessageWrapper
            ]}
          >
            <View 
              style={[
                styles.messageBubble,
                message.sender === 'user' ? styles.userMessage : styles.botMessage
              ]}
            >
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
            <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
          </View>
        ))}
      </ScrollView>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={handleSend}
            disabled={inputText.trim() === ''}
          >
            <Ionicons 
              name="send" 
              size={24} 
              color={inputText.trim() === '' ? '#ccc' : '#800000'} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      
      <BottomNavigationBar active="chat" navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#800000',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageWrapper: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessageWrapper: {
    alignSelf: 'flex-end',
  },
  botMessageWrapper: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    backgroundColor: '#800000',
    borderTopRightRadius: 4,
  },
  botMessage: {
    backgroundColor: 'white',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  userMessage: {
    backgroundColor: '#800000',
  },
  botMessage: {
    backgroundColor: 'white',
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
