@echo off
echo Installing PostgreSQL directly...
echo.
echo Please follow these steps:
echo 1. Go to https://www.postgresql.org/download/windows/
echo 2. Download PostgreSQL 17.x for Windows
echo 3. During installation, use these settings:
echo    - Username: postgres
echo    - Password: password
echo    - Port: 5432
echo    - Database name: (leave default, we'll create ai-job-prep later)
echo.
echo After installation, run: setup-postgres-db.bat
pause