# 1 install



## 1.1 Requirements

- Installed [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) command-line tool.
- Have a [kubeconfig](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) file (default location is `~/.kube/config`).
- CoreDNS. Can be enabled for microk8s by `microk8s enable dns && microk8s stop && microk8s start`



## 1.2 Install Argo CD

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```



# 2 Download Argo CD CLI

- https://argo-cd.readthedocs.io/en/stable/cli_installation/



**Linux**

```
curl -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd
rm argocd-linux-amd64
```



**Mac**

```bash
brew install argocd
```



# 3 Access The Argo CD API Server

- 기본적으로 Argo CD API Server는 external IP로 노출되지 않는다.
- 외부 접근을 가능하게 하는 3 가지 방법이 있다. 



## 3.1 Service Type Load Balancer

- argocd-server service의 타입은 기본적으로 ClusterIP이다.
- 이를 아래와 같이 LoadBalancer 타입으로 변경해 외부 접근이 가능하게 한다.

```bash
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'
```

```bash
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'
```



## 3.2 Ingress



## 3.3 Port Forwarding

- https://localhost:8080 로 접근 가능

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```



# 4 초기 비밀번호 얻기

- 아래 명령어로 admin 계정의 초기 비밀번호를 얻을 수 있다.

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
```



**Argo CD API Server에 로그인**

```bash
# admin의 초기 비밀번호로 
argocd login <ARGOCD_SERVER>
Username: admin
Password:
```



**비밀번호 변경**

```bash
argocd account update-password
*** Enter password of currently logged in user (admin):
*** Enter new password for user admin:
*** Confirm new password for user admin:
Password updated
```



참고

- https://argo-cd.readthedocs.io/en/stable/getting_started/