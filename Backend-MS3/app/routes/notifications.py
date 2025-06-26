from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..db.database import get_db
from ..db.models import Notification, UserNotificationSettings
from ..schemas.notification import (
    NotificationCreate, 
    NotificationUpdate, 
    NotificationResponse, 
    NotificationSettings,
    NotificationSettingsResponse
)
from ..utils.jwt import verify_token
from ..config import settings

router = APIRouter(
    prefix=f"{settings.API_PREFIX}/notifications",
    tags=["notifications"],
)

@router.get("/", response_model=List[NotificationResponse])
def get_notifications(
    user_payload: dict = Depends(verify_token),
    db: Session = Depends(get_db),
    unread_only: bool = False
):
    """Get notifications for the current user"""
    user_id = user_payload.get("user_id")
    query = db.query(Notification).filter(Notification.user_id == user_id)
    
    if unread_only:
        query = query.filter(Notification.read == False)
    
    return query.order_by(Notification.created_at.desc()).all()

@router.get("/{notification_id}", response_model=NotificationResponse)
def get_notification(
    notification_id: int,
    user_payload: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Get a specific notification"""
    user_id = user_payload.get("user_id")
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == user_id
    ).first()
    
    if notification is None:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    return notification

@router.post("/", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
def create_notification(
    notification: NotificationCreate,
    user_payload: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Create a new notification (admin or service use only)"""
    # Ensure the requester can only create notifications for themselves
    user_id = user_payload.get("user_id")
    if notification.user_id != user_id:
        raise HTTPException(status_code=403, detail="Cannot create notifications for other users")
    
    db_notification = Notification(**notification.dict())
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification

@router.patch("/{notification_id}", response_model=NotificationResponse)
def update_notification(
    notification_id: int,
    notification_update: NotificationUpdate,
    user_payload: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Update a notification (mark as read)"""
    user_id = user_payload.get("user_id")
    db_notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == user_id
    ).first()
    
    if db_notification is None:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    # Update only allowed fields
    update_data = notification_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_notification, key, value)
    
    db.commit()
    db.refresh(db_notification)
    return db_notification

@router.get("/settings/me", response_model=NotificationSettingsResponse)
def get_notification_settings(
    user_payload: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Get notification settings for the current user"""
    user_id = user_payload.get("user_id")
    settings = db.query(UserNotificationSettings).filter(
        UserNotificationSettings.user_id == user_id
    ).first()
    
    if settings is None:
        # Create default settings if none exist
        settings = UserNotificationSettings(user_id=user_id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    return settings

@router.put("/settings/me", response_model=NotificationSettingsResponse)
def update_notification_settings(
    settings_update: NotificationSettings,
    user_payload: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Update notification settings for the current user"""
    user_id = user_payload.get("user_id")
    db_settings = db.query(UserNotificationSettings).filter(
        UserNotificationSettings.user_id == user_id
    ).first()
    
    if db_settings is None:
        # Create settings if none exist
        db_settings = UserNotificationSettings(user_id=user_id, **settings_update.dict())
        db.add(db_settings)
    else:
        # Update existing settings
        for key, value in settings_update.dict().items():
            setattr(db_settings, key, value)
    
    db.commit()
    db.refresh(db_settings)
    return db_settings

@router.post("/mark-all-read", status_code=status.HTTP_200_OK)
def mark_all_as_read(
    user_payload: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Mark all notifications as read"""
    user_id = user_payload.get("user_id")
    db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.read == False
    ).update({"read": True})
    
    db.commit()
    return {"message": "All notifications marked as read"}
