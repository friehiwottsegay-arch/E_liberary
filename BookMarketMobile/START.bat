@echo off
echo ========================================
echo   E-Library Mobile App Starter
echo ========================================
echo.
echo Starting the React Native app...
echo.
echo Make sure your backend is running at:
echo http://127.0.0.1:8001
echo.
echo Scan the QR code with Expo Go app
echo.
cd /d "%~dp0"
call npm start
pause
