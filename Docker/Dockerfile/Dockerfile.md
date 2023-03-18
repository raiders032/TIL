# 1 Dockerfile

* Dockerfile이란 docker image를 만들기 위한 설정파일이다
* 완성된 이미지를 생성하기위해 컨테이너에 설치해야 하는 패키지, 추가해야 하는 소스코드, 실행해야 하는 명령어와 쉘 스크립트 등을 하나의 Dockerfile에 기록하면 도커는 이 파일을 읽고 컨테이너에서 작업을 수행하고 이를 이미지로 만들어 낸다
* Dockerfile을 이용하면 직접 컨테이너를 생성하고 필요한 작업을 마친 뒤 이미지로 커밋하는 과정을 자동화할 수 있다
* 이미지 자체를 도커 허브 등을 통해 배포하는 대신 이미지를 생성하는 방법을 기록해 놓은 Dockerfile을 배포할 수 있다



# 2 Instruction

- 명령어는 소문자로 표기해도 상관은 없지만 일반적으로 대문자로 표기한다.
- Dokcerfile의 명령어는 위에서 아래로 한 줄씩 차례대로 실행된다.



## [FROM](https://docs.docker.com/engine/reference/builder/#from)

* 베이스 이미지를 지정한다.
* 이미지 생성시 기반이 되는 이미지 레이어
* 반드시 한번이상 입력해야 한다
* 사용하려는 이미지가 없다면 자동으로 pull한다.



## [RUN](https://docs.docker.com/engine/reference/builder/#run)

* 도커 이미지가 생성되기 전에 수행할 쉘 명령어

* 추가적으로 필요한 파일 다운 받기 위한 명령어 명시

* 2가지 형태 가능

  * ```
    RUN <command> (shell form, the command is run in a shell, which by default is /bin/sh -c on Linux or cmd /S /C on Windows)
    RUN ["executable", "param1", "param2"] (exec form)
    ```



## [CMD](https://docs.docker.com/engine/reference/builder/#cmd)

* 컨테이너가 시작되었을 때 실행할 실행 파일 또는 쉘 스크립트
* Dockerfile 파일 내에서 1번만 정의가 가능합니다.

  * 여러개 정의 할 경우 마지막만 인식
* Overwrite 가능

  * 예) `docker run node npm init` npm init으로 CMD를 Overwrite할 수 있다.
* 3가지 형태 가능

```
CMD ["executable","param1","param2"] (exec form, this is the preferred form)
CMD ["param1","param2"] (as default parameters to ENTRYPOINT)
CMD command param1 param2 (shell form)
```



**CMD의 올바른 사용법**

- `CMD`의 올바른 사용 방법은 명령어를 `ENTRYPOINT`로 지정하고 기본 인자를 정의하는 경우에만 CMD를 사용해야 한다.
- 그러면 아무런 인자를 지정하지 않고 이미지를 실행할 수 있다.



## [LABEL](https://docs.docker.com/engine/reference/builder/#label)

- 이미지에 메타데이터를 추가합니다.
- 메타데이터는 키와 밸류 의 쌍 형태로 저장된다
- 여러개의 메타데이터를 추가할 수 있다
- Docker inspect 명령어로 메타데이터를 확인할 수 있다.
- `docker images --filter "label=purpose=practice"`
  - 해당 명령어를 통해 라벨의 키와 밸류가 각각 purpose, practice인 이미지만 필터링할 수 있다.



## [EXPOSE](https://docs.docker.com/engine/reference/builder/#expose)

* docker container 외부에 노출할 포트를 지정한다.
* 실제로 포트를 개방하는건 아니다.
  * `docker run -p 3000:3000 node` 와 같이 -p 옵션으로 포트를 열어줘야한다.



## [ENV](https://docs.docker.com/engine/reference/builder/#env)

* 환경변수를 지정한다.
* Dockerfile 과 애플리케이션 코드에서 사용 가능
* 지정한 환경변수는 `$변수이름` 또는 `${변수이름}`으로 사용한다.
* 다음과 같이 -e 옵션으로 기존 값을 덮어씌울 수 있다.
  * `docker run -e FOO='/something-else' test `



**예시**

```dockerfile
ENV MY_NAME="John Doe"
ENV MY_DOG=Rex\ The\ Dog
ENV MY_CAT=fluffy
```



## [ADD](https://docs.docker.com/engine/reference/builder/#add)

* 파일을 이미지에 추가한다
* 추가하는 파일은 Dockerfile이 위치한 디렉터리인 빌드 컨텍스트에서 가져온다
* COPY와 달리 외부 url 및 tar 파일에서도 파일을 추가할 수 있다.
  * tar 파일을 추가하면 tar 파일을 자동으로 해제해서 추가한다.
* 가급적 COPY를 사용하는 것이 좋다
  * url이나 tar를 추가할 경우 정확히 어떤 파일이 추가되는지 알 수 없다
  * 그에 비해 COPY는 컨텍스트로부터 파일을 직접 추가하기 때문에 빌드 시점에 어떤 파일이 추가될지 명확히 알 수 있다.



