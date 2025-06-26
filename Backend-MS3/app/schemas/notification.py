from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class NotificationBase(BaseModel):
    title: str
    message: str
    task_id: Optional[int] = None

class NotificationCreate(NotificationBase):
    user_id: int
    scheduled_for: Optional[datetime] = None

class NotificationUpdate(BaseModel):
    read: Optional[bool] = None
    sent: Optional[bool] = None

class NotificationResponse(NotificationBase):
    id: int
    user_id: int
    read: bool
    sent: bool
    created_at: datetime
    scheduled_for: Optional[datetime] = None

    class Config:
        from_attributes = True

class NotificationSettings(BaseModel):
    email_notifications: bool = True
    task_reminders: bool = True
    reminder_time: int = 24  # Hours before deadline
    daily_digest: bool = False

class NotificationSettingsResponse(NotificationSettings):
    id: int
    user_id: int

    class Config:
        from_attributes = True
