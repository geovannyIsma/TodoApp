import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { NotificationService } from '../services/notificationApi';
import { useAuth } from './AuthContext';
import type { NotificationSettingsUpdate, NotificationState } from '../types/notification';

interface NotificationContextType extends NotificationState {
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  updateSettings: (settings: NotificationSettingsUpdate) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
    settings: null,
    loading: false,
    error: null,
  });

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const notifications = await NotificationService.getAllNotifications();
      const unreadCount = notifications.filter(n => !n.read).length;
      
      setState(prev => ({
        ...prev,
        notifications,
        unreadCount,
        loading: false,
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch notifications',
        loading: false,
      }));
    }
  };

  const fetchSettings = async () => {
    if (!isAuthenticated) return;
    
    try {
      const settings = await NotificationService.getSettings();
      setState(prev => ({ ...prev, settings }));
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await NotificationService.markAsRead(id);
      
      setState(prev => {
        const updatedNotifications = prev.notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        );
        
        const unreadCount = updatedNotifications.filter(n => !n.read).length;
        
        return {
          ...prev,
          notifications: updatedNotifications,
          unreadCount,
        };
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const updateSettings = async (settingsUpdate: NotificationSettingsUpdate) => {
    try {
      const updatedSettings = await NotificationService.updateSettings(settingsUpdate);
      
      setState(prev => ({
        ...prev,
        settings: updatedSettings,
      }));
    } catch (error) {
      console.error('Error updating notification settings:', error);
    }
  };

  // Initial fetch of notifications and settings when the user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      fetchSettings();
    } else {
      // Reset state when user logs out
      setState({
        notifications: [],
        unreadCount: 0,
        settings: null,
        loading: false,
        error: null,
      });
    }
  }, [isAuthenticated]);

  // Set up polling for new notifications (every 30 seconds)
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <NotificationContext.Provider
      value={{
        ...state,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        updateSettings,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
