@echo off
setlocal enabledelayedexpansion

color 0A
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     MOBILE APP NETWORK FIX - ONE CLICK SOLUTION           ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Step 1: Get IP Address
echo [1/5] Finding your IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set "IP=%%a"
    set "IP=!IP:~1!"
    goto :found
)

:found
echo       ✓ Found: %IP%
echo.

REM Step 2: Update Mobile App
echo [2/5] Updating mobile app configuration...
if exist "BookMarketMobile\src\api\client.js" (
    if not exist "BookMarketMobile\src\api\client.js.backup" (
        copy "BookMarketMobile\src\api\client.js" "BookMarketMobile\src\api\client.js.backup" > nul
    )
    powershell -Command "(Get-Content 'BookMarketMobile\src\api\client.js') -replace 'http://127\.0\.0\.1:8000/api', 'http://%IP%:8000/api' | Set-Content 'BookMarketMobile\src\api\client.js'"
    echo       ✓ Updated API URL to http://%IP%:8000/api
) else (
    echo       ✗ File not found: BookMarketMobile\src\api\client.js
)
echo.

REM Step 3: Check Firewall
echo [3/5] Checking firewall...
netsh advfirewall firewall show rule name="Django Dev Server" > nul 2>&1
if %errorlevel% neq 0 (
    echo       ! Firewall rule not found
    echo       ! Run this as Administrator to add firewall rule:
    echo       ! netsh advfirewall firewall add rule name="Django Dev Server" dir=in action=allow protocol=TCP localport=8000
) else (
    echo       ✓ Firewall rule exists
)
echo.

REM Step 4: Check Backend
echo [4/5] Checking backend...
if exist "backend\manage.py" (
    echo       ✓ Backend found
) else (
    echo       ✗ Backend not found
)
echo.

REM Step 5: Instructions
echo [5/5] Setup complete!
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                    NEXT STEPS                              ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 1. START BACKEND (in new terminal):
echo    cd backend
echo    python manage.py runserver 0.0.0.0:8000
echo.
echo 2. TEST FROM PHONE BROWSER:
echo    http://%IP%:8000/api/health/
echo.
echo 3. START MOBILE APP (in new terminal):
echo    cd BookMarketMobile
echo    npm start
echo.
echo 4. SCAN QR CODE with Expo Go app
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                    IMPORTANT                               ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo • Make sure phone and computer are on SAME WiFi
echo • Your IP: %IP%
echo • Backend must run on: 0.0.0.0:8000 (not just 8000)
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                    QUICK START                             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Want to start backend now? (Y/N)
set /p START_BACKEND=
if /i "%START_BACKEND%"=="Y" (
    echo.
    echo Starting backend...
    cd backend
    python manage.py runserver 0.0.0.0:8000
) else (
    echo.
    echo Run START_BACKEND_NETWORK.bat to start backend later
)

pause
