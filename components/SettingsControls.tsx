// components/SettingsControls.tsx
import React from 'react';
import { View, Switch, Text } from 'react-native';
import { Settings } from '../types/types';

interface SettingsControlsProps {
    settings: Settings;
    onSettingsChange: (newSettings: Settings) => void;
}

const SettingsControls: React.FC<SettingsControlsProps> = ({ settings, onSettingsChange }) => {
    const toggleNotifications = () => {
        onSettingsChange({ ...settings, isNotificationEnabled: !settings.isNotificationEnabled  });
    };

    return (
        <View>
            <Text>Notifications</Text>
            <Switch value={settings.isNotificationEnabled } onValueChange={toggleNotifications} />
            {/* Add more controls as needed */}
        </View>
    );
};

export default SettingsControls;