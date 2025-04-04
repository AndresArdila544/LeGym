import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions
    .get('window')
    .width;
const PILL_WIDTH = SCREEN_WIDTH / 8; // 7 items + a bit of margin

const days = [
    {
        label: 'Sun',
        completed: true
    }, {
        label: 'Mon',
        completed: true
    }, {
        label: 'Tue',
        completed: true
    }, {
        label: 'Wen',
        completed: false
    }, {
        label: 'Thu',
        completed: true
    }, {
        label: 'Fri',
        completed: false
    }, {
        label: 'Sat',
        completed: false
    }
];

export default function WeeklyWorkout() {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>My workouts this week</Text>
                <Text style={styles.link}>See more</Text>
            </View>

            {/* Days */}
            <View style={styles.dayRow}>
                {days.map((day, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                        styles.dayPill, day.completed
                            ? styles.completed
                            : styles.pending
                    ]}
                        activeOpacity={0.8}>
                        <Text
                            style={[
                            styles.dayText, day.completed
                                ? styles.textWhite
                                : styles.textGray
                        ]}>
                            {day.label}
                        </Text>
                        <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color={day.completed
                            ? 'white'
                            : '#ccc'}
                            style={styles.icon}/>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginTop: 16,
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,

        // Android elevation
        elevation: 4
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000'
    },
    link: {
        fontSize: 13,
        color: '#000',
        textDecorationLine: 'underline'
    },
    dayRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    dayPill: {
        width: 44, // Longer pill
        height: 64, // Slightly taller
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        marginHorizontal: 2 // Optional spacing tweak
    },
    completed: {
        backgroundColor: '#8B1C3B'
    },
    pending: {
        backgroundColor: '#f2f2f2'
    },
    dayText: {
        fontSize: 13,
        marginBottom: 2
    },
    icon: {
        marginTop: 1
    },
    textWhite: {
        color: 'white'
    },
    textGray: {
        color: '#aaa'
    }
});
