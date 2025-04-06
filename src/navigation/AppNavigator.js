// src/navigation/AppNavigator.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CalendarScreen from '../screens/CalendarScreen';
import FitnessTrackerScreen from '../screens/FitnessTrackerScreen';
import AddWorkoutScreen from '../screens/AddWorkoutScreen';
import ClassDetailScreen from '../screens/ClassDetailScreen';
import LockerRentalScreen from '../screens/LockerRentalScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MembershipScreen from '../screens/MembershipScreen';
import PaymentMethodScreen from '../screens/PaymentMethodScreen';
import AddCardScreen from '../screens/AddCardScreen';
import ClassesScreen from '../screens/ClassesScreen';

const Stack = createStackNavigator();

export default function AppNavigator({onLayout}) {
    return (
        <NavigationContainer onReady={onLayout}>
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{
                headerShown: false
            }}>
                <Stack.Screen name="Splash" component={SplashScreen}/>
                <Stack.Screen name="Welcome" component={WelcomeScreen}/>
                <Stack.Screen name="Login" component={LoginScreen}/>
                <Stack.Screen name="Register" component={RegisterScreen}/>
                <Stack.Screen name="Home" component={HomeScreen} options={{ gestureEnabled: false,animation: 'none' }}/>
                <Stack.Screen name="Calendar" component={CalendarScreen} options={{ gestureEnabled: false }}/>
                <Stack.Screen
                    name="FitnessTracker"
                    component={FitnessTrackerScreen}
                    options={{ gestureEnabled: false }}
                    screenOptions={{
                    headerShown: false
                }}/>
                <Stack.Screen name="AddWorkout" component={AddWorkoutScreen}/>
                <Stack.Screen name="ClassDetail" component={ClassDetailScreen}/>
                <Stack.Screen name="LockerRental" component={LockerRentalScreen}/>
                <Stack.Screen
                    name="Chat"
                    component={ChatScreen}
                    options={{
                    presentation: 'transparentModal',
                    animation: 'slide_from_bottom',
                    headerShown: false
                }}/>
                <Stack.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{ headerShown: false,gestureEnabled: false, animation: 'none' }}
                    />
                <Stack.Screen name="Membership" component={MembershipScreen}/>
                <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen}/>
                <Stack.Screen name="AddCard" component={AddCardScreen}/>
                <Stack.Screen name="ClassesScreen" component={ClassesScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
