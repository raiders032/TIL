# 1 Taint

- Taint와 Toleration는 함께 작동하여 특정한 노드에 포드가 배치되지 않도록 한다.
- 하나 이상의 Taint가 노드에 적용되면 Taint에 대한 Toleration이 없는 파드는 해당 노드에 배치되지 않는다.



**예시**

- 기본적으로 클러스터의 마스터 노드는 Taint가 적용되어 컨트롤 플레인 파드만 배치할 수 있다.
- 테인트는 `<key>=<value>:<effect>` 형태로 표시된다.
  - key : `node-role.kubernetes.io/control-plane`
  - value : `null`
  - effect: `NoSchedule`
- 아래와 같이 coredns 파드는 Taint에 Toleration이 있어 마스터 노드에 배치될 수 있다.

```bash
$ kubectl describe node master-node
...
Taints:             node-role.kubernetes.io/control-plane:NoSchedule
...

$ kubectl describe pod coredns-565d847f94-44bl5 -n kube-system
...
Tolerations:                 CriticalAddonsOnly op=Exists
                             node-role.kubernetes.io/control-plane:NoSchedule
                             node-role.kubernetes.io/master:NoSchedule
                             node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
...
```



## 1.1 노드에 테인트 추가

- 아래와 같이 `taint` 명령어로 노드에 테인트를 부여할 수 있다.
- `node01 `에 키는 `key1` 이고 밸류는 `value1`인 테인트를 부여하며 taint effect는 `NoSchedule`이다.



**테인트 추가**

```bash
kubectl taint nodes node1 key1=value1:NoSchedule
```



**테인트 삭제**

```bash
kubectl taint nodes node1 key1=value1:NoSchedule-
```



## 1.2 taint effect

- taint effectd에는 세 가지 효과가 있다.



`NoSchedule`

- 파드가 테인트를 허용하지 않는 경우 파드가 노드에 스케줄링되지 않는다.

`PreferNoSchedule`

- NoSchedule의 소프트한 버전이다
- 스케줄러가 파드를 노드에 스케줄링하지 않으려 하지만 다른 곳에 스케줄링할 수 없으면 해당 노드에 스케줄링 된다.

`NoExecute`

- NoSchedule과 PreferNoSchedule은 스케줄링에만 영향을 준다.
- 그러나 NoExecute는 이미 실행중인 파드에도 영향을 준다.
- NoExecute 테인트를 추가하면 해당 노드에서 이미 실행중이지만 NoExecute 테인트를 허용하지 않는 파드는 노드에서 제거된다.



# 2 Toleration



## 2.1 파드에 톨러레이션 추가

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    env: test
spec:
  containers:
  - name: nginx
    image: nginx
    imagePullPolicy: IfNotPresent
  tolerations:
  - key: "example-key"
    operator: "Exists"
    effect: "NoSchedule"
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    env: test
spec:
  containers:
  - name: nginx
    image: nginx
    imagePullPolicy: IfNotPresent
  tolerations:
  - key: "example-key"
    operator: "Equal"
    value: "production"
    effect: "NoSchedule"
```

