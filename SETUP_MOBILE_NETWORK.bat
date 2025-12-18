@echo off
echo ========================================
echo Mobile App Network Setup
echo ========================================
echo.

echo Step 1: Finding your IP address...
echo.
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP=%%a
    set IP=!IP:~1!
    echo Found IP: !IP!
    goto :found
)

:found
echo.
echo ========================================
echo Your Computer's IP Address
echo ========================================
echo.
echo IP: %IP%
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Update BookMarketMobile/src/api/client.js
echo    Change: const API_BASE_URL = 'http://127.0.0.1:8000/api';
echo    To:     const API_BASE_URL = 'http://%IP%:8000/api';
echo.
echo 2. Allow firewall access (run as Administrator):
echo    netsh advfirewall firewall add rule name="Django Dev Server" dir=in action=allow protocol=TCP localport=8000
echo.
echo 3. Start backend with network access:
echo    cd backend
echo    python manage.py runserver 0.0.0.0:8000
echo.
echo 4. Test from phone browser:
echo    http://%IP%:8000/api/health/
echo.
echo 5. Make sure phone and computer are on same WiFi!
echo.
pause
