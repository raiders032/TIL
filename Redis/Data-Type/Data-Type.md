# 1 Redis data

* 다음은 Redis에서 지원하는 모든 데이터 구조 목록이다.



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

<br>

# 2 Redis keys

* redis 키는 바이너리 세이프하다
	* 바이너리 세이프: 어떠한 바이너리 시퀀스라도 키로 사용이 가능하다는 것을 의미한다.
	* `foo`와 같은 문자열에서 JPEG 파일 내용에 이르기까지 바이너리 시퀀스를 키로 사용할 수 있다 
	* 빈 문자열도 유효한 키다

<br>

## 2.1 규칙

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

<br>

# 3 Strings

## 3.1 commands


### 3.1.1 APPEND

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

- Redis의 리스트는 간단한 문자열들의 집합으로, 삽입 순서를 유지합니다. 
- 리스트는 양방향으로, 즉 리스트의 앞이나 뒤에서 요소를 추가하거나 제거할 수 있습니다.
	- 이를 통해 스택이나 큐와 같은 데이터 구조를 구현할 수 있습니다.

<br>

## 4.1 Commands

- [레퍼런스](https://redis.io/commands/?group=list)

<br>

### 4.1.1 LPUSH

- 지정된 모든 값을 key의 리스트의 시작 부분에 삽입합니다.

<br>

**Syntax**

```bash
LPUSH key value [value ...]
```


**Examples**

```bash
redis> LPUSH mylist "world"
(integer) 1
redis> LPUSH mylist "hello"
(integer) 2
redis> LRANGE mylist 0 -1
1) "hello"
2) "world"
```

<br>

### 4.1.2 RPUSH

- 지정된 모든 값을 key의 리스트의 끝 부분에 삽입합니다.

<br>

**Syntax**

```bash
RPUSH key value [value ...]
```

**Examples**

```bash
redis> RPUSH mylist "hello"
(integer) 1
redis> RPUSH mylist "world"
(integer) 2
redis> LRANGE mylist 0 -1
1) "hello"
2) "world"

```

<br>

### 4.1.3 LPOP

- 리스트의 첫 번째 요소를 제거하고 그 요소를 반환합니다.

<br>

**Syntax**

```bash
LPOP key
```

**Examples**

```bash
redis> RPUSH mylist "one"
(integer) 1
redis> RPUSH mylist "two"
(integer) 2
redis> RPUSH mylist "three"
(integer) 3
redis> LPOP mylist
"one"
redis> LRANGE mylist 0 -1
1) "two"
2) "three"

```

<br>

### 4.1.4 RPOP

- 리스트의 마지막 요소를 제거하고 그 요소를 반환합니다.

<br>

**Syntax**

```bash
RPOP key
```

**Examples**

```bash
redis> RPUSH mylist "one"
(integer) 1
redis> RPUSH mylist "two"
(integer) 2
redis> RPUSH mylist "three"
(integer) 3
redis> RPOP mylist
"three"
redis> LRANGE mylist 0 -1
1) "one"
2) "two"
```

<br>

# 5 Sets

- Redis의 세트는 문자열의 집합으로, 중복을 허용하지 않습니다. 
- 세트는 주로 멤버십 테스트, 중복 항목 추가 시도, 멤버 간의 연산(교집합, 합집합, 차집합) 등에 사용됩니다.

<br>

## 5.1 Commands

- [레퍼런스](https://redis.io/commands/?group=set)


### 5.1.1 SADD

- 하나 이상의 멤버를 세트에 추가합니다.


**Syntax**

```bash
SADD key member [member ...]
```

**Examples**

```bash
redis> SADD myset "Hello"
(integer) 1
redis> SADD myset "World"
(integer) 1
redis> SMEMBERS myset
1) "Hello"
2) "World"
```

<br>

### 5.1.2 SREM

- 세트에서 하나 이상의 멤버를 제거합니다.

<br>

**Syntax**

```bash
SREM key member [member ...]
```

**Examples**

```bash
redis> SADD myset "one"
(integer) 1
redis> SADD myset "two"
(integer) 1
redis> SADD myset "three"
(integer) 1
redis> SREM myset "one"
(integer) 1
redis> SMEMBERS myset
1) "two"
2) "three"
```

<br>

### 5.1.3 SMEMBERS

- 세트의 모든 멤버를 반환합니다.


**Syntax**

```bash
SMEMBERS key
```

**Examples**

```bash
redis> SADD myset "Hello"
(integer) 1
redis> SADD myset "World"
(integer) 1
redis> SMEMBERS myset
1) "Hello"
2) "World"
```

<br>

# 6 Sorted Sets

- Redis의 Sorted Sets는 중복을 허용하지 않는 문자열 멤버의 집합이며, 각 멤버는 부동 소수점 수인 점수를 가지고 있어 정렬된 순서로 저장됩니다. 
- 이를 통해 순위나 범위 검색 등을 효율적으로 수행할 수 있습니다.

<br>

## 6.1 Commands

### 6.1.1 ZADD

- 하나 이상의 멤버를 점수와 함께 Sorted Set에 추가합니다.
- [레퍼런스](https://redis.io/commands/zadd/)

<br>

**Syntax**

```bash
ZADD key score member [score member ...]
```

**Examples**

bashCopy code

```bash
redis> ZADD myzset 1 "one"
(integer) 1
redis> ZADD myzset 2 "two"
(integer) 1
redis> ZRANGE myzset 0 -1 WITHSCORES
1) "one"
2) "1"
3) "two"
4) "2"
```

<br>

### 6.1.2 ZREM

- Sorted Set에서 하나 이상의 멤버를 제거합니다.

<br>

**Syntax**

```bash
ZREM key member [member ...]
```

**Examples**

```bash
redis> ZADD myzset 1 "one"
(integer) 1
redis> ZADD myzset 2 "two"
(integer) 1
redis> ZREM myzset "one"
(integer) 1
redis> ZRANGE myzset 0 -1 WITHSCORES
1) "two"
2) "2"

```

<br>

### 6.1.3 ZRANGE

- 점수가 저장된 순서대로 Sorted Set의 범위에 있는 멤버를 반환합니다.

<br>

**Syntax**

```bash
ZRANGE key start stop [WITHSCORES]
```

**Examples**

```bash
redis> ZADD myzset 1 "one"
(integer) 1
redis> ZADD myzset 2 "two"
(integer) 1
redis> ZADD myzset 3 "three"
(integer) 1
redis> ZRANGE myzset 0 -1 WITHSCORES
1) "one"
2) "1"
3) "two"
4) "2"
5) "three"
6) "3"
```



참고

* https://redis.io/topics/data-types-intro#strings