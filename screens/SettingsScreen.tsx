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
import Toast from 'react-native-toast-message';
import { Notification } from '../types/types';
import { set } from 'lodash';

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
  const [isPickingTime, setIsPickingTime] = useState(false);
  const [seeNotificationsModalVisible, setSeeNotificationsModalVisible] = React.useState(false);
  const [actionsModalVisible, setActionsModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  
      // Fetch notifications from Firebase on mount
      useEffect(() => {
        const db = firebase.firestore();
        db.collection("notifications").onSnapshot((snapshot) => {
            const fetchedNotifications: { id: string, message: string, type: string, date: any }[] = [];
        
            if (snapshot) {
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    // Check if data has necessary fields
                    if (data.message && data.type) {
                        fetchedNotifications.push({
                          id: doc.id,
                          ...data,
                          date: data.date?.toDate(),
                          message: '',
                          type: '',
                          ...data,
                        });
                    } else {
                        console.warn("Invalid data format:", data);
                    }
                });
            }
            setNotifications(fetchedNotifications);
        });      
    }, []);
    

      // For editing an existing notification
      const openEditNotificationModal = (notification: { message: string; type: string; date: Date }) => {        setNotificationMessage(notification.message);
        setNotificationType(notification.type);
        setSelectedDate(notification.date);
        setModalVisible(true);
      };

      // Sort the notifications by date
    const sortedNotifications = notifications.sort((a, b) => {
      if (a.date?.toDate() < b.date?.toDate()) return -1;
      if (a.date?.toDate() > b.date?.toDate()) return 1;
      return 0;
  });

  const handleDateChange = (event: DateTimePickerEvent, selectedDateTime?: Date) => {
    if (event.type === 'set' && selectedDateTime) {  // Check if the user confirmed the selection and selectedDateTime exists
        setSelectedDate(selectedDateTime);
        if (!isPickingTime) {
            // Modify only the date part of selectedDate
            setSelectedDate(prevDate => {
              return new Date(
                  selectedDateTime.getFullYear(),
                  selectedDateTime.getMonth(),
                  selectedDateTime.getDate(),
                  prevDate.getHours(),
                  prevDate.getMinutes()
              );
          }
          );
            // Show the DateTimePicker again, but this time for picking the time
            setIsPickingTime(true);
            setShowDatePicker(true);
        } else {
            // Modify onlt the time part of selectedDate
            setSelectedDate(prevDate => {
              return new Date(
                  prevDate.getFullYear(),
                  prevDate.getMonth(),
                  prevDate.getDate(),
                  selectedDateTime.getHours(),
                  selectedDateTime.getMinutes()
              );
              });
            }
        } else {
        // Close the picker if the user canceled the selection and reset the isPickingTime flag
        setShowDatePicker(false);  
        setIsPickingTime(false);
    }
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
      
      const openSeeNotificationsModal = () => {
        setSeeNotificationsModalVisible(true);
    };

      const closeSeeNotificationsModal = () => {
        setSeeNotificationsModalVisible(false);
    }; 

    const openNotificationActionsModal = (notification: Notification) => {
      setSelectedNotification(notification);
      setActionsModalVisible(true);
   };
  

    const saveNotificationToFirebase = async () => {
      try {
        const db = firebase.firestore();
        await db.collection("notifications").add({
          message: notificationMessage,
          type: notificationType,
          date: firebase.firestore.Timestamp.fromDate(selectedDate),
        });
        console.log("Notification successfully written!");
      } catch (error) {
        console.error("Error writing notification: ", error);
      }
    };

    const deleteNotificationFromFirebase = async (notificationId: string) => {
      try {
          // Here you would use Firebase SDK to delete the notification
          // For example (assuming you're using Firestore):
          await firebase.firestore().collection('notifications').doc(notificationId).delete();
          console.log('Notification deleted successfully');
      } catch (error) {
          console.error('Error deleting notification:', error);
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
              <Text style={themedStyles.title}>Notificaciones</Text>
              <Button title='Add Notification' onPress={openNotificationModal} />
              <Button title='See Notifications' onPress={openSeeNotificationsModal} />
  
              {/* Add Notification Modal */}
              <Modal
                  animationType='slide'
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={closeNotificationModal}
              >
                  <View style={themedStyles.centeredView}>
                      <Text style={themedStyles.modalTitle}>Agregar Nuevas Notificaciones</Text>
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
                              mode={isPickingTime ? 'time' : 'date'}
                              is24Hour={true}
                              display='default'
                              onChange={handleDateChange}
                              style={themedStyles.datePicker}
                          />
                      )}
                      <Button 
                          title={isPickingTime ? "Set Time" : (showDatePicker ? "Set Date" : "Choose Date")}
                          onPress={() => {
                              if (!showDatePicker || isPickingTime) {
                                  setShowDatePicker(true);
                                  setIsPickingTime(false);  // Start with picking date first
                              } else {
                                  setShowDatePicker(!showDatePicker);
                                  setIsPickingTime(false);  // Reset just to be sure
                              }
                          }} 
                          color={actualTheme.colors.primary} 
                      />
  
                      <TouchableOpacity 
                          style={themedStyles.saveButton} 
                          onPress={() => {
                              saveNotificationToFirebase();
                              scheduleLocalNotification(selectedDate);
                              closeNotificationModal();
                          }}>
                          <Text style={themedStyles.buttonText}>Guardar</Text>
                      </TouchableOpacity>
  
                      <TouchableOpacity 
                          style={themedStyles.cancelButton} 
                          onPress={closeNotificationModal}>
                          <Text style={themedStyles.buttonText}>Cancelar</Text>
                      </TouchableOpacity>
                  </View>
              </Modal>
  
              {/* See Notifications Modal */}
              <Modal
                  animationType='slide'
                  transparent={true}
                  visible={seeNotificationsModalVisible}
                  onRequestClose={closeSeeNotificationsModal}
              >
                  <View style={themedStyles.centeredView}>
                      <Text style={themedStyles.modalTitle}>Todas las Notificaciones</Text>
                      <FlatList
                          data={sortedNotifications}
                          keyExtractor={(item) => item.id}
                          renderItem={({ item }) => (
                              <TouchableOpacity
                                  onPress={() => openNotificationActionsModal(item)}
                                  style={themedStyles.notificationCard}
                              >                        
                                  <Text>{item.type}: {item.message}: {item.date?.toDate().toLocaleString()}</Text>
                              </TouchableOpacity>
                          )}
                      />
                      <TouchableOpacity 
                          style={themedStyles.cancelButton} 
                          onPress={closeSeeNotificationsModal}>
                          <Text style={themedStyles.buttonText}>Cerrar</Text>
                      </TouchableOpacity>
                  </View>
              </Modal>
  
              {/* Notification Actions Modal */}
              <Modal
                  animationType='slide'
                  transparent={true}
                  visible={actionsModalVisible}
                  onRequestClose={() => setActionsModalVisible(false)}
              >
                  <View style={themedStyles.centeredView}>
                      <Text style={themedStyles.modalTitle}>Seleccionar Acción</Text>
  
                      <TouchableOpacity 
                      style={themedStyles.actionButton}
                      onPress={() => {
                          if (selectedNotification) {
                              openEditNotificationModal(selectedNotification); 
                              setActionsModalVisible(false);
                          }
                      }}>
                      <Text style={themedStyles.buttonText}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                      style={themedStyles.actionButton}
                      onPress={() => {
                        if (selectedNotification) {
                            deleteNotificationFromFirebase(selectedNotification.id);
                            setActionsModalVisible(false);
                        } else {
                            console.warn("No selected notification to delete.");
                        }
                      }}>
                      <Text style={themedStyles.buttonText}>Eliminar</Text>
                  </TouchableOpacity>

                      <TouchableOpacity 
                          style={themedStyles.cancelButton} 
                          onPress={() => setActionsModalVisible(false)}>
                          <Text style={themedStyles.buttonText}>Cancelar</Text>
                      </TouchableOpacity>
                  </View>
              </Modal>
          </View>
  
          {/* Health Notifications */}
          <View style={themedStyles.section}>
              <Text style={themedStyles.title}>Notificaciones de Salud</Text>
              {/* ... */}
          </View>
  
          {/* Sensor Threshold Settings */}
          <View style={themedStyles.section}>
              <Text style={themedStyles.title}>Configuración de Umbral del Sensor</Text>
              {/* ... */}
          </View>
  
          {/* Display Settings */}
          <View style={themedStyles.section}>
              <Text style={themedStyles.title}>Configuración de Pantalla</Text>
              <View style={themedStyles.themeToggleContainer}>
                  <Text style={themedStyles.toggleText}>Configuración de Tema</Text>
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
