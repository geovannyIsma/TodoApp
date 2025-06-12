import axios from 'axios';
import type { User, UserLogin, UserRegister, AuthResponse } from '../types/user';

// Backend-MS2 API URL for auth services
const AUTH_API_URL = 'http://localhost:8001/api/auth';

const authClient = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to authorization header when available
authClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const AuthService = {
  login: async (credentials: UserLogin): Promise<AuthResponse> => {
    // Convert to form data as the API expects form data for login (OAuth2 standard)
    const formData = new FormData();
    formData.append('username', credentials.email);  // OAuth2 uses 'username' even for email
    formData.append('password', credentials.password);
    
    const response = await authClient.post<AuthResponse>('/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Store token in localStorage
    localStorage.setItem('token', response.data.access_token);
    
    return response.data;
  },
  
  register: async (userData: UserRegister): Promise<User> => {
    const response = await authClient.post<User>('/register', userData);
    return response.data;
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await authClient.get<User>('/me');
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
  },
  
  // Verify if the user has a valid token
  checkAuth: async (): Promise<User | null> => {
    try {
      const response = await authClient.get<User>('/me');
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      return null;
    }
  }
};
