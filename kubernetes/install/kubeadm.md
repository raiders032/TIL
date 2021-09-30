# 쿠버네티스 설치

* 하나의  control-plane을 가지는 쿠버네티스 클러스터 구성하기



# 1. kubeadm, kubelet 및 kubectl 설치

* master node, worker node 공통

> **kubeadm**
>
> kubeadm을 사용하면 Kubernetes 클러스터를 만들 수 있습니다. 실제로 kubeadm을 사용하여 쿠베르네테스 적합성 테스트를 통과할 클러스터를 만들 수 있습니다.



**레드햇 기반(centos) 설치 명령어**

```bash
cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-\$basearch
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
exclude=kubelet kubeadm kubectl
EOF

# permissive 모드로 SELinux 설정(효과적으로 비활성화)
sudo setenforce 0
sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes

sudo systemctl enable --now kubelet
```



# 2. master node

**마스터 노드 초기화**

* `kubeadm init`:  cluster control plane 구성 요소를 다운로드하고 설치합니다.

```bash
kubeadm init
...
error execution phase preflight: [preflight] Some fatal errors occurred:
        [ERROR Swap]: running with swap on is not supported. Please disable swap
...
```



**스왑 에러 발생 시 스왑 기능 제거**

```bash
# 현재 커널에서 스왑 기능 끄기
sudo swapoff -a
# 리부트 후에도 스왑 기능 유지
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
```



**다시 마스터 노드 초기화**

```bash
kubeadm init
...
Your Kubernetes control-plane has initialized successfully!
To start using your cluster, you need to run the following as a regular user:
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
...
Then you can join any number of worker nodes by running the following on each as root:
kubeadm join 10.7.27.17:6443 --token i8ri16.jqb9f9hzwts6gsdz \
        --discovery-token-ca-cert-hash sha256:525c1be1db709690fdc04ce82015c0f8ceb2c50d78fccb9a0cc97037b74b91cd

```



# 3.  client

`kubectl`이 루트 사용자가 아닌 사용자에게 작동하도록 하려면 다음 명령을 실행합니다. 

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

루트 사용자라면 

```bash
export KUBECONFIG=/etc/kubernetes/admin.conf
```

**클러스터 조회**

```bash
kubectl get node
NAME         STATUS     ROLES                  AGE     VERSION
gcloud-238   NotReady   control-plane,master   2m42s   v1.21.3
```



# 4. worker node

**워커 노드를 클러스터에 조인하기**

```bash
kubeadm join 10.7.27.17:6443 --token i8ri16.jqb9f9hzwts6gsdz \
        --discovery-token-ca-cert-hash sha256:525c1be1db709690fdc04ce82015c0f8ceb2c50d78fccb9a0cc97037b74b91cd
```

**client에서 클러스터 조회**

```bash
kubectl get node
NAME         STATUS     ROLES                  AGE   VERSION
gcloud-238   NotReady   control-plane,master   12m   v1.21.3
gcloud-239   NotReady   <none>                 65s   v1.21.3
gcloud-240   NotReady   <none>                 12s   v1.21.3
```



# 5. network 설정

```bash
kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
```

**client에서 클러스터 조회**

```bash
kubectl get node
NAME         STATUS   ROLES                  AGE   VERSION
gcloud-238   Ready    control-plane,master   23m   v1.21.3
gcloud-239   Ready    <none>                 11m   v1.21.3
gcloud-240   Ready    <none>                 10m   v1.21.3
```



참고

* https://kubernetes.io/ko/docs/setup/production-environment/tools/kubeadm/install-kubeadm/