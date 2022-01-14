# 1 MongoDB with docker-compose

**docker-compose.yml**

```yml
version: '3.1'
services:
  mongo:
    image: mongo
    container_name: mongodb
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: tmax
      MONGO_INITDB_ROOT_PASSWORD: 1234
      MONGO_INITDB_DATABASE: ra-db
    ports:
      - 27017:27017
    volumes:
      - ./mongo-data:/data/db
      - ./init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js:ro

```

**Init-mongo.js**

```javascript
db.createUser({ user: "tmax", pwd: "1234", roles: [{ role: "readWrite", db: "ra-db" }] });
```

```bash
docker-compose up --build -d
docker exec -it mongodb bash

mongo -u tmax 
```

