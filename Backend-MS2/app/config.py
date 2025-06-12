import os
from typing import Optional
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Base de datos
    DATABASE_URL: Optional[str] = None
    
    # Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Aplicación
    API_PREFIX: str = "/api"
    
    # MySQL Database Configuration
    MYSQL_USER: str = os.getenv("MYSQL_USER", "msuser")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD", "mspassword")
    MYSQL_HOST: str = os.getenv("MYSQL_HOST", "db_ms2")
    MYSQL_PORT: str = os.getenv("MYSQL_PORT", "3306")
    MYSQL_DB: str = os.getenv("MYSQL_DB", "users_db")
    
    def get_mysql_connection_string(self) -> str:
        # If DATABASE_URL is explicitly set, use it
        if self.DATABASE_URL:
            return self.DATABASE_URL
        
        # Otherwise build MySQL connection string
        return f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DB}"
    
    class Config:
        env_file = ".env"

settings = Settings()
