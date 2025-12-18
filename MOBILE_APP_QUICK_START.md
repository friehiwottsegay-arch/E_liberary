# 📱 Mobile App Quick Start - 5 Minutes Setup

## 🎯 Goal
Get your mobile app running on your phone using Expo Go in 5 minutes!

## ✅ Prerequisites (One-Time Setup)

### On Your Phone:
1. **Install Expo Go**
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Connect to WiFi**
   - Same WiFi as your computer!

### On Your Computer:
1. **Check Setup**
   ```bash
   CHECK_EXPO_SETUP.bat
   ```

2. **Update IP Address** (if using physical device)
   ```bash
   UPDATE_MOBILE_IP.bat
   ```

## 🚀 Start App (Every Time)

### Step 1: Start Backend (Terminal 1)
```bash
cd backend
python manage.py runserver 0.0.0.0:8000
```

Wait for:
```
Starting development server at http://0.0.0.0:8000/
```

### Step 2: Start Mobile App (Terminal 2)
```bash
cd BookMarketMobile
npm start
```

Wait for QR code to appear.

### Step 3: Open in Expo Go
1. Open **Expo Go** on phone
2. Tap **"Scan QR Code"**
3. Scan the QR code from terminal
4. Wait for app to load (30-60 seconds first time)

## ✅ Success!
You should see:
- Splash screen
- Onboarding screens
- Welcome screen with Login/Register

## 🐛 Quick Fixes

### "Unable to connect"
```bash
# Check same WiFi
# Restart: Press 'r' in terminal
```

### "Network Error"
```bash
# Update IP address
UPDATE_MOBILE_IP.bat
# Restart app
```

### "Something went wrong"
```bash
cd BookMarketMobile
npm start -- --clear
```

## 📋 Batch Files Reference

| File | Purpose |
|------|---------|
| `CHECK_EXPO_SETUP.bat` | Check if everything is ready |
| `UPDATE_MOBILE_IP.bat` | Update API URL with your IP |
| `START_BACKEND_NETWORK.bat` | Start backend with network access |
| `START_MOBILE_APP.bat` | Start mobile app with checks |
| `COMPLETE_MOBILE_SETUP.bat` | Complete automated setup |

## 🎯 Daily Workflow

```bash
# 1. Start backend
START_BACKEND_NETWORK.bat

# 2. Start mobile app (new terminal)
START_MOBILE_APP.bat

# 3. Scan QR code in Expo Go
```

## 📱 Expo Go Commands

### In Terminal:
- `r` - Reload app
- `m` - Toggle menu
- `d` - Open developer menu
- `?` - Show all commands

### On Phone (Shake device):
- **Reload** - Refresh app
- **Debug Remote JS** - Open Chrome debugger
- **Performance Monitor** - Show FPS

## 🔍 Test URLs

Test these in your phone's browser first:

```
http://YOUR_IP:8000/api/health/
http://YOUR_IP:8000/api/books/
http://YOUR_IP:8000/api/categories/
```

Replace `YOUR_IP` with your computer's IP (run `ipconfig`).

## 💡 Pro Tips

1. **Keep terminals open** - See logs in real-time
2. **Same WiFi always** - Consistent connection
3. **Shake for menu** - Quick access to developer tools
4. **Press 'r' to reload** - After code changes
5. **Clear cache if stuck** - `npm start -- --clear`

## 📞 Need Help?

### Check These:
- [ ] Expo Go installed on phone?
- [ ] Phone and computer on same WiFi?
- [ ] Backend running on `0.0.0.0:8000`?
- [ ] Correct IP in `client.js`?
- [ ] Can access `http://YOUR_IP:8000/api/health/` from phone browser?

### Still Issues?
1. Run `CHECK_EXPO_SETUP.bat`
2. Run `UPDATE_MOBILE_IP.bat`
3. Restart everything
4. Check `EXPO_GO_SETUP_GUIDE.md` for detailed help

## 🎉 You're Ready!

Just run these two commands:
```bash
# Terminal 1
START_BACKEND_NETWORK.bat

# Terminal 2
START_MOBILE_APP.bat
```

Then scan QR code in Expo Go! 🚀

---

**Quick Links:**
- Full Guide: `EXPO_GO_SETUP_GUIDE.md`
- Troubleshooting: `MOBILE_NETWORK_TROUBLESHOOTING.md`
- API Fixes: `MOBILE_API_FIXES.md`
