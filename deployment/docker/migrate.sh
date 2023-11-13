#!/bin/bash

# Check if migrations need to be applied
python manage.py showmigrations --list 2>&1 | grep "\[ \]" > /dev/null

if [ $? -eq 0 ]; then
  echo "Applying migrations..."
  python manage.py migrate
else
  echo "Migrations are up to date."
fi

# Start your application
/bin/bash /run.sh
