import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LockerPromoCard({onPress}) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <ImageBackground
                source={require('../../assets/images/locker.png')}
                style={styles.image}
                imageStyle={styles.imageStyle}
            >
                <View style={styles.overlay} />

                <View style={styles.content}>
                    <View>
                        <Text style={styles.title}>
                            Need a Locker while you workout? <Text style={styles.bold}>It’s free!</Text>
                        </Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Padlock for $10</Text>
                        </View>
                    </View>

                    <Ionicons name="arrow-forward" size={22} color="#fff" />
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    card: {
        height: 130,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    imageStyle: {
        borderRadius: 16,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: 20,
        flex: 1,
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 6,
    },
    bold: {
        fontWeight: 'bold',
    },
    badge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
    },
});
