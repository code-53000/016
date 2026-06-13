#!/bin/sh

set -e

echo "Waiting for database..."
python wait_for_db.py

echo "Running migrations..."
python manage.py makemigrations processes materials trials orders
python manage.py migrate

echo "Seeding demo data..."
python manage.py seed_demo

echo "Starting server..."
exec python manage.py runserver 0.0.0.0:8000
