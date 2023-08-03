import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  avg24h: 0,
  avg7d: 0,
};

const sensorSlice = createSlice({
  name: 'sensor',
  initialState,
  reducers: {
    setAvg24h(state, action) {
      state.avg24h = action.payload;
    },
    setAvg7d(state, action) {
      state.avg7d = action.payload;
    },
  },
});

export const { setAvg24h, setAvg7d } = sensorSlice.actions;

export default sensorSlice.reducer;