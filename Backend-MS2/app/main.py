from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Fix imports to work both as a module and when run directly
import sys
import os
from pathlib import Path

# Add parent directory to path if run directly
if __name__ == "__main__":
    sys.path.append(str(Path(__file__).parent.parent))
    from app.routes import auth
    from app.db.database import Base, engine
    from app.config import settings
else:
    # Use relative imports when imported as a module
    from .routes import auth
    from .db.database import Base, engine
    from .config import settings

# Crear tablas en la base de datos
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Users API",
    description="API para gestión de usuarios y autenticación",
    version="0.1.0"
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar los orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir las rutas de autenticación
app.include_router(auth.router)

@app.get("/")
async def root():
    return {"message": "API de usuarios funcionando correctamente. Para documentación, visita /docs"}


# Add this to make the file runnable directly for testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
