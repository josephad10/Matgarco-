@echo off
echo Starting Matgarco All-in-One Development Environment...

:: Backend API
start "Backend API" cmd /k "cd backend-node && npm run dev"

:: Landing Page
start "Landing Page" cmd /k "cd landing-next && npm run dev"

:: Storefront
start "Storefront" cmd /k "cd storefront-next && npm run dev"

:: Merchant Dashboard
start "Merchant Dashboard" cmd /k "cd dashboard-react && npm run dev"

:: Super Admin
start "Super Admin" cmd /k "cd super-admin-react && npm run dev"

echo.
echo ----------------------------------------------------
echo Services are starting in separate windows.
echo ----------------------------------------------------
pause
