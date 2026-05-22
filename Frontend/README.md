# Turnero

## Run

```bash
ng serve
```
Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.


## Building

```bash
ng build
```
This will compile your project and store the build artifacts in the `dist/` directory. 

## Running unit tests
```bash
ng test
```

```bash
ng e2e
```

## Docker

```docker images -a | grep "julianm217/turnero-front" | awk '{print $1":"$2}' | xargs docker rmi ```

```docker build --no-cache -t julianm217/turnero-front .```

```docker run --rm -p 4200:4200 --network app-network  --name front julianm217/turnero-front:latest```