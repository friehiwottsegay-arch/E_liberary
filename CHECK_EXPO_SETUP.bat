@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Expo Go Setup Checker
echo ========================================
echo.

REM Check 1: Node.js
echo [1/7] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✓ Node.js installed: !NODE_VERSION!
) else (
    echo ✗ Node.js NOT installed
    echo   Download from: https://nodejs.org/
)
echo.

REM Check 2: npm
echo [2/7] Checking npm...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✓ npm installed: !NPM_VERSION!
) else (
    echo ✗ npm NOT installed
)
echo.

REM Check 3: Project exists
echo [3/7] Checking project...
if exist "BookMarketMobile\package.json" (
    echo ✓ Mobile app project found
) else (
    echo ✗ Mobile app project NOT found
    echo   Expected: BookMarketMobile\package.json
)
echo.

REM Check 4: Dependencies installed
echo [4/7] Checking dependencies...
if exist "BookMarketMobile\node_modules" (
    echo ✓ Dependencies installed
) else (
    echo ✗ Dependencies NOT installed
    echo   Run: cd BookMarketMobile ^&^& npm install
)
echo.

REM Check 5: Get IP Address
echo [5/7] Getting IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set "IP=%%a"
    set "IP=!IP:~1!"
    echo ✓ Your IP: !IP!
    goto :ip_found
)
echo ✗ Could not find IP address
:ip_found
echo.

REM Check 6: Backend running
echo [6/7] Checking backend...
netstat -ano | findstr :8000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Backend is running on port 8000
) else (
    echo ✗ Backend NOT running
    echo   Run: cd backend ^&^& python manage.py runserver 0.0.0.0:8000
)
echo.

REM Check 7: API configuration
echo [7/7] Checking API configuration...
if exist "BookMarketMobile\src\api\client.js" (
    findstr /C:"127.0.0.1" "BookMarketMobile\src\api\client.js" >nul 2>&1
    if %errorlevel% equ 0 (
        echo ⚠ API using localhost (127.0.0.1)
        echo   For physical device, update to: http://!IP!:8000/api
        echo   Run: UPDATE_MOBILE_IP.bat
    ) else (
        echo ✓ API configuration looks good
    )
) else (
    echo ✗ API client file not found
)
echo.

echo ========================================
echo Summary
echo ========================================
echo.
echo To use Expo Go:
echo.
echo 1. Install Expo Go on your phone
echo    Android: Play Store
echo    iOS: App Store
echo.
echo 2. Connect phone to same WiFi as computer
echo.
echo 3. Update API URL (if using physical device):
echo    Run: UPDATE_MOBILE_IP.bat
echo.
echo 4. Start backend:
echo    cd backend
echo    python manage.py runserver 0.0.0.0:8000
echo.
echo 5. Start mobile app:
echo    cd BookMarketMobile
echo    npm start
echo.
echo 6. Scan QR code with Expo Go
echo.
echo ========================================
echo Your IP: !IP!
echo Test URL: http://!IP!:8000/api/health/
echo ========================================
echo.
pause
