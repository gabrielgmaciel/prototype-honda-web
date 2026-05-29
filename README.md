# Setup Automático - Prototype Honda
(Esse projeto é apenas para fins de estudo!)

# Autor
Gabriel Maciel

Sistema completo com:

* MongoDB
* API Principal
* API Quotations
* Frontend React

Tudo iniciado automaticamente via Docker ou Podman.

---

# Estrutura necessária

Você precisará apenas de:

```text
workspace/
└── docker-compose.yml
```

---

# docker-compose.yml

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
      context: .
      dockerfile: Dockerfile.api

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
      context: .
      dockerfile: Dockerfile.quotation

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
      context: .
      dockerfile: Dockerfile.web

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

# Dockerfile.api

```dockerfile
FROM eclipse-temurin:26-jdk

WORKDIR /app

RUN apt-get update && apt-get install -y git

RUN git clone https://github.com/gabrielgmaciel/prototype-honda-api.git .

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "target/prototype-honda-api-0.0.1-SNAPSHOT.jar"]
```

---

# Dockerfile.quotation

```dockerfile
FROM eclipse-temurin:26-jdk

WORKDIR /app

RUN apt-get update && apt-get install -y git

RUN git clone https://github.com/gabrielgmaciel/prototype-honda-quotation-api.git .

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "target/prototype-honda-quotation-api-0.0.1-SNAPSHOT.jar"]
```

---

# Dockerfile.web

```dockerfile
FROM node:22-alpine AS build

WORKDIR /app

RUN apk add --no-cache git

RUN git clone https://github.com/gabrielgmaciel/prototype-honda-web.git .

RUN npm install

RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

# Como executar

## Docker

```bash
docker compose up --build
```

---

## Podman

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

---

# Vantagens desse setup

* Não precisa clonar nada manualmente
* Tudo sobe automaticamente
* Ambiente 100% reproduzível
* Funciona em Docker e Podman
* Ideal para demonstrações e portfólio
* Fácil onboarding
* Setup com apenas 1 comando

---

# Observações

## Java

O projeto utiliza:

* Java 26
* Spring Boot 4

Imagem utilizada:

```text
eclipse-temurin:26-jdk
```

---

# Banco Mongo

```text
mongodb://admin:senha123@localhost:27017/honda?authSource=admin
```
