import { createSlice } from '@reduxjs/toolkit';
import { mockUsers } from '../../data/mockData';

// Let's use a temporary array to hold new users for the session
const sessionUsers = [...mockUsers];

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
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    authFailure: (state, action) => {
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

export const { authStart, loginSuccess, authFailure, logout, clearError } = authSlice.actions;

// Async login action
export const login = (username, password, role) => async (dispatch) => {
  dispatch(authStart());
  
  // Simulate API call delay
  setTimeout(() => {
    const user = sessionUsers.find(
      (u) => u.username === username && u.password === password && u.role === role
    );
    
    if (user) {
      dispatch(loginSuccess(user));
    } else {
      dispatch(authFailure('Invalid credentials or role mismatch'));
    }
  }, 1000);
};

// NEW: Async register action
export const register = (userData) => async (dispatch) => {
  dispatch(authStart());
  
  // Simulate API call delay
  setTimeout(() => {
    const existingUser = sessionUsers.find(
      (u) => u.username === userData.username
    );

    if (existingUser) {
      dispatch(authFailure('Username already exists. Please choose another.'));
      return;
    }
    
    // Create new user object
    const newUser = {
      id: Date.now(), // Generate a unique ID
      ...userData,
      avatar: `https://i.pravatar.cc/150?u=${userData.username}` // Random avatar
    };
    
    // Add to our temporary session user list
    sessionUsers.push(newUser);
    
    console.log('New user registered (session only):', newUser);
    console.log('Current users:', sessionUsers);

    // Automatically log the user in after successful registration
    dispatch(loginSuccess(newUser));

  }, 1000);
};


export default authSlice.reducer;