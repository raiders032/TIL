# 1 PersistentVolume

- 인프라스트럭처의 세부 사항을 처리하지 않고 애플리케이션이 쿠버네티스 클러스터에 스토리지를 요청할 수 있도록 하기 위해 만들어진 오브젝트가 PersistentVolume와 PersistentVolumeClaim이다.
- 클러스터 범주의 리소스
  - 네임스페이스를 지정하지 않는다.
- PV는 관리자가 프로비저닝하거나 스토리지 클래스를 사용하여 동적으로 프로비저닝한 클러스터의 스토리지다.




## 1.1 PersistentVolume과 PersistentVolumeClaim의 목적

- 관리자의 영역과 사용자의 영역 분리하여 사용자가 실제 네트워크 스토리지 인프라스트럭처에 관한 지식 없이 볼륨을 사용하는 것에 있다.



**PersistentVolume과 PersistentVolumeClaim이 없던 시절**

- 아래의 예시는 예전의 개발자가 퍼시스턴트 볼륨을 사용하는 예시다.
- 아래는 파드 개발자가 실제 네트워크 스토리지 인터페이스에 관한 지식(gcePersistentDisk)을 갖추고 있어여 한다.
- 이는 애플리케이션과 개발자로부터 실제 인프라스트럭처를 숨긴다는 쿠버네티스의 기본 아이디어에 반한다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mongodb 
spec:
  volumes:
  - name: mongodb-data
    gcePersistentDisk:
      pdName: mongodb
      fsType: ext4
  containers:
  - image: mongo
    name: mongodb
    volumeMounts:
    - name: mongodb-data
      mountPath: /data/db
    ports:
    - containerPort: 27017
      protocol: TCP
```



**PersistentVolume과 PersistentVolumeClaim을 사용한 버전**

- 아래는 관리자의 영역으로 PersistentVolume을 생성한다.
- 관리자는 네트워크 스토리지 인터페이스에 관한 지식을 갖추고 아래와 같이 작성한다.
- 용량이 얼마나 되는지 단일 노드나 동시에 다수 노드에 읽기나 쓰기가 가능한 여부를 작성한다.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: mongodb-pv
spec:
  capacity: 
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
    - ReadOnlyMany
  persistentVolumeReclaimPolicy: Retain
  gcePersistentDisk:
    pdName: mongodb
    fsType: ext4
```

- 이제 퍼시스턴트볼륨이 필요한 개발자가 아래와 같이 PersistentVolumeClaim 데피니션을 작성한다.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mongodb-pvc 
spec:
  resources:
    requests:
      storage: 1Gi
  accessModes:
  - ReadWriteOnce
  storageClassName: ""
```

- PersistentVolumeClaim이 생성되면 쿠버네티스는 적절한 PersistentVolume을 찾고 PersistentVolumeClaim에 바인딩한다.
- PersistentVolume의 용량은 PersistentVolumeClaim의 요청을 수용할 만큼 충분히 커야한다.
- PersistentVolume은 PersistentVolumeClaim이 요청한 접근 모드를 포함해야 한다.
- 이제 파드에서 PersistentVolumeClaim을 사용하기 위해 아래와 같이 작성한다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mongodb 
spec:
  containers:
  - image: mongo
    name: mongodb
    volumeMounts:
    - name: mongodb-data
      mountPath: /data/db
    ports:
    - containerPort: 27017
      protocol: TCP
  volumes:
  - name: mongodb-data
    persistentVolumeClaim:
      claimName: mongodb-pvc
```



**PersistentVolume과 PersistentVolumeClaim을 사용 시 장점**

