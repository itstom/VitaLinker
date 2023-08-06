//Navigation/MainNavigator.tsx
import React, { useEffect, useState } from 'react';
import { useAuthService } from '../services/AuthService';
import SplashScreen from '../screens/SplashScreen';
import { GuestNavigator, UserNavigator } from './NavigationRoutes';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SPLASH_DISPLAY_INTERVAL = 1000 * 60 * 30;  // 30 minutes, adjust this as per your needs

const MainNavigator = () => {
    const { user } = useAuthService();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const checkLastOpenedTimestamp = async () => {
            const lastOpened = await AsyncStorage.getItem('lastOpenedTimestamp');
            if (!lastOpened || (Date.now() - parseInt(lastOpened) > SPLASH_DISPLAY_INTERVAL)) {
                setShowSplash(true);
                setTimeout(() => setShowSplash(false), 3000);  // display splash screen for 3 seconds
            } else {
                setShowSplash(false);
            }
        };
        checkLastOpenedTimestamp();
    }, []);

    useEffect(() => {
        return () => {
            AsyncStorage.setItem('lastOpenedTimestamp', Date.now().toString());
        };
    }, []);

    if (showSplash) {
        return <SplashScreen />;
    }
    return isAuthenticated ? <UserNavigator /> : <GuestNavigator />;
};

export default MainNavigator;
