# RentEasy API Documentation

Complete API reference for the RentEasy backend service.

**Base URL**: `http://localhost:8080/api`  
**Version**: 1.0.0  
**Authentication**: JWT Bearer Token

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Items](#items)
4. [Bookings](#bookings)
5. [Feedbacks](#feedbacks)
6. [Notifications](#notifications)
7. [Error Responses](#error-responses)
8. [Status Codes](#status-codes)

---

## 🔐 Authentication

### Register User

Create a new user account.

**Endpoint**: `POST /api/auth/signup`  
**Auth Required**: No

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA"
}
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": "user-id-here"
}
```

---

### Login

Authenticate and receive JWT token.

**Endpoint**: `POST /api/auth/login`  
**Auth Required**: No

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": "user-id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER"
}
```

**Usage**: Include token in subsequent requests:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 👤 Users

### Get Current User Profile

**Endpoint**: `GET /api/users/me`  
**Auth Required**: Yes

**Success Response** (200 OK):
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA",
  "role": "USER",
  "active": true,
  "emailVerified": false,
  "createdAt": "2026-02-12T10:00:00",
  "updatedAt": "2026-02-12T10:00:00"
}
```

---

### Update Profile

**Endpoint**: `PUT /api/users/me`  
**Auth Required**: Yes

**Request Body** (all fields optional):
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumber": "+1987654321",
  "address": "456 Oak Ave",
  "city": "Los Angeles",
  "country": "USA",
  "profileImageUrl": "https://example.com/profile.jpg"
}
```

**Success Response** (200 OK): Updated user object

---

### Get User by ID

**Endpoint**: `GET /api/users/{id}`  
**Auth Required**: No

**Success Response** (200 OK): User object (without password)

---

## 📦 Items

### Get All Items

Retrieve paginated list of available items.

**Endpoint**: `GET /api/items`  
**Auth Required**: No

**Query Parameters**:
- `page` (default: 0) - Page number
- `size` (default: 12) - Items per page

**Example**: `/api/items?page=0&size=12`

**Success Response** (200 OK):
```json
{
  "content": [
    {
      "id": "item-id",
      "name": "Professional Camera Kit",
      "description": "High-quality DSLR with lenses",
      "category": "Electronics",
      "price": 150.00,
      "imageUrl": "/images/camera.jpg",
      "available": true,
      "location": "New York",
      "views": 42,
      "boosted": false,
      "createdAt": "2026-02-10T14:30:00"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 12
  },
  "totalPages": 5,
  "totalElements": 58,
  "last": false,
  "first": true
}
```

---

### Get Item by ID

**Endpoint**: `GET /api/items/{id}`  
**Auth Required**: No

**Success Response** (200 OK): Item object with full details

---

### Create Item

**Endpoint**: `POST /api/items`  
**Auth Required**: Yes

**Request Body**:
```json
{
  "name": "Mountain Bike",
  "description": "High-performance mountain bike",
  "category": "Sports",
  "price": 60.00,
  "imageUrl": "/images/bike.jpg",
  "available": true,
  "location": "San Francisco",
  "minimumRentalPeriod": 1,
  "maximumRentalPeriod": 30,
  "availableDates": ["2026-02-15", "2026-02-16", "2026-02-17"]
}
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Item created successfully",
  "data": { /* item object */ }
}
```

---

### Update Item

**Endpoint**: `PUT /api/items/{id}`  
**Auth Required**: Yes (must be item owner)

**Request Body**: Same as create (all fields required)

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Item updated successfully",
  "data": { /* updated item object */ }
}
```

---

### Delete Item

**Endpoint**: `DELETE /api/items/{id}`  
**Auth Required**: Yes (must be item owner)

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Item deleted successfully"
}
```

---

### Search Items

**Endpoint**: `GET /api/items/search`  
**Auth Required**: No

**Query Parameters**:
- `query` (required) - Search term
- `page` (default: 0)
- `size` (default: 12)

**Example**: `/api/items/search?query=camera&page=0&size=12`

**Success Response** (200 OK): Paginated items matching search

---

### Get Items by Category

**Endpoint**: `GET /api/items/category/{category}`  
**Auth Required**: No

**Query Parameters**:
- `page` (default: 0)
- `size` (default: 12)

**Example**: `/api/items/category/Electronics?page=0&size=12`

**Success Response** (200 OK): Paginated items in category

---

### Get Boosted Items

**Endpoint**: `GET /api/items/boosted`  
**Auth Required**: No

**Query Parameters**:
- `limit` (default: 10) - Maximum items to return

**Success Response** (200 OK): Array of boosted items

---

### Get Popular Items

**Endpoint**: `GET /api/items/popular`  
**Auth Required**: No

**Query Parameters**:
- `limit` (default: 10)

**Success Response** (200 OK): Array of popular items (by view count)

---

### Get My Items

**Endpoint**: `GET /api/items/my-items`  
**Auth Required**: Yes

**Success Response** (200 OK): Array of items owned by current user

---

## 📅 Bookings

### Create Booking

**Endpoint**: `POST /api/bookings`  
**Auth Required**: Yes

**Request Body**:
```json
{
  "itemId": "item-id-here",
  "startDate": "2026-02-20",
  "endDate": "2026-02-22",
  "deliveryAddress": "123 Main St, New York",
  "specialInstructions": "Please deliver in morning"
}
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": "booking-id",
    "itemId": "item-id",
    "userId": "user-id",
    "startDate": "2026-02-20",
    "endDate": "2026-02-22",
    "rentalDays": 3,
    "totalPrice": 450.00,
    "status": "PENDING",
    "createdAt": "2026-02-12T15:00:00"
  }
}
```

---

### Get My Bookings

**Endpoint**: `GET /api/bookings/my-bookings`  
**Auth Required**: Yes

**Success Response** (200 OK): Array of user's bookings

---

### Get Booking by ID

**Endpoint**: `GET /api/bookings/{id}`  
**Auth Required**: Yes

**Success Response** (200 OK): Booking object with details

---

### Update Booking Status

**Endpoint**: `PATCH /api/bookings/{id}/status`  
**Auth Required**: Yes (owner or booker)

**Query Parameters**:
- `status` (required) - New status value

**Valid Statuses**:
- `PENDING`
- `CONFIRMED`
- `IN_PROGRESS`
- `COMPLETED`
- `CANCELLED`
- `REFUNDED`

**Example**: `/api/bookings/booking-id/status?status=CONFIRMED`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Booking status updated",
  "data": { /* updated booking */ }
}
```

---

### Get Owner Bookings

**Endpoint**: `GET /api/bookings/owner`  
**Auth Required**: Yes

**Success Response** (200 OK): Bookings for items owned by current user

---

## ⭐ Feedbacks

### Submit Feedback

**Endpoint**: `POST /api/feedbacks`  
**Auth Required**: Yes

**Request Body**:
```json
{
  "bookingId": "booking-id-here",
  "rating": 5,
  "comment": "Great experience! Item was in perfect condition."
}
```

**Validation**:
- Rating must be 1-5
- Can only submit for own completed bookings
- One feedback per booking

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "data": {
    "id": "feedback-id",
    "bookingId": "booking-id",
    "userId": "user-id",
    "rating": 5,
    "comment": "Great experience!",
    "createdAt": "2026-02-12T16:00:00"
  }
}
```

---

### Get Item Feedbacks

**Endpoint**: `GET /api/feedbacks/item/{itemId}`  
**Auth Required**: No

**Success Response** (200 OK): Array of feedbacks for the item

---

### Get User Feedbacks

**Endpoint**: `GET /api/feedbacks/user/{userId}`  
**Auth Required**: No

**Success Response** (200 OK): Array of feedbacks by the user

---

## 🔔 Notifications

### Get All Notifications

**Endpoint**: `GET /api/notifications`  
**Auth Required**: Yes

**Success Response** (200 OK):
```json
[
  {
    "id": "notification-id",
    "title": "Booking Confirmed",
    "message": "Your booking for Camera Kit has been confirmed",
    "type": "BOOKING_CONFIRMED",
    "read": false,
    "createdAt": "2026-02-12T14:00:00"
  }
]
```

---

### Get Unread Notifications

**Endpoint**: `GET /api/notifications/unread`  
**Auth Required**: Yes

**Success Response** (200 OK): Array of unread notifications

---

### Get Unread Count

**Endpoint**: `GET /api/notifications/unread/count`  
**Auth Required**: Yes

**Success Response** (200 OK):
```json
5
```

---

### Mark Notification as Read

**Endpoint**: `PATCH /api/notifications/{id}/read`  
**Auth Required**: Yes

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": { /* updated notification */ }
}
```

---

### Mark All as Read

**Endpoint**: `PATCH /api/notifications/read-all`  
**Auth Required**: Yes

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

### Delete Notification

**Endpoint**: `DELETE /api/notifications/{id}`  
**Auth Required**: Yes

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Notification deleted"
}
```

