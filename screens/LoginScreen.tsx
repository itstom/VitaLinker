// LoginScreen.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, TextInput, Text, ActivityIndicator, useTheme } from 'react-native-paper';
import { AuthStackNavigationProp } from '../types/types';
import { useNavigation } from '@react-navigation/native';
import { loginSuccess } from '../redux/actions/authActions';
import AuthService from '../services/AuthService';
import { SimpleUser } from '../redux/actions/authActions';
import { Image } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { toggleTheme  } from '../redux/themeSlice';
import Toast from 'react-native-toast-message';
import { PhoneAuthProvider } from 'firebase/auth';
import { firebase } from '@react-native-firebase/auth';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

const emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
const passwordRegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
const authService = AuthService();

interface LoginScreenProps {
  username?: string;
  password?: string;
  onLogin?: (username: string, password: string) => void;
  phoneNumber?: string;
}

const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+1-');
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('+1-');
  const [rawPhoneNumber, setRawPhoneNumber] = useState("1");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [isLoginDisabled, setIsLoginDisabled] = useState(true);
  const [confirmResult, setConfirmResult] = useState<null | FirebaseAuthTypes.ConfirmationResult>(null);
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [isPhoneVerifying, setIsPhoneVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const formatPhoneNumber = (string: string) => {
    // Filter only numbers from the input
    let cleaned = ('' + string).replace(/\D/g, '');
  
    // Check if the input is of correct
    let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  
    if (match) {
      // Remove the matched extension code
      // Change this to format for any country code.
      let intlCode = (match[1] ? '+1 ' : '');
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
  
    return null;
  };

  const handlePhoneNumberChange = (text: string) => {
    // Filter only numbers from the input
    const rawNumber = text.replace(/\D/g, '');
  
    // Preserve the format if the input starts with '+1-' and has only one additional number
    if (text.startsWith('+1-') && text.length === 4) {
      setPhoneNumber(text);
      setFormattedPhoneNumber(text);
    } else {
      // Check if the result is null before setting the formatted number
      const formattedNumber = formatPhoneNumber(rawNumber);
      if (formattedNumber !== null) {
        setPhoneNumber(rawNumber);
        setFormattedPhoneNumber(formattedNumber);
      } else {
        // If the input is empty or contains only formatting characters, set the state accordingly
        setPhoneNumber(rawNumber);
        setFormattedPhoneNumber(text);
      }
    }
  };
  

useEffect(() => {
    setIsLoginDisabled(!(emailRegExp.test(email) && passwordRegExp.test(password)));
  }, [email, password]);

  const validateEmailAndPassword = (email: string, password: string) => {
    if (email.trim() === "" || password.trim() === "") {
      return false;
    }
    
    return true;
  };

    const handleLogin = async () => {
    setLoading(true);
    if (!validateEmailAndPassword(email, password)) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Invalid credentials',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40
      });
      setLoading(false);
      return;
    }
  
    try {
      const firebaseUser = await authService.signIn(email, password);
  
      if (!firebaseUser || !firebaseUser.email) {
        throw new Error('No email associated with this user');
      }
      
      const user: SimpleUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email
      };
  
      try {
        await dispatch(loginSuccess(user));
      } catch (err) {
        console.error('Error dispatching login success:', err);
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Login Error',
          text2: 'Error occurred while processing login.',
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40
        });
      }
    } catch (error: any) {
      let errorMessage;
      switch(error.code) {
        case 'auth/wrong-password':
          errorMessage = 'The password is invalid';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many login attempts. Please try again later.';
          break;
        default:
          errorMessage = 'Login failed. Please try again later.';
      }
    
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Login Error',
        text2: errorMessage,
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40
      });
    
      setLoading(false);
    }
};

const handlePhoneNumberLogin = async () => {
  // Filter only numbers from the input
  let cleaned = ('' + phoneNumber).replace(/\D/g, '');

  // Prepend country code if missing. Here we are using +1 for US. Change accordingly.
  if (!cleaned.startsWith("1")) {
    cleaned = "1" + cleaned;
  }
  cleaned = "+" + cleaned;

  // Check if the input is empty or not numeric
  if (!cleaned || isNaN(Number(cleaned))) {
    Alert.alert('Error', 'Please enter a valid phone number');
    return;
  }

  setIsPhoneVerifying(true);

  try {
    const confirmation: FirebaseAuthTypes.ConfirmationResult = await auth().signInWithPhoneNumber(cleaned);

    setConfirmResult(confirmation);
  } catch (error: any) {
    console.log(error);
    Toast.show({
      type: 'error',
      position: 'top',
      text1: 'Phone number login error',
      text2: error.message,
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40
    });
  }
};

const confirmVerificationCode = async (verificationCode: string) => {
  if (!confirmResult) {
    console.error('No confirmation result available');
    return;
  }

  try {
    await confirmResult.confirm(verificationCode);
  } catch (error) {
    console.error('Confirmation error', error);
  }
};

