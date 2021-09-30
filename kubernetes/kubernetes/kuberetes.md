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
