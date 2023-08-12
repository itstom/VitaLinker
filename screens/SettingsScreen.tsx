// SettingsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Button, Modal, TextInput, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { RootState, useAppSelector } from '../redux/store';
import getStyles from '../design/styles';
import { darkTheme } from '../design/themes';
import { lightTheme } from '../design/themes';
import ThemeToggleButton, { onToggleTheme } from '../components/ThemeToggleButton';
import { useDispatch } from 'react-redux';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import PushNotification from 'react-native-push-notification';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

interface SettingsScreenProps {}

const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const dispatch = useDispatch();
  const actualTheme = useAppSelector((state: RootState) => {
    const type = state.theme.current;
    return type === 'dark' ? darkTheme : lightTheme;
  });
  const themedStyles = getStyles(actualTheme);
  const isDarkMode = actualTheme === darkTheme;
  const [modalVisible, setModalVisible] = React.useState(false);
  const [notificationMessage, setNotificationMessage] = React.useState('');
  const [notificationType, setNotificationType] = React.useState('Medication Reminder');
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [showDatePicker, setShowDatePicker] = React.useState(false);

      // Fetch notifications from Firebase on mount
      useEffect(() => {
        const db = firebase.firestore();
        db.collection("notifications").onSnapshot((snapshot) => {
          const fetchedNotifications: { id: string, message: string, type: string, date: any }[] = []; // Explicit type
      
          if (snapshot) {
              snapshot.forEach((doc) => {
                  fetchedNotifications.push({
                      id: doc.id,
                      message: '',
                      type: '',
                      date: undefined,
                      ...doc.data()
                  });
              });
          }
          setNotifications(fetchedNotifications);
        });      
        }, []);

      // For editing an existing notification
      const openEditNotificationModal = (notification: { message: string, type: string, date: { toDate: () => Date } }) => {
        setNotificationMessage(notification.message);
        setNotificationType(notification.type);
        setSelectedDate(notification.date.toDate());
        setModalVisible(true);
      };

      // Date change handler
      const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || new Date();
        setSelectedDate(currentDate);
        setShowDatePicker(Platform.OS === 'ios');
      };

      const handleThemeToggle = (value: boolean) => {
        onToggleTheme(dispatch, actualTheme);
      };

      const openNotificationModal = () => {
        setModalVisible(true);
      };

      const closeNotificationModal = () => {
        setModalVisible(false);
      };

    const saveNotificationToFirebase = async () => {
      try {
        const db = firebase.firestore();
        await db.collection("notifications").add({
          message: notificationMessage,
          type: notificationType,
          date: selectedDate,
        });
        console.log("Notification successfully written!");
      } catch (error) {
        console.error("Error writing notification: ", error);
      }
    };
  
    const scheduleLocalNotification = (date: Date) => {
      PushNotification.localNotificationSchedule({
        message: notificationMessage, // (required)
        date: date, // in UTC-0
        /* Any other properties here: https://github.com/zo0r/react-native-push-notification */
      });
    };

  return (
    <View style={themedStyles.container}>
      {/* Notification Settings */}
      <View style={themedStyles.section}>
        <Text style={themedStyles.title}>Notification Settings</Text>
        <Button title='Add Notification' onPress={openNotificationModal} />

        <Modal
          animationType='slide'
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeNotificationModal}
        >
          <View style={themedStyles.centeredView}>
            <Text style={themedStyles.modalTitle}>Add New Notification</Text>
            <Picker
              selectedValue={notificationType}
              onValueChange={(itemValue) => setNotificationType(itemValue)}
              style={themedStyles.picker}
            >
              <Picker.Item label='Medication Reminder' value='Medication Reminder' />
              <Picker.Item label='Appointment Reminder' value='Appointment Reminder' />
              <Picker.Item label='Health Notification' value='Health Notification' />
            </Picker>

            <TextInput
              style={themedStyles.input}
              onChangeText={setNotificationMessage}
              value={notificationMessage}
              placeholder='Notification Message'
              placeholderTextColor={actualTheme.colors.text}
            />

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode='date'
                is24Hour={true}
                display='default'
                onChange={handleDateChange}
                style={themedStyles.datePicker}
              />
            )}
            <Button 
              title={showDatePicker ? "Set Date" : "Choose Date"}
              onPress={() => setShowDatePicker(!showDatePicker)} 
              color={actualTheme.colors.secondary}
            />

            <TouchableOpacity 
                style={themedStyles.button} 
                onPress={() => {
                    saveNotificationToFirebase();
                    scheduleLocalNotification(selectedDate);
                    closeNotificationModal();
                }}>
                <Text style={themedStyles.buttonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[themedStyles.button, themedStyles.cancelButton]} 
                onPress={closeNotificationModal}>
                <Text style={themedStyles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            </View>

          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => openEditNotificationModal(item)}
                style={themedStyles.notificationCard}
              >
                <Text>{item.type}: {item.message}: {item.date}</Text>
              </TouchableOpacity>
            )}
          />
        </Modal>
      </View>

      {/* Health Notifications */}
      <View style={themedStyles.section}>
        <Text style={themedStyles.title}>Health Notifications</Text>
        {/* ... */}
      </View>

      {/* Sensor Threshold Settings */}
      <View style={themedStyles.section}>
        <Text style={themedStyles.title}>Sensor Threshold Settings</Text>
        {/* ... */}
      </View>

      {/* Display Settings */}
      <View style={themedStyles.section}>
        <Text style={themedStyles.title}>Display Settings</Text>
        <View style={themedStyles.themeToggleContainer}>
          <Text style={themedStyles.toggleText}>Toggle Theme</Text>
          <Switch 
            value={isDarkMode}
            onValueChange={handleThemeToggle}
          />
        </View>
      </View>
    </View>
  );
}

export default SettingsScreen;