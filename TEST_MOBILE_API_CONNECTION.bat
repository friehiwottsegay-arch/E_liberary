@echo off
echo ========================================
echo Testing Mobile App API Connection
echo ========================================
echo.

echo Testing Backend Health...
curl -X GET http://127.0.0.1:8000/api/health/
echo.
echo.

echo Testing Books Endpoint...
curl -X GET http://127.0.0.1:8000/api/books/
echo.
echo.

echo Testing Categories Endpoint...
curl -X GET http://127.0.0.1:8000/api/categories/
echo.
echo.

echo Testing Audiobooks List Endpoint...
curl -X GET http://127.0.0.1:8000/api/audiobooks/list/
echo.
echo.

echo ========================================
echo Test Complete!
echo ========================================
echo.
echo If you see JSON responses above, the backend is working correctly.
echo If you see errors, make sure the Django server is running on port 8000.
echo.
pause