const handleVerifyCode = async () => {
  if (verificationCode.length <= 0) {
    Toast.show({
      type: 'error',
      position: 'top',
      text1: 'Phone number login error',
      text2: 'Verification code cannot be empty',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40
    });
    return;
  }
  try {
    if(confirmResult) {
      const credential = auth.PhoneAuthProvider.credential(confirmResult.verificationId, verificationCode);
      const userCredential = await auth().signInWithCredential(credential);
      const user: SimpleUser = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
      };
      dispatch(loginSuccess(user));
    }
  } catch (error: any) {
    console.log(error);
    Toast.show({
      type: 'error',
      position: 'top',
      text1: 'Phone number login error',
      text2: 'Verification code is invalid',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40
    });
  }
};

const handleCancelVerification = () => {
  setIsPhoneVerifying(false);
  setConfirmResult(null);
  setVerificationCode("");
};

  return {
    email,
    password,
    phoneNumber,
    formattedPhoneNumber,
    rawPhoneNumber,
    loading,
    handleLogin,
    handlePhoneNumberLogin,
    setEmail,
    setPassword,
    isLoginDisabled,
    setVerificationCode,
    handleCancelVerification,
    handleVerifyCode,
    isPhoneVerifying, 
    setIsPhoneVerifying,
    verificationCode,
    confirmResult,
    isPhoneLogin,
    setIsPhoneLogin,
    handlePhoneNumberChange,
    formatPhoneNumber,
    setFormattedPhoneNumber
  };
};

const LoginScreen: React.FC<LoginScreenProps> = () => {
  const theme = useTheme();
  const navigation = useNavigation<AuthStackNavigationProp<'Login'>>();
  const { 
    email,
    password,
    phoneNumber,
    rawPhoneNumber,
    loading,
    handleLogin,
    handlePhoneNumberLogin,
    setEmail,
    setPassword,
    isLoginDisabled,
    setVerificationCode,
    handleCancelVerification,
    handleVerifyCode,
    isPhoneVerifying,
    setIsPhoneVerifying,
    verificationCode,
    confirmResult,
    isPhoneLogin,
    setIsPhoneLogin,
    handlePhoneNumberChange,
    formattedPhoneNumber,
    setFormattedPhoneNumber
  } = useLogin();

  const isDarkTheme = useAppSelector((state) => state.theme.dark);
  const dispatch = useAppDispatch();

  const onToggleTheme = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  const handleFormattedPhoneNumber = (input: string) => {
    handlePhoneNumberChange(input);
  };  

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity onPress={onToggleTheme} style={styles.themeToggle}>
            <Image 
                source={theme.dark 
                    ? require('../assets/sun.png')
                    : require('../assets/moon.png') 
                }
                style={{ width: 30, height: 30 }}
                onLoad={() => console.log('Image loaded')}
                onError={(error) => console.log('Error loading image:', error)}
            />
        </TouchableOpacity>
        {loading && <ActivityIndicator animating={true} />}
        {!loading && (
            <>
                <Image 
                    source={require('../assets/logo02.png')}
                    resizeMode="contain"
                    style={{ alignSelf: 'center', marginBottom: 20, width: '100%', height: 150 }}
                />
                {isPhoneVerifying ? (
                    <>
                        <TextInput
                            label="Verification Code"
                            value={verificationCode}
                            onChangeText={setVerificationCode}
                            keyboardType='numeric'
                            style={{ marginBottom: 10, backgroundColor: theme.colors.background }}
                        />
                        <Button mode="contained" onPress={handleVerifyCode} style={{ marginBottom: 10 }}>
                            Validate
                        </Button>
                        <Button mode="text" onPress={handleCancelVerification} style={{ marginBottom: 10 }}>
                            Cancel Verification
                        </Button>
                    </>
                ) : (
                    <>
                        <TextInput
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            style={{ marginBottom: 10, backgroundColor: theme.colors.background }}
                        />
                        <TextInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            style={{ marginBottom: 10, backgroundColor: theme.colors.background }}
                        />
                        <Button mode="contained" onPress={handleLogin} style={{ marginBottom: 10 }} disabled={isLoginDisabled}>
                            Login
                        </Button>
                        <TextInput
                            label="Phone Number"
                            value={formattedPhoneNumber}
                            onChangeText={(text) => handlePhoneNumberChange(text)}
                            onSubmitEditing={handlePhoneNumberLogin}
                            keyboardType="phone-pad"
                            style={{ marginBottom: 10, backgroundColor: theme.colors.background }}
                          />
                        <Button mode="outlined" onPress={handlePhoneNumberLogin} style={{ marginBottom: 10 }}>
                            Login with Phone Number
                        </Button>
                        <Button mode="text" onPress={() => navigation.navigate('ResetPassword')} style={{ marginBottom: 10 }}>
                            Forgot Password?
                        </Button>
                        <Button mode="text" onPress={() => navigation.navigate('Register')}>
                            Create a New Account
                        </Button>
                    </>
                )}
            </>
        )}
    </View>
);
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    paddingHorizontal: 16 
  },
  themeToggle: { 
    position: 'absolute', 
    top: 20, 
    right: 20 
  },
});