- 애플리케이션 개발자가 인프라스트럭처에서 스토리지를 가져오는 간접적인 방식을 사용해 기저에 사용된 실제 스토리지 기술을 알 필요가 없다.
- 위 버전에서 아래 버전으로 가면서 gcePersistentDisk에 대한 지식 없이 스토리지를 이용할 수 있게 되었다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mongodb 
spec:
  volumes:
  - name: mongodb-data
    gcePersistentDisk:
      pdName: mongodb
      fsType: ext4
  containers:
  - image: mongo
    name: mongodb
    volumeMounts:
    - name: mongodb-data
      mountPath: /data/db
    ports:
    - containerPort: 27017
      protocol: TCP
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mongodb 
spec:
  containers:
  - image: mongo
    name: mongodb
    volumeMounts:
    - name: mongodb-data
      mountPath: /data/db
    ports:
    - containerPort: 27017
      protocol: TCP
  volumes:
  - name: mongodb-data
    persistentVolumeClaim:
      claimName: mongodb-pvc
```



## 1.2 PersistentVolume 생성

- PersistentVolume을 생성하는 것은 쿠버네티스 관리자의 영역이다.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv0003
spec:
  capacity:
    storage: 5Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Recycle
  storageClassName: slow
  mountOptions:
    - hard
    - nfsvers=4.1
  nfs:
    path: /tmp
    server: 172.17.0.2
```



`persistentVolumeReclaimPolicy`

