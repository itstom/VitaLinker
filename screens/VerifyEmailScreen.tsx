// VerifyEmailScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';

import { getAuth, User, sendEmailVerification } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserStackParamList } from '../types/types';
import getStyles from '../design/styles';
import { Theme } from '../redux/themeSlice';
import { markEmailAsVerified } from '../redux/userSlice';

const VerifyEmailScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const auth = getAuth();
  const user: User | null = auth.currentUser;
  const navigation = useNavigation<StackNavigationProp<UserStackParamList>>();
  const theme: Theme = useSelector((state: RootState) => state.theme.current);
  const styles = getStyles(theme);

  useEffect(() => {
    if (user) {
      auth.onAuthStateChanged((currentUser) => {
        if (currentUser && currentUser.emailVerified) {
          console.log('User is verified!');
          dispatch(markEmailAsVerified());
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }
      });
    }
  }, [user, dispatch, auth, navigation]);

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
    <View style={styles.container}>
      {isAuthenticated ? (
        <Text style={styles.text}>Your email is verified. You can navigate to the next screen.</Text>
      ) : (
        <>
          <Text style={styles.text}>Please verify your email to continue.</Text>
          <TouchableOpacity style={[styles.button, styles.roundedButton]} onPress={handleResendVerificationEmail}>
            <Text style={styles.text}>Resend Verification Email</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default VerifyEmailScreen;


