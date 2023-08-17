// DashboardScreen.tsx
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { stopDataPolling, initializeAndStartPolling } from '../components/fetchSensorData';
import getStyles from '../design/styles';
import { getThemeDetails } from '../redux/sensorSelector';

const DashboardScreen: React.FC<{}> = () => {
  const actualTheme = useSelector(getThemeDetails);
  const themedStyles = getStyles(actualTheme);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Setting up BLE connection and data polling");

    // Initialize and start data polling
    const interval = dispatch(initializeAndStartPolling(5000));

    return () => {
        console.log("Clearing data polling");
        dispatch(stopDataPolling(interval));
        // Note: You should also handle disconnecting from the BLE device in the `initializeAndStartPolling` function.
    };
}, [dispatch]);

 
  return (
    <View style={themedStyles.container}>
      <Text style={themedStyles.text}>Data will be displayed here once available...</Text>
    </View>
  );
}

export default DashboardScreen;