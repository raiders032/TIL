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



# 2 Redis keys

* redis 키는 바이너리 세이프하다
  * 바이너리 세이프: 어떠한 바이너리 시퀀스라도 키로 사용이 가능하다는 것을 의미한다.
  * `foo`와 같은 문자열에서 JPEG 파일 내용에 이르기까지 바이너리 시퀀스를 키로 사용할 수 있다 
  * 빈 문자열도 유효한 키다



## 2.1 **규칙**

**키가 아주 긴 것은 좋지 않다.**

* 예를 들어, 1024바이트의 키는 메모리 측면뿐만 아니라 데이터 집합에서 키를 조회하려면 비교 비용이 많이 들어 좋지 않다.

**허용되는 최대 키 크기는 512MB**



# 3 Strings





참고

* https://redis.io/topics/data-types-intro#strings