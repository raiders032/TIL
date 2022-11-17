# 1 Replica Set

- 쿠버네티스 1.8 버전부터 베타로 업데이트되고 1.9 버전에서 정식 버전으로 업데이트 됨
- 일반적으로 `레플리카셋`을 직접 생성하지 않고 상위 수준의 `디플로이먼트` 리소스를 통해 간접적으로 생성한다.



**ReplicationController와 비교**

- 레플리카셋은 레플리케이션 컨트롤러를 완전히 대체한다.
- 레플리카셋은 ReplicationController보다 풍부한 selector를 지원한다.
- `spec.selector.matchExpressions` 으로 보다 강력한 셀렉터를 지원한다.
- ReplicationController는 env=production, env=devel 라벨을 동시에 만족하는 파드를 매칭시킬 수 없다.
- ReplicationController는 값에 상관없이 키의 존재만으로 파드를 매칭시킬 수 없다.



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



## 1.5 레이블 셀렉터

- **`matchLabels`**은 기존의 레플리케이션컨트롤러와 크게 다를게 없다.
- 레플리카셋의 더 강력한 `matchExpressions` 을 사용해보자.
- 여러 표현식을 지정하는 경우 모든 표현식이 `true`여야 한다.



```yaml
apiVersion: apps/v1beta2
kind: ReplicaSet
metadata:
  name: kubia
spec:
  replicas: 3
  selector:
    matchExpressions:
      - key: app
        operator: In
        values:
         - kubia
  template:
    metadata:
      labels:
        app: kubia
    spec:
      containers:
      - name: kubia
        image: luksa/kubia
```

`key`

- 레이블의 키를 지정한다.

`operator`

- `In`은 레이블의 값이 지정된 값 중 하나와 일치해야한다.
- `NotIn`은 레이블의 값이 저정된 값과 일치하지 않아야한다.
- `Exists`는 파드의 레이블에 지정된 레이블 키가 포함되어야 한다. 값이 필요없으므로 values의 값을 지정하지 않는다.
- `NotExists`는 파드의 레이블에 지정된 레이블 키가 포함돼 있지 않아야 한다. 값이 필요없으므로 values의 값을 지정하지 않는다.

`values`

- 레이블의 값을 지정한다.



## 1.6 이미지 업데이트

- 레플리카셋의 파드 템플릿을 수정하여 애플리케이션의 버전을 업데이트하면 자동으로 기존의 파드가 내려리고 새로운 버전의 파드가 올리지 않는다.

- 업데이트를 위해선 직접 기존 파드를 삭제한다. 그러면  레플리카셋이 새 템플릿을 기반으로 업데이트 버전의 파드를 생성 할 것이다.



작동중인 레플리카셋의 이미지를 `kubectl edit` 명령어로 수정하면 자동 업데이트 되는지 아래와 같이 레플리카셋 데피니션을 정의해보고 직접 해보자.



**test-rs.yaml**

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: test-rs
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
      - name: nginx-container
        image: nginx:1.12.2
```



```bash
# 레플리카셋 생성
$ kubectl delete -f test-rs.yaml

# 레플리카셋 확인
$ kubectl get rs
NAME      DESIRED   CURRENT   READY   AGE
test-rs   3         3         3       39s

# 이미지 변경 nginx의 이미지를 1.12.2에서 1.23.2로 변경한다.
$ kubectl edit rs test-rs

# 파드 확인
$ kubectl get pods
NAME            READY   STATUS    RESTARTS   AGE
test-rs-6vwfj   1/1     Running   0          3m41s
test-rs-kpspg   1/1     Running   0          3m41s
test-rs-wv7nq   1/1     Running   0          3m41s

# 파드의 상세를 확인해 이미지의 버전이 업데이트 되었는지 확인하지만 그대로다.
$ kubectl describe pod test-rs-6vwfj
...
Containers:
  nginx-container:
    Container ID:   containerd://a58a5edf6be97df0495f9da4e6a4cfe8ff53bafacc95f16be79e08e309ae3788
    Image:          nginx:1.12.2
...

# 방금 확인한 파드를 지운다.
$ kubectl delete pod test-rs-6vwfj

# 파드 목록 확인
$ kubectl get pods
NAME            READY   STATUS    RESTARTS   AGE
test-rs-g6s6x   1/1     Running   0          19s
test-rs-kpspg   1/1     Running   0          3m41s
test-rs-wv7nq   1/1     Running   0          3m41s

# 새로 생성된 파드 상세 확인하면 1.23.2 버전의 nginx가 사용됨
$ kubectl describe pod test-rs-g6s6x
...
Containers:
  nginx-container:
    Container ID:   containerd://6be66d457506797a91f1033a1c8d30fef9f9d09e52d37ea5553f14d8012b5d1c
    Image:          nginx:1.23.2
