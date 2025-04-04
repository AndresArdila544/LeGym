import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    ImageBackground
} from 'react-native';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import WeeklyWorkout from '../components/WeeklyWorkout';
import CrowdMeterCard from '../components/CrowdMeterCard';
import crowded from '../../assets/images/crowded.png';
import BottomNavigationBar from '../components/BottomNavigationBar';
import LockerPromoCard from '../components/LockerPromoCard';

export default function HomeScreen() {
    const bookedClasses = [
        {
            id: 1,
            type: 'STRENGTH TRAINING CLASS',
            time: '5:30 PM',
            coach: 'Coach Raymond',
            image: 'https://via.placeholder.com/150'
        }, {
            id: 2,
            type: 'YOGA CLASS',
            time: '3:35 PM',
            coach: 'Coach Ashley',
            image: 'https://via.placeholder.com/150'
        }
    ];
    

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <Image
                    source={require('../../assets/le_gym.png')}
                    style={styles.logoImage}
                    resizeMode="contain"/>
                <View style={styles.headerIcons}>
                    <Ionicons name="notifications-outline" size={24} color="#333"/>
                    <TouchableOpacity style={styles.profileCircle}/>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                flex: 1
            }}>
                {/* GREETING CARD */}

                <ImageBackground source={require('../../assets/images/HomeHead.png')} // update path if needed
                    style={styles.hero} imageStyle={{

                }} resizeMode="cover">
                    <Image source={require('../../assets/images/Overlay.png')} // your gradient image
                        style={styles.gradientOverlay} resizeMode="cover"/>
                    <View style={styles.heroTextWrapper}>
                        <Text style={styles.heroTitle}>Hi John! 👋</Text>
                        <Text style={styles.heroSub}>Ready for your next workout?</Text>
                        <Text style={styles.streak}>🔥 Streak: 5 Days</Text>
                    </View>
                </ImageBackground>


                <View style={styles.cards}>
                {/* WEEKLY WORKOUTS */}
                <WeeklyWorkout />

                {/* CROWD METER */}
                <CrowdMeterCard current={15} max={250} backgroundImage={crowded} style={styles.cardSpacing} />
                </View>
                {/* BOOKED CLASSES */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Booked Classes</Text>
                </View>
                {bookedClasses.map((item) => (
                    <View key={item.id} style={styles.classCard}>
                        <Image
                            source={{
                            uri: item.image
                        }}
                            style={styles.classImage}/>
                        <View style={styles.classDetails}>
                            <Text style={styles.classTitle}>{item.type}</Text>
                            <Text style={styles.classInfo}>{item.time}
                                • {item.coach}</Text>
                            <TouchableOpacity style={styles.cancelButton}>
                                <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                {/* LOCKER PROMO */}
                <LockerPromoCard />
            </ScrollView>

            {/* BOTTOM NAVIGATION */}
            <BottomNavigationBar active="home" onChatPress={() => console.log('Chat tapped!')}/>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    
    cardSpacing: {
      marginTop: 16, // space between workout card and occupancy
    },
    header: {
        padding: 20,
        paddingTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logoText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000'
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center'
    },
    profileCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#ccc'
    },
    hero: {
        width: 393,
        height: 135,
        overflow: 'hidden',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
        alignSelf: 'stretch'
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        width: 393,
        height: 135,
        zIndex: 1
    },
    heroTextWrapper: {
      zIndex: 2,
    },
    heroTitle: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    heroSub: {
      color: '#eee',
      fontSize: 12,
      marginTop: 2,
    },
    streak: {
      color: '#fff',
      fontSize: 12,
      marginTop: 4,
      fontWeight: '600',
    },
    welcomeText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700'
    },
    subtitle: {
        color: '#fff',
        fontSize: 14
    },
    streak: {
        color: '#fff',
        fontSize: 13,
        marginTop: 8,
        fontWeight: '600'
    },
    greetingCard: {
        marginHorizontal: 20,
        marginBottom: 20
    },
    greetingText: {
        fontSize: 22,
        fontWeight: '600'
    },
    
    weeklyTracker: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20
    },
    dayCircle: {
        backgroundColor: '#eee',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 12
    },
    dayText: {
        fontSize: 14
    },
    crowdMeter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f9f9f9',
        marginHorizontal: 20,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20
    },
    crowdText: {
        fontSize: 16
    },
    capacityBadge: {
        backgroundColor: '#8B1C3B',
        padding: 8,
        borderRadius: 20
    },
    capacityText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    sectionHeader: {
        marginHorizontal: 20,
        marginBottom: 10
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600'
    },
    classCard: {
        flexDirection: 'row',
        backgroundColor: '#f3f3f3',
        marginHorizontal: 20,
        marginBottom: 15,
        borderRadius: 10,
        overflow: 'hidden'
    },
    classImage: {
        width: 90,
        height: 90
    },
    classDetails: {
        flex: 1,
        padding: 10,
        justifyContent: 'center'
    },
    classTitle: {
        fontWeight: 'bold',
        fontSize: 14
    },
    classInfo: {
        fontSize: 12,
        color: '#555',
        marginBottom: 5
    },
    cancelButton: {
        backgroundColor: '#8B1C3B',
        paddingVertical: 6,
        borderRadius: 20,
        alignItems: 'center'
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12
    },
    promoBanner: {
        backgroundColor: '#ddd',
        padding: 20,
        margin: 20,
        borderRadius: 10
    },
    promoText: {
        fontSize: 14
    },
    boldText: {
        fontWeight: 'bold'
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderColor: '#eee'
    }
});
