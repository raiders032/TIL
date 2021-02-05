## ARP

> * 논리적인 IP주소를 물리적인 MAC 주소로 바꾸어주는 역할를 하는 프로토콜
> * OSI 모델의 3계층 Network layer에 속하는 프로토콜
> * [ARP 패킷 포멧](http://www.ktword.co.kr/abbr_view.php?nav=1&m_temp1=2188&id=421)
>
> 라우터 상의 ARP 동작
>
> 1. ARP 요청
>
>    * 만일 이전에 전혀 통신한 경험이 없는 LAN(서브네트워크)의 라우터에 외부로부터 데이터 패킷이 전달되어 목적지 호스트를 찾을때
>    * 라우터가 최초로 하는 일은 ARP Request packet(ARP 요청 패킷)을 LAN의 전체 노드에 송출함  (브로드캐스트)
>    * APP 요청 메세지에는 송신자 자신의 MAC 주소 및 IP 주소, 목적지 IP 주소를 채우고 목적지의 MAC 주소는 0으로 채워넣음
>
> 2. ARP 응답
>
>    * ARP 요청 패킷에 포함된 목적지 IP 주소와 일치하는 Host가 응답을 한다.
>    * 자신의 IP 주소 및 물리주소 를 채워놓은 ARP Reply packet(ARP 응답패킷)을 해당 라우터에게 송출한다 (유니캐스트)
>    * 물리 주소 및 IP 주소 상호간의 관련 정보를 얻게됨
>
> 3. ARP 캐쉬
>
>    * 각 노드(node)는 ARP의 효율적 수행을 위해 ARP 캐쉬를 최신으로 유지하는 일이 필수
>
>    * 캐쉬의 각 항목은 새로이 생긴 후로 20분이 지나면 자동적으로 소멸 (RFC 1122)
>
>    * 자주 사용되는 곳은 ARP cache를 통해 즉각적으로 조회가 가능
>
>    * 만약 ARP cache에 조회되는 자료가 없는 경우에만 ARP request packet (ARP 요청 패킷)을 송출하게 되어 전체적으로 LAN 트래픽을 경감시킴
>
>    * ```bash
>      #ARP 캐쉬 확인 명령어 
>      arp -a
>      ```
>
>    [출처](http://www.ktword.co.kr/abbr_view.php?nav=1&m_temp1=10&id=421)





## Client: user-agent

> 사용자 에이전트는 사용자를 대신하여 동작하는 모든 도구입니다. 이 역할은 주로 브라우저에 의해 수행됩니다; 엔지니어들과 자신들의 애플리케이션을 디버그하는 웹 개발자들이 사용하는 프로그램들은 예외입니다.
>
> 브라우저는 **항상** 요청을 보내는 개체입니다. 그것은 결코 서버가 될 수 없습니다(수년에 걸쳐 서버 초기화된 메시지를 시뮬레이션하기 위해 몇 가지 메커니즘이 추가되어 왔지만).
>
> 웹 페이지를 표시하기 위해, 브라우저는 페이지의 HTML 문서를 가져오기 위한 요청을 전송한 뒤, 파일을 구문 분석하여 실행해야 할 스크립트 그리고 페이지 내 포함된 하위 리소스들(보통 이미지와 비디오)을 잘 표시하기 위한 레이아웃 정보(CSS)에 대응하는 추가적인 요청들을 가져옵니다. 그런 뒤에 브라우저는 완전한 문서인 웹 페이지를 표시하기 위해 그런 리소스들을 혼합합니다. 브라우저에 의해 실행된 스크립트는 이후 단계에서 좀 더 많은 리소스들을 가져올 수 있으며 브라우저는 그에 따라 웹 페이지를 갱신하게 됩니다.
>
> 웹 페이지는 하이퍼텍스트 문서로, 표시된 텍스트의 일부는 사용자가 사용자 에이전트를 제어하고 웹을 돌아다닐 수 있도록 새로운 웹 페이지를 가져오기 위해 실행(보통 마우스 클릭에 의해)될 수 있는 링크임을 뜻합니다. 브라우저는 HTTP 요청 내에서 이런 지시 사항들을 변환하고 HTTP 응답을 해석하여 사용자에게 명확한 응답을 표시합니다.
>
> 출처: https://developer.mozilla.org/ko/docs/Web/HTTP/Overview

## Cookie

> HTTP 쿠키(웹 쿠키, 브라우저 쿠키)는 서버가 사용자의 웹 브라우저에 전송하는 작은 데이터 조각입니다. 브라우저는 그 데이터 조각들을 저장해 놓았다가, 동일한 서버에 재 요청 시 저장된 데이터를 함께 전송합니다. 쿠키는 두 요청이 동일한 브라우저에서 들어왔는지 아닌지를 판단할 때 주로 사용합니다. 이를 이용하면 사용자의 로그인 상태를 유지할 수 있습니다. 상태가 없는([stateless](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview#HTTP_is_stateless_but_not_sessionless)) HTTP 프로토콜에서 상태 정보를 기억시켜주기 때문입니다.
>
> 쿠키는 주로 세 가지 목적을 위해 사용됩니다:
>
> - 세션 관리(Session management)
>
>   서버에 저장해야 할 로그인, 장바구니, 게임 스코어 등의 정보 관리
>
> - 개인화(Personalization)
>
>   사용자 선호, 테마 등의 세팅
>
> - 트래킹(Tracking)
>
>   사용자 행동을 기록하고 분석하는 용도
>
> 과거엔 클라이언트 측에 정보를 저장할 때 쿠키를 주로 사용하곤 했습니다. 쿠키를 사용하는 게 데이터를 클라이언트 측에 저장할 수 있는 유일한 방법이었을 때는 이 방법이 타당했지만, 지금은modern storage APIs를 사용해 정보를 저장하는 걸 권장합니다. 모든 요청마다 쿠키가 함께 전송되기 때문에, (특히 mobile data connections에서) 성능이 떨어지는 원인이 될 수 있습니다. 정보를 클라이언트 측에 저장하려면 Modern APIs의 종류인 [웹 스토리지 API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) (`localStorage`와 `sessionStorage`) 와[ IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)를 사용하면 됩니다.
>
> 참조: https://developer.mozilla.org/ko/docs/Web/HTTP/Cookies





## CIDR



## Default Gateway

* 다른 네트워크로 나가는 경로를 알고 있는 라우터
* 일반적으로 호스트에 직접 연결된 라우터
* 외부의 단 하나의 입출구 만 있는 경우 또는 여러 입출구 중 기본 디폴트로 지정 된 것에 해당

출처

* [링크](http://www.ktword.co.kr/abbr_view.php?m_temp1=1668)



___



## DHCP(Dynamic Host Configuration Protocol)

* DHCP 서버를 사용하여 IP 주소 및 관련된 기타 구성 세부 정보를 네트워크의 DHCP 사용 클라이언트에게 동적으로 할당하는 방법을 제공한다.

**동작 원리**

1. DHCP Discover
   * 메시지 방향: 단말 → DHCP 서버
   * 브로드캐스트 메시지 (Destination MAC = FF:FF:FF:FF:FF:FF) 
   * 단말장비가 DHCP 서버에게 아이피 주소를 할당을 요청하는것이다
2. DHCP Offer
   * 메시지 방향: DHCP 서버 → 단말
   * 브로드캐스트 메시지 (Destination MAC = FF:FF:FF:FF:FF:FF) 또는 유니캐스트
   * 요청에 대한 응답으로 아이피 주소 정보 와 단말의 MAC 주소 정보 등을 네트워크 정보와 함께 같이 전송한다
3. DHCP Request
   * 메시지 방향: 단말 → DHCP 서버
   * 브로드캐스트 메시지 (Destination MAC = FF:FF:FF:FF:FF:FF) 
   * 단말이 받은 아이피 주소 정보를 사용하겠다는 메세지를 서버로 보낸다.
4. DHCP Ack
   * 메시지 방향: DHCP 서버 → 단말
   * 브로드캐스트 메시지 (Destination MAC = FF:FF:FF:FF:FF:FF) 또는 유니캐스트
   * 단말의 MAC 어드레스에 매칭이 되는 IP 주소와 게이트웨이 주소를 확정하여 주는 것이다.



## IP Address(Internet Protocol address)

* 컴퓨터 네트워크에서 장치들이 서로를 인식하고 통신을 하기 위해서 사용하는 특수한 번호이다.
* 네트워크에 연결된 장치가 라우터이든 일반 서버이든, 모든 기계는 이 특수한 번호를 가지고 있어야 한다.

### IP version 4 주소

* 주소의 범위는 32비트
* IPv4의 주소체계는 총 12자리이며 네 부분으로 나뉜다. 각 부분은 0~255까지 3자리의 수로 표현된다
  * 이 표현 방식을 **dotted-decimal format**이라 한다.
* 아래와 같이 network part 와 the host part로 나뉜다.

![image-20201224153037352](./images/Parts of an IP Address.png)

**Network Part(Network ID/Network Address Portion)**

* 네트워크에 할당된 유니크한 주소를 나타낸다.
* 위 그림에선 네트워크 파트가 2바이트를 차지한다.

**Host Part(Host ID/Host Address Portion)**

* 네트워크 상에 특정한 엔트포인트를 나타낸다.
* 각각의 호스트에 부여되는 주소를 나타낸다.
* 한 네트워크 안에 각각의 호스트는 같은  `Network Part` 주소를 가지고 있지만 각기 다른  `Host Part` 주소를 가질 것이다.

**특별한 주소**

* Local Broadcast Address
  * 255.255. 255.255
  * 로컬 네트워크의 모든 디바이스에게 브로드캐스팅 할 때 사용되는 주소
  * 기본적으로, 라우터나 layer 3 스위치에서 드롭된다.
* Directed Broadcast Address
* Local Loopback Address
  * 127.x.x.x와 같이 127로 시작하면 Local Loopback Address이다. 
  * 대표적으로 127.0.0.1을 사용한다.
  * 이 주소의 도메인 이름은 `localhost`이다.



### IP version 6 주소

* 모든 단말에 주소를 부여하기에 32비트로는 부족해짐에 따라 IP의 새로운 버전인 버전 6에서는 주소 길이를 128비트로 늘렸다.



## Private IP address vs. Public IP adddress

**Private IP address**

* 같은 네트워크에서 커뮤니케이션을 위해 사용되는 주소

**Public IP adddress**

* 다른 네트워크와 커뮤니케이션을 위해 사용되는 주소
* 일반적으로 ISP (Internet Service Provider)가 할당해준다.



## Proxy

> 웹 브라우저와 서버 사이에서는 수많은 컴퓨터와 머신이 HTTP 메시지를 이어 받고 전달합니다. 여러 계층으로 이루어진 웹 스택 구조에서 이러한 컴퓨터/머신들은 대부분은 전송, 네트워크 혹은 물리 계층에서 동작하며, 성능에 상당히 큰 영향을 주지만 HTTP 계층에서는 이들이 어떻게 동작하는지 눈에 보이지 않습니다. 이러한 컴퓨터/머신 중에서도 애플리케이션 계층에서 동작하는 것들을 일반적으로 **프록시**라고 부릅니다. 프록시는 눈에 보이거나 그렇지 않을 수도 있으며(프록시를 통해 요청이 변경되거나 변경되지 않는 경우를 말함) 다양한 기능들을 수행할 수 있습니다:
>
> - 캐싱 (캐시는 공개 또는 비공개가 될 수 있습니다 (예: 브라우저 캐시))
> - 필터링 (바이러스 백신 스캔, 유해 컨텐츠 차단(자녀 보호) 기능)
> - 로드 밸런싱 (여러 서버들이 서로 다른 요청을 처리하도록 허용)
> - 인증 (다양한 리소스에 대한 접근)
>
> 출처: https://developer.mozilla.org/ko/docs/Web/HTTP/Overview



## PDU(Protocol Data Unit)

* 프로토콜 데이터 단위

* OSI Reference Models의 PDU

  * 1 물리계층(Physical Layer)
    * 비트(bits)
  * 2 데이터링크 계층(Data-Link Layer)
    * 프레임(frame)
  * 3 네트워크 계층(Network Layer)
    * 패킷 (packet)
  * 4 전송 계층(Transport Layer)
    * 세그먼트(segment)
  * 5-7 응용 계층(Application Layer)
    *  메시지, 데이터(data)

  

## Port Number

- System Ports
  - 0번 ~ 1023번: 잘 알려진 포트 (well-known port)
- User Ports
  - 1024번 ~ 49151번: 등록된 포트 (registered port)
- Dynamic or Private Ports
  - 49152번 ~ 65535번: 동적 포트 (dynamic port)

| 포트 | TCP  | UDP  |                             설명                             | 상태 |
| :--: | :--: | :--: | :----------------------------------------------------------: | :--: |
|  20  | TCP  |      | [파일 전송 프로토콜 (FTP, File Transfer Protocol)](https://ko.wikipedia.org/wiki/파일_전송_프로토콜) - 데이터 포트 | 공식 |
|  21  | TCP  |      | [파일 전송 프로토콜 (FTP, File Transfer Protocol)](https://ko.wikipedia.org/wiki/FTP) - 제어 포트 | 공식 |
|  22  | TCP  |      | [시큐어 셸 (SSH, Secure SHell)](https://ko.wikipedia.org/wiki/시큐어_셸) - [ssh](https://ko.wikipedia.org/wiki/시큐어_셸) [scp](https://ko.wikipedia.org/wiki/Scp), [sftp](https://ko.wikipedia.org/wiki/SSH_파일_전송_프로토콜)같은 프로토콜 및 포트 포워딩 | 공식 |
|  80  | TCP  | UDP  | [HTTP](https://ko.wikipedia.org/wiki/HTTP) (HyperText Transfer Protocol) - 웹 페이지 전송 | 공식 |
| 443  | TCP  |      | [HTTPS](https://ko.wikipedia.org/wiki/HTTPS) - [보안 소켓 레이어 (SSL, Secure Socket Layer)](https://ko.wikipedia.org/wiki/전송_계층_보안) 위의 [HTTP](https://ko.wikipedia.org/wiki/HTTP) (암호화 전송) | 공식 |
|      |      |      |                                                              |      |
|      |      |      |                                                              |      |



## Port Forwarding/Port Mapping

* 특정 포트로 들어온 요청을 다른 특정 IP의 특정 포트로 전달한다.
* 포트 포워딩은 원격 컴퓨터가 근거리 통신망(LAN) 내에 위치한 특정 컴퓨터나 서비스에 연결할 수 있게 한다.

> 포트 포워딩(port forwarding) 또는 포트 매핑(port mapping)은 컴퓨터 네트워크에서 패킷이 라우터나 방화벽과 같은 네트워크 게이트웨이를 가로지르는 동안 하나의 IP 주소와 포트 번호 결합의 통신 요청을 다른 곳으로 넘겨주는 네트워크 주소 변환(NAT)의 응용이다. 이 기법은 게이트웨이(외부망)의 반대쪽에 위치한 보호/내부망에 상주하는 호스트에 대한 서비스를 생성하기 위해 흔히 사용되며, 통신하는 목적지 IP 주소와 포트 번호를 내부 호스트에 다시 매핑함으로써 이루어진다.



## Private Network(사설망)

**사설 IPv4 주소 공간**

| RFC1918 이름 |         IP 주소 범위          | 주소 개수  | [클래스](https://ko.wikipedia.org/wiki/네트워크_클래스) 내용 | 최대 [사이더](https://ko.wikipedia.org/wiki/사이더_(네트워킹)) 블록 (서브넷 마스크) | 호스트 ID 크기 |
| :----------: | :---------------------------: | :--------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :------------: |
| 24비트 블록  |   10.0.0.0 – 10.255.255.255   | 16,777,216 |                        클래스 A 하나                         |                    10.0.0.0/8 (255.0.0.0)                    |    24 비트     |
| 20비트 블록  |  172.16.0.0 – 172.31.255.255  | 1,048,576  |                     16개의 인접 클래스 B                     |                 172.16.0.0/12 (255.240.0.0)                  |    20 비트     |
| 16비트 블록  | 192.168.0.0 – 192.168.255.255 |   65,536   |                    256개의 인접 클래스 C                     |                 192.168.0.0/16 (255.255.0.0)                 |    16 비트     |



## Subnet Mask(부분망)

* IP 주소의 `Network Part`와 `Host Part`를 구분하기 위해 사용된다.
* 두개의 장치가 같은 서브넷에 있는지 아닌지 판별하기 위해 사용된다.
  * 네트워크 접두사를 비교해 같으면 같은 서브넷에 있다
  * Remote Network(다른 서브넷)
    * default gateway가 필요함
  * Local Subnet(같은 서브넷)
    * default gateway가 필요없다.

* 이진 형태로 1로 시작해서 연속적으로 1이 있어야한다.

**네트워크 접두사 결정**

|                 |               이진 형태               | 닷 데시멀 노테이션 |
| :-------------: | :-----------------------------------: | :----------------: |
|     IP 주소     | `11000000.10101000.00000101.10000010` |  `192.168.5.130`   |
|  서브넷 마스크  | `11111111.11111111.11111111.00000000` |  `255.255.255.0`   |
| 네트워크 접두사 | `11000000.10101000.00000101.00000000` |   `192.168.5.0`    |
|   호스트 부분   | `00000000.00000000.00000000.10000010` |    `0.0.0.130`     |



___



## NAT(네트워크 주소 변환)

> NAT(Network Address Translation)는 IP 주소 보존을 위해 설계되었습니다. 외부망과 사설망 간에 연결점에 있는 라우터에서 수행되며, 패킷이 다른 네트워크로 전달되기 전에 내부 네트워크의 사설 IP 주소를 공인 IP 주소로 변환합니다.
>
> 이 기능의 일부로 NAT는 전체 네트워크에 대해 하나의 주소만 외부 세계에 알리도록 구성할 수 있습니다.따라서 전체 내부 네트워크를 해당 주소 뒤에 효과적으로 숨겨 보안을 강화할 수 있습니다.NAT는 보안과 IP 주소 보존기능을 제공하며 일반적으로 원격 액세스 환경에서 구현됩니다.

**NAT의 방식 구분**

* 정적 NAT 방식
  * 수동으로 외부 공인 IP와 사설 IP를 1:1로 매핑
* 동적 NAT 방식
  * 사설 IP 주소를 풀(Pool)화하여 공인 주소로 자동 매핑
* NAPT 또는 PAT 방식
  * IP 주소 뿐만 아니라 포트 번호까지도 포함시켜 내부 호스트를 구분

참조

* [링크](http://ktword.co.kr/abbr_view.php?m_temp1=1676&id=426)
* [링크](https://www.cisco.com/c/ko_kr/support/docs/ip/network-address-translation-nat/26704-nat-faq-00.html)



