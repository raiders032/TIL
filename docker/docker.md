## 도커

> 컨테이너를 사용하여 응용 프로그램을 더 쉽게 만들고 배포하고 실행할 수 있도록 설계된 도구 이며 컨테이너 기반의 오픈소스 가상화 플랫폼이며 생태계 입니다.

___

## 도커와 기존 가상화 기술

공통점

* 도커 컨테이너와 가상 머신은 기본 하드웨어에서 격리된 한경 내에 애플리케이션을 배치하는 방법입니다.

차이점

* 격리된 환경을 얼마나 격리 시킬 것인가.

도커

* 하이퍼 바이저와 게스트 OS가 필요하지 않으므로 더 가볍다.
* 어플리케이션을 실행할 때 호스트 OS위에 어플리케이션의 실행 패키지인 이미지를 배포하기만 하면 된다.
* 즉, 공유, re-building이 쉽다.
* 같은 호스트의 다른 컨테이너와 동일한 커널을 공유한다.
* 디스크 공간을 적게 차지한다.

VM 

* 어플리케이션을 실행 하기 위해서 VM을 띄우고 자원을 할당한 다음, 게스트 OS를 부팅하여 어플리케이션을 실행한다
* 가상머신을 추가할 때마다 가상 OS 또한 추가되므로 많은 자원이 낭비된다.(CPU, 메모리 등)
* 공유, re-building이 가능하지만 복잡하다.
* VM 내부에서 실행되는 모든 것은 호스트 운영체제와 하이퍼 바이저와 독립되어 있다.
* 디스크 공간을 많이 차지한다.

___



## 컨테이너

> 컨테이너 안에 다양한 프로그램, 실행환경을 컨테이너로 추상화하고 동일한 인터페이스를 제공하여 프로그램의 배포 및 관리를 단순하게 해줍니다.
>
> 코드와 모든 종속성을 패키지화하여 응용 프로그램이 한 컴퓨팅 환경에서 다른 켬퓨팅 환경으로 빠르고 안정적으로 실행되도록 하는 소프트웨어 표준 단위이다.
>
> * 이미지의 인스턴스

### 왜 컨테이너를 쓸까?

1. 개발환경과 프로덕션 환경이 다른 경우

>  개발환경과 프로덕션 환경이 다른경우 예를 들면 nodejs 애플리케이션을 만들고 await을 사용 했을 때 개발환경에선 문제가 없었다. 그러나 프로덕션 환경에서 실행 했을 때 문제가 발생했다. 이유는 노드 버전 14.3이상 에서만 await을 사용할 수 있었고 개발 환경에 노드 버전이 낮아 오류가 났다. 이런 상황에서 컨테이너를 사용했으면 완전히 동일한 환경에서 실행되기 때문에 문제가 없었을 것이다.

2. 팀 내에서 개발 환경이 다른 경우

> 모든 팀 구성원들이 정확히 같은 환경에서 개발을 하기위해 필요하다.

3. 프로젝트간 버전 충돌을 막기 위해

> 예를 들면 한 프로젝트는 파이썬2 를 사용하고 다른 프로젝트는 최신 버전의 파이썬을 사용한다고 했을 때 버전 충돌이 일어날 것이다. 따라서 프로젝트를 할 때 마다 잘못된 버전을 지우고 알맞은 버전을 설치하는 일을 반복해야한다.



___



### 컨테이너 생명주기

* 생성
  * docker create
  * 파일 스냅샷을 하드 디스크로 옮긴다.
* 시작
  * docker start
  * 실행 될 명령어를 컨테이너에 넣고 실행한다.
* 실행
  * docker run =  docker create + docker start
* 중지
  * docker stop
    * 하던 작업들을 완료하고 컨테이너를 중지 시킨다.
  * docker kill
    * 즉시 컨테이너를 중지 시킨다.
