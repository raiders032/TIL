# 1 Docker Compose

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



# 2 설치

* [레퍼런스](https://docs.docker.com/compose/install/)
* Mac 또는 Window 용 Docker Desktop을 설치했다면 docker-compose도 설치된 상태이다


**Linux**

```bash
# install
$ sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
$ sudo chmod +x /usr/local/bin/docker-compose

# Uninstall
$ sudo rm /usr/local/bin/docker-compose
```

<br>

# 3 Compose file version 3 reference

* [레퍼런스](https://docs.docker.com/compose/compose-file/compose-file-v3/)
* 도커 컴포즈는 컨테이너의 설정이 정의된 컴포즈 파일(YAML)을 읽어 도커 엔진을 통해 컨테이너를 생성한다
* 따라서 도커 컴포즈를 사용하려면 먼저 YAML 파일을 작성해야 한다


## build

* [레퍼런스](https://docs.docker.com/compose/compose-file/build/)
* Dockerfile을 이용해서 이미지를 빌드한다.

**예시**

```yml
# Dockerfile이 있는 context 위치 지정
version: "3.9"
services:
  webapp:
    build: ./dir
```

```yml
# Dockerfile이 있는 context 위치와 Dockerfile의 이름 그리고 빌드시 arguments 전달
version: "3.9"
services:
  webapp:
    build:
      # context: Dockerfile를 포함하고 있는 directory 경로 또는 git repository URL
      context: ./dir
      # Dockerfile의 이름이 Dockerfile이 아니라면 이름 지정
      dockerfile: Dockerfile-alternate
      args:
        buildno: 1
```

```yml
# build와 image를 같이 사용하면 ./dir 컨텍스트의 Dockerfile을 이용해 이미지를 만든다.
# 만들어진 이미지의 이름은 webapp 태그는 tag
build: ./dir
image: webapp:tag
```

<br>

## command

* 컨테이너가 실행될 때 수행할 명령어를 설정
* docker run 명령어에 마지막에 붙는 커맨드와 같다

**예시**
```yml
services:
  webapp:
    image: ubuntu:18.04
    command: [apachectl, -DFOREGROUND]

```


## container_name

* 컨테이너의 이름 지정

```yml
container_name: my-web-container
```


## depends_on
* 특정 컨테이너에 대한 의존 관계를 나타낸다
* 명시한 컨테이너가 먼저 생성되고 이후에 컨테이너가 실행된다


**예시**
* app 컨테이너 생성 전에 mysql 컨테이너가 먼저 생성된다

```yml
version: "3.9"  
services:  
  app:  
    build:  
      context: .  
    depends_on:  
      - mysql  
  mysql:
```


## version
* 도커 컴포즈 파일 포맷의 버전을 나타낸다
* 도커 텀포즈 버전은 도커 엔진 버전의 의존성이 있으므로 가능한 최신 버전을 사용하는 것이 좋다


## services
* 생성될 컨테이너들을 묶어 놓는 단위
* 바로 하위 레벨에 생성된 서비스의 이름을 지정한다

**예시**
* webapp, mysql 두개의 서비스 정의 

```yml
services:
  webapp:
  mysql:
```


## image
* 서비스 컨테이너를 생성할 때 사용할 이미지를 설정한다

```yml
services:
  webapp:
    image: ubuntu:18.04
  mysql:
    image: mysql
```







## env_file

* 파일로 작성된 환경변수를 추가한다.
* `environment`에서 추가된 환경변수보다 우선순위가 낮다.
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


## environment
* docker run의 --env, -e 옵션과 동일한 기능
* 서비스의 컨테이너 내부에서 사용할 환경변수를 지정한다

```yml
sevices:
  web:
    environment:
      MYSQL_DATABASE=homestead
      MYSQL_USER=homestead
      MYSQL_PASSWORD=secret
      MYSQL_ROOT_PASSWORD=secret
```

또는

```yml
sevices:
  web:
    environment:
      MYSQL_DATABASE: homestead
      MYSQL_USER: homestead
      MYSQL_PASSWORD: secret
      MYSQL_ROOT_PASSWORD: secret
```


## networks

* 도커 컴포즈는 생성된 컨테이너를 위해 기본적으로 브리지 타입의 네트워크를 생성한다
	* `[프로젝트이름]_default_` 라는 이름으로 네트워크가 만들어진다


**예시**
```yml
version: "3.9"  
services:  
  app:  
    build:  
      context: .  
    networks:  
      - myshop  
  mysql:  
    image: mysql  
    networks:  
      - myshop  
networks:  
  myshop:
```


## restart

* no : 재시작 안함(기본값)
* always : 항상 재시작
* on-failure : on-failure 에러 코드와 함께 컨테이너가 멈출 때만 재시작
* unless-stopped : 개발자가 임의로 멈추려고 할 때를 제외하고 항상 재시작

```yml
version: "3"
services:
  nginx:
    restart: no
    #restart: always
    #restart: on-failure
    #restart: unless-stopped
    build:
      context: ./nginx
      dockerfile: Dockerfile
```



# 4 Docker Compose CLI

* [레퍼런스](https://docs.docker.com/compose/reference/)

<br>

## docker compose down
* [레퍼런스](https://docs.docker.com/engine/reference/commandline/compose_down/)

```bash
Usage: docker compose down [options]

Options:
    --rmi type              Remove images. Type must be one of:
                              'all': Remove all images used by any service.
                              'local': Remove only images that don't have a
                              custom tag set by the `image` field.
    -v, --volumes           Remove named volumes declared in the `volumes`
                            section of the Compose file and anonymous volumes
                            attached to containers.
    --remove-orphans        Remove containers for services not defined in the
                            Compose file
    -t, --timeout TIMEOUT   Specify a shutdown timeout in seconds.
                            (default: 10)
```


## docker compose up

* [레퍼런스](https://docs.docker.com/engine/reference/commandline/compose_up/)

``` bash
 docker compose up [SERVICE...]
```