@echo off
echo ========================================
echo Starting SkillLink Frontend Server
echo ========================================
echo.

cd Skilllink-frontend

echo Checking if node_modules exists...
if not exist "node_modules\" (
    echo Installing frontend dependencies...
    call npm install
    echo.
)

echo Starting frontend server on port 5173...
echo.
call npm run dev