* 삭제
  * docker rm
  * 모든 컨테이너 삭제 `docker rm docker ps -a -q'`



___



## 이미지

> 코드, 런타임, 시스템 도구, 시스템 라이브러리 및 설정과 같은 응용 프로그램을 실행하는데 필요한 모든 것을 포함하는 가볍고 독립적이며 실행 가능한 소프트웨어 패키지입니다.  컨테이너 이미지는 런타임에 컨테이너가 되고 도커 컨테이너의 경우 도커 엔진에서 실행될 때 이미지가 컨테이너가 된다.
>
> * 이미지는 응용 프로그램을 실행하는데 필요한 모든 것을 포함하고 있습니다.
> * 이미지는 시작시 실행 될 명령어와 파일 스냅샷을 가지고 있다.

### 이미지 레이어

* 이미지는 여러개의 레이어로 구성되어 있다.
* Dokcerfile 하나 하나의 인스트럭션이 하나의 레이어가 된다.
* 이미지의 레이어는 읽기전용이다.
* 이미지를 재빌드할 때 변화가 없는 레이어는 캐시된 데이터를 사용
  * 한 레이어의 변화가 있을 경우 그 이후 레이어는 다시 빌드를 하게 된다.

### ![image-20201117215748040](docker.png) 

### 이미지 생성 흐름

1. dockerfile
2. docker client 
3. docker server
4. 이미지 생성

### 베이스 이미지

* 도커 이미지는 여러개의 레이어로 구성되어있다.
* 베이스 이미지는 이 이미지의 기반이 되는 부분이다.
* 베이스 이미지에서 다른 종속성이나 새로운 커맨드를 추가 할때는 임시 컨테이너를 만들 후 그 컨테이너를 토대로 새로운 이미지를 만들고 임시 컨테이너를 지운다. 

### 도커 허브에 이미지 업로드

* 도커 허브에서 리포지토리를 생성한다.

```shell
docker tag node-example neptunes032/node-example
docker login
docker push neptunes032/node-example
```



___



## Dockerfile

>  docker image를 만들기 위한 설정파일입니다. 컨테이너가 어떻게 행동해야하는지 설정들을 정의합니다.

**FROM**

* 베이스 이미지를 지정한다.

* 이미지 생성시 기반이 되는 이미지 레이어.

**WORKDIR**

* 작업 디렉토리를 지정한다.
* 해당 디렉토리가 없으면 새로 생성한다.
* 작업 디렉토리를 지정하면 그 이후 명령어는 해당 디렉토리를 기준으로 동작한다.
  * `RUN`, `CMD`, `ENTRYPOINT`, `COPY`, `ADD`
* 이미지안에서 어플리케이션 소스 코드를 가지고있는 디렉토리를 생성합니다.

**USER**

* docker container를 실행할 user를 지정해준다.

**COPY**

* 파일이나 폴더를 이미지에 복사한다.

* 로컬에서 도커 컨테이너로 복사한다.

* <dest> 는 절대경로 또는 `WORKDIR` 으로부터 상대경로이다.

  * ```dockerfile
    #<WORKDIR>/relativeDir/ 로 복사된다.
    COPY test.txt relativeDir/
    ```
  
* `.dockerignore`를 사용해 카피 대상에서 제외할 수 있다.
  
  

**VOLUME**

* Anonymous  Volume을 지정할 수 있다.

**ARG**

* `docker build` 로 이미지를 빌드할 때 설정 할 수 있는 옵션을 지정해준다.
* dockerfile 안에서만 사용 가능
* `CMD` 나 애플리케이션 코드에서 사용 불가
* `docker build --build-arg` 사용

**ENV**

* Docker file 과 애플리케이션 코드에서 사용 가능
* `docker run --env` 또는 `docker run -e` 사용

**RUN**

* 도커 이미지가 생성되기 전에 수행할 쉘 명령어

* 추가적으로 필요한 파일 다운 받기 위한 명령어 명시

