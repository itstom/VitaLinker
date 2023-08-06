// RegisterScreen.tsx
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { TextInput, Button, Menu, Provider } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { format } from 'date-fns';
import { GuestStackParamList } from '../types/types';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import styles from '../design/styles';
import { RootState } from '../redux/store';

type navigationProp = StackNavigationProp<GuestStackParamList, 'Register'>;

const genderOptions = ['Male', 'Female', 'Other'];
const diseaseOptions = ['Lupus', 'Rheumatoid arthritis', 'Type I diabetes'];

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<navigationProp>();
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.current);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [disease, setDisease] = useState('');
  const [diseaseMenuVisible, setDiseaseMenuVisible] = useState(false);
  const [genderMenuVisible, setGenderMenuVisible] = useState(false); // New state variable


  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setDateOfBirth(date);
    hideDatePicker();
  };

  const handleRegister = async () => {
    try {
      // Rest of the code...
    } catch (error) {
      // Handle error...
    }
  };

  function handleCancel(): void {
    navigation.goBack(); 
  }

  return (
    <Provider>
      <KeyboardAwareScrollView>
        <TextInput mode="outlined" label="Name" value={name} onChangeText={setName} style={styles.input} />
        <TextInput mode="outlined" label="Last Name" value={lastName} onChangeText={setLastName} style={styles.input} />
        <Menu
          visible={genderMenuVisible}
          onDismiss={() => setGenderMenuVisible(false)}
          anchor={<Button onPress={() => setGenderMenuVisible(true)}>{gender || "Select Gender"}</Button>}>
          {genderOptions.map(option => (
            <Menu.Item key={option} onPress={() => {
              setGender(option);
              setGenderMenuVisible(false);
            }} title={option} />
          ))}
        </Menu>
        <TextInput 
          mode="outlined" 
          label="Date of Birth" 
          value={format(dateOfBirth, 'yyyy-MM-dd')} 
          onTouchStart={showDatePicker} 
          onFocus={showDatePicker} 
          style={styles.input} 
        />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          maximumDate={new Date((new Date()).setFullYear((new Date()).getFullYear() - 18))}
        />
        <TextInput mode="outlined" label="Email" value={email} onChangeText={setEmail} style={styles.input} />
        <TextInput mode="outlined" label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
        <TextInput mode="outlined" label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} />
        <Menu
          visible={diseaseMenuVisible}
          onDismiss={() => setDiseaseMenuVisible(false)}
          anchor={<Button onPress={() => setDiseaseMenuVisible(true)}>{disease || "Select Disease"}</Button>}>
          {diseaseOptions.map(option => (
            <Menu.Item key={option} onPress={() => {
              setDisease(option);
              setDiseaseMenuVisible(false);
            }} title={option} />
          ))}
        </Menu>
        <Button mode="contained" onPress={handleRegister} style={styles.input}>Register</Button>
        <Button mode="outlined" onPress={handleCancel} style={styles.input}>Cancel</Button>
      </KeyboardAwareScrollView>
    </Provider>
  );
};

export default RegisterScreen;