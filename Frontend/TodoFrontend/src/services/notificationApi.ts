import axios from 'axios';
import type { 
  Notification, 
  NotificationSettings,
  NotificationSettingsUpdate
} from '../types/notification';

// Notifications API URL
const NOTIFICATIONS_API_URL = '/api/notifications';

const notificationClient = axios.create({
  baseURL: NOTIFICATIONS_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to authorization header when available
notificationClient.interceptors.request.use(
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

export const NotificationService = {
  getAllNotifications: async (): Promise<Notification[]> => {
    const response = await notificationClient.get<Notification[]>('/');
    return response.data;
  },

  getUnreadNotifications: async (): Promise<Notification[]> => {
    const response = await notificationClient.get<Notification[]>('/?unread_only=true');
    return response.data;
  },
  
  getNotification: async (id: number): Promise<Notification> => {
    const response = await notificationClient.get<Notification>(`/${id}`);
    return response.data;
  },
  
  markAsRead: async (id: number): Promise<Notification> => {
    const response = await notificationClient.patch<Notification>(`/${id}`, { read: true });
    return response.data;
  },
  
  markAllAsRead: async (): Promise<void> => {
    await notificationClient.post('/mark-all-read');
  },
  
  getSettings: async (): Promise<NotificationSettings> => {
    const response = await notificationClient.get<NotificationSettings>('/settings/me');
    return response.data;
  },
  
  updateSettings: async (settings: NotificationSettingsUpdate): Promise<NotificationSettings> => {
    const response = await notificationClient.put<NotificationSettings>('/settings/me', settings);
    return response.data;
  }
};
