// src/components/BottomNavigationBar.js
import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

export default function BottomNavigationBar({active, navigation}) {
    return (
        <>
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
                    : '#666'}/>
            </TouchableOpacity>

            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.tabButton}
                    onPress={() => navigation.navigate('Home')}>
                    <Ionicons
                        name={active === 'home'
                        ? 'home'
                        : 'home-outline'}
                        size={24}
                        color={active === 'home'
                        ? '#800000'
                        : '#666'}/>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tabButton}
                    onPress={() => navigation.navigate('Calendar')}>
                    <Ionicons
                        name={active === 'calendar'
                        ? 'calendar'
                        : 'calendar-outline'}
                        size={24}
                        color={active === 'calendar'
                        ? '#800000'
                        : '#666'}/>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tabButton}
                    onPress={() => navigation.navigate('FitnessTracker')}>
                    <Ionicons
                        name={active === 'fitness'
                        ? 'fitness'
                        : 'fitness-outline'}
                        size={24}
                        color={active === 'fitness'
                        ? '#800000'
                        : '#666'}/>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tabButton}
                    onPress={() => navigation.navigate('Profile')}>
                    <Ionicons
                        name={active === 'profile'
                        ? 'person'
                        : 'person-outline'}
                        size={24}
                        color={active === 'profile'
                        ? '#800000'
                        : '#666'}/>
                </TouchableOpacity>
            </View>
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#111',
        paddingVertical: 14,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 35
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
    }

});
