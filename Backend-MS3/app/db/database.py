from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Import settings with absolute import to avoid circular imports
import sys
import os
from pathlib import Path

# Add parent directory to path if needed
parent_path = Path(__file__).parent.parent
if parent_path not in sys.path:
    sys.path.append(str(parent_path))

from app.config import settings

# Get database URL from settings
SQLALCHEMY_DATABASE_URL = settings.get_mysql_connection_string()

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True, 
    pool_recycle=3600
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependencia para obtener la sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
