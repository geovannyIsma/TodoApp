import os
from typing import Optional
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Database settings
    DATABASE_URL: Optional[str] = None
    
    # API config
    API_PREFIX: str = "/api"
    
    # MS2 Authentication service URL
    AUTH_SERVICE_URL: str = os.getenv("AUTH_SERVICE_URL", "http://backend_ms2_users:8001")
    
    # MS1 Tasks service URL
    TASKS_SERVICE_URL: str = os.getenv("TASKS_SERVICE_URL", "http://backend_ms1_tasks:8000")
    
    # JWT token from auth service
    MS2_SECRET_KEY: str = os.getenv("MS2_SECRET_KEY", "iRz6KyZZr2bjEsv9hcSW6ePpaZj-8LO9-cmYBFhAdQk")
    
    # MySQL Database Configuration
    MYSQL_USER: str = os.getenv("MYSQL_USER", "msuser")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD", "mspassword")
    MYSQL_HOST: str = os.getenv("MYSQL_HOST", "db_ms3")
    MYSQL_PORT: str = os.getenv("MYSQL_PORT", "3306")
    MYSQL_DB: str = os.getenv("MYSQL_DB", "notifications_db")
    
    # Email settings (would be used in production)
    SMTP_SERVER: str = os.getenv("SMTP_SERVER", "smtp.example.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME: str = os.getenv("SMTP_USERNAME", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    EMAIL_FROM: str = os.getenv("EMAIL_FROM", "notifications@todoapp.com")
    
    def get_mysql_connection_string(self) -> str:
        # If DATABASE_URL is explicitly set, use it
        if self.DATABASE_URL:
            return self.DATABASE_URL
        
        # Otherwise build MySQL connection string
        return f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DB}"
    
    class Config:
        env_file = ".env"

settings = Settings()
