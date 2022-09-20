# 1 도커 컨테이너

- 코드와 모든 종속성을 패키지화하여 응용 프로그램이 한 컴퓨팅 환경에서 다른 켬퓨팅 환경으로 빠르고 안정적으로 실행되도록 하는 소프트웨어 표준 단위이다.

* 이미지로 컨테이너를 생성하면 파일 시스템, 격리된 시스템 자원, 네트워크를 사용할 수 있는 독립된 공간이 생성된다.
* 컨테이너는 이미지를 읽기 전용으로 사용하고 이미지에서 변경된 사항만 Container Layer에 저장한다
  * 따라서 컨테이너에서 무엇을 하든지 원래 이미지는 영향을 받지 않는다
* 호스트와 **독립된 파일시스템**을 제공받으면 호스트와 분리되어 있어 호스트에 영향을 끼치지 않는다.
* 컨테이너에서 기본 사용자는 root이고 호스트 이름은 무작위 16진수 해시값이다.



## 1.1 왜 컨테이너를 쓸까?

1. 개발환경과 프로덕션 환경이 다른 경우

>  개발환경과 프로덕션 환경이 다른경우 예를 들면 nodejs 애플리케이션을 만들고 await을 사용 했을 때 개발환경에선 문제가 없었다. 그러나 프로덕션 환경에서 실행 했을 때 문제가 발생했다. 이유는 노드 버전 14.3이상 에서만 await을 사용할 수 있었고 개발 환경에 노드 버전이 낮아 오류가 났다. 이런 상황에서 컨테이너를 사용했으면 완전히 동일한 환경에서 실행되기 때문에 문제가 없었을 것이다.

2. 팀 내에서 개발 환경이 다른 경우

> 모든 팀 구성원들이 정확히 같은 환경에서 개발을 하기위해 필요하다.

3. 프로젝트간 버전 충돌을 막기 위해

> 예를 들면 한 프로젝트는 파이썬2 를 사용하고 다른 프로젝트는 최신 버전의 파이썬을 사용한다고 했을 때 버전 충돌이 일어날 것이다. 따라서 프로젝트를 할 때 마다 잘못된 버전을 지우고 알맞은 버전을 설치하는 일을 반복해야한다.



# 2 컨테이너 생명주기

**1.생성**

* `docker create`
  * 파일 스냅샷을 하드 디스크로 옮긴다.

**2.시작**

* `docker start`
  * 실행 될 명령어를 컨테이너에 넣고 실행한다.

**3.실행**

* `docker run` = `docker pull`(이미지가 없는 경우) + `docker create` + `docker start`

**4.중지**

* `docker stop`
  * 하던 작업들을 완료하고 컨테이너를 중지 시킨다.
* `docker kill`
  * 즉시 컨테이너를 중지 시킨다.

**5.삭제**

* `docker rm`



# 3 컨테이너 외부에 노출

* 컨테이너는 가상 머신과 마찬가지로 가상 IP 주소를 할당받는다
* 기본적으로 도커는 컨테이너에 `172.17.0.x` 의 주소를 순차적으로 할당한다
* 아무런 설정을 하지 않으면 외부에서 컨테이너에 접근할 수 없다
  * 도커가 설치된 호스트에서만 접근 가능하다
* 외부에 컨테이너를 노출하려면 eht0의 IP와 포트를 호스트의 IP와 포트에 바인딩해야 한다.

```bash
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

**컨테이너 외부 노출**

* eht0의 IP와 포트를 호스트의 IP와 포트에 바인딩한다.

```bash
# 호스트의 8000 포트를 컨테이너의 80 포트와 바인딩
docker run -it --name network_test -p 8000:80  ubuntu:14.04
# 여러개의 포트 바인딩, 호스트의 특정 IP 바인딩
docker run -it --name network_test -p 3306:3306 -p 192.168.0.100:7777:80  ubuntu:14.04
```



# 4 컨테이너 자원 할당

- 컨테이너를 생성하는 `run`, `create` 명령어에서 컨테이너의 자원 할당량을 조절할 수 있다
- 아무런 옵션을 지정하지 않으면 컨테이너는 호스트의 자원을 제한 없이 쓸 수 있다
- 컨테이너 자원 할당 옵션을 설정하지 않으면 호스트의 자원을 전부 점유해 다른 컨테이너뿐 아니라 호스트 자체의 동작도 멈출 수 있다.



## 4.1 컨테이너 자원 확인

- 컨테이너의 자원 제한을 확인하기 위해서 `docker inspect` 명령어를 사용한다.



**예시**

- HostConfig 부분에서 컨테이너의 자원 제한을 확인할 수 있다.

```bash
docker inspect mysql
...
  "HostConfig": {
    "KernelMemory": 0,
    "KernelMemoryTCP": 0,
    "MemoryReservation": 0,
    "MemorySwap": 0,
    "MemorySwappiness": null,
    "OomKillDisable": false,
    "PidsLimit": null,
    "Ulimits": null,
    "CpuCount": 0,
    "CpuPercent": 0,
    "IOMaximumIOps": 0,
    "IOMaximumBandwidth": 0,
	}
```



## 4.2 메모리 제한

- `docker run` 명령어에 `--memory` 옵션으로 메모리를 제한할 수 있다.
- 단위는 m(megabyte), g(gigabyte)
- 최소 4MB까지 제한 가능
- 컨테이너 내에서 동작하는 프로세스가 컨테이너에 할당된 메모리를 초과하면 컨테이너는 자동으로 종료된다.



**예시**

- 메모리 제한을 1GB로 설정

```bash
docker run -d \
--memory="1g" \
nginx
```



## 4.3 CPU 제한

`--cpu-shares`

- `docker run` 명령어에 `--cpu-shares` 옵션으로 CPU를 상대적으로 얼마나 사용할 수 있는지 설정한다.
- `--cpu-shares` 의 기본 값은 상대적인 값이다.
- 예를 들어 컨테이너가 두 개 있을 때 각각  `--cpu-shares` 의 값이 1024, 512 라면 각각 2:1의 비율료 CPU를 사용한다. 

 

`--cpuset-cpus`

- 호스트에 여러 CPU가 있을 때 `--cpuset-cpus` 옵션을 통해 컨테이너가 특정 CPU만 사용하도록 설정할 수 있다.

**예시**

- 컨테이너가 3 번째 CPU만 사용하도록 설정
- index가 0부터 시작

```bash
docker run -d \
--cpuset-cpus=2 \
...
```



참고

* [Kubernetes and Docker - An Enterprise Guide](https://www.amazon.com/Kubernetes-Docker-Effectively-containerize-applications/dp/183921340X)
* [시작하세요! 도커/쿠버네티스](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9791158392291)