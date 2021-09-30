# 1. 쿠버네티스



## 1.1 쿠버네티스의 개념

> 쿠버네티스는 배포, 스케일링, 그리고 컨테이너화된 애플리케이션의 관리를 자동화 해주는 오픈 소스 컨테이너 오케스트레이션 엔진이다.



## 1.2 왜 쿠버네티스가 필요한가?

* 컨테이너에 이상이 있거나 정지될 때 다시 시작시킬 필요가 있다.
  * 모니터링
  * 컨테이너 헬스 체크
  * 자동 재배포
* 트래픽이 많을 때 더 많은 컨테이너가 필요하다.
  * Autoscaling
* 트래픽을 분산시킬 필요가 있다.
  * Load Balancer
* 하드웨어 활용도 극대화
  * 클러스터 노드의 가용 리소스에 최대한 맞춰 서로 섞고 매치 플리케이션 구성 요소를 자유롭게 이동할 수 있다.
  * 노드의 하드웨어 리소스를 최상으로 활용
* 애플리케이션 개발 단순화
  * 새로운 버전 출시 시 자동으로 테스트, 이상 발견 시 롤 아웃



## 1.3 개발자가 할 일 / 쿠버네티스가 할 일

개발자

* 클러스터와 노드 인스턴스를 만든다.( master + worker node)
* API server, kubelet 등 필요한 서비스나 소프트웨어를 노드에 설치한다.
* Load Balancer, Filesystems 과 같이 추가적으로 필요한 리소스를 만든다.

쿠버네티스

* 오브젝트를 만들고 관리한다.
* pod을 모니터링하고 다시 만든다
* Pod을 scaling한다.

# 2. Cluster Architecture

* Cluster: 노드의 집합으로 Master Node와 Worker Node로 구성되어 있다
  * Worker Node : 컨테이너화된 애플리케이션을 실행한다.
  * Master Node: 다른 노드를 관리한다.



## 2.1 Master Node

> 전체 쿠버네티스 시스템을 관리하고 통제하는 쿠버네티스 컨트롤 플레인을 관장

* Master Node는 API Server, Scheduler, Controller Manager, etcd로 구성되어 있다



>  **컨트롤 플레인**
>
>  * 컨트롤 플레인에서는 클러스터를 관리하는 기능
>  * 단일 마스터 노드에서 실행하거나 여러 노드로 분할되고 복제돼 고가용성을 보장
>  * 클러스터의 상태를 유지하고 제어하지만 애플리케이션을 실행하지 않음



### 2.1.1 API Server

* Worker Node의 kubelet과 커뮤니케이션 한다.
* kubectl 요청이 API Server에 전달된다
* API Server가 하는 일
  * 유저 인증
  * 요청 검증
  * 데이터 조회(etcd)
  * etcd 업데이트



### 2.1.2 Scheduler

* 현재 노드의 상태를 점검하고 pod를 배치할 최상의 노드를 결정하는 역할을 한다
  * 실제로 pod를 생성하는 것은 선택된 노드의 kubelet이다

**Schedule 과정**

1. Filter Nodes: pod의 cpu 요구량 등을 충족시키지 못하는 노드를 배제한다
2. Rank Nodes: 남은 노드의 점수를 매기고 가장 높은 노드를 선정



### 2.1.3 Controller-Manager

* Worker Node를 모니터링하고 제어한다.
* 구성 요소 복제, 워커 노드 추적, 노드 장애 처리 등 클러스터 수준 기능을 실행
* Node Controller와  Replication Controller등으로 구성된다
* Node Controller
  * 노드의 상태를 모니터링 하고 적절한 조치를 취하는 역할을 한다
  * 일정 간격으로 워커 노드로 부터 하트 비트를 받는다
  * 일정 기간동안 한 워커 노드로 부터 하트 비트를 받지 못하면 해당 노드의 팟을 다른 정상적인 노드로 옮긴다
* Replication Controller
  * Replica Set의 상태를 모니터링 하고 Replica Set의 목표 상태를 유지하도록 조치하는 역할을 한다
  * 예시) pod하나가 죽으면 pod을 새로 뛰운다



### 2.1.4 etcd

* etcd는 클러스터 구성을 지속적으로 저장하는 안정적인 분산 키 밸류 데이터 스토리지다
* 클러스트 내에 정보들을 저장하는 곳
  * Node, Pod, Config, Secrets, Accounts, Roles 등의 정보
  * `kubectl get` 로 조회하는 모든 정보들이 etcd에 들어있다



## 2.2 Worker Node

> 실제 배포하고자 하는 애플리케이션의 실행을 담당

* Worker Node는 docker, kubelet, kube-proxy로 구성되어 있다



### 2.2.1 kubelet

