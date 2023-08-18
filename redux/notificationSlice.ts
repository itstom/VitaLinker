import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the state shape
type Notification = {
  id: string;
  type: string;
  date: Date;
  // ... other notification properties
};

type NotificationState = {
  list: Notification[];
};

const initialState: NotificationState = {
  list: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.list.push(action.payload);
    },
    editNotification: (state, action: PayloadAction<Notification>) => {
        const { id } = action.payload;
        const index = state.list.findIndex((notification) => notification.id === id);
        if (index !== -1) {
            state.list[index] = action.payload;
        }
        },
    deleteNotification: (state, action: PayloadAction<string>) => {
        const index = state.list.findIndex((notification) => notification.id === action.payload);
        if (index !== -1) {
            state.list.splice(index, 1);
        }
    },
  },
});

export const { addNotification } = notificationSlice.actions;

export default notificationSlice.reducer;