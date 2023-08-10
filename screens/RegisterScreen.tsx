// RegisterScreen.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { TextInput, Button, Menu, Provider } from 'react-native-paper';
import { format } from 'date-fns';
import { GuestStackParamList, LoginScreenProps } from '../types/types';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { RootState, useAppSelector } from '../redux/store';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput as RNTextInput } from 'react-native';
import { registerUser, verifyEmail } from '../redux/authSlice';
import Toast from 'react-native-toast-message';
import { userProfileUpdate }  from '../redux/userSlice';
import getStyles from '../design/styles';
import { darkTheme, lightTheme } from '../design/themes';
import { loadTheme, persistTheme, toggleTheme } from '../redux/themeSlice';

type navigationProp = StackNavigationProp<GuestStackParamList, 'Register'>;

const genderOptions = ['Male', 'Female', 'Other'];
const diseaseOptions = ['Lupus', 'Rheumatoid arthritis', 'Type I diabetes'];

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<navigationProp>();
  const dispatch = useDispatch();
  const actualTheme = useAppSelector((state: RootState) => {
    const type = state.theme.current;
    return type === 'dark' ? darkTheme : lightTheme;
  });
  const themedStyles = getStyles(actualTheme);
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
  const [phoneNumber, setPhoneNumber] = useState('+1-');
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('+1-');
  const nameInputRef = React.useRef<RNTextInput | null>(null);
  const lastNameInputRef = React.useRef<RNTextInput | null>(null);
  const emailInputRef = React.useRef<RNTextInput | null>(null);
  const passwordInputRef = React.useRef<RNTextInput | null>(null);
  const confirmPasswordInputRef = React.useRef<RNTextInput | null>(null);
  const scrollViewRef = React.useRef<ScrollView | null>(null);
  const phoneNumberInputRef = React.useRef<RNTextInput | null>(null);


  interface TextInputProps {
    label: string;
    value: string;
    setter: (text: string) => void;
    ref: React.RefObject<RNTextInput>;
    nextRef?: React.RefObject<RNTextInput>;
    onFocus?: (offset: number) => void;
    focusOffset?: number;
    isPassword?: boolean;
    style?: any;
    keyboardType?: "default" | "email-address" | "numeric" | "number-pad" | "phone-pad";
  }

  interface UserPayloadType {
    displayName?: string;
    email?: string;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    uid?: string;
  }
  
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
      console.log('Registering user...');
      if (password !== confirmPassword) {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Registration Error',
          text2: 'Passwords do not match. Please check and try again.',
        });
        return;
      }
      const actionResponse = await dispatch(registerUser({ email, password }));
      console.log('actionResponse', actionResponse);  
      if (actionResponse.payload && actionResponse.type === "auth/registerUser/fulfilled") {
        const userPayload: UserPayloadType = actionResponse.payload;
        const cleanUser = {
          displayName: userPayload.displayName,
          email: userPayload.email,
          emailVerified: userPayload.emailVerified,
          isAnonymous: userPayload.isAnonymous,
          uid: userPayload.uid,
        };
        await dispatch(userProfileUpdate({
          name,
          lastName,
          gender,
          dateOfBirth,
          phoneNumber,
          disease,
        }));
        await dispatch(verifyEmail());
        console.log('User registered successfully, dispatching verify email', cleanUser);
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Registration Successful',
          text2: 'A verification email has been sent to your email address.',
        });
        navigation.goBack();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while registering. Please try again later.';
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Registration Error',
        text2: errorMessage,
      });
    }
  };
  
  const isValid = name && lastName && gender && email && password && confirmPassword && phoneNumber && disease && password === confirmPassword;

  function handleCancel(): void {
    navigation.goBack(); 
  }

  return (
    <Provider>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[themedStyles.centeredView, { backgroundColor: actualTheme.colors.background }]}
        >
            <ScrollView
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={{ ...themedStyles.centeredView, flexGrow: 1 }}
            automaticallyAdjustContentInsets={true}
            showsVerticalScrollIndicator={false}
        >
                
        <View style={themedStyles.centeredView}>

            {renderTextInput({
                label: "Name",
                value: name,
                setter: setName,
                ref: nameInputRef,
                nextRef: lastNameInputRef,
                onFocus: handleInputFocus,
                style: [ themedStyles.input, { backgroundColor: actualTheme.colors.background }],
                focusOffset: 1
            })}
            {renderTextInput({
                label: "Last Name",
                value: lastName,
                setter: setLastName,
                ref: lastNameInputRef,
                nextRef: emailInputRef,
                onFocus: handleInputFocus,
                focusOffset: 100,
                style: [ themedStyles.input, { backgroundColor: actualTheme.colors.background }]
            })}
            {renderMenu(
                gender, setGender, 
                genderMenuVisible, setGenderMenuVisible, 
                genderOptions, "Select your gender",
            )}
            {renderDateInput(
                "Date of Birth", dateOfBirth, 
                showDatePicker
            )}
            {renderDatePicker(
                isDatePickerVisible, handleConfirm, 
                hideDatePicker
            )}
            {renderTextInput({
                label: "Email",
                value: email,
                setter: setEmail,
                ref: emailInputRef,
                nextRef: passwordInputRef,
                onFocus: handleInputFocus,
                focusOffset: 200,
                keyboardType:"email-address",
                style: [ themedStyles.input, { backgroundColor: actualTheme.colors.background }]
            })}
            {renderTextInput({
                label: "Phone Number",
                value: phoneNumber,
                setter: setPhoneNumber,
                ref: phoneNumberInputRef,
                nextRef: passwordInputRef,
                keyboardType:"phone-pad",
                onFocus: handleInputFocus,
                focusOffset: 225,
                style: [ themedStyles.input, { backgroundColor: actualTheme.colors.background }]
            })}
            {renderTextInput({
                label: "Password",
                value: password,
                setter: setPassword,
                ref: passwordInputRef,
                nextRef: confirmPasswordInputRef,
                onFocus: handleInputFocus,
                focusOffset: 250,
                isPassword: true,
                style: [ themedStyles.input, { backgroundColor: actualTheme.colors.background }]
            })}
            {renderTextInput({
                label: "Confirm Password",
                value: confirmPassword,
                setter: setConfirmPassword,
                ref: confirmPasswordInputRef,
                nextRef: undefined,
                onFocus: handleInputFocus,
                focusOffset: 300,
                isPassword: true,
                style: [ themedStyles.input, { backgroundColor: actualTheme.colors.background }]
            })}
            {renderMenu(
                disease, setDisease, 
                diseaseMenuVisible, setDiseaseMenuVisible, 
                diseaseOptions, "Select your condition"
            )}
                    <Button 
                        mode="contained" 
                        onPress={handleRegister} 
                        disabled={!isValid} 
                        style={[getStyles(actualTheme).roundedButton, { marginBottom: 10 }]}
                    >
                        Register
                    </Button>
                    <Button 
                        mode="outlined" 
                        onPress={handleCancel} 
                        style={[themedStyles.roundedButton, { borderColor: actualTheme.colors.error, backgroundColor: actualTheme.colors.error, marginBottom: 10 }]}
                    >
                        Cancel
                    </Button>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    </Provider>
);

