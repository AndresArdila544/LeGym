import React, {useState, useEffect, useRef} from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    Dimensions,
    Image
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {height} = Dimensions.get('window');

export default function ChatScreen({navigation}) {
    const [messages,
        setMessages] = useState([]);
    const [inputText,
        setInputText] = useState('');
    const scrollViewRef = useRef();
    const [activeUser, setActiveUser] = useState(null);

    useEffect(() => {
      const loadUser = async () => {
        const stored = await AsyncStorage.getItem('activeUser');
        if (stored) {
          setActiveUser(JSON.parse(stored));
        }
      };
      loadUser();
    }, []);
    const getChatKey = () => `chatMessages_${activeUser?.email}`;


    useEffect(() => {
        const loadMessages = async () => {
          if (!activeUser) return;
          const key = getChatKey();
          try {
            const storedMessages = await AsyncStorage.getItem(key);
            if (storedMessages) {
              setMessages(JSON.parse(storedMessages));
            } else {
              const welcomeMessage = {
                id: Date.now().toString(),
                text: "Hello, I'm StingerBot! 👋 I'm your personal Le Gym assistant. How can I help you?",
                sender: 'bot',
                timestamp: new Date().toISOString(),
              };
              setMessages([welcomeMessage]);
              await AsyncStorage.setItem(key, JSON.stringify([welcomeMessage]));
            }
          } catch (error) {
            console.error('Failed to load messages:', error);
          }
        };
      
        loadMessages();
      }, [activeUser]);
      

      useEffect(() => {
        const saveMessages = async () => {
          if (!activeUser) return;
          const key = getChatKey();
          try {
            await AsyncStorage.setItem(key, JSON.stringify(messages));
          } catch (error) {
            console.error('Failed to save messages:', error);
          }
        };
      
        if (messages.length > 0) {
          saveMessages();
        }
      }, [messages, activeUser]);
      

    useEffect(() => {
        setTimeout(() => {
            scrollViewRef.current
                ?.scrollToEnd({animated: true});
        }, 100);
    }, [messages]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setTimeout(() => {
                scrollViewRef.current
                    ?.scrollToEnd({animated: true});
            }, 10); // Delay slightly to wait for layout to adjust
        });

        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);

    const getBotReply = (text) => {
        const lower = text.toLowerCase();
      
        if (lower.includes('hours') || lower.includes('open')) {
          return 'Le Gym is open from 6am–10pm on weekdays, and 8am–8pm on weekends.';
        }
      
        if (lower.includes('locker')) {
          return 'You can rent lockers daily, weekly, or by semester. Just visit the front desk or the Locker section.';
        }
      
        if (lower.includes('class') && lower.includes('book')) {
          return 'To book a class, head to the Classes tab. Tap on a class and select "Book".';
        }
      
        if (lower.includes('classes') || lower.includes('schedule')) {
          return 'We offer yoga, spin, pilates, strength, and more! Check the schedule in the Classes section.';
        }
      
        if (lower.includes('crowded') || lower.includes('busy') || lower.includes('occupancy')) {
          return 'According to the live occupancy meter, it’s a good time to visit! 💪';
        }
      
        if (lower.includes('track') || lower.includes('workout')) {
          return 'You can track your workouts and see progress in the Fitness tab!';
        }
      
        if (lower.includes('help') || lower.includes('hi') || lower.includes('hello')) {
          return "Hey there! 👋 I can help with booking classes, gym hours, locker info, or your workouts.";
        }
      
        return "I'm not sure I understand 😅 Try asking me about gym hours, classes, lockers, or workouts!";
      };
      


    const handleSend = async() => {
        if (inputText.trim() === '') 
            return;
        
        const userMessage = {
            id: Date
                .now()
                .toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date().toISOString()
        };

        setMessages(prevMessages => [
            ...prevMessages,
            userMessage
        ]);
        setInputText('');

        setTimeout(() => {
            const botText = getBotReply(userMessage.text);
          
            const botMessage = {
              id: Date.now().toString(),
              text: botText,
              sender: 'bot',
              timestamp: new Date().toISOString(),
            };
          
            setMessages(prevMessages => [...prevMessages, botMessage]);
          }, 1000);
          
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                <View style={StyleSheet.absoluteFillObject}/>
            </TouchableWithoutFeedback>
            <View style={styles.modalBox}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Image
                            source={require('../../assets/images/Stinger.png')}
                            style={styles.avatar}/>
                        <View>
                            <Text style={styles.headerTitle}>Stinger Bot</Text>
                            <View style={styles.statusRow}>
                                <View style={styles.statusDot}/>
                                <Text style={styles.headerSubtitle}>Always active</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="close" size={24} color="#fff"/>
                    </TouchableOpacity>
                </View>

                {/* Messages */}
                <ScrollView style={styles.messagesContainer} ref={scrollViewRef}>
                    {messages.map((message) => (
                        <View
                            key={message.id}
                            style={[
                            styles.messageWrapper, message.sender === 'user'
                                ? styles.userMessageWrapper
                                : styles.botMessageWrapper
                        ]}>
                            <View
                                style={[
                                styles.messageBubble, message.sender === 'user'
                                    ? styles.userMessage
                                    : styles.botMessage
                            ]}>
                                <Text style={[
                                styles.messageBubble, message.sender === 'user'
                                    ? styles.userText
                                    : styles.botText
                            ]}>{message.text}</Text>
                            </View>
                            <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Input */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios'
                    ? 'padding'
                    : 'height'}
                    keyboardVerticalOffset={120}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type a message..."
                            value={inputText}
                            onChangeText={setInputText}
                            multiline/>
                        <TouchableOpacity
                            style={styles.sendButton}
                            onPress={handleSend}
                            disabled={inputText.trim() === ''}>
                            <Ionicons
                                name="send"
                                size={24}
                                color={inputText.trim() === ''
                                ? '#ccc'
                                : '#800000'}/>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalBox: {
        height: height * 0.85,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 0,
            height: -4
        },
        shadowRadius: 10,
        elevation: 10,
        position: 'relative',
    },
    header: {
      backgroundColor: '#912338',
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'white',
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff',
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 2,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#00C851', // green
    },
    headerSubtitle: {
      fontSize: 12,
      color: '#e1e1e1',
    },
    messagesContainer: {
        flexGrow: 1,
        padding: 16
    },
    messageWrapper: {
        marginBottom: 16,
        maxWidth: '80%'
    },
    userMessageWrapper: {
        alignSelf: 'flex-end'
    },
    botMessageWrapper: {
        alignSelf: 'flex-start'
    },
    messageBubble: {
        padding: 5,
        borderRadius: 16
    },
    userMessage: {
        backgroundColor: '#912338',
        borderTopRightRadius: 4,
        
    },
    botMessage: {
        backgroundColor: '#eee',
        borderTopLeftRadius: 4
    },
    userText: {
        fontSize: 16,
        color: '#eee'
    },
    botText:{
        fontSize: 16,
        color: '#333'
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
        alignSelf: 'flex-end'
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
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
        alignItems: 'center'
    }
});
