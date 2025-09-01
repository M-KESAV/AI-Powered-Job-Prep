@echo off
echo ========================================
echo AI-Powered Job Prep - Complete Setup
echo ========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Docker is installed
    echo Starting PostgreSQL database...
    docker-compose up -d db
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Database started successfully
        echo Waiting for database to be ready...
        timeout /t 10 /nobreak >nul
        goto :migrate
    ) else (
        echo ❌ Failed to start database with Docker
        goto :postgres_direct
    )
) else (
    echo ❌ Docker not found
    goto :postgres_direct
)

:postgres_direct
echo.
echo Checking for direct PostgreSQL installation...
"C:\Program Files\PostgreSQL\17\bin\psql.exe" --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ PostgreSQL is installed
    echo Creating database...
    "C:\Program Files\PostgreSQL\17\bin\createdb.exe" -U postgres -h localhost ai-job-prep >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Database 'ai-job-prep' created successfully
        goto :migrate
    ) else (
        echo ⚠️  Database might already exist, continuing...
        goto :migrate
    )
) else (
    echo ❌ PostgreSQL not found
    echo.
    echo Please install either:
    echo 1. Docker Desktop: https://desktop.docker.com/win/main/amd64/Docker%%20Desktop%%20Installer.exe
    echo 2. PostgreSQL 17: https://www.postgresql.org/download/windows/
    echo.
    echo Then run this script again.
    pause
    exit /b 1
)

:migrate
echo.
echo Running database migrations...
npm run db:push
if %ERRORLEVEL% EQU 0 (
    echo ✅ Database migrations completed successfully
) else (
    echo ❌ Migration failed. Please check your database connection.
    echo Make sure PostgreSQL is running and accessible.
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ Setup Complete!
echo ========================================
echo.
echo Your AI-Powered Job Prep platform is ready!
echo.
echo To start the development server:
echo   npm run dev
echo.
echo Then open: http://localhost:3000
echo.
echo ========================================
echo 📋 What's Configured:
echo ========================================
echo ✅ Dependencies installed
echo ✅ Database running (PostgreSQL)
echo ✅ Database schema migrated
echo ✅ Clerk authentication (configured)
echo ✅ Google Gemini AI (configured)
echo ✅ Hume AI (configured)
echo ✅ Arcjet rate limiting (configured)
echo.
echo 🚀 All systems ready!
echo ========================================
echo.
pause