---

## ⚠️ Error Responses

### Validation Error (400 Bad Request)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Email should be valid",
    "password": "Password must be at least 6 characters"
  }
}
```

### Authentication Error (401 Unauthorized)
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Authorization Error (403 Forbidden)
```json
{
  "success": false,
  "message": "You don't have permission to access this resource"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Item not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "An error occurred: Internal server error"
}
```

---

## 📊 Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Validation error or invalid data |
| 401 | Unauthorized - Authentication required or failed |
| 403 | Forbidden - No permission to access resource |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Server-side error |

---

## 📝 Notes

1. **Date Format**: All dates use ISO 8601 format: `YYYY-MM-DD`
2. **DateTime Format**: `YYYY-MM-DDTHH:mm:ss`
3. **Price Format**: Decimal with 2 decimal places
4. **Pagination**: Zero-indexed (first page is 0)
5. **JWT Expiration**: 24 hours (configurable)

---

## 🧪 Testing with cURL

### Complete Flow Example

```bash
# 1. Register
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","firstName":"Test","lastName":"User"}'

# 2. Login
TOKEN=$(curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}' | jq -r '.token')

# 3. Create Item
curl -X POST http://localhost:8080/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Test Item","description":"Test","category":"Electronics","price":100,"available":true}'

# 4. Get Items
curl http://localhost:8080/api/items

# 5. Create Booking
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"itemId":"ITEM_ID_HERE","startDate":"2026-02-20","endDate":"2026-02-22"}'
```

---

**API Version**: 1.0.0  
**Last Updated**: February 2026  
**Base URL**: `http://localhost:8080/api`  
**Production URL**: Update when deployed

For more information, see the main [README.md](README.md)
