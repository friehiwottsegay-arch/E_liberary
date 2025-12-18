@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Starting Mobile App with Expo
echo ========================================
echo.

REM Get IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set "IP=%%a"
    set "IP=!IP:~1!"
    goto :ip_found
)
:ip_found

echo Your IP: !IP!
echo.

REM Check if backend is running
netstat -ano | findstr :8000 >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠ WARNING: Backend not running on port 8000
    echo.
    echo Please start backend first:
    echo   cd backend
    echo   python manage.py runserver 0.0.0.0:8000
    echo.
    pause
    exit /b 1
)

echo ✓ Backend is running
echo.

REM Check if dependencies are installed
if not exist "BookMarketMobile\node_modules" (
    echo Installing dependencies...
    cd BookMarketMobile
    call npm install
    cd ..
    echo.
)

echo ========================================
echo Starting Expo Metro Bundler...
echo ========================================
echo.
echo Instructions:
echo.
echo 1. Open Expo Go on your phone
echo 2. Make sure phone is on same WiFi
echo 3. Scan the QR code that appears
echo 4. Wait for app to load
echo.
echo Keyboard shortcuts:
echo   r - Reload app
echo   m - Toggle menu
echo   d - Open developer menu
echo   ? - Show all commands
echo.
echo ========================================
echo Test backend from phone browser:
echo http://!IP!:8000/api/health/
echo ========================================
echo.

cd BookMarketMobile
npm start
