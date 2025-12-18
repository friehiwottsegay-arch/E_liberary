# 🔧 Fix Mobile App Network Error - Complete Solution

## 🚨 Problem: Network Error in Mobile App

When you see "Network Error" in the mobile app, it's because:
1. **Physical Device**: Can't connect to `127.0.0.1` (localhost)
2. **Wrong IP Address**: Need your computer's actual IP address
3. **Firewall**: Windows firewall blocking port 8000
4. **Backend Not Running**: Django server not started

## ✅ Solution Steps

### Step 1: Find Your Computer's IP Address

#### On Windows:
```bash
ipconfig
```

Look for **"IPv4 Address"** under your WiFi adapter:
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.100
```

Your IP is: **192.168.1.100** (example)

#### Quick Command:
```bash
ipconfig | findstr IPv4
```

### Step 2: Update Mobile App API Configuration

Open: `BookMarketMobile/src/api/client.js`

**CHANGE THIS:**
```javascript
const API_BASE_URL = 'http://127.0.0.1:8000/api';
```

**TO THIS (use YOUR IP):**
```javascript
const API_BASE_URL = 'http://192.168.1.100:8000/api';
//                          ^^^^^^^^^^^^^^
//                          YOUR COMPUTER'S IP
```

### Step 3: Allow Firewall Access

#### Windows Firewall:
```bash
# Run as Administrator in Command Prompt
netsh advfirewall firewall add rule name="Django Dev Server" dir=in action=allow protocol=TCP localport=8000
```

Or manually:
1. Open **Windows Defender Firewall**
2. Click **"Advanced settings"**
3. Click **"Inbound Rules"** → **"New Rule"**
4. Select **"Port"** → Next
5. Enter **8000** → Next
6. Select **"Allow the connection"** → Next
7. Check all profiles → Next
8. Name it **"Django Dev Server"** → Finish

### Step 4: Start Backend with Network Access

```bash
cd backend
python manage.py runserver 0.0.0.0:8000
```

**Important:** Use `0.0.0.0:8000` not just `8000`!

This allows connections from other devices on your network.

### Step 5: Verify Connection

#### Test from your phone's browser:
```
http://YOUR_IP:8000/api/health/
```

Example:
```
http://192.168.1.100:8000/api/health/
```

You should see JSON response:
```json
{
  "status": "healthy",
  "message": "API is running"
}
```

### Step 6: Restart Mobile App

```bash
cd BookMarketMobile
npm start
```

Press `a` for Android or scan QR code with Expo Go.

## 🎯 Quick Fix Script

I'll create a batch file to automate this:
