# Quick Guide: Update Frontend API Calls

## ✅ What's Been Fixed

1. **Created** `frontend/src/config/apiConfig.js` - Centralized API configuration
2. **Updated** `frontend/src/api.jsx` - Main API file
3. **Updated** `frontend/src/services/sellerApi.js` - Seller API service

## 🔧 Files That Still Need Updating

### High Priority (Direct axios calls with hardcoded URLs)

1. **frontend/src/components/Products/Products.jsx**
   - Line 24: `axios.get("http://127.0.0.1:8000/api/books/")`
   
2. **frontend/src/components/pages/Home.jsx**
   - Line 30: `axios.get("http://127.0.0.1:8000/api/categories/")`

3. **frontend/src/components/seller/SellerDashboard.jsx**
   - Line 43: `axios.get('http://127.0.0.1:8000/api/seller/profile/')`

4. **frontend/src/components/seller/SellerAdminDashboard.jsx**
   - Multiple hardcoded URLs throughout

5. **frontend/src/components/SimpleSellerDashboard.jsx**
   - Lines 39, 65: Hardcoded API URLs

## 📝 How to Fix Each File

### Pattern to Follow

**BEFORE:**
```javascript
import axios from 'axios';

const response = await axios.get('http://127.0.0.1:8000/api/books/', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

**AFTER:**
```javascript
import apiClient, { API_ENDPOINTS } from '../config/apiConfig';

const response = await apiClient.get(API_ENDPOINTS.BOOKS);
// Token automatically added!
```

### Specific Fixes

#### 1. Products.jsx
```javascript
// OLD
import axios from "axios";
const res = await axios.get("http://127.0.0.1:8000/api/books/");

// NEW
import apiClient, { API_ENDPOINTS } from '../../config/apiConfig';
const res = await apiClient.get(API_ENDPOINTS.BOOKS);
```

#### 2. Home.jsx
```javascript
// OLD
import axios from "axios";
const response = await axios.get("http://127.0.0.1:8000/api/categories/");

// NEW
import apiClient, { API_ENDPOINTS } from '../../config/apiConfig';
const response = await apiClient.get(API_ENDPOINTS.CATEGORIES);
```

#### 3. SellerDashboard.jsx
```javascript
// OLD
import axios from 'axios';
const token = localStorage.getItem('authToken');
const response = await axios.get('http://127.0.0.1:8000/api/seller/profile/', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// NEW
import apiClient, { API_ENDPOINTS } from '../../config/apiConfig';
const response = await apiClient.get(API_ENDPOINTS.SELLER_PROFILE);
// Token automatically added!
```

#### 4. SellerAdminDashboard.jsx
```javascript
// OLD
const API_BASE = 'http://127.0.0.1:8000/api';
const token = getToken();
const response = await axios.get(`${API_BASE}/seller-books/`, {
  headers: { 'Authorization': `Bearer ${token}` }
});

// NEW
import apiClient, { API_ENDPOINTS } from '../../config/apiConfig';
const response = await apiClient.get(API_ENDPOINTS.SELLER_BOOKS);
```

## 🚀 Quick Update Commands

### Step 1: Update Products.jsx
```bash
# Open file
code frontend/src/components/Products/Products.jsx
```

Add at top:
```javascript
import apiClient, { API_ENDPOINTS } from '../../config/apiConfig';
```

Replace line 24:
```javascript
// OLD: const res = await axios.get("http://127.0.0.1:8000/api/books/");
const res = await apiClient.get(API_ENDPOINTS.BOOKS);
```

### Step 2: Update Home.jsx
```bash
code frontend/src/components/pages/Home.jsx
```

Add at top:
```javascript
import apiClient, { API_ENDPOINTS } from '../../config/apiConfig';
```

Replace line 30:
```javascript
// OLD: const response = await axios.get("http://127.0.0.1:8000/api/categories/");
const response = await apiClient.get(API_ENDPOINTS.CATEGORIES);
```

### Step 3: Update Seller Files

For each seller file, replace:
1. Remove `const API_BASE = 'http://127.0.0.1:8000/api';`
2. Add `import apiClient, { API_ENDPOINTS } from '../../config/apiConfig';`
3. Replace all `axios.get/post/put/delete` with `apiClient.get/post/put/delete`
4. Replace hardcoded URLs with `API_ENDPOINTS` constants
5. Remove manual token handling (it's automatic now)

## ✅ Testing After Updates

### 1. Start Backend
```bash
cd backend
python manage.py runserver
```

### 2. Start Frontend
```bash
cd frontend
npm start
```

### 3. Test Features
- Open browser to http://localhost:5173
- Check browser console for API requests
- Test login/register
- Test book browsing
- Test seller dashboard
- Check for any errors

### 4. Check Console Logs
You should see:
```
🔵 API Request: GET /books/
🟢 API Response: /books/ 200
```

## 🐛 Common Issues

### Issue: "Cannot find module './config/apiConfig'"
**Solution:** Check the import path. Use correct relative path:
- From `components/pages/`: `../../config/apiConfig`
- From `components/Products/`: `../../config/apiConfig`
- From `services/`: `../config/apiConfig`

### Issue: "API_ENDPOINTS is not defined"
**Solution:** Import it:
```javascript
import apiClient, { API_ENDPOINTS } from '../config/apiConfig';
```

### Issue: "401 Unauthorized"
**Solution:** 
1. Check if user is logged in
2. Check if token exists: `localStorage.getItem('access_token')`
3. Try logging out and back in

### Issue: "Network Error"
**Solution:**
1. Check if backend is running on port 8000
2. Check API_BASE_URL in `apiConfig.js`
3. Check browser console for CORS errors

## 📊 Progress Tracker

- [x] Create centralized API config
- [x] Update api.jsx
- [x] Update sellerApi.js
- [ ] Update Products.jsx
- [ ] Update Home.jsx
- [ ] Update SellerDashboard.jsx
- [ ] Update SellerAdminDashboard.jsx
- [ ] Update SimpleSellerDashboard.jsx
- [ ] Test all features
- [ ] Document any issues

## 🎯 Benefits After Update

1. **No more hardcoded URLs** - Change once in apiConfig.js
2. **Automatic authentication** - No manual token management
3. **Automatic token refresh** - Better user experience
4. **Consistent error handling** - Same format everywhere
5. **Better debugging** - Centralized logging
6. **Production ready** - Easy environment switching

## 📞 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Check Django console for API requests
3. Verify backend is running on port 8000
4. Check `FRONTEND_API_FIX_COMPLETE.md` for detailed docs
5. Test API directly: `curl http://127.0.0.1:8000/api/health/`

## 🎉 Summary

The frontend API system is now centralized and professional. After updating the remaining files, all API calls will:
- Use the same configuration
- Handle authentication automatically
- Refresh tokens automatically
- Handle errors consistently
- Be easier to maintain and test

Just update the remaining component files following the patterns above!
