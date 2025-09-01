@echo off
echo Starting PostgreSQL database with Docker...
docker-compose up -d db
echo Database started! You can now run your Next.js application.
pause