- [레퍼런스](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#reclaiming)
- PersistentVolumeClaim과 바인딩되어 사용된 후 PersistentVolumeClaim가 삭제되었을 때 PersistentVolume를 처리하는 정책을 지정한다.
- ReclaimPolicy의 종류는 Retain, Recycle, Delete가 있다.

**Retain**

- PersistentVolume과 바인딩된 PersistentVolumeClaim이 삭제되어도 볼륨과 콘텐츠가 유지된다.
- 바인딩된 PersistentVolumeClaim이 삭제되면 PersistentVolume의 상태는 Bound에서 Released 상태가 된다.
- 이미 볼륨을 사용했기 때문에 데이터를 가지고 있으므로 클러스터 관리자가 볼륨을 완전히 비우지 않으면 새로운 클레임에 바인딩할 수 없다.

**Recycle**

- 볼륨의 콘텐츠를 삭제하고 볼륨이 다시 클레임될 수 있도록 볼륨을 사용 가능하게 만든다.
- 이렇게 하면 PersistentVolume을 여러 번 다른 PersistentVolumeClaim과 다른 파드에서 재사용할 수 있다.
- Recycle은 더이상 사용하지 않는다.
  - 대신 동적 프로비저닝을 사용해 동적으로 신규 디스크를 할당하고 사용 후 자동으로 삭제하므로 같은 디스크를 재사용하는 Recycle을 사용할 필요가 없어졌다. 

**Delete**

- PersistentVolumeClaim이 삭제되면 PersistentVolume도 동시에 삭제된다.



`storage`

- 용량을 지정할 때 주의할 점은 동적 프로비저닝을 사용할 수 없는 환경에서는 작은 용량의 PersistentVolume도 준비해 두어야 한다.
- 예를 들어 PersistentVolume이 한개 존재하며 용량이 10GiB인 경우 PersistentVolumeClaim 요청 용량이 3GiB인 경우  10GiB의 PersistentVolume이 할당되어 7GiB가 낭비될 수 있다.



`accessModes`

- [레퍼런스](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes)
- PersistentVolume의 타입에 따라 지원하는 접근 모드가 다르다.

**ReadWriteMany**

- 여러개의 노드가 읽고 쓸 수 있도록 마운트 하는 옵션

**ReadOnlyMany**

- 여러개의 노드가 읽을 수 있도록 마운트 하는 옵션

**ReadWriteOnce**

- 하나의 노드가 읽고 쓸 수 있도록 마운트 하는 옵션



`volumeMode`

- `Filesystem`, `Block`  두 가지 모드를 지원한다.
- 기본값 `Filesystem`



`storageClassName`

- PV는 클래스를 가질 수 있다.
- storageClassName으로 StorageClass의 이름을 지정함으로써 클래스를 가지게 된다.
- PV가 클래스를 가지면 해당 클래스를 원하는 PVC와 매칭된다.



## 1.3 Provisioning

- PV를 생성하는 행위를 Provisioning이라고 한다.
- Provisioning에는 두 가지의 종류가 있다.
  - **Static Provisioning**
  - **Dynamic Provisioning**



**Static Provisioning**

- 클러스터 관리자가 PV를 직접 생성한다.
- 인프라스트럭처에 대한 전문 지식을 가지고 직접 스토리지를 다룬다.



**Dynamic Provisioning**

- Static Provisioning은 여전히 클러스터 관리자는 실제 스토리지를 미리 프로비저닝해야 한다.
- PersistentVolume의 동적 프로비저닝을 사용하면 위 작업을 자동화할 수 있다.
- 관리자는 PersistentVolume을 생성하는 대신 PersistentVolume 프로비저를 배포하고 사용자가 선택 가능한 PersistentVolume의 타입을 하나 이상의 스토리지클래스 오브젝트로 정의한다.
- 사용자가 PersistentVolumeClaim에서 스토리지클래스를 참조하면 프로비저너가 퍼시스턴트 스토리지를 프로비저닝할 때 처리한다.
- 대부분의 클라우드 공급자는 프로비저너를 포함하므로 관리자가 항상 배포하지 않아도 된다.
- 온프레미스 환경에서는 사용자 정의 프로비저너가 배포돼야 한다.



**Dynamic Provisioning의 장점**

- 사용자의 PVC에 매칭되는 Static PV가 없으면 Dynamic PV가 자동으로 생성된다.
- 사전에 PersistentVolume을 생성할 필요가 없고 용량 낭비가 발생하지 않는다.
  - PersistentVolumeClaim에서 요청한 용량 만큼의 PersistentVolume이 자동 생성된다.



## 1.4 Status

**Available**

- 아직 PVC에 바운드 되지 않은 상태

**Bound**

- PVC에 바운드된 상태

**Released**

- 연관된 PVC는 삭제되었지만 볼륨은 그대로 남아 있는 상태

**Failed**

- 볼륨 자동 해제가 실패한 상태



# 2 PersistentVolumeClaim

- 인프라스트럭처의 세부 사항을 처리하지 않고 애플리케이션이 쿠버네티스 클러스터에 스토리지를 요청할 수 있도록 하기 위해 만들어진 오브젝트가 PersistentVolume와 PersistentVolumeClaim이다.
- PersistentVolumeClaim은 PersistentVolume을 요청하는 리소스다.
- PersistentVolumeClaim에서 지정된 조건(용량, 레이블등)을 기반으로 PersistentVolume에 대한 요청이 들어오면 스케줄러는 현재 가지고 있는 PersistentVolume에서 적당한 볼륨을 할당한다.
- namespaed 리소스다.



## 2.1 PersistentVolumeClaim 생성

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: myclaim
spec:
  accessModes:
    - ReadWriteOnce
  volumeMode: Filesystem
  resources:
    requests:
      storage: 8Gi
  storageClassName: slow
  selector:
    matchLabels:
      release: "stable"
    matchExpressions:
      - {key: environment, operator: In, values: [dev]}
```

`storageClassName`

- storageClassName에 StorageClass의 이름을 넣으면 해당 클래스의 PV만 매칭될 수 있다.
- storageClassName의 값을 `""`으로 세팅하면 클래스가 없는 PV와 매칭된다.
- storageClassName을 아예 생략하면 DefaultStorageClass admission plugin의 동작 여부에 따라 다르게 동작한다.
  - DefaultStorageClass admission plugin이 작동하고 있으면 default로 지정한 StorageClass가 사용된다.



## 2.2 PersistentVolumeClaim 사용

- 파드는 PersistentVolumeClaim을 사용해 스토리지에 접근이 가능하다
- PersistentVolumeClaim은 Pod와 같은 네임스페이스에 있어야 한다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
    - name: myfrontend
      image: nginx
      volumeMounts:
      - mountPath: "/var/www/html"
        name: mypd
  volumes:
    - name: mypd
      persistentVolumeClaim:
        claimName: myclaim
```



# 3 StorageClass

- PersistentVolumeClaim이 사용자로하여금 스토리지를 추상화해서 인프라스트럭처에 대한 지식 없지 스토리지를 사용하는데 도움을 준다.
  - 하지만 사용자가 성능상의 이유로 특정한 스토리지를 사용하고 싶은 경우가 있다.
  - 관리자는 스토리지의 디테일 부분을 숨겨 이러한 사용자의 요구를 충족시켜야 하는데 이 때 `StorageClass` 리소스가 사용된다.
- 동적 프로비저닝을 사용하려면 어떤 PersistentVolume을 생성할지 정의한 StorageClass를 생성해야 한다.
- [1.3 Dynamic-Provisioning](#1.3-Dynamic-Provisioning)





## 3.1 StorageClass 생성

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp2
reclaimPolicy: Retain
allowVolumeExpansion: true
mountOptions:
  - debug
volumeBindingMode: Immediate
```

`volumeBindingMode`

- Immediate
  - PersistentVolumeClaim이 생성되면 PersistentVolume이 생성된다.
  - 이는 파드에 PersistentVolumeClaim이 어태치되어 있지 않아도 PersistentVolume이 생성된다는 것을 의미한다.
- WaitForFirstConsumer
  - 실제 파드가 PersistentVolumeClaim를 사용할 때 PersistentVolume이 생성된다.
- 기본값 Immediate
- Persistent Volume 플러그인 마다 지원 여부가 다르다.



`reclaimPolicy`

- StorageClass가 동적으로 생성한 PersistentVolume은 `reclaimPolicy` 필드에 명시된 reclaim policy를 갖는다.
- 값으로 Delete 또는 Retain이 가능하다
- reclaimPolicy을 생략하면 기본적으로 Delete가 적용된다.



`provisioner`

- PV를 프로비저닝하기 위해 사용되는 볼륨 플러그인을 설정한다.

| Volume Plugin        | Internal Provisioner |                        Config Example                        |
| :------------------- | :------------------: | :----------------------------------------------------------: |
| AWSElasticBlockStore |          ✓           | [AWS EBS](https://kubernetes.io/docs/concepts/storage/storage-classes/#aws-ebs) |
| AzureFile            |          ✓           | [Azure File](https://kubernetes.io/docs/concepts/storage/storage-classes/#azure-file) |
| AzureDisk            |          ✓           | [Azure Disk](https://kubernetes.io/docs/concepts/storage/storage-classes/#azure-disk) |
| CephFS               |          -           |                              -                               |
| Cinder               |          ✓           | [OpenStack Cinder](https://kubernetes.io/docs/concepts/storage/storage-classes/#openstack-cinder) |
| FC                   |          -           |                              -                               |
| FlexVolume           |          -           |                              -                               |
| GCEPersistentDisk    |          ✓           | [GCE PD](https://kubernetes.io/docs/concepts/storage/storage-classes/#gce-pd) |
| iSCSI                |          -           |                              -                               |
| NFS                  |          -           | [NFS](https://kubernetes.io/docs/concepts/storage/storage-classes/#nfs) |
| RBD                  |          ✓           | [Ceph RBD](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd) |
| VsphereVolume        |          ✓           | [vSphere](https://kubernetes.io/docs/concepts/storage/storage-classes/#vsphere) |
| PortworxVolume       |          ✓           | [Portworx Volume](https://kubernetes.io/docs/concepts/storage/storage-classes/#portworx-volume) |
| Local                |          -           | [Local](https://kubernetes.io/docs/concepts/storage/storage-classes/#local) |



# 4 Provisioner

- [nfs-subdir-external-provisioner](https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner)



참고

- https://kubernetes.io/docs/concepts/storage/persistent-volumes/
- https://kubernetes.io/docs/concepts/storage/storage-classes/