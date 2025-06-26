export interface Notification {
  id: number;
  title: string;
  message: string;
  task_id: number | null;
  user_id: number;
  read: boolean;
  sent: boolean;
  created_at: string;
  scheduled_for: string | null;
}

export interface NotificationSettings {
  id: number;
  user_id: number;
  email_notifications: boolean;
  task_reminders: boolean;
  reminder_time: number;
  daily_digest: boolean;
}

export interface NotificationSettingsUpdate {
  email_notifications?: boolean;
  task_reminders?: boolean;
  reminder_time?: number;
  daily_digest?: boolean;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings | null;
  loading: boolean;
  error: string | null;
}
