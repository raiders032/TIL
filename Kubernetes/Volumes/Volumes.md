# 1 Volumes

- 파드 내부의 각 컨테이너는 고유하게 분리된 파일시스템을 가진다.
- 같은 파드 내에서 새로 시작된 컨테이너는 이전에 실행했던 컨테이너에 쓰여진 파일시스템의 어떤 것도 볼 수 없다.
- 새로운 컨테이너가 이전에 종료된 위치에서 계속되기를 원한다면 스토리지 볼륨을 정의해 실제 데이터를 가진 디렉터리를 보존할 수 있다.
  - 파드가 아니라 컨테이너라는 점을 주목하자.
  - 파드간의 데이터 영속화가 필요하면 스토리지 볼륨 대신  `Persistent Volumes`을 사용하자




## 1.1 스토리지 볼륨

- 스토리지 볼륨은 파드와 같은 최상위 리소스는 아니며 파드의 일부분으로 정의된다.
- 파드의 일부분으로 정의하기 때문에 파드와 동일한 라이프사이클을 가진다.
  - 파드가 시작되면 볼륨이 생성된다.
  - 파드가 삭제되면 볼륨이 삭제된다.
- 하지만 컨테이너가 다시 시작되면 새로운 컨테이너는 이전 컨테이너가 볼륨에 기록한 모든 파일들을 볼 수 있다.
- 또한 파드가 여러개의 컨테이너를 가진 경우 모든 컨테이너가 볼륨을 공유할 수 있다.



**스토리지 볼륨 예시**

- 아래와 같이 파드의 일부분으로 `volumes` 필드를 사용해 스토리지 볼륨을 정의한다.

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



**리눅스 파일 시스템**

- 리눅스에서는 파일시스템을 파일 트리의 임의 경로에 마운트할 수 있다.
- 이렇게 하면 마운트된 파일시스템의 내용은 마운트된 디렉터리에서 접근할 수 있다.
- 같은 볼륨을 두 개의 컨테이너에 마운트하면 컨테이너는 동일한 파일로 작동할 수 있다.



## 1.2 스토리지 볼륨과 Persistent Volumes

- 파드에서 실행중인 애플리케이션이 디스크에 데이터를 유지하고 파드가 다른 노드에 재스케줄링된 경우에도 동일한 데이터를 사용하려면 `Volumes`이 아니라 `Persistent Volumes`을 사용해야 한다.
- 파드가 다른 노드에 재스케줄링된 경우에도 동일한 데이터를 접근하려면 어떤 클러스터 노드에서도 접근이 가능해야한다.



**Volume, PersistentVolume, PersistentVolumesClaim 비교**

- Volume
  - Volume은 미리 준비된 사용 가능한 볼륨(호스트 볼륨, nfs, Ceph) 등을 매니페스트에 직접 지정하여 사용할 수 있게 하는 것
  - 사용자가 Volume을 사용할 수 있지만 쿠베네티스에서 신규 Volume을 생성하거나 기존 Volume을 삭제하는 작업을 할 수 없다.
  - 또한 매니페스트에서 Volume을 생성하는 것도 불가능하다.
- PersistentVolume
  - PersistentVolume은 외부 영구 볼륨을 제공하는 시스템과 연계하여 신규 볼륨을 생성하거나 기존 볼륨을 삭제하는 작업이 가능하다.
  - 매니페스트에서 PersistentVolume을 별도로 생성한 후 사용하는 형태다.
- PersistentVolumesClaim
  - PersistentVolume은 클러스터에 볼륨을 등록만 하기 때문에 실제 파드에서 사용하려면 PersistentVolume을 정의하고 사용해야 한다.
  - 동적 프로비저닝 기능을 사용하면 PersistentVolume이 사용된 시점에 PersistentVolume이 동적으로 생성된다.



# 2 볼륨 사용법

- `volumes`으로 볼륨을 정의하는 것만으로는 충분하지 않고 `volumeMounts`를 통해 컨테이너 스펙에 정의해야 한다.



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



**예시**

- 컨테이너의 `/cache`에 `cache-volume`이라는 볼륨을 마운트한다.

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



## 3.1 hostPath

- [레퍼런스](https://kubernetes.io/docs/concepts/storage/volumes/#hostpath)
- hostPath 볼륨은 호스트 노드의 파일시스템을 포드로 파일 또는 디렉토리로 마운트한다.
- 보안적인 문제를 가지고 있으므로 가급적 사용하지 않는 것이 좋다.
  - 보안상의 이유로 hostPath를 사용할 수 없는 쿠버네티스 환경도 있다.

- 반드시 사용해야 한다면 정말 필요한 파일과 디렉토리로 범위를 좁히고 ReadOnly로 마운팅하라



**주용도**

- 특정 시스템 레벨의 파드 보통은 데몬셋으로 관리되는 파드가 노드의 파일을 읽거나 파일시스템을 통해 노드 디바이스에 접근할 때 hostPath를 사용한다.



**주의사항**

- 파드가 삭제되면 다음 파드가 호스트의 동일 경로를 가리키는 hostPath 볼륨을 사용하고 이전 파드와 동일한 노드와 스케줄링 된다는 조건에서 새로운 파드가 이전 파드가 남긴 모든 항목을 볼 수 있다.
  - emptyDir는 파드가 종료되면 삭제되는 반면 hostPath 볼륨의 컨텐츠는 삭제되지 않는다.
- hostPath 볼륨의 컨텐츠는 특정 노드에 파일시스템에 저장되므로 파드가 다른 노드로 다시 스케줄링 되면 더 이상 이전 데이터를 볼 수 없다.
- 따라서 노드의 시스템 파일을 읽기/쓰기를 하는 경우에만 사용하고 **여러 파드에 걸쳐 데이터를 유지하기 위해서는 절대 사용하지 말자**.



**예시**

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
    - mountPath: /test-pd
      name: test-volume
  volumes:
  - name: test-volume
    hostPath:
      # directory location on host
      path: /data
      # this field is optional
      type: Directory
```
