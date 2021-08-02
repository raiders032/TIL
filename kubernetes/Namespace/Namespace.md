# 1. Namespace

* 쿠버네티스는 리소스를 논리적으로 구분하기 위해 네임스페이스라는 오브젝트를 제공한다
* 간단히 생각하면 pod, replica set, deployment, service 등과 같은 쿠버네티스 리소스들이 묶여 있는 가상 공간 또는 그룹이라고 이해할 수 있다



# 2. Namespace의 개념

* 네임스페이스를 정의하지 않아도 기본적으로 3개의 네임스페이스가 존재한다
* 각 네임스페이스는 논리적인 리소스 공간이기 때문에 pod, replica set, deployment, service 등의 리소스가 따로 존재한다
  * `kubectl get pod -n default`: `default` 네임스페이스의 `pod` 목록 조회
* `default`는 기본으로 사용되는 네임스페이스이다
  * `--namespace` 옵션을 명시하지 않으면 기본적으로 `default` 네임스페이스를 사용한다

```bash
# 네임스페이스 목록 조회
$ kubectl get ns
NAME              STATUS   AGE
default           Active   2d
kube-public       Active   2d
kube-system       Active   2d

# kube-system 네임스페이스의 pod 목록 조회
$ kubectl get pod -n kube-system
NAME                                 READY   STATUS    RESTARTS   AGE
coredns-558bd4d5db-wbks2             1/1     Running   0          2d
coredns-558bd4d5db-x5fct             1/1     Running   0          2d
etcd-gcloud-238                      1/1     Running   0          2d
kube-apiserver-gcloud-238            1/1     Running   0          2d
kube-controller-manager-gcloud-238   1/1     Running   0          2d
kube-proxy-pcgtc                     1/1     Running   0          2d
kube-proxy-qsfzv                     1/1     Running   0          2d
kube-proxy-r9tqz                     1/1     Running   0          2d
kube-scheduler-gcloud-238            1/1     Running   0          2d
```



# 3. 네임스페이스 사용하기



## 3.1 네임스페이스 생성

**kubectl 사용**

```bash
# production 네임스페이스 생성
$ kubectl create namespace production

# production 네임스페이스 조회
$ kubectl get ns | grep production
production        Active   15s

# production 네임스페이스 삭제
# 주의! 네임스페이스 삭제 시 네임스페이스에 존재하는 모든 리소스 또한 삭제된다
$ kubectl delete namespace production
```



**production-namespace.yaml 작성**

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: production
```

```bash
# production 네임스페이스 생성
$ kubectl apply -f production-namespace.yaml

# production 네임스페이스 조회
$ kubectl get ns | grep production
production        Active   15s

# production 네임스페이스 삭제
# 주의! 네임스페이스 삭제 시 네임스페이스에 존재하는 모든 리소스 또한 삭제된다
$ kubectl delete -f production-namespace.yaml
```



## 3.2 네임스페이스 사용

**특정 네임스페이스에 리소스 만들기**

* `production` 네임스페이스에 `deployment` 리소스 만들기
  * `metadata.namespace`를 `production`으로 설정하면 된다

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hostname-deployment-ns
  namespace: production
spec:
  replicas: 1
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

