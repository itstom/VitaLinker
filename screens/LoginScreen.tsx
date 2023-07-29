// LoginScreen.tsx
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { Button, TextInput, Text, ActivityIndicator } from 'react-native-paper';
import { AuthStackNavigationProp } from '.././types/types'
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/actions/authActions';
import AuthService from '../services/AuthService';
import { SimpleUser } from '../redux/actions/authActions'

const phoneRegExp = /^\+1-\d{3}-\d{3}-\d{4}$/;
const authService = AuthService(); 

interface LoginScreenProps {
  // Add props here
}

const LoginScreen: React.FC<LoginScreenProps> = (props) => {
  const navigation = useNavigation<AuthStackNavigationProp<'Login'>>();
  const dispatch = useDispatch();


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePhoneNumber = (phoneNumber: string) => {
    return phoneRegExp.test(phoneNumber);
  }

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const firebaseUser = await authService.signIn(email, password);
      console.log('User signed in:', firebaseUser.email);
  
      if (firebaseUser.email === null) {
        // handle the situation when email is null
        console.log('No email associated with this user');
        return;
      }
      
      const user: SimpleUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email
      };
    
      // Dispatch action
      dispatch(loginSuccess(user));
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('Failed to sign in:', errorCode, errorMessage);
    }
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    // Handle Google login functionality here
  }

  const handlePhoneNumberLogin = () => {
    if (validatePhoneNumber(phoneNumber)) {
      // Handle Phone Number login functionality here
    } else {
      Alert.alert('Error', 'Please enter a valid phone number');
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 16 }}>
      {loading && <ActivityIndicator animating={true} />}
      {!loading && (
        <>
          <Text style={{ alignSelf: 'center', marginBottom: 20, fontSize: 24 }}>Logo</Text>
          <TextInput
            label="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            style={{ marginBottom: 10 }}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry
            style={{ marginBottom: 10 }}
          />
          <Button mode="contained" onPress={() => handleLogin(email, password)} style={{ marginBottom: 10 }}>
            Login
          </Button>
          <Button mode="outlined" onPress={handleGoogleLogin} style={{ marginBottom: 10 }}>
            Login with Google
          </Button>
          <TextInput
            label="Phone Number"
            value={phoneNumber}
            onChangeText={text => setPhoneNumber(text)}
            style={{ marginBottom: 10 }}
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
    </View>
  );
}

export default LoginScreen;