* 2가지 형태 가능

  * ```
    RUN <command> (shell form, the command is run in a shell, which by default is /bin/sh -c on Linux or cmd /S /C on Windows)
    RUN ["executable", "param1", "param2"] (exec form)
    ```

**EXPOSE**

* docker container 외부에 노출할 포트를 지정한다.
* 실제로 포트를 개방하는건 아니다.
  * `docker run -p 3000:3000 node` 와 같이 -p 옵션으로 포트를 열어줘야한다.

**ENV**

* 환경변수를 지정한다.
* 지정한 환경변수는 `$변수이름` 또는 `${변수이름}`으로 사용한다.
* 다음과 같이 -e 옵션으로 덮어씌울 수 있다.
  * `docker run -e FOO='/something-else' test `

**CMD**

* 컨테이너가 시작되었을 때 실행할 실행 파일 또는 쉘 스크립트

* Dockerfile 파일 내에서 1번만 정의가 가능합니다.

  * 여러개 정의 할 경우 마지막만 인식

* Overwrite 가능

  * 예) `docker run node npm init` npm init으로 CMD를 Overwrite할 수 있다.

* 3가지 형태 가능

  * ```
    CMD ["executable","param1","param2"] (exec form, this is the preferred form)
    CMD ["param1","param2"] (as default parameters to ENTRYPOINT)
    CMD command param1 param2 (shell form)
    ```

**ENTRYPOINT**

* 컨테이너가 시작되었을 때  실행할 실행 파일 또는 쉘 스크립트
* Dockerfile 파일 내에서 1번만 정의가 가능합니다.
* Overwrite 불가능
  * 예 ) `docker run node init` init이 **ENTRYPOINT** 뒤에 붙어서 실행된다.

예시

```dockerfile
FROM node:alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./
CMD ["npm", "run", "build"]

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
```

```dockerfile
# mysql 이미지를 사용 기본 설정을 변경하는 경우
FROM mysql:5.7

ADD ./my.cnf /etc/mysql/conf.d/my.cnf
```

```dockerfile
#nginx 이미지를 사용 기본 설정을 적용하는 경우
FROM nginx

COPY ./default.conf /etc/nginx/conf.d/default.conf
```

```dockerfile
FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

ENV MONGODB_USERNAME=root
ENV MONGODB_PASSWORD=secret

CMD ["npm", "start"]
```





___



## 볼륨

> 쉽게 말하면 로컬 머신의 폴더이다. 볼륨은 이미지와 컨테이너 안에 있는 것이 아니고 호스트 머신에 존재한다.
>
> 볼륨은 호스트 머신에 존재하고 이를 컨테이너가 사용하거나 매핑시킨 것이다. 
>
> 한 곳의 변화는 다른 한 곳에 반영된다.
>
> 즉, 로컬 머신에 파일을. 추가하면 컨테이너 안에서 그 폴더를 접급할 수 있고
>
> 컨테이너 안에서 폴더를 추가하면 로컬 머신에서도 접근이 가능하다.

* 컨테이너를 지워도 볼륨은 사라지지 않는다
  
  * 데이터 영속화가 가능하다.
* 컨테이너는 불룜의 데이터를 읽고 쓸 수 있다.

### Anonymous  Volume

* ## `docker run -v /app/data`

* Dockerfile에서 사용 가능

* 하나의 컨테이너의 종속적이다.

  * 컨테이너를 삭제하면 자동으로 삭제된다.

  * 컨테이너간 공유 할 수 없다.

* 매핑시킬  로컬 머신의 경로를 지정할 수 없다.

  * 호스트 머신의 경로는 도커가 관리한다.

* 데이터 영속화에 사용 할 수 없음

### Named Volume

* `docker run -v data:/app/data`
* Dokcerfile에서 사용 불가
* 한 컨테이너의 종속적이지 않다.
  * 컨테이너를 삭제해도 볼륨은 삭제되자 않는다.
  * 컨테이너간 공유 가능
