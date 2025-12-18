# 🚀 START HERE - Mobile App Setup

## 📱 What You Need

1. **Your Phone** with Expo Go installed
2. **Your Computer** with backend running
3. **Same WiFi** for both devices

## ⚡ Super Quick Start (3 Commands)

```bash
# 1. Check everything is ready
CHECK_EXPO_SETUP.bat

# 2. Start backend (Terminal 1)
START_BACKEND_NETWORK.bat

# 3. Start mobile app (Terminal 2)
START_MOBILE_APP.bat
```

Then **scan QR code** with Expo Go on your phone!

## 📥 First Time Setup

### On Your Phone:
1. Install **Expo Go** from app store
2. Connect to **same WiFi** as computer

### On Your Computer:
```bash
# Run complete setup
COMPLETE_MOBILE_SETUP.bat
```

This will:
- ✅ Find your IP address
- ✅ Update API configuration
- ✅ Check firewall
- ✅ Install dependencies
- ✅ Show you next steps

## 🎯 Daily Usage

Every time you want to test the app:

### Terminal 1 - Backend:
```bash
START_BACKEND_NETWORK.bat
```

### Terminal 2 - Mobile App:
```bash
START_MOBILE_APP.bat
```

### On Phone:
1. Open Expo Go
2. Scan QR code
3. Done! 🎉

## 📚 Documentation

Choose your path:

### 🏃 I want to start NOW:
→ `MOBILE_APP_QUICK_START.md`

### 📖 I want detailed instructions:
→ `EXPO_GO_SETUP_GUIDE.md`

### 🐛 I have an error:
→ `MOBILE_NETWORK_TROUBLESHOOTING.md`

### 🔧 I want to understand the fixes:
→ `MOBILE_API_FIXES.md`

### 📱 I want complete overview:
→ `README_MOBILE_APP.md`

## 🎯 Batch Files Guide

| File | When to Use |
|------|-------------|
| `CHECK_EXPO_SETUP.bat` | First time or troubleshooting |
| `COMPLETE_MOBILE_SETUP.bat` | First time setup |
| `UPDATE_MOBILE_IP.bat` | When IP changes |
| `START_BACKEND_NETWORK.bat` | Every time - start backend |
| `START_MOBILE_APP.bat` | Every time - start app |
| `TEST_MOBILE_API_CONNECTION.bat` | Test backend APIs |

## ✅ Success Checklist

- [ ] Expo Go installed on phone
- [ ] Phone and computer on same WiFi
- [ ] Ran `CHECK_EXPO_SETUP.bat` - all green ✓
- [ ] Backend running on port 8000
- [ ] Mobile app showing QR code
- [ ] Scanned QR code in Expo Go
- [ ] App loaded successfully
- [ ] Can login with demo/demo123
- [ ] Can browse books
- [ ] No network errors

## 🐛 Quick Troubleshooting

### "Network Error"
```bash
UPDATE_MOBILE_IP.bat
# Then restart app
```

### "Unable to connect"
- Check same WiFi
- Press `r` to reload

### "Something went wrong"
```bash
cd BookMarketMobile
npm start -- --clear
```

### Backend not accessible
```bash
# Make sure using 0.0.0.0:8000
python manage.py runserver 0.0.0.0:8000
```

## 🎓 Learn More

### Expo Go Basics:
- Shake phone = Developer menu
- Press `r` in terminal = Reload app
- Press `m` in terminal = Toggle menu

### Test URLs (in phone browser):
```
http://YOUR_IP:8000/api/health/
http://YOUR_IP:8000/api/books/
```

### Demo Login:
- Username: `demo`
- Password: `demo123`

## 💡 Pro Tips

1. **Keep terminals open** - See logs
2. **Same WiFi always** - Consistent connection
3. **Test in browser first** - Verify backend works
4. **Shake for menu** - Quick access to tools
5. **Clear cache if stuck** - `npm start -- --clear`

## 🎉 You're Ready!

Just run:
```bash
# Terminal 1
START_BACKEND_NETWORK.bat

# Terminal 2  
START_MOBILE_APP.bat
```

Then scan QR code in Expo Go!

---

**Need Help?**
- Quick Start: `MOBILE_APP_QUICK_START.md`
- Full Guide: `EXPO_GO_SETUP_GUIDE.md`
- Troubleshooting: `MOBILE_NETWORK_TROUBLESHOOTING.md`
- API Docs: `MOBILE_API_FIXES.md`

**Status:** ✅ All Fixed & Ready to Use!
