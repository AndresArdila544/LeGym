// src/components/ClassCard.js
import React from 'react';
import {View, Text, ImageBackground, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

export default function ClassCard({title, image, onPress}) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <ImageBackground
                source={image}
                style={styles.image}
                imageStyle={styles.imageStyle}>
                <View style={styles.overlay}/>
                <View style={styles.cardFooter}>
                    <Text style={styles.title}>{title}</Text>
                    <Ionicons name="arrow-forward-circle" size={22} color="#fff"/>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 8,
        borderRadius: 16,
        overflow: 'hidden',
        aspectRatio: 0.85, // Adjust as needed
    },
    image: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    imageStyle: {
        borderRadius: 16
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(139, 28, 59, 0.3)'
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12
    },
    title: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16
    }
});
