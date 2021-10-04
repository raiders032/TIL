# 1.도커 네트워크

* 컨테이너는 가상 IP주소를 할당받는다.
* 기본적으로 도커 컨테이너는 172.17.0.x 의 IP 주소를 순차적으로 할당 받는다.
  * IP 주소는 컨테이너를 재시작할 때마다 변경될 수 있다
  * 이 IP 주소는 도커가 설치된 호스트에서만 접근 가능하다
* 외부와 연결이 필요한 경우 컨테이너를 시작할 때 `veth`라는 네트워크 인터페이스를 생성해야한다.
  * `veth`: 외부와의 네트워크를 제공하기 위해 필요한 가상 네트워크 인터페이스
  * `veth` 는 사용자가 직접 생성할 필요가 없으며 컨테이너를 생성할 때 도커 엔진이 자동 생성한다.

```bash
# 컨테이너의 IP 주소 확인 172.17.0.2를 할당 받았다
docker run -it --name network_test ubuntu:14.04
root@8b597aa63feb:/# ifconfig
eth0      Link encap:Ethernet  HWaddr 02:42:ac:11:00:02
          inet addr:172.17.0.2  Bcast:172.17.255.255  Mask:255.255.0.0
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:12 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0
          RX bytes:1032 (1.0 KB)  TX bytes:0 (0.0 B)

lo        Link encap:Local Loopback
          inet addr:127.0.0.1  Mask:255.0.0.0
          UP LOOPBACK RUNNING  MTU:65536  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000
          RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)
```

```bash
#도커가 설치된 호스트에서 컨테이너의 수만큼 veth를 확인할 수 있다
ifconfig
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
...

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 7359720  bytes 1351610610 (1.2 GiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 7359720  bytes 1351610610 (1.2 GiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

veth2594e34: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet6 fe80::c47a:25ff:fedc:e912  prefixlen 64  scopeid 0x20<link>
        ether c6:7a:25:dc:e9:12  txqueuelen 0  (Ethernet)
        RX packets 360104  bytes 37952038 (36.1 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 306360  bytes 33669366 (32.1 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

docker0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.0.1  netmask 255.255.0.0  broadcast 172.17.255.255
        inet6 fe80::42:d8ff:fe3d:93ac  prefixlen 64  scopeid 0x20<link>
        ether 02:42:d8:3d:93:ac  txqueuelen 0  (Ethernet)
        RX packets 13639200  bytes 3422487848 (3.1 GiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 16286850  bytes 9921645320 (9.2 GiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```



# 2. 도커 네트워크 구조

![image-20210615215557871](./images/network)

**host의 `eth0`**

* 호스트의 네트워크 인터페이스 공인 IP 또는 내부 IP가 할당되어 실제 외부와 통신한다.

**veth**

* 도커 엔진이 컨테이를 실행할 때 자동으로 만드는 인터페이스
* 각 컨테이너의 `eth0`와 연결되어 있다.

**`docker0`**

* 각 `veth` 인터페이스와 바인딩돼 호스트의 `eth0`와 이어주는 역할을 한다.

**정리**

* 컨테이너의 `eth0` 인터페이스는 호스트의 `veth` 라는 인터페이스와 연결된다.
* `veth` 인터페이스는 `docker0` 브리지와 바인딩돼 외부와 통신할 수 있다.



# 3. 도커 네트워크 종류

* 컨테이너를 생성하면 기본적으로 `docker0` 브리지를 통해 외부와 통신할 수 있는 환경이 제공된다
* 사용자의 선택에 따라 다른 네트워크 드라이브를 사용할 수 있다
  * 브리지, 호스트, 논, 컨테이너, 오버레이
  *  weave, flannel, openvswitch



## 3.1 브리지

* 아무런 설정을 하지않고 컨테이너를 생성하면 자동으로 `docker0`를 사용한다. 



**브리지 네트워크 생성 및 사용**

```bash
# 브리지 네트워크 생성
docker network create --driver bridge network-name

# 브리지 네트워크 사용
docker run -it --name mynetwork --net network-name ubuntu:14.04

# 컨테이너 내부에서 IP 확인
root@e0fda4968d27:/# ifconfig
eth0      Link encap:Ethernet  HWaddr 02:42:ac:13:00:02
          inet addr:172.19.0.2  Bcast:172.19.255.255  Mask:255.255.0.0
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:11 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0
          RX bytes:962 (962.0 B)  TX bytes:0 (0.0 B)

lo        Link encap:Local Loopback
          inet addr:127.0.0.1  Mask:255.0.0.0
          UP LOOPBACK RUNNING  MTU:65536  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000
          RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)
```



## 3.2  호스트 네트워크

* 네트워크를 호스트로 설정하면 호스트의 네트워크 환경을 그대로 쓸 수 있다
* 호스트 드라이버 네트워크는 별도 생성없이 기존의 `host`라는 이름의 네트워크를 사용한다
* 드라이버로 `host`를 선택하면 별도의 포트 포워딩 없이 외부에서 접근할 수 있다

```bash
# 호스트와 컨테이너 내부에서 ifconfig 결과가 같다
docker run -it --name network_host --net host ubuntu:14.04
root@gcloud-238:/# ifconfig
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
...

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 7359720  bytes 1351610610 (1.2 GiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 7359720  bytes 1351610610 (1.2 GiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

veth2594e34: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet6 fe80::c47a:25ff:fedc:e912  prefixlen 64  scopeid 0x20<link>
        ether c6:7a:25:dc:e9:12  txqueuelen 0  (Ethernet)
        RX packets 360104  bytes 37952038 (36.1 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 306360  bytes 33669366 (32.1 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

docker0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.0.1  netmask 255.255.0.0  broadcast 172.17.255.255
        inet6 fe80::42:d8ff:fe3d:93ac  prefixlen 64  scopeid 0x20<link>
        ether 02:42:d8:3d:93:ac  txqueuelen 0  (Ethernet)
        RX packets 13639200  bytes 3422487848 (3.1 GiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 16286850  bytes 9921645320 (9.2 GiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```



## 3.3 논 네트워크

* 아무런 네트워크를 사용하지 않는 것을 뜻한다

```bash
# lo 외에 인터페이스가 존재하지 않는다
docker run -it --name network_none --net none ubuntu:14.04
root@b8e8bdd56ff1:/# ifconfig
lo        Link encap:Local Loopback
          inet addr:127.0.0.1  Mask:255.0.0.0
          UP LOOPBACK RUNNING  MTU:65536  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000
          RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)
```



## 3.4 컨테이너 네트워크



# 4. 요청의 종류

1. 컨테이너에서 WWW로
   * 특별한 설정 없이 가능
2. 컨테이너에서 호스트 머신으로
   * 컨테이너에서 호스트를 나타내는 특별한 도메인인 `host.docker.internal` 사용한다.
     * 도커에 의해 호스트의 ip address로 변환된다
3. 컨테이너에서 다른 컨테이너로
   * 같은 도커 네트워크에 있다면 컨테이너의 이름을 도메인으로 사용한다.
     * 도커에 의해 컨테이너의 ip address로 변환된다.
