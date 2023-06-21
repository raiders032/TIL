# 1 MetalLB



# 2 설치



## 2.1 Installation By Manifest

- [레퍼런스](https://metallb.universe.tf/installation/)

```bash
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.13.9/config/manifests/metallb-native.yaml
```



## 2.2 L2 CONFIGURATION

- [레퍼런스](https://metallb.universe.tf/configuration/_advanced_l2_configuration/)

```yaml
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: first-pool
  namespace: metallb-system
spec:
  addresses:
  - 192.168.9.1-192.168.9.1
```

```yaml
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: l2-advertisement
  namespace: metallb-system
spec:
  ipAddressPools:
  - third-pool
```