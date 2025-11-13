@echo off
echo ========================================
echo Starting SkillLink Application
echo ========================================
echo.
echo This will start both backend and frontend servers
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press Ctrl+C in each window to stop the servers
echo.
pause

start "SkillLink Backend" cmd /k "start-backend.bat"
timeout /t 3 /nobreak > nul
start "SkillLink Frontend" cmd /k "start-frontend.bat"

echo.
echo Both servers are starting in separate windows...
echo.
