

# 1 log

- kubelet의 로그는 아래와 같이 확인한다.

```bash
journalctl -u kubelet
```



# 2 node STATUS NotReady



## 상황

```bash
$ kubectl get nodes
NAME               STATUS     ROLES    AGE    VERSION
af-k8s-master      Ready      master   2y4d   v1.19.10
af-k8s-worker-00   NotReady   <none>   2y4d   v1.19.10
af-k8s-worker-01   NotReady   <none>   2y4d   v1.19.10
af-k8s-worker-02   NotReady   <none>   2y4d   v1.19.10
```

- node의 status가 NotReady인 상황



```bash
~$ kubectl describe node af-k8s-worker-00
```

- 노드의 상태를 확인해보자



```
Conditions:
  Type                 Status    LastHeartbeatTime                 LastTransitionTime                Reason              Message
  ----                 ------    -----------------                 ------------------                ------              -------
  NetworkUnavailable   False     Fri, 03 Feb 2023 15:08:17 +0900   Fri, 03 Feb 2023 15:08:17 +0900   CalicoIsUp          Calico is running on this node
  MemoryPressure       Unknown   Wed, 08 Feb 2023 16:37:34 +0900   Wed, 08 Feb 2023 16:40:58 +0900   NodeStatusUnknown   Kubelet stopped posting node status.
  DiskPressure         Unknown   Wed, 08 Feb 2023 16:37:34 +0900   Wed, 08 Feb 2023 16:40:58 +0900   NodeStatusUnknown   Kubelet stopped posting node status.
  PIDPressure          Unknown   Wed, 08 Feb 2023 16:37:34 +0900   Wed, 08 Feb 2023 16:40:58 +0900   NodeStatusUnknown   Kubelet stopped posting node status.
  Ready                Unknown   Wed, 08 Feb 2023 16:37:34 +0900   Wed, 08 Feb 2023 16:40:58 +0900   NodeStatusUnknown   Kubelet stopped posting node status.
```

- Conditions을 보면 `Kubelet stopped posting node status` 
- Kubelet이 노드 상태를 더이상 api 서버에 보내지않고 있다.



```bash
ssh af-k8s-worker-00

$ systemctl status kubelet
● kubelet.service - kubelet: The Kubernetes Node Agent
   Loaded: loaded (/lib/systemd/system/kubelet.service; enabled; vendor preset: enabled)
  Drop-In: /etc/systemd/system/kubelet.service.d
           └─10-kubeadm.conf
   Active: active (running) since Wed 2023-02-08 08:08:56 UTC; 14min ago
     Docs: https://kubernetes.io/docs/home/
 Main PID: 22094 (kubelet)
    Tasks: 41 (limit: 4915)
   CGroup: /system.slice/kubelet.service
           └─22094 /usr/bin/kubelet --bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf --config=/var/lib/kubelet/config.yaml --container-runtime=remote --container-runtime-endpoint=/v


...

Unable to register node "af-k8s-worker-00" with API server: Post "https://192.168.159.41:6443/api/v1/nodes": dial tcp 192.168.159.41:6443: connect: no route to host
...
```

- 문제가 있는 노드로 ssh 접속 후 systemctl status kubelet으로 kubelet의 상태를 확인한다.
- 마스터 노드에 워커노드 등록이 안된다.



## 원인

- 이전에 방화벽 설정을 만진적이 있었는데 그게 잘못된거 같다.



## 해결

```bash
iptables --flush
iptables -tnat --flush
```

- Iptables Firewall Rules를 제거하기 위해 마스터노드에서 해당 명령어 실행



## 결과

```bash
$ kubectl get nodes
NAME               STATUS     ROLES    AGE    VERSION
af-k8s-master      Ready      master   2y4d   v1.19.10
af-k8s-worker-00   Ready      <none>   2y4d   v1.19.10
af-k8s-worker-01   Ready      <none>   2y4d   v1.19.10
af-k8s-worker-02   Ready      <none>   2y4d   v1.19.10
```

