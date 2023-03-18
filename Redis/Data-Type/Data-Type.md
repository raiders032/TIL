# 1 Redis data

* 다음은 Redis에서 지원하는 모든 데이터 구조 목록입니다.



**데이터 구조 목록**

* Binary-safe strings
* Lists
* Sets
* Sorted sets
* Hashes
* Bit arrays (or simply bitmaps)
* HyperLogLogs
* Streams



> 참고
>
> - https://redis.io/docs/data-types/



# 2 Redis keys

* redis 키는 바이너리 세이프하다
  * 바이너리 세이프: 어떠한 바이너리 시퀀스라도 키로 사용이 가능하다는 것을 의미한다.
  * `foo`와 같은 문자열에서 JPEG 파일 내용에 이르기까지 바이너리 시퀀스를 키로 사용할 수 있다 
  * 빈 문자열도 유효한 키다



## 2.1 **규칙**

**키가 아주 긴 것은 좋지 않다.**

* 예를 들어, 1024바이트의 키는 메모리 측면뿐만 아니라 데이터 집합에서 키를 조회하려면 비교 비용이 많이 들어 좋지 않다.



**허용되는 최대 키 크기는 512MB**



**가독성을 생각하자**

- `u1000flw` 보다는 `user:1000:followers`가 좋다.
- 키가 길어져 메모리를 더 사용하는 것은 사실이지만 값과 비교하면 마이너한 수준이다.



**스키마를 지키자**

- `object-type:id`과 같은 스키마를 지키는 것은 좋은 생각이다.
- 멀티 워드에 경우  `.` 또는 `-` 로 연결한다.
  - `comment:4321:reply.to` 또는 `comment:4321:reply-to`



# 3 Strings





## 3.1 commands



### 3.1.1 **APPEND**

- key가 이미 존재하고 value가 문자열이면 아래 커먼드의  `value` 를 문자열 끝에 붙인다.
- 만약  key가 존재하지 않으면 만들고 value로 빈 문자열로 설정한다.
- [레퍼런스](https://redis.io/commands/append/)



**Syntax**

```bash
APPEND key value
```



**Examples**

```bash
redis> EXISTS mykey
(integer) 0
redis> APPEND mykey "Hello"
(integer) 5
redis> APPEND mykey " World"
(integer) 11
redis> GET mykey
"Hello World"
```



### 3.1.2 GET

- key와 쌍이되는 value를 가져온다.
- key가 존재하지 않으면 `nil` 이 반환된다.
- [레퍼런스](https://redis.io/commands/get/)



**Syntax**

```bash
GET key
```



**Examples**

```
redis> GET nonexisting
(nil)
redis> SET mykey "Hello"
"OK"
redis> GET mykey
"Hello"
```



### 3.1.3 SET

- key와 쌍이되는 value의 값을 지정한다.
- 만약 이미 값을 가지고 있는 경우 값의 타입과 관계없이 값을 덮어쓴다
- [레퍼런스](https://redis.io/commands/set/)



**Syntax**

```bash
SET key value [NX | XX] [GET] [EX seconds | PX milliseconds |
  EXAT unix-time-seconds | PXAT unix-time-milliseconds | KEEPTTL]
```



**Examples**

```
redis> SET mykey "Hello"
"OK"
redis> GET mykey
"Hello"
redis> SET anotherkey "will expire in a minute" EX 60
"OK"
```



# 4 List



참고

* https://redis.io/topics/data-types-intro#strings