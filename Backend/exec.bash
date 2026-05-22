#!/bin/bash

echo "1. Creando entorno"
if [ -d .venv ] ; then
    source .venv/Scripts/activate
    echo "Entorno Ya Creado"
else
    python -m venv .venv/
    source .venv/Scripts/activate
    pip install -r requirements.txt 
    echo "Entorno Creado"
fi

echo "2. Creando DB"
docker run -d --rm -p 6379:6379 redis:7

echo "3. Ejecutando Django"
python manage.py migrate
python manage.py runserver 3000
