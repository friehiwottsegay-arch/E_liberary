# 📱 Mobile App Network Error - Complete Troubleshooting Guide

## 🔍 Diagnose the Problem

### Check 1: Are you using a physical device?
- **Emulator**: Can use `127.0.0.1` ✅
- **Physical Device**: MUST use computer's IP address ❌

### Check 2: Are phone and computer on same WiFi?
```
Phone WiFi: MyHomeWiFi
Computer WiFi: MyHomeWiFi  ✅ SAME

Phone WiFi: Mobile Data
Computer WiFi: MyHomeWiFi  ❌ DIFFERENT
```

### Check 3: Is backend running with network access?
```bash
# WRONG - Only localhost
python manage.py runserver

# CORRECT - Network accessible
python manage.py runserver 0.0.0.0:8000
```

### Check 4: Is firewall blocking?
Test from phone browser: `http://YOUR_IP:8000/api/health/`
- **Works**: Firewall OK ✅
- **Timeout**: Firewall blocking ❌

## 🛠️ Solutions

### Solution 1: Update API URL (Physical Device)

**File:** `BookMarketMobile/src/api/client.js`

```javascript
// ❌ WRONG - Only works on emulator
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// ✅ CORRECT - Works on physical device
const API_BASE_URL = 'http://192.168.1.100:8000/api';
//                          ^^^^^^^^^^^^^^
//                          YOUR COMPUTER'S IP
```

**Quick Update:**
```bash
# Run this batch file
UPDATE_MOBILE_IP.bat
```

### Solution 2: Start Backend with Network Access

```bash
cd backend

# ❌ WRONG
python manage.py runserver

# ✅ CORRECT
python manage.py runserver 0.0.0.0:8000
```

**Quick Start:**
```bash
# Run this batch file
START_BACKEND_NETWORK.bat
```

### Solution 3: Allow Firewall Access

#### Option A: Automatic (Run as Administrator)
```bash
netsh advfirewall firewall add rule name="Django Dev Server" dir=in action=allow protocol=TCP localport=8000
```

#### Option B: Manual
1. Open **Windows Defender Firewall**
2. **Advanced settings** → **Inbound Rules** → **New Rule**
3. **Port** → **TCP** → **8000**
4. **Allow the connection**
5. Name: **"Django Dev Server"**

### Solution 4: Verify Network Connection

#### Step 1: Get your IP
```bash
ipconfig | findstr IPv4
```

#### Step 2: Test from phone browser
```
http://YOUR_IP:8000/api/health/
```

Should see:
```json
{
  "status": "healthy",
  "message": "API is running"
}
```

#### Step 3: Test specific endpoints
```
http://YOUR_IP:8000/api/books/
http://YOUR_IP:8000/api/categories/
```

## 🎯 Complete Setup Process

### 1. Find Your IP
```bash
ipconfig
```
Example: `192.168.1.100`

### 2. Update Mobile App
```bash
# Automatic
UPDATE_MOBILE_IP.bat

# Or manual - edit BookMarketMobile/src/api/client.js
const API_BASE_URL = 'http://192.168.1.100:8000/api';
```

### 3. Allow Firewall (Run as Admin)
```bash
netsh advfirewall firewall add rule name="Django Dev Server" dir=in action=allow protocol=TCP localport=8000
```

### 4. Start Backend
```bash
cd backend
python manage.py runserver 0.0.0.0:8000
```

### 5. Test Connection
Open phone browser:
```
http://192.168.1.100:8000/api/health/
```

### 6. Start Mobile App
```bash
cd BookMarketMobile
npm start
```

## 🐛 Common Errors & Fixes

### Error: "Network request failed"
**Cause:** Wrong IP address or backend not running

**Fix:**
1. Verify IP: `ipconfig`
2. Update `client.js` with correct IP
3. Restart backend: `python manage.py runserver 0.0.0.0:8000`

### Error: "Connection timeout"
**Cause:** Firewall blocking port 8000

**Fix:**
```bash
# Run as Administrator
netsh advfirewall firewall add rule name="Django Dev Server" dir=in action=allow protocol=TCP localport=8000
```

### Error: "Unable to resolve host"
**Cause:** Phone and computer on different networks

**Fix:**
1. Check phone WiFi settings
2. Check computer WiFi settings
3. Connect both to same WiFi network

### Error: "ERR_CONNECTION_REFUSED"
**Cause:** Backend not running or wrong port

**Fix:**
```bash
# Check if backend is running
netstat -ano | findstr :8000

# Start backend
cd backend
python manage.py runserver 0.0.0.0:8000
```

### Error: "CORS error"
**Cause:** CORS not configured in Django

**Fix:** Check `backend/dl/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://192.168.1.100:5173",  # Add your IP
]

# Or allow all (development only)
CORS_ALLOW_ALL_ORIGINS = True
```

## 📋 Testing Checklist

- [ ] Found computer's IP address
- [ ] Updated `BookMarketMobile/src/api/client.js` with IP
- [ ] Allowed firewall access for port 8000
- [ ] Started backend with `0.0.0.0:8000`
- [ ] Phone and computer on same WiFi
- [ ] Tested `http://YOUR_IP:8000/api/health/` in phone browser
- [ ] Started mobile app with `npm start`
- [ ] App connects successfully

## 🎉 Success Indicators

When everything works, you should see:

### In Django Console:
```
System check identified no issues (0 silenced).
December 08, 2025 - 10:30:00
Django version 5.2.7, using settings 'dl.settings'
Starting development server at http://0.0.0.0:8000/
Quit the server with CTRL-BREAK.

[08/Dec/2025 10:30:15] "GET /api/health/ HTTP/1.1" 200 45
[08/Dec/2025 10:30:20] "GET /api/books/ HTTP/1.1" 200 1234
```

### In Mobile App Console:
```
🔵 API Request: GET /books/
🟢 API Response: /books/ 200
```

### In Phone Browser:
```json
{
  "status": "healthy",
  "message": "API is running"
}
```

## 🚀 Quick Commands

```bash
# 1. Find IP
ipconfig | findstr IPv4

# 2. Update mobile app
UPDATE_MOBILE_IP.bat

# 3. Allow firewall (as Admin)
netsh advfirewall firewall add rule name="Django Dev Server" dir=in action=allow protocol=TCP localport=8000

# 4. Start backend
cd backend
python manage.py runserver 0.0.0.0:8000

# 5. Start mobile app
cd BookMarketMobile
npm start
```

## 📞 Still Having Issues?

1. **Check Django logs** - Look for incoming requests
2. **Check mobile app logs** - Look for network errors
3. **Test with curl**:
   ```bash
   curl http://YOUR_IP:8000/api/health/
   ```
4. **Restart everything**:
   - Stop backend (Ctrl+C)
   - Stop mobile app (Ctrl+C)
   - Clear mobile app cache
   - Start backend again
   - Start mobile app again

## 💡 Pro Tips

1. **Save your IP** - Create a note with your IP address
2. **Use batch files** - Automate the setup process
3. **Test first** - Always test in phone browser before mobile app
4. **Check WiFi** - Ensure same network every time
5. **Firewall once** - Only need to allow firewall once

## 🎯 Summary

The network error happens because:
1. Physical devices can't use `127.0.0.1`
2. Need to use computer's actual IP address
3. Backend must listen on `0.0.0.0:8000`
4. Firewall must allow port 8000
5. Both devices must be on same WiFi

Follow the steps above and your mobile app will connect successfully! 🎉
