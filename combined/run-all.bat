@echo off
title Launching PawIntel Services...

echo ===================================================
echo   LAUNCHING PAWINTEL SERVICES (AI & ENCYCLOPEDIA)
echo ===================================================
echo.

echo 1. Launching Python AI Service in a new window...
start "Python AI Service" cmd /k call "%~dp02-run-python-backend.bat"

echo 2. Launching Node.js Backend in a new window...
start "Node.js Backend" cmd /k call "%~dp03-run-node-backend.bat"

echo 3. Launching React Frontend in a new window...
start "React Frontend" cmd /k call "%~dp04-run-frontend.bat"

echo.
echo All services have been launched in separate windows.
echo - Ensure MongoDB is running.
echo - You do NOT need to run the seeding script since your database already has data.
echo - You do NOT need Groq to be configured for these two features to work.
echo.
pause
