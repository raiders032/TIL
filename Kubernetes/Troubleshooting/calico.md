# 1 Calico node 0/1 READY



## 상황

```bash
$ kubectl get pods -n kube-system
NAME                                      READY   STATUS        RESTARTS   AGE
calico-node-9b4qh                         1/1     Running       1          157m
calico-node-5lwqf                         0/1     Running       0          32m
calico-node-p7ghg                         0/1     Running       0          32m
calico-node-t2wm2                         1/1     Running       0          32m
```

- calico-node 중 일부에서 0/1 READY 상황



```bash
$ kubectl describe pod calico-node-5lwq -n kube-system
```

```bash
Events:
...
  Warning  Unhealthy  13m                   kubelet            Readiness probe failed: calico/node is not ready: BIRD is not ready: BGP not established with 192.168.159.41,192.168.159.43,192.168.159.71,192.168.159.72,192.168.159.73,192.168.159.74,192.168.159.75,192.168.159.76,172.24.0.12023-02-08 08:34:40.689 [INFO][585] health.go 156: Number of node(s) with BGP peering established = 0
...
```

- Readiness probe가 실패하고 있다.
- BGP not established란 클러스터의 특정 peer가 unreachable하다는 것이다.
- [레퍼런스](https://docs.tigera.io/calico/3.25/operations/troubleshoot/troubleshooting#error-caliconode-is-not-ready-bird-is-not-ready-bgp-not-established-with-10001)



```bash
$ sudo calicoctl get nodes --allow-version-mismatch
NAME
af-k8s-master
af-k8s-worker-00
af-k8s-worker-01
af-k8s-worker-02
af-01
af-02
af-03
af-04
af-05
af-06
```

- calicoctl 사용해 노드 목록을 확인한다.
- 이 중에 현재는 사용하지 않는 노드들이 함께 있다.
- af-01 부터 af-06 해당 노드를 클러스터에서 지워보자



```bash
$ kubectl drain af-01 --ignore-daemonsets --delete-local-data
$ kubectl drain af-02 --ignore-daemonsets --delete-local-data
$ kubectl drain af-03 --ignore-daemonsets --delete-local-data
$ kubectl drain af-04 --ignore-daemonsets --delete-local-data
$ kubectl drain af-05 --ignore-daemonsets --delete-local-data
$ kubectl drain af-06 --ignore-daemonsets --delete-local-data
```

- 먼저 drain 명령어로 해당 노드에 스케줄된 파드롤 다른 곳으로 옮긴다.



```bash
kubectl delete node tmaxaf-01
kubectl delete node tmaxaf-02
kubectl delete node tmaxaf-03
kubectl delete node tmaxaf-04
kubectl delete node tmaxaf-05
kubectl delete node tmaxaf-06
```

- 해당 노드들 클러스터에서 제거한다.



```bash
$ kubectl get pod -n kube-system  -o wide
NAME                                      READY   STATUS    RESTARTS   AGE     IP               NODE               NOMINATED NODE   READINESS GATES
calico-node-5lwqf                         0/1     Running   0          17h     192.168.159.44   af-k8s-worker-02   <none>           <none>

calico-node-9b4qh                         1/1     Running   1          19h     192.168.159.41   af-k8s-master      <none>           <none>

calico-node-p7ghg                         0/1     Running   0          17h     192.168.159.42   af-k8s-worker-00   <none>           <none>

calico-node-t2wm2                         1/1     Running   0          17h     192.168.159.43   af-k8s-worker-01   <none>           <none>
```

- 다시 칼리코 노드 확인
- 여전히 문제가 있다.



## 원인

```bash
$ calicoctl get nodes af-k8s-worker-00 -o yaml
apiVersion: projectcalico.org/v3
kind: Node
metadata:

...

spec:
  addresses:
  - address: 172.24.0.1/16
    type: CalicoNodeIP
  - address: 192.168.159.42
    type: InternalIP
  bgp:
    ipv4Address: 172.24.0.1/16
  orchRefs:
  - nodeName: af-k8s-worker-00
    orchestrator: k8s
status:
  podCIDRs:
  - 10.10.1.0/24
```

- 노드들의 spec.bgp.ipv4Address를 살펴보면 서로 다른 네트워크에 있는 것을 알 수 있다.



## 해결

```bash
calicoctl patch node af-k8s-worker-00 -p '{"spec":{"bgp": {"ipv4Address": "192.168.159.42/24"}}}'
```

- 각각 노드에대해서 위 명령으로 spec.bgp.ipv4Address를 같은 대역의 IP로 수정했다



## 결과

```bash
$ sudo calicoctl node status
Calico process is running.

IPv4 BGP status
+----------------+-------------------+-------+----------+-------------+
|  PEER ADDRESS  |     PEER TYPE     | STATE |  SINCE   |    INFO     |
+----------------+-------------------+-------+----------+-------------+
| 192.168.159.42 | node-to-node mesh | up    | 02:11:01 | Established |
| 192.168.159.43 | node-to-node mesh | up    | 02:11:01 | Established |
| 192.168.159.44 | node-to-node mesh | up    | 02:11:02 | Established |
+----------------+-------------------+-------+----------+-------------+

IPv6 BGP status
No IPv6 peers found.
```

- peer를 확인하니 정상적이다.
