@echo off
echo ========================================
echo Starting Backend for E-Library Mobile
echo ========================================
echo.

cd backend

echo Activating virtual environment...
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
) else if exist .venv\Scripts\activate.bat (
    call .venv\Scripts\activate.bat
) else (
    echo WARNING: No virtual environment found!
    echo.
)

echo.
echo Starting Django server on port 8001...
echo.
echo Backend will be available at: http://127.0.0.1:8001
echo API endpoint: http://127.0.0.1:8001/api/
echo.
echo Press Ctrl+C to stop the server
echo.

python manage.py runserver 8001

pause
