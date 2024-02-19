
# 1 Mongosh 소개

- Mongosh는 MongoDB의 공식 명령줄 인터페이스로, MongoDB 데이터베이스와의 상호작용을 위해 설계된 도구입니다.
- 이는 MongoDB의 이전 명령줄 도구인 `mongo`의 기능을 확장하고 개선한 버전입니다.
- Mongosh는 JavaScript 기반 쉘을 통해 MongoDB 데이터베이스와의 상호작용을 지원합니다. 

<br>

# 2 사용법

## 2.1 MongoDB 데이터베이스 접속

```bash
$ mongosh "mongodb://[username]:[password]@[host]:[port]/[database]?authSource=[auth-db]"
```

- `[username]`: 데이터베이스 사용자 이름
- `[password]`: 해당 사용자의 비밀번호
- `[host]`: MongoDB 서버의 호스트 주소 (예: localhost 또는 IP 주소)
- `[port]`: MongoDB 서비스가 실행 중인 포트 (기본값은 27017)
- `[database]`: 접속하고자 하는 데이터베이스 이름
- `[auth-db]`: 인증에 사용되는 데이터베이스 (예: `admin`)

<br>

## 2.2 DB 선택

**현재 DB 조회**

```bash
$ db
> test
```

- 셸은 시작할 때 몽고DB 서버의 test 데이터베이스에 연결하고 데이터베이스 연결을 전역 변수 `db`에 할당한다.
- 셸에서는 주로 이 변수를 통해 몽고DB에 접근한다.

<br>

**DB 선택**

```bash
$ use video
```

-


# 3 도큐먼트 생성, 갱신 삭제

## 3.1 insertOne

## 3.2 inserMany

## 3.3 deleteOne
## 3.4 deleteMany

## 3.5 drop
## 3.6 updateOne
## 3.7 updateMany
## 3.8 replaceOne