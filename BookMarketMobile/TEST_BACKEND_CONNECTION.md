# Test Backend Connection for Demo Login

## Why Demo Login Fails

Demo login can fail for these reasons:

### 1. Backend Not Running
**Check:**
```cmd
cd backend
python manage.py runserver 8001
```

**You should see:**
```
Starting development server at http://127.0.0.1:8001/
```

### 2. Wrong API URL

**Current URL:** `http://127.0.0.1:8001/api`

**This works for:**
- ✅ Android Emulator
- ❌ Physical Android Device
- ❌ iOS Simulator
- ❌ Physical iOS Device

**Fix for Physical Device:**

Edit `BookMarketMobile/src/api/client.js`:

```javascript
// Find your computer's IP address first:
// Windows: ipconfig (look for IPv4)
// Mac/Linux: ifconfig (look for inet)

// Then update:
const API_BASE_URL = 'http://YOUR_IP_ADDRESS:8001/api';
// Example: const API_BASE_URL = 'http://192.168.1.100:8001/api';
```

### 3. Demo User Not Created

**Create demo user:**
```cmd
cd backend
python create_demo_user.py
```

**Expected output:**
```
✓ Created demo user: demo_buyer
Username: demo_buyer
Password: demo123
```

### 4. Firewall Blocking

**Windows Firewall:**
1. Open Windows Defender Firewall
2. Allow Python through firewall
3. Allow port 8001

**Or run Django with:**
```cmd
python manage.py runserver 0.0.0.0:8001
```

## Quick Test

### Test 1: Check Backend is Running
Open browser: `http://127.0.0.1:8001/api/`

Should see Django REST API page.

### Test 2: Test Login Endpoint
```cmd
curl -X POST http://127.0.0.1:8001/api/login/ ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"demo_buyer\",\"password\":\"demo123\"}"
```

Should return:
```json
{
  "access": "token...",
  "refresh": "token...",
  "user": {...}
}
```

### Test 3: Check from Mobile Device

**Get your computer's IP:**
```cmd
ipconfig
```

Look for: `IPv4 Address. . . . . . . . . . . : 192.168.X.X`

**Update API URL:**
Edit `BookMarketMobile/src/api/client.js`:
```javascript
const API_BASE_URL = 'http://192.168.X.X:8001/api';
```

**Restart app:**
```cmd
cd BookMarketMobile
npm start -- --clear
```

## Common Errors

### Error: "Network Error"
- Backend not running
- Wrong IP address
- Firewall blocking
- Not on same WiFi

**Solution:**
1. Start backend: `python manage.py runserver 0.0.0.0:8001`
2. Update IP in `client.js`
3. Restart mobile app

### Error: "Demo Login Failed"
- Demo user doesn't exist
- Wrong credentials

**Solution:**
```cmd
cd backend
python create_demo_user.py
```

### Error: "401 Unauthorized"
- Wrong username/password
- Demo user not created properly

**Solution:**
Delete and recreate demo user:
```python
# In Django shell
python manage.py shell

from api.models import User
User.objects.filter(username='demo_buyer').delete()
exit()

# Then recreate
python create_demo_user.py
```

## Step-by-Step Fix

1. **Start Backend:**
   ```cmd
   cd backend
   python manage.py runserver 0.0.0.0:8001
   ```

2. **Get Your IP:**
   ```cmd
   ipconfig
   ```
   Note the IPv4 address (e.g., 192.168.1.100)

3. **Update Mobile App:**
   Edit `BookMarketMobile/src/api/client.js`:
   ```javascript
   const API_BASE_URL = 'http://192.168.1.100:8001/api';
   ```

4. **Create Demo User:**
   ```cmd
   cd backend
   python create_demo_user.py
   ```

5. **Restart Mobile App:**
   ```cmd
   cd BookMarketMobile
   npm start -- --clear
   ```

6. **Test Demo Login:**
   - Open app
   - Tap "🚀 Try Demo"
   - Should login successfully

## Success Checklist

- [ ] Backend running on port 8001
- [ ] Demo user created (demo_buyer/demo123)
- [ ] API URL updated with correct IP
- [ ] Mobile device on same WiFi
- [ ] Firewall allows port 8001
- [ ] App restarted with clear cache

## Still Not Working?

Check the console logs in Expo:
- Look for "Attempting demo login..."
- Check the error message
- Verify the API URL being used

The error message will tell you exactly what's wrong!
