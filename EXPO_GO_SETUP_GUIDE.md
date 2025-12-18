# 📱 Expo Go Setup & Usage Guide

## ✅ What is Expo Go?

Expo Go is a free mobile app that lets you test your React Native app without building it. It's like a browser for React Native apps.

## 📥 Step 1: Install Expo Go

### On Android:
1. Open **Google Play Store**
2. Search for **"Expo Go"**
3. Install the app
4. Open Expo Go

### On iOS:
1. Open **App Store**
2. Search for **"Expo Go"**
3. Install the app
4. Open Expo Go

**Direct Links:**
- Android: https://play.google.com/store/apps/details?id=host.exp.exponent
- iOS: https://apps.apple.com/app/expo-go/id982107779

## 🚀 Step 2: Start Your Mobile App

### On Your Computer:

```bash
cd BookMarketMobile
npm start
```

You should see:
```
› Metro waiting on exp://192.168.1.100:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press ? │ show all commands
```

## 📲 Step 3: Connect with Expo Go

### Method 1: Scan QR Code (Recommended)

#### On Android:
1. Open **Expo Go** app
2. Tap **"Scan QR Code"**
3. Scan the QR code from your computer terminal
4. Wait for app to load

#### On iOS:
1. Open **Camera** app (not Expo Go)
2. Point at QR code
3. Tap notification to open in Expo Go
4. Wait for app to load

### Method 2: Manual Connection

#### On Android:
1. Open **Expo Go**
2. Tap **"Enter URL manually"**
3. Type: `exp://YOUR_IP:8081`
   - Example: `exp://192.168.1.100:8081`
4. Tap **"Connect"**

#### On iOS:
1. Open **Expo Go**
2. Tap **"Enter URL manually"**
3. Type: `exp://YOUR_IP:8081`
4. Tap **"Connect"**

## 🔧 Step 4: Configure Network

### Find Your IP Address:

```bash
# Windows
ipconfig

# Look for IPv4 Address
# Example: 192.168.1.100
```

### Update API Configuration:

**File:** `BookMarketMobile/src/api/client.js`

```javascript
// Change this:
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// To this (use YOUR IP):
const API_BASE_URL = 'http://192.168.1.100:8000/api';
```

### Start Backend with Network Access:

```bash
cd backend
python manage.py runserver 0.0.0.0:8000
```

## ✅ Verification Checklist

### Before Starting:
- [ ] Expo Go installed on phone
- [ ] Phone and computer on same WiFi
- [ ] Found computer's IP address
- [ ] Updated `client.js` with IP address
- [ ] Backend running on `0.0.0.0:8000`

### Testing:
- [ ] Can scan QR code in Expo Go
- [ ] App loads in Expo Go
- [ ] Can see splash screen
- [ ] Can navigate through app
- [ ] API calls work (no network errors)

## 🐛 Common Issues & Solutions

### Issue 1: "Unable to connect to Metro"
**Cause:** Phone and computer on different networks

**Solution:**
1. Check phone WiFi: Settings → WiFi
2. Check computer WiFi: Network settings
3. Connect both to **same WiFi network**
4. Restart Expo: Press `r` in terminal

### Issue 2: "Network request failed"
**Cause:** Wrong IP address in API configuration

**Solution:**
1. Find IP: `ipconfig`
2. Update `BookMarketMobile/src/api/client.js`
3. Restart app: Press `r` in Expo Go

### Issue 3: QR code won't scan
**Cause:** Camera permissions or QR code quality

**Solution:**
1. **Android:** Use Expo Go's built-in scanner
2. **iOS:** Use Camera app, not Expo Go
3. **Alternative:** Use manual URL entry
4. Make terminal window bigger for clearer QR code

### Issue 4: "Something went wrong"
**Cause:** Code error or missing dependencies

**Solution:**
```bash
# Clear cache and restart
cd BookMarketMobile
npm start -- --clear
```

### Issue 5: App loads but shows blank screen
**Cause:** JavaScript error

**Solution:**
1. Shake phone to open developer menu
2. Tap "Debug Remote JS"
3. Check browser console for errors
4. Fix errors and reload

## 🎯 Quick Start Commands

### Terminal 1 - Backend:
```bash
cd backend
python manage.py runserver 0.0.0.0:8000
```

