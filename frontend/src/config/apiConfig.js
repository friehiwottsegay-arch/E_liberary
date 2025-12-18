/**
 * Centralized API Configuration for React Frontend
 * Single source of truth for all API endpoints and axios configuration
 */

import axios from 'axios';
import { getToken, refreshToken, clearAuthData } from '../utils/authUtils';

// API Base URL - Change this for production
export const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to all requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔵 API Request:', config.method.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('🔴 Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh and errors
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🟢 API Response:', response.config.url, response.status);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized - Try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear auth and redirect to login
        clearAuthData();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('🔴 API Error:', error.response?.status, error.config?.url);
    }
    
    return Promise.reject(error);
  }
);

// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/login/',
  REGISTER: '/register/',
  LOGOUT: '/logout/',
  TOKEN_REFRESH: '/token/refresh/',
  CURRENT_USER: '/current_user/',
  
  // Books
  BOOKS: '/books/',
  BOOK_DETAIL: (id) => `/admin-books/${id}/`,
  CATEGORIES: '/categories/',
  SUBCATEGORIES: '/subcategory/',
  ADMIN_BOOKS: '/admin-books/',
  
  // Exams
  EXAMS: '/exams/',
  EXAM_DETAIL: (id) => `/exams/${id}/`,
  SUBJECTS: '/subjects/',
  QUESTIONS: (subjectName) => `/question/${subjectName}/`,
  QCATEGORIES: '/qcategories/',
  
  // Audiobooks
  AUDIOBOOKS: '/audiobooks/',
  AUDIOBOOK_LIST: '/audiobooks/list/',
  AUDIOBOOK_DETAIL: (id) => `/audiobooks/${id}/detail/`,
  GENERATE_AUDIO: '/audiobooks/generate-audio/',
  SAVE_RECORDING: '/audiobooks/save-recording/',
  EXTRACT_TEXT: (id) => `/audiobooks/extract-text/${id}/`,
  
  // Payments
  PAYMENTS: '/payments/',
  PROCESS_PAYMENT: '/payments/process/',
  CHAPA_PAYMENT: '/payments/chapa/',
  PAYMENT_METHODS: '/payments/methods/',
  USER_PURCHASES: '/payments/user-purchases/',
  CHECK_ACCESS: (bookId) => `/user-purchases/check-access/${bookId}/`,
  VERIFY_PAYMENT: '/payments/chapa/verify/',
  
  // Seller
  SELLER_DASHBOARD: '/seller/dashboard/',
  SELLER_PROFILE: '/seller/profile/',
  SELLER_BOOKS: '/seller-books/',
  SELLER_ORDERS: '/seller-books/order_management/',
  SELLER_ANALYTICS: '/seller-books/sales_analytics/',
  SELLER_INVENTORY: '/seller/inventory/',
  
  // Projects
  PROJECTS: '/projects/',
  PROJECT_DETAIL: (id) => `/projects/${id}/`,
  
  // Dictionary
  SIGNWORDS: '/signwords/',
  SIGNWORD_DETAIL: (id) => `/signwords/${id}/`,
  
  // Admin
  ADMIN_ANALYTICS: '/admin/analytics/',
  ADMIN_USERS: '/admin-users/',
  DASHBOARD_STATS: '/dashboard/',
  RECENT_ACTIVITIES: '/recent-activities/',
  
  // Health Check
  HEALTH: '/health/',
};

// Export configured axios instance
export default apiClient;

// Helper function to create FormData for file uploads
export const createFormData = (data, files = {}) => {
  const formData = new FormData();
  
  // Add regular data fields
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  
  // Add file fields
  Object.keys(files).forEach(key => {
    if (files[key]) {
      formData.append(key, files[key]);
    }
  });
  
  return formData;
};

// Helper function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const message = error.response.data?.error || 
                   error.response.data?.message || 
                   error.response.data?.detail ||
                   'An error occurred';
    return {
      success: false,
      message,
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // Request made but no response
    return {
      success: false,
      message: 'No response from server. Please check your connection.',
      status: 0
    };
  } else {
    // Error in request setup
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      status: -1
    };
  }
};

// Helper function for GET requests
export const apiGet = async (endpoint, params = {}) => {
  try {
    const response = await apiClient.get(endpoint, { params });
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

// Helper function for POST requests
export const apiPost = async (endpoint, data = {}) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

// Helper function for PUT requests
export const apiPut = async (endpoint, data = {}) => {
  try {
    const response = await apiClient.put(endpoint, data);
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

// Helper function for PATCH requests
export const apiPatch = async (endpoint, data = {}) => {
  try {
    const response = await apiClient.patch(endpoint, data);
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

// Helper function for DELETE requests
export const apiDelete = async (endpoint) => {
  try {
    const response = await apiClient.delete(endpoint);
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};
