// components/NotificationList.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Notification } from '../redux/notificationSlice';

interface NotificationListProps {
    notifications: Notification[];
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => {
    return (
        <View>
            {notifications.map(notification => (
                <View key={notification.id}>
                    <Text>{notification.message}</Text>
                </View>
            ))}
        </View>
    );
};

export default NotificationList;