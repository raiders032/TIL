# etcd



## Backing up an etcd cluster

**etcd 정보 조회**

- etcd를 상세 조회해서 백업에 필요한 정보를 얻는다.조회 결과 아래와 같은 정보가 백업에 필요하다.

```bash
# 버전 확인
$ etcd --version
$ etcdctl version

# etcd 정보 확인
$ kubectl describe pod -n kube-system etcd-controlplane

# 출력 결과
...
Containers:
  etcd:
    Command:
      etcd
      --cert-file=/etc/kubernetes/pki/etcd/server.crt
      --data-dir=/var/lib/etcd
      --key-file=/etc/kubernetes/pki/etcd/server.key
      --listen-client-urls=https://127.0.0.1:2379,https://10.31.77.3:2379
      --trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt
...
```



**etcd 백업**

- [참고](https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster)

```bash
$ ETCDCTL_API=3 etcdctl \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=<trusted-ca-file> \
  --cert=<cert-file> \
  --key=<key-file> \
  snapshot save <backup-file-location>
```

```bash
$ ETCDCTL_API=3 etcdctl \
 --endpoints=https://127.0.0.1:2379 \
 --cacert=/etc/kubernetes/pki/etcd/ca.crt \
 --cert=/etc/kubernetes/pki/etcd/server.crt \
 --key=/etc/kubernetes/pki/etcd/server.key \
 snapshot save /opt/snapshot-pre-boot.db
```



## Restoring an etcd cluster

- `/opt/snapshot-pre-boot.db` 라는 백업 파일이 있을 때 etcd를 복원하라



**백업 파일 풀기**

- 로컬의 `/var/lib/etcd-from-backup` 디렉토리에 `snapshot-pre-boot.db` 파일을 푼다.

```bash
$ ETCDCTL_API=3 etcdctl \
	--data-dir /var/lib/etcd-from-backup \
	snapshot restore /opt/snapshot-pre-boot.db
```



**etcd 수정하기**

- etcd는 스태틱 파드
- /etc/kubernetes/manifests/etcd.yaml 수정하기

```yaml
...
  volumes:
  - hostPath:
      path: /var/lib/etcd-from-backup
      type: DirectoryOrCreate
    name: etcd-data
```



**etcd 작동 확인**

```bash
$ watch "crictl ps | grep etcd"
```



# pod



## 생성

**문제1**

- namespace: ecommerce
- pod name: eshop-main
- Image: nginx:1.17
- env: DB=mysql

```bash
$ kubectl run eshop-main --image nginx:1.17 -n ecommerce --env=DB=mysql
```



## Static Pod 생성

**문제1**

- Node: hk8s-w1
- pod name: web
- Image: nginx

```bash
$ kubectl run web --image=nginx --dry-run=client -o=yaml

# 내용 복사
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: web
  name: web
spec:
  containers:
  - image: nginx
    name: web
    resources: {}
  dnsPolicy: ClusterFirst
  restartPolicy: Always
status: {}

# 노드 접속
$ ssh hk8s-w1
$ sudo -i

# 스태틱 파드 메니페스트 위치 확인
$ cat /var/lib/kubelet/config.yaml | grep static
staticPodPath: /etc/kubernetes/manifests

$ cd /etc/kubernetes/manifests

# 매니페스트 생성
$ cat > web.yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: web
  name: web
spec:
  containers:
  - image: nginx
    name: web
    resources: {}
  dnsPolicy: ClusterFirst
  restartPolicy: Always
status: {}
# ctrl + d
```





# Deployment

## 생성

**문제1**

- deployment 생성
  - Name: webserver
  - replicas: 2
  - Label: app_env_stage=dev
  - Container Name: webserver
  - container Image: nginx:1.14
- 레플리카를 3으로 증가시키기

```bash
# deplyment 매니페스트 생성
$ kubectl create deployment webserver --image=nginx:1.14 --replicas=2 --dry-run=client -o yaml > webserver.yaml

# deplyment 매니페스트 수정
vim webserver.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    app: webserver
  name: webserver
spec:
  replicas: 2
  selector:
    matchLabels:
      app_env_stage: dev
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app_env_stage: dev
    spec:
      containers:
      - image: nginx:1.14
        name: webserver
        resources: {}
status: {}

# deployment 생성
$ kubectl create -f webserver.yaml

# deployment 조회
$ kubectl get deployment
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
webserver             2/2     2            2           98s

# deployment scale out
$ kubectl scale --replicas=3 deployment webserver

# deployment 조회
$  kubectl get deployment
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
webserver             3/3     3            3           2m52s
```



## Scale

**문제1**

- Namespace: devops
- Deployment: eshop-order
- Scale: 5

`````bash
$ kubectl scale eshop-order -n devops --replicas=5 deployemnt eshop-order
`````



## update

```bash
$ kubectl set image deployment.apps/nginx nginx=nginx:1.11.13-alpine
```



## rollback

```bash
$ kubectl rollout undo deploy nginx
```



# namespace



## 생성

- ecommerce 네임스페이스 생성

```bash
$ kubectl create namespce ecommerce
```





# 기타



## context 변경

```bash
kubectl config use-context context-name
```
