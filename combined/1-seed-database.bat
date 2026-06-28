@echo off
title 1. Seeding MongoDB database...
cd %~dp0\backend
if not exist .env (
    echo [.env] file not found in backend folder. Copying .env.example to .env...
    copy .env.example .env
    echo Please make sure MONGO_URI in backend/.env is correct!
)
echo.
echo Installing Node.js backend dependencies...
call npm install
echo.
echo Seeding dog breed data into MongoDB...
call npm run seed
echo.
pause
