FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Bibliothèques nécessaires pour compiler mysqlclient
RUN apt-get update && apt-get install -y --no-install-recommends \
        gcc pkg-config libmariadb-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# Applique les migrations Django puis lance gunicorn
CMD ["sh", "-c", "python manage.py migrate && gunicorn --access-logfile - --workers 3 --bind 0.0.0.0:8000 Starvice.wsgi:application"]