* Master Node와 커뮤니케이션을 위해 필요함
* kubelet의 역할
  * 쿠버네티스 클러스터에 노드를 등록한다
  * pod를 생성한다
  * 노드와 pod 모니터링 한다



### 2.2.2 kube-proxy

* kube-proxy는 쿠버네티스 클러스터 내 모든 노드에서 실행되는 프로세스다.
* Node 와 Pod 의 네트워크 커뮤니케이션을 관리힌디

# 3 리소스

## 3.1 pod

* 하나 이상의 어플리케이션 컨테이너와 그들의 리소스(volumes, IP, run config)를 가지고있다.

  * 하나의 container를 갖는 것이 권장된다.

* 쿠버네티스(Master Node)에 의해 생성되고 관리된다.

* 다른 pod와 리소스(volumes)를 공유 할 수 있다.

* Cluster-internal IP를 가지고 있다.

  * 클러스터 밖에서 접근 할 수 없다.
  * pod가 교체되면 IP 주소 또한 바뀐다.

* 한 pod에 포함된 container끼리  localhost를 통해 통신할 수 있다.

* pod는 수명이 짧다. 

  * 쿠버네티스는 필요에따라 pod를 시작하고 중지하고 교체한다.



## 3.2 Deployment(controller)

* pod들을 제어한다.  

  * 개발자가 직접 pod를 제어하지 않고 대신 Deployment를 사용해 원하는 상태를 유지시킨다.

* Deployment는 중지, 삭제, 롤백이 가능하다.

* Deployment는 스케일링 될 수 있다. 

* ```yaml
  #config.yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: second-app-deployment
  spec:
    replicas: 1
    selector:
      matchLabels:
        app: second-app
        tier: backend
    template:
      metadata:
        labels:
          app: second-app
          tier: backend
      spec:
        containers:
          - name: second-node
            image: neptunes032/kube-first-app:2
  
  
  ```



## 3.3 Services

* pod를 클러스터 또는 외부에서 접근할 수 있게 노출시켜준다.

* 변하지 않는 IP 주소를 가지고있다.

* ```yaml
  # service.yaml
  apiVersion: v1
  kind: Service
  metadata:
    name: backend
  spec:
    selector:
      app: second-app
    ports:
      - protocol: "TCP"
        port: 80
        targetPort: 8080
    type: LoadBalancer
  ```



## 3.4 Volumes

* `volume` 의 생명주기는 `pod` 의 생명주기와 같다.
  * `pod` 를 지우면 `volume` 또한 지워진다.
* `container` 를 재시작하거나 지워도 `volume` 은 지워지지 않는다.



# 4. kubectl

* 쿠버네티스 커맨드 라인 도구인 `kubectl` 사용하면 쿠버네티스 클러스터에 대해 명령을 실행할 수 있다.



## Imperative vs. Declarative

Imperative

* `kubectl create deployment`
* `docker run` 만 사용하는 것과 유사하다.

Declarative

* `kubectl apply -f config.yaml`

  * ```yaml
    #config.yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: second-app-deployment
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: second-app
          tier: backend
      template:
        metadata:
          labels:
            app: second-app
            tier: backend
        spec:
          containers:
            - name: second-node
              image: neptunes032/kube-first-app:2
    
    ```

* `docker compose` 를 사용하는 것과 유사하다.



# 5. 로컬에서 Minikube로 dummy cluster 만들기

Minikube

* vm을 활용해 로컬에서 kubenetes를 사용하고 테스트해 볼 수 있게 해주는 도구
* `minikube` 는 개인용 컴퓨터(윈도우, macOS 및 리눅스 PC 포함)에서 단일 노드 쿠버네티스 클러스터를 실행하여 쿠버네티스를 사용해보거나 일상적인 개발 작업을 수행할 수 있다.

1. 가상화가 가능한지 체크

```shell
sysctl -a | grep -E --color 'machdep.cpu.features|VMX'
```

![image-20201210171407808](/Users/YT/GoogleDrive/dev/TIL2/kubernetes/kubernetes/image-20201210171407808.png)

2. install kubectl

```shell
brew install kubectl
# 설치 확인
kubectl version --client
```

![image-20201210172003604](/Users/YT/GoogleDrive/dev/TIL2/kubernetes/kubernetes/image-20201210172003604.png)

3. virtualbox 설치

* https://www.virtualbox.org/wiki/Downloads

4. install minikube 및 cluster 구성
   * cluster를 구성해준다
   * Master node 와 worker node 를 만들어주고 필요한 소프트웨어도 설치된다.

```shell
brew install minikube
# cluster 만들기
minikube start --driver=virtualbox
minikube status
```

5. 대시보드 보기

```shell
# 대시보드 활설화
minikube dashboard
```

![image-20201210173406071](/Users/YT/GoogleDrive/dev/TIL2/kubernetes/kubernetes/image-20201210173406071.png)
