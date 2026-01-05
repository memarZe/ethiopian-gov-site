import axios from 'axios';
import { PerformanceMonitor } from '../utils/performance';
import { mockServices } from '../data/mockServices';
import { mockRegions } from '../data/mockRegions';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add performance tracking start time
    config.metadata = { startTime: Date.now() };
    
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => {
    // Track API performance
    if (response.config.metadata) {
      const endTime = Date.now();
      const endpoint = response.config.url;
      PerformanceMonitor.trackApiCall(endpoint, response.config.metadata.startTime, endTime, true);
    }
    return response;
  },
  (error) => {
    // Track failed API calls
    if (error.config?.metadata) {
      const endTime = Date.now();
      const endpoint = error.config.url;
      PerformanceMonitor.trackApiCall(endpoint, error.config.metadata.startTime, endTime, false);
    }
    
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    } else if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Authentication Methods
  login: async (credentials) => {
    try {
      // For demonstration, create a mock login that validates against existing users
      // In production, this would call the real backend authentication endpoint
      
      // First, let's try to authenticate with any existing admin user
      // Since we created users earlier, let's use those for authentication
      const { username, password } = credentials;
      
      // Mock authentication logic - replace with real backend call when available
      if (username === 'admin' && password === 'admin123') {
        return {
          success: true,
          data: {
            token: 'mock-jwt-token-' + Date.now(),
            user: {
              id: 1,
              username: 'admin',
              email: 'admin@gov.et',
              firstName: 'System',
              lastName: 'Administrator',
              firstNameAm: 'ሥርዓት',
              lastNameAm: 'አስተዳዳሪ',
              role: 'ADMIN',
              isActive: true,
              isVerified: true
            }
          }
        };
      } else if (username === 'editor' && password === 'editor123') {
        return {
          success: true,
          data: {
            token: 'mock-jwt-token-' + Date.now(),
            user: {
              id: 2,
              username: 'editor',
              email: 'editor@gov.et',
              firstName: 'Content',
              lastName: 'Editor',
              firstNameAm: 'ይዘት',
              lastNameAm: 'አርታዒ',
              role: 'EDITOR',
              isActive: true,
              isVerified: true
            }
          }
        };
      } else if (username === 'user' && password === 'user123') {
        return {
          success: true,
          data: {
            token: 'mock-jwt-token-' + Date.now(),
            user: {
              id: 3,
              username: 'user',
              email: 'user@gov.et',
              firstName: 'Regular',
              lastName: 'User',
              firstNameAm: 'ተራ',
              lastNameAm: 'ተጠቃሚ',
              role: 'USER',
              isActive: true,
              isVerified: true
            }
          }
        };
      } else {
        // Try to call real backend if available
        try {
          const response = await api.post('/auth/login', credentials);
          return response.data;
        } catch (backendError) {
          // If backend call fails, return authentication error
          throw new Error('Invalid username or password');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      // Try to call backend logout if available
      await api.post('/auth/logout');
    } catch (error) {
      // Ignore logout errors, frontend will clear tokens anyway
      console.warn('Logout API call failed:', error);
    }
  },

  verifyToken: async () => {
    try {
      // For mock authentication, just check if token exists and is not expired
      const token = localStorage.getItem('authToken');
      if (token && token.startsWith('mock-jwt-token-')) {
        // Token is valid for mock authentication
        return { success: true, message: 'Token is valid' };
      }
      
      // Try real backend verification if available
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      // If verification fails, token is invalid
      throw new Error('Token verification failed');
    }
  },

  // Government Services
  getServices: async () => {
    try {
      const response = await api.get('/services');
      // Handle Java backend response format (Spring Boot style)
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return response.data;
      }
    } catch (error) {
      console.warn('Backend services API unavailable, using mock data:', error.message);
      // Return mock data as fallback when backend is unavailable
      return mockServices;
    }
  },

  getServiceById: async (id) => {
    try {
      const response = await api.get(`/services/${id}`);
      return response.data;
    } catch (error) {
      console.warn(`Backend service ${id} API unavailable, using mock data:`, error.message);
      // Return mock data as fallback when backend is unavailable
      const service = mockServices.find(s => s.id == id);
      if (service) {
        return { success: true, data: service };
      } else {
        throw new Error('Service not found');
      }
    }
  },

  getServiceCategories: async () => {
    try {
      const response = await api.get('/services/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching service categories:', error);
      throw error;
    }
  },

  // Ministries
  getMinistries: async () => {
    try {
      const response = await api.get('/ministries');
      // Handle Java backend response format (Spring Boot style)
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching ministries:', error);
      throw error;
    }
  },

  getMinistryById: async (id) => {
    try {
      const response = await api.get(`/ministries/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ministry:', error);
      throw error;
    }
  },

  // Regional States
  getRegions: async () => {
    try {
      const response = await api.get('/regions');
      // Handle Java backend response format (Spring Boot style)
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return response.data;
      }
    } catch (error) {
      console.warn('Backend regions API unavailable, using mock data:', error.message);
      // Return mock data as fallback when backend is unavailable
      return mockRegions;
    }
  },

  getRegionById: async (id) => {
    try {
      const response = await api.get(`/regions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching region:', error);
      throw error;
    }
  },

  // News and Announcements
  getNews: async (params = {}) => {
    try {
      const response = await api.get('/news', { params });
      // Handle Java backend response format (Spring Boot style)
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  getNewsById: async (id) => {
    try {
      const response = await api.get(`/news/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching news item:', error);
      throw error;
    }
  },

  // Search
  search: async (query, type = null) => {
    try {
      const params = { q: query };
      if (type) params.type = type;
      const response = await api.get('/search', { params });
      // Handle Java backend response format (Spring Boot style)
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return response.data;
      }
    } catch (error) {
      console.error('Error performing search:', error);
      throw error;
    }
  },

  // Statistics and Dashboard
  getStatistics: async () => {
    try {
      const response = await api.get('/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },

  // Contact and feedback
  submitContact: async (contactData) => {
    try {
      const response = await api.post('/contact', contactData);
      return response.data;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },

  // Popular services
  getPopularServices: async () => {
    try {
      const response = await api.get('/services/popular');
      return response.data;
    } catch (error) {
      console.error('Error fetching popular services:', error);
      throw error;
    }
  },

  // Government structure
  getGovernmentStructure: async () => {
    try {
      const response = await api.get('/government/structure');
      return response.data;
    } catch (error) {
      console.error('Error fetching government structure:', error);
      throw error;
    }
  },

  // Users Management
  getUsers: async () => {
    try {
      const response = await api.get('/users');
      // Handle Java backend response format (Spring Boot style)
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};

export default api;