* 호스트 머신의 경로는 도커가 관리한다.
* 데이터 영속화에 사용 할 수 있음

  * 수정이 필요없는 데이터를 영속화 할 때 사용

### Bind Mounts

* `docker run -v /path/to/code:/app/data`
* Dokcerfile에서 사용 불가
* 한 컨테이너의 종속적이지 않다.
  * 컨테이너를 삭제해도 볼륨은 삭제되지 않는다.
  * 컨테이너간 공유 가능
* 호스트 머신의 경로를 개발자가 직접 설정한다.
  * 호스트 머신의 경로는 절대경로를 사용한다.
* 데이터 영속화에 사용 할 수 있음
  * 수정이 필요한 데이터를 영속화 할 때 사용한다.
* 개발 단계에서 유용하다.
  * **개발 단계**에서 컨테이너는 실행환경을 캡슐화 해야하지만 코드는 필수가 아니다.
  * 이미지를 다시 빌드할 필요없이 컨테이너에 최신 코드를 반영할 수 있다.
  * **프로덕션 단계**에선 컨테이너는 독립적으로 동작해야된다. 따라서 Bind Mounts를 사용하지 않는다.
    * 대신 `dockerfile`에서 `COPY` 인스트럭션을 사용한다. 

___

## 네트워크

### 요청의 종류

1. 컨테이너에서 WWW로
   * 특별한 설정 없이 가능
2. 컨테이너에서 호스트 머신으로
   * 컨테이너에서 호스트를 나타내는 특별한 도메인인 `host.docker.internal` 사용한다.
     * 도커에 의해 호스트의 ip address로 변환된다
3. 컨테이너에서 다른 컨테이너로
   * 같은 도커 네트워크에 있다면 컨테이너의 이름을 도메인으로 사용한다.
     * 도커에 의해 컨테이너의 ip address로 변환된다.

### 도커 네트워크

생성하기

* `docker network create networkname `
  * 별도의 설정 필요없이 이름만 지정하면 된다.

목록 조회하기

* `docker network ls`

컨테이너 네트워크 상에서 컨테이너 실행하기

* `docker run -d --name mongoldb --network app-net mongo`
  * 네트워크를 자동으로 생성해주지 않기 때문에 먼저 만들고 사용해야 한다. 

___



## 도커 사용 흐름

1. 도커 클라이언트에 커맨드를 입력한다.
2. 도커 서버에 컨테이너를 위한 이미지가 캐쉬 되어 있는지 확인
3. 없으면 도커 허브에서 다운받는다
4. 캐쉬되어 있으면 그 이미지로 컨테이너를 생성한다.
5. 이미지의 파일 스냅샷을 하드 디스크에 올린다.
6. 이미지의 시작 커맨드를 이용하여 어플리케이션을 실행한다.



___



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



### volumes

* 컨테이너를 지우면 컨테이너에 저장된 데이터들이 지워진다. 따라서 영속성이 필요한 데이터는 volume을 설정해 준다.
* 도커 컨테이너를 삭제해도 volume을 지정했다면 데이터들은 호스트 파일 시스템에 남아있다.

>1. 이미지로 컨테이너를 생성
>2. 이미지는 컨테이너 생성후 읽기 전용
>3. 컨테이너 안에서의 변화
>4. 변화된 데이터를 컨테이너 안에 저장
>5. 컨테이너 삭제시 컨테이너 안에 저장된 데이터도 함께 삭제된다.

## 도커 설치

* 우분투 기준

```shell
#Uninstall old versions
sudo apt-get remove docker docker-engine docker.io containerd runc

#SET UP THE REPOSITORY
sudo apt-get update
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common

#Add Docker’s official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
   
#INSTALL DOCKER ENGINE
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io

#To run Docker without root privileges
sudo usermod -aG docker $USER
```