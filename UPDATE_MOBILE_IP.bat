@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Mobile App IP Address Updater
echo ========================================
echo.

REM Get IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set "IP=%%a"
    set "IP=!IP:~1!"
    goto :found
)

:found
echo Your IP Address: %IP%
echo.

REM Backup original file
if not exist "BookMarketMobile\src\api\client.js.backup" (
    copy "BookMarketMobile\src\api\client.js" "BookMarketMobile\src\api\client.js.backup"
    echo ✓ Backup created
)

REM Update the file
powershell -Command "(Get-Content 'BookMarketMobile\src\api\client.js') -replace 'http://127\.0\.0\.1:8000/api', 'http://%IP%:8000/api' | Set-Content 'BookMarketMobile\src\api\client.js'"

echo.
echo ========================================
echo ✓ Updated API URL to: http://%IP%:8000/api
echo ========================================
echo.
echo Next steps:
echo 1. Start backend: python manage.py runserver 0.0.0.0:8000
echo 2. Start mobile app: cd BookMarketMobile ^&^& npm start
echo 3. Test on phone: http://%IP%:8000/api/health/
echo.
pause
