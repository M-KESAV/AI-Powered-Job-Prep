# PostgreSQL Direct Installation Guide

## Step 1: Download and Install PostgreSQL
1. Go to https://www.postgresql.org/download/windows/
2. Download PostgreSQL 17.x for Windows
3. Run the installer with these settings:
   - Username: postgres
   - Password: password (matches your .env file)
   - Port: 5432 (matches your .env file)

## Step 2: Create Database
After installation, open Command Prompt and run:

```cmd
# Connect to PostgreSQL
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -h localhost

# Create the database (run this inside psql)
CREATE DATABASE "ai-job-prep";

# Exit psql
\q
```

## Step 3: Run Database Migrations
After the database is created, run migrations from your project directory:

```cmd
npm run db:push
```

If that command doesn't exist, you can run:
```cmd
npx drizzle-kit push
```