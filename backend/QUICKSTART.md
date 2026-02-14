# Quick Start Guide

## Prerequisites
- Java 17 or higher
- Maven 3.6+
- Git

## Quick Setup (Windows)

1. **Navigate to backend folder**
   ```cmd
   cd d:\RentEasy\RentEasy\backend
   ```

2. **Run the startup script**
   ```cmd
   start.bat
   ```

   Or manually:
   ```cmd
   mvn clean install
   mvn spring-boot:run
   ```

3. **Access the application**
   - API: http://localhost:8080
   - H2 Console: http://localhost:8080/h2-console

## Quick Setup (Linux/Mac)

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Make the startup script executable**
   ```bash
   chmod +x start.sh
   ```

3. **Run the startup script**
   ```bash
   ./start.sh
   ```

## Test the API

### 1. Register a User
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

Save the token from the response!

### 3. Create an Item (requires token)
```bash
curl -X POST http://localhost:8080/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Camera Kit",
    "description": "Professional camera",
    "category": "Electronics",
    "price": 150.00,
    "available": true
  }'
```

### 4. Get All Items
```bash
curl http://localhost:8080/api/items
```

## Database Access

**H2 Console:** http://localhost:8080/h2-console

Connection settings:
- JDBC URL: `jdbc:h2:mem:renteasy`
- Username: `sa`
- Password: (leave empty)

## Postman Collection

Import the `RentEasy-API.postman_collection.json` file into Postman for a complete API testing suite.

## Common Issues

### Port 8080 already in use
Change the port in `application.properties`:
```properties
server.port=8081
```

### Maven not found
Install Maven: https://maven.apache.org/download.cgi

### Java version issues
Ensure Java 17+ is installed:
```bash
java -version
```

## Next Steps

1. Review the [README.md](README.md) for detailed documentation
2. Configure PostgreSQL for production
3. Update JWT secret in production
4. Set up proper CORS for your frontend
5. Configure environment variables for production

## Support

For issues or questions, please check the main README.md file or create an issue in the repository.
