// Navigation/MainNavigator.tsx
import React from 'react';
import { useAuthService } from '../services/AuthService';
import { GuestNavigator, UserNavigator } from './NavigationRoutes';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const MainNavigator = () => {
    const { user } = useAuthService();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    // Depending on authentication state, render the appropriate navigator.
return isAuthenticated ? <UserNavigator isAuthenticated={isAuthenticated} /> : <GuestNavigator isAuthenticated={isAuthenticated} />;
};

export default MainNavigator;