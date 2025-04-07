import React, {useState, useRef, useEffect} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
    Animated,
    Keyboard,
    Platform,
    KeyboardAvoidingView,
    ScrollView
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';

export default function CreatePasswordModal({onClose, onContinue}) {
    const slideAnim = useRef(new Animated.Value(300)).current;

    const [password,
        setPassword] = useState('');
    const [confirmPassword,
        setConfirmPassword] = useState('');
    const [secureEntry,
        setSecureEntry] = useState(true);
    const [secureConfirm,
        setSecureConfirm] = useState(true);
    const [agree,
        setAgree] = useState(false);

    useEffect(() => {
        Animated
            .timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
        })
            .start();
    }, []);

    const validatePassword = (pw) => ({
        length: pw.length >= 10,
        uppercase: /[A-Z]/.test(pw),
        lowercase: /[a-z]/.test(pw),
        number: /\d/.test(pw),
        special: /[^A-Za-z0-9]/.test(pw)
    });

    const criteria = validatePassword(password);

    return (

        <View style={styles.overlayWrapper}>

            <TouchableWithoutFeedback onPress={onClose}>
                <View style={StyleSheet.absoluteFillObject}/>
            </TouchableWithoutFeedback>
            <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios'
                    ? 'padding'
                    : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios'
                    ? 0
                    : 0}
                    style={
                        styles.keyboardAvoiding
                }>
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
                            <Text style={styles.label}>Create Password</Text>
                            <View style={styles.passwordInput}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Password"
                                    secureTextEntry={secureEntry}
                                    onChangeText={setPassword}
                                    value={password}
                                    placeholderTextColor="#888"/>
                                <TouchableOpacity onPress={() => setSecureEntry(!secureEntry)}>
                                    <Ionicons
                                        name={secureEntry
                                        ? 'eye-off'
                                        : 'eye'}
                                        size={20}
                                        color="#888"/>
                                </TouchableOpacity>
                            </View>

                            {/* Password criteria checklist */}
                            <View style={styles.criteriaWrapper}>
                                <Text
                                    style={[
                                    styles.criteria, criteria.uppercase && styles.valid
                                ]}>
                                    ✔ 1 uppercase letter
                                </Text>
                                <Text
                                    style={[
                                    styles.criteria, criteria.lowercase && styles.valid
                                ]}>
                                    ✔ 1 lowercase letter
                                </Text>
                                <Text
                                    style={[
                                    styles.criteria, criteria.number && styles.valid
                                ]}>
                                    ✔ 1 number
                                </Text>
                                <Text
                                    style={[
                                    styles.criteria, criteria.special && styles.valid
                                ]}>
                                    ✔ 1 special character
                                </Text>
                                <Text
                                    style={[
                                    styles.criteria, criteria.length && styles.valid
                                ]}>
                                    ✔ Minimum 10 characters
                                </Text>
                            </View>

                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={styles.passwordInput}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm Password"
                                    secureTextEntry={secureConfirm}
                                    onChangeText={setConfirmPassword}
                                    value={confirmPassword}
                                    placeholderTextColor="#888"/>
                                <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
                                    <Ionicons
                                        name={secureConfirm
                                        ? 'eye-off'
                                        : 'eye'}
                                        size={20}
                                        color="#888"/>
                                </TouchableOpacity>
                            </View>

                            {/* Terms & Conditions */}
                            <View style={styles.checkboxRow}>
                                <Checkbox value={agree} onValueChange={setAgree}/>
                                <Text style={styles.terms}>
                                    I agree to the
                                    <Text style={styles.link}>Terms & Conditions</Text>.
                                </Text>
                            </View>

                            <TouchableOpacity style={styles.continueButton} 
                            onPress={() => {
                                if (!agree) return alert('Please agree to the terms');
                                if (password !== confirmPassword) return alert('Passwords do not match');
                                const isValid = Object.values(criteria).every(Boolean);
                                if (!isValid) return alert('Password does not meet criteria');
                                
                                onContinue(password);
                              }}
                            >
                                <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <Text style={styles.footerText}>
                                    Already a member?
                                    <Text style={styles.linkText}>Log in</Text>
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
    modalWrapper: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        
    },
    keyboardAvoiding: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    innerContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end'
      },
    modalContent: {
        width: '100%',
        padding: 24,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5
    },
    passwordInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 15
    },
    input: {
        flex: 1,
        height: 40,
        color: '#000'
    },
    criteriaWrapper: {
        marginBottom: 10
    },
    criteria: {
        fontSize: 12,
        color: '#888'
    },
    valid: {
        color: 'green'
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    terms: {
        marginLeft: 8,
        fontSize: 13,
        color: '#555'
    },
    link: {
        color: '#8B1C3B',
        fontWeight: 'bold'
    },
    continueButton: {
        backgroundColor: '#8B1C3B',
        padding: 14,
        borderRadius: 30,
        marginBottom: 15
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    footerText: {
        textAlign: 'center',
        fontSize: 13,
        color: '#555'
    },
    linkText: {
        fontWeight: 'bold',
        color: '#8B1C3B'
    }
});
