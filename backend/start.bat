@echo off
REM RentEasy Backend Startup Script for Windows

echo Starting RentEasy Backend...

REM Check if Maven is installed
where mvn >nul 2>nul
if %errorlevel% neq 0 (
    echo Maven is not installed. Please install Maven first.
    exit /b 1
)

REM Check if Java is installed
where java >nul 2>nul
if %errorlevel% neq 0 (
    echo Java is not installed. Please install Java 17 or higher.
    exit /b 1
)

REM Load environment variables if .env file exists
if exist .env (
    echo Loading environment variables from .env file...
    for /f "delims== tokens=1,2" %%G in (.env) do set %%G=%%H
)

REM Clean and build the project
echo Building the project...
call mvn clean install -DskipTests

REM Check if build was successful
if %errorlevel% equ 0 (
    echo Build successful! Starting the application...
    call mvn spring-boot:run
) else (
    echo Build failed! Please check the errors above.
    exit /b 1
)
