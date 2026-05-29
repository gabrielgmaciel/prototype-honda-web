# Prototype Honda

Sistema completo de gerenciamento e análise de propostas Honda (Esse projeto é apenas para fins de estudo!).

O projeto é composto por:

* API principal (`prototype-honda-api`)
* Frontend (`prototype-honda-web`)
* API de cotações (`prototype-honda-quotation-api`)
* MongoDB

# Autor

Gabriel Maciel

---

# Tecnologias

## Backend

* Java 26
* Spring Boot 4
* MongoDB
* Mongock
* Maven

## Frontend

* React
* Vite
* TypeScript
* CSS Modules
* Recharts

## Infraestrutura

* Docker
* Docker Compose
* Podman
* Nginx

---

# Estrutura dos projetos

```text
workspace/
├── prototype-honda-api/
├── prototype-honda-web/
├── prototype-honda-quotation-api/
└── docker-compose.yml
```

---

# Repositórios

## API Principal

* https://github.com/gabrielgmaciel/prototype-honda-api

## Frontend

* https://github.com/gabrielgmaciel/prototype-honda-web

## API de Cotações

* https://github.com/gabrielgmaciel/prototype-honda-quotation-api

---

# Banco de Dados

MongoDB utilizado:

```text
mongodb://admin:senha123@localhost:27017/honda?authSource=admin
```

---

# Docker Compose

Crie o arquivo:

```text
docker-compose.yml
```

na raiz do workspace.

## docker-compose.yml

```yaml
services:

  mongo:
    image: mongo:8
    container_name: prototype-honda-mongo

    restart: always

    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: senha123
      MONGO_INITDB_DATABASE: honda

    ports:
      - "27017:27017"

    volumes:
      - mongo_data:/data/db

  prototype-honda-api:
    build:
      context: ./prototype-honda-api
      dockerfile: Dockerfile

    container_name: prototype-honda-api

    restart: always

    depends_on:
      - mongo

    environment:
      SPRING_DATA_MONGODB_URI: mongodb://admin:senha123@mongo:27017/honda?authSource=admin
      SERVER_PORT: 8080

    ports:
      - "8080:8080"

  prototype-honda-quotation-api:
    build:
      context: ./prototype-honda-quotation-api
      dockerfile: Dockerfile

    container_name: prototype-honda-quotation-api

    restart: always

    depends_on:
      - mongo

    environment:
      SPRING_DATA_MONGODB_URI: mongodb://admin:senha123@mongo:27017/honda?authSource=admin
      SERVER_PORT: 8081

    ports:
      - "8081:8081"

  prototype-honda-web:
    build:
      context: ./prototype-honda-web
      dockerfile: Dockerfile

    container_name: prototype-honda-web

    restart: always

    depends_on:
      - prototype-honda-api
      - prototype-honda-quotation-api

    ports:
      - "5173:80"

volumes:
  mongo_data:
```

---

# Dockerfile - API Principal

Arquivo:

```text
prototype-honda-api/Dockerfile
```

```dockerfile
FROM eclipse-temurin:26-jdk AS build

WORKDIR /app

COPY . .

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:26-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

# Dockerfile - API Quotations

Arquivo:

```text
prototype-honda-quotation-api/Dockerfile
```

```dockerfile
FROM eclipse-temurin:26-jdk AS build

WORKDIR /app

COPY . .

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:26-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

# Dockerfile - Frontend

Arquivo:

```text
prototype-honda-web/Dockerfile
```

```dockerfile
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

# Nginx Config (Opcional)

Arquivo:

```text
prototype-honda-web/nginx.conf
```

```nginx
server {

    listen 80;

    server_name localhost;

    root /usr/share/nginx/html;

    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Caso utilize:

```dockerfile
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html
```

---

# application.properties

## API Principal

```properties
spring.data.mongodb.uri=${SPRING_DATA_MONGODB_URI}
server.port=${SERVER_PORT:8080}
```

---

## API Quotations

```properties
spring.data.mongodb.uri=${SPRING_DATA_MONGODB_URI}
server.port=${SERVER_PORT:8081}
```

---

# Executando com Docker

```bash
docker compose up --build
```

---

# Executando com Podman

```bash
podman compose up --build
```

ou:

```bash
podman-compose up --build
```

---

# URLs

## Frontend

```text
http://localhost:5173
```

## API Principal

```text
http://localhost:8080
```

## API Quotations

```text
http://localhost:8081
```

## MongoDB

```text
mongodb://admin:senha123@localhost:27017/honda?authSource=admin
```

---

# Build individual

## API Principal

```bash
docker build -t prototype-honda-api .
```

## Frontend

```bash
docker build -t prototype-honda-web .
```

---

# .dockerignore

Crie em todos os projetos:

```text
node_modules

dist

build

target

.idea

.git
```

---

# Parar containers

```bash
docker compose down
```

ou:

```bash
podman compose down
```

---

# Observações

## Spring Boot 4 + Java 26

O projeto utiliza:

* Java 26
* Spring Boot 4
* Maven Wrapper

As imagens Docker utilizadas:

```text
eclipse-temurin:26-jdk
eclipse-temurin:26-jre
```

já possuem suporte completo.

---

