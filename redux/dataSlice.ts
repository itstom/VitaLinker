import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: string = "";

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<string>) => action.payload,
  },
});

export const { setData } = dataSlice.actions;
export default dataSlice.reducer;