//redux/sensorSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SensorState = {
  // Averages
  avg24h: number;
  avg7d: number;
  avg1m: number;

  //Temperature
  temperature: number;
  temperatureHistory: number[];
  temperatureTimestamps: string[];

  // Location
  location: string;
  locationHistory: string[];
  locationTimestamps: string[];

  // Heart Rate
  heartRate: number;
  heartRateHistory: number[];
  heartRateTimestamps: string[];

  // Spo2
  spo2: number;
  spo2History: number[];
  spo2Timestamps: string[];

  // Validity flags
  hrValid: boolean;
  spo2Valid: boolean;
};

export const initialState: SensorState = {
  // Averages
  avg24h: 0,
  avg7d: 0,
  avg1m: 0,

  // Temperature
  temperature: 0,
  temperatureHistory: [],
  temperatureTimestamps: [],

  // Location
  location: '',
  locationHistory: [],
  locationTimestamps: [],

  // Heart Rate
  heartRate: 0,
  heartRateHistory: [],
  heartRateTimestamps: [],

  // Spo2
  spo2: 0,
  spo2History: [],
  spo2Timestamps: [],

  // Validity flags
  hrValid: false,
  spo2Valid: false,
};

const sensorSlice = createSlice({
  name: 'sensor',
  initialState,
  reducers: {
    setAvg24h(state, action: PayloadAction<number>) {
      state.avg24h = action.payload;
    },
    setAvg7d(state, action: PayloadAction<number>) {
      state.avg7d = action.payload;
    },
    setAvg1m(state, action: PayloadAction<number>) {
      state.avg1m = action.payload;
    },
    setSensorData(state, action: PayloadAction<SensorState>) {
      Object.assign(state, action.payload);
    },
    setTemperature(state, action: PayloadAction<number>) {
      state.temperature = action.payload;
    },
    setLocation(state, action: PayloadAction<string>) {
      state.location = action.payload;
    },
    setHeartRate(state, action: PayloadAction<number>) {
      state.heartRate = action.payload;
    },
    setSpo2(state, action: PayloadAction<number>) {
      state.spo2 = action.payload;
    },
    setHeartRateHistory(state, action: PayloadAction<number[]>) {
      state.heartRateHistory.push(...action.payload);
    },
    setSpo2History(state, action: PayloadAction<number[]>) {
      state.spo2History.push(...action.payload);
    },
    setTemperatureHistory(state, action: PayloadAction<number[]>) {
      state.temperatureHistory.push(...action.payload);
    },
    setLocationHistory(state, action: PayloadAction<string[]>) {
      state.locationHistory.push(...action.payload);
    },
    setHeartRateTimestamps(state, action: PayloadAction<string[]>) {
      state.heartRateTimestamps.push(...action.payload);
    },
    setSpo2Timestamps(state, action: PayloadAction<string[]>) {
      state.spo2Timestamps.push(...action.payload);
    },
    setTemperatureTimestamps(state, action: PayloadAction<string[]>) {
      state.temperatureTimestamps.push(...action.payload);
    },
    setLocationTimestamps(state, action: PayloadAction<string[]>) {
      state.locationTimestamps.push(...action.payload);
    },
    setHrValid(state, action: PayloadAction<boolean>) {
      state.hrValid = action.payload;
    },
    setSpo2Valid(state, action: PayloadAction<boolean>) {
      state.spo2Valid = action.payload;
    },
    setUpdateHeartRate(state, action: PayloadAction<number>) {
      state.heartRate = action.payload;
    },
    setUpdateSpo2(state, action: PayloadAction<number>) {
      state.spo2 = action.payload;
    },
    setUpdateTemperature(state, action: PayloadAction<number>) {
      state.temperature = action.payload;
    },
    setUpdateLocation(state, action: PayloadAction<string>) {
      state.location = action.payload;
    },
    updateSensorDataAction(state, action: PayloadAction<SensorState>) {
      return {
        ...state,
        ...action.payload,
         };
      },
    },
});

export const { 
  setAvg24h, 
  setAvg7d, 
  setAvg1m,
  setUpdateTemperature, 
  setUpdateLocation,
  setUpdateHeartRate,
  setUpdateSpo2,
  setSensorData,
} = sensorSlice.actions;

export const { updateSensorDataAction } = sensorSlice.actions;
export default sensorSlice.reducer;