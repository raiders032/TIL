# 1 Replica Set

- 쿠버네티스 1.8 버전부터 베타로 업데이트되고 1.9 버전에서 정식 버전으로 업데이트 됨
- 레플리카 셋은 레플리케이션 컨트롤러를 완전히 대체한다.
- 일반적으로 레플리카셋을 직접 생성하지 않고 상위 수준의 디플로이먼트 리소스를 통해 간접적으로 생성한다.



## 1.1 Replica Set을 사용하는 이유

**pod를 사용자가 직접 정의하고 사용하는 경우**

* yaml 파일에 pod만 정의해 사용하는 경우 해당 포드는 사용자에 의해서 관리된다
* 단순 테스트 용도로는 가능할지 몰라도 운영 단계에서 이런 방식은 사용하기 어렵다
  * 여러 개의 동일한 pod로 요청을 분산해야한다.
  * pod가 삭제되거나 장애가 발생한 경우 자동으로 pod를 다른 노드에 다시 생성되지 않아 직접 pod를 다시 생성하고 복구해야한다.
* 따라서 pod만 정의해서 사용하는 경우는 거의 없다
  * 이러한 한계점을 해결해주는 **Replica Set**이라는 쿠버네티스 오브젝트를 사용한다



## 1.2 Replica Set의 역할

* 사용자가 직접 `pod`를 관리하는 것이 아니라 **Replica Set**이 `pod`를 관리해준다
* 정해진 수의 동일한 `pod`가 항상 실행되도록 관리한다
* 장애 등의 이유로 포드를 사용할 수 없다면 다른 노드에 `pod`를 다시 생성한다.



## 1.3 Replica Set 사용하기

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



## 1.4 Replica Set의 동작 원리

* `replica set`은 `pod`와 라벨 셀렉터로 느슨하게 연결되어 있다
* `replica set`은 `spec.selector.matchLabels`에 정의된 라벨을 통해 생성할 포드를 찾는다
* 정의된 라벨을 가지는 포드의 개수가 `spec.replicas` 항목에 정의된 개수와 일치하지 않으면 포드를 생성하거나 삭제하여 개수를 일치시킨다



> **Label**
>
> * 쿠버네티스 리소스를 분류할 때 사용하는 메타데이터
> * 서로 다른 오브젝트가 서로를 찾을 때 사용한다



# 2 Deployment

* 레플리카셋으로 충분할 것 같지만 운영 환경에서 레플리카셋을 직접 정의하고 사용하는 경우는 거의 없다
* 보통 레플리카셋과 포드 정보를 정의하는 `Deployment` 오브젝트를 정의해 사용한다
  * `Deployment`는 레플리카셋의 상위 오브젝트이기 때문에 `Deployment` 생성시 레플리카셋도 함께 생성된다
  * 따라서 `Deployment`를 사용하면 레플리카셋과 포드를 직접 생성할 필요가 없다



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
  progressDeadlineSeconds: 600
  revisionHistoryLimit: 10
  strategy:
  	type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
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

`spec.progressDeadlineSeconds`

- 엡데이트가 되지 않으면 지정된 시간 후에 undo한다.

`spec.revisionHistoryLimit`

- 리비전 최대 저장 개수를 지정한다.

`spec.strategy.type`

- 업데이트 방식을 지정한다.

`spec.strategy.rollingUpdate.maxSurge`

- 지정된 replicas 대비 최대로 허용할 수 있는 파드의 개수를 비율로 지정
- 기본값 `25%`
- replicas가 100이라면 최대 125개 까지 파드 수를 늘릴 수 있다.

`spec.strategy.rollingUpdate.maxUnavailable`

- 업데이트시 지정된 replicas 대비 최대로 허용할 수 있는 다운 파드의 개수를 비율로 지정
- 기본값 `25%`
- replicas가 100이라면 최대 25개 까지 파드를 다운시킬 수 있다.



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

**레플리카셋을 직접 사용하지 않고 `Deployment`를 사용하는 이유**

* 애플리케이션의 업데이트와 배포를 더욱 편하게 하기 위해서
* 애플리케이션을 업데이트 할 때 레플리카셋의 변경 사항을 저장하는 리비전을 남겨 롤백을 가능하게 해준다
* 무중단 서비스를 위해 `pod`의 롤링 업데이트를 지원한다



**Deployment로 포드 이미지 업데이트 해보기**

* `Deployment`는 포드의 정보를 업데이트함으로써 새로운 레플리카셋을 만들고  레플리카셋이 새로운 포드를 생성한다
* `--record=true` 옵션으로 `Deployment`를 변경하면 변경 사항을 기록함으로써 해당 버전의 레플리카셋을 보존한다

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



## 2.3 Deployment 업데이트하기

**Creating a Deployment**

- 아래의 `nginx-deployment.yaml`로 실습 진행

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

```bash
$ kubectl apply -f nginx-deployment.yaml --record=true
```

결과 확인

```bash
$ kubectl rollout status deployment/nginx-deployment
deployment "nginx-deployment" successfully rolled out
```



**Updating a Deployment**

- 아래와 같은 명령어로 nginx 이미지를 업데이트 할 수 있다.

```bash
$ kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1 --record=true
deployment.apps/nginx-deployment image updated
```



레플리카셋 확인

- Deployment는 새로운 레플리카셋을 만들어고 pod를 업데이트했다.
- `68fc675d59` 가 새로운 레플리카셋이고 `7fb96c846b` 는 예전 레플리카셋이다.

```bash
$ kubectl get rs
NAME                          DESIRED   CURRENT   READY   AGE
nginx-deployment-68fc675d59   3         3         3       7s
nginx-deployment-7fb96c846b   0         0         0       77s
```



## 2.4 리비전 롤백

**리비전 목록 보기**

```bash
$ kubectl rollout history deployment nginx-deployment
deployment.apps/nginx-deployment
REVISION  CHANGE-CAUSE
1         kubectl apply --filename=nginx-deployment.yaml --record=true
2         kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1 --record=true
```



**바로 이전 리비전으로 롤백하기**

```bash
$ kubectl rollout undo deployment/nginx-deployment
```



**특정 리비전으로 롤백하기**

```bash
$ kubectl rollout undo deployment/nginx-deployment --to-revision=2
```







참고

* http://www.yes24.com/Product/Goods/84927385
* https://kubernetes.io/docs/concepts/workloads/controllers/deployment/