# 1. Service

* pod의 내부 IP 주소를 확인하고 포드로 접근할 수 있지만 이는 로컬 개발 환경 또는 쿠베네티스 클러스터 내부에서만 사용할 수 있다
  * 게다가 포드의 IP 주소는 영속적이지 않아 변할 수 있다
* Deployment가 pod를 생성할 때 pod를 외부로 노출하지 않는다
  * `containerPort`를 지정해도 pod가 바로 외부로 노출되는 것이 아니다
* pod를 외부로 노출해 사용자가 접근할 수 있도록 하려면 **Service**라는 오브젝트를 사용해야 한다
* Service는 여러 종류가 있으나 `ClusterIP`, `NodePort`, `LoadBalancer` 3가지 종류를 주로 사용합니다

 

**Service의 핵심 기능**

* 여러 개의 포드에 쉽게 접근할 수 있도록 고유한 도메인 이름을 부여한다
* 여로 개의 포드에 접근할 때, 요청을 분산하는 로드 밸랜서 기능을 제공한다
* 클라우드 플랫폼의 로드 밸랜서, 클러스터 노드의 포트 등을 통해 포트를 외부로 노출한다



# 2. ClusterIP

* 쿠버네티스 내부에서만 pod를 접근할 때 사용한다
* 외부로 pod를 노출하지 않기 때문에 클러스터 내부에서만 사용되는 pod에 사용한다



## 2.1 yaml 작성

**실습을 위한 deployment**

* 호스트의 이름을 반환하는 웹 서버

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hostname-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: webserver
  template:
    metadata:
      name: my-webserver
      labels:
        app: webserver
    spec:
      containers:
      - name: my-webserver
        image: alicek106/rr-test:echo-hostname
        ports:
        - containerPort: 80
```



**hostname-svc-clusterip.yaml 작성**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: hostname-svc-clusterip
spec:
  ports:
    - name: web-port
      port: 8080
      targetPort: 80
  selector:
    app: webserver
  type: ClusterIP
```

`spec.selector`

* 어떠한 라벨을 가진 포드에 접근할 수 있게 만들지 결정한다

`spec.ports.port`

* 생성된 서비스는 서비스는 클러스터 내부에서 사용할 수 있는 IP를 할당 받는다
* `spec.ports.port`는 할당 받은 IP에 접근할 때 사용할 포트를 설정한다

`spec.ports.targetPort`

* `selector` 접근하려는 pod들이 내부적으로 사용하고 있는 포트를 입력한다
* pod 템플릿에 정의된 `containerPort`와 같은 값으로 설정한다

`spec.type`

* 서비스의 타입을 지정한다
* ClusterIP, NodePort, LoadBalancer 등을 설정할 수 있다



## 2.2 생성 및 확인

```bash
# 서비스 생성
$ kubectl apply -f hostname-svc-clusterip.yaml

# 서비스 목록 조회
$  kubectl get svc
NAME                     TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
hostname-svc-clusterip   ClusterIP      10.108.80.60    <none>        8080/TCP         78s
kubernetes               ClusterIP      10.96.0.1       <none>        443/TCP          47h
```



## 2.3 접근

* 생성된 서비스를 통해 pod에 접근하려면 CLUSTER-IP 와 PORT를 통해 요청을 보내면 된다
* CLUSTER-IP는 쿠버네티스 클러스터에서만 사용할 수 있는 내부 IP이다
* 서비스의 IP 또는 서비스의 이름과 포트 통해 pod에 접근할 수 있다
* 별도의 설정 없이 로드 밸런싱이 수행된다

```bash
# 임시 pod를 만들어 요청을 전송해보자
$ kubectl run -it --rm debug --image=alicek106/ubuntu:curl --restart=Never -- bash

# 서비스의 IP와 포트로 pod 접근하기
$ curl 10.108.80.60:8080 --silent | grep Hello
        <p>Hello,  hostname-deployment-7dfd748479-jm7b4</p>     </blockquote>
$ curl 10.108.80.60:8080 --silent | grep Hello
        <p>Hello,  hostname-deployment-7dfd748479-lxf5f</p>     </blockquote>
$ curl 10.108.80.60:8080 --silent | grep Hello
        <p>Hello,  hostname-deployment-7dfd748479-qxvhx</p>     </blockquote>

# 서비스의 이름으로 pod 접근하기
$ curl hostname-svc-clusterip:8080 --silent | grep Hello
        <p>Hello,  hostname-deployment-7dfd748479-jm7b4</p>     </blockquote>
$ curl hostname-svc-clusterip:8080 --silent | grep Hello
        <p>Hello,  hostname-deployment-7dfd748479-lxf5f</p>     </blockquote>
$ curl hostname-svc-clusterip:8080 --silent | grep Hello
        <p>Hello,  hostname-deployment-7dfd748479-lxf5f</p>     </blockquote>
```

# 3. NodePort

* NodePort 타입을 사용하면 외부에서 pod에 접근할 수 있다
* pod에 접근할 수 있는 포트를 클러스터의 모든 노드에 동일하게 개방한다
  * 클러스터의 모든 노드의 내부 IP 또는 외부 IP를 통해 개방된 포트로 접근하면 pod에 접근할 수 있다
* 접근할 수 있는 포트는 랜덤으로 정해진다
  * 특정 포트로 접근할 수 있게 설정할 수도 있다
* 실제 운영 환경에서 NodePort로 서비스를 외부에 제공하는 경우는 많지 않다
  * SSL 인증서 적용, 라우팅 등과 같은 복잡한 설정을 서비스에 적용하기 어렵기 때문
  * NodePort 서비스 그 자체를 사용하기 보다 인그레스 오브젝트를 통해 간접적으로 사용하는 경우가 많다



