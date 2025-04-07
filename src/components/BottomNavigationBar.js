// src/components/BottomNavigationBar.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BottomNavigationBar({ active, navigation }) {
    return (
        <View style={styles.navContainer}>
            {/* Floating Chat Button */}

            <TouchableOpacity
                style={styles.chatButton}
                onPress={() => navigation.navigate('Chat')}>


                <Ionicons
                    name={active === 'chat'
                        ? 'chatbubble'
                        : 'chatbubble-outline'}
                    size={24}
                    color={active === 'chat'
                        ? '#800000'
                        : '#666'} />
            </TouchableOpacity>

            <View style={styles.container}>

                <TouchableOpacity
                    style={styles.tabButton}
                    onPress={() => navigation.navigate('Home')}
                >
                    {active === 'home' ? (
                        <View style={styles.activeCircle}>
                            <Ionicons name="home" size={24} color="#fff" />
                        </View>
                    ) : (
                        <Ionicons name="home-outline" size={24} color="whitesmoke" />
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tabButton}
                    onPress={() => navigation.navigate('Calendar')}
                >
                    {active === 'calendar' ? (
                        <View style={styles.activeCircle}>
                            <Ionicons name="calendar" size={24} color="#fff" />
                        </View>
                    ) : (
                        <Ionicons name="calendar-outline" size={24} color="whitesmoke" />
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tabButton}
                    onPress={() => navigation.navigate('FitnessTracker')}
                >
                    {active === 'fitness' ? (
                        <View style={styles.activeCircle}>
                            <Ionicons name="fitness" size={24} color="#fff" />
                        </View>
                    ) : (
                        <Ionicons name="fitness-outline" size={26} color="whitesmoke" />
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tabButton}
                    onPress={() => navigation.navigate('Profile')}
                >
                    {active === 'profile' ? (
                        <View style={styles.activeCircle}>
                            <Ionicons name="person" size={24} color="#fff" />
                        </View>
                    ) : (
                        <Ionicons name="person-outline" size={22} color="whitesmoke" />
                    )}
                </TouchableOpacity>
            </View>
        </View>

    );
}
const styles = StyleSheet.create({
    navContainer: {
        position: 'relative',
        bottom: 0,
        zIndex: 1,
        // backgroundColor: 'transparent'
        // backgroundColor: 'red'
    },
    container: {
        flexDirection: 'row',
        // backgroundColor: 'red',
        height: 60,
        width: '92%',
        margin: 'auto',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#111',
        // paddingVertical: 14,
        borderRadius: 10,
        // marginBottom: 30
    },
    tabButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    chatButton: {
        position: 'absolute',
        right: 20,
        bottom: 80,
        backgroundColor: '#000',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5
    },
    activeCircle: {
        backgroundColor: '#800000',
        padding: 10,
        borderRadius: 25,
      },

});
