# 1.Dockerfile

>  Dockerfile이란 docker image를 만들기 위한 설정파일입니다. 컨테이너가 어떻게 행동해야하는지 설정들을 정의할 수 있다. 완성된 이미지를 생성하기위해 컨테이너에 설치해야 하는 패키지, 추가해야 하는 소스코드, 실행해야 하는 명령어와 쉘 스크립트 등을 하나의 Dockerfile에 기록하면 도커는 이 파일을 읽고 컨테이너에서 작업을 수행하고 이를 이미지로 만들어 낸다

* Dockerfile을 이용하면 직접 컨테이너를 생성하고 필요한 작업을 마친 뒤 이미지로 커밋하는 과정을 자동화할 수 있다

> 빌드 컨텍스트
>
> 이미지 생성을 위해 필요한 각종 파일, 소스코드, 메타데이터를 담고 있는 디렉토리를 뜻하며 Dockerfile이 위치한 디렉토리가 빌드 컨텍스트가 된다

# 2. Instruction

## [FROM](https://docs.docker.com/engine/reference/builder/#from)

* 베이스 이미지를 지정한다.
* 이미지 생성시 기반이 되는 이미지 레이어
* 반드시 한번이상 입력해야 한다



## [USER](https://docs.docker.com/engine/reference/builder/#user)

* docker container를 실행할 user를 지정해준다.
* 루트 권한이 필요하지 않다면 USER를 사용하는 것이 좋다

> 기본적으로 컨테이너 내부에서 루트 사용자를 사용하도록 설정된다. 이는 컨테이너가 호스트의 루트 권한을 가질 수 있다는 것을 의미한다. 이는 보안 측면에서 좋지않다. 예를 들면 루트가 소유한 호스트의 디렉토리를 컨테이너에 공유했을 때, 컨테이너 내부에서 공유된 루트 소유의 디렉토리를 마음대로 조작할 수 있다 때문에 최종 배포시에는 컨테이너 내부에 새로운 사용자를 만들어 사용하는 것이 좋다



## [WORKDIR](https://docs.docker.com/engine/reference/builder/#workdir)

* 작업 디렉토리를 지정한다.
* 해당 디렉토리가 없으면 새로 생성한다.
* 작업 디렉토리를 지정하면 그 이후 명령어는 해당 디렉토리를 기준으로 동작한다.
  * `RUN`, `CMD`, `ENTRYPOINT`, `COPY`, `ADD`



## [ADD](https://docs.docker.com/engine/reference/builder/#add)

* 파일을 이미지에 추가한다
* 추가하는 파일은 Dockerfile이 위치한 디렉터리인 컨텍스트에서 가져온다\
* COPY와 달리 외부 url 및 tar 파일에서도 파일을 추가할 수 있다.
  * tar 파일을 추가하면 tar 파일을 자동으로 해제해서 추가한다.
* 가급적 COPY를 사용하는 것이 좋다
  * url이나 tar를 추가할 경우 정확히 어떤 파일이 추가되는지 알 수 없다

```dockerfile
# “hom” 으로 시작하는 모든 파일을 이미지에 추가한다
ADD hom* /mydir/
# 상대경로 이미지의 <WORKDIR>/relativeDir/로 test.txt 파일을 추가
ADD test.txt relativeDir/
# 절대경로 이미지의 /absoluteDir/ 경로로 test.txt 파일을 추가
ADD test.txt /absoluteDir/
```



## [COPY](https://docs.docker.com/engine/reference/builder/#copy)

* 파일이나 폴더를 이미지에 복사한다.

* 로컬에서 도커 컨테이너로 복사한다.

* <dest> 는 절대경로 또는 `WORKDIR` 으로부터 상대경로이다.

  * ```dockerfile
    #<WORKDIR>/relativeDir/ 로 복사된다.
    COPY test.txt relativeDir/
    ```

* `.dockerignore`를 사용해 카피 대상에서 제외할 수 있다.

  

## [VOLUME](https://docs.docker.com/engine/reference/builder/#volume)

* Anonymous  Volume을 지정할 수 있다.
* 컨테이너 생성 시 호스트와 공유할 컨테이너 내부의 디렉토리를 설정한다



## [ARG](https://docs.docker.com/engine/reference/builder/#arg)

* `docker build` 로 이미지를 빌드할 때 설정 할 수 있는 옵션을 지정해준다.
* dockerfile 안에서만 사용 가능
* `CMD` 나 애플리케이션 코드에서 사용 불가

```bash
# dockerfile 내부에서 사용할 ARG로 user=what_user를 설정
docker build --build-arg user=what_user .
```



## [ENV](https://docs.docker.com/engine/reference/builder/#env)

* 환경변수를 지정한다.
* Dockerfile 과 애플리케이션 코드에서 사용 가능
* 지정한 환경변수는 `$변수이름` 또는 `${변수이름}`으로 사용한다.
* 다음과 같이 -e 옵션으로 기존 값을 덮어씌울 수 있다.
  * `docker run -e FOO='/something-else' test `



## [RUN](https://docs.docker.com/engine/reference/builder/#run)

* 도커 이미지가 생성되기 전에 수행할 쉘 명령어

* 추가적으로 필요한 파일 다운 받기 위한 명령어 명시

* 2가지 형태 가능

  * ```
    RUN <command> (shell form, the command is run in a shell, which by default is /bin/sh -c on Linux or cmd /S /C on Windows)
    RUN ["executable", "param1", "param2"] (exec form)
    ```



## [EXPOSE](https://docs.docker.com/engine/reference/builder/#expose)

* docker container 외부에 노출할 포트를 지정한다.
* 실제로 포트를 개방하는건 아니다.
  * `docker run -p 3000:3000 node` 와 같이 -p 옵션으로 포트를 열어줘야한다.



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



## **ENTRYPOINT**

* 컨테이너가 시작되었을 때  실행할 실행 파일 또는 쉘 스크립트
* Dockerfile 파일 내에서 1번만 정의가 가능합니다.
* Overwrite 불가능
  * 예 ) `docker run node init` init이 **ENTRYPOINT** 뒤에 붙어서 실행된다.

# 3. `.dockerignore`

* dockerfile 빌드시 `.dockerignore` 파일에 명시된 파일을 컨텍스트에서 제거한다
* `.dockerignore`의 위치는 컨텍스트 취상위 즉, build 명령어에서 dockerfile이 위치한 경로와 같아야한다.

# 4. Multi Stage Docker Build

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



# 5. 예시

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

