import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Alert,
    Modal
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';

export default function PaymentMethodScreen({route, navigation}) {
    const selectedMembership = route
        ?.params
            ?.selectedMembership;
    const userInfo = route
        ?.params
            ?.userInfo;
    const [paymentMethods,
        setPaymentMethods] = useState([]);
    const [defaultMethod,
        setDefaultMethod] = useState(null);
    const [activeUser,
        setActiveUser] = useState(userInfo || null);
    const isFocused = useIsFocused();
    const [showSummary,
        setShowSummary] = useState(false);

    const getMembershipPrice = (type) => {
        switch (type) {
            case 'Monthly':
                return '$50/month';
            case 'Annual':
                return '$275/year';
            case 'Weekly':
                return '$35/week';
            default:
                return '$50/month';
        }
    };

    useEffect(() => {
        console.log("🧭 Route Params:", route
            ?.params);
    }, []);

    useEffect(() => {
        const loadUser = async() => {
            if (!userInfo) {
                const stored = await AsyncStorage.getItem('activeUser');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setActiveUser(parsed);
                }
            }
        };
        loadUser();
    }, []);

    useEffect(() => {
        const loadPaymentMethods = async() => {
            if (!activeUser) 
                return;
            const key = getStorageKey();
            try {
                const storedMethods = await AsyncStorage.getItem(key);
                if (storedMethods) {
                    const parsedMethods = JSON.parse(storedMethods);
                    setPaymentMethods(parsedMethods);

                    const defaultCard = parsedMethods.find(m => m.isDefault);
                    setDefaultMethod(defaultCard
                        ? defaultCard.id
                        : parsedMethods[0]
                            ?.id);
                }
            } catch (error) {
                console.error('Failed to load payment methods:', error);
            }
        };
        if (isFocused && activeUser) {
            loadPaymentMethods();
        }
    }, [isFocused, activeUser]);

    const getStorageKey = () => {
        if (activeUser) 
            return `paymentMethods_${activeUser.email}`;
        if (userInfo) 
            return `paymentMethods_pending_${userInfo.email}`;
        return null;
    };

    const handleSetDefault = async(id) => {
        try {
            const updatedMethods = paymentMethods.map(method => ({
                ...method,
                isDefault: method.id === id
            }));
            setPaymentMethods(updatedMethods);
            setDefaultMethod(id);

            await AsyncStorage.setItem(getStorageKey(), JSON.stringify(updatedMethods));
        } catch (error) {
            console.error('Failed to set default payment method:', error);
        }
    };

    const handleDeleteMethod = (id) => {
        Alert.alert('Delete Payment Method', 'Are you sure you want to delete this payment method?', [
            {
                text: 'Cancel',
                style: 'cancel'
            }, {
                text: 'Delete',
                style: 'destructive',
                onPress: async() => {
                    try {
                        const updatedMethods = paymentMethods.filter(method => method.id !== id);
                        if (id === defaultMethod && updatedMethods.length > 0) {
                            updatedMethods[0].isDefault = true;
                            setDefaultMethod(updatedMethods[0].id);
                        }
                        setPaymentMethods(updatedMethods);
                        await AsyncStorage.setItem(getStorageKey(), JSON.stringify(updatedMethods));
                    } catch (error) {
                        console.error('Failed to delete payment method:', error);
                    }
                }
            }
        ], {cancelable: true});
    };

    const maskCardNumber = (number) => `•••• •••• •••• ${number.slice(-4)}`;

    const handleCreateUser = async() => {
        if (!userInfo || !selectedMembership) {
            Alert.alert('Missing information', 'User info or membership is missing.');
            return;
        }

        const newUser = {
            ...userInfo,
            memberSince: new Date().toISOString(),
            membership: selectedMembership
        };

        try {
            const existing = await AsyncStorage.getItem('users');
            let users = existing
                ? JSON.parse(existing)
                : [];

            const exists = users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase());
            if (exists) {
                Alert.alert('Account exists', 'An account with this email already exists.');
                return;
            }

            users.push(newUser);
            await AsyncStorage.setItem('users', JSON.stringify(users));
            const pendingKey = `paymentMethods_pending_${newUser.email}`;
            const actualKey = `paymentMethods_${newUser.email}`;
            const pendingCardsJson = await AsyncStorage.getItem(pendingKey);
            if (pendingCardsJson) {
                await AsyncStorage.setItem(actualKey, pendingCardsJson);
                await AsyncStorage.removeItem(pendingKey);
            }
            await AsyncStorage.setItem('activeUser', JSON.stringify(newUser));

            console.log('✅ User created via onboarding:', newUser.email);

            navigation.reset({
                index: 0,
                routes: [
                    {
                        name: 'Home'
                    }
                ]
            });
        } catch (err) {
            console.error('❌ Failed to create user:', err);
            Alert.alert('Error', 'Failed to create your account. Try again.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#912338"/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment Methods</Text>
                <View style={{
                    width: 24
                }}/>
            </View>
            <View style={styles.body}>
                <ScrollView contentContainerStyle={styles.scrollContent} style={styles.content}>
                    {paymentMethods.length > 0
                        ? (paymentMethods.map((method) => (
                            <View key={method.id} style={styles.paymentCard}>
                                <View style={styles.cardTypeContainer}>
                                    <Ionicons
                                        name={method.type === 'Visa'
                                        ? 'card'
                                        : 'card-outline'}
                                        size={24}
                                        color="#912338"/>
                                    <Text style={styles.cardType}>{method.type}</Text>
                                </View>

                                <Text style={styles.cardNumber}>{maskCardNumber(method.cardNumber)}</Text>
                                <Text style={styles.cardHolder}>{method.cardHolder}</Text>

                                <View style={styles.cardActions}>
                                    {method.id === defaultMethod
                                        ? (
                                            <View style={styles.defaultBadge}>
                                                <Text style={styles.defaultText}>Default</Text>
                                            </View>
                                        )
                                        : (
                                            <TouchableOpacity
                                                style={styles.setDefaultButton}
                                                onPress={() => handleSetDefault(method.id)}>
                                                <Text style={styles.setDefaultText}>Set as Default</Text>
                                            </TouchableOpacity>
                                        )}

                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => handleDeleteMethod(method.id)}>
                                        <Ionicons name="trash-outline" size={20} color="#800000"/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )))
                        : (
                            <View style={styles.emptyState}>
                                <Ionicons name="card-outline" size={64} color="#ccc"/>
                                <Text style={styles.emptyText}>No payment methods added yet</Text>
                            </View>
                        )}

                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => navigation.navigate('AddCard', {
                        userInfo: userInfo || null,
                        selectedMembership: selectedMembership || null
                    })}>
                        <Ionicons name="add" size={24} color="white"/>
                        <Text style={styles.addButtonText}>Add Payment Method</Text>
                    </TouchableOpacity>

                </ScrollView>

                {userInfo && selectedMembership && (
                    <View style={styles.bottomFixed}>
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={() => {
                            if (!defaultMethod) 
                                return Alert.alert('No default method selected');
                            setShowSummary(true);
                        }}>
                            <Text style={styles.confirmButtonText}>Confirm & Proceed</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <Modal visible={showSummary} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Review your selection</Text>
                        <Text>
                            Membership:
                            <Text
                                style={{
                                fontWeight: 'bold'
                            }}>{selectedMembership}</Text>
                        </Text>
                        <Text>
                            Price:
                            <Text
                                style={{
                                fontWeight: 'bold'
                            }}>{getMembershipPrice(selectedMembership)}</Text>
                        </Text>
                        <Text
                            style={{
                            marginVertical: 6
                        }}>
                            Card:
                            <Text
                                style={{
                                fontWeight: 'bold'
                            }}>
                                {maskCardNumber(paymentMethods.find(m => m.id === defaultMethod)
                                    ?.cardNumber || '')}
                            </Text>
                        </Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                onPress={() => setShowSummary(false)}
                                style={[styles.modalBtn, styles.modalCancel]}>
                                <Text style={styles.modalCancelText}>Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleCreateUser}
                                style={[styles.modalBtn, styles.modalConfirm]}>
                                <Text style={styles.modalConfirmText}>Pay</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    body: {
        flex: 1,
        //justifyContent: 'space-between'
    },
    scrollContent: {
        paddingBottom: 40
    },
    bottomFixed: {
        paddingHorizontal: 16,
        paddingBottom: 20,
        backgroundColor: '#fff'
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#912338"
    },
    content: {
        flex: 1,
        padding: 16
    },
    paymentCard: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16
    },
    cardTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    cardType: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8
    },
    cardNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8
    },
    cardHolder: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    defaultBadge: {
        backgroundColor: '#912338',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4
    },
    defaultText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12
    },
    setDefaultButton: {
        paddingVertical: 6
    },
    setDefaultText: {
        color: '#912338',
        fontWeight: '500'
    },
    deleteButton: {
        padding: 8
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 16,
        textAlign: 'center'
    },
    addButton: {
        flexDirection: 'row',
        backgroundColor: '#912338',
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        marginBottom: 32
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8
    },

    confirmButton: {
        backgroundColor: '#912338',
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalBox: {
        backgroundColor: '#fff',
        width: '80%',
        padding: 24,
        borderRadius: 12
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginTop: 20
    },
    modalBtn: {
        flex: 1,
        padding: 12,
        borderRadius: 20,
        alignItems: 'center'
    },
    modalCancel: {
        backgroundColor: '#f1f1f1'
    },
    modalCancelText: {
        fontWeight: 'bold'
    },
    modalConfirm: {
        backgroundColor: '#912338'
    },
    modalConfirmText: {
        color: '#fff',
        fontWeight: 'bold'
    }
});
