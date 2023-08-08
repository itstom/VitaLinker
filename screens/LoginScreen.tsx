// LoginScreen.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { Button, TextInput, ActivityIndicator } from 'react-native-paper';
import { GuestStackNavigationProp, GuestStackParamList, GuestStackRouteProp, LoginScreenProps} from '../types/types';
import { useNavigation } from '@react-navigation/native';

import { SimpleUser } from '../redux/authSlice';
import { Image } from 'react-native';
import { RootState, useAppDispatch } from '../redux/store';
import { toggleTheme  } from '../redux/themeSlice';
import Toast from 'react-native-toast-message';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { setPhoneVerificationStatus } from '../redux/userSlice';
import { loginWithPhone } from '../redux/authSlice';
import { useAuthService } from '../services/AuthService';
import { useSelector } from 'react-redux';
import getStyles from '../design/styles';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StackNavigationProp } from '@react-navigation/stack';
import { loginUserSuccess } from '../redux/authSlice';

type LoginScreenParams = {
  Login?: {
    email: string;
    password: string;
  };
};

type LoginScreenNavigationProp = StackNavigationProp<GuestStackParamList, 'Login'>;

const emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
const passwordRegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

const useLogin = () => {
  const navigation = useNavigation();
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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { signIn} = useAuthService();
  const theme = useSelector((state: RootState) => state.theme.current);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

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
          // Assuming emailRegExp and passwordRegExp are defined elsewhere in your code
          const isEmailAndPasswordValid = emailRegExp.test(email) && passwordRegExp.test(password);

          // Check if the email and password are valid, if so enable the login
          setIsLoginDisabled(!isEmailAndPasswordValid);
        }, [email, password]);

        useEffect(() => {
          // Check if the phone number is valid
          const isPhoneNumberValid = formattedPhoneNumber && formattedPhoneNumber !== '+1-';
      
          // If the phone number is valid and login is currently disabled (by email/password validation)
          // then enable the login
          if (isPhoneNumberValid && isLoginDisabled) {
            setIsLoginDisabled(false);
          }
        }, [formattedPhoneNumber, isLoginDisabled]);
      

      const handleLogin = async () => {
        setLoading(true);        
        // If email and password are provided
        if (email && password) {
            // Call email login function
            await emailLogin(email, password);
        }
        // If phone number is provided
        else if (phoneNumber) {
            handlePhoneNumberLogin();
        } 
        else {
            handleMissingCredentials();
        }
      };

      const handleInvalidCredentials = (email: string) => {
        console.warn("Invalid credentials provided for email:", email);
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
    };

      const emailLogin = async (email: string, password: string) => {
        console.log("Starting login process...");
        setLoading(true);
        try {
            console.log("Attempting Firebase login with email:", email);
            const firebaseUser = await signIn(email, password);
            console.log("Firebase login success:", firebaseUser);
            if (!firebaseUser || !firebaseUser.email) {
                throw new Error('No email associated with this user');
            }
            const user: SimpleUser = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                phoneNumber: null,
                displayName: firebaseUser.displayName,
            };
            try {
                console.log("Dispatching login success...");
                await dispatch(loginUserSuccess(user));
                console.log("Login success! Navigation dispatched to Home");
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
            console.error('Firebase login error:', error);
            let errorMessage;
            switch (error.code) {
                case 'auth/wrong-password':
                    errorMessage = 'The password is invalid';
                    handleInvalidCredentials(email);
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
      
      const handleMissingCredentials = () => {
          Toast.show({
              type: 'error',
              position: 'bottom',
              text1: 'Missing credentials',
              visibilityTime: 4000,
              autoHide: true,
              topOffset: 30,
              bottomOffset: 40
          });
          setLoading(false);
      };

        const handlePhoneNumberLogin = async () => {
          let cleaned = ('' + phoneNumber).replace(/\D/g, '');
          if (!cleaned.startsWith("1")) {
              cleaned = "1" + cleaned;
          }
          cleaned = "+" + cleaned;
          if (!cleaned || isNaN(Number(cleaned))) {
              Alert.alert('Error', 'Please enter a valid phone number');
              return;
          }
          setIsPhoneVerifying(true);
        
          auth().settings.forceRecaptchaFlowForTesting = true;
        
          // Mock SMS verification for testing
          if (__DEV__) {
              auth().settings.appVerificationDisabledForTesting = true;
              try {
                  const confirmationResult = await auth().signInWithPhoneNumber(cleaned, true);
                  setConfirmResult(confirmationResult);
                  // Dispatch the action here, but handle the promise returned by the async thunk
                  dispatch(loginWithPhone({ phoneNumber: cleaned}))
                      .then(() => {
                          // Handle the success case here if needed
                          console.log('Phone login success');
                      })
                      .catch((error: any) => {
                          // Handle any errors here
                          console.log('Phone login failed:', error);
                      });
              } catch (error: any) {
                  console.log(error);
                  setIsPhoneVerifying(false);
              }
              auth().settings.appVerificationDisabledForTesting = false;
          } else {
              try {
                  const confirmationResult = await auth().signInWithPhoneNumber(cleaned);
                  setConfirmResult(confirmationResult);
                  // Dispatch the action here, but handle the promise returned by the async thunk
                  dispatch(loginWithPhone({ phoneNumber: cleaned}))
                      .then(() => {
                          // Handle the success case here if needed
                          console.log('Phone login success');
                      })
                      .catch((error: any) => {
                          // Handle any errors here
                          console.log('Phone login failed:', error);
                      });
              } catch (error: any) {
                  console.log(error);
                  setIsPhoneVerifying(false);
              }
          }
      };      

const handleVerifyCode = async () => {
  if (verificationCode.length !== 6) {
    console.log('Invalid code');
    Toast.show({
      type: 'error',
      position: 'top',
      text1: 'Invalid code',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40
    });
    return;
  }
  try {
    console.log('Confirm result:', confirmResult);
    console.log('Verification code:', verificationCode);
    if(confirmResult) {
      // Confirm the SMS code using the local state confirmationResult
      const userCredential = await confirmResult.confirm(verificationCode);
      console.log("User Credential: ", userCredential); 
      if(userCredential && userCredential.user) {
        const user: SimpleUser = {
          uid: userCredential.user.uid,
          email: userCredential.user.email || '',
          phoneNumber: null,
          displayName: userCredential.user.displayName || '',
        };
        console.log("User: ", user);
        dispatch(loginUserSuccess(user)); // Dispatch action to store the logged in user
        dispatch(setPhoneVerificationStatus(true)); // Dispatch action to store that phone number is verified
      }
    }
  } catch (error: any) {
    console.log("Error: ", error);
    dispatch(setPhoneVerificationStatus(false)); // Dispatch action to store that phone number is not verified
  }
};

const handleCancelVerification = () => {
  setIsPhoneVerifying(false);
  setConfirmResult(null);
  setVerificationCode("");
  dispatch(setPhoneVerificationStatus(false));
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
    setFormattedPhoneNumber,
    isPasswordVisible,
    togglePasswordVisibility,
  };
};

const LoginScreen: React.FC< LoginScreenProps > = ({ navigation, route }) => {
  const theme = useSelector((state: RootState) => state.theme.current);
  const themedStyles = getStyles(theme);
  const logo = theme.logo;
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useAppDispatch(); 
  const { email, password } = (route.params as unknown as LoginScreenParams)?.Login || {};
  const { 
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
    setFormattedPhoneNumber,
    isPasswordVisible,
    togglePasswordVisibility,
  } = useLogin();

  const onToggleTheme = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  const ThemeButton = (
    <TouchableOpacity onPress={onToggleTheme} style={getStyles(theme).themeToggle}>
        <Image 
            source={theme.dark ? require('../assets/sun.png') : require('../assets/moon.png')}
            style={{ width: 30, height: 30 }}
            onLoad={() => console.log('Image loaded')}
            onError={(error) => console.log('Error loading image:', error)}
        />
    </TouchableOpacity>
);

const LoadingIndicator = (
    <View style={getStyles(theme).overlayStyle}>
        <ActivityIndicator size={'large'} color='#00b684' animating={true} />
    </View>
);

const LoginFormComponents = (
    <>
        <Image 
            source={logo}
            resizeMode="contain"
            style={{ alignSelf: 'center', marginBottom: 20, width: '100%', height: 150 }}
        />
        <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={[themedStyles.input,{backgroundColor: theme.colors.background}]}
        />
            <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            mode="outlined"
            style={[themedStyles.input, {marginBottom: 10, backgroundColor: theme.colors.background }]}
            right={
           <TextInput.Icon 
            icon={() => 
                <FontAwesome 
                    name={isPasswordVisible ? 'eye-slash' : 'eye'} 
                    size={20}
                    color={theme.colors.text}
                />
            }
            onPress={togglePasswordVisibility}
        />
    } 
/>

        <TextInput
            label="Phone Number"
            value={formattedPhoneNumber}
            onChangeText={handlePhoneNumberChange}
            onSubmitEditing={handlePhoneNumberLogin}
            mode="outlined"
            keyboardType="phone-pad"
            style={[themedStyles.input, {marginBottom: 15, backgroundColor: theme.colors.background }]}
        />
        <Button mode="outlined" 
            onPress={handleLogin} 
            style={[getStyles(theme).roundedButton, { marginBottom: 10 }]}
            disabled={isLoginDisabled}
        >
            Login
        </Button>
    </>
);

const PhoneVerificationComponents = (
    <>
        <TextInput
            label="Verification Code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType='numeric'
            style={{ marginBottom: 10, backgroundColor: theme.colors.background }}
        />
        <Button mode="contained" 
            onPress={handleVerifyCode} 
            style={[getStyles(theme).roundedButton, { marginBottom: 10 }]}
        >
            Validate
        </Button>
        <Button mode="text" 
            onPress={handleCancelVerification} 
            style={[getStyles(theme).roundedButton, { marginBottom: 10 }]}
        >
            Cancel Verification
        </Button>
    </>
);

const AdditionalButtons = (
    <>
        <Button mode="text" onPress={() => navigation.navigate('ResetPassword')}>Forgot Password?</Button>
        <Button mode="text" onPress={() => navigation.navigate('Register')}>Create a New Account</Button>
    </>
);

return (
    <View style={[getStyles(theme).containerStyle, { backgroundColor: theme.colors.background }]}>
        {ThemeButton}
        {loading ? LoadingIndicator : (
            <>
                {LoginFormComponents}
                {isPhoneVerifying ? PhoneVerificationComponents : AdditionalButtons}
            </>
        )}
    </View>
);
        }

export default LoginScreen;