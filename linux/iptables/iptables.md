# 1 iptables

- iptables는 3가지 종류의 테이블을 가지고 있다.
	- filter: 패킷을 필터링하는 역할
	- nat: 패킷의 출발지, 목적지 주소를 변경하는 역할
	- mangle: 패킷을 수정하는 역할

<br>

**기본 동작**

1. Chain에 포함된 규칙을 위에서부터 아래로 검사를 수행한다.
2. 규칙과 일치하는 패킷에 대하여 `target`에 지정된 작업을 수행한다.
3. 작업을 수행하면 이후 규칙에 대해서 추가적인 검사를 진행하지 않는다.
4. 패킷이 모든 규칙과 일치하지 않는다면 기본 정책을 수행한다. 기본 정책은 `policy DROP`, 또는 `policy ACCEPT`로 설정한다.

<br>

## 1.1 Chain

- iptables에서 패킷을 제어하는 위치
- 테이블마다 사용할 수 있는 chain이 정해져 있다.
- 체인은 이미 만들어져 있는 built-in chain이 있고 사용자가 직접 정의할 수 있다.

<br>

**built-in chain**

- filter
	- `INPUT`: 목적지가 호스트인 패킷에 대한 필터링
	- `OUTPUT`: 출발지가 호스트인 패킷에 대한 필터링
	- `FORWARD`: 호스트를 경유하는 패킷에 대한 필터링
- nat
	- `PREROUTING`: 외부에서 내부로 향하는 패킷의 주소(목적지) 변환 
	- `POSTROUTING`: 내부에서 외부로 향하는 패킷의 주소(출발지) 변환
	- `OUTPUT`: nat 테이블을 빠져나갈 때 사용한다.

<br>

## 1.2 주요 옵션

-  `--append`,  `-A`: 규칙을 체인에 추가한다.
	- 체인 마지막에 규칙이 추가된다.
-  `--insert`, `-I`: 규칙을 추가한다. rule 번호를 지정하지 않으면 1번으로 등록된다.
- `--delete`,  `-D`: 매칭되는 규칙을 체인에서 제거한다.
	- 룰의 번호를 지정해서 룰을 제거할 수 있다.
- `--list`, `-L`: 모든 체인의 규칙을 조회한다. 체인을 명시하면 해당 체인만 조회한다.
- `--flush`, `-F`: 모든 체인의 규칙을 삭제한다. 체인을 명시하면 해당 체인의 규칙만 삭제한다.
- `--zero`, `-Z`: 모든 체인의 규칙의 카운터를 초기화 한다.
	- 체인만 지정하거나 체인과 룰 번호를 지정할 수 있다.
- `--new`, `-N`: 사용자 정의 체인을 추가한다.
- `--delete-chain`, `-X`: 사용자 정의 체인을 삭제한다.
	- 빌트인 체인은 지울 수 없다.
	- 체인이 룰을 가지고 있으면 삭제할 수 없다.
- `--policy`,  `-P`: 체인의 정책을 변경한다.
- `--rename-chain`, `-E` : 체인의 이름을 변경한다.

<br>

# 2 filter table

## 2.1 built-in chain

- built-in chain으로 3가지가 있다.
- `INPUT`: 목적지가 호스트인 패킷에 대한 필터링
- `FORWARD`: 호스트를 경유하는 패킷에 대한 필터링
- `OUTPUT`: 출발지가 호스트인 패킷에 대한 필터링

<br>

## 2.2 target 종류

- fileter table에서 사용할 수 있는 target 종류는 아래와 같다.
- ACCEPT: 조건에 일치하는 패킷 허용
- REJECT:조건에 일치하는 패킷 차단하고 응답을 발생시키지 않음
- DROP: 조건에 일치하는 패킷 차단하고 응답을 전달 함
- LOG: 조건에 일치하는 패킷을 로그로 남긴다

<br>

## 2.3 filter table 사용법


**filter 테이블 조회**

```bash
# filter 테이블 조회
$ sudo iptables -L -t filter

# filter 테이블 조회 -t 옵션의 기본값이 `filter`이기 -t 옵션은 생략 가능하다.
$ sudo iptables -L

# -n: 주소를 숫자와 포트로 나타낸다.
$ sudo iptables -n -L

# -v: 더 자세한 출력으로 받은 패킷의 수와 바이트를 볼 수 있다.
$ sudo iptables -n -v -L

# -L chain: 특정 체인의 룰만 조회한다.
$ sudo iptables -n -v -L INPUT

# --line-numbers: rule의 번호를 같이 보여준다.
$ sudo iptables -n -v --line-numbers -L INPUT
```

<br>

**체인 정책 변경**

```bash
# INPUT 체인의 정책을 ACCEPT로 변경
$ sudo iptables -P INPUT ACCEPT

# 결과 조회시 정책이 ACCEPT로 설정되었다.
$ sudo iptables -n -v -L INPUT
Chain INPUT (policy ACCEPT 0 packets, 0 bytes)
```

<br>

**Chain에 Rule 추가**

```bash
# INPUT 체인에 규칙을 추가한다. 출발지는 1.1.1.1 target은 "ACCEPT"로 지정한다.
$ sudo iptables -A INPUT -s 1.1.1.1 -j ACCEPT

# INPUT 체인에 규칙을 추가한다. tcp 프로토콜을 사용해 22번 포트로 오는 패킷을 ACCPET 한다
$ sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# INPUT 체인에 세 번째 규칙을 등록한다. icmp 프로토콜 패킷을 허용한다.
$ sudo iptables -I INPUT 3 -p icmp -j ACCEPT

# tcp 프로토콜이면서 출발지 port가 1011이 아닌 경우 패킷을 드롭한다.
$ sudo iptables -A INPUT -p tcp ! --dport 1011 -j DROP
```

<br>

**Rule 삭제**

```bash
# INPUT 체인의 첫 번째 룰을 삭제한다.
$ sudo iptables -D INPUT 1
```

<br>

## 2.4 filter table logging

**logging rule 추가**

```bash
$ sudo iptables -A INPUT -p tcp --dport 80 -j LOG
```

<br>

**로깅 파일**

- Ubuntu에서 기본적으로 로그 메시지는 `/var/log/syslog` 또는 `/var/log/messages`에 기록된다.

<br>

# 3 nat table

## 3.1 built-in chain

- `PREROUTING`: 외부에서 내부로 향하는 패킷의 주소(목적지) 변환 
- `POSTROUTING`: 내부에서 외부로 향하는 패킷의 주소(출발지) 변환
- `OUTPUT`: nat 테이블을 빠져 나갈 때 사용한다.

<br>

## 3.2 target 종류

- SNAT
	- 출발지 주소 변환
	- 내부 사설 IP 주소를 외부 공인 IP 주소로 변경하는 경우 사용한다.
- DNAT
	- 목적지 주소 변환
	- 외부 공인 IP 주소를 내부의 사설 IP 주소로 변경하는 경우 사용한다.
- MASQUERADE
	- 조건에 일치하는 패킷의 출발지 주소를 변환한다. 
	- 요청의 출발지 주소를 조건에 지정된 인터페이스의 IP로 변환한다.
- REDIRECT 
	- 조건에 일치하는 패킷의 port를 --to-port 옵션으로 지정된 port로 리다이렉트 한다.

<br>

## 3.3 사용법

**nat 테이블 조회**

```bash
# nat 테이블 조회
$ sudo iptables -L -t nat
```

<br>

# 4 mangle table

```bash
# mangle 테이블 조회
$ sudo iptables -L -t mangle
```
