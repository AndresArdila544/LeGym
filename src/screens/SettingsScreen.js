// src/screens/ProfileScreen.js
import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Modal,
    Image,
    Alert,
    TextInput
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNavigationBar from "../components/BottomNavigationBar";
import CustomInlineDatePicker from "../components/InlineDatePicker";
import SelectionInput from "../components/InlineSelectionPicker";
import Picker from "react-native-picker-select";

export default function SettingsScreen({navigation}) {

    const [userData,
        setUserData] = useState({
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@example.com",
        memberSince: "2023-09-01",
        membership: "Monthly",
        dateOfBirth: "",
        gender: "",
        weight: "97",
        height: "182.89"
    });
    const [updatedFirstName,
        setUpdatedFirstName] = useState(userData.firstName || "");
    const [updatedLastName,
        setUpdatedLastName] = useState(userData.lastName || "");
    const [updatedEmail,
        setUpdatedEmail] = useState(userData.email || "");
    const [updatedWeight,
        setUpdatedWeight] = useState(userData.weight || "");
    const [updatedHeight,
        setUpdatedHeight] = useState(userData.height || "");
    const [updatedDob,
        setUpdatedDob] = useState(userData.dateOfBirth || "");
    const [updatedGender,
        setUpdatedGender] = useState(userData.gender || "");
    const [cancelConfirmVisible,
        showConfirmationModal] = useState(false);

    const options = [
        {
            label: "Male",
            value: "Male"
        }, {
            label: "Female",
            value: "Female"
        }, {
            label: "Other",
            value: "Other"
        }
    ];

    useEffect(() => {
        const loadUserData = async() => {
            try {
                const storedUserData = await AsyncStorage.getItem("userData");
                console.log(storedUserData);

                if (storedUserData) {
                    const parsed = JSON.parse(storedUserData);
                    setUserData(parsed);
                    setUpdatedFirstName(parsed.firstName || '');
                    setUpdatedLastName(parsed.lastName || '');
                    setUpdatedEmail(parsed.email || '');
                    setUpdatedDob(parsed.dateOfBirth || '');
                    setUpdatedGender(parsed.gender || '');
                    setUpdatedWeight(parsed.weight || '');
                    setUpdatedHeight(parsed.height || '');
                } else {
                    await AsyncStorage.setItem('userData', JSON.stringify(userData))
                }
            } catch (error) {
                console.error("Failed to load user data:", error);
            }
        };

        loadUserData();
    }, []);

    const handleProfileUpdate = async() => {
        try {
            const updatedUser = {
                ...userData,
                firstName: updatedFirstName,
                lastName: updatedLastName,
                email: updatedEmail,
                dateOfBirth: updatedDob,
                gender: updatedGender,
                weight: updatedWeight,
                height: updatedHeight,
              };
              
              await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
              setUserData(updatedUser);
              showConfirmationModal(false);

        } catch (error) {
            console.error('Error canceling booking:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#800000"/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Update Profile</Text>
                <View style={{
                    width: 24
                }}/>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.profileSection}>
                    <View style={styles.profileImageContainer}>
                        <View style={styles.profileImage}>
                            <Text style={styles.profileInitials}>
                                {userData
                                    .firstName
                                    .charAt(0)}
                                {userData
                                    .lastName
                                    .charAt(0)}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.profileName}>
                        {userData.firstName } 
                        {userData.lastName}
                    </Text>
                    <Text style={styles.profileEmail}>{userData.email}</Text>
                </View>

                <View style={styles.formSection}>
                    <View style={styles.inputSect}>
                        <Text style={styles.inputLabel}>First Name</Text>
                        <TextInput
                            keyboardType="name-phone-pad"
                            value={updatedFirstName}
                            style={styles.inputBox}
                            onChangeText={setUpdatedFirstName}/>
                    </View>

                    <View style={styles.inputSect}>
                        <Text style={styles.inputLabel}>Last Name</Text>
                        <TextInput
                            keyboardType="name-phone-pad"
                            style={styles.inputBox}
                            value={updatedLastName}
                            onChangeText={setUpdatedLastName}/>
                    </View>

                    <View style={styles.inputSect}>
                        <Text style={styles.inputLabel}>Email Address</Text>
                        <TextInput
                            keyboardType="email-address"
                            style={styles.inputBox}
                            value={updatedEmail}
                            onChangeText={setUpdatedEmail}/>
                    </View>

                    <View style={styles.inputSect}>
                        <Text style={styles.inputLabel}>Date of Birth</Text>
                        <CustomInlineDatePicker
                            value={updatedDob}
                            onDateChange={(date) => {
                                setUpdatedDob(date);
                        }}/>
                    </View>

                    <View style={styles.inputSect}>
                        <Text style={styles.inputLabel}>Gender (Optional)</Text>
                        <SelectionInput options={options} value={updatedGender} onValueChange={setUpdatedGender}/>
                    </View>

                    <View style={styles.inputSect}>
                        <Text style={styles.inputLabel}>Weight (kg)</Text>
                        <TextInput
                            keyboardType="numeric"
                            style={styles.inputBox}
                            value={updatedWeight}
                            onChangeText={setUpdatedWeight}/>
                    </View>

                    <View style={styles.inputSect}>
                        <Text style={styles.inputLabel}>Height (cm)</Text>
                        <TextInput
                            keyboardType="numeric"
                            style={styles.inputBox}
                            value={updatedHeight}
                            onChangeText={setUpdatedHeight}/>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                        showConfirmationModal(true)
                    }}>
                        <Text style={styles.buttonText}>Confirm Changes</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Cancel Confirmation Modal */}
            <Modal visible={cancelConfirmVisible} transparent={true} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Are you sure?</Text>
                        <Text
                            style={{
                            textAlign: 'center',
                            marginBottom: 15
                        }}>You are about to update your profile details?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelModalButton]}
                                onPress={() => showConfirmationModal(false)}>
                                <Text style={styles.cancelModalButtonText}>No, Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmModalButton]}
                                onPress={handleProfileUpdate}>
                                <Text style={styles.confirmModalButtonText}>Yes, Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* <BottomNavigationBar active="profile" navigation={navigation}/> */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    header: {
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee"
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color:"#800000"
    },
    profileSection: {
        alignItems: "center",
        padding: 10,
        // borderBottomWidth: 1, borderBottomColor: '#eee',
    },
    profileImageContainer: {
        marginBottom: 10
    },
    profileImage: {
        width: 85,
        height: 85,
        borderRadius: 85,
        backgroundColor: "#800000",
        justifyContent: "center",
        alignItems: "center"
    },
    profileInitials: {
        fontSize: 26,
        fontWeight: "bold",
        color: "white"
    },
    profileName: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 4
    },
    profileEmail: {
        fontSize: 16,
        color: "#666",
        marginBottom: 16
    },
    content: {
        flex: 1
    },
    formSection: {
        // backgroundColor: 'red',
        width: "92%",
        margin: "auto",
        marginTop: 20
    },
    inputSect: {
        marginBottom: 20
    },
    inputLabel: {
        marginBottom: 8,
        fontSize: 14,
        color: "#414141",
        fontWeight: "bold"
    },
    inputBox: {
        width: "100%",
        height: 50,
        borderColor: "#BDBDBD",
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 15
    },
    button: {
        backgroundColor: "#800000",
        borderRadius: 8,
        padding: 16,
        alignItems: "center",
        marginTop: 16,
        marginBottom: 160
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold"
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        width: '80%',
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24
    },
    closeButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        backgroundColor: '#800000'
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 15
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 8
    },
    cancelModalButton: {
        borderColor: "black",
        borderWidth: 1
    },
    confirmModalButton: {
        backgroundColor: '#912338'
    },
    cancelModalButtonText: {
        color: '#333',
        fontWeight: 'bold'
    },
    confirmModalButtonText: {
        color: 'white',
        fontWeight: 'bold'
    }
});