**예시**

```dockerfile
# “hom” 으로 시작하는 모든 파일을 이미지에 추가한다
ADD hom* /mydir/
# 상대경로 이미지의 <WORKDIR>/relativeDir/로 test.txt 파일을 추가
ADD test.txt relativeDir/
# 절대경로 이미지의 /absoluteDir/ 경로로 test.txt 파일을 추가
ADD test.txt /absoluteDir/
```



> **빌드 컨텍스트**
>
> 이미지 생성을 위해 필요한 각종 파일, 소스코드, 메타데이터를 담고 있는 디렉토리를 뜻하며 Dockerfile이 위치한 디렉토리가 빌드 컨텍스트가 된다



## [COPY](https://docs.docker.com/engine/reference/builder/#copy)

**forms**

```bash
COPY [--chown=<user>:<group>] <src>... <dest>
COPY [--chown=<user>:<group>] ["<src>",... "<dest>"]
```

* `<src>`의 로컬의 파일 또는 디렉토리를 컨테이너의 파일 시스템 `<dest>` 경로에 복사한다.
* 여러개의 `<src>` 를 명시할 수 있으며 빌드 컨텍스트로부터 상대 경로다
* `<dest>` 는 절대경로 또는 `WORKDIR`으로부터 상대경로이다.
* `.dockerignore`를 사용해 카피 대상에서 제외할 수 있다.



> **빌드 컨텍스트**
>
> 이미지 생성을 위해 필요한 각종 파일, 소스코드, 메타데이터를 담고 있는 디렉토리를 뜻하며 Dockerfile이 위치한 디렉토리가 빌드 컨텍스트가 된다




## [VOLUME](https://docs.docker.com/engine/reference/builder/#volume)

* Anonymous  Volume을 지정할 수 있다.
* 컨테이너 생성 시 호스트와 공유할 컨테이너 내부의 디렉토리를 설정한다
* 표기 법으로 JSON 배열 방식과 plain 문자열 방식이 있다.
  * JSON 배열 방식: `VOLUME ["/myvol", "/var/db"]`
  * 플레인 문자열 방식: `VOLUME /myvol /var/db` 




**예시**

- 플레인 문자열 방식 예시

```dockerfile
FROM ubuntu
RUN mkdir /myvol
RUN echo "hello world" > /myvol/greeting
VOLUME /myvol /var/db
```



## [USER](https://docs.docker.com/engine/reference/builder/#user)

* docker container를 실행할 user를 지정해준다.
* 루트 권한이 필요하지 않다면 USER를 사용하는 것이 좋다
* 일반적으로 RUN 명령어로 사용자의 그룹과 계정을 생성한 뒤 사용한다.

> 기본적으로 컨테이너 내부에서 루트 사용자를 사용하도록 설정된다. 이는 컨테이너가 호스트의 루트 권한을 가질 수 있다는 것을 의미한다. 이는 보안 측면에서 좋지않다. 예를 들면 루트가 소유한 호스트의 디렉토리를 컨테이너에 공유했을 때, 컨테이너 내부에서 공유된 루트 소유의 디렉토리를 마음대로 조작할 수 있다 때문에 최종 배포시에는 컨테이너 내부에 새로운 사용자를 만들어 사용하는 것이 좋다



**예시**

```dockerfile
RUN groupadd -r author && useradd -r -g author nys
USER nys
```



## [WORKDIR](https://docs.docker.com/engine/reference/builder/#workdir)

* 작업 디렉토리를 지정한다.
  * 셸에서 cd 명령어를 입력하는 것과 같은 기능을 한다.

* 해당 디렉토리가 없으면 새로 생성한다.
* 작업 디렉토리를 지정하면 그 이후 명령어는 해당 디렉토리를 기준으로 동작한다.
  * `RUN`, `CMD`, `ENTRYPOINT`, `COPY`, `ADD`



## [ARG](https://docs.docker.com/engine/reference/builder/#arg)

* Dockerfile 내에서 사용될 변수 값을 설정한다.
* `ARG <name>[=<default value>]` 형태로 지정
* default 값을 설정하면 빌드시 argument를 전달받지 못했을 때 default 값을 사용한다.
* `docker build --build-arg <varname>=<value>`명령으로 Dockerfile에서 사용할 argument를 설정한다.
  * 사용자가 도커 파일에 정의되지 않은 빌드 argument를 지정하면 빌드가 경고를 출력한다

* argument는 Dockerfile 안에서만 사용 가능
  * `CMD` 나 애플리케이션 코드에서 사용 불가



**예시**

- `user1`, `buildno`, `gitcommithash`라는 변수를 설정

```dockerfile
FROM busybox

ARG user1=someuser
ARG buildno
ARG gitcommithash

RUN echo "USER number: $user1"
RUN echo "Build number: $buildno"
RUN echo "Based on commit: $gitcommithash"
```

