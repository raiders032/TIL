# 1 Volumes

- 파드 내부의 각 컨테이너는 고유하게 분리된 파일시스템을 가진다.
- 같은 파드 내에서 새로 시작된 컨테이너는 이전에 실행했던 컨테이너에 쓰여진 파일시스템의 어떤 것도 볼 수 없다.
- 새로운 컨테이너가 이전에 종료된 위치에서 계속되기를 원한다면 스토리지 볼륨을 정의해 실제 데이터를 가진 디렉터리를 보존할 수 있다.
- 파드에서 실행중인 애플리케이션이 디스크에 데이터를유지하고 파드가 다른 노드에 재스케줄링된 경우에도 동일한 데이터를 사용하려면 `Volumes`이 아니라 `Persistent Volumes`을 사용해야 한다.



**스토리지 볼륨**

- 스토리지 볼륨은 파드와 같은 최상위 리소스는 아니며 파드의 일부분으로 정의된다.
- 따라서 파드와 동일한 라이프사리클을 가진다.
  - 파드가 시작되면 볼륨이 생성된다.
  - 파드가 삭제되면 볼륨이 삭제된다.
- 하지만 컨테이너가 다시 시작되면 새로운 컨테이너는 이전 컨테이너가 볼륨에 기록한 모든 파일들을 볼 수 있다.
- 또한 파드가 여러개의 컨테이너를 가진 경우 모든 컨테이너가 볼륨을 공유할 수 있다.



# 2 볼륨 사용법

- `volumes`으로 볼륨을 정의하는 것만으로는 충분하지 않고 `volumeMounts` 를 통해 컨테이너 스펙에 정의해야 한다.



**예시**

- 아래와 같이 `spec.volumes`로 볼륨을 정의하고
- `spec.containers[].volumeMounts` 를 통해 컨테이너 패스를 지정한다.
- `cache-volume`이란 이름의 볼륨을 컨테이너의 `/cache`에 마운트한다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /cache
      name: cache-volume
  volumes:
  - name: cache-volume
    emptyDir:
      sizeLimit: 500Mi
```



# 3 볼륨의 종류

- [레퍼런스](https://kubernetes.io/docs/concepts/storage/volumes/#volume-types)



## 3.1 emptyDir

- emptyDir 볼륨은 파드가 노드에 할당될 때 만들어지고 파드가 실행되는 동안 유지된다.
- 이름에서도 알 수 있듯이 emptyDir 볼륨은 초기에 비어있다.
- 파드에 속한 모든 컨테이너가 emptyDir 볼륨의 파일을 읽고 쓸 수 있다.
- 파드가 제거되면 emptyDir의 볼륨도 영구적으로 삭제된다.
- emptyDir은 파드를 호스팅하는 워커 노드의 실제 디스크에 생성된다.
  - 노드 디스크가 어떤 유형인지에 따라 성능이 결정된다.
  - 디스크가 아닌 메모리를 사용하도록 설정할 수 있다.



**이점**

- emptyDir은 동일 파드에서 실행중인 컨테이너 간 파일을 공유할 때 유용하다.



## 3.1 hostPath

- [레퍼런스](https://kubernetes.io/docs/concepts/storage/volumes/#hostpath)
- 보안적인 문제를 가지고 있으므로 가급적 사용하지 않는 것이 좋다.
- 반드시 사용해야 한다면 정말 필요한 파일과 디렉토리로 범위를 좁히고 ReadOnly로 마운팅하라
- 노드의 시스템 파일을 읽기/쓰기를 하는 경우에만 사용하고 여러 파드에 걸쳐 데이터를 유지하기 위해서는 절대 사용하지 말자.
