# 1 Namespace

* 쿠버네티스는 리소스를 논리적으로 구분하기 위해 네임스페이스라는 오브젝트를 제공한다
* 간단히 생각하면 pod, replica set, deployment, service 등과 같은 쿠버네티스 리소스들이 묶여 있는 가상 공간 또는 그룹이라고 이해할 수 있다
* 여러 개의 네임스페이스를 사용하면 하나의 클러스터에서 여러개의 가상 클러스터를 동시에 사용하는 것처럼 느껴진다.



# 2 Namespace의 개념

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



# 3 네임스페이스 사용하기



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



## 3.3 네임스페이스의 서비스에 접근하기

* 클러스터 내부에서는 같은 네임스페이스 내의 서비스 이름을 통해 포드에 접근할 수 있다.
* 다른 네임스페이스에 존재하는 서비스에는 이름만으로 접근할 수 없다
  * `<서비스이름>.<네임스페이스 이름>.svc` 처럼 서비스 이름 뒤에 네임스페이스를 붙이면 다른 네임스페이스에서도 접근할 수 있다.



## 3.4 네임스페이스 삭제

* 네임스페이스에 존재하는 모든 리소스 또한 함께 삭제되기 때문에 주의 필요

```bash
$ kubectl delete -f production-namespace.yaml
$ kubectl delete namespace production
```



## 3.5 네임스페이스에 종속/독립적인 오브젝트

* 네임스페이스를 사용하면 리소스를 목적에 따라 논리적으로 격리할 수 있다.
* 허나 모든 리소스가 네임스페이스에 의해 격리되는 것은 아니다
* 네임스페이스에 의해 격리되는 오브젝트를 `오브젝트가 네임스페이스에 속한다(namespaced)`라고 말한다.
  * `kubectl api-resource --namespaced=true` 명령어로 namespaced 오브젝트를 조회할 수 있다.
  * 이러한 오브젝트에는 포드, 서비스, 레플리카셋, 디플로이먼트 등이 있다
* 반대로 네임스페이스에 속하지 않은 오브젝트에는 노드, 네임스페이스 등이 있다.
  * `kubectl api-resource --namespaced=false` 로 해당 오브젝트를 조회할 수 있다.



참고

* [시작하세요! 도커/쿠버네티스](http://www.yes24.com/Product/Goods/84927385)