## 3.1 yaml 작성

**hostname-svc-nodeport.yaml 작성**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: hostname-svc-nodeport
spec:
  ports:
    - name: web-port
      port: 8080
      targetPort: 80
  selector:
    app: webserver
  type: NodePort
```



## 3.2 생성 및 확인

* 서비스의 `30914`라는 포트는 모든 노드에서 동일하게 접근할 수 있게 개방된 포트를 의미한다
* 개방되는 포트는 기본적으로 30000 ~ 32768 중 랜덤으로 선택된다
  * 포트를 지정하고 싶다면 yaml에 `spec.ports.nodePort`으로 원하는 포트를 선택할 수 있다

```bash
# 서비스 생성
$ kubectl apply -f hostname-svc-nodeport.yaml
service/hostname-svc-nodeport created

# 서비스 목록 조회
$ kubectl get svc
NAME                    TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
hostname-svc-nodeport   NodePort    10.100.132.250   <none>        8080:30914/TCP   13s
kubernetes              ClusterIP   10.96.0.1        <none>        443/TCP          4m13s
```



## 3.3 접근

* 클러스터의 모든 노드에 내부 IP 또는 외부 IP를 통해 `30914` 포트로 접근하면 동일한 서비스에 연결할 수 있다
* `NodePort`  타입의 서비스가 `ClusterIP` 타입의 서비스의 기능을 포함하고 있기 때문에 CLUSTER-IP 또는 서비스 이름을 이용해 pod에 접근할 수 있다
  * 즉 `NodePort`  타입의 서비스는 내부 네트워크와 외부 네트워크 양쪽에서 접근할 수 있다

```bash
# 노드 목록 조회
$ kubectl get nodes -o wide
NAME         STATUS   ROLES                  AGE   VERSION   INTERNAL-IP   EXTERNAL-IP   OS-IMAGE                KERNEL-VERSION                CONTAINER-RUNTIME
gcloud-238   Ready    control-plane,master   47h   v1.21.3   10.7.27.17    <none>        CentOS Linux 7 (Core)   3.10.0-1160.15.2.el7.x86_64   docker://20.10.6
gcloud-239   Ready    <none>                 47h   v1.21.3   10.7.27.18    <none>        CentOS Linux 7 (Core)   3.10.0-1160.15.2.el7.x86_64   docker://20.10.6
gcloud-240   Ready    <none>                 47h   v1.21.3   10.7.27.19    <none>        CentOS Linux 7 (Core)   3.10.0-1160.25.1.el7.x86_64   docker://20.10.7

# 임시 pod를 만들어 요청을 전송해보자
$ kubectl run -it --rm debug --image=alicek106/ubuntu:curl --restart=Never -- bash

# 클러스터의 모든 노드의 내부 IP:`30914` 포트로 접근하면 동일한 서비스에 연결할 수 있다
$ curl 10.7.27.17:30914  --silent | grep Hello
        <p>Hello,  hostname-deployment-7dfd748479-lxf5f</p>     </blockquote>
$ curl 10.7.27.18:30914  --silent | grep Hello
        <p>Hello,  hostname-deployment-7dfd748479-lxf5f</p>     </blockquote>
$ curl 10.7.27.19:30914  --silent | grep Hello
        <p>Hello,  hostname-deployment-7dfd748479-jm7b4</p>     </blockquote>

# CLUSTER-IP "10.100.132.250"을 사용해 요청
$ curl 10.100.132.250:8080 --silent | grep Hello
        <p>Hello,  hostname-deployment-7dfd748479-qxvhx</p>     </blockquote>
$ curl 10.100.132.250:8080 --silent | grep Hello
        <p>Hello,  hostname-deployment-7dfd748479-jm7b4</p>     </blockquote>
$ curl 10.100.132.250:8080 --silent | grep Hello
        <p>Hello,  hostname-deployment-7dfd748479-lxf5f</p>     </blockquote>

# 서비스의 이름을 사용해 요청
$ curl hostname-svc-nodeport:8080 --silent | grep Hello
        <p>Hello,  hostname-deployment-7dfd748479-qxvhx</p>     </blockquote>
$ curl hostname-svc-nodeport:8080 --silent | grep Hello
        <p>Hello,  hostname-deployment-7dfd748479-qxvhx</p>     </blockquote>
$ curl hostname-svc-nodeport:8080 --silent | grep Hello
        <p>Hello,  hostname-deployment-7dfd748479-jm7b4</p>     </blockquote>
```



# 4. LoadBalancer

* 클라우드 플랫폼에서 제공하는 로드 밸런서를 동적으로 프로비저닝해 포드에 연결한다
* 외부에서 pod를 접근할 수 있다
* 일반적으로 AWS, GCP 등과 같은 클라우드 플랫폼 환경에서 사용할 수 있다
  * 온프레미스 환경에서 LoadBalancer를 사용하려면 MetalLb나 오픈스택 같은 특수한 환경을 직접 구축해야한다
* LoadBalancer 타입의 서비스는 클라우드 플랫폼으로부터 도메인 이름과 IP 주소를 할당받기 때문에 NodePort 보다 쉽게 pod에 접근할 수 있다
  * NodePort 는 각 노드의 IP 주소를 알아야 pod에 접근할 수 있다 

## 4.1 yaml 작성

```yaml
apiVersion: v1
kind: Service
metadata:
  name: hostname-svc-lb
spec:
  ports:
    - name: web-port
      port: 80
      targetPort: 80
  selector:
    app: webserver
  type: LoadBalancer
```



 참고

* http://www.yes24.com/Product/Goods/84927385