...
```

결과적으로 이미지 버전을 수정해도 자동 업데이트가 되지 않는다. 이러한 단점을 보완해 레플리카셋을 직접 사용하지 않고 롤링 업데이트 기능을 제공하는 상위 객체 Deployment를 사용한다.



# 2 Deployment

* 레플리카셋으로 충분할 것 같지만 운영 환경에서 레플리카셋을 직접 정의하고 사용하는 경우는 거의 없다
* 보통 레플리카셋과 포드 정보를 정의하는 `Deployment` 오브젝트를 정의해 사용한다
* `Deployment`는 레플리카셋의 상위 오브젝트이기 때문에 `Deployment` 생성시 레플리카셋도 함께 생성된다
* 따라서 `Deployment`를 사용하면 레플리카셋과 포드를 직접 생성할 필요가 없다
* 실제 파드는 디플로이먼트가 아니라 디플로이먼트의 레플리카셋에 의해 생성되고 관리된다.



## 2.1 Deployment 를 사용하는 이유

**레플리카셋을 직접 사용하지 않고 `Deployment`를 사용하는 이유**

* 애플리케이션의 업데이트와 배포를 더욱 편하게 하기 위해서
* 애플리케이션을 업데이트 할 때 레플리카셋의 변경 사항을 저장하는 리비전을 남겨 롤백을 가능하게 해준다
* 무중단 서비스를 위해 `pod`의 롤링 업데이트를 지원한다



## 2.2 Deployment 생성하기

- 디플로이먼트는 레플리카셋을 만드는 것과 다르지 않다.
- 레이블 셀렉터, 원하는 레플리카 수, 파드 템플릿으로 구성된다.
- 또한 리소스가 수정될 때 업데이트 수행 방법을 정의하는 디플로이먼트 전략을 지정하는 필드가 있다.



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



### 2.2.1 Deployment Spec

`spec.progressDeadlineSeconds`

- 업데이트가 되지 않으면 지정된 시간 후에 undo한다.
- 기본 값 `600`



`spec.revisionHistoryLimit`

- 리비전 최대 저장 개수를 지정한다.



`spec.minReadySeconds`

- 새로 생성된 포드의 상태가 available로 간주되려면 레디니스 프로브를 성공시켜야 한다. minReadySeconds를 지정하면 지정된 시간동안 컨테이너에 준비 시간을 주고 이후에 레디니스 프로브를 시작한다.
- 기본값은 `0`이다
  - 팟은 준비되는 즉시 사용 가능한 것으로 간주된다.
- minReadySeconds가 지나기 전에 새 파드가 제대로 작동하지 않고 레디니스 프로브가 실패하면 새 버전의 롤아웃이 효과적으로 차단된다.
- minReadySeconds를 올바르게 설정하지 않고 레디니스 프로브만 정의하는 경우 레디니스 프로브의 첫 번째 호출이 성공하면 즉시 새 파드가 사용 가능한 것으로 간주된다.



`spec.strategy.type`

- 업데이트 방식을 지정한다.
- `Recreate`또는 `RollingUpdate`가 가능하다
- 기본값 `RollingUpdate`



`spec.strategy.rollingUpdate.maxSurge`

- 지정된 replicas 대비 최대로 허용할 수 있는 파드의 개수를 비율로 지정
  - 비율 말고 절대값도 지정할 수 있다.

- 반올림한다.
  - 3(replicas)의 25% 는 0.75 반올림하면 1 즉 최대 4개의 파드를 허용한다.

- 기본값 `25%`
- 해당 값이 높으면 보다 빠른 업데이트가 가능하다.



`spec.strategy.rollingUpdate.maxUnavailable`

- 업데이트시 지정된 replicas 대비 최대로 허용할 수 있는 다운 파드의 개수를 비율로 지정
  - 비율 말고 절대값도 지정할 수 있다

- 기본값 `25%`
- replicas가 100이라면 최대 25개 까지 파드를 다운시킬 수 있다.



**Deployment 생성하기**

- create를 사용할 때는 리비전 히스토리를 기록하기 위해 반드시 `--record` 옵션을 사용하자

```bash
$ kubectl create -f deployment-nginx.yaml --record=true
deployment.apps/my-nginx-deployment created
```



## 2.2 Deployment 롤아웃 상태 출력

`kubectl get deployment`

```bash
$ kubectl get deploy
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
my-nginx-deployment   3/3     3            3           18s

