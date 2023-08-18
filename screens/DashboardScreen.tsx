// DashboardScreen.tsx
import React from 'react';
import { Text, Dimensions, ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import { LineChart, BarChart } from 'react-native-chart-kit';
import getStyles from '../design/styles';
import { getThemeDetails } from '../redux/sensorSelector';
import { RootState } from '../types/types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const DashboardScreen: React.FC<{}> = () => {
  const actualTheme = useSelector(getThemeDetails);
  const usbData = useSelector((state: RootState) => state.data);
  const themedStyles = getStyles(actualTheme);

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        strokeWidth: 2,
      },
    ],
  };

  const oxigenoData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [{
        data: [95, 94, 93, 96, 94, 95]
    }]
  };

  return (
    <ScrollView 
      style={{ flex: 1 }} 
      contentContainerStyle={themedStyles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={{ textAlign: 'left', fontSize: 18, padding: 16 }}>Temperatura</Text>
      
      <LineChart
        data={data}
        width={Dimensions.get('window').width - 32}
        height={220}
        chartConfig={{
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
      
      <Text style={{ textAlign: 'center', fontSize: 18, padding: 16 }}>Ritmo Cardíaco</Text>
      
      <LineChart
        data={data}
        width={Dimensions.get('window').width - 32}
        height={220}
        chartConfig={{
            backgroundColor: '#9e8d8d',
            backgroundGradientFrom: '#fa7a7a',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
                borderRadius: 16,
            },
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      />

      <Text style={{ textAlign: 'center', fontSize: 18, padding: 16 }}>Saturación de oxígeno en la sangre</Text>
      
      <BarChart
        data={oxigenoData}
        width={Dimensions.get('window').width - 32}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
            backgroundColor: '#1cc910',
            backgroundGradientFrom: '#eff3ff',
            backgroundGradientTo: '#efefef',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
                borderRadius: 16,
            },
        }}
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
    </ScrollView>
);
}

export default DashboardScreen;