# 1 Resource Management

- 파드를 명시할 때 컨테이너가 필요로 하는 자원을 명시할 수 있다.
- 자원에는 대표적으로 CPU와 memory가 있다.
- 컨테이너의 요구 자원을 명시하면 `kube-scheduler`가 이 정보를 바탕으로 파드를 생성할 노드를 선택한다.
- 컨테이너의 자원 제한을 명시하면 `kubelet`과 컨테이너 런타임이 컨테이너가 자원 제한 이상의 자원을 사용하지 못하게 강제한다.



# 2 Requests and limits

- 파드가 실행되는 노드의 자원이 충분한 경우 컨테이너가 `requests` 이상의 자원을 사용할 수 있지만 `limits` 이상의 자원은 사용할 수 없다.
- 컨테이너의 프로세스가 `limits` 이상의 자원을 사용하면 시스템 커널이 해당 프로세스를 죽인다. (Out of memory 에러)



**컨테이너의 requests와 limits 명시하기**

- `spec.containers[].resources.limits.cpu`
- `spec.containers[].resources.limits.memory`
- `spec.containers[].resources.limits.hugepages-<size>`
- `spec.containers[].resources.requests.cpu`
- `spec.containers[].resources.requests.memory`
- `spec.containers[].resources.requests.hugepages-<size>`



## 2.1 CPU resource units

- CPU 자원의 단위는 CPU의 개수이다.
- `0.1` 과 `100m` 은 같은 양이다.



## 2.2 Memory resource units

- 메모리 자원의 단위는 bytes다.
- `64MiB` 는 `2^26 bytes`이다.



**예시**

- 0.25 CPU 와 64MiB (226 bytes)의 메모리는 요구한다.
- 0.5 CPU 와 128MiB of memory의 제한이 있다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: app
    image: images.my-company.example/app:v4
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
  - name: log-aggregator
    image: images.my-company.example/log-aggregator:v6
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```



참고

- https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/