@echo off
echo ========================================
echo Starting SkillLink Backend Server
echo ========================================
echo.

echo Checking if node_modules exists...
if not exist "node_modules\" (
    echo Installing backend dependencies...
    call npm install
    echo.
)

echo Starting backend server on port 5000...
echo.
call npm run dev
