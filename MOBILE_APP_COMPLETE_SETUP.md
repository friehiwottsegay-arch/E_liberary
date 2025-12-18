# E-Library Mobile App - Complete Setup Guide

## ❌ Current Issue: Backend Not Running

Your mobile app shows: **"Demo login failed: Login failed"**

This means the backend server is NOT running on port 8001.

## ✅ Solution: Start Backend

### Quick Start (Recommended)

**Double-click this file:**
```
START_BACKEND_FOR_MOBILE.bat
```

### Manual Start

```cmd
cd backend
python manage.py runserver 8001
```

You should see:
```
Starting development server at http://127.0.0.1:8001/
Quit the server with CTRL-BREAK.
```

## 📱 Complete Setup Steps

### Step 1: Start Backend
```cmd
cd backend
python manage.py runserver 8001
```

**Keep this terminal open!**

### Step 2: Verify Backend is Running

Open browser: `http://127.0.0.1:8001/api/`

You should see the Django REST API page.

### Step 3: Create Demo User (if not exists)
```cmd
cd backend
python create_demo_user.py
```

### Step 4: Start Mobile App
```cmd
cd BookMarketMobile
npm start
```

### Step 5: Test Demo Login

1. Scan QR code with Expo Go
2. App opens → Splash → Onboarding → Welcome
3. Tap "🚀 Try Demo"
4. Should login successfully!

## 🔍 Troubleshooting

### Error: "Demo login failed"

**Cause:** Backend not running

**Fix:**
```cmd
cd backend
python manage.py runserver 8001
```

### Error: "Connection Error"

**Cause:** Wrong API URL or network issue

**Fix for Physical Device:**

1. Find your IP:
   ```cmd
   ipconfig
   ```
   Look for IPv4 (e.g., 192.168.1.100)

2. Edit `BookMarketMobile/src/api/client.js`:
   ```javascript
   const API_BASE_URL = 'http://192.168.1.100:8001/api';
   ```

3. Restart backend with:
   ```cmd
   python manage.py runserver 0.0.0.0:8001
   ```

4. Restart mobile app:
   ```cmd
   npm start -- --clear
   ```

### Error: "User does not exist"

**Fix:**
```cmd
cd backend
python create_demo_user.py
```

## ✅ Success Checklist

- [ ] Backend running on port 8001
- [ ] Can access http://127.0.0.1:8001/api/ in browser
- [ ] Demo user created (demo_buyer/demo123)
- [ ] Mobile app started
- [ ] Demo login works

## 🎯 Quick Test

### Test Backend:
```cmd
# In browser
http://127.0.0.1:8001/api/
```

### Test Login API:
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8001/api/login/" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"username":"demo_buyer","password":"demo123"}'
```

Should return:
```json
{
  "message": "Login successful.",
  "access": "token...",
  "refresh": "token...",
  "user": {...}
}
```

## 📝 Common Mistakes

1. ❌ Forgetting to start backend
2. ❌ Backend running on wrong port
3. ❌ Using 127.0.0.1 on physical device
4. ❌ Demo user not created
5. ❌ Firewall blocking port 8001

## 🚀 Ready to Go!

Once backend is running:

1. **Backend Terminal:**
   ```
   Starting development server at http://127.0.0.1:8001/
   ```

2. **Mobile App:**
   - Tap "🚀 Try Demo"
   - Logs in automatically
   - Opens main app

## 💡 Pro Tips

- Keep backend terminal open while testing
- Check console logs in Expo for errors
- Use `npm start -- --clear` to clear cache
- Test on Android Emulator first (easier)

---

**Need Help?**

Check the console logs:
- Backend: Shows login attempts
- Mobile: Shows API calls and errors

The logs will tell you exactly what's wrong!
