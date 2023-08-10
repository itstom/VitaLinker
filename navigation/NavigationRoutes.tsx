// NavigationRoutes.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ResetPasswordScreen from '../screens/ResetPassword';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';
import { GuestStackParamList, UserStackParamList } from '../types/types';
import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, useAppSelector } from '../redux/store';
import { useWindowDimensions } from 'react-native';
import { DrawerContentComponentProps, createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Drawer as PaperDrawer } from 'react-native-paper';
import { logoutUser } from '../redux/authSlice';
import { darkTheme } from '../design/themes';
import { lightTheme } from '../design/themes';

type NavigationRoutesProps = {
  isAuthenticated: boolean;
};

type UserNavigatorProps = {
  isAuthenticated: boolean;
};

type DrawerNavProp = DrawerNavigationProp<UserStackParamList, 'Home'>;

const UserNavigatorWrapper = () => <UserNavigator isAuthenticated={true} />;
const GuestNavigatorWrapper = () => <GuestNavigator isAuthenticated={false} />;

const GuestStack = createStackNavigator<GuestStackParamList>();
const UserDrawer = createDrawerNavigator<UserStackParamList>();
const RootStack = createStackNavigator();

export const GuestNavigator: React.FC<NavigationRoutesProps> = ({ isAuthenticated }) => {
  return (
    <GuestStack.Navigator initialRouteName='Login'>
      <GuestStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false, title: 'Login' }}
      />
      <GuestStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false, title: 'Register'}}
      />
      <GuestStack.Screen
        name="VerifyEmail"
        component={VerifyEmailScreen}
        options={{ headerShown: false }}
      />
      <GuestStack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ headerShown: false }}
      />
    </GuestStack.Navigator>
  );
};

export const UserNavigator: React.FC<UserNavigatorProps> = ({ isAuthenticated }) => {
  const themeType = useAppSelector((state: RootState) => state.theme.current);
    // Based on the string value, get the appropriate theme object
    const actualTheme = themeType === 'dark' ? darkTheme : lightTheme;
    const dimensions = useWindowDimensions();
    const CustomPaperDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
    const dispatch = useDispatch();

    const handleLogout = () => {
      dispatch(logoutUser())
        .then(() => {
          // Navigate to the 'Login' screen in the 'Guest' stack
          props.navigation.reset({
            index: 0,
            routes: [{ name: 'Guest' }],
          });
        })
        .catch((error) => {
          // Handle any potential error here
          console.error(error);
        });
    };
    
    return (
        <><PaperDrawer.Section title="Menu">
        <PaperDrawer.Item
          label="Home"
          onPress={() => props.navigation.navigate('Home')} />
        <PaperDrawer.Item
          label="Dashboard"
          onPress={() => props.navigation.navigate('Dashboard')} />
        <PaperDrawer.Item
          label="Settings"
          onPress={() => props.navigation.navigate('Settings')} />
      </PaperDrawer.Section><PaperDrawer.Section title="Sign Out">
          <PaperDrawer.Item
            label="Log out"
            onPress={handleLogout} />
        </PaperDrawer.Section></>
    );
  };

  return (
    <UserDrawer.Navigator 
        initialRouteName="Home"
        drawerContent={props => <CustomPaperDrawerContent {...props} />}
        screenOptions={({ navigation }) => ({
            headerStyle: {
                backgroundColor: actualTheme.colors.primary,
            },
            headerTintColor: actualTheme.colors.text,
            headerLeft: () => (
                <Icon 
                    name="bars" 
                    size={25} 
                    color={actualTheme.colors.text} 
                    onPress={() => navigation.toggleDrawer()} 
                />
            )
        })}
    >
      <UserDrawer.Screen name="Home" component={HomeScreen} />
      <UserDrawer.Screen name="Dashboard" component={DashboardScreen} />
      <UserDrawer.Screen name="Settings" component={SettingsScreen} />
    </UserDrawer.Navigator>
  );
};

export const RootNavigator = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return (
    <RootStack.Navigator>
      { isAuthenticated ? (
          <RootStack.Screen name="Main" component={UserNavigatorWrapper} />
        )  : (
          <RootStack.Screen name="Guest" component={GuestNavigatorWrapper} />
        )
      }
    </RootStack.Navigator>
  );
};