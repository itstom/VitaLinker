// DashboardScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import getStyles from '../design/styles';
import { getThemeDetails } from '../redux/sensorSelector';

const DashboardScreen: React.FC<{}> = () => {
  const actualTheme = useSelector(getThemeDetails);
  const themedStyles = getStyles(actualTheme);

  return (
    <View style={themedStyles.container}>
      <Text style={themedStyles.text}>USB Data will be displayed here once available...</Text>
    </View>
  );
}

export default DashboardScreen;