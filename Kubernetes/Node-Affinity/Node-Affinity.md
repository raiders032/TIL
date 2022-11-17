# 1 Node Affinity

- 테인트는 파드를 특정 노드에서 떨어뜨려 놓는 데 사용된다.
  -  [Taints-And-Tolerations.md](../Taints-And-Tolerations/Taints-And-Tolerations.md) 참고
- Node Affinity는 특정 노드 집합에만 파드를 스케줄링하도록 지시할 수 있다.



**노드 셀렉터와의 비교**

- 초기 버전 쿠버네티스는 노드 어피니티 메커니즘은 노드 셀럭터 필드였다.
- 노드는 파드의 대상이 되고자 해당 필드에 지정된 모든 레이블을 포함시켜야 했다.
- 노드 셀럭터는 간단하고 잘 동작하지만 모든 것을 제공하지 않았다.



# 2 노드 어피니티 사용하기



**노드 셀럭터**

- 노드 셀럭터를 사용해 파드가 `gpu=true`를 포함하는 노드에만 배포되도록 지정한다.

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



**노드 어피니티**

- 위와 동일한 기능을 하는 노드 어피니티를 작성하면 아래와 같다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: kubia-gpu
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: gpu
            operator: In
            values:
            - "true"
  containers:
  - image: luksa/kubia
    name: kubia
```



**preferredDuringScheduling 예시**

- weight로 선호도를 명시할 수 있다. 

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: pref
spec:
  replicas: 5
  template:
    metadata:
      labels:
        app: pref
    spec:
      affinity:
        nodeAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 80
            preference:
              matchExpressions:
              - key: availability-zone
                operator: In
                values:
                - zone1
          - weight: 20
            preference:
              matchExpressions:
              - key: share-type
                operator: In
                values:
                - dedicated
      containers:
      - args:
        - sleep
        - "99999"
        image: busybox
        name: main
```



# 3 노드 어피니트 타입

- 노드 어피니티는 두 가지의 타입을 제공한다.
  - `requiredDuringSchedulingIgnoredDuringExecution`
  - `preferredDuringSchedulingIgnoredDuringExecution`
- 부분을 나누어 그 의미를 알아보자



`requiredDuringScheduling...`

- 이 필드 아래에 정의된 규칙은 파드가 노드로 스케줄링되고자 가져햐 하는 레이블을 지정한다.
- 명시한 룰과 매치되는 노드가 없다면 파드가 스케줄링되지 않는다.

`preferredDuringScheduling...`

- 먼저 룰을 만족시키는 노드를 찾는다.
- 만약 룰을 만족시키는 노드가 없으면 룰을 무시하고 파드를 스케줄링 한다.

`...IgnoredDuringExecution`

- 이 필드 아래에 정의된 규칙은 노드에서 이미 실행중인 파드에 영향을 미치지 않는다.
- 이전에 룰을 만족시켜 파드가 배치된 노드에 레이블을 변경해 더 이상 룰을 만족시키지 않아도 기존 룰을 만족 시키는 파드를 제거하지 않는다.

`...RequiredDuringExecution`

- 이전에 룰을 만족시켜 파드가 배치된 노드에 레이블을 변경해 더 이상 룰을 만족시키지 못하는 파드를 제거한다.



참고

- https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/