# Replica set 조회 Deployment 생성시 Replica set도 생성된 것을 볼 수 있다
$ kubectl get rs
NAME                             DESIRED   CURRENT   READY   AGE
my-nginx-deployment-7484748b57   3         3         3       45s
```

- NAME: Deployment의 이름
- READY: livenessProbe를 성공한 파드의 수 / 전체 파드 수 ?
- UP-TO-DATE: 업데이트를 성공한 파드의 수
- AVAILABLE: readinessProbe를 성공한 파드의 수 / 전체 파드 수 ?
- AGE: 생성된 시간



`kubectl rollout status deployment`

- 디플로이먼트 상태를 확인하기 위해 만들어진 특별한 명령어

```bash
$ kubectl rollout status deployment my-nginx-deployment
deployment "my-nginx-deployment" successfully rolled out
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
$ kubectl create -f nginx-deployment.yaml --record=true
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



**레플리카셋 확인**

- Deployment는 새로운 레플리카셋을 만들어고 pod를 업데이트했다.
- `68fc675d59`가 새로운 레플리카셋이고 `7fb96c846b` 는 예전 레플리카셋이다.

```bash
$ kubectl get rs
NAME                          DESIRED   CURRENT   READY   AGE
nginx-deployment-68fc675d59   3         3         3       7s
nginx-deployment-7fb96c846b   0         0         0       77s
```



### 2.3.1 디플로이먼트 전략

- 디플로이먼트 전략으로 RollingUpdate와 Recreate 전략이 있다.
- 기본값은 RollingUpdate이다.



**Recreate 전략**

- Recreate 전략을 사용하면 새 파드를 만들기 전에 이전 파드를 모두 삭제한다.
- 애플리케이션이 여러 버전으로 병렬적으로 실행하는 것은 지원하지 않는다.
- 이 전략은 애플리케이션을 완전히 사용할 수 없는 짧은 서비스 다운타임이 발생한다.



**RollingUpdate 전략**

- 이전 파드를 하나씩 제거하고 동시에 새 파드를 추가해 전체 프로세스에서 애플리케이션이 계속 사용할 수 있도록 한다.
  - 서비스 다운타임이 없다.
- 의도하는 레플리카 수보다 많거나 적은 파드 수에 관한 상한과 하한을 설정할 수 있다.
- 애플리케이션이 이전 버전과 새 버전을 동시에 실행할 수 있는 경우에만 이 전략을 사용해야 한다.



### 2.3.2 롤아웃 속도 제어

- 롤링 업데이트 전략의 경우 `maxSurge`와 `maxUnavailable` 속성으로 롤아웃 속도를 제어할 수 있다.
- 이 두개의 속성이 롤링 업데이트 중에 한 번에 몇개의 파드를 교체할지 결정한다.



`spec.strategy.rollingUpdate.maxSurge`

- 지정된 replicas 대비 최대로 허용할 수 있는 파드의 개수를 비율로 지정
- 반올림한다.
  - 3(replicas)의 25% 는 0.75 반올림하면 1 즉 최대 4개의 파드를 허용한다.

- 기본값 `25%`
- 해당 값이 높으면 보다 빠른 업데이트가 가능하다.



`spec.strategy.rollingUpdate.maxUnavailable`

- 업데이트시 지정된 replicas 대비 최대로 허용할 수 있는 다운 파드의 개수를 비율로 지정
- 기본값 `25%`
- replicas가 100이라면 최대 25개 까지 파드를 다운시킬 수 있다.

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





## 2.4 디플로이먼트 롤아웃 이력 표시

- 디플로이먼트의 레플리카셋은 개정 이력으로 사용되기 떄문에 수동으로 삭제해서는 안된다.
  - 그렇게 하면 디플로이먼트 기록에서 특정 버전을 읽어 롤백할 수 없게 된다.
- 개정 내역의 수는 디플로이먼트 리소스의 `revisionHistoryLimit`  속성에 의해 제한된다.
  - 기본값은 10로 설정되어 현재와 이전 버전만 표시된다.



**리비전 목록 보기**

```bash
$ kubectl rollout history deployment nginx-deployment
deployment.apps/nginx-deployment
REVISION  CHANGE-CAUSE
1         kubectl create --filename=nginx-deployment.yaml --record=true
2         kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1 --record=true
```



## 2.5 리비전 롤백

**바로 이전 리비전으로 롤백하기**

```bash
$ kubectl rollout undo deployment/nginx-deployment
```



**특정 리비전으로 롤백하기**

```bash
$ kubectl rollout undo deployment/nginx-deployment --to-revision=2
```



## 2.6 scale out

```bash
# 'foo'라는 deployment를 1으로 스케일
kubectl scale --replicas=1 deployment foo
```



참고

* http://www.yes24.com/Product/Goods/84927385
* https://kubernetes.io/docs/concepts/workloads/controllers/deployment/