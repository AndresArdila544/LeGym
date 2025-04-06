// src/screens/ClassesScreen.js
import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import ClassCard from '../components/ClassCard';
import BottomNavigationBar from '../components/BottomNavigationBar';

const classData = [
    {
        id: '1',
        title: 'Yoga',
        image: require('../../assets/images/classes/yoga.png')
    }, {
        id: '2',
        title: 'Hardcore',
        image: require('../../assets/images/classes/hardcore.png')
    }, {
        id: '3',
        title: 'Kinesis',
        image: require('../../assets/images/classes/kinessis.png')
    }, {
        id: '4',
        title: 'Zumba Fitness',
        image: require('../../assets/images/classes/zumba.png')
    }, {
        id: '5',
        title: 'Yoga II',
        image: require('../../assets/images/classes/yoga.png')
    }, {
        id: '6',
        title: 'Personal Trainer',
        image: require('../../assets/images/classes/personal.png')
    }
];

export default function ClassesScreen({navigation}) {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Available Classes</Text>
            <FlatList
                data={classData}
                renderItem={({item}) => (<ClassCard
                title={item.title}
                image={item.image}
                onPress={() => navigation.navigate('ClassDetail', {classInfo: item})}/>)}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.grid}
                showsVerticalScrollIndicator={false}/>
                <BottomNavigationBar active="home" navigation={navigation} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingHorizontal: 12
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#8B1C3B',
        marginVertical: 12
    },
    grid: {
        paddingBottom: 80
    }
});
