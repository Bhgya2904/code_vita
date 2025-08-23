import { createSlice } from '@reduxjs/toolkit';
import { mockMessages, mockNotifications } from '../../data/mockData';

const initialState = {
  messages: mockMessages,
  notifications: mockNotifications,
  activeChat: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push({
        ...action.payload,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        read: false,
      });
    },
    markMessageAsRead: (state, action) => {
      const message = state.messages.find(m => m.id === action.payload);
      if (message) {
        message.read = true;
      }
    },
    addNotification: (state, action) => {
      state.notifications.unshift({
        ...action.payload,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        read: false,
      });
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    clearAllNotifications: (state) => {
      state.notifications.forEach(n => n.read = true);
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setActiveChat,
  addMessage,
  markMessageAsRead,
  addNotification,
  markNotificationAsRead,
  clearAllNotifications,
  setError,
  clearError,
} = chatSlice.actions;

export default chatSlice.reducer;