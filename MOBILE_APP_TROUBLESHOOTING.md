# Mobile App Troubleshooting Guide

## ✅ Issues Fixed

### API Connection Issues
All API files have been fixed to use the correct endpoints and authentication:

1. **payments.js** - Fixed missing `/` in endpoint URL
2. **dictionary.js** - Fixed port (8001→8000) and now uses apiClient
3. **projects.js** - Fixed port (8001→8000) and now uses apiClient  
4. **audiobooks.js** - Fixed all endpoint URLs to match backend

## 🚀 How to Test the Fixes

### Step 1: Make Sure Backend is Running
```bash
cd backend
python manage.py runserver
```

You should see:
```
Django version 5.2.7, using settings 'dl.settings'
Starting development server at http://127.0.0.1:8000/
```

### Step 2: Test Backend API (Optional)
Run the test script:
```bash
TEST_MOBILE_API_CONNECTION.bat
```

Or manually test:
```bash
curl http://127.0.0.1:8000/api/health/
curl http://127.0.0.1:8000/api/books/
```

### Step 3: Start Mobile App
```bash
cd BookMarketMobile
npm start
```

Or use the batch file:
```bash
cd BookMarketMobile
START.bat
```

### Step 4: Test on Device/Emulator

#### For Android Emulator:
- Press `a` in the Expo terminal
- Or scan QR code with Expo Go app

#### For Physical Device:
**IMPORTANT:** You need to update the API URL in `BookMarketMobile/src/api/client.js`

1. Find your computer's IP address:
   - Windows: Open CMD and run `ipconfig`
   - Look for "IPv4 Address" (e.g., 192.168.1.100)

2. Update the API URL:
```javascript
// Change this line in BookMarketMobile/src/api/client.js
const API_BASE_URL = 'http://YOUR_IP_ADDRESS:8000/api';
// Example: const API_BASE_URL = 'http://192.168.1.100:8000/api';
```

3. Make sure your phone and computer are on the same WiFi network

## 🔍 Common Issues and Solutions

### Issue 1: "Network Error" or "Failed to fetch"
**Cause:** Backend not running or wrong IP address

**Solution:**
1. Check if Django server is running on port 8000
2. If using physical device, verify IP address is correct
3. Check firewall settings (allow port 8000)

### Issue 2: "401 Unauthorized" errors
**Cause:** Authentication token issues

**Solution:**
1. Try logging out and logging back in
2. Clear app data (in Expo Go: shake device → Clear cache)
3. Check if token refresh is working in apiClient

### Issue 3: "404 Not Found" errors
**Cause:** Wrong API endpoint

**Solution:**
1. Check the endpoint URL in the API file
2. Verify the endpoint exists in `backend/api/urls.py`
3. Make sure you're using the fixed API files

### Issue 4: App crashes on startup
**Cause:** Missing dependencies or syntax errors

**Solution:**
1. Clear node_modules and reinstall:
```bash
cd BookMarketMobile
rm -rf node_modules
npm install
```

2. Clear Expo cache:
```bash
expo start -c
```

### Issue 5: "Cannot connect to Metro bundler"
**Cause:** Metro bundler not running

**Solution:**
1. Stop the app (Ctrl+C)
2. Clear cache and restart:
```bash
npm start -- --reset-cache
```

## 📱 Testing Checklist

After starting the app, test these features:

- [ ] **Splash Screen** - Shows for 2 seconds
- [ ] **Onboarding** - Swipe through 3 screens
- [ ] **Welcome Screen** - Login/Register buttons work
- [ ] **Login** - Can login with demo user (demo/demo123)
- [ ] **Home Screen** - Shows books and categories
- [ ] **Book List** - Can browse books
- [ ] **Book Detail** - Shows book information
- [ ] **Search** - Can search for books
- [ ] **Cart** - Can add/remove books
- [ ] **Payment** - Payment flow works
- [ ] **Exams** - Can view and take exams
- [ ] **Dictionary** - Sign language dictionary works
- [ ] **AI Assistant** - Chat with AI works
- [ ] **Profile** - User profile displays
- [ ] **My Purchases** - Shows purchased books
- [ ] **Audiobook Player** - Can play audiobooks
- [ ] **PDF Reader** - Can read PDF books

## 🐛 Debugging Tips

### Enable Debug Logging
Add this to see API requests in console:

```javascript
// In BookMarketMobile/src/api/client.js
apiClient.interceptors.request.use(
  async (config) => {
    console.log('🔵 API Request:', config.method.toUpperCase(), config.url);
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log('🔴 Request Error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('🟢 API Response:', response.config.url, response.status);
    return response;
  },
  async (error) => {
    console.log('🔴 Response Error:', error.config?.url, error.response?.status);
    // ... rest of error handling
  }
);
```

### Check React Native Debugger
1. Shake device or press `Ctrl+M` (Android) / `Cmd+D` (iOS)
2. Select "Debug"
3. Open Chrome DevTools to see console logs

### Check Backend Logs
Watch Django console for API requests:
```bash
# In backend directory
python manage.py runserver
# Watch for incoming requests
```

## 📞 Need More Help?

If you're still having issues:

1. Check the console logs in both:
   - Expo terminal (mobile app)
   - Django terminal (backend)

2. Look for specific error messages

3. Check network tab in browser DevTools if using web

4. Verify all dependencies are installed:
```bash
# Backend
cd backend
pip install -r requirements.txt

# Mobile
cd BookMarketMobile
npm install
```

## 🎯 Quick Start Commands

```bash
# Terminal 1 - Start Backend
cd backend
python manage.py runserver

# Terminal 2 - Start Mobile App
cd BookMarketMobile
npm start
```

Then press `a` for Android or `i` for iOS, or scan QR code with Expo Go app.
