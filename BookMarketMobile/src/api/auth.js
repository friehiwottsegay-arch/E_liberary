// Authentication API Services
import apiClient from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authAPI = {
  // Login user
  login: async (username, password) => {
    try {
      const response = await apiClient.post('/login/', {
        username,
        password,
      });
      
      const { access, refresh, user } = response.data;
      
      // Store tokens and user data
      await AsyncStorage.multiSet([
        ['access_token', access],
        ['refresh_token', refresh],
        ['user', JSON.stringify(user)],
      ]);
      
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Login failed',
      };
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      console.log('📝 Registration data:', userData);
      
      const response = await apiClient.post('/register/', {
        ...userData,
        user_type: 'buyer', // Always buyer for this app
      });
      
      console.log('✅ Registration successful:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Registration error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.error || error.message || 'Registration failed',
      };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/current_user/');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to get user data',
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Logout failed' };
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      return !!token;
    } catch (error) {
      return false;
    }
  },
};