// VerifyEmailScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, useAppSelector } from '../redux/store';
import { getAuth, User, sendEmailVerification, reload } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserStackParamList } from '../types/types';
import getStyles from '../design/styles';
import { markEmailAsVerified } from '../redux/userSlice';
import { darkTheme } from '../design/themes';
import { lightTheme } from '../design/themes';

const VerifyEmailScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const auth = getAuth();
  const user: User | null = auth.currentUser;
  const navigation = useNavigation<StackNavigationProp<UserStackParamList>>();
  const actualTheme = useAppSelector(state => state.theme.current === 'dark' ? darkTheme : lightTheme);
  const themedStyles = getStyles(actualTheme);

  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (user) {
      const verificationCheck = setInterval(async () => {
        setIsChecking(true);

        // Reload user to refresh emailVerified status
        await reload(user);
        
        if (user.emailVerified) {
          console.log('User is verified!');
          dispatch(markEmailAsVerified());
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
          clearInterval(verificationCheck);
        }
        
        setIsChecking(false);
      }, 5000);

      return () => clearInterval(verificationCheck); // Cleanup on unmount
    }
  }, [user, dispatch, navigation]);

  const handleResendVerificationEmail = () => {
    if (user) {
      sendEmailVerification(user)
        .then(() => {
          console.log('Verification email sent!');
        })
        .catch(error => {
          console.log('Error sending verification email:', error);
        });
    }
  };

  return (
    <View style={[getStyles(actualTheme).containerStyle]}>
      {isAuthenticated ? (
        <Text style={[getStyles(actualTheme).text]}>Your email is verified. You can navigate to the next screen.</Text>
      ) : (
        <>
          <Text style={[getStyles(actualTheme).text]}>Please verify your email to continue.</Text>
          <TouchableOpacity style={[getStyles(actualTheme).button]} onPress={handleResendVerificationEmail}>
            <Text style={[getStyles(actualTheme).text]}>Resend Verification Email</Text>
          </TouchableOpacity>
          {isChecking && <Text style={[getStyles(actualTheme).text]}>Checking for verification...</Text>}
        </>
      )}
    </View>
  );
};

export default VerifyEmailScreen;