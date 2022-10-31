# 1 Kubernetes Components

![image-20210930203721871](./images/components.png)

* Cluster
  * 노드의 집합으로 Master Node와 Worker Node로 구성되어 있다
* Worker Node
  * 컨테이너화된 애플리케이션을 실행한다.
* Master Node
  * 다른 노드를 관리한다.
  * Control Plane Components가 실행되는 곳



# 2 Control Plane Components

> 전체 쿠버네티스 시스템을 관리하고 통제하는 쿠버네티스 컨트롤 플레인을 관장

* Control Plane Components에는 API Server, Scheduler, Controller Manager, etcd가 있다.
* Control Plane Components는 클러스터를 관리하는 기능을 제공한다
* Control Plane Components는 단일 마스터 노드에서 실행되거나 여러 노드로 분할되고 복제돼 고가용성이 보장된다
* 마스터 노드에서는 클러스터의 상태를 유지하고 제어하지만 애플리케이션을 실행하지 않음



## 2.1 API Server

* API Server는 Control Plane Component이다.
* API Server는 control plane의 프론트엔드라고 할 수 있다.
* Worker Node의 kubelet과 커뮤니케이션 한다.
* 오직 API Server만이 etcd와 직접적인 커뮤니케이션이 가능하다.
* kubectl 요청이 API Server에 전달된다



**API Server가 하는 일**

* 유저 인증: 권한 확인
* 요청 검증: 문법 확인
* 데이터 조회(etcd)
* etcd 업데이트



## 2.2 Scheduler

* 현재 노드의 상태를 점검하고 pod를 배치할 최상의 노드를 결정하는 역할을 한다
* 실제로 pod를 생성하는 것은 선택된 노드의 kubelet이다
* API Server가 etcd의 노드 정보를 가지고 Scheduler에게 파드를 어디에 배치할지 요청한다.



**Schedule 과정**

1. Filter Nodes: pod의 cpu 요구량 등을 충족시키지 못하는 노드를 배제한다
2. Rank Nodes: 남은 노드의 점수를 매기고 가장 높은 노드를 선정



## 2.3 Controller-Manager

* Worker Node를 모니터링하고 제어한다.
* 구성 요소 복제, 워커 노드 추적, 노드 장애 처리 등 클러스터 수준 기능을 실행
* Node Controller와  Replication Controller등으로 구성된다



**Node Controller**

* 노드의 상태를 모니터링 하고 적절한 조치를 취하는 역할을 한다
* 일정 간격으로 워커 노드로 부터 하트 비트를 받는다
* 일정 기간동안 한 워커 노드로 부터 하트 비트를 받지 못하면 해당 노드의 팟을 다른 정상적인 노드로 옮긴다



**Replication Controller**

* Replica Set의 상태를 모니터링 하고 Replica Set의 목표 상태를 유지하도록 조치하는 역할을 한다
* 예시) pod하나가 죽으면 pod을 새로 뛰운다



## 2.4 etcd

* etcd는 클러스터 구성을 지속적으로 저장하는 안정적인 분산 키 밸류 데이터 스토리지다
* 분산저장이 가능하므로 하나의 etcd에 장애가 나더라도 시스템의 가용성을 확보할 수 있다.
* 클러스터의 구성 요소들의 모든 상태 값이 저장되는 곳
  * Node, Pod, Config, Secrets, Accounts, Roles 등의 정보
  * `kubectl get` 로 조회하는 모든 정보들이 etcd에 들어있다
* etcd 외의 다른 구성요소는 상태 값을 관리하지 않는다
* 오직 API Server만이 etcd와 직접적인 커뮤니케이션이 가능하다.



## 2.5 Ports

- [레퍼런스](https://kubernetes.io/docs/reference/ports-and-protocols/#control-plane)

| Protocol | Direction | Port Range | Purpose                 | Used By              |
| -------- | --------- | ---------- | ----------------------- | -------------------- |
| TCP      | Inbound   | 6443       | Kubernetes API server   | All                  |
| TCP      | Inbound   | 2379-2380  | etcd server client API  | kube-apiserver, etcd |
| TCP      | Inbound   | 10250      | Kubelet API             | Self, Control plane  |
| TCP      | Inbound   | 10259      | kube-scheduler          | Self                 |
| TCP      | Inbound   | 10257      | kube-controller-manager | Self                 |



# 3 Node Components

* Node Components에는 docker, kubelet, kube-proxy가 있다.
* Node Components는 모든 node에서 실행된다
  * 즉 master node, worker node 모두에서 실행된다



## 3.1 kubelet

* 클러스터 내에 모든 노드에서 실행되는 에이전트이다.
* Master Node와 커뮤니케이션을 위해 필요함



**kubelet의 역할**

* 쿠버네티스 클러스터에 노드를 등록한다
* pod를 생성하기 위해 컨테이너 런타임에 요청을 전달한다.
* 노드와 pod 모니터링하고 그 결과를 kube-apiserver에 주기적으로 전송한다.



**cAdvisor**

- kubelet에는 cAdvisor가 포함됨
- cAdvisor는 Node의 자원 사용량을 모니터링하고 컨테이너의 성능을 분석한다.
- 특정 Node에서 실행되고 있는 모든 Container의 CPU와 Memory, File, Network 사용량 등 System metrics 정보를 수집한다.
- cAdvisor는 수집한 정보를 kubelet의 메모리에 올려놓는다.



## 3.2 kube-proxy

* kube-proxy는 쿠버네티스 클러스터 내 모든 노드에서 실행되는 프로세스다.
* Node 와 Pod 의 네트워크 커뮤니케이션을 관리힌다
* kube-proxy는 각각의 노드에서 network rules을 관리한다.
* 기본적으로 kube-proxy가 iptable(network rules)을 관리해 파드 네트워크를 가능하게 한다.



## 3.3 Container runtime

* 컨테이너 런타임은 컨테이너 실행을 담당하는 소프트웨어이다.
* 대표적으로 Docker, containerd가 있다.



## 3.4 Ports

| Protocol | Direction | Port Range  | Purpose            | Used By             |
| -------- | --------- | ----------- | ------------------ | ------------------- |
| TCP      | Inbound   | 10250       | Kubelet API        | Self, Control plane |
| TCP      | Inbound   | 30000-32767 | NodePort Services† | All                 |



참고

- https://kubernetes.io/docs/concepts/overview/components/