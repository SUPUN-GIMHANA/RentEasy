# Frontend Integration Guide

This guide explains how to integrate the Spring Boot backend with your Next.js frontend.

## 🔗 Backend Base URL

Development: `http://localhost:8080/api`
Production: Update this to your deployed backend URL

## 📝 Step 1: Create API Client

Create a new file: `lib/api-client.ts`

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

export const api = {
  // Authentication
  auth: {
    signup: async (data: any) => {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
    
    login: async (data: any) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await handleResponse(response);
      // Store token
      if (result.token) {
        localStorage.setItem('authToken', result.token);
      }
      return result;
    },
    
    logout: () => {
      localStorage.removeItem('authToken');
    },
  },

  // Items
  items: {
    getAll: async (page = 0, size = 12) => {
      const response = await fetch(
        `${API_BASE_URL}/items?page=${page}&size=${size}`
      );
      return handleResponse(response);
    },
    
    getById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/items/${id}`);
      return handleResponse(response);
    },
    
    search: async (query: string, page = 0, size = 12) => {
      const response = await fetch(
        `${API_BASE_URL}/items/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`
      );
      return handleResponse(response);
    },
    
    getByCategory: async (category: string, page = 0, size = 12) => {
      const response = await fetch(
        `${API_BASE_URL}/items/category/${category}?page=${page}&size=${size}`
      );
      return handleResponse(response);
    },
    
    getBoosted: async (limit = 10) => {
      const response = await fetch(`${API_BASE_URL}/items/boosted?limit=${limit}`);
      return handleResponse(response);
    },
    
    getPopular: async (limit = 10) => {
      const response = await fetch(`${API_BASE_URL}/items/popular?limit=${limit}`);
      return handleResponse(response);
    },
    
    create: async (data: any) => {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
    
    update: async (id: string, data: any) => {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
    
    delete: async (id: string) => {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    },
  },

  // Bookings
  bookings: {
    create: async (data: any) => {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
    
    getMyBookings: async () => {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    },
    
    updateStatus: async (id: string, status: string) => {
      const token = getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/bookings/${id}/status?status=${status}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return handleResponse(response);
    },
  },

  // Feedbacks
  feedbacks: {
    create: async (data: any) => {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/feedbacks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
    
    getItemFeedbacks: async (itemId: string) => {
      const response = await fetch(`${API_BASE_URL}/feedbacks/item/${itemId}`);
      return handleResponse(response);
    },
  },

  // Notifications
  notifications: {
    getAll: async () => {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    },
    
    getUnread: async () => {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/notifications/unread`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    },
    
    getUnreadCount: async () => {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/notifications/unread/count`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.json();
    },
    
    markAsRead: async (id: string) => {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    },
    
    markAllAsRead: async () => {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    },
  },

  // Users
  users: {
    getProfile: async () => {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    },
    
    updateProfile: async (data: any) => {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
  },
};
```

## 📝 Step 2: Update Auth Context

Update `lib/auth-context.tsx` to use the real API:

```typescript
'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { api } from './api-client'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (data: any) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (token) {
          const userData = await api.users.getProfile()
          setUser(userData)
        }
      } catch (error) {
        console.error('Failed to load user:', error)
        localStorage.removeItem('authToken')
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.auth.login({ email, password })
      setUser({
        id: response.id,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role,
      })
    } catch (error) {
      throw error
    }
  }

  const signup = async (data: any) => {
    try {
      await api.auth.signup(data)
      // Auto login after signup
      await login(data.email, data.password)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    api.auth.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

## 📝 Step 3: Environment Variables

Create/Update `.env.local` in your Next.js root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

For production:
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

## 📝 Step 4: Update Pages to Use Real API

### Example: Browse Page

Update `app/browse/page.tsx`:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api-client'
import FeaturedRentalCard from '@/components/featured-rental-card'

export default function BrowsePage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    loadItems()
  }, [page])

  const loadItems = async () => {
    try {
      setLoading(true)
      const response = await api.items.getAll(page, 12)
      setItems(response.content)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error('Failed to load items:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item: any) => (
        <FeaturedRentalCard
          key={item.id}
          id={item.id}
          name={item.name}
          description={item.description}
          price={item.price}
          imageUrl={item.imageUrl}
          category={item.category}
        />
      ))}
    </div>
  )
}
```

### Example: Login Page

Update `app/login/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      router.push('/browse')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="text-red-500">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

## 🔧 CORS Configuration

The backend is already configured to accept requests from `http://localhost:3000`. 

For production, update the backend's `application-prod.properties`:

```properties
cors.allowed-origins=https://your-frontend-domain.com
```

## 🧪 Testing the Integration

1. **Start the backend**:
   ```bash
   cd backend
   ./start.bat  # Windows
   ./start.sh   # Linux/Mac
   ```

2. **Start the frontend**:
   ```bash
   cd ..
   npm run dev
   ```

3. **Test the flow**:
   - Register a new user
   - Login
   - Browse items
   - Create a booking
   - Submit feedback

## 🐛 Common Issues

### CORS Errors
- Ensure backend CORS is configured for your frontend URL
- Check that you're using the correct API URL

### Authentication Errors
- Verify token is being stored in localStorage
- Check Authorization header format: `Bearer TOKEN`

### Network Errors
- Ensure backend is running on port 8080
- Check firewall settings
- Verify API URL in .env.local

## 📚 Next Steps

1. Replace mock data with API calls throughout the app
2. Add error handling and loading states
3. Implement optimistic updates for better UX
4. Add request caching with React Query or SWR
5. Set up proper error boundaries

## 💡 Tips

- Use React Query or SWR for better data fetching
- Implement request interceptors for token refresh
- Add retry logic for failed requests
- Use TypeScript interfaces for type safety
- Implement proper error handling and user feedback

---

Your backend is now ready to integrate with your Next.js frontend! 🚀
