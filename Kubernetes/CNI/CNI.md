# 1 CNI

- Container Networking Interface
- Cloud Native Computing Foundation의 프로젝트
- CNI(Container Network Interface)는 리눅스 컨테이너에서 네트워크 인터페이스를 구성하기 위한 플러그인의 작성 규격과 라이브러리로 구성되어 있다 
- CNI는 컨테이너의 네트워크 연결과 컨테이너가 삭제될 때 할당된 자원을 제거하는 것에 초점을 두고 있다.

<br>

## 1.1 CNI의 목적

- 리눅스의 컨테이너 영역 내에서 네트워킹은 매우 환경에 특화되어 있기 때문에 제각기 다루는 방법이 다르다.
- 규격화된 공통 인터페이스를 정의하고 이를 구현한 플러그인을 사용하면 중복 개발 문제를 해결할 수 있다.

<br>

## 1.2 컨테이너 네트워크 설정 과정

- 리눅스에 브리지를 사용해 컨테이너 런타임들은 컨테이너를 생성할 때 아래와 같은 네트워크 설정 과정을 거친다.

<br>

**네트워크 설정 과정**

1. Create Network Namespace
2. Create Bridge Network/Interface
3. Create VETH Pairs (Pipe, Virtual Cable) 
4. Attach vEth to Namespace
5. Attach Other vEth to Bridge
6. Assign IP Addresses
7. Bring the interfaces up
8. Enable NAT – IP Masquerade



컨테이너를 생성하면 위 과정을 반복적으로 해야한다. 2-8 번 과정을 스크립트로 만들어 브리지 네트워크를 구성할 수 있다. 예를들어 아래와 같이 bridge라는 프로그램을 만들어서 컨테이너와 네임스페이스를 아규먼트로 받아 2-8번 과정을 자동으로 해준다.

``````bash
bridge add <container_id> <namespace>
``````

그렇다면 우리가 직접 이러한 스크립트를 짜야할까? CNI 스펙을 구현한 컨테이너 런타임과 플러그인을 사용하면 쉽게 컨테이너 네트워크를 설정할 수 있다. 컨테이너가 생성되면 컨테이너 런타임이 2-8번 과정을 직접하는게 아니라 이미 구현된 BRIDGE 플러그인 호출을 통해 처리하기 때문이다.

<br>

# 2 CNI 조건

- CNI는 컨테이너 런타임과 플러그인의 스펙을 정의했다.
- 컨터이너 런타임을 컨테이너가 생성되거나 제거될 때 플러그인을 호출해 컨테이너 네트워크를 설정한다.

<br>

## 2.1 컨테이너 런타임 스펙

- Container Runtime must create network namespace
- Identify network the container must attach to
- Container Runtime to invoke Network Plugin (bridge) when container is ADDed.
- Container Runtime to invoke Network Plugin (bridge) when container is DELeted.
- JSON format of the Network Configuration



**docker**

- docker 컨테이너 런타임은 CNI를 구현하지 않았다.
- docker는 다른 표준인 CNM(Container Network Model)을 구현했다.

<br>

## 2.2 플러그인 스펙

- Must support command line arguments ADD/DEL/CHECK
- Must support parameters container id, network ns etc..
- Must manage IP Address assignment to PODs
- Must Return results in a specific format



**Kubernetes network model**

- [레퍼런스](https://kubernetes.io/docs/concepts/services-networking/#the-kubernetes-network-model)
- 플러그인은 아래와 같은 Kubernetes network model의 조건을 만족 시켜야한다.

1. Every pod in a cluster gets its own unique cluster-wide IP address.
2. pods can communicate with all other pods on any other node without NAT
3. agents on a node (e.g. system daemons, kubelet) can communicate with all pods on that node



**NAT가 없으면**

- 파드 A가 네트워크 패킷을 보내기위해 파드 B에 연결할 때 파드 B가 보는 출발지 IP는 파드 A의 IP주소와 동일하다.
- NAT가 없기 때문에 패킷의 목적지와 출발지   주소는 변하지 않는다.

<br>

# 3 CNI 플러그인

- 지원되는 플러그인
- BRIDGE, VLAN, IPVLAN, MACVLAN, WINDOWS
- DHCP, host-local
- weave, flannel, cilium, calico



**CNI 플러그인 조회**

```bash
$ ls /opt/cni/bin/
bandwidth  bridge  calico  calico-ipam  dhcp  firewall  flannel  host-device  host-local  install  ipvlan  loopback  macvlan  portmap  ptp  sbr  static  tuning  vlan
```



**설정된 플러그인 조회**

```bash
$ ls /etc/cni/net.d/
10-flannel.conflist

$ cat /etc/cni/net.d/10-flannel.conflist
{
  "name": "cbr0",
  "cniVersion": "0.3.1",
  "plugins": [
    {
      "type": "flannel",
      "delegate": {
        "hairpinMode": true,
        "isDefaultGateway": true
      }
    },
    {
      "type": "portmap",
      "capabilities": {
        "portMappings": true
      }
    }
  ]
}
```