### Terminal 2 - Mobile App:
```bash
cd BookMarketMobile
npm start
```

### On Phone:
1. Open Expo Go
2. Scan QR code
3. Wait for app to load

## 📱 Using Expo Go Features

### Developer Menu:
- **Android:** Shake phone or press hardware menu button
- **iOS:** Shake phone

### Menu Options:
- **Reload** - Refresh the app
- **Debug Remote JS** - Open Chrome debugger
- **Show Performance Monitor** - See FPS and memory
- **Toggle Element Inspector** - Inspect UI elements
- **Disable Fast Refresh** - Turn off auto-reload

### Keyboard Shortcuts (in terminal):
- `r` - Reload app
- `m` - Toggle menu
- `d` - Open developer menu
- `i` - Open iOS simulator
- `a` - Open Android emulator
- `w` - Open in web browser

## 🔍 Testing Your App

### Test 1: Basic Loading
1. Open app in Expo Go
2. Should see splash screen
3. Should see onboarding screens
4. Should reach welcome screen

### Test 2: API Connection
1. Try to login
2. Check if books load
3. Try to browse categories
4. Check console for API requests

### Test 3: Navigation
1. Navigate between screens
2. Test back button
3. Test tab navigation
4. Test deep linking

## 📊 Monitoring & Debugging

### View Logs:
```bash
# In terminal where you ran npm start
# All console.log() will appear here
```

### View Network Requests:
1. Shake phone
2. Tap "Debug Remote JS"
3. Open Chrome DevTools
4. Go to Network tab

### View Console Logs:
1. Shake phone
2. Tap "Debug Remote JS"
3. Open Chrome DevTools
4. Go to Console tab

## 🎨 Development Workflow

### 1. Make Code Changes
Edit files in `BookMarketMobile/src/`

### 2. Auto Reload
App automatically reloads when you save

### 3. Manual Reload
Press `r` in terminal or shake phone → Reload

### 4. Test Changes
Verify changes work on phone

### 5. Debug Issues
Use developer menu and Chrome DevTools

## 🚀 Production Build (Later)

When ready for production:

### Android APK:
```bash
eas build --platform android
```

### iOS IPA:
```bash
eas build --platform ios
```

### App Stores:
```bash
eas submit --platform android
eas submit --platform ios
```

## 📋 Expo Go Limitations

### What Works:
✅ Most React Native features
✅ Expo SDK features
✅ API calls
✅ Navigation
✅ State management
✅ Styling

### What Doesn't Work:
❌ Custom native modules
❌ Some third-party libraries
❌ Background tasks
❌ Push notifications (need dev build)

## 💡 Pro Tips

1. **Keep terminal visible** - See logs in real-time
2. **Use Fast Refresh** - Auto-reload on save
3. **Shake for menu** - Quick access to tools
4. **Debug in Chrome** - Full DevTools access
5. **Same WiFi always** - Consistent connection
6. **Clear cache if stuck** - `npm start -- --clear`

## 🎯 Success Indicators

When everything works:

### Terminal Shows:
```
› Metro waiting on exp://192.168.1.100:8081
› Logs for your project will appear below. Press Ctrl+C to exit.
```

### Phone Shows:
- Splash screen appears
- App loads successfully
- Can navigate screens
- API calls work
- No error messages

### Backend Shows:
```
[08/Dec/2025 10:30:15] "GET /api/health/ HTTP/1.1" 200 45
[08/Dec/2025 10:30:20] "GET /api/books/ HTTP/1.1" 200 1234
```

## 📞 Need Help?

### Check These First:
1. Same WiFi network?
2. Backend running on `0.0.0.0:8000`?
3. Correct IP in `client.js`?
4. Expo Go up to date?
5. Node modules installed?

### Still Issues?
1. Clear cache: `npm start -- --clear`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Restart everything
4. Check error messages in terminal

## 🎉 You're Ready!

Follow these steps:
1. ✅ Install Expo Go on phone
2. ✅ Connect to same WiFi
3. ✅ Update IP in `client.js`
4. ✅ Start backend: `python manage.py runserver 0.0.0.0:8000`
5. ✅ Start app: `npm start`
6. ✅ Scan QR code in Expo Go
7. ✅ Test the app!

Happy coding! 🚀
