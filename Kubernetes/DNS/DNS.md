# 1 DNS

- [레퍼런스](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/)
- 쿠버네티스는 서비스와 파드를 위한 DNS 레코드를 생성해준다.
	- 따라서 서비스를 IP 주소 대신에 DNS 이름으로 접근할 수 있다.

<br>

## 1.1 kubelet 설정

- kubelet 설정을 통해 파드가 사용할 DNS 서버를 설정할 수 있다.
- `cat /var/lib/kubelet/config.yaml`으로 kubelet의 설정을 확인해 보면 `clusterDNS` 필드로 DNS 서버의 주소를 지정한다.

<br>

**kubelet 설정 파일**

- kubelet의 설정 파일은 `/var/lib/kubelet/config.yaml` 이곳에 위치한다.
- 내용을 확인해보면 아래와 같다.

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
...
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
```



**파드**

- 모든 파드의 `/etc/resolv.conf` 파일은 kubelet이 설정한다. 
- 아래와 같이 실제 생성된 파드에서 `/etc/resolv.conf`를 확인해 보면 kubelet에 설정된 nameserver의 IP 주소를 확인할 수 있다.


```
search default.svc.cluster.local svc.cluster.local cluster.local
nameserver 10.96.0.10
options ndots:5
```

- 추가적으로 search 키워드로 DNS 쿼리 시 `default.svc.cluster.local`, `svc.cluster.local`,  `cluster.local`이 postfix로 붙는다.

<br>

# 2 Service 레코드

- 서비스가 생서되면 A 또는 AAAA 레코드가 할당된다.
- 도메인 이름은 아래와 같이 구성된다.
	- my-svc.my-namespace.svc.cluster-domain.example
	- 해당 도메인 이름으로 질의하면 서비스의 클러스터 IP를 얻을 수 있다.
- 헤드리스 서비스의 도메인 이름도 아래와 같이 구성된다.
	- my-svc.my-namespace.svc.cluster-domain.example
	- 해당 도메인 이름으로 질의하면 서비스가 관리하는 모든 파드의 IP 집합을 얻을 수 있다.

<br>

# 3 Pod 레코드

