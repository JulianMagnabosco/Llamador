# Turnero

Turnero para una clinica

## Requisitos

- Docker

## Requisitos Totem

- Git
- Node.s

## Docker Compose

``` docker images -a | grep "julianm217/turnero" | awk '{print $1":"$2}' | xargs docker rmi ```

``` docker compose build ```

``` docker compose up -d --no-build ```

## Test Compose

``` docker compose -f ./test-docker-compose.yml up -d ```

## migracion DB

```docker exec -it back python manage.py makemigrations``` o ```docker exec -it back python manage.py makemigrations --update```

```docker exec -it back python manage.py migrate```

```docker exec -it back python manage.py loaddata initdata.json```

## Entrar
- Normal: http://direccion:4200/
- Display: http://direccion:4200/display
  - Limitar a lineas: http://direccion:4200/display?lines=C,S
  - Excluir lineas: http://direccion:4200/display?notlines=C,S