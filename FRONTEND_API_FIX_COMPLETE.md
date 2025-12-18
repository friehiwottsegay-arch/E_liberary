# React Frontend API Connection - Complete Fix

## ✅ Issues Fixed

### 1. Created Centralized API Configuration
**New File:** `frontend/src/config/apiConfig.js`

This file provides:
- Single source of truth for API base URL
- Configured axios instance with interceptors
- Automatic JWT token handling
- Automatic token refresh on 401 errors
- Consistent error handling
- Helper functions for all HTTP methods
- All API endpoints in one place

### 2. Updated Main API File
**File:** `frontend/src/api.jsx`

Changes:
- Now imports from centralized `apiConfig.js`
- Uses `apiClient` instead of raw axios
- Uses `API_ENDPOINTS` constants
- Consistent error handling

### 3. Updated Seller API Service
**File:** `frontend/src/services/sellerApi.js`

Changes:
- Imports from centralized `apiConfig.js`
- Removed duplicate API_BASE constant
- Removed manual token handling (now automatic)
- Uses centralized error handling

## 📋 API Configuration Features

### Automatic Authentication
```javascript
// Token automatically added to all requests
apiClient.interceptors.request.use(async (config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Automatic Token Refresh
```javascript
// Automatically refreshes expired tokens
if (error.response?.status === 401 && !originalRequest._retry) {
  const newToken = await refreshToken();
  originalRequest.headers.Authorization = `Bearer ${newToken}`;
  return apiClient(originalRequest);
}
```

### Centralized Error Handling
```javascript
export const handleApiError = (error) => {
  if (error.response) {
    return {
      success: false,
      message: error.response.data?.error || 'An error occurred',
      status: error.response.status
    };
  }
  // ... more error handling
};
```

## 🔧 How to Use

### Basic GET Request
```javascript
import apiClient, { API_ENDPOINTS } from './config/apiConfig';

// Get all books
const response = await apiClient.get(API_ENDPOINTS.BOOKS);

// Or use helper function
import { apiGet } from './config/apiConfig';
const result = await apiGet(API_ENDPOINTS.BOOKS);
if (result.success) {
  console.log(result.data);
}
```

### POST Request with Data
```javascript
import { apiPost, API_ENDPOINTS } from './config/apiConfig';

const result = await apiPost(API_ENDPOINTS.LOGIN, {
  username: 'demo',
  password: 'demo123'
});

if (result.success) {
  console.log('Login successful:', result.data);
} else {
  console.error('Login failed:', result.message);
}
```

### File Upload
```javascript
import { createFormData } from './config/apiConfig';
import apiClient from './config/apiConfig';

const formData = createFormData(
  { title: 'My Book', author: 'John Doe' },
  { cover_image: file, pdf_file: pdfFile }
);

