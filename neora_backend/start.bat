@echo off
echo ============================================
echo NEORA Backend - Starting Server
echo ============================================
echo.

if not exist "venv\Scripts\activate.bat" (
    echo ERROR: Virtual environment not found!
    echo.
    echo Run setup_venv.bat first to create the environment
    echo.
    pause
    exit /b 1
)

echo Activating virtual environment...
call venv\Scripts\activate.bat
echo ✓ Virtual environment activated
echo.

echo Starting FastAPI server...
python dev.py