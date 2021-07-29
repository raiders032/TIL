# 1. Replica Set



## 1.1 Replica Set을 사용하는 이유

**pod를 사용자가 직접 정의하고 사용하는 경우**

* yaml 파일에 pod만 정의해 사용하는 경우 해당 포드는 사용자에 의해서 관리된다
* 단순 테스트 용도로는 가능할지 몰라도 운영 단계에서 이런 방식은 사용하기 어렵다
  * 여러 개의 동일한 pod로 요청을 분산해야한다.
  * pod가 삭제되거나 장애가 발생한 경우 직접 pod를 다시 생성하고 복구해야한다
* 따라서 pod만 정의해서 사용하는 경우는 거의 없다
  * 이러한 한계점을 해결해주는 **Replica Set**이라는 쿠버네티스 오브젝트를 사용한다

**Replica Set을 사용하는 경우**

* Replica Set의 역할
  * 사용자가 직접 `pod`를 관리하는 것이 아니라 **Replica Set**이 `pod`를 관리해준다
  * 정해진 수의 동일한 `pod`가 항상 실행되도록 관리한다
  * 장애 등의 이유로 포드를 사용할 수 없다면 다른 노드에 `pod`를 다시 생성한다.



## 1.2 Replica Set 사용하기

**replicaset-nginx.yaml 작성**

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: replicaset-nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-nginx-pods-label
  template:
    metadata:
      name: my-nginx-pod
      labels: 
        app: my-nginx-pods-label
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80
```

`spec.replicas`

* 동일한 pod를 몇 개 유지할 것인지 설정한다.

`spec.template`

* pod를 생성할 때 사용할 템플릿을 정의한다.
* 어떠한 pod를 생성할 것인지 명시하는 것으로 보통 `포드 스펙`, `포드 템플릿`이라고 불린다.



**Replica Set 사용하기**

```bash
$ kubectl apply -f replicaset-nginx.yaml
replicaset.apps/replicaset-nginx created

# pod 목록 확인
$ kubectl get po
NAME                       READY   STATUS    RESTARTS   AGE
replicaset-nginx-bnjcs     1/1     Running   0          24s
replicaset-nginx-cb5d8     1/1     Running   0          24s
replicaset-nginx-s8pmc     1/1     Running   0          24s

# replica set 목록 확인
$ kubectl get rs
NAME                 DESIRED   CURRENT   READY   AGE
replicaset-nginx     3         3         3       47s

# replica set 삭제
$ kubectl delete -f replicaset-nginx.yaml
```



## 1.3 Replica Set의 동작 원리

* `replica set`은 `pod`와 라벨 셀렉터로 느슨하게 연결되어 있다
* `replica set`은 `spec.selector.matchLabels`에 정의된 라벨을 통해 생성할 포드를 찾는다
  * 정의된 라벨을 가지는 포드의 개수가 `spec.replicas` 항목에 정의된 개수와 일치하지 않으면 포드를 생성하거나 삭제하여 개수를 일치시킨다

> **Label**
>
> * 쿠버네티스 리소스를 분류할 때 사용하는 메타데이터
> * 서로 다른 오브젝트가 서로를 찾을 때 사용한다



# 2. Deployment

* `replica set`으로 충분할 것 같지만 운영 환경에서 Replica Set을 직접 정의하고 사용하는 경우는 거의 없다
* 보통 `replica set`과 `pod` 정보를 정의하는 **Deployment** 오브젝트를 정의해 사용한다
  * `Deployment`는 `replica set`의 상위 오브젝트이기 때문에 `Deployment` 생성시 `replica set`도 함께 생성된다
  * 따라서 `Deployment`를 사용하면 `replica set`과 `pod`를 직접 생성할 필요가 없다



## 2.1 Deployment 사용하기

**deployment-nginx.yaml 작성**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-nginx
  template:
    metadata:
      name: my-nginx-pod
      labels:
        app: my-nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.10
        ports:
        - containerPort: 80
```



**Deployment 사용하기**

```bash
# Deployment 생성하기
$ kubectl apply -f deployment-nginx.yaml
deployment.apps/my-nginx-deployment created

# Deployment 조회
$ kubectl get deploy
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
my-nginx-deployment   3/3     3            3           18s

# Replica set 조회 Deployment 생성시 Replica set도 생성된 것을 볼 수 있다
$ kubectl get rs
NAME                             DESIRED   CURRENT   READY   AGE
my-nginx-deployment-7484748b57   3         3         3       45s
```



## 2.2 Deployment 를 사용하는 이유

**`Replica Set`을 직접 사용하지 않고 `Deployment`를 사용하는 이유**

* 애플리케이션의 업데이트와 배포를 더욱 편하게 하기 위해서
  * 애플리케이션을 업데이트 할 때 `Replica Set`의 변경 사항을 저장하는 리비전을 나겨 롤백을 가능하게 해준다
  * 무중단 서비스를 위해 `pod`의 롤링 업데이트를 지원한다



**Deployment로 포드 이미지 업데이트 해보기**

* `Deployment`는 포드의 정보를 업데이트함으로써 새로운 `Replica Set`을 만들고  `Replica Set`이 새로운 `pod`를 생성한다
* `-- record=true` 옵션으로 `Deployment`를 변경하면 변경 사항을 기록함으로써 해당 버전의 `Replica Set`을 보존한다

```bash
# Deployment 생성하기
$ kubectl apply -f deployment-nginx.yaml --record
deployment.apps/my-nginx-deployment created

# pod 조회
$ kubectl get po
NAME                                   READY   STATUS    RESTARTS   AGE
my-nginx-deployment-7484748b57-22qc8   1/1     Running   0          6s
my-nginx-deployment-7484748b57-n6jcm   1/1     Running   0          6s
my-nginx-deployment-7484748b57-v6d5g   1/1     Running   0          6s

# replica set 조회
$ kubectl get rs
NAME                             DESIRED   CURRENT   READY   AGE
my-nginx-deployment-7484748b57   3         3         3       17s

# pod 이미지 업데이트
$ kubectl set image deployment my-nginx-deployment nginx=nginx:1.11 --record
deployment.apps/my-nginx-deployment image updated

# 새로운 pod가 생성됨
$ kubectl get po
NAME                                   READY   STATUS    RESTARTS   AGE
my-nginx-deployment-556b57945d-45tvf   1/1     Running   0          12s
my-nginx-deployment-556b57945d-4lsj9   1/1     Running   0          16s
my-nginx-deployment-556b57945d-vq62w   1/1     Running   0          14s

# replica set 목록 조회 새로운 replica set이 생성되며 기존의 replica set을 보존하고 있음
$ kubectl get rs
NAME                             DESIRED   CURRENT   READY   AGE
my-nginx-deployment-556b57945d   3         3         3       38s
my-nginx-deployment-7484748b57   0         0         0       85s

# 리비전 정보 조회
$ kubectl rollout history deployment my-nginx-deployment
deployment.apps/my-nginx-deployment
REVISION  CHANGE-CAUSE
1         kubectl apply --filename=deployment-nginx.yaml --record=true
2         kubectl set image deployment my-nginx-deployment nginx=nginx:1.11 --record=true

# 리비전 1로 롤백
$ kubectl rollout undo deployment my-nginx-deployment --to-revision=1
```

