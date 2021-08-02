## docker compose

> 다중 컨테이너 도커 애플리케이션을 정의하고 실행하기 위한 도구입니다.
>
> 멀티 컨테이너 상황에서 쉽게 네트워크를 연결 시켜주기 위해서 `dokcer compose`를 이용한다.

* 하나의 호스트에서 다중 컨테이너를 다룰 때 용이하다.
* dockerfile과 함께 사용된다.
* 다중 컨테이너를 실행하기 위해 각각 build, run 과정을 해야했지만 docker compose를 이용하면  명령어 하나로 수행할 수 있다. 
* 도커 컴포즈에 명시된 서비스들은 하나의 디폴트 네트워크로 자동으로 묶인다.

```shell
#이미지를 빌드하기만 하며, 컨테이너를 시작하지는 않는다
docker-compose build

#이미지가 존재하지 않을경우에만 빌드하며, 컨테이너를 시작한다.
docker-compose up

#필요치 않을때도 강제로 이미지를 빌드하며, 컨테이너를 시작한다.
docker-compose up --build

#이미지 빌드 없이 컨테이너를 시작한다. 이미지가 없으면 실패한다.
docker-compose up --no-build

#docker compose로 실행시킨 컨테이너를 종료후 삭제한다 또한 디폴트 네트워크도 삭제한다.
dokcer-compose down
Stopping frontend ... done
Stopping backend  ... done
Stopping mongodb  ... done
Removing frontend ... done
Removing backend  ... done
Removing mongodb  ... done
Removing network compose-01-starting-setup_default

#하나의 서비스를 실행시키는 명령어
docker-compose run servicename command
```

예시

```yml
version: "3.8"
services:
	#서비스 이름
  mongodb:
    #컨테이너 이름
    container_name: mongodb
    image: "mongo"
    volumes:
      - data:/data/db
    env_file:
      - ./env/mongo.env
  backend:
    container_name: backend
    build:
      context: ./backend
      dockerfile: Dockerfile
    volumes:
      - logs:/app/logs
      - ./backend:/app
      - /app/node_modules
    ports:
      - "80:80"
    env_file:
      - ./env/backend.env
    depends_on:
      - mongodb
  frontend:
    container_name: frontend
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend/src:/app/src
    stdin_open: true
    tty: true
    depends_on:
      - backend
#named volume 명시
volumes:
  data:
  logs:
```

**build**

* 

**env_file**

* 파일로 작성된 환경변수를 추가한다.
* `environment` 에서 추가된 환경변수보다 우선순위가 낮다.
* 경로는 docker-compose의 상대경로

```yml
env_file:
  - ./a.env
  - ./apps/b.env
```

```
# a.env
VAR=1

# b.env
VAR=hello

# mysql.env 
MYSQL_DATABASE=homestead
MYSQL_USER=homestead
MYSQL_PASSWORD=secret
MYSQL_ROOT_PASSWORD=secret
```



### restart

* no : 재시작 안함

* always : 항상 재시작

* on-failure : on-failure 에러 코드와 함께 컨테이너가 멈출 때만 재시작

* unless-stopped : 개발자가 임의로 멈추려고 할 때를 제외하고 항상 재시작

* ```yml
  version: "3"
  services:
    nginx:
      restart: always
      build:
        context: ./nginx
        dockerfile: Dockerfile
  ```

