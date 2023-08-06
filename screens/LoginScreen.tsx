// LoginScreen.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, TextInput, ActivityIndicator } from 'react-native-paper';
import { GuestStackNavigationProp, LoginScreenProps } from '../types/types';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { loginSuccess } from '../redux/actions/authActions';
import { SimpleUser } from '../redux/actions/authActions';
import { Image } from 'react-native';
import { RootState, useAppDispatch } from '../redux/store';
import { toggleTheme  } from '../redux/themeSlice';
import Toast from 'react-native-toast-message';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { setPhoneVerificationStatus, userLoginWithPhone } from '../redux/userSlice';
import { useAuthService } from '../services/AuthService';
import { useSelector } from 'react-redux';
import ButtonStyles from '../design/styles';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';


type LoginScreenParams = {
  Login?: {
    email: string;
    password: string;
  };
};

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
            const firebaseUser = await signIn(email, password);
          
            if (!firebaseUser || !firebaseUser.email) {
              throw new Error('No email associated with this user');
            }
            const user: SimpleUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email
            };
            try {
              await dispatch(loginSuccess(user));
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                })
              );
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
                  dispatch(userLoginWithPhone(cleaned))
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
                  dispatch(userLoginWithPhone(cleaned))
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
        };
        console.log("User: ", user);
        dispatch(loginSuccess(user)); // Dispatch action to store the logged in user
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

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, route }) => { 
  const theme = useSelector((state: RootState) => state.theme.current);
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

/*   const handleMockLogin = () => {
    console.log('Mock login');
    // Call the navigation.navigate function to navigate to the HomeScreen
    navigation.navigate('MainApp');

  }; */

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
            source={logo}
            resizeMode="contain"
            style={{ alignSelf: 'center', marginBottom: 20, width: '100%', height: 150 }}
          />
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
            secureTextEntry={!isPasswordVisible}
            style={{ marginBottom: 10, backgroundColor: theme.colors.background }}
            right={
              <TouchableOpacity onPress={togglePasswordVisibility} style={{ justifyContent: 'center', marginRight: 10 }}>
                <Icon 
                  name={isPasswordVisible ? 'eye-off' : 'eye'}
                  size={50} 
                  color={theme.colors.background}
                />
              </TouchableOpacity>
            } 
          />
           <TextInput
                label="Phone Number"
                value={formattedPhoneNumber}
                onChangeText={handlePhoneNumberChange}
                onSubmitEditing={handlePhoneNumberLogin}
                keyboardType="phone-pad"
                style={{ marginBottom: 15, backgroundColor: theme.colors.background }}
              />
          <Button mode="contained" 
            onPress={handleLogin} 
            style={[ButtonStyles.roundedButton, { marginBottom: 10 }]}
            disabled={isLoginDisabled}
          >
            Login
          </Button>
          {isPhoneVerifying ? (
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
                style={[ButtonStyles.roundedButton, { marginBottom: 10 }]}
              >
                Validate
              </Button>
              <Button mode="text" 
                onPress={handleCancelVerification} 
                style={[ButtonStyles.roundedButton, { marginBottom: 10 }]}
              >
                Cancel Verification
              </Button>
            </>
          ) : (
            <>
              <Button
                mode="text"
                onPress={() => navigation.navigate('ResetPassword')}
              >
                Forgot Password?
              </Button>

              <Button
                mode="text"
                onPress={() => navigation.navigate('Register')}
              >
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
