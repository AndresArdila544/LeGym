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
        backgroundColor: "#8B1C3B", // Concordia maroon
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
