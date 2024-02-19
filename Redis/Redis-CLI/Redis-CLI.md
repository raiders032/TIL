# 1 Redis CLI


```bash
redis-cli
```

- 기본적으로 redis-cli는 로컬호스트(127.0.0.1)의 6379 포트에서 실행 중인 Redis 서버에 접속합니다.

<br>


```
redis-cli -h <hostname> -p <port>
```

- 다른 호스트나 포트에서 실행 중인 Redis 서버에 접속하려면, 호스트와 포트를 명시해야 합니다.