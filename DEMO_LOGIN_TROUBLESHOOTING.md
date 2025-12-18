# Demo Login Troubleshooting Guide 🔧

## ✅ Quick Checklist

### 1. **Is Backend Running?**
```cmd
cd backend
python manage.py runserver 8001
```

You should see:
```
Starting development server at http://127.0.0.1:8001/
```

### 2. **Does Demo User Exist?**
```cmd
cd backend
python create_demo_user.py
```

You should see:
```
✓ Demo user 'demo_buyer' already exists
Username: demo_buyer
Password: demo123
```

### 3. **Check API URL**

#### For Android Emulator:
- URL: `http://10.0.2.2:8001/api` ✅
- Edit: `BookMarketMobile/src/api/client.js`

#### For Physical Device:
- URL: `http://YOUR_COMPUTER_IP:8001/api`
- Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- Example: `http://192.168.1.100:8001/api`

### 4. **Update API URL**

Edit `BookMarketMobile/src/api/client.js`:

```javascript
// For Android Emulator
const API_BASE_URL = 'http://10.0.2.2:8001/api';

// OR for Physical Device (replace with your IP)
const API_BASE_URL = 'http://192.168.1.XXX:8001/api';
```

### 5. **Restart App**
```cmd
cd BookMarketMobile
npm start -- --clear
```

---

## 🐛 Common Issues

### Issue 1: "Connection Error"
**Cause:** Backend not running or wrong URL

**Solution:**
1. Start backend: `python manage.py runserver 8001`
2. Check URL in `src/api/client.js`
3. Ensure device on same WiFi

### Issue 2: "Demo Not Available"
**Cause:** Demo user doesn't exist

**Solution:**
```cmd
cd backend
python create_demo_user.py
```

### Issue 3: "Network Error"
**Cause:** Firewall blocking or wrong network

**Solution:**
1. Check Windows Firewall
2. Ensure same WiFi network
3. Try: `http://10.0.2.2:8001/api` for emulator

### Issue 4: Button Not Visible
**Cause:** UI layout issue

**Solution:**
- Already fixed! Button should be visible now
- White background with border
- At bottom after "or" divider

---

## 📱 Testing Steps

### Step 1: Start Backend
```cmd
cd backend
python manage.py runserver 8001
```

### Step 2: Verify Demo User
```cmd
python create_demo_user.py
```

### Step 3: Update API URL (if needed)
Edit `BookMarketMobile/src/api/client.js`:
- Emulator: `http://10.0.2.2:8001/api`
- Device: `http://YOUR_IP:8001/api`

### Step 4: Start Mobile App
```cmd
cd BookMarketMobile
npm start
```

### Step 5: Test Demo Login
1. Open app in Expo Go
2. See Welcome screen
3. Scroll to bottom
4. Tap "🚀 Try Demo"
5. Should login automatically

---

## 🔍 Debug Mode

The app now shows detailed error messages:

### Success:
```
✓ Demo login successful!
→ Navigates to Main app
```

### Failed Login:
```
❌ Demo Login Failed
- Shows error message
- Offers alternatives
```

### Connection Error:
```
🔌 Connection Error
- Shows troubleshooting steps
- Offers retry option
```

---

## 📊 Check Logs

### Mobile App Logs:
Look in Expo console for:
```
Attempting demo login...
Login result: { success: true/false }
```

### Backend Logs:
Look in Django console for:
```
POST /api/login/ 200 OK
```

---

## ✅ Verification

Demo login is working if you see:

1. **Mobile App:**
   - Loading spinner appears
   - Navigates to Main screen
   - Shows Home tab

2. **Backend:**
   - `POST /api/login/ 200 OK`
   - No errors in console

3. **User:**
   - Logged in as "Demo User"
   - Can browse books
   - Can add to cart

---

## 🚀 Quick Fix Commands

```cmd
# 1. Create demo user
cd backend
python create_demo_user.py

# 2. Start backend
python manage.py runserver 8001

# 3. Restart mobile app
cd ../BookMarketMobile
npm start -- --clear
```

---

## 📝 API URL Reference

| Device Type | API URL |
|------------|---------|
| Android Emulator | `http://10.0.2.2:8001/api` |
| iOS Simulator | `http://localhost:8001/api` |
| Physical Device | `http://YOUR_IP:8001/api` |
| Expo Go (same WiFi) | `http://YOUR_IP:8001/api` |

---

## 💡 Pro Tips

1. **Always check backend first** - Most issues are backend not running
2. **Use emulator for testing** - Easier than physical device
3. **Check console logs** - Both mobile and backend
4. **Clear cache** - `npm start -- --clear` if issues persist
5. **Verify network** - Same WiFi for physical devices

---

**Demo login should now work! If issues persist, check the error messages for specific guidance.** 🎉