function renderTextInput(props: TextInputProps): JSX.Element {
  const {
  label,
  value,
  setter,
  ref,
  nextRef,
  onFocus,
  focusOffset,
  isPassword,
  keyboardType
  } = props;

  return (
    <TextInput
      mode="outlined"
      label={label}
      value={value}
      onChangeText={setter}
      returnKeyType="next"
      onSubmitEditing={() => nextRef?.current?.focus()}
      ref={ref}
      onFocus={() => onFocus && focusOffset && onFocus(focusOffset)}
      secureTextEntry={isPassword}
      keyboardType={keyboardType}
      style={[themedStyles.input, { backgroundColor: actualTheme.colors.background }]}
    />
  );
}

function renderMenu(value: string, setter: React.Dispatch<React.SetStateAction<string>>, menuVisible: boolean, setMenuVisible: React.Dispatch<React.SetStateAction<boolean>>, options: string[], placeholder: string): JSX.Element {
    return (
        <View style={[themedStyles.fieldContainer, { backgroundColor: actualTheme.colors.background }]}>
            <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={<Button onPress={() => setMenuVisible(true)}>{value || placeholder}</Button>}
            >
                {options.map(option => (
                    <Menu.Item
                        key={option}
                        onPress={() => {
                            setter(option);
                            setMenuVisible(false);
                        }}
                        title={option}
                    />
                ))}
            </Menu>
        </View>
    );
}

function renderDateInput(label: string, value: Date, onTouchStart: () => void): JSX.Element {
    return (
        <TextInput
            mode="outlined"
            label={label}
            value={format(value, 'yyyy-MM-dd')}
            onKeyPress={onTouchStart}
            style={[themedStyles.input, { backgroundColor: actualTheme.colors.background }]}
        />
    );
}

function renderDatePicker(isVisible: boolean, onConfirm: (date: Date) => void, onCancel: () => void): JSX.Element {
    return (
        <DateTimePickerModal
            style={{ backgroundColor: actualTheme.colors.background }}
            isVisible={isVisible}
            mode="date"
            onConfirm={onConfirm}
            onCancel={onCancel}
            maximumDate={new Date((new Date()).setFullYear((new Date()).getFullYear() - 18))}
        />
    );
  }
}

export default RegisterScreen;