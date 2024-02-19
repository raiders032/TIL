# 1 WAF

- Web Application Firewall은 웹 애플리케이션의 보안을 위한 시스템이다.
- 웹 서버 내에 소프트웨어로 설치되는 형태와 하드웨어로 설치되는 형태가 있다.
- 하드웨어로 설치되는 형태는 reverse proxy 방식, in-line 방식으로 구성할 수 있다.
	- in-line 방식이 구축하기 편리하여 선호도가 높다.


# 2 Netfilter

- Linux 커널에는 Netfilter 서브 시스템이 포함되어 있습니다. 
- Netfilter 서브 시스템은 서버로 들어오거나 서버를 통과하는 네트워크 트래픽을 조작하는데 사용된다.
	- 패킷을 승인하거나, 조작하거나, 거절한다.
- 모든 최신 Linux 방화벽 솔루션은 패킷 필터링에 Netfilter 시스템을 사용한다.

<br>

# 3 iptables

- iptables이란 Linux 커널에는 Netfilter 서브 시스템을 관리하기 위한 인터페이스다.
- 패킷이 서버에 도달하면 iptables를 통해 제공된 규칙에 따라 Netfilter 서브 시스템이 패킷을 승인, 조작 또는 거부한다.
- 따라서 iptables가 방화벽을 관리하는 데 필요한 전부다.
- 하지만  iptables를 직접 다루는게 복잡하기 때문에 이 작업을 단순화한 솔루션들이 존재한다.

<br>

# 4 ufw - Uncomplicated Firewall

- [레퍼런스](https://ubuntu.com/server/docs/security-firewall)
- ufw는 우분투의 기본 방화벽 툴이다.
- Uncomplicated Firewall은 이름처럼 단순한 방화벽 툴로 모든 기능을 제공하는 것의 초점을 두지 않고 쉬운 사용성에 초점을 둔다.
- ufw 기본적으로 비활성화되어 있다.



**방화벽 상태 보기**

```bash
sudo ufw status
sudo ufw status verbose
sudo ufw status numbered
```



**ufw 활성화 또는 비활성화**

```bash
sudo ufw enable
sudo ufw disable
```



**포트 열기**

```bash
sudo ufw allow 22
```



**포트 닫기**

```bash
sudo ufw deny 22
```



**룰 지우기**

```bash
sudo ufw delete deny 22
```



# 5 firewalld

- firewalld는 CentOS7부터 이전의 iptables를 대체해 새롭게 선보인 패킷필터링 방화벽 입니다.
- firewalld도 netfilter 모듈 기능을 둔 방화벽으로서 설정에 대한 변경을 언제든지 할 수 있고, 또한 변경 사항을 저장할 필요 없이 즉시 적용하기 때문에 iptables가 정적(static)인 반면 firewalld는 동적(dynamic) 방화벽인 점이 iptables와 차이점 입니다.



참고

- https://ubuntu.com/server/docs/security-firewall