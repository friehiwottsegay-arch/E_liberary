@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Complete Mobile App Setup
echo ========================================
echo.

REM Get IP
echo Step 1: Getting your IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set "IP=%%a"
    set "IP=!IP:~1!"
    goto :ip_found
)
:ip_found
echo ✓ Your IP: !IP!
echo.

REM Update API URL
echo Step 2: Updating API URL...
if exist "BookMarketMobile\src\api\client.js" (
    if not exist "BookMarketMobile\src\api\client.js.backup" (
        copy "BookMarketMobile\src\api\client.js" "BookMarketMobile\src\api\client.js.backup" >nul
    )
    powershell -Command "(Get-Content 'BookMarketMobile\src\api\client.js') -replace 'http://127\.0\.0\.1:8000/api', 'http://!IP!:8000/api' | Set-Content 'BookMarketMobile\src\api\client.js'"
    echo ✓ API URL updated to: http://!IP!:8000/api
) else (
    echo ✗ API client file not found
)
echo.

REM Check firewall
echo Step 3: Checking firewall...
netsh advfirewall firewall show rule name="Django Dev Server" >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠ Firewall rule not found
    echo   Run as Administrator to add:
    echo   netsh advfirewall firewall add rule name="Django Dev Server" dir=in action=allow protocol=TCP localport=8000
) else (
    echo ✓ Firewall rule exists
)
echo.

REM Install dependencies
echo Step 4: Checking dependencies...
if not exist "BookMarketMobile\node_modules" (
    echo Installing dependencies...
    cd BookMarketMobile
    call npm install
    cd ..
    echo ✓ Dependencies installed
) else (
    echo ✓ Dependencies already installed
)
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Install Expo Go on your phone:
echo    - Android: Google Play Store
echo    - iOS: App Store
echo.
echo 2. Connect phone to same WiFi as computer
echo.
echo 3. Start backend (Terminal 1):
echo    cd backend
echo    python manage.py runserver 0.0.0.0:8000
echo.
echo 4. Start mobile app (Terminal 2):
echo    cd BookMarketMobile
echo    npm start
echo.
echo 5. Open Expo Go and scan QR code
echo.
echo ========================================
echo Test URLs:
echo ========================================
echo Backend: http://!IP!:8000
echo API: http://!IP!:8000/api/
echo Health: http://!IP!:8000/api/health/
echo.
echo Test from phone browser first!
echo ========================================
echo.
pause
