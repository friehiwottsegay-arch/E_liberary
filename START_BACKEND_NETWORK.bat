@echo off
echo ========================================
echo Starting Django Backend with Network Access
echo ========================================
echo.

cd backend

echo Checking if port 8000 is available...
netstat -ano | findstr :8000 > nul
if %errorlevel% equ 0 (
    echo WARNING: Port 8000 is already in use!
    echo Killing existing process...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do (
        taskkill /F /PID %%a 2>nul
    )
    timeout /t 2 /nobreak > nul
)

echo.
echo Starting Django server on 0.0.0.0:8000...
echo This allows connections from your phone!
echo.
echo ========================================
echo Server will be accessible at:
echo ========================================

REM Get IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set "IP=%%a"
    set "IP=!IP:~1!"
    goto :show
)

:show
echo.
echo Local:    http://127.0.0.1:8000
echo Network:  http://%IP%:8000
echo API:      http://%IP%:8000/api/
echo Health:   http://%IP%:8000/api/health/
echo.
echo ========================================
echo Test from your phone browser:
echo http://%IP%:8000/api/health/
echo ========================================
echo.

python manage.py runserver 0.0.0.0:8000
