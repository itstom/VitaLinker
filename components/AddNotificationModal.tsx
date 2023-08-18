import React, { useState } from 'react';
import { Modal, View, TextInput, Button, StyleSheet, Platform } from 'react-native';
import Picker from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';

type ThemedStyles = any;

interface AddNotificationModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (notificationDetails: { title: string, message: string }) => void;
    themedStyles: ThemedStyles;
}

const AddNotificationModal: React.FC<AddNotificationModalProps> = ({ isVisible, onClose, onSubmit, themedStyles }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [notificationType, setNotificationType] = useState('Seleccione un tipo de notificación');
    const notificationOptions = [
        { label: 'Recordatorio de medicación', value: 'medication' },
        { label: 'Recordatorio de cita', value: 'appointment' },
        { label: 'Recordatorio de Notificación de salud', value: 'health' }
    ];
    const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize with current date and time
    const [showDatePicker, setShowDatePicker] = useState(false); // Control visibility of DateTimePicker
    const [notes, setNotes] = useState('');

    const handleAdd = () => {
        if (title.trim() && message.trim()) {
            onSubmit({ title, message });
            setTitle('');
            setMessage('');
            onClose();
        }
    };

    const handleDateChange = (event: any, date: Date | undefined) => {
        setShowDatePicker(Platform.OS === 'android' && event.type === 'set'); // Close DateTimePicker on Android when date is set
        if (date) {
            setSelectedDate(date);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                    <Picker
                        onValueChange={(value) => setNotificationType(value)}
                        items={notificationOptions}
                    />
                    <Button title="Seleccionar fecha y hora" onPress={() => setShowDatePicker(true)} />
                    {showDatePicker && Platform.OS === 'android' && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="datetime"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Título"
                    />
                    <TextInput
                        style={styles.input}
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Mensaje"
                        multiline
                    />
                    <TextInput
                        style={styles.input}
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Notas"
                        multiline
                    />
                    <View style={styles.buttonContainer}>
                        <Button title="Agregar" onPress={handleAdd} />
                        <Button title="Cancelar" onPress={onClose} color="red" />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    input: {
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});

export default AddNotificationModal;