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



# 2. pod 생성하기

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
