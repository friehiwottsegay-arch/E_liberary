# 🚀 Quick Start Guide - Mobile App & Backend

## ✅ Status Check

### Backend Status
- ✅ Django server is running on port 8000
- ✅ API endpoints are configured correctly
- ✅ Database is ready

### Mobile App Status
- ✅ All API connection issues fixed
- ✅ Authentication configured
- ✅ All endpoints corrected
- ✅ Ready to test

## 🎯 Start Everything (2 Steps)

### Step 1: Backend is Already Running ✅
Your Django server is already running on `http://127.0.0.1:8000`

To verify, open browser: http://127.0.0.1:8000/api/health/

### Step 2: Start Mobile App

```bash
cd BookMarketMobile
npm start
```

Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator  
- Scan QR code with Expo Go app on your phone

## 📱 For Physical Device

If testing on your phone (not emulator):

1. Find your computer's IP:
```bash
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

2. Update API URL in `BookMarketMobile/src/api/client.js`:
```javascript
const API_BASE_URL = 'http://YOUR_IP:8000/api';
// Example: 'http://192.168.1.100:8000/api'
```

3. Make sure phone and computer are on same WiFi

## 🧪 Test Login

Use demo account:
- **Username:** demo
- **Password:** demo123

## 📋 What Was Fixed

1. ✅ **payments.js** - Fixed missing `/` in API endpoint
2. ✅ **dictionary.js** - Fixed port and authentication
3. ✅ **projects.js** - Fixed port and authentication
4. ✅ **audiobooks.js** - Fixed all endpoint URLs

## 🔍 Quick Troubleshooting

### "Network Error"
- Check if backend is running: http://127.0.0.1:8000/api/health/
- If on phone, verify IP address is correct

### "401 Unauthorized"
- Try logging out and back in
- Clear app cache (shake device → Clear cache)

### App won't start
```bash
cd BookMarketMobile
rm -rf node_modules
npm install
npm start
```

## 📚 Documentation

- `API_FIX_SUMMARY.md` - What was fixed
- `MOBILE_API_FIXES.md` - Detailed technical fixes
- `MOBILE_APP_TROUBLESHOOTING.md` - Full troubleshooting guide
- `TEST_MOBILE_API_CONNECTION.bat` - Test backend APIs

## ✨ Features to Test

- [ ] Login/Register
- [ ] Browse books
- [ ] Search books
- [ ] View book details
- [ ] Add to cart
- [ ] Purchase books
- [ ] View purchases
- [ ] Play audiobooks
- [ ] Take exams
- [ ] Use dictionary
- [ ] Chat with AI
- [ ] View profile

## 🎉 You're Ready!

Everything is fixed and ready to go. Just start the mobile app and test!

```bash
cd BookMarketMobile
npm start
```

Press `a` for Android or scan QR code with Expo Go app.
