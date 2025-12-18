@echo off
echo ========================================
echo Creating Demo User for Mobile App
echo ========================================
echo.

REM Activate virtual environment if it exists
if exist .venv\Scripts\activate.bat (
    echo Activating virtual environment...
    call .venv\Scripts\activate.bat
) else if exist venv\Scripts\activate.bat (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
)

python create_demo_user.py

echo.
echo Press any key to exit...
pause > nul