```bash
# dockerfile 내부에서 사용할 ARG로 user1=what_user를 설정
docker build --build-arg user1=what_user .
```



## **ENTRYPOINT**

* 컨테이너가 시작되었을 때  실행할 실행 파일 또는 쉘 스크립트
* Dockerfile 파일 내에서 1번만 정의가 가능합니다.
* ENTRYPOINT와 CMD는 컨테이너가 시작될 때 수행할 명령을 지점한다는 공통점이 있다.
* Overwrite 불가능
  * 예 ) `docker run node init` init이 **ENTRYPOINT** 뒤에 붙어서 실행된다.
* ENTRYPOINT Overwrite가 필요하면 `docker run --entrypoint` 옵션을 사용한다.



**ENTRYPOINT의 올바른 사용법**

- `CMD` 명령어를 사용해 이미지가 실행될 때 실행할 명령어를 지정할 수 있지만 올바른 방법은 `ENTRYPOINT`로 명령어를 지정하고 기본 의자를 정의하려는 경우만 `CMD`를 지정하는 것이다.
- 그러면 아무런 인자를 지정하지 않고 이미지를 실행할 수 있다.



**예시**

- 실행할 명령어인 sleep을 `ENTRYPOINT`로 지정하고 인자를 `CMD`로 지정한다.

- `docker run node 10` -> sleep 10
- `docker run node` -> sleep 5

```dockerfile
FROM Ubuntu

ENTRYPOINT ["sleep"]

CMD ["5"]
```



**shell과 exec 형식 간의 차이점**

- ENTRYPOINT는 shell 형식과 exec 형식 두 가지를 지원한다.
- 두 형식의 차이점은 명령어를 shell로 호출하는지 여부다.
  - shell 형식은 명령어를 shell로 호출하고 exec 형식은 명령어를 직접 실행한다.
- shell 형식 : `ENTRYPOINT node app.js`
- exec 형식 : `ENTRYPOINT ["node",  "app.js"]`

- 컨테이너 내부에서 실행중인 프로세스 목록을 보면 아래와 같다.

```bash
# exec 형식 컨테이너 내부 프로세스 조회
$ docker exec 4567d ps x
PID TTY STAY TIME COMMAND
  1               node app.js
 12               ps x

# shell 형식 컨테이너 내부 프로세스 조회
# 메인 프로세스가 node 프로세스가 아닌 Shell 프로세스다 노드 프로세스는 shell 프로세스에서 시작된다
$ docker exec 4567d ps x
PID TTY STAY TIME COMMAND
  1               /bin/sh -c node app.js
  7               node app.js
 13               ps x
```



# 3 이미지 생성

* Dockerfile을 사용이 이미지를 생성해 보자
* docker build 명령어는 Dockerfile에 기록된 대로 컨테이너를 실행한 뒤 완성된 이미지를 만들어 낸다.
  * Dockerfile에 기록된 명령어를 하나 하나를 스텝이라고 한다.
  * 하나의 스텝마다 이전 스텝에서 만들어진 이미지로 임시 컨테이너를 생성하고 명령어를 적용하고 이를 이미지로 커밋하고 컨테이너는 삭제한다.

* -t 옵션을 사용하지 않으면 16진수 형태의 이름으로 이미지가 만들어지므로 가급적 -t 옵션을 사용하자

```bash
# 현재 디렉토리에 있는 Dockerfile로 이미지를 만들며 이미지의 이름은 -t 옵션으로 지정
docker build -t imagename ./
```



# 4 `.dockerignore`

* dockerfile 빌드시 `.dockerignore` 파일에 명시된 파일을 컨텍스트에서 제거한다
* `.dockerignore`의 위치는 컨텍스트 취상위 즉, build 명령어에서 dockerfile이 위치한 경로와 같아야한다.



# 5 Multi Stage Docker Build

* 하나의 dockerfile안에 여러 개의 FROM이미지를 정의함으로써 빌드 완료 시 최종적으로 생성될 이미지의 크기를 줄일 수 있다
* 멀티 스테이지 빌드는 반드시 필요한 실행 파일만 최종 이미지 결과물에 포함시켜 이미지 크기를 줄일 수 있다



**Multi Stage Docker Build 예시**

```dockerfile
FROM openjdk:11 as build
WORKDIR /workspace/app
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src
RUN chmod +x gradlew
RUN ./gradlew build -x test
RUN mkdir -p build/dependency && (cd build/dependency; jar -xf ../libs/*-SNAPSHOT.jar)

FROM adoptopenjdk/openjdk11:alpine-jre
ARG DEPENDENCY=/workspace/app/build/dependency
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app
EXPOSE 8080
ENTRYPOINT ["java","-cp","app:app/lib/*","com.emailservice.EmailServiceApplication"]
```



# 6 예시

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

