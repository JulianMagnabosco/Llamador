# Turnero

Turnero para una clinica

## Python Enviroment

```py -m venv .venv\```

```source .venv/Scripts/activate``` o ```.venv\Scripts\activate```

```pip install -r requirements.txt ```

## Migracion

```python manage.py makemigrations``` o ```python manage.py makemigrations --update```

```python manage.py migrate```

```python manage.py loaddata initdata.json```

## Usuarios

```python manage.py createsuperuser```

## Docker Redis Channel

```docker network create app-network```

```docker run -d -p 6379:6379 --name redis --network app-network redis:7```

## Docker Database

```docker run -d -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=admin postgres```

## Ejecutar

```python manage.py runserver 3000```

## Dockerfile

```docker images -a | grep "julianm217/turnero-back" | awk '{print $1":"$2}' | xargs docker rmi ```

```docker build --no-cache -t julianm217/turnero-back .```

```docker run --rm -p 3000:3000 --env-file .env --network app-network  --name back julianm217/turnero-back:latest```