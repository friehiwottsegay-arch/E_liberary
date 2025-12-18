# 📱 Mobile App Assets

## Current Status

Placeholder assets have been created. Replace them with your actual app icons.

## Required Assets

### 1. App Icon (`icon.png`)
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Location**: `assets/icon.png`
- **Used for**: iOS and Android app icon

### 2. Adaptive Icon (`adaptive-icon.png`)
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Location**: `assets/adaptive-icon.png`
- **Used for**: Android adaptive icon

### 3. Splash Screen (`splash.png`)
- **Size**: 1242x2436 pixels (or larger)
- **Format**: PNG
- **Location**: `assets/splash.png`
- **Used for**: App loading screen

### 4. Favicon (`favicon.png`)
- **Size**: 48x48 pixels
- **Format**: PNG
- **Location**: `assets/favicon.png`
- **Used for**: Web version

## Quick Create Icons

### Option 1: Use Online Tool
1. Go to https://www.appicon.co/
2. Upload your logo (1024x1024)
3. Download all sizes
4. Replace files in `assets/` folder

### Option 2: Use Figma/Photoshop
Create these sizes:
- `icon.png`: 1024x1024
- `adaptive-icon.png`: 1024x1024
- `splash.png`: 1242x2436
- `favicon.png`: 48x48

### Option 3: Use Expo Asset Generator
```bash
npx expo-asset-generator --icon path/to/your/icon.png
```

## Design Guidelines

### App Icon
- Simple and recognizable
- Works at small sizes
- No text (or minimal)
- Consistent with brand
- High contrast

### Splash Screen
- Brand logo centered
- Background color: #6200EE (or your brand color)
- Minimal design
- Fast loading

## Current Placeholders

The app currently uses placeholder assets. The app will work, but you should replace them with proper icons before publishing.

## Update Assets

1. Create your icons (1024x1024)
2. Replace files in `assets/` folder:
   - `icon.png`
   - `adaptive-icon.png`
   - `splash.png`
   - `favicon.png`
3. Restart Expo: `npm start -- --clear`

## Testing

After replacing assets:
```bash
# Clear cache and restart
npm start -- --clear

# Test on device
# Scan QR code with Expo Go
```

## For Production

Before publishing to app stores:
- ✅ Replace all placeholder assets
- ✅ Test on real devices
- ✅ Verify icon looks good at all sizes
- ✅ Check splash screen on different screen sizes

## Resources

- [Expo Icon Guidelines](https://docs.expo.dev/develop/user-interface/app-icons/)
- [iOS Icon Guidelines](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- [Android Icon Guidelines](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)
- [App Icon Generator](https://www.appicon.co/)

## Quick Fix

For now, the app will work with placeholders. Replace them when you're ready to publish!
