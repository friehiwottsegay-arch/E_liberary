/**
 * Unified Authentication Utilities with JWT Token Refresh
 * Handles both localStorage and sessionStorage for consistent token management
 * Includes automatic token refresh functionality
 */

import axios from 'axios';

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  REMEMBER_LOGIN: 'remember_login'
};

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Token refresh management
let refreshPromise = null;
let refreshInProgress = false;

// Get token from either localStorage or sessionStorage
export const getToken = () => {
  // Try localStorage first
  let token = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
  
  // If not in localStorage, try sessionStorage
  if (!token) {
    token = sessionStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
  }
  
  return token;
};

// Get refresh token from either localStorage or sessionStorage
export const getRefreshToken = () => {
  // Try localStorage first
  let refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
  
  // If not in localStorage, try sessionStorage
  if (!refreshToken) {
    refreshToken = sessionStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
  }
  
  return refreshToken;
};

// Get user data from either localStorage or sessionStorage
export const getUserData = () => {
  // Try localStorage first
  let userData = localStorage.getItem(TOKEN_KEYS.USER_DATA);
  
  // If not in localStorage, try sessionStorage
  if (!userData) {
    userData = sessionStorage.getItem(TOKEN_KEYS.USER_DATA);
  }
  
  return userData ? JSON.parse(userData) : null;
};

// Check if user has remember me checked
export const isRememberLogin = () => {
  return localStorage.getItem(TOKEN_KEYS.REMEMBER_LOGIN) === 'true';
};

// Remove all authentication data from both storages
export const clearAuthData = () => {
  // Clear localStorage
  localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(TOKEN_KEYS.USER_DATA);
  localStorage.removeItem(TOKEN_KEYS.REMEMBER_LOGIN);
  
  // Clear sessionStorage
  sessionStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
  sessionStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
  sessionStorage.removeItem(TOKEN_KEYS.USER_DATA);
  
  // Reset refresh state
  refreshPromise = null;
  refreshInProgress = false;
};

// Store authentication data in appropriate storage
export const storeAuthData = (authData, rememberMe = false) => {
  const { access, refresh, user } = authData;
  
  if (rememberMe) {
    // Store in localStorage for persistent sessions
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, access);
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refresh);
    localStorage.setItem(TOKEN_KEYS.USER_DATA, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEYS.REMEMBER_LOGIN, 'true');
  } else {
    // Store in sessionStorage for session-only
    sessionStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, access);
    sessionStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refresh);
    sessionStorage.setItem(TOKEN_KEYS.USER_DATA, JSON.stringify(user));
  }
};

// Update tokens in storage
export const updateTokens = (newAccessToken, newRefreshToken = null) => {
  const storage = isRememberLogin() ? localStorage : sessionStorage;
  
  storage.setItem(TOKEN_KEYS.ACCESS_TOKEN, newAccessToken);
  
  if (newRefreshToken) {
    storage.setItem(TOKEN_KEYS.REFRESH_TOKEN, newRefreshToken);
  }
};

// Refresh JWT token
export const refreshToken = async () => {
  // Prevent multiple simultaneous refresh attempts
  if (refreshInProgress) {
    return refreshPromise;
  }
  
  refreshInProgress = true;
  
  try {
    const refreshTokenValue = getRefreshToken();
    
    if (!refreshTokenValue) {
      throw new Error('No refresh token available');
    }
    
    // Create refresh promise
    refreshPromise = axios.post(`${API_BASE_URL}/token/refresh/`, {
      refresh: refreshTokenValue
    });
    
    const response = await refreshPromise;
    const { access } = response.data;
    
    // Update the access token
    updateTokens(access);
    
    // Clear refresh state
    refreshPromise = null;
    refreshInProgress = false;
    
    return access;
    
  } catch (error) {
    console.error('Token refresh failed:', error);
    
    // If refresh fails, clear all auth data
    clearAuthData();
    
    // Clear refresh state
    refreshPromise = null;
    refreshInProgress = false;
    
    throw error;
  }
};

// Check if token is expired (simple check - assumes 1 hour expiry)
export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;
  
  try {
    // Decode JWT (basic check - in production, use a proper JWT library)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    
    return payload.exp < now;
  } catch (error) {
    console.error('Error checking token expiry:', error);
    return true;
  }
};

