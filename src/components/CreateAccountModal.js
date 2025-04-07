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
    Platform,
    KeyboardAvoidingView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import CustomInlineDatePicker from './InlineDatePicker';
import SelectionInput from './InlineSelectionPicker';

export default function CreateAccountModal({onClose, onContinue, onGoToLogIn}) {
    const slideAnim = useRef(new Animated.Value(300)).current;

    const [firstName,
        setFirstName] = useState('');
    const [lastName,
        setLastName] = useState('');
    const [email,
        setEmail] = useState('');
    const [showDatePicker,
        setShowDatePicker] = useState(false);
    const [date,
        setDate] = useState(new Date());
    const [gender,
        setGender] = useState('');
    const [open,
        setOpen] = useState(false);
    const [value,
        setValue] = useState(null);
    const [items,
        setItems] = useState([
        {
            label: 'Female',
            value: 'female'
        }, {
            label: 'Male',
            value: 'male'
        }, {
            label: 'Other',
            value: 'other'
        }
    ]);

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

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
        <View style={[StyleSheet.absoluteFill]}>
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
                            <Text style={styles.label}>First Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter first name"
                                placeholderTextColor="#888"
                                value={firstName}
                                onChangeText={setFirstName}/>

                            <Text style={styles.label}>Last Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter last name"
                                placeholderTextColor="#888"
                                value={lastName}
                                onChangeText={setLastName}/>

                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter email address"
                                placeholderTextColor="#888"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}/>

                            <Text style={styles.label}>Date of Birth</Text>

                            <CustomInlineDatePicker
                            style={styles.input}
                                value={date
                                .toISOString()
                                .split('T')[0]}
                                onDateChange={(formatted) => setDate(new Date(formatted))}/>

                            <Text style={styles.label}>Gender (Optional)</Text>
                            <SelectionInput
                            style={styles.input}
                                value={value}
                                options={[
                                {
                                    label: 'Female',
                                    value: 'female'
                                }, {
                                    label: 'Male',
                                    value: 'male'
                                }, {
                                    label: 'Other',
                                    value: 'other'
                                }
                            ]}
                                onValueChange={setValue}/>

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={() => {
                                if (!firstName || !lastName || !email) {
                                    alert('Please fill in all required fields.');
                                    return;
                                }
                                if (!isValidEmail(email)) {
                                    alert('Please enter a valid email address.');
                                    return;
                                }
                                onContinue({
                                    firstName,
                                    lastName,
                                    email,
                                    dateOfBirth: date.toISOString(),
                                    gender: value || ''
                                });
                            }}>
                                <Text style={styles.buttonText}>CONTINUE</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                onClose();
                                onGoToLogIn();
                            }}>
                                <Text style={styles.footerText}>
                                    Already a member?
                                    <Text style={styles.linkText}>Log in</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                    {/* </KeyboardAvoidingView> */}
                </Animated.View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    modalWrapper: {
        width: '100%',
        maxHeight: '90%', // or a fixed height like 500
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    keyboardAvoiding: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        marginBottom: 20
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
        marginTop:15
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        //marginBottom: 15,
        fontSize: 14,
        color: '#000'
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 20
    },
    picker: {
        height: 40,
        color: '#000'
    },
    continueButton: {
        marginTop: 15,
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
