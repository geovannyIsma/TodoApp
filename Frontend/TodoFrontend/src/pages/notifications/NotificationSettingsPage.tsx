import { useState, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import type { NotificationSettingsUpdate } from '../../types/notification';

const NotificationSettingsPage = () => {
  const { settings, updateSettings } = useNotifications();
  
  const [formData, setFormData] = useState<NotificationSettingsUpdate>({
    email_notifications: true,
    task_reminders: true,
    reminder_time: 24,
    daily_digest: false
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  
  // Load current settings
  useEffect(() => {
    if (settings) {
      setFormData({
        email_notifications: settings.email_notifications,
        task_reminders: settings.task_reminders,
        reminder_time: settings.reminder_time,
        daily_digest: settings.daily_digest
      });
    }
  }, [settings]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      await updateSettings(formData);
      setSaveMessage('Settings updated successfully!');
      setTimeout(() => setSaveMessage(null), 5000);
    } catch (error) {
      setSaveMessage('Failed to update settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (!settings) {
    return <div className="text-center py-8">Loading settings...</div>;
  }
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="mb-6">
        <a href="/tasks" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          &larr; Back to Dashboard
        </a>
      </div>
      
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Notification Settings
      </h1>
      
      {saveMessage && (
        <div className={`mb-4 p-3 rounded ${
          saveMessage.includes('successfully') 
            ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200' 
            : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'
        }`}>
          {saveMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="email_notifications"
                checked={formData.email_notifications}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 dark:text-blue-500 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                Receive email notifications
              </span>
            </label>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 ml-7">
              Get important notifications sent to your email address.
            </p>
          </div>
          
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="task_reminders"
                checked={formData.task_reminders}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 dark:text-blue-500 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                Task reminders
              </span>
            </label>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 ml-7">
              Receive reminders about upcoming tasks.
            </p>
            
            {formData.task_reminders && (
              <div className="mt-3 ml-7">
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Remind me before deadline:
                </label>
                <select
                  name="reminder_time"
                  value={formData.reminder_time}
                  onChange={handleChange}
                  className="mt-1 block px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-white"
                >
                  <option value={1}>1 hour before</option>
                  <option value={3}>3 hours before</option>
                  <option value={6}>6 hours before</option>
                  <option value={12}>12 hours before</option>
                  <option value={24}>1 day before</option>
                  <option value={48}>2 days before</option>
                </select>
              </div>
            )}
          </div>
          
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="daily_digest"
                checked={formData.daily_digest}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 dark:text-blue-500 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                Daily digest
              </span>
            </label>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 ml-7">
              Receive a daily summary of your tasks and upcoming deadlines.
            </p>
          </div>
        </div>
        
        <div className="mt-8">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationSettingsPage;
