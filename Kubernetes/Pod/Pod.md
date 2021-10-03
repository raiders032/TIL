# 1. pod

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



**꼭 Pod는 하나의 컨테이너만 가져야할까?**

* Nginx 컨테이너가 실행되기 위해 부가적인 기능이 필요할 수 있다.
  * 하나의 완전한 어플리케이션을 주된 컨테이너와 보조적인 컨테이너가 구성하는 것
  * 예를 들면 로그 수집를 수집해주는 컨테이너를 Nginx 컨테이너와 함께 포드에 포함시킬 수 있다
* 이런 부가적인 컨테이너를 사이드카 컨테이너라고 부른다
* 사이드카 컨테이너는 포드 내의 다른 컨테이너와 네트워크 환경을 공유하기 때문에 포드에 포함된 컨테이너들은 모두 같은 워커 노드에서 실행된다



# 2. pod 생성하기

* pod를 아래처럼 직접 정의해서 사용하는 일은 없다.
* deployment를 이용해 pod를 관리한다

**nginx-pod.yml 작성**

```yml
apiVersion: v1
kind: Pod
metadata:
  name: my-nginx-pod
spec:
  containers:
  - name: my-nginx-container
    image: nginx:latest
    ports:
    - containerPort: 80
      protocol: TCP
```

`apiVersion`: 오브젝트 API 버전을 나타낸다

`kind`: 리소스의 종류를 나타낸다

`metadata`: 라벨, 주석, 이름 등과 같은 리소스의 부가 정보를 입력한다

`spec`: 리소스를 생성하기 위한 자세한 정보를 입력한다.



**포드 생성하기**

```bash
# 포드 생성
$ kubectl apply -f nginx-pod.yml
pod/my-nginx-pod created

# 포드 조회
$ kubectl get pods
NAME                       READY   STATUS    RESTARTS   AGE
my-nginx-pod               1/1     Running   0          20s
```
