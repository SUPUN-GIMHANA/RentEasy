# RentEasy Backend - Complete Setup Summary

## 🎉 Backend Successfully Created!

A complete Spring Boot REST API backend has been created for your RentEasy rental platform.

## 📁 Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/renteasy/
│   │   │   ├── config/              # Configuration classes
│   │   │   │   ├── AppConfig.java
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── controller/          # REST Controllers
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── BookingController.java
│   │   │   │   ├── FeedbackController.java
│   │   │   │   ├── ItemController.java
│   │   │   │   ├── NotificationController.java
│   │   │   │   └── UserController.java
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   │   ├── ApiResponse.java
│   │   │   │   ├── BookingRequest.java
│   │   │   │   ├── FeedbackRequest.java
│   │   │   │   ├── ItemRequest.java
│   │   │   │   ├── JwtResponse.java
│   │   │   │   ├── LoginRequest.java
│   │   │   │   └── SignupRequest.java
│   │   │   ├── exception/           # Exception handling
│   │   │   │   └── GlobalExceptionHandler.java
│   │   │   ├── model/               # Entity models
│   │   │   │   ├── Advertisement.java
│   │   │   │   ├── Booking.java
│   │   │   │   ├── Comment.java
│   │   │   │   ├── Feedback.java
│   │   │   │   ├── Item.java
│   │   │   │   ├── Notification.java
│   │   │   │   └── User.java
│   │   │   ├── repository/          # JPA Repositories
│   │   │   │   ├── AdvertisementRepository.java
│   │   │   │   ├── BookingRepository.java
│   │   │   │   ├── CommentRepository.java
│   │   │   │   ├── FeedbackRepository.java
│   │   │   │   ├── ItemRepository.java
│   │   │   │   ├── NotificationRepository.java
│   │   │   │   └── UserRepository.java
│   │   │   ├── security/            # Security & JWT
│   │   │   │   ├── CustomUserDetailsService.java
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   └── UserPrincipal.java
│   │   │   ├── service/             # Business logic
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── BookingService.java
│   │   │   │   ├── FeedbackService.java
│   │   │   │   ├── ItemService.java
│   │   │   │   └── NotificationService.java
│   │   │   ├── util/                # Utilities
│   │   │   │   └── SecurityUtils.java
│   │   │   └── RentEasyApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-prod.properties
│   │       └── data.sql
│   └── test/
│       └── java/com/renteasy/
│           └── RentEasyApplicationTests.java
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── pom.xml                          # Maven dependencies
├── README.md                        # Detailed documentation
├── QUICKSTART.md                    # Quick start guide
├── start.bat                        # Windows startup script
├── start.sh                         # Linux/Mac startup script
└── RentEasy-API.postman_collection.json  # API test collection
```

## ✨ Key Features Implemented

### 1. **Authentication & Authorization**
- JWT-based authentication
- User registration and login
- Password encryption with BCrypt
- Role-based access control (USER, ADMIN, OWNER)

### 2. **User Management**
- User profiles with personal information
- Profile updates
- User authentication state

### 3. **Item Management**
- CRUD operations for rental items
- Search and filtering by category
- Pagination support
- View tracking
- Boosted items feature
- Popular items tracking

### 4. **Booking System**
- Create rental bookings
- Booking status management (PENDING, CONFIRMED, COMPLETED, CANCELLED)
- Conflict detection (prevent double booking)
- Automatic price calculation
- Booking history

### 5. **Feedback System**
- Rating system (1-5 stars)
- Reviews and comments
- Feedback validation (only for completed bookings)

### 6. **Notification System**
- Real-time notifications
- Unread notification count
- Mark as read functionality
- Multiple notification types

### 7. **Security Features**
- JWT token authentication
- CORS configuration
- Password encryption
- Protected endpoints
- Request validation

## 🚀 How to Run

### Option 1: Using the Startup Script (Recommended)

**Windows:**
```cmd
cd d:\RentEasy\RentEasy\backend
start.bat
```

**Linux/Mac:**
```bash
cd backend
chmod +x start.sh
./start.sh
```

### Option 2: Manual Maven Commands

```bash
cd d:\RentEasy\RentEasy\backend
mvn clean install
mvn spring-boot:run
```

The API will be available at: **http://localhost:8080**

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Items
- `GET /api/items` - Get all items (public)
- `GET /api/items/{id}` - Get item by ID (public)
- `POST /api/items` - Create item (authenticated)
- `PUT /api/items/{id}` - Update item (authenticated)
- `DELETE /api/items/{id}` - Delete item (authenticated)
- `GET /api/items/search?query={term}` - Search items
- `GET /api/items/category/{category}` - Items by category
- `GET /api/items/boosted` - Get boosted items
- `GET /api/items/popular` - Get popular items

### Bookings
- `POST /api/bookings` - Create booking (authenticated)
- `GET /api/bookings/my-bookings` - Get user bookings (authenticated)
- `PATCH /api/bookings/{id}/status` - Update booking status (authenticated)
- `GET /api/bookings/{id}` - Get booking details (authenticated)

### Feedbacks
- `POST /api/feedbacks` - Submit feedback (authenticated)
- `GET /api/feedbacks/item/{itemId}` - Get item feedbacks (public)

### Notifications
- `GET /api/notifications` - Get user notifications (authenticated)
- `GET /api/notifications/unread` - Get unread notifications (authenticated)
- `PATCH /api/notifications/{id}/read` - Mark as read (authenticated)
- `PATCH /api/notifications/read-all` - Mark all as read (authenticated)

### Users
- `GET /api/users/me` - Get current user profile (authenticated)
- `PUT /api/users/me` - Update profile (authenticated)

## 🗄️ Database

### Development (H2 In-Memory)
- **URL**: `jdbc:h2:mem:renteasy`
- **Console**: http://localhost:8080/h2-console
- **Username**: `sa`
- **Password**: (empty)

### Production (PostgreSQL)
Configure in `application-prod.properties` or environment variables:
- `DB_USERNAME`
- `DB_PASSWORD`
- Database URL

## 🔐 Security Configuration

### JWT Settings
- Secret key configured in `application.properties`
- Token expiration: 24 hours (configurable)
- Change the secret in production!

### CORS
- Default: `http://localhost:3000`
- Configure in `application.properties`: `cors.allowed-origins`

