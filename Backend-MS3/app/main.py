from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
from pathlib import Path

# Add parent directory to path if run directly
if __name__ == "__main__":
    sys.path.append(str(Path(__file__).parent.parent))
    from app.routes import notifications
    from app.db.database import Base, engine
    from app.config import settings
else:
    # Use relative imports when imported as a module
    from .routes import notifications
    from .db.database import Base, engine
    from .config import settings

# Create tables in the database
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Notifications API",
    description="API for task notifications and alerts",
    version="0.1.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include notification routes
app.include_router(notifications.router)

@app.get("/")
async def root():
    return {"message": "Notifications API is running. For documentation, visit /docs"}

# Make file runnable directly for testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)
