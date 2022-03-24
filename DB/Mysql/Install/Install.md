# 1 Docker로 실행



**필수 환경변수**

* `MYSQL_ROOT_PASSWORD`: root 유저의 비밀번호

**옵션 환경변수**

* `MYSQL_DATABASE`: 컨테이너 실행시 자동으로 만들어 질 데이터베이스의 이름
  * 아래서 환경 변수로 정의한 새로운 유저는 해당 데이터베이스의 모든 권한을 갖는다
* `MYSQL_USER`: 새로운 유저의 ID
* `MYSQL_PASSWORD`: 새로운 유저의 비밀번호



> 환경 변수 참고
>
> https://hub.docker.com/_/mysql



**예시**

```bash
docker run \
--name mysql \
-e MYSQL_ROOT_PASSWORD=1234 \
-e MYSQL_DATABASE=pay \
-e MYSQL_USER=tmax \
-e MYSQL_PASSWORD=1234 \
-d \
--rm \
-p 3306:3306 \
mysql:latest
```



# 2 docker-compose 이용

```yml
version: '3.3'
services:
  db:
    image: mysql
    restart: always
    container_name: money
    environment:
        - MYSQL_DATABASE=money
        - MYSQL_ROOT_PASSWORD=1234
        - TZ=Asia/Seoul
        - MYSQL_USER=tmax
        - MYSQL_PASSWORD=1234
    command:
        - --character-set-server=utf8mb4
        - --collation-server=utf8mb4_unicode_ci
    volumes:
        - data:/var/lib/mysql
    ports:
      - 3306:3306
volumes:
  data:
```

```bash
$ docker-compose up -d
$ docker exec -it mysql-db /bin/bash 
$ mysql -u root -p

ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password by '1234';
FLUSH PRIVILEGES;
```

