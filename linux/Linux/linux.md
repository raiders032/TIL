커널

쉘

프롬프트

* 사용자 호스트 디렉토리



# 디렉토리 명령어

## cd

* 작업 디렉토리 변경



## cp

* 디렉토리 복사 

```bash
cp -r
```



## ls

* 디렉토리 내용 확인

```bash
ls -a
ls -l
ls -al
ls -R
```



## pwd

* 현재 작업 디렉터로 확인



## mkdir

* 디렉토리 생성

```bash
mkdir -p 
```



## rmdir

* 디렉토리  제거

```bash
rmdir
rm -r
rm -rf
```



## mv

* 디렉토리  이름 변경
* 디렉토리  이동

```bash
mv -r
```



# 파일 관련 명령어

## touch

* 빈 파일을 생성

```bash
touch file1
```

## rm

* 파일 제거

```bash
rm -f
```

## mv

* 파일 이동
* 파일 이름 변경



## cp

* 파일 복사

```bash
 cp sourcefile destinationfile
```



## cat

* 파일 내용 확인

```bash
cat -n
```



## head

* 파일 처음부터 N줄까지 확인

```bash
head -3 
```



## tail

* 파일 끝부터 N줄까지 확인

```bash
tail -20
tail -f
```



## more

* 파일 내용 확인



# 파일 및 디렉토리 검색

## grep

* 파일 내용에서 특정 내용을 찾을 때 사용한다.

```bash
# 대소문자 구분 X
grep -i

# 라인넘버 표시
grep -n
grep -v
grep -w
grep -c
grep -l
```



## fgrep

* 특수문자들을 단순한 문자로 인식



## find

* 파일 또는 디렉토리를 검색할 떄 사용

```bash
find / -name passwd
find / -name passwd -type f
find / -name passwd -type d
find / -size +1G
find . -name test -ls
```



# 권한

* 리눅스의 모든 파일과 디렉토리는 권한을 가지고 있다.
* 다중 사용자 환경에서 제공하는 가장 기초적인 접근 통제 방법
* 소유자
  * 파일이나 디렉토리를 생성한 사용자
* 관리그룹
  * 파일이나 디렉토리를 생성한 사용자가 속한 그룹
* 나머지
  * 소유자도 아니고 관리 그룹에 속한 사용자도 아닌 경우
* 기본적으로 파일의 경우 `644` , 디렉토리는 `755` 의 권한을 가진다.



## chmod

```bash
# 소유자에게 읽기 권한 부여
chmode u+r test
# 관리 그룹에게 읽기 쓰기 권한 부여
chmode g+rw test
# 나머지 사용자에게 실행 권한 박탈
chmode o-x test
```



# 링크

## 하드링크

* 특정 파일 또는 디렉토리에 접근을 쉡게 할 수 있도록 하는 방법
* 파일 시스템이 물리적인 장치인 하드 디스크 상에 저장되어 있는 특정 파일의 위치를 가리키는 것



## 심볼릭링크

* 실질적인 디스크 상의 파일을 가리키는 것이 아니라 파일 시스렘 상의 특정 파일을 가리키는 것
* 하드링크를 가리킨다



## ln

```bash
ln
ln -s
```



# Shell

* 터미널에 입력한 명령을 해석하고 관리하는 프로그램은 쉘이라고 한다.
* 쉘은 사용자 커널 사이에 연결시켜주는 역할을 하며 사용자가 입력한 명령을 해석하여 운영체제가 해당 명령을 알아들을 수 있게 해준다.
* 가장 많이 사용되는 쉘은 Bash 쉘이다



## shell 메타문자 사용

`~`

* 현재 로그인 한 사용자의 홈디렉토리

* ```bash
  cd ~
  cd ~<사용자이름>
  ```

`-`

* 이전 작업 디렉토리

* ```bash
  cd -
  ```

`*`

* 하나 이상의 문자를 대체하는 문자

`?`

* 하나의 문자만 대체

`<`

* 표준 입력 재지정

`>`

* 표준 출력 및 표전 에러를 재지정

* 일반적으로 명령어의 출력을 파일로 저장 또는 네트워크로 전송

* 파일의 내용을 덮어씀


`>>` : 이어서 쓰기 

* ```bash
  # 출력을 파일로 저장
  echo "test" > ./file
  # 정상적인 결과만 출력
  find / -perm -4000 2> /dev/null
  # 에러 결과만 출력
  find / -perm -4000 1> /dev/null
  # 정상 결과는 파일에 저장 에러는 출력 X
  find / -perm -4000 1> ./file 2> /dev/null
  ```

`|`

* 명령어1 | 명령어2

