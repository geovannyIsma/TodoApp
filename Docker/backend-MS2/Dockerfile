FROM python:3.11-slim-bullseye

# Desactiva bytecode y usa logs sin buffer
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Crea el directorio de trabajo
WORKDIR /app

# Copia solo los requisitos primero para aprovechar cache
COPY Backend-MS2/requirements.txt .

# Mejora comportamiento de pip
RUN pip config --user set global.progress_bar off && \
    pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copia el resto del proyecto
COPY Backend-MS2 /app/

# Expone el puerto
EXPOSE 8001

# Comando por defecto
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
