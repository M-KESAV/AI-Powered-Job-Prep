@echo off
echo Setting up PostgreSQL database...

echo Creating database...
"C:\Program Files\PostgreSQL\17\bin\createdb.exe" -U postgres -h localhost ai-job-prep

if %ERRORLEVEL% EQU 0 (
    echo Database 'ai-job-prep' created successfully!
    echo Now running database migrations...
    npm run db:push
    if %ERRORLEVEL% EQU 0 (
        echo Database setup complete! You can now run your application.
    ) else (
        echo Migration failed. Please check your database connection.
    )
) else (
    echo Failed to create database. Please check if PostgreSQL is installed and running.
    echo Make sure you installed PostgreSQL with username 'postgres' and password 'password'
)

pause