* 명령어1의 결과를 명령어2의 입력으로 사용 

* ```bash
  cat /etc/passwd | grep root
  ```



# 프로세스



## ps

* 현재 실행중인 프로세스의 정보를 보여준다.

```bash
# 현재 사용자가 실행한 프로세스
ps

# 풀 포맷으로 보여주기
ps -f

# 모든 프로세스 자세히
ps -ef

# 더 알아보기
ps --help all
Usage:
 ps [options]

Basic options:
 -A, -e               all processes
 -a                   all with tty, except session leaders
  a                   all with tty, including other users
 -d                   all except session leaders
 -N, --deselect       negate selection
  r                   only running processes
  T                   all processes on this terminal
  x                   processes without controlling ttys

Selection by list:
 -C <command>         command name
 -G, --Group <GID>    real group id or name
 -g, --group <group>  session or effective group name
 -p, p, --pid <PID>   process id
        --ppid <PID>  parent process id
 -q, q, --quick-pid <PID>
                      process id (quick mode)
 -s, --sid <session>  session id
 -t, t, --tty <tty>   terminal
 -u, U, --user <UID>  effective user id or name
 -U, --User <UID>     real user id or name

  The selection options take as their argument either:
    a comma-separated list e.g. '-u root,nobody' or
    a blank-separated list e.g. '-p 123 4567'

Output formats:
 -F                   extra full
 -f                   full-format, including command lines
  f, --forest         ascii art process tree
 -H                   show process hierarchy
 -j                   jobs format
  j                   BSD job control format
 -l                   long format
  l                   BSD long format
 -M, Z                add security data (for SELinux)
 -O <format>          preloaded with default columns
  O <format>          as -O, with BSD personality
 -o, o, --format <format>
                      user-defined format
  s                   signal format
  u                   user-oriented format
  v                   virtual memory format
  X                   register format
 -y                   do not show flags, show rss vs. addr (used with -l)
     --context        display security context (for SELinux)
     --headers        repeat header lines, one per page
     --no-headers     do not print header at all
     --cols, --columns, --width <num>
                      set screen width
     --rows, --lines <num>
                      set screen height

Show threads:
  H                   as if they were processes
 -L                   possibly with LWP and NLWP columns
 -m, m                after processes
 -T                   possibly with SPID column

Miscellaneous options:
 -c                   show scheduling class with -l option
  c                   show true command name
  e                   show the environment after command
  k,    --sort        specify sort order as: [+|-]key[,[+|-]key[,...]]
  L                   show format specifiers
  n                   display numeric uid and wchan
  S,    --cumulative  include some dead child process data
 -y                   do not show flags, show rss (only with -l)
 -V, V, --version     display version information and exit
 -w, w                unlimited output width

        --help <simple|list|output|threads|misc|all>
                      display help and exit


```



## kill

> 프로세스를 종료 시키는 명령어

* 프로세스에 특정 시그널을 전달합니다.
* 시그널 번호
  * `1` : 프로세스 종료 없이 프로그램을 초기화
  * `2`: 명령어 실행중 중단 명령
  * `9`: 무시할 수 없는 종료
  * `15`: 무시할 수 있는 종료

```bash
# 프로세스 52373에게 9번 시그널 전달 즉 종료
kill -9 52373
```



## top

> 프로세스와 쓰레드의 목록과 시스템의 요약 정보를 보여준다.



___



# 아카이브

> 여러 파일을 하나의 묶음으로 보관



## tar

> 여러 파일을 하나의 아카이브에 묶어서 저장한다.

```bash
 # foo 와 bar를 묶어 archive.tar를 생성한다.
 tar -cf archive.tar foo bar
 # archive.tar의 파일 리스트를 조회한다.
 tar -tvf archive.tar
 # archive.tar의 모든 파일을 추출한다.
 tar -xf archive.tar
 # archive.tar.gz을 압축 해제와 아카이브를 해제를 동시에 한다.
 tar -zxvf archive.tar.gz
```



# 사용자 관리 관련 파일들



## /etc/passwd

* 사용자의 기본 정보를 가지고 있다

* 유저 목록을 볼 수있다

* ```bash
  cat /etc/passwd
  ...
  ubuntu:x:1000:1000:Ubuntu:/home/ubuntu:/bin/bash
  ...2
  ```

* ubuntu

  * 로그인명

* x

  * 현재는 사용하지 않는다.

* 1000

  * UID

* 1000

  * GID

* /home/ubuntu

  * 사용자의 홈 디렉토리

* /bin/bash

  * 로그인 쉘



## /etc/group

* 그룹에 대한 정보를 가지고 있다