const response = await apiClient.post('/books/', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

## 📍 Available API Endpoints

All endpoints are defined in `API_ENDPOINTS` object:

### Authentication
- `LOGIN` - `/login/`
- `REGISTER` - `/register/`
- `CURRENT_USER` - `/current_user/`
- `TOKEN_REFRESH` - `/token/refresh/`

### Books
- `BOOKS` - `/books/`
- `BOOK_DETAIL(id)` - `/admin-books/${id}/`
- `CATEGORIES` - `/categories/`

### Exams
- `EXAMS` - `/exams/`
- `EXAM_DETAIL(id)` - `/exams/${id}/`
- `SUBJECTS` - `/subjects/`
- `QUESTIONS(name)` - `/question/${name}/`

### Audiobooks
- `AUDIOBOOKS` - `/audiobooks/`
- `AUDIOBOOK_LIST` - `/audiobooks/list/`
- `AUDIOBOOK_DETAIL(id)` - `/audiobooks/${id}/detail/`
- `GENERATE_AUDIO` - `/audiobooks/generate-audio/`

### Payments
- `PROCESS_PAYMENT` - `/payments/process/`
- `CHAPA_PAYMENT` - `/payments/chapa/`
- `USER_PURCHASES` - `/payments/user-purchases/`
- `CHECK_ACCESS(bookId)` - `/user-purchases/check-access/${bookId}/`

### Seller
- `SELLER_DASHBOARD` - `/seller/dashboard/`
- `SELLER_PROFILE` - `/seller/profile/`
- `SELLER_BOOKS` - `/seller-books/`
- `SELLER_ORDERS` - `/seller-books/order_management/`

## 🔄 Migration Guide

### Before (Old Way)
```javascript
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

const getBooks = async () => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get(`${API_BASE}/books/`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
};
```

### After (New Way)
```javascript
import apiClient, { API_ENDPOINTS } from './config/apiConfig';

const getBooks = async () => {
  // Token automatically added!
  const response = await apiClient.get(API_ENDPOINTS.BOOKS);
  return response.data;
};

// Or even simpler with helper
import { apiGet, API_ENDPOINTS } from './config/apiConfig';

const getBooks = async () => {
  const result = await apiGet(API_ENDPOINTS.BOOKS);
  return result.success ? result.data : null;
};
```

## 🎯 Benefits

1. **Single Source of Truth** - One place to change API URL
2. **Automatic Authentication** - No manual token management
3. **Automatic Token Refresh** - Seamless user experience
4. **Consistent Error Handling** - Same error format everywhere
5. **Type Safety** - Endpoint constants prevent typos
6. **Better Debugging** - Centralized logging in development
7. **Easier Testing** - Mock apiClient instead of axios
8. **Production Ready** - Easy to switch environments

## 🚀 Next Steps

### 1. Update Remaining Files

Files that still need updating:
- `frontend/src/components/Products/Products.jsx`
- `frontend/src/components/seller/SellerDashboard.jsx`
- `frontend/src/components/seller/SellerAdminDashboard.jsx`
- `frontend/src/components/SimpleSellerDashboard.jsx`
- Any other files using raw axios

### 2. Search and Replace Pattern

Find:
```javascript
axios.get('http://127.0.0.1:8000/api/
```

Replace with:
```javascript
import apiClient, { API_ENDPOINTS } from '../config/apiConfig';
// Then use: apiClient.get(API_ENDPOINTS.
```

### 3. Test All Features

- [ ] Login/Register
- [ ] Book browsing
- [ ] Book purchase
- [ ] Seller dashboard
- [ ] Admin panel
- [ ] Exam taking
- [ ] Audiobook playback
- [ ] Payment processing

## 📝 Configuration for Production

When deploying to production, update the API URL:

```javascript
// frontend/src/config/apiConfig.js

// Development
export const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Production
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-domain.com/api';
```

Then set environment variable:
```bash
# .env.production
REACT_APP_API_URL=https://your-domain.com/api
```

## ✅ Status

- ✅ Created centralized API configuration
- ✅ Updated main API file (api.jsx)
- ✅ Updated seller API service
- ⏳ Need to update remaining component files
- ⏳ Need to test all features

## 🔍 Testing

### Test Backend Connection
```bash
# In frontend directory
npm start

# Open browser console and run:
fetch('http://127.0.0.1:8000/api/health/')
  .then(r => r.json())
  .then(console.log)
```

### Test API Client
```javascript
// In browser console
import apiClient from './config/apiConfig';
apiClient.get('/health/').then(console.log);
```

## 📚 Documentation

All API configuration is now documented in:
- `frontend/src/config/apiConfig.js` - Main configuration
- `frontend/src/utils/authUtils.js` - Authentication utilities
- `frontend/src/services/sellerApi.js` - Seller-specific APIs

## 🎉 Summary

The React frontend now has a professional, centralized API configuration system that:
- Automatically handles authentication
- Automatically refreshes tokens
- Provides consistent error handling
- Makes the codebase more maintainable
- Follows best practices

All new API calls should use the centralized `apiClient` and `API_ENDPOINTS` from `config/apiConfig.js`.
