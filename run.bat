@echo off
echo ========================================================
echo   Starting Coffee Shop Full-Stack Application
echo ========================================================
echo.

echo Starting Golang Backend Server on http://localhost:8080 ...
start "Coffee Shop Backend" cmd /k "cd backend && coffeeshop-backend.exe"

timeout /t 2 /nobreak >nul

echo Starting React Frontend on http://localhost:5173 ...
start "Coffee Shop Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Application is running!
echo Storefront: http://localhost:5173/
echo Admin Page: http://localhost:5173/admin (Login: admin / admin123)
echo ========================================================
