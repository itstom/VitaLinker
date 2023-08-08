//screens/ResetPassword.tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Title, Snackbar } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { AppDispatch, RootState } from '../redux/store';
import { resetPasswordSuccess, resetPasswordFailed } from '../redux/authSlice';

const ResetPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleResetPassword = async () => {
    if (!email) {
      setSnackbarVisible(true);
      return;
    }
  
    setIsLoading(true);
  
    try {
        const auth = getAuth();
        await sendPasswordResetEmail(auth, email);
        dispatch(resetPasswordSuccess('Reset password email sent')); // Dispatch success action with a custom message
        setEmail('');
        setSnackbarVisible(true);
    } catch (error: any) { // error can be of any type
        console.log('Error sending reset password email:', error);
        let errorMessage = 'An error occurred';
        if (error && typeof error.message === 'string') {
            errorMessage = error.message;
        }
        dispatch(resetPasswordFailed(errorMessage));
    } finally {
        setIsLoading(false);
    }
    };

  return (
    <View>
      <Title>Forgot Password</Title>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button mode="contained" onPress={handleResetPassword} loading={isLoading}>
        Reset Password
      </Button>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        Please enter your email.
      </Snackbar>
    </View>
  );
};

export default ResetPasswordScreen;