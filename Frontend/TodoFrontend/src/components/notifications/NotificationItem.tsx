import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import type { Notification } from '../../types/notification';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const { markAsRead } = useNotifications();
  
  const handleClick = () => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };
  
  // Calculate time ago
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
    
    return 'just now';
  };
  
  const linkUrl = notification.task_id 
    ? `/tasks/${notification.task_id}` 
    : '/notifications';

  return (
    <Link 
      to={linkUrl} 
      className={`block px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
        !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 mr-2">
          <h4 className={`text-sm font-medium ${!notification.read ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-white'}`}>
            {notification.title}
          </h4>
          <p className="text-xs mt-1 text-gray-600 dark:text-gray-300">
            {notification.message}
          </p>
        </div>
        {!notification.read && (
          <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
        )}
      </div>
      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {timeAgo(notification.created_at)}
      </div>
    </Link>
  );
};

export default NotificationItem;
