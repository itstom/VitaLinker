//redux/sensorSelectors.ts
import { createSelector } from 'reselect';
import { RootState } from './store';
import { darkTheme } from '../design/themes';
import { lightTheme } from '../design/themes';

export const getSensorData = (state: RootState) => state.sensor;
export const getCurrentTheme = (state: RootState) => state.theme.current;

export const getHeartRateHistorySelector = (state: RootState) => state.sensor.heartRateHistory;
export const getTemperatureHistorySelector = (state: RootState) => state.sensor.temperatureHistory;
export const getSpO2HistorySelector = (state: RootState) => state.sensor.spo2History;
export const getLocationHistorySelector = (state: RootState) => state.sensor.locationHistory;
export const getLocationTimestampsSelector = (state: RootState) => state.sensor.locationTimestamps;
export const getHeartRateTimestampsSelector = (state: RootState) => state.sensor.heartRateTimestamps;
export const getTemperatureTimestampsSelector = (state: RootState) => state.sensor.temperatureTimestamps;
export const getSpO2TimestampsSelector = (state: RootState) => state.sensor.spo2Timestamps;


export const getThemeDetails = createSelector([getCurrentTheme], theme => {
    return theme === 'dark' ? darkTheme : lightTheme;
});
