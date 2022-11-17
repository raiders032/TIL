# 1 DaemonSet

- 전체 노드에서 pod가 하나씩 실행되도록 보장하는 오브젝트이다.
- 클러스터에 노드가 추가되면 파드 하나가 해당 노드에서 실행되고 노드가 제거되면 파드도 제거된다.
- DaemonSet은 Deployment 처럼 롤링 업데이트 기능을 제공한다.



## 1.1 주용도

- 시스템 수준의 작업을 수행하는 인프라 관련 파드가 좋은 예시다.
- running a cluster `storage` daemon on every node
- running a `logs` collection daemon on every node
- running a node `monitoring` daemon on every node



**예시**

- 모든 노드에 하나씩 실행되고 있는 `kube-proxy` 파드가 daemonSet으로 관리되는 파드다.

```
$ kubectl get daemonSet -n kube-system
NAME         DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR            AGE
kube-proxy   5         5         5       5            5           kubernetes.io/os=linux   6d1h
```



# 2 Writing a DaemonSet Spec

**daemonset.yaml**

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd-elasticsearch
  namespace: kube-system
  labels:
    k8s-app: fluentd-logging
spec:
  selector:
    matchLabels:
      name: fluentd-elasticsearch
  template:
    metadata:
      labels:
        name: fluentd-elasticsearch
    spec:
      tolerations:
      # these tolerations are to have the daemonset runnable on control plane nodes
      # remove them if your control plane nodes should not run pods
      - key: node-role.k ubernetes.io/control-plane
        operator: Exists
        effect: NoSchedule
      - key: node-role.kubernetes.io/master
        operator: Exists
        effect: NoSchedule
      containers:
      - name: fluentd-elasticsearch
        image: quay.io/fluentd_elasticsearch/fluentd:v2.5.2
        resources:
          limits:
            memory: 200Mi
          requests:
            cpu: 100m
            memory: 200Mi
        volumeMounts:
        - name: varlog
          mountPath: /var/log
      terminationGracePeriodSeconds: 30
      volumes:
      - name: varlog
        hostPath:
          path: /var/log
```



참고

- https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/