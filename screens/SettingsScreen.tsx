import React, { useState, useEffect } from 'react';
import { Switch, View, Text, TouchableOpacity, Modal, ViewStyle, TextStyle } from 'react-native';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import getStyles from '../design/styles';  
import { onToggleTheme } from '../components/ThemeToggleButton';
import { RootState, useAppSelector } from '../redux/store';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownPicker from 'react-native-dropdown-picker';
import { darkTheme, lightTheme } from '../design/themes';
import { Settings } from '../types/types';
import { addNotification, deleteNotification, editNotification } from '../redux/notificationSlice';
import { Notification } from '../redux/notificationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeState } from '../redux/themeSlice';
import AddNotificationModal from '../components/AddNotificationModal';

interface ThemedStyles {
    section: ViewStyle;
    title: TextStyle;
    themeToggleContainer: ViewStyle;
    toggleText: TextStyle;
}
interface NotificationSettingsProps {
    openNotificationModal: () => void;
    openSeeNotificationsModal: () => void;
    themedStyles: any;
  }
  
  const NotificationSettings: React.FC<NotificationSettingsProps> = ({ 
    openNotificationModal, 
    openSeeNotificationsModal, 
    themedStyles 
  }) => (
      <View style={themedStyles.section}>
          <Text style={themedStyles.modalTitle}>Notificaciones</Text>
          <TouchableOpacity style={themedStyles.rectangularButton} onPress={openNotificationModal}>
              <Text style={themedStyles.rectangularButtonText}>Añadir notificación</Text>
          </TouchableOpacity>
          <TouchableOpacity style={themedStyles.rectangularButton} onPress={openSeeNotificationsModal}>
              <Text style={themedStyles.rectangularButtonText}>Ver notificaciones</Text>
          </TouchableOpacity>
      </View>
  );  

  interface AddNotificationModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (notificationDetails: { title: string, message: string }) => void;
    themedStyles: ThemedStyles;
}
        // Define the type for the component's props:
            interface DisplaySettingsProps {
                isDarkMode: boolean;
                onToggleTheme: (value: boolean) => void;
                themedStyles: ThemedStyles;
            }
            // Use the type in the component:
            const DisplaySettings: React.FC<DisplaySettingsProps> = ({ isDarkMode, onToggleTheme, themedStyles }) => (
                <View style={themedStyles.section}>
                    <Text style={themedStyles.title}>Ajustes de pantalla</Text>
                    <View style={themedStyles.themeToggleContainer}>
                        <Text style={themedStyles.toggleText}>Cambiar tema</Text>
                        <Switch 
                            value={isDarkMode}
                            onValueChange={onToggleTheme}
                        />
                    </View>
                </View>
            );

const SettingsScreen: React.FC = () => {
    const dispatch = useDispatch();
    const actualTheme = useSelector((state: { theme: ThemeState }) => {
        const type = state.theme.current;
        return type === 'dark' ? darkTheme : lightTheme;
      });
    const themedStyles = getStyles(actualTheme);
    const isDarkMode = actualTheme === darkTheme;
    const [modalVisible, setModalVisible] = useState(false);
    const [seeNotificationsModalVisible, setSeeNotificationsModalVisible] = useState(false);
    const [notificationDetails, setNotificationDetails] = useState({ title: '', message: '' });
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
    
                let date = new Date(); // Default to current date
                if (data.date && typeof data.date.seconds === 'number' && typeof data.date.nanoseconds === 'number') {
                    date = new Date(data.date.seconds * 1000 + data.date.nanoseconds / 1000000);
                }
    
                fetchedNotifications.push({
                    id: doc.id,
                    ...data,
                    date: date,
                    type: data.type || 'defaultType',
                    message: data.message || 'defaultMessage',
                    isExpired: false,
                    title: data.title || 'defaultTitle'
                } as Notification);                
            });
            setNotifications(fetchedNotifications);
        });
    
        return () => unsubscribe();
    }, []);
    

    const handleSettingsChange = async (newSettings: Settings) => {
        setSettings(newSettings);
        try {
            const db = firestore();
            if (newSettings.id) {
                await db.collection("userSettings").doc(newSettings.id).set(newSettings, { merge: true });
            } 
        } catch (error) {
            console.error("Error updating settings:", error);
        }
    };

    const handleNotificationSubmit = async () => {
        try {
            const db = firestore();
            const newNotification = {
                id: uuidv4(),
                type: notificationType,
                message: notificationDetails.message,
                date: selectedDate,
                title: notificationDetails.title,
                isExpired: false
            }  as Notification;            
            await db.collection("notifications").doc(newNotification.id).set(newNotification);
            setNotificationsModalVisible(false);
            setNotificationDetails({ title: '', message: '' });
            setSelectedDate(new Date());
            setNotificationType('defaultType');
            dispatch(addNotification(newNotification));
        } catch (error) {
            console.error("Error adding notification:", error);
        }
    };

    const handleThemeToggle = (value: boolean) => {
        onToggleTheme(dispatch, actualTheme);
        const newSettings = { ...settings, isDarkMode: value };
        handleSettingsChange(newSettings);
      };

    const openNotificationModal = () => {
        setNotificationsModalVisible(true);
    };

    const openSeeNotificationsModal = () => {
        setSeeNotificationsModalVisible(true);
    };

    return (
        <View style={themedStyles.container}>
            <NotificationSettings 
                openNotificationModal={() => setNotificationsModalVisible(true)}
                openSeeNotificationsModal={openSeeNotificationsModal}
                themedStyles={themedStyles}
            />
            <AddNotificationModal 
                isVisible={isNotificationsModalVisible}
                onClose={() => setNotificationsModalVisible(false)}
                themedStyles={themedStyles} onSubmit={function (notificationDetails: { title: string; message: string; }): void {
                    throw new Error('Function not implemented.');
                } }            />
            <DisplaySettings 
                isDarkMode={isDarkMode} 
                onToggleTheme={(value) => handleThemeToggle(value)}
                themedStyles={themedStyles}
            />
        </View>
    );
};

export default SettingsScreen;