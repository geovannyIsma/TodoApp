FROM python:3.11

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install dependencies
COPY Backend-MS3/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project
COPY Backend-MS3 /app/

# Expose port
EXPOSE 8002

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8002"]
