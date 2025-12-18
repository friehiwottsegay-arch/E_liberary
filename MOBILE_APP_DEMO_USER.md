# Mobile App - Demo User Setup 🚀

## Quick Demo Access

The mobile app now features a **"Try Demo"** button on the welcome screen that allows instant access without registration!

## 🎯 Demo Button Features

### Welcome Screen
- **🚀 Try Demo** button at the top
- Green accent color for visibility
- "No registration needed" subtitle
- One-tap access to demo account

### Auto-Login Flow
1. User taps "Try Demo" on welcome screen
2. App navigates to login screen
3. Demo credentials auto-fill
4. Automatic login after 0.5 seconds
5. User lands on main app screen

### Demo Credentials
```
Username: demo_buyer
Password: demo123
Email: demo@bookmarket.com
```

## 🔧 Setup Demo User

### Method 1: Run the Script (Recommended)

**Windows:**
```cmd
cd backend
CREATE_DEMO_USER.bat
```

**Mac/Linux:**
```bash
cd backend
python create_demo_user.py
```

### Method 2: Django Admin

1. Start Django server:
   ```cmd
   cd backend
   python manage.py runserver 8001
   ```

2. Go to admin: `http://127.0.0.1:8001/admin`

3. Create user:
   - Username: `demo_buyer`
   - Password: `demo123`
   - Email: `demo@bookmarket.com`
   - First name: `Demo`
   - Last name: `User`

4. Create Buyer profile:
   - Link to the user
   - Phone: `+251911234567`
   - Address: `Demo Address, Addis Ababa`

### Method 3: Django Shell

```python
python manage.py shell

from django.contrib.auth.models import User
from api.models import Buyer

# Create user
user = User.objects.create_user(
    username='demo_buyer',
    email='demo@bookmarket.com',
    password='demo123',
    first_name='Demo',
    last_name='User'
)

# Create buyer profile
buyer = Buyer.objects.create(
    user=user,
    phone_number='+251911234567',
    address='Demo Address, Addis Ababa'
)

print("Demo user created successfully!")
```

## 📱 User Experience

### Welcome Screen Flow
```
┌─────────────────────────┐
│   📚 BookMarket         │
│                         │
│   Welcome to BookMarket │
│   Your digital          │
│   marketplace for books │
│                         │
│  ┌───────────────────┐  │
│  │ 🚀 Try Demo       │  │ ← NEW!
│  │ No registration   │  │
│  │ needed            │  │
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │   Sign In         │  │
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │ Create Account    │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

### Demo Login Screen
```
┌─────────────────────────┐
│   🚀 Demo Mode          │
│   Logging you in with   │
│   demo account...       │
│                         │
│  ┌───────────────────┐  │
│  │ ⟳ Connecting to  │  │
│  │   demo account    │  │
│  └───────────────────┘  │
│                         │
│  Username: demo_buyer   │
│  Password: •••••••      │
│                         │
│  [Auto-logging in...]   │
└─────────────────────────┘
```

## 🎨 Design Details

### Demo Button Styling
- **Background:** `rgba(16, 185, 129, 0.2)` (Green tint)
- **Border:** `#10B981` (Emerald green)
- **Icon:** 🚀 (Rocket emoji)
- **Text Color:** `#10B981` (Emerald green)
- **Subtext:** `#6EE7B7` (Light emerald)

### Visual Hierarchy
1. **Demo Button** - Top position, green accent
2. **Sign In** - Blue primary button
3. **Create Account** - Transparent bordered button

## ✨ Benefits

### For Users
- ✅ Instant access without registration
- ✅ Test all features immediately
- ✅ No email verification needed
- ✅ Quick app exploration

### For Developers
- ✅ Easy testing and demos
- ✅ Quick QA validation
- ✅ Client presentations
- ✅ App store screenshots

### For Business
- ✅ Lower barrier to entry
- ✅ Increased user engagement
- ✅ Better conversion rates
- ✅ Showcase app features

## 🔒 Security Notes

### Demo Account Limitations
- Read-only for critical operations
- Limited purchase capabilities
- Shared account (public access)
- Regular data cleanup recommended

### Best Practices
1. Don't store sensitive data in demo account
2. Regularly reset demo account data
3. Monitor demo account usage
4. Set purchase limits if needed

## 📊 Testing Checklist

After setting up demo user, test:

- [ ] Demo button appears on welcome screen
- [ ] Tapping demo button navigates to login
- [ ] Credentials auto-fill correctly
- [ ] Auto-login works (0.5s delay)
- [ ] User lands on main app screen
- [ ] All features accessible
- [ ] Can browse books
- [ ] Can add to cart
- [ ] Can view profile
- [ ] Can access all tabs

## 🚀 Quick Start

1. **Create demo user:**
   ```cmd
   cd backend
   CREATE_DEMO_USER.bat
   ```

2. **Start backend:**
   ```cmd
   python manage.py runserver 8001
   ```

3. **Start mobile app:**
   ```cmd
   cd BookMarketMobile
   npm start
   ```

4. **Test demo login:**
   - Open app in Expo Go
   - Tap "🚀 Try Demo" button
   - Watch auto-login magic! ✨

## 📝 Notes

- Demo credentials are hardcoded for consistency
- Auto-login has 0.5 second delay for UX
- Green color differentiates from regular login
- Loading indicator shows during auto-login
- Falls back to manual login if demo fails

## 🎯 Next Steps

1. Run `CREATE_DEMO_USER.bat` to create demo account
2. Test the demo login flow
3. Customize demo user data if needed
4. Add sample books for demo browsing
5. Consider adding demo purchase flow

---

**Demo Account Ready!** Users can now explore your app instantly with one tap! 🎉
