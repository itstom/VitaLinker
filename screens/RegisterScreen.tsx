// RegisterScreen.tsx
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { TextInput, Button, Menu, Provider, Text } from 'react-native-paper';
import { format } from 'date-fns';
import { GuestStackParamList } from '../types/types';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import styles from '../design/styles';
import { RootState } from '../redux/store';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import  PhoneNumberInput  from 'react-native-phone-number-input';
import { TextInput as RNTextInput } from 'react-native';

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
  const [genderMenuVisible, setGenderMenuVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const themedStyles = styles(theme);
  const nameInputRef = React.useRef<RNTextInput | null>(null);
  const lastNameInputRef = React.useRef<RNTextInput | null>(null);
  const emailInputRef = React.useRef<RNTextInput | null>(null);
  const passwordInputRef = React.useRef<RNTextInput | null>(null);
  const confirmPasswordInputRef = React.useRef<RNTextInput | null>(null);
  const scrollViewRef = React.useRef<ScrollView | null>(null);
  
  const handleInputFocus = (offset: number) => {
    scrollViewRef.current?.scrollTo({ y: offset, animated: true });
};

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
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[themedStyles.centeredView, {backgroundColor: theme.colors.background}]}
        >
            <ScrollView 
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={[themedStyles.centeredView, {backgroundColor: theme.colors.background}]}
            automaticallyAdjustKeyboardInsets={true} 
            showsVerticalScrollIndicator={false}
            >   
                <View style={[themedStyles.centeredView, {backgroundColor: theme.colors.background}]}>
                    <TextInput 
                        mode="outlined"
                        label="Name"
                        value={name}
                        onChangeText={setName}
                        returnKeyType="next"
                        onSubmitEditing={() => {
                            if (lastNameInputRef.current) {
                                lastNameInputRef.current.focus();
                            }
                        }}
                        ref={nameInputRef}
                        onFocus={() => handleInputFocus(1)}
                        style={[themedStyles.input,{backgroundColor: theme.colors.background}]}
                    />
                    <TextInput 
                        mode="outlined"
                        label="Last Name"
                        value={lastName}
                        onChangeText={setLastName}
                        returnKeyType="next"
                        onSubmitEditing={() => {
                            if (emailInputRef.current) {
                                emailInputRef.current.focus();
                            }
                        }}
                        ref={lastNameInputRef}
                        onFocus={() => handleInputFocus(100)}
                        style={[themedStyles.input,{backgroundColor: theme.colors.background}]}
                    />
                    <View style={[themedStyles.fieldContainer, { backgroundColor: theme.colors.background }]}>
                        <Menu
                            visible={genderMenuVisible}
                            onDismiss={() => setGenderMenuVisible(false)}
                            anchor={<Button onPress={() => setGenderMenuVisible(true)}>{gender || "Select your gender"}</Button>}
                        >
                            {genderOptions.map(option => (
                                <Menu.Item 
                                    key={option} 
                                    onPress={() => {
                                        setGender(option);
                                        setGenderMenuVisible(false);
                                    }}
                                    title={option} 
                                />
                            ))}
                        </Menu>
                    </View>
                    <TextInput 
                        mode="outlined" 
                        label="Date of Birth" 
                        value={format(dateOfBirth, 'yyyy-MM-dd')} 
                        onTouchStart={showDatePicker} 
                        onFocus={showDatePicker} 
                        style={[themedStyles.input,{backgroundColor: theme.colors.background}]}
                    />
                    <DateTimePickerModal
                        style={{backgroundColor: theme.colors.background}}
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        maximumDate={new Date((new Date()).setFullYear((new Date()).getFullYear() - 18))}
                    />
                    <TextInput 
                        mode="outlined"
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        returnKeyType="next"
                        onSubmitEditing={() => {
                            if (passwordInputRef.current) {
                                passwordInputRef.current.focus();
                            }
                        }}
                        ref={emailInputRef}
                        onFocus={() => handleInputFocus(200)}
                        style={[themedStyles.input, {backgroundColor: theme.colors.background}]}
                    />
                    <PhoneNumberInput
                        defaultCode="DO"
                        layout="first"
                        onChangeText={setPhoneNumber}
                        value={phoneNumber}
                        placeholder="Phone Number"
                        containerStyle={themedStyles.phoneNumberInput}
                        textContainerStyle={themedStyles.phoneNumberTextContainer}
                        textInputStyle={themedStyles.phoneNumberText}
                        flagButtonStyle={themedStyles.phoneNumberFlagButton}
                    />
                    <TextInput 
                        mode="outlined"
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        returnKeyType="next"
                        secureTextEntry
                        onSubmitEditing={() => {
                            if (confirmPasswordInputRef.current) {
                                confirmPasswordInputRef.current.focus();
                            }
                        }}
                        ref={passwordInputRef}
                        onFocus={() => handleInputFocus(250)}
                        style={[themedStyles.input, {backgroundColor: theme.colors.background}]}
                    />
                    <TextInput 
                        mode="outlined"
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        ref={confirmPasswordInputRef}
                        onFocus={() => handleInputFocus(300)}
                        style={[themedStyles.input, {backgroundColor: theme.colors.background}]}
                    />
                    <View style={[themedStyles.fieldContainer, { backgroundColor: theme.colors.background }]}>
                        <Menu
                            visible={diseaseMenuVisible}
                            onDismiss={() => setDiseaseMenuVisible(false)}
                            anchor={<Button onPress={() => setDiseaseMenuVisible(true)}>{disease || "Select your condition"}</Button>}
                        >
                            {diseaseOptions.map(option => (
                                <Menu.Item 
                                    key={option} 
                                    onPress={() => {
                                        setDisease(option);
                                        setDiseaseMenuVisible(false);
                                    }}
                                    title={option} 
                                />
                            ))}
                        </Menu>
                    </View>
                    <Button mode="contained" onPress={handleRegister} style={[themedStyles.roundedButton,  {backgroundColor: theme.colors.onPrimary}]}>Register</Button>
                    <Button mode="outlined" onPress={handleCancel} style={[themedStyles.roundedButton, {backgroundColor: theme.colors.error}]}>Cancel</Button>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    </Provider>
);
};

export default RegisterScreen;