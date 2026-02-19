const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

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
    let message = `HTTP ${response.status}: ${response.statusText}`;
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      try {
        const error = await response.json();
        if (error?.message) {
          message = error.message;
        }
      } catch (e) {
        // If JSON parsing fails, try to get text
        const text = await response.text().catch(() => '');
        if (text) {
          message = text;
        }
      }
    } else {
      const text = await response.text().catch(() => '');
      if (text) {
        message = text;
      }
    }

    throw new ApiError(response.status, message);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
      throw new Error(`Invalid JSON response from server: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  }
  return response.text();
};

export const api = {
  // Authentication
  auth: {
    signup: async (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phoneNumber?: string;
      address?: string;
      city?: string;
      country?: string;
    }) => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        return await handleResponse(response);
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }
        console.error('Signup error:', error);
        throw new Error('Unable to connect to server. Please ensure the backend is running.');
      }
    },
    
    login: async (data: { email: string; password: string }) => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const result = await handleResponse(response);
        
        // Store token
        if (result.token && typeof window !== 'undefined') {
          localStorage.setItem('authToken', result.token);
          localStorage.setItem('user', JSON.stringify({
            id: result.id,
            email: result.email,
            firstName: result.firstName,
            lastName: result.lastName,
            role: result.role,
          }));
        }
        return result;
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }
        console.error('Login error:', error);
        throw new Error('Unable to connect to server. Please ensure the backend is running.');
      }
    },
    
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
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
    
    getByCategory: async (category: string, page = 0, size = 12, subcategory?: string) => {
      let url = `${API_BASE_URL}/items/category/${category}?page=${page}&size=${size}`;
      if (subcategory) {
        url += `&subcategory=${encodeURIComponent(subcategory)}`;
      }
      const response = await fetch(url);
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
    
    getMyItems: async () => {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/items/my-items`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    },
    
    create: async (data: any) => {
      const token = getAuthToken();
      const formData = new FormData();
      
      // Add text fields
      formData.append('name', data.name);
      formData.append('category', data.category);
      if (data.subcategory) {
        formData.append('subcategory', data.subcategory);
      }
      formData.append('price', data.price.toString());
      formData.append('location', data.location);
      formData.append('description', data.description);
      formData.append('available', data.available?.toString() || 'true');
      if (data.ownerPhoneNumber) {
        formData.append('ownerPhoneNumber', data.ownerPhoneNumber);
      }
      
      if (data.minimumRentalPeriod) {
        formData.append('minimumRentalPeriod', data.minimumRentalPeriod.toString());
      }
      if (data.maximumRentalPeriod) {
        formData.append('maximumRentalPeriod', data.maximumRentalPeriod.toString());
      }
      if (Array.isArray(data.availableDates)) {
        data.availableDates.forEach((date: string) => {
          formData.append('availableDates', date);
        });
      }
      
      // Add image files
      if (data.imageFiles && data.imageFiles.length > 0) {
        data.imageFiles.forEach((file: File, index: number) => {
          if (index === 0) {
            formData.append('imageFile', file);
          } else {
            formData.append('additionalImageFiles', file);
          }
        });
      }
      
      const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
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

    updateBookingDates: async (id: string, availableDates: string[], fallbackItemData?: any) => {
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}/items/${id}/booking-dates`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(availableDates || []),
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          return handleResponse(response);
        }
        return { success: true };
      }

      // Fallback for backend builds that don't expose /booking-dates endpoint
      // or return non-standard error codes/messages for missing route.
      if (fallbackItemData) {
        const fallbackPayload = {
          name: fallbackItemData.name,
          description: fallbackItemData.description,
          category: fallbackItemData.category,
          subcategory: fallbackItemData.subcategory,
          price: fallbackItemData.price,
          imageUrl: fallbackItemData.imageUrl,
          additionalImages: fallbackItemData.additionalImages || [],
          available: fallbackItemData.available ?? true,
          availableDates: availableDates || [],
          location: fallbackItemData.location,
          ownerPhoneNumber: fallbackItemData.ownerPhoneNumber,
          minimumRentalPeriod: fallbackItemData.minimumRentalPeriod,
          maximumRentalPeriod: fallbackItemData.maximumRentalPeriod,
        };

        const fallbackResponse = await fetch(`${API_BASE_URL}/items/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(fallbackPayload),
        });

        if (!fallbackResponse.ok) {
          return handleResponse(fallbackResponse);
        }

        const fallbackContentType = fallbackResponse.headers.get('content-type') || '';
        if (fallbackContentType.includes('application/json')) {
          return handleResponse(fallbackResponse);
        }
        return { success: true };
      }

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
    create: async (data: {
      itemId: string;
      startDate: string;
      endDate: string;
      deliveryAddress?: string;
      specialInstructions?: string;
    }) => {
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
    
    getById: async (id: string) => {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    },

    getItemBookings: async (itemId: string) => {
      const response = await fetch(`${API_BASE_URL}/bookings/item/${itemId}`);
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
    create: async (data: {
      bookingId: string;
      rating: number;
      comment?: string;
    }) => {
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
    
    getUserFeedbacks: async (userId: string) => {
      const response = await fetch(`${API_BASE_URL}/feedbacks/user/${userId}`);
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
    
    delete: async (id: string) => {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: 'DELETE',
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
    
    getById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/users/${id}`);
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

// Helper to check if user is authenticated
export const isAuthenticated = () => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('authToken');
  }
  return false;
};

// Helper to get stored user
export const getStoredUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};
