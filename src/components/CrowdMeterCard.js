import React from 'react';
import {View, Text, ImageBackground, StyleSheet} from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';

export default function CrowdMeterCard({
    current = 15,
    max = 250,
    backgroundImage
}) {
    const occupancy = (current / max) * 100;

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../assets/images/crowded.png')}
                style={styles.image}
                imageStyle={styles.imageStyle}>
                <View style={styles.overlay}>
                    <Text style={styles.occupancyLabel}>Live Occupancy</Text>
                    <Text style={styles.status}>Not Crowded</Text>
                </View>
            </ImageBackground>
            <View style={styles.progressContainer}>
                <CircularProgress value={occupancy} radius={40} duration={1000} progressValueColor="#fff" maxValue={100} valueSuffix="%" valueFormatter={(value) => `${Math.round(value)}%`} // ✅ Force formatting
                    activeStrokeColor="limegreen" inActiveStrokeColor="#fff" inActiveStrokeOpacity={0.2} title={`${current}/${max}`} titleColor="#fff" titleFontSize={14}/>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#8B1C3B',
        borderRadius: 16,
        overflow: 'hidden',
        marginVertical: 20,
        width: '100%'
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        padding: 16
    },
    imageStyle: {
        resizeMode: 'cover'
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 12,
        padding: 10
    },
    occupancyLabel: {
        color: 'gold',
        fontSize: 12,
        fontWeight: '500'
    },
    status: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    progressContainer: {
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#8B1C3B'
    }
});
