import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    Image,
    Modal
} from "react-native";
import LoginModal from "../components/LoginModal";
import CreateAccountModal from "../components/CreateAccountModal";
import CreatePasswordModal from "../components/CreatePasswordModal";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WelcomeScreen({navigation}) {
    const [loginVisible,
        setLoginVisible] = useState(false);
    const [showCreateAccount,
        setShowCreateAccount] = useState(false);
    const [showCreatePassword,
        setShowCreatePassword] = useState(false);

    const [userInfo,
        setUserInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        gender: '',
        password: ''
    });

    const injectDefaultUser = async () => {
        const james = {
          firstName: "James",
          lastName: "Jones",
          email: "james.jones@mail.com",
          password: "Password1!",
          memberSince: new Date("2025-04-01").toISOString(),
          membership: "Monthly",
          dateOfBirth: new Date("1998-03-09").toISOString(),
          gender: "Male",
          height: "185",
          weight: "80",
        };
      
        const bookingsKey = `classBookings_${james.email}`;
        const bookingsValue = [
          {
            id: "4",
            title: "Zumba Fitness",
            instructor: "Coach Isabella",
            time: "6:00 – 7:00 PM",
            days: "Wednesday",
            location: "SGW – Le Gym – Studio B",
            rating: "4.9",
            reviews: "312",
            duration: "45m",
            description:
              "An energetic dance fitness class that combines Latin and international music with fun choreography to make cardio exercise exciting and addictive.",
            image: 34,
            booked: true,
            date: "2025-04-08T23:03:47.308Z",
            classDate: "2025-04-09T23:03:47.308Z",
          },
          {
            id: "7",
            title: "Cycling Blast",
            instructor: "Coach Liam",
            time: "7:30 – 8:30 PM",
            days: "Wednesday",
            location: "SGW – Le Gym – Studio B",
            rating: "4.8",
            reviews: "87",
            duration: "45m",
            description:
              "A high-energy indoor cycling class designed to build endurance and burn calories through intense intervals and motivating music. Perfect for all fitness levels looking for a cardio challenge.",
            image: 36,
            booked: true,
            date: "2025-04-08T23:04:00.243Z",
            classDate: "2025-04-09T23:04:00.243Z",
          },
          {
            id: "9",
            title: "Pilates",
            instructor: "Coach Elena",
            time: "12:00 – 1:00 PM",
            days: "Saturday",
            location: "SGW – Le Gym – Studio A",
            rating: "4.8",
            reviews: "94",
            duration: "60m",
            description:
              "A core-focused Pilates class that enhances flexibility, balance, and posture through controlled movements and mindful breathing. Great for building strength without impact. All levels welcome.",
            image: 38,
            booked: true,
            date: "2025-04-08T23:04:04.878Z",
            classDate: "2025-04-12T23:04:04.878Z",
          },
          {
            id: "10",
            title: "Basketball",
            instructor: "Coach Jordan",
            time: "6:30 – 8:00 PM",
            days: "Friday",
            location: "SGW – Le Gym – Main Court",
            rating: "4.9",
            reviews: "120",
            duration: "90m",
            description:
              "Sharpen your dribbling, shooting, and defensive skills in this energetic basketball class. Includes skill drills followed by team scrimmages. Open to players of all levels.",
            image: 39,
            booked: true,
            date: "2025-04-08T23:04:13.524Z",
            classDate: "2025-04-11T23:04:13.524Z",
          },
        ];
        const chatKey = `chatMessages_${james.email}`;
        const chatMessagesValue = [
            {
              id: "1744088009651",
              sender: "bot",
              text: "Hello, I'm StingerBot! 👋 I'm your personal Le Gym assistant. How can I help you?",
              timestamp: "2025-04-08T04:53:29.651Z",
            },
            {
              id: "1744153583448",
              sender: "user",
              text: "Hello!",
              timestamp: "2025-04-08T23:06:23.448Z",
            },
            {
              id: "1744153584461",
              sender: "bot",
              text: "Hey there! 👋 I can help with booking classes, gym hours, locker info, or your workouts.",
              timestamp: "2025-04-08T23:06:24.461Z",
            },
            {
              id: "1744153595583",
              sender: "user",
              text: "Booking classes",
              timestamp: "2025-04-08T23:06:35.583Z",
            },
            {
              id: "1744153596596",
              sender: "bot",
              text: 'To book a class, head to the Classes tab. Tap on a class and select "Book".',
              timestamp: "2025-04-08T23:06:36.596Z",
            },
            {
              id: "1744153602150",
              sender: "user",
              text: "Gym hours",
              timestamp: "2025-04-08T23:06:42.150Z",
            },
            {
              id: "1744153603164",
              sender: "bot",
              text: "Le Gym is open from 6am–10pm on weekdays, and 8am–8pm on weekends.",
              timestamp: "2025-04-08T23:06:43.164Z",
            },
            {
              id: "1744153608935",
              sender: "user",
              text: "Locker info",
              timestamp: "2025-04-08T23:06:48.935Z",
            },
            {
              id: "1744153609949",
              sender: "bot",
              text: "You can rent lockers daily, weekly, or by semester. Just visit the front desk or the Locker section.",
              timestamp: "2025-04-08T23:06:49.949Z",
            },
            {
              id: "1744153623738",
              sender: "user",
              text: "Workouts",
              timestamp: "2025-04-08T23:07:03.738Z",
            },
            {
              id: "1744153624751",
              sender: "bot",
              text: "You can track your workouts and see progress in the Fitness tab!",
              timestamp: "2025-04-08T23:07:04.751Z",
            },
          ];
        const workoutsKey = `workouts_james.jones@mail.com`;
        const enhancedWorkouts = [
            {
              id: "1744086829042",
              activity: "My workout",
              duration: 60,
              calories: 120,
              date: "2025-04-08T04:33:37.604Z",
              notes: "Amazing time"
            },
            {
              id: "w1", activity: "Cardio & Stretch", duration: 45, calories: 200, date: "2025-04-08T07:33:00.000Z", notes: "Felt great after stretch",
            },
            {
              id: "w2", activity: "Weightlifting", duration: 50, calories: 250, date: "2025-04-04T10:00:00.000Z", notes: "Focused on back and biceps",
            },
            {
              id: "w3", activity: "Cycling", duration: 30, calories: 180, date: "2025-04-07T18:00:00.000Z", notes: "Indoor cycling session",
            },
            {
              id: "w4", activity: "HIIT", duration: 25, calories: 220, date: "2025-04-06T14:00:00.000Z", notes: "Tough but effective",
            },
            {
              id: "w5", activity: "Swimming", duration: 60, calories: 400, date: "2025-04-05T16:00:00.000Z", notes: "Full-body low impact",
            },
            {
              id: "w6", activity: "Pilates", duration: 40, calories: 150, date: "2025-03-20T11:00:00.000Z", notes: "Deep core activation",
            },
            {
              id: "w7", activity: "Functional Training", duration: 55, calories: 300, date: "2024-04-20T15:00:00.000Z", notes: "Old but gold",
            }
          ];
          
        const paymentsKey = `paymentMethods_james.jones@mail.com`;

        const jamesPayments = [
        {
            id: "1744153729365",
            cardHolder: "James Jones",
            cardNumber: "1234 1234 1234 1234",
            expiryDate: "12/34",
            cvv: "123",
            type: "Card",
            isDefault: true
        },
        {
            id: "1744153729366",
            cardHolder: "James Jones",
            cardNumber: "4321 8765 4321 8765",
            expiryDate: "09/29",
            cvv: "456",
            type: "Card",
            isDefault: false
        }
        ];

        try {
          // Add user if not already present
            const data = await AsyncStorage.getItem("users");
            let users = data ? JSON.parse(data) : [];
        
            const exists = users.some(
                (u) => u.email.toLowerCase() === james.email.toLowerCase()
            );
            if (!exists) {
                users.push(james);
                await AsyncStorage.setItem("users", JSON.stringify(users));
                console.log("🧍‍♂️ Injected James Jones into users list");
            } else {
                console.log("✅ James Jones already exists");
            }
      
            // Add class bookings if they don't exist
            const existingBookings = await AsyncStorage.getItem(bookingsKey);
            if (!existingBookings) {
                await AsyncStorage.setItem(bookingsKey, JSON.stringify(bookingsValue));
                console.log("📚 Injected class bookings for James");
            } else {
                console.log("📘 Class bookings for James already exist");
            }

          // Inject chat messages if missing
            const existingChat = await AsyncStorage.getItem(chatKey);
            if (!existingChat) {
                await AsyncStorage.setItem(chatKey, JSON.stringify(chatMessagesValue));
                console.log("💬 Injected chat messages for James");
            } else {
                console.log("💭 Chat messages already exist");
            }

            const existingWorkouts = await AsyncStorage.getItem(workoutsKey);

            if (!existingWorkouts) {
                await AsyncStorage.setItem(workoutsKey, JSON.stringify(enhancedWorkouts));
                console.log("🏋️ Injected enhanced workouts for James");
            } else {
                console.log("🧠 Workouts already inyected");

            }

            
            const existingPayments = await AsyncStorage.getItem(paymentsKey);
            if (!existingPayments) {
                await AsyncStorage.setItem(paymentsKey, JSON.stringify(jamesPayments));
                console.log("💳 Injected 2 payment methods for James");
            } else {

                console.log("✅ Payment methods already up to date");

            }



        } catch (err) {
            console.error("❌ Error injecting data for James:", err);
        }
      };
      
      





    useEffect(() => {
        const logAsyncStorage = async () => {
          const keys = await AsyncStorage.getAllKeys();
          const items = await AsyncStorage.multiGet(keys);
          console.log("📦 AsyncStorage contents:");
          items.forEach(([key, value]) => {
            console.log(`${key}:`, JSON.parse(value));
          });
        };
      
        logAsyncStorage();
    }, []);


    const logAllUsers = async () => {
        try {
          const data = await AsyncStorage.getItem('users');
          const users = data ? JSON.parse(data) : [];
          console.log('👥 Saved Users:');
          users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.firstName} ${user.lastName} – ${user.email}`);
          });
        } catch (error) {
          console.error('❌ Failed to log users:', error);
        }
      };
      
    useEffect(() => {
        logAllUsers();
        injectDefaultUser();
        console.log("✅ WelcomeScreen is rendering");
    }, []);
    

    return (
        <ImageBackground
            source={require("../../assets/images/Onboarding.png")}
            style={styles.container}
            resizeMode="cover">
            <View style={styles.overlay}>
                <View style={styles.topSpace}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>CONCORDIA</Text>
                        <Image source={require("../../assets/le_gym.png")} style={styles.logo}/>
                    </View>
                </View>

                {/* CREATE ACCOUNT */}
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => setShowCreateAccount(true)}>
                    <Text style={styles.createButtonText}>CREATE ACCOUNT</Text>
                </TouchableOpacity>

                {/* LOG IN */}
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => setLoginVisible(true)}>
                    <Text style={styles.loginButtonText}>LOG IN</Text>
                </TouchableOpacity>

                {/* Login Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={loginVisible}
                    onRequestClose={() => {
                    setLoginVisible(false);
                }}>
                    <LoginModal
                        onClose={() => setLoginVisible(false)}
                        onContinue={async(email, password) => {
                            try {
                              const allUsers = await AsyncStorage.getItem('users');
                              if (!allUsers) {
                                alert('No users found. Please sign up first.');
                                return;
                              }
                              const users = JSON.parse(allUsers);
                              const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
                          
                              if (user && user.password === password) {
                                console.log('✅ Login successful');
                                await AsyncStorage.setItem('activeUser', JSON.stringify(user)); // Store logged-in user
                                setLoginVisible(false);
                                navigation.navigate('Home');
                              } else {
                                alert('Incorrect email or password.');
                              }
                          
                            } catch (error) {
                              console.error('❌ Login failed:', error);
                              alert('An error occurred during login. Please try again.');
                            }
                          }}
                          
                        onGoToForgotPassword={() => {
                        setLoginVisible(false);
                        navigation.navigate('ForgotPassword');
                    }}
                        onGoToSignup={() => {
                        setLoginVisible(false);
                        setShowCreateAccount(true);
                    }}/>

                </Modal>

                {/* Create Account Modal */}

                <Modal visible={showCreateAccount} transparent animationType="slide">
                    <CreateAccountModal
                        onClose={() => setShowCreateAccount(false)}
                        onContinue={(info) => {
                        setUserInfo(prev => ({
                            ...prev,
                            ...info
                        }));
                        
                        setShowCreateAccount(false);
                        setShowCreatePassword(true);
                    }}
                    onGoToLogIn={() => {
                      setShowCreateAccount(false);
                      setLoginVisible(true);
                  }}
                    
                    />
                </Modal>
                <Modal visible={showCreatePassword} transparent animationType="slide">
                    <CreatePasswordModal
                        onClose={() => setShowCreatePassword(false)}
                        onContinue={async(password) => {
                        const newUser = {
                            ...userInfo,
                            password,
                            memberSince: new Date().toISOString(),
                            membership: 'Monthly'
                        };
                        try {
                            const existing = await AsyncStorage.getItem('users');
                            let users = existing ? JSON.parse(existing) : [];

                            const isDuplicate = users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase());
                            if (isDuplicate) {
                            alert('An account with this email already exists.');
                            return;
                            }

                            users.push(newUser);
                            await AsyncStorage.setItem('users', JSON.stringify(users));
                            await AsyncStorage.setItem('activeUser', JSON.stringify(newUser));

                            console.log(`✅ User created and saved! with email: ${newUser.email}`);
                            setShowCreatePassword(false);
                            navigation.navigate("Home");
                        } catch (err) {
                            console.error('❌ Failed to save user:', err);
                        }
                    }}/>
                </Modal>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%"
    },
    overlay: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 80,
        backgroundColor: "rgba(0,0,0,0.4)", // subtle dark overlay
    },
    topSpace: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    titleContainer: {
        alignItems: "center",
        marginBottom: 60
    },
    title: {
        fontSize: 36,
        color: "white",
        fontFamily: "DMSans-Bold",
        marginBottom: 10
    },
    logo: {
        width: 93,
        height: 33,
        resizeMode: "contain"
    },
    subtitle: {
        fontSize: 28,
        color: "white",
        fontWeight: "600",
        marginBottom: 50
    },
    createButton: {
        backgroundColor: "#912338", // Concordia maroon
        paddingVertical: 14,
        paddingHorizontal: 60,
        borderRadius: 30,
        marginBottom: 15,
        width: "80%"
    },
    createButtonText: {
        color: "white",
        textAlign: "center",
        fontSize: 14,
        fontFamily: "Montserrat-Bold"
    },
    loginButton: {
        backgroundColor: "white",
        paddingVertical: 14,
        paddingHorizontal: 60,
        borderRadius: 30,
        width: "80%"
    },
    loginButtonText: {
        color: "#000",
        fontWeight: "bold",
        textAlign: "center"
    }
});