* ```bash
  cat /etc/group
  ...
  sudo:x:27:ubuntu
  ...
  ```

* sudo

  * 그룹이름

* x

  * 패스워드 현재 사용하지 않음

* 27

  * GID

* ubuntu

  * 사용자 목록



# 사용자 관리 명령어

## useradd

> 새로운 유저를 생성한다.

```bash
# user01 사용자를 생성한다.
useradd user01 -m
tail -1 /etc/passwd
user01:x:1002:1002::/home/user01:/bin/bash

# user02 사용자를 생성한다. 유저 아이디, 주석 옵션 사용
useradd -u 2000 -c "test user" user02
tail -1 /etc/passwd
user02:x:2000:2000:test user:/home/user02:/bin/bash
```



## usermod

> 유저의 정보를 변경한다.

```bash
# 변경전
tail -1 /etc/passwd
user02:x:2000:2000:test user:/home/user02:/bin/bash

# 사용자 user02의 유저 아이디를 1003으로 변경
usermod -u 1003 user02
tail -1 /etc/passwd
user02:x:1003:2000:test user:/home/user02:/bin/bash

# 현재 유저를 docker 그룹에 추가
sudo usermod -aG docker $USER
```



## userdel

> 유저를 삭제한다.

```bash
# user01 사용자를 삭제한다.
userdel user01
# user02 사용자를 삭제한다 홈디렉토리도 함께
userdel -r user02
```

## passwd

> 사용자의 비밀번호를 변경한다.

```bash
# 현재 사용자의 비밀번호 변경
passwd
# ec2-user 유저의 비밃번호 변경
passwd ec2-user
```



# 그룹 관리 명령어

**cat /etc/group**

> 그룹 조회하기.

## groupadd

> 새로운 그룹을 생성한다.



## groupmod

> 그룹 정보를 수정한다.



## groupdel

> 그룹을 삭제한다.



## groups

> 유저가 속한 그룹을 확인한다.

```bash
$ groups youngthree
youngthree : youngthree docker
```



# 사용자 로그인 관련 명령어

## su

> 다른 계정의 권한으로 명령어를 실할수 있게한다.
>
> * `-` 의 유무
>   * O: 입력한 사용자의 사용자 초기화 파일을 적용
>   * X: 현재 사용자의 환경을 유지

```bash
# root 유저의 권한을 빌려 명령을 수행함
su
# user 유저의 권한을 빌려 명령을 수행함
su user
# su - 는 root 계정으로 완전히 전환하고, root 사용자의 환경설정을 불러온다.
su -
# su - 는 다른 user 계정으로 완전히 전환하고, 전환한 사용자의 환경설정을 불러온다.
su - user
```



## who

> 로그인한 유저를 보여준다.

```bash
who
# 런레벨 확인
who -r
run-level 5  2021-01-29 13:29
```



## last

> 로그인 내역을 확인한다.

```bash
last
```



#  Systemctl 관련 명령어



# Host 네임 변경

```bash
hostnamectl set-hostname new_host_name
```



# 네트워크



## ip link

- 호스트의 네트워크 인터페이스를 볼 수 있다.

```bash
$ ip link

# 축약어 사용
$ ip l
```



## ip addr

- 네트워크 인터페이스에 할당 된 IP 주소를 볼 수 있다.

````bash
$ ip addr

# 축약어 사용
$ ip a

# 네티워크 인터페이스에 IP 주소를 할당한다. 재시작 하면 풀림
$ ip addr add 192.168.1.10/24 dev eth0

# 브리지 타입의 인터페이스 조회
$ ip addr show type bridge
````



## ip netns

- 네트워크 네임스페이스 조회

```bash
# 네트워크 인터페이스 생성
$ ip netns add red
$ ip netns add blue

# 네트워크 네임스페이스 조회
$ ip netns
blue
red

# red 네트워크 네임스페이스의 네트워크 인터페이스 조회
$ ip -n red link
1: lo: <LOOPBACK> mtu 65536 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    
# red 네트워크 네임스페이스의 arp 테이블 조회 비어있음
$ ip netns exec red arp

# 호스트의 arp 테이블
$ arp
Address                  HWtype  HWaddress           Flags Mask            Iface
k8-single-node-ttyd-sta  ether   02:42:c0:12:65:09   C                     eth0
172.25.0.1               ether   02:42:f1:e7:87:ee   C                     eth1
10.244.0.3               ether   1a:af:3b:cd:9f:4b   C                     cni0
oc-192-18-101-7.compute  ether   02:42:c0:12:65:07   C                     eth0
k8-single-node-ttyd-sta  ether   02:42:c0:12:65:06   C                     eth0
oc-192-18-101-10.comput  ether   02:42:c0:12:65:0a   C                     eth0
10.244.0.2               ether   7e:7e:b5:88:d4:0a   C                     cni0
```



