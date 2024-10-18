# wait_for_db.sh
#!/bin/bash
# This script waits for the PostgreSQL database to be ready

echo "Waiting for the database to be ready..."

until pg_isready -h "$DATABASE_HOST" -p "$DATABASE_HOST" -U "$POSTGRES_USER"; do
  echo "Database is not ready yet. Waiting..."
  sleep 2
done

echo "Database is ready!"
