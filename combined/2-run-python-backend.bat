@echo off
title 2. Running Python AI Service...
cd /d "%~dp0python-backend"
if not exist .env (
    echo [.env] file not found in python-backend folder. Copying env template...
    copy .env.example .env
)
if not exist venv (
    echo Creating python virtual environment venv...
    python -m venv venv
)
echo.
echo Activating virtual environment...
call venv\Scripts\activate.bat
echo.
echo Installing python dependencies (this may take a few minutes for TensorFlow)...
pip install -r requirements_utf8.txt
echo.
echo Starting Python AI Service...
python -m app.main
pause
