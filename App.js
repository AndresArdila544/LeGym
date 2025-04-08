import React, {useCallback, useEffect, useState} from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import AppNavigator from './src/navigation/AppNavigator';

SplashScreen.preventAutoHideAsync();

export default function App() {
    const [appIsReady,
        setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                await Font.loadAsync({'DMSans-Bold': require('./assets/fonts/DMSans-Bold.ttf'), 'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf')});
            } catch (e) {
                console.warn(e);
            } finally {
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

    
      

    const onLayoutRootView = useCallback(async() => {
        if (appIsReady) {
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) 
        return null;
    
    return <AppNavigator onLayout={onLayoutRootView}/>;
}
