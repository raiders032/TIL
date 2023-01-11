# 1 Backing up an etcd cluster

**etcd 상세 조회**

```bash
$ kubectl describe pod -n kube-system etcd-controlplane
```



**etcd 상세 조회 결과**

- 백업을 할 때 필요한 정보를 조회한다.

```bash
Containers:
  etcd:
    Command:
      etcd
      --cert-file=/etc/kubernetes/pki/etcd/server.crt
      --data-dir=/var/lib/etcd
      --key-file=/etc/kubernetes/pki/etcd/server.key
      --listen-client-urls=https://127.0.0.1:2379,https://10.31.77.3:2379
      --trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt
```



**etcd 백업**

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

````bash
ETCDCTL_API=3 etcdctl \
 --endpoints=https://10.35.173.18:2379 \
 --cacert=/etc/kubernetes/pki/etcd/ca.crt \
 --cert=/etc/kubernetes/pki/etcd/server.crt \
 --key=/etc/kubernetes/pki/etcd/server.key \
 snapshot save /opt/cluster1.db
````





# 2 Restoring an etcd cluster

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



# 기타

## context 변경

```bash
kubectl config use-context context-name
```

