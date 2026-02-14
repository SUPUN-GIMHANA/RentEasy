#!/bin/bash

# RentEasy Backend Startup Script

echo "Starting RentEasy Backend..."

# Check if Maven is installed
if ! command -v mvn &> /dev/null
then
    echo "Maven is not installed. Please install Maven first."
    exit 1
fi

# Check if Java is installed
if ! command -v java &> /dev/null
then
    echo "Java is not installed. Please install Java 17 or higher."
    exit 1
fi

# Load environment variables if .env file exists
if [ -f .env ]; then
    echo "Loading environment variables from .env file..."
    export $(cat .env | xargs)
fi

# Clean and build the project
echo "Building the project..."
mvn clean install -DskipTests

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful! Starting the application..."
    mvn spring-boot:run
else
    echo "Build failed! Please check the errors above."
    exit 1
fi
