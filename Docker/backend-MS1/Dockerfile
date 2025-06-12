FROM python:3.13

# Establecer variables de entorno
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Establecer directorio de trabajo
WORKDIR /app

# Instalar dependencias
COPY Backend-MS1/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el proyecto
COPY Backend-MS1 /app/Backend-MS1/

# Puerto que expone el contenedor
EXPOSE 8000

# Comando para ejecutar el servidor de desarrollo
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "todo.wsgi:application", "--chdir", "Backend-MS1/todo"]
