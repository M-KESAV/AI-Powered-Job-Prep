@echo off
echo ========================================
echo Quick Database Setup - AI Job Prep
echo ========================================
echo.

echo Checking if Docker is available...
docker --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker not found!
    echo Please install Docker Desktop from:
    echo https://desktop.docker.com/win/main/amd64/Docker%%20Desktop%%20Installer.exe
    echo.
    echo Then run this script again.
    pause
    exit /b 1
)

echo ✅ Docker found! Starting PostgreSQL database...
docker-compose up -d db

echo Waiting for database to be ready...
timeout /t 10 /nobreak >nul

echo Running database migrations...
npm run db:push

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Database setup complete!
    echo ✅ All tables created successfully
    echo.
    echo Your application should now work without database errors.
    echo.
    echo To restart your development server:
    echo   npm run dev
    echo.
) else (
    echo ❌ Migration failed. Please check the output above.
)

pause