# 1 Logging Architecture

- [레퍼런스](https://kubernetes.io/docs/concepts/cluster-administration/logging/)
- 컨테이너 엔진 또는 런타임에서 제공하는 기본 기능으로는 전체 로깅 솔루션을 사용하기에 충분하지 않다.
- 컨테이너가 crashe되거나 파드가 퇴출거나 노드가 죽어도 로그를 보길 원하기 때문에 클러스터에서 로그는 노드, 포드 또는 컨테이너와 독립적으로 별도의 스토리지 및 라이프 사이클을 가져야 한다.
  - 이러한 컨셉을 `cluster-level logging`이라고 한다.

- cluster-level logging 아키텍처는 분리된 백엔드가 필요하다.
  - 이 분리된 백엔드에 로그를 저장하고, 분석하고, 조회하는 기능이 있다.
- 쿠버네티스는 자체적으로 cluster-level logging 솔루션을 제공하지 않는다.
  - 하지만 다양한 솔루션을 쿠버네티스에 적용할 수 있다.



# 2 Pod and container logs

- 쿠버네티스는 파드에서 동작 중인 각각의 컨테이너로부터 로그를 캡쳐한다.



```yaml
apiVersion: v1
kind: Pod
metadata:
  name: counter
spec:
  containers:
  - name: count
    image: busybox:1.28
    args: [/bin/sh, -c,
            'i=0; while true; do echo "$i: $(date)"; i=$((i+1)); sleep 1; done']
```

- 위 예제는 1초 마다 standard output stream으로 텍스트를 쓰는 pod이다.



```bash
kubectl logs counter
0: Fri Apr  1 11:42:23 UTC 2022
1: Fri Apr  1 11:42:24 UTC 2022
2: Fri Apr  1 11:42:25 UTC 2022
```

- 쿠버네티스가 캡쳐한 로그는 kubectl logs 명령어로 볼 수 있다.



## 2.1 How nodes handle container logs

![logging-node-level](images/logging-node-level.png)

- 컨테이너 런타임은 컨테이너에서 만들어지는 `stdout` and `stderr` streams을 처리하고 리다이렉트 한다.
- 기본적으로 컨테이너가 다시 시작되면 Kubelet은 종료된 컨테이너 하나를 로그와 함께 보관한다.
- 노드에서 파드를 제거하면 해당하는 모든 컨테이너도 로그와 함께 제거된다.
- Kubelet은 Kubernetes API의 기능을 통해 클라이언트가 로그를 사용할 수 있도록 한다. 
  - `kubectl logs`



**로그 저장 위치**

- 해당 노드에 작동하고 있는 pod에 대한 로그가 아래 로그 저장 위치에 기록된다.
- 컨테이너 런타임에 따라 로그 저장 위치가 다르다.

- CRI-O: `/var/log/pods/`



## 2.2 Log Rotaion



# 3 Cluster-level logging architectures

- 3가지 방식으로 아키텍처를 구성할 수 있다.
  - 모든 노드에 logging agent를 놓는 방식
  - logging을 위한 사이드카 컨테이너를 pod에 포함시키는 방식
  - 애플리케이션에서 logging backend로 직접 로그를 전송하는 방식



## 3.1 Using a node logging agent



## 3.1 Using a sidecar container with the logging agent