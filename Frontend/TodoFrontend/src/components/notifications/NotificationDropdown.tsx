import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import NotificationItem from './NotificationItem';

interface NotificationDropdownProps {
  show: boolean;
  onClose: () => void;
}

const NotificationDropdown = ({ show, onClose }: NotificationDropdownProps) => {
  const { notifications, unreadCount, loading, markAllAsRead } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-10 max-h-96 overflow-y-auto"
    >
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Notifications</h3>
        {unreadCount > 0 && (
          <button 
            onClick={() => markAllAsRead()}
            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Mark all as read
          </button>
        )}
      </div>
      
      {loading ? (
        <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
          Loading notifications...
        </div>
      ) : notifications.length > 0 ? (
        <div>
          {notifications.map(notification => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      ) : (
        <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
          No notifications
        </div>
      )}
      
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
        <Link 
          to="/notifications/settings" 
          className="block text-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          onClick={onClose}
        >
          Notification Settings
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;
