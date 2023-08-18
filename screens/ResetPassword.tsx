//screens/ResetPassword.tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Title, Snackbar } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { AppDispatch, RootState } from '../redux/store';
import { resetPasswordSuccess, resetPasswordFailure } from '../redux/authSlice';

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
        dispatch(resetPasswordSuccess());
        setEmail('');
        setSnackbarVisible(true);
    } catch (error: any) { 
        console.log('Error sending reset password email:', error);
        let errorMessage = 'Ha ocurrido un error.';
        if (error && typeof error.message === 'string') {
            errorMessage = error.message;
        }
        dispatch(resetPasswordFailure(errorMessage));
    } finally {
        setIsLoading(false);
    }
    };

  return (
    <View>
      <Title>Olvidé mi contraseña</Title>
      <TextInput
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button mode="contained" onPress={handleResetPassword} loading={isLoading}>
        Restablecer contraseña.
      </Button>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        Por favor, ingrese su correo electrónico.
      </Snackbar>
    </View>
  );
};

export default ResetPasswordScreen;