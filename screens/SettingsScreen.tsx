import React, { useEffect, useState } from 'react';
import { Switch, View, Text, TouchableOpacity, Modal, Button, TextInput } from 'react-native';
import { useTheme } from '@react-navigation/native';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Settings, Notification } from '../types/types';
import NotificationList from '../components/NotificationList';
import SettingsControls from '../components/SettingsControls';
import NotificationSettings from '../components/NotificationSettings';
import { darkTheme } from '../design/themes';
import { lightTheme } from '../design/themes';
import { useDispatch, useSelector } from 'react-redux';
import getStyles from '../design/styles';  
import ThemeToggleButton, { onToggleTheme } from '../components/ThemeToggleButton';
import { RootState, useAppSelector } from '../redux/store';
import { setTheme } from '../redux/themeSlice';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownPicker from 'react-native-dropdown-picker';
import { addNotification } from '../redux/notificationSlice';
import { v4 as uuidv4 } from 'uuid';

const SettingsScreen: React.FC = () => {
    const dispatch = useDispatch();
    const actualTheme = useAppSelector((state: RootState) => {
        const type = state.theme.current;
        return type === 'dark' ? darkTheme : lightTheme;
      });
    const themedStyles = getStyles(actualTheme);
    const isDarkMode = actualTheme === darkTheme;
    const [modalVisible, setModalVisible] = React.useState(false);
    const [seeNotificationsModalVisible, setSeeNotificationsModalVisible] = React.useState(false);
    const [notificationDetails, setNotificationDetails] = useState({ title: '', message: '' }); //Revise this
    const [isNotificationsModalVisible, setNotificationsModalVisible] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [notificationType, setNotificationType] = useState<string>('defaultType');
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const notificationTypes = [
        {label: 'Recordatorio de medicación', value: 'type1'},
        {label: 'Recordatorio de cita', value: 'type2'},
        {label: 'Recordatorio de Notificación de salud', value: 'type3'},
        
    ];
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [settings, setSettings] = useState<Settings>({
        isNotificationEnabled : true,
        isDarkMode: false,
        isNotificationSoundEnabled: true,
        isNotificationVibrationEnabled: true,
    });

    useEffect(() => {
        const db = firestore();
        const unsubscribe = db.collection("notifications").onSnapshot((snapshot) => {
            const fetchedNotifications: Notification[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (
                    data.message && 
                    data.type && 
                    data.date && 
                    typeof data.date === 'object' && 
                    'seconds' in data.date && 
                    'nanoseconds' in data.date
                ) {
                    fetchedNotifications.push({
                        id: doc.id,
                        ...data,
                        date: new Date(data.date.seconds * 1000 + data.date.nanoseconds / 1000000),
                        type: data.type || 'defaultType',
                        message: data.message || 'defaultMessage',
                        isExpired: false,
                        title: data.title || 'defaultTitle'
                    });
                } else {
                    console.warn("Invalid data format:", data);
                }
            });
            setNotifications(fetchedNotifications);
        });
        return () => unsubscribe();
    }, []);

    const handleSettingsChange = async (newSettings: Settings) => {
        // Update the local state first
        setSettings(newSettings);
    
        // Now, update Firebase Firestore with the new settings
        try {
            const db = firestore();
            
            if (newSettings.id) {
                await db.collection("userSettings").doc(newSettings.id).set(newSettings, { merge: true });
                console.log('Settings updated successfully in Firestore');
            } else {
                console.warn('No user ID provided. Unable to update Firestore.');
            }
        } catch (error) {
            console.error('Failed to update settings in Firestore:', error);
        }
    };    

    const handleThemeToggle = (value: boolean) => {
        console.log('Toggling theme...');
        onToggleTheme(dispatch, actualTheme);
      };

      const openNotificationModal = () => {
        console.log('Opening modal...');
        setModalVisible(true);
      };

      const addNotificationToFirestore = async (notificationDetails: FirebaseFirestoreTypes.DocumentData) => {
        console.log('Adding notification to Firestore...');
        const db = firestore();
        await db.collection("notifications").add(notificationDetails);
        // Close the modal and maybe show a success message
      };
    
      const openSeeNotificationsModal = async () => {
        console.log('Fetching notifications from Firestore...');
        const notifications = await fetchNotificationsFromFirestore();
      };

      const closeNotificationModal = () => {
        console.log('Closing modal...');
        setModalVisible(false);
      };
      
      const fetchNotificationsFromFirestore = async () => {
        console.log('Fetching notifications from Firestore...');
        const db = firestore();
        const snapshot = await db.collection("notifications").get();
        return snapshot.docs.map(doc => doc.data());
      };

      const handleAddNotification = () => {
        const newNotification  = {
            id: uuidv4(),
            type: notificationType,
            title: notificationDetails.title,
            message: notificationDetails.message,
            date: selectedDate,
        };
        // Dispatch your Redux action here to add the notification
        dispatch(addNotification(newNotification));
        setNotificationsModalVisible(false);
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirmDate = (date: React.SetStateAction<Date>) => {
        setSelectedDate(date);
        hideDatePicker();
    };

    function SensorThresholdSetting() {
        const [threshold, setThreshold] = useState<number>(0);
      
        return (
          <div>
            <h2>Ajustes del umbral del sensor</h2>
            <input 
              type="number" 
              value={threshold} 
              onChange={(e) => setThreshold(Number(e.target.value))}
            />
            <button onClick={() => saveThresholdToDB(threshold)}>Save</button>
          </div>
        );
      }

      function saveThresholdToDB(value: number) {
        const db = firestore();
        db.collection("sensorThresholds").doc("userThreshold").set({
          value: value
        });
      }
      

      return (
        <View style={themedStyles.container}>
            {/* Notification Settings Section */}
            <View style={themedStyles.section}>
                <Text style={themedStyles.modalTitle}>Notificaciones</Text>
                <TouchableOpacity style={themedStyles.rectangularButton} onPress={openNotificationModal}>
                    <Text style={themedStyles.rectangularButtonText}>Añadir notificación</Text>
                </TouchableOpacity>
                <TouchableOpacity style={themedStyles.rectangularButton} onPress={openSeeNotificationsModal}>
                    <Text style={themedStyles.rectangularButtonText}>Ver notificaciones</Text>
                </TouchableOpacity>
                
                {/* Add Notification Modal */}
                <Modal
        animationType="slide"
        transparent={true}
        visible={seeNotificationsModalVisible}
        onRequestClose={() => setSeeNotificationsModalVisible(false)}
    >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                
                {/* Notification Type DropDownPicker */}
                <DropDownPicker
                    open={openDropdown}
                    value={notificationType}
                    items={notificationTypes}
                    setOpen={setOpenDropdown}
                    setValue={setNotificationType}
                />

                <Button title="Pick Date & Time" onPress={showDatePicker} />

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="datetime"
                    onConfirm={handleConfirmDate}
                    onCancel={hideDatePicker}
                />

                <Button 
                    title="Añadir" 
                    onPress={handleAddNotification}
                />
                <Button 
                    title="Cancelar" 
                    onPress={() => setSeeNotificationsModalVisible(false)}
                />
            </View>
        </View>
    </Modal>
                
            </View>
    
            {/* Notification Settings Section */}
            <View style={themedStyles.section}>
                <Text style={themedStyles.title}>Ajustes de notificación</Text>
                <NotificationSettings settings={settings} onSettingsChange={handleSettingsChange} />
            </View>
                    
            {/* Notification List Section */}
            <View style={themedStyles.section}>
                <Text style={themedStyles.title}>Ajustes del umbral del sensor</Text>
                <NotificationList notifications={notifications} />
            </View>
    
            {/* Display Settings Section */}
            <View style={themedStyles.section}>
                <Text style={themedStyles.title}>Ajustes de pantalla</Text>
                <View style={themedStyles.themeToggleContainer}>
                    <Text style={themedStyles.toggleText}>Cambiar tema</Text>
                    <Switch 
                      value={isDarkMode}
                      onValueChange={(value) => handleThemeToggle(value)}
                    />
                </View>
            </View>
        </View>
    );     
    };
    
    
    export default SettingsScreen;