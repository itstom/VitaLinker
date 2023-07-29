// RegisterScreen.tsx
import React from 'react';
import { Button, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { AuthStackParamList } from '../types/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { setCurrentUser } from '../redux/actions/authActions';
import { useDispatch } from 'react-redux';

type navigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<navigationProp>();
  const dispatch = useDispatch();

  const handleRegister = async (email: string, password: string) => {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Dispatch the user information to the redux store
      dispatch(setCurrentUser(userCredential.user));
      // Navigate to Verify Email screen after successful registration
      navigation.navigate('VerifyEmail');
    } catch (error) {
      // Handle error...
    }
  };

  // Use props here
  return (
    <View>
      <Text>Register Screen</Text>
      <Button
        title="Register"
        onPress={() => handleRegister("test@email.com", "password")} // dummy data, replace it with your actual data
      />
    </View>
  );
}

export default RegisterScreen;