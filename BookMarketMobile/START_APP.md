# Start E-Library Mobile App

## Quick Start

### 1. Install Dependencies
```bash
cd BookMarketMobile
npm install
```

### 2. Start the App

#### Option A: Expo Go (Easiest - Recommended)
```bash
npm run start:go
```
Then scan the QR code with:
- **Android**: Expo Go app
- **iOS**: Camera app

#### Option B: Development Build
```bash
npm start
```

### 3. Backend Setup
Make sure your Django backend is running:
```bash
cd backend
python manage.py runserver 0.0.0.0:8001
```

### 4. Configure API URL
If testing on a physical device, update the API URL in:
`src/api/client.js`

Change:
```javascript
const API_BASE_URL = 'http://127.0.0.1:8001/api';
```

To your computer's IP address:
```javascript
const API_BASE_URL = 'http://YOUR_IP:8001/api';
```

Find your IP:
- **Windows**: `ipconfig`
- **Mac/Linux**: `ifconfig`

## Features Implemented

✅ **Authentication**
- Login / Register
- JWT token management
- Auto token refresh

✅ **Book Browsing**
- Home screen with categories
- Book list and search
- Book details with pricing
- Cart management

✅ **Purchases**
- Add to cart
- Payment processing
- Purchase history
- Book access management

✅ **Audiobooks**
- AI-generated audiobooks
- User recordings
- Audio player with controls
- Speed adjustment

✅ **PDF Reader**
- Read purchased books
- Page navigation
- Zoom and scroll

✅ **Exams**
- Browse exams
- Take exams with timer
- Submit answers
- View results

✅ **AI Assistant**
- Chat with AI
- Study help
- Quiz generation
- Concept explanations

✅ **Dictionary**
- Word lookup
- Definitions
- Examples

✅ **Profile**
- User information
- Settings
- Logout

## Troubleshooting

### Metro Bundler Issues
```bash
npm start -- --reset-cache
```

### Port Already in Use
```bash
npx kill-port 8081
npm start
```

### Android Build Issues
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### iOS Build Issues
```bash
cd ios
pod install
cd ..
npm run ios
```

## Testing Credentials

**Student Account:**
- Username: `student1`
- Password: `password123`

**Test the app with:**
1. Browse books
2. Add to cart
3. Make a purchase
4. Read PDF
5. Generate audiobook
6. Take an exam
7. Chat with AI

## App Structure

```
BookMarketMobile/
├── src/
│   ├── api/              # API services
│   │   ├── client.js     # Axios config
│   │   ├── auth.js       # Authentication
│   │   ├── books.js      # Books API
│   │   ├── audiobooks.js # Audiobooks API
│   │   ├── exams.js      # Exams API
│   │   ├── payments.js   # Payments API
│   │   ├── ai.js         # AI Assistant
│   │   └── dictionary.js # Dictionary API
│   ├── components/       # Reusable components
│   │   ├── BookCard.js
│   │   ├── EmptyState.js
│   │   └── LoadingSpinner.js
│   ├── context/          # React Context
│   │   ├── AuthContext.js
│   │   └── CartContext.js
│   ├── screens/          # App screens
│   │   ├── auth/         # Login, Register
│   │   ├── main/         # Main app screens
│   │   └── WelcomeScreen.js
│   └── config/           # Configuration
│       └── api.js
├── App.js                # Main app component
└── package.json          # Dependencies
```

## Next Steps

1. **Test all features** on your device
2. **Customize styling** to match your brand
3. **Add more features** as needed
4. **Deploy backend** to production server
5. **Build APK/IPA** for distribution

## Build for Production

### Android APK
```bash
cd android
./gradlew assembleRelease
```
APK location: `android/app/build/outputs/apk/release/app-release.apk`

### iOS IPA
```bash
cd ios
xcodebuild -workspace BookMarketMobile.xcworkspace -scheme BookMarketMobile -configuration Release
```

## Support

For issues or questions:
1. Check the console logs
2. Verify backend is running
3. Check network connectivity
4. Review API responses

Happy coding! 🚀