## ip route

- 라우팅 테이블 보기

```bash
$ ip route

# 축약어 사용
$ ip r

# 라우팅 테이블에 엔트리 추가하기
$ ip route add 192.168.1.0/24 via 192.168.2.1
```



## netstat

- Print network connections, routing tables, interface statistics, masquerade connections, and multicast memberships

```bash
$ netstat -help
usage: netstat [-vWeenNcCF] [<Af>] -r         netstat {-V|--version|-h|--help}
       netstat [-vWnNcaeol] [<Socket> ...]
       netstat { [-vWeenNac] -i | [-cnNe] -M | -s [-6tuw] }

        -r, --route              display routing table
        -i, --interfaces         display interface table
        -g, --groups             display multicast group memberships
        -s, --statistics         display networking statistics (like SNMP)
        -M, --masquerade         display masqueraded connections

        -v, --verbose            be verbose
        -W, --wide               don't truncate IP addresses
        -n, --numeric            don't resolve names
        --numeric-hosts          don't resolve host names
        --numeric-ports          don't resolve port names
        --numeric-users          don't resolve user names
        -N, --symbolic           resolve hardware names
        -e, --extend             display other/more information
        -p, --programs           display PID/Program name for sockets
        -o, --timers             display timers
        -c, --continuous         continuous listing

        -l, --listening          display listening server sockets
        -a, --all                display all sockets (default: connected)
        -F, --fib                display Forwarding Information Base (default)
        -C, --cache              display routing cache instead of FIB
        -Z, --context            display SELinux security context for sockets

  <Socket>={-t|--tcp} {-u|--udp} {-U|--udplite} {-S|--sctp} {-w|--raw}
           {-x|--unix} --ax25 --ipx --netrom
  <AF>=Use '-6|-4' or '-A <af>' or '--<af>'; default: inet
  List of possible address families (which support routing):
    inet (DARPA Internet) inet6 (IPv6) ax25 (AMPR AX.25)
    netrom (AMPR NET/ROM) ipx (Novell IPX) ddp (Appletalk DDP)
    x25 (CCITT X.25)
```



```bash
# tcp
netstat -t

# PID/Program name
netstat -psudo

# listening
netstat -l

# don't resolve name
netstat -n
```



## netcat

```bash
$ netcat -help
OpenBSD netcat (Debian patchlevel 1.187-1ubuntu0.1)
usage: nc [-46CDdFhklNnrStUuvZz] [-I length] [-i interval] [-M ttl]
	  [-m minttl] [-O length] [-P proxy_username] [-p source_port]
	  [-q seconds] [-s source] [-T keyword] [-V rtable] [-W recvlimit] [-w timeout]
	  [-X proxy_protocol] [-x proxy_address[:port]] 	  [destination] [port]
	Command Summary:
		-4		Use IPv4
		-6		Use IPv6
		-b		Allow broadcast
		-C		Send CRLF as line-ending
		-D		Enable the debug socket option
		-d		Detach from stdin
		-F		Pass socket fd
		-h		This help text
		-I length	TCP receive buffer length
		-i interval	Delay interval for lines sent, ports scanned
		-k		Keep inbound sockets open for multiple connects
		-l		Listen mode, for inbound connects
		-M ttl		Outgoing TTL / Hop Limit
		-m minttl	Minimum incoming TTL / Hop Limit
		-N		Shutdown the network socket after EOF on stdin
		-n		Suppress name/port resolutions
		-O length	TCP send buffer length
		-P proxyuser	Username for proxy authentication
		-p port		Specify local port for remote connects
		-q secs		quit after EOF on stdin and delay of secs
		-r		Randomize remote ports
		-S		Enable the TCP MD5 signature option
		-s source	Local source address
		-T keyword	TOS value
		-t		Answer TELNET negotiation
		-U		Use UNIX domain socket
		-u		UDP mode
		-V rtable	Specify alternate routing table
		-v		Verbose
		-W recvlimit	Terminate after receiving a number of packets
		-w timeout	Timeout for connects and final net reads
		-X proto	Proxy protocol: "4", "5" (SOCKS) or "connect"
		-x addr[:port]	Specify proxy address and port
		-Z		DCCP mode
		-z		Zero-I/O mode [used for scanning]
	Port numbers can be individual or ranges: lo-hi [inclusive]
```



##  iptables

````bash
$ iptables -help
iptables v1.6.1

