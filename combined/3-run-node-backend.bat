@echo off
title 3. Running Node Backend...
cd /d "%~dp0backend"
if not exist .env (
    echo [.env] file not found in backend folder. Copying .env.example to .env...
    copy .env.example .env
)
echo.
echo Installing Node.js backend dependencies...
call npm install
echo.
echo Starting Node backend dev server...
call npm run dev
pause
