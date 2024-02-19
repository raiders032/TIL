# 1 nc

- TCP 및 UDP 프로토콜을 사용하여 데이터를 전송하고 받을 수 있게 해주며, 네트워크 디버깅 및 데이터 전송에 매우 유용하다.
- 특정 호스트에 열려 있는 포트를 확인할 수 있다.
- 사용 사례
	- 포트 스캔
	- TCP 서버 및 클라이언트 시뮬레이션
	- 파일 전송:

<br>

**포트 스캔**

- `-v`: 상세한 출력
- `-z`: 스캔 모드에서 포트를 확인

```bash
$ nc 127.0.0.1 6443 -vz
Connection to 127.0.0.1 6443 port [tcp/*] succeeded!
```

<br>

**TCP 서버 및 클라이언트 시뮬레이션**

- `-l`: 리스닝 모드에서 Netcat를 실행하여 들어오는 연결을 기다린다.
- `-p`: 사용할 로컬 포트를 지정한다.

```bash
# 서버는 TCP 포트 12345에서 리스닝
$ nc -l -p 12345
```

```bash
# 클라이언트는 서버의 IP 주소와 포트 번호 12345를 사용하여 서버에 연결
nc 127.0.0.1 12345
```

<br>

# 2 ping

- ping은 네트워크 진단 도구로, 원격 호스트와의 연결을 테스트하거나 원격 호스트의 응답 시간을 측정하는 데 사용한다.
- ping은 ICMP (Internet Control Message Protocol)를 사용하여 동작한다.

<br>

# 3 tcpdump

```bash
# 192.168.159.41 서버와 모든 네트워크 트래픽을 캡쳐한다.
$ tcpdump host 192.168.159.41

# 패킷 출발지가 192.168.159.41인 네트워크 트래픽을 캡쳐한다.
$ tcpdump src 192.168.159.41

# 패킷 목적지가 192.168.159.41인 네트워크 트래픽을 캡쳐한다.
$ tcpdump dst 192.168.159.41

# -i: 특정 인터페이스로 제한한다.
$ tcpdump -i eth0 host 192.168.159.41

# -c: 패킷의 수 제한
$ tcpdump -c 100 host 192.168.159.41

# 패킷의 내용도 출력
$ tcpdump -X host 192.168.159.41

# 캡쳐한 패킷 파일로 저장
$ tcpdump -w captured_packets.pcap host 192.168.159.41

# 캡쳐된 패킷 파일 읽기
$ tcpdump -r captured_packets.pcap
```

<br>

# 4 netstat

- `netstat`은 네트워킹 통계를 보여주는 도구다
- 네트워크 연결, 라우팅 테이블, 인터페이스 통계 등의 정보를 보는 데 사용된다.

<br>

**주요 옵션**

- -a : 모든 소켓을 보여준다.
- -t : TCP 연결만 보여줍니다.
- -u : UDP 연결만 보여줍니다.
- -n : 도메인 이름과 서비스 이름 대신 IP 주소와 포트 번호를 숫자로 표시합니다.
- -l : listening 중인 소켓만 보여준다.
- -s : 네트워크 통계를 보여줍니다.
- -r : 라우팅 테이블을 출력합니다.
- -i : 인터페이스별 통계를 보여줍니다.
- -p :  소켓을 소유한 프로세스 아이디 또는 이름을 볼 수 있다.

<br>

**사용법**

```bash
# 현재 시스템의 모든 TCP 연결 조회
$ netstat -t

# 리스닝 중인 UDP 소켓 조회
$ netstat -ul

# 리스닝 중인 TCP 소켓을 조회한다.프로세스 ID, 프로그램 이름, 숫자로 표현된 주소 표시
$ netstat -tnpl
```

<br>

# 5 iptables

- [[iptables]] 참조

<br>

# 6 nslookup

- nslookup을 사용하면 도메인 이름에 해당하는 IP 주소를 찾을 수 있다.

<br>

**사용법**

```bash
$ nslookup example.com
Server:		168.126.63.1
Address:	168.126.63.1#53

Non-authoritative answer:
Name:	example.com
Address: 93.184.216.34
```
