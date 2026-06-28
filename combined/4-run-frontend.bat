@echo off
title 4. Running React Frontend...
cd /d "%~dp0frontend"
if not exist .env (
    echo [.env] file not found in frontend folder. Copying .env.example to .env...
    copy .env.example .env
)
echo.
echo Installing React frontend dependencies...
call npm install
echo.
echo Starting React frontend dev server...
call npm run dev
pause