## 📦 Technologies & Dependencies

- **Spring Boot 3.2.2**
- **Spring Security** - Authentication & Authorization
- **Spring Data JPA** - Database operations
- **JWT (jjwt 0.12.3)** - Token-based authentication
- **H2 Database** - Development database
- **PostgreSQL** - Production database
- **Lombok** - Reduce boilerplate code
- **ModelMapper** - DTO mapping
- **Bean Validation** - Request validation

## 🧪 Testing

### Run Tests
```bash
mvn test
```

### Test with Postman
Import `RentEasy-API.postman_collection.json` into Postman for ready-to-use API tests.

### Manual Testing with cURL

**Register:**
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","firstName":"Test","lastName":"User"}'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 🔧 Configuration

### Environment Variables (.env)
Copy `.env.example` to `.env` and configure:
```properties
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_pass
JWT_SECRET=your_secure_secret_key
ALLOWED_ORIGINS=http://localhost:3000
SERVER_PORT=8080
```

## 📝 Next Steps

1. **Start the backend**: Use `start.bat` or `start.sh`
2. **Test the API**: Use Postman collection or cURL commands
3. **Connect Frontend**: Update frontend API URLs to `http://localhost:8080`
4. **Customize**: Add your business logic and features
5. **Deploy**: Configure production database and deploy

## 🌐 Connecting to Frontend

Update your Next.js frontend to use the backend API:

```typescript
// lib/api.ts
const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
  auth: {
    signup: (data) => fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    login: (data) => fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  },
  items: {
    getAll: () => fetch(`${API_BASE_URL}/items`),
    getById: (id) => fetch(`${API_BASE_URL}/items/${id}`),
    create: (data, token) => fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
  }
};
```

## 🐛 Troubleshooting

### Port Already in Use
Change port in `application.properties`:
```properties
server.port=8081
```

### Maven Issues
```bash
mvn clean install -U
```

### Database Connection Issues
Check H2 console settings or PostgreSQL configuration.

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security](https://spring.io/projects/spring-security)
- [JWT.io](https://jwt.io/)
- [Postman](https://www.postman.com/)

## 🎯 Production Checklist

- [ ] Change JWT secret to a secure random string
- [ ] Configure PostgreSQL database
- [ ] Set up environment variables
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS
- [ ] Set up logging and monitoring
- [ ] Configure backup strategy
- [ ] Review security settings
- [ ] Test all endpoints
- [ ] Document API changes

---

**Backend Status**: ✅ Complete and Ready to Use!

**Default Port**: 8080  
**H2 Console**: http://localhost:8080/h2-console  
**API Base URL**: http://localhost:8080/api  

Need help? Check QUICKSTART.md for step-by-step instructions or README.md for detailed documentation.
