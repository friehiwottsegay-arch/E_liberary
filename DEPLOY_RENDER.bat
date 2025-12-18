@echo off
echo ========================================
echo   Deploy to Render.com
echo ========================================
echo.
echo This script will help you deploy to Render
echo.
echo Prerequisites:
echo 1. GitHub account
echo 2. Render.com account
echo 3. Code pushed to GitHub
echo.
pause

echo.
echo Step 1: Checking Git status...
git status

echo.
echo Step 2: Add all files
git add .

echo.
echo Step 3: Commit changes
set /p commit_msg="Enter commit message: "
git commit -m "%commit_msg%"

echo.
echo Step 4: Push to GitHub
git push origin main

echo.
echo ========================================
echo   Next Steps:
echo ========================================
echo.
echo 1. Go to https://render.com
echo 2. Click "New +" and select "Blueprint"
echo 3. Connect your GitHub repository
echo 4. Render will detect render.yaml
echo 5. Click "Apply" to deploy
echo.
echo Your app will be live in 5-10 minutes!
echo.
echo Frontend: https://elibrary-frontend.onrender.com
echo Backend: https://elibrary-backend.onrender.com
echo.
pause