Usage: iptables -[ACD] chain rule-specification [options]
       iptables -I chain [rulenum] rule-specification [options]
       iptables -R chain rulenum rule-specification [options]
       iptables -D chain rulenum [options]
       iptables -[LS] [chain [rulenum]] [options]
       iptables -[FZ] [chain] [options]
       iptables -[NX] chain
       iptables -E old-chain-name new-chain-name
       iptables -P chain target [options]
       iptables -h (print this help information)

Commands:
Either long or short options are allowed.
  --append  -A chain		Append to chain
  --check   -C chain		Check for the existence of a rule
  --delete  -D chain		Delete matching rule from chain
  --delete  -D chain rulenum
				Delete rule rulenum (1 = first) from chain
  --insert  -I chain [rulenum]
				Insert in chain as rulenum (default 1=first)
  --replace -R chain rulenum
				Replace rule rulenum (1 = first) in chain
  --list    -L [chain [rulenum]]
				List the rules in a chain or all chains
  --list-rules -S [chain [rulenum]]
				Print the rules in a chain or all chains
  --flush   -F [chain]		Delete all rules in  chain or all chains
  --zero    -Z [chain [rulenum]]
				Zero counters in chain or all chains
  --new     -N chain		Create a new user-defined chain
  --delete-chain
            -X [chain]		Delete a user-defined chain
  --policy  -P chain target
				Change policy on chain to target
  --rename-chain
            -E old-chain new-chain
				Change chain name, (moving any references)
Options:
    --ipv4	-4		Nothing (line is ignored by ip6tables-restore)
    --ipv6	-6		Error (line is ignored by iptables-restore)
[!] --protocol	-p proto	protocol: by number or name, eg. `tcp'
[!] --source	-s address[/mask][...]
				source specification
[!] --destination -d address[/mask][...]
				destination specification
[!] --in-interface -i input name[+]
				network interface name ([+] for wildcard)
 --jump	-j target
				target for rule (may load target extension)
  --goto      -g chain
                              jump to chain with no return
  --match	-m match
				extended match (may load extension)
  --numeric	-n		numeric output of addresses and ports
[!] --out-interface -o output name[+]
				network interface name ([+] for wildcard)
  --table	-t table	table to manipulate (default: `filter')
  --verbose	-v		verbose mode
  --wait	-w [seconds]	maximum wait to acquire xtables lock before give up
  --wait-interval -W [usecs]	wait time to try to acquire xtables lock
				default is 1 second
  --line-numbers		print line numbers when listing
  --exact	-x		expand numbers (display exact values)
[!] --fragment	-f		match second or further fragments only
  --modprobe=<command>		try to insert modules using this command
  --set-counters PKTS BYTES	set the counter during insert/append
[!] --version	-V		print package version.
````



## Host

- *host* 명령어 뒤에 조회하려는 도메인을 지정한다.
- host 는 DNS lookup 유틸리티로  nslookup 명령어와 동일한 역할을 수행합니다.

```bash
$ host
Usage: host [-aCdilrTvVw] [-c class] [-N ndots] [-t type] [-W time]
            [-R number] [-m flag] hostname [server]
       -a is equivalent to -v -t ANY
       -c specifies query class for non-IN data
       -C compares SOA records on authoritative nameservers
       -d is equivalent to -v
       -i IP6.INT reverse lookups
       -l lists all hosts in a domain, using AXFR
       -m set memory debugging flag (trace|record|usage)
       -N changes the number of dots allowed before root lookup is done
       -r disables recursive processing
       -R specifies number of retries for UDP packets
       -s a SERVFAIL response should stop query
       -t specifies the query type
       -T enables TCP/IP mode
       -v enables verbose output
       -V print version number and exit
       -w specifies to wait forever for a reply
       -W specifies how long to wait for a reply
       -4 use IPv4 query transport only
       -6 use IPv6 query transport only
```

```bash
$ host google.com
google.com has address 172.217.25.174
google.com has IPv6 address 2404:6800:400a:80a::200e
google.com mail is handled by 10 smtp.google.com.
tmax@af-k8s-master:~$ kubectl describe pod superapp-master-9cbd7b894-z797m
```



# 네트워크 파일

## /etc/network/interfaces



# 기타



## journalctl

```bash
$ journalctl --help
journalctl [OPTIONS...] [MATCHES...]

Query the journal.

Options:
     --system                Show the system journal
     --user                  Show the user journal for the current user
  -M --machine=CONTAINER     Operate on local container
  -S --since=DATE            Show entries not older than the specified date
  -U --until=DATE            Show entries not newer than the specified date
  -c --cursor=CURSOR         Show entries starting at the specified cursor
```

