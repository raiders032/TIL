# 1 Testing Pod

``` bash
kubectl apply -f https://k8s.io/examples/admin/dns/dnsutils.yaml
```

- `nslookup`을 사용할 수 있는 네트워크 테스트용 파드


# 2 Check the local DNS configuration first

```bash
$ kubectl exec -ti dnsutils -- cat /etc/resolv.conf
search default.svc.cluster.local svc.cluster.local cluster.local
nameserver 10.96.0.10
options ndots:5
```

- 먼저 로컬 DNS 설정부터 확인한다.
- [레퍼런스](https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/#check-the-local-dns-configuration-first)