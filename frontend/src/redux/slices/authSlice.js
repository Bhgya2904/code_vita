import { createSlice } from '@reduxjs/toolkit';
import { mockUsers } from '../../data/mockData';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;

// Async login action
export const login = (username, password, role) => async (dispatch) => {
  dispatch(loginStart());
  
  // Simulate API call delay
  setTimeout(() => {
    const user = mockUsers.find(
      (u) => u.username === username && u.password === password && u.role === role
    );
    
    if (user) {
      dispatch(loginSuccess(user));
    } else {
      dispatch(loginFailure('Invalid credentials'));
    }
  }, 1000);
};

export default authSlice.reducer;