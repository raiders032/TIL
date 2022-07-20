# 1 Network Topology

* 네트워크를 구성하는 노드들의 연결 형태에 따라 네트워크를 구분할 수 있다
* 노드와 노드를 어떻게 연결하는지에 따라 throughput과 reliability에 많은 영향을 미친다
  * reliability: 예를 들면 버스나 스타 네트워크는 단일 노드가 고장 난다면 네트워크 전체가 정상작동하지 못한다
* 일반적으로 상호 연결이 많을수록 네트워크는 더 강건해지지만 설치 비용이 더 많이 든다.
* 따라서 상황에 맞는 적합한 Network topology를 선택해 적용해야 한다



**여러 종류의 Network Topology **

![img](https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/NetworkTopologies.svg/220px-NetworkTopologies.svg.png)



# 2 Bus Network

![img](https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/BusNetwork.svg/220px-BusNetwork.svg.png)

* 모든 노드가 공통 half-duplex link(Bus)에 연결된 네트워크
* 원래의 이더넷에서 사용된 레이아웃이었다.
* data link layer에서 흔히 사용되는 토폴로지

> 참고
>
> * https://en.wikipedia.org/wiki/Bus_network



# 3 Star Network

![img](https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/StarNetwork.svg/220px-StarNetwork.svg.png)

* 모든 노드가 중앙 노드에 연결된 형태
* switched Ethernet LAN에서 주로 찾아 볼수 있는 토폴로지
  * 집에서 사용하는 공유기가 중앙 노드라고 생각하면 된다

> 참고
>
> * https://en.wikipedia.org/wiki/Star_network



# 4 Mesh Network

![img](https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/NetworkTopology-Mesh.svg/220px-NetworkTopology-Mesh.svg.png)

* 각각의 노드가 서로 그물처럼 연결된 형태

> 참고
>
> * https://en.wikipedia.org/wiki/Mesh_networking