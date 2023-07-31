// services/AuthService.ts
import auth from '@react-native-firebase/auth';

export default function AuthService() {

  const signIn = async (email: string, password: string) => {
    try {
      const { user } = await auth().signInWithEmailAndPassword(email, password);
      console.log('User signed in:', user);
      return user;
    } catch (error) {
      console.error('Failed to sign in:', error);
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
    signIn,
    signInWithPhoneNumber,
    signOut,
    signUp,
    resetPassword,
  };
}