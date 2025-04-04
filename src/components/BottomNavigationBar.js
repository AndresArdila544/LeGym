import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BottomNavigationBar({ active = 'home', onChatPress }) {
    return (
        <>
            {/* Floating Chat Button */}
            <TouchableOpacity style={styles.chatButton} onPress={onChatPress}>
                <Ionicons name="chatbubble-ellipses" size={24} color="#8B1C3B" />
            </TouchableOpacity>

            {/* Bottom Nav Bar */}
            <View style={styles.navBar}>
                <Ionicons name="home" size={24} color={active === 'home' ? '#8B1C3B' : '#ccc'} />
                <Ionicons name="calendar" size={24} color={active === 'calendar' ? '#8B1C3B' : '#ccc'} />
                <Ionicons name="stats-chart" size={24} color={active === 'stats' ? '#8B1C3B' : '#ccc'} />
                <Ionicons name="person" size={24} color={active === 'profile' ? '#8B1C3B' : '#ccc'} />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#111',
        paddingVertical: 14,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 35
        
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