// Get authorization headers with automatic token refresh
export const getAuthHeaders = async () => {
  let token = getToken();
  
  if (!token) {
    throw new Error('No authentication token found. Please login again.');
  }
  
  // Check if token is expired or about to expire (within 5 minutes)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    const fiveMinutes = 5 * 60;
    
    if (payload.exp < (now + fiveMinutes)) {
      // Token is expiring soon, refresh it
      token = await refreshToken();
    }
  } catch (error) {
    console.error('Error checking token expiry:', error);
    // If we can't check expiry, try to refresh anyway
    try {
      token = await refreshToken();
    } catch (refreshError) {
      throw new Error('Authentication failed. Please login again.');
    }
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Create authenticated axios instance
export const createAuthenticatedAxios = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
  });
  
  // Add request interceptor to include auth headers
  instance.interceptors.request.use(
    async (config) => {
      try {
        const headers = await getAuthHeaders();
        Object.assign(config.headers, headers);
      } catch (error) {
        // If auth fails, redirect to login
        clearAuthData();
        window.location.href = '/login';
        throw error;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Add response interceptor to handle 401 errors
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        // Token is invalid, clear auth data and redirect
        clearAuthData();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
  
  return instance;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken() && !isTokenExpired();
};

// Get user role
export const getUserRole = () => {
  const userData = getUserData();
  return userData ? userData.role : null;
};

// Check if user is admin/superuser
export const isAdmin = () => {
  const userData = getUserData();
  if (!userData) return false;
  
  return userData.is_superuser || userData.role === 'Admin';
};

// Check if user is seller - UNIFIED SELLER DETECTION
export const isSeller = () => {
  const userData = getUserData();
  if (!userData) return false;
  
  // Normalize and check role field (case-insensitive)
  const userRole = (userData.role || '').toString().toLowerCase().trim();
  if (userRole && (userRole === 'seller' || userRole.includes('seller'))) {
    return true;
  }
  
  // Normalize and check user_type field
  const userType = (userData.user_type || '').toString().toLowerCase().trim();
  if (userType && (userType === 'seller' || userType.includes('seller'))) {
    return true;
  }
  
  // Check for business-related keywords that indicate seller status
  const businessKeywords = ['seller', 'merchant', 'store', 'business', 'vendor'];
  const userFields = Object.keys(userData).map(key => ({
    key,
    value: String(userData[key] || '').toLowerCase()
  }));
  
  const containsBusinessKeyword = userFields.some(field =>
    businessKeywords.some(keyword => field.value.includes(keyword))
  );
  
  return containsBusinessKeyword;
};

// Check if user is staff
export const isStaff = () => {
  const userData = getUserData();
  if (!userData) return false;
  
  return userData.role === 'Staff' || userData.is_staff;
};

// Get user dashboard URL based on role
export const getDashboardUrl = () => {
  const userData = getUserData();
  if (!userData) return '/login';
  
  // Admin and superuser get admin dashboard
  if (userData.is_superuser || userData.role === 'Admin') {
    return '/admin';
  }
  
  // Seller gets seller dashboard (using unified seller detection)
  if (isSeller()) {
    return '/seller/admin';
  }
  
  // Staff gets user dashboard
  if (userData.role === 'Staff' || userData.is_staff) {
    return '/dashboard';
  }
  
  // Default for students and buyers
  return '/dashboard';
};

// Get role-based user information
export const getUserRoleInfo = () => {
  const userData = getUserData();
  if (!userData) return null;
  
  const roleInfo = {
    role: userData.role || 'Student',
    isAdmin: userData.is_superuser || userData.role === 'Admin',
    isSeller: isSeller(), // Use unified seller detection
    isStaff: userData.role === 'Staff' || userData.is_staff,
    isStudent: userData.role === 'Student' || (!userData.is_superuser && userData.role !== 'Admin' && !isSeller() && userData.role !== 'Staff')
  };
  
  return roleInfo;
};

// Check if user has specific permissions based on role
export const hasPermission = (permission) => {
  const userData = getUserData();
  if (!userData) return false;
  
  // Admin has all permissions
  if (userData.is_superuser || userData.role === 'Admin') {
    return true;
  }
  
  // Define role-based permissions
  const permissions = {
    'admin_panel': userData.is_superuser || userData.role === 'Admin',
    'seller_panel': isSeller(), // Use unified seller detection
    'manage_books': userData.is_superuser || userData.role === 'Admin' || isSeller(),
    'manage_users': userData.is_superuser || userData.role === 'Admin',
    'view_analytics': userData.is_superuser || userData.role === 'Admin' || isSeller(),
    'manage_payments': userData.is_superuser || userData.role === 'Admin' || isSeller(),
    'staff_features': userData.role === 'Staff' || userData.is_staff
  };
  
  return permissions[permission] || false;
};