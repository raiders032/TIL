# 1 Labels

- 레이블은 파드와 모든 다른 쿠버네티스 리소스를 조직화할 수 있는 단순하면서 강력한 쿠버네티스 기능이다.
- 레이블은 키와 밸류의 쌍으로 오브젝트에 부여된다.
- 이 쌍은 레이블 셀렉터를 사용해 리소스를 선택할 때 사용된다.
- 일반적으로 리소스를 생성할 때 레이블을 붙이지만 생성 이후에 레이블을 수정할 수 있다



## 1.1 사용 예시

- 아래와 같이 두 개의 레이블을 가지는 파드를 생성해보자

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: kubia-manual-v2
  labels:
    creation_method: manual
    env: prod
spec:
  containers:
  - image: luksa/kubia
    name: kubia
    ports:
    - containerPort: 8080
      protocol: TCP
```



**확인**

```bash
$ kubectl get pods --show-labels
NAME              READY   STATUS    RESTARTS       AGE    LABELS
kubia-manual-v2   1/1     Running   0              33s    creation_method=manual,env=prod
```



**특정 레이블만 보기**

- `-L` 에 보고싶은 레이블을 지정한다.

```bash
$ kubectl get pods -L creation_method,env
NAME              READY   STATUS    RESTARTS       AGE    CREATION_METHOD   ENV
kubia-manual-v2   1/1     Running   0              84s    manual            prod
mysql-0           1/1     Running   0              9d
```





## 1.2 레이블 수정

- 기존 레이블의 값을 변경하려면 `--overwrite` 옵션이 필요하다

```bash
$ kubectl label pod kubia-manual-v2 env=debug --overwrite
pod/kubia-manual-v2 labeled

# debug로 변경된 것을 확인
$ kubectl get pods -L env
NAME              READY   STATUS    RESTARTS       AGE     ENV
kubia-manual-v2   1/1     Running   0              4m31s   debug
```





## 1.3 자주 사용되는 Labels

**release** 

- `"release" : "stable"`, `"release" : "canary"`

**environment**

- `"environment" : "dev"`, `"environment" : "qa"`, `"environment" : "production"`

**tier**

- `"tier" : "frontend"`, `"tier" : "backend"`, `"tier" : "cache"`

**partition**

- `"partition" : "customerA"`, `"partition" : "customerB"`

**track**

- `"track" : "daily"`, `"track" : "weekly"`



# 2 Selectors

- 레이블은 레이블 셀렉터와 같이 사용된다.
- 레이블 셀렉터는 특정 레이블로 태그된 파드의 부분 집합을 선택해 원하는 작업을 수행한다



**레이블 셀렉터의 리소스 선택 기준**

- 특정 키를 포함하거나 포함하지 않는 레이블
- 특정 키와 값을 가진 레이블
- 특정 키를 갖고 있지만 다른 값을 가진 레이블



## 2.1 예시

```bash
# env 레이블을 가지고 있고 값이 'manual'인 파드 조회
$ kubectl get pods -l creation_method=manual --show-labels

NAME              READY   STATUS    RESTARTS   AGE   LABELS
kubia-manual-v2   1/1     Running   0          11m   creation_method=manual,env=debug
# env 레이블을 가지고 있지만 값은 상관없는 파드를 조회
$ kubectl get pods -l env --show-labels
NAME              READY   STATUS    RESTARTS   AGE     LABELS
kubia-manual-v2   1/1     Running   0          9m20s   creation_method=manual,env=debug

# env 레이블을 가지고 있지 않은 파드를 조회
$ kubectl get pods -l '!env' --show-labels
NAME            READY   STATUS    RESTARTS       AGE    LABELS
test            1/1     Running   1 (2d4h ago)   2d4h   run=test
test-rs-g6s6x   1/1     Running   0              9d     app=nginx
test-rs-kpspg   1/1     Running   0              9d     app=nginx
test-rs-wv7nq   1/1     Running   0              9d     app=nginx
```



## 2.2 nodeSelector

- 레이블 셀렉터는 kubectl에서만 사용하는 것이 아니라 내부적으로도 사용된다.
- 워커 노드 분류에 레이블을 사용하고 파드를 특정 노드에 스케줄링 되도록 만들어보자.

```bash
# 노드가 GPU를 가지고 있음을 보여주는 레이블을 노드에 추가한다.
$ kubectl label node worker1 gpu=true
node/worker1 labeled

# 노드의 레이블이 gpu이고 값이 true인 노드를 조회한다.
$ kubectl get nodes -l gpu=true -L gpu
NAME      STATUS   ROLES    AGE   VERSION   GPU
worker1   Ready    <none>   15d   v1.25.3   true
```



스케줄러가 GPU를 제공하는 노드에 파드를 배치할 수 있도록 아래와 같이 노드셀렉터를 이용한다.

 `spec.nodeSelector` 노드 셀렉터가 gpu=true 레이블을 포함하는 노드에 이 파드를 배포하도록 지시한다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: kubia-gpu
spec:
  nodeSelector:
    gpu: "true"
  containers:
  - image: luksa/kubia
    name: kubia
```