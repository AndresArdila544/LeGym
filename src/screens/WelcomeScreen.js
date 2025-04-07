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
                            const storedUserData = await AsyncStorage.getItem('userData');
                            if (!storedUserData) {
                                alert('No user found. Please sign up first.');
                                return;
                            }
                            const user = JSON.parse(storedUserData);
                            if (email.trim().toLowerCase() === user.email.trim().toLowerCase() && password === user.password) {
                                console.log('✅ Login successful');
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
                            await AsyncStorage.setItem('userData', JSON.stringify(newUser));
                            console.log('✅ User created and saved!');
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
