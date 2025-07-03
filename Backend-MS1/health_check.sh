#!/bin/bash

# Wait for database to be ready
echo "Checking database connection..."
python -c "
import sys
import time
import psycopg2

# Maximum number of attempts
max_attempts = 30
attempt = 0

# Database connection parameters
params = {
    'dbname': '$DATABASE_NAME',
    'user': '$DATABASE_USER',
    'password': '$DATABASE_PASSWORD',
    'host': '$DATABASE_HOST',
    'port': '$DATABASE_PORT'
}

while attempt < max_attempts:
    try:
        print(f'Attempt {attempt + 1}/{max_attempts} to connect to PostgreSQL...')
        conn = psycopg2.connect(**params)
        conn.close()
        print('Database connection successful!')
        sys.exit(0)
    except psycopg2.OperationalError as e:
        print(f'Connection failed: {e}')
        attempt += 1
        time.sleep(5)

print('Could not connect to database after several attempts')
sys.exit(1)
"

# Exit with the same code as the Python script
exit $?
