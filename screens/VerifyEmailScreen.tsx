// VerifyEmailScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { logIn } from '../redux/userSlice';
import { getAuth, User, sendEmailVerification } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';

const VerifyEmailScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  const auth = getAuth();
  let user: User | null = auth.currentUser;

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  useEffect(() => {
    if (user) {
      auth.onAuthStateChanged((currentUser) => {
        if (currentUser && currentUser.emailVerified) {
          dispatch(logIn());
          console.log('User is verified!');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Auth', params: { screen: 'Login' }}],
        });
        }
      });
    }
  }, [user, dispatch, auth]);

  const handleResendVerificationEmail = async () => {
    if (user) {
      try {
        await sendEmailVerification(user);
        console.log('Verification email sent!');
      } catch (error) {
        console.log('Error sending verification email:', error);
      }
    }
  };

  const handleVerify = async () => {
    if (user) {
      await user.reload();

      if (user.emailVerified) {
        dispatch(logIn());
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main', params: { screen: 'Home' }}],
      });
      } else {
        // Handle unverified email...
      }
    }
  };

  return (
    <View>
      {isAuthenticated ? (
        <Text>Your email is verified. You can navigate to the next screen.</Text>
      ) : (
        <>
          <Text>Please verify your email to continue.</Text>
          <Button title="Resend Verification Email" onPress={handleResendVerificationEmail} />
          <Button title="Verify Email" onPress={handleVerify} />
          {/* You can add more UI components as needed */}
        </>
      )}
    </View>
  );
};

export default VerifyEmailScreen;