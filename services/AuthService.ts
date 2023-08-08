// services/AuthService.ts
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { loginUserSuccess, loginUserFailure } from '../redux/authSlice';
import { useState } from 'react';
import { User } from '../types/types'

export const useAuthService = () => {
  const [user, setUser] = useState<User | null>(null);
  const dispatch = useDispatch();

  const signIn = async (email: string, password: string) => {
    try {
      const { user } = await auth().signInWithEmailAndPassword(email, password);
      console.log('User signed in:', user);
      dispatch(loginUserSuccess(user));
      setUser({
        uid: user.uid,
        email: user.email,
        phoneNumber: user.phoneNumber,
        displayName: user.displayName,
        isEmailVerified: user.emailVerified,
        isAnonymous: user.isAnonymous,
        photoURL: user.photoURL,
      });
      return user;
    } catch (error) {
      console.error('Failed to sign in:', error);
      dispatch(loginUserFailure("Failed to sign in"));
      throw error;
    }
  };

  const signInWithPhoneNumber = async (phoneNumber: string) => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      console.log('Confirmation result:', confirmation);
      return confirmation;
    } catch (error) {
      console.error('Failed to sign in with phone number:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await auth().signOut();
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Failed to sign out:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { user } = await auth().createUserWithEmailAndPassword(email, password);
      console.log('User account created & user signed in successfully:', user);
      return user;
    } catch (error) {
      console.error('Failed to sign up:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await auth().sendPasswordResetEmail(email);
      console.log('Password reset email sent successfully');
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw error;
    }
  };

  return {
    user,
    signIn,
    signInWithPhoneNumber,
    signOut,
    signUp,
    resetPassword,
  };
}