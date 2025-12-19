@echo off
REM Quantum Travel AI - Quick Start Script for Windows

echo ================================
echo Quantum Travel AI - Quick Start
echo ================================
echo.

REM Check Python version
echo Checking Python version...
python --version
if %errorlevel% neq 0 (
    echo Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

echo Python is installed
echo.

REM Navigate to backend directory
cd /d "%~dp0backend"

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    echo Virtual environment created
)

REM Activate virtual environment
echo.
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo.
echo Installing dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Failed to install dependencies
    pause
    exit /b 1
)

echo Dependencies installed

REM Check for .env file
if not exist ".env" (
    echo.
    echo No .env file found. Creating from example...
    if exist "..\\.env.example" (
        copy "..\\.env.example" ".env"
        echo .env file created. Please edit it with your API keys.
    ) else (
        echo .env.example not found. Please create .env manually.
    )
)

REM Start the application
echo.
echo ================================
echo Starting Quantum Travel AI...
echo ================================
echo.
echo Access the application at: http://localhost:8000
echo API Documentation at: http://localhost:8000/api/docs
echo.
echo Press Ctrl+C to stop the server
echo.

python main.py

pause
