# RentEasy Backend API

Spring Boot REST API for the RentEasy rental platform.

## Technologies Used

- Java 17
- Spring Boot 3.2.2
- Spring Security with JWT
- Spring Data JPA
- H2 Database (Development)
- PostgreSQL (Production)
- Maven

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: User registration, login, profile management
- **Item Management**: CRUD operations for rental items with search and filtering
- **Booking System**: Complete booking workflow with status management
- **Feedback System**: Rating and review system for completed bookings
- **Notifications**: Real-time notifications for important events
- **Admin Panel**: Administrative features for platform management

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL (for production)

### Installation

1. Clone the repository:
```bash
cd backend
```

2. Configure the database in `application.properties`:
```properties
# For development (H2)
spring.datasource.url=jdbc:h2:mem:renteasy

# For production (PostgreSQL)
# spring.datasource.url=jdbc:postgresql://localhost:5432/renteasy
# spring.datasource.username=your_username
# spring.datasource.password=your_password
```

3. Update JWT secret in `application.properties`:
```properties
jwt.secret=yourSecretKeyForJWTTokenGenerationMustBeLongEnoughForHS256Algorithm
```

4. Build the project:
```bash
mvn clean install
```

5. Run the application:
```bash
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Items
- `GET /api/items` - Get all items (paginated)
- `GET /api/items/{id}` - Get item by ID
- `POST /api/items` - Create new item (authenticated)
- `PUT /api/items/{id}` - Update item (authenticated)
- `DELETE /api/items/{id}` - Delete item (authenticated)
- `GET /api/items/category/{category}` - Get items by category
- `GET /api/items/search?query={query}` - Search items
- `GET /api/items/boosted` - Get boosted items
- `GET /api/items/popular` - Get popular items

### Bookings
- `POST /api/bookings` - Create booking (authenticated)
- `GET /api/bookings/my-bookings` - Get user's bookings (authenticated)
- `GET /api/bookings/{id}` - Get booking by ID (authenticated)
- `PATCH /api/bookings/{id}/status` - Update booking status (authenticated)

### Feedbacks
- `POST /api/feedbacks` - Submit feedback (authenticated)
- `GET /api/feedbacks/item/{itemId}` - Get item feedbacks

### Notifications
- `GET /api/notifications` - Get user notifications (authenticated)
- `GET /api/notifications/unread` - Get unread notifications (authenticated)
- `PATCH /api/notifications/{id}/read` - Mark notification as read (authenticated)

### Users
- `GET /api/users/me` - Get current user profile (authenticated)
- `PUT /api/users/me` - Update user profile (authenticated)

## Database Schema

The application uses the following main entities:
- **User**: User accounts with authentication
- **Item**: Rental items/products
- **Booking**: Rental bookings
- **Feedback**: Reviews and ratings
- **Notification**: User notifications
- **Comment**: Comments on items
- **Advertisement**: Platform advertisements

## Security

- JWT token-based authentication
- Password encryption using BCrypt
- CORS configuration for frontend integration
- Role-based access control (USER, ADMIN, OWNER)

## Development

### H2 Console
Access H2 database console at: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:renteasy`
- Username: `sa`
- Password: (leave empty)

### Testing
Run tests with:
```bash
mvn test
```

## Production Deployment

1. Set environment variables:
```bash
export DB_USERNAME=your_db_username
export DB_PASSWORD=your_db_password
export JWT_SECRET=your_production_jwt_secret
export ALLOWED_ORIGINS=https://your-frontend-domain.com
```

2. Build the JAR:
```bash
mvn clean package -DskipTests
```

3. Run the application:
```bash
java -jar target/renteasy-backend-1.0.0.jar --spring.profiles.active=prod
```

## API Documentation

For detailed API documentation, import the endpoints into Postman or use Swagger (can be added with springdoc-openapi).

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
