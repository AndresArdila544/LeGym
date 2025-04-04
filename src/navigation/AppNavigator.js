// src/navigation/AppNavigator.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import SplashScreen from '../screens/SplashScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash">
                <Stack.Screen
                    name="Splash"
                    component={SplashScreen}
                    options={{
                    headerShown: false
                }}/>
                <Stack.Screen
                    name="Welcome"
                    component={WelcomeScreen}
                    options={{
                    headerShown: false
                }}/>
                <Stack.Screen name="Home" component={HomeScreen}options={{
                    headerShown: false
                }}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
