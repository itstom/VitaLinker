// DashboardScreen.tsx
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { startDataPolling, stopDataPolling, scanAndConnect } from '../components/fetchSensorData';
import getStyles from '../design/styles';
import { getThemeDetails } from '../redux/sensorSelector';
import BleManager from 'react-native-ble-manager';

const DashboardScreen: React.FC<{}> = () => {
  const actualTheme = useSelector(getThemeDetails);
  const themedStyles = getStyles(actualTheme);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Setting up BLE connection and data polling");

    // Connect to the device first
    scanAndConnect().then(peripheral => {
        // Check if peripheral is not null
        if (peripheral) {
            console.log(`Connected to device ${peripheral.name}`);

            // Start data polling
            const interval = dispatch(startDataPolling(5000));

            return () => {
                console.log("Clearing data polling and disconnecting from device");
                dispatch(stopDataPolling(interval));
                // Handle disconnecting from the BLE device
                BleManager.disconnect(peripheral.id);
            };
        } else {
            console.warn('Peripheral is null. Unable to proceed.');
        }
    }).catch(err => {
        console.error("Error connecting to BLE device:", err);
        // Handle UI feedback for failed connection
    });
}, [dispatch]);
 
  return (
    <View style={themedStyles.container}>
      <Text style={themedStyles.title}>Dashboard Screen</Text>
      <Text style={themedStyles.text}>Data will be displayed here once available...</Text>
    </View>
  );
}

export default DashboardScreen;