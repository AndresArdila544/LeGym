import React, {useState, useEffect, useRef} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Platform
} from 'react-native';

export default function LoginModal({onClose, onContinue, onGoToForgotPassword, onGoToSignup}) {
    const [email,
        setEmail] = useState('');
    const [password,
        setPassword] = useState('');
    const slideAnim = useRef(new Animated.Value(300)).current;

    useEffect(() => {
        Animated
            .timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
        })
            .start();
    }, []);

    return (
        <View style={styles.overlayWrapper}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={StyleSheet.absoluteFillObject}/>
            </TouchableWithoutFeedback>

            <KeyboardAvoidingView
                style={styles.keyboardAvoiding}
                behavior={Platform.OS === 'ios'
                ? 'padding'
                : 'height'}
                keyboardVerticalOffset={0}>

                <Animated.View
                    style={[
                    styles.modalWrapper, {
                        transform: [
                            {
                                translateY: slideAnim
                            }
                        ]
                    }
                ]}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalContent}>
                            <View style={styles.field}>
                                <Text style={styles.label}>Email</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter email address"
                                    placeholderTextColor="#888"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType='email-address'
                                    />
                            </View>

                            <View style={styles.field}>
                                <Text style={styles.label}>Password</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter password"
                                    placeholderTextColor="#888"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}/>
                            </View>

                            <TouchableOpacity onPress={onGoToForgotPassword}>
                                <Text style={styles.forgot}>Forgot Password?</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.loginButton}
                                onPress={() => {
                                if (!email || !password) {
                                    alert("Please enter both email and password.");
                                    return;
                                }
                                onContinue(email.trim().toLowerCase(), password);
                            }}>
                                <Text style={styles.loginButtonText}>LOG IN</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                onClose();
                                onGoToSignup();
                            }}>
                                <Text style={styles.signupText}>
                                    Don’t have an account?{' '}
                                    <Text style={styles.signupLink}>Signup</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </Animated.View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    overlayWrapper: {
        flex: 1,
        justifyContent: 'flex-end',
        ...StyleSheet.absoluteFillObject
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    keyboardAvoiding: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    modalWrapper: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 24,
        paddingVertical: 30
    },
    modalContent: {
        width: '100%'
    },
    field: {
        marginBottom: 15
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
        color: '#333',
        fontWeight: '600'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        fontSize: 14
    },
    forgot: {
        textAlign: 'center',
        color: '#1e90ff',
        fontSize: 13,
        marginVertical: 15
    },
    loginButton: {
        backgroundColor: '#912338',
        padding: 14,
        borderRadius: 30,
        marginBottom: 15
    },
    loginButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'Montserrat-Bold'
    },
    signupText: {
        textAlign: 'center',
        fontSize: 13,
        color: '#555'
    },
    signupLink: {
        color: '#912338',
        fontWeight: 'bold'
    }
});
