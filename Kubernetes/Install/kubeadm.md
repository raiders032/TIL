# 1 kubeadm

* 쿠버네티스는 일반적인 서버 클러스터 환경에서도 쿠버네티스를 쉽게 설치할 수 있는 kubeadm이라는 관리 도구를 제공한다
* kubeadm은 쿠버네티스 커뮤니티에서 권장하는 설치 방법 중 하나이다
* 온프레미스 환경, 클라우드 인프라 환경에 상관없이 일반적인 리눅스 서버라면 모두 사용할 수 있다
* Minikube, kubespary와 같은 설치 도구도 내부적으로 kubeadm을 사용하고 있다.



# 2  공통 설치

* 클러스터를 구성하는 모든 노드에 kubeadm, kubelet, kubectl, docker runtime을 설치한다.



## 2.1 Installing a container runtime

- container runtime interface의 여러 구현체 중 하나를 선택해 사용할 수 있다.
- container runtime을 지정하지 않으면 kubeadm이 자동으로 설치된 container runtime 감지한다.
- 여러 container runtime 또는 container runtime이 감지되지 않으면 kubeadm은 예러를 던진다.
- Docker Engine을 Docker Runtime으로 설치한다.
- https://docs.docker.com/engine/install/ubuntu/



### 2.1.1 Install On Ubuntu

**Set up the repository**

```bash
sudo apt-get update

sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
```



**Add Docker’s official GPG key**

```bash
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```



**Use the following command to set up the repository**

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```



**Install Docker Engine**

```bash
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

```bash
sudo service docker start
```



## 2.2 Swap disabled

- Kubernetes 1.8 이후 kubelet이 정상적으로 작동하기 노드에서 스왑을 비활성화해야 함
- kubernetes의 아이디어는 인스턴스를 최대한 100%에 가깝게 성능을 발휘하는 것
- 모든 배포는 CPU/메모리 제한을 고정하는 것이 필요
- 따라서 스케줄러가 파드를 머신에 보내면 스왑을 사용하지 않는 것이 필요
- 스왑 발생시 속도가 느려지는 이슈 발생

```bash
# 현재 커널에서 스왑 기능 끄기
sudo swapoff -a
# 리부트 후에도 스왑 기능 유지
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
```



## 2.3 kubelet kubeadm kubectl 설치

- Debian 기준

```bash
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl
```

```bash
sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
```

```bash
echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
```

```bash
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
```



### 2.3.1 kubeadm

- 클러스터를 부트스트랩하는 명령



### 2.3.2 kubelet

- 클러스터 내에 모든 노드에서 실행되는 에이전트이다.
- Master Node와 커뮤니케이션을 위해 필요함
- kubelet의 역할
  * 쿠버네티스 클러스터에 노드를 등록한다
  * pod를 생성하기 위해 컨테이너 런타임에 요청을 전달한다.
  * 노드와 pod  모니터링하고 그 결과를 kube-apiserver에 주기적으로 전송한다.



### 2.3.3 kubectl

- Command Line Util이다
- kubectl을 통해 클러스터와 커뮤니케이션한다.



# 3 master node

- control-plane node는 control plane components가 실행되는 노드를 말한다.
- control plane components에는 etcd, API Server(kubectl이 소통하는) 등이 있다.



## 3.1 master node 초기화

```bash
$ kubeadm init --apiserver-advertise-address=192.168.155.69 --apiserver-cert-extra-sans=192.168.155.69 --pod-network-cidr=192.168.0.0/16
```



```bash
$ kubeadm init --apiserver-advertise-address=192.168.155.69 \
--pod-network-cidr=192.168.0.0/16
```

`--apiserver-advertise-address` 옵션

- 다른 노드가 마스터에 접근할 수 있는 IP 주소를 입력한다.



`--pod-network-cidr` 옵션

- 쿠버테니스에서 사용할 컨테이너의 네트워크 대역이며 각 서버의 네트워크 대역과 중복되지 않게 선택한다.



초기화가 완료되면 아래와 같은 출력 결과가 나온다. 하니씩 살펴보자.

```bash

Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 192.168.155.69:6443 --token vcp2e0.v4ljeneis6crciyz \
	--discovery-token-ca-cert-hash sha256:8054c511d04396aa2cee5e8235f69951472a51b08da71057a7cd957acf37f45d
```



## 3.2 사용자 세팅

- `kubectl`이 루트 사용자가 아닌 사용자에게 작동하도록 하려면 다음 명령을 실행합니다. 

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

```
echo 'export KUBECONFIG=$HOME/.kube/config' >> $HOME/.bashrc
```

- https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#tls-certificate-errors



## 3.3 Pod 네트워크 추가

- CNI(Container Network Interface)의 원하는 구현체를 선택해 추가한다.
- 아래의 예시는  weavenet 플러그인을 추가한다.

**weavenet**

```bash
kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
```



**칼리코**

```bash
kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.24.1/manifests/tigera-operator.yaml
curl https://raw.githubusercontent.com/projectcalico/calico/v3.24.1/manifests/custom-resources.yaml -O
kubectl create -f custom-resources.yaml
```







# 4 worker node



## 4.1 워커 노드를 클러스터에 조인하기

- control-plane node에서 kubeadm init의 결과 맨 마지막 출력된 명령어를 실행한다.

```bash
kubeadm join --token <token> <control-plane-host>:<control-plane-port> --discovery-token-ca-cert-hash sha256:<hash>
```

```bash
kubeadm join --token 6g3mk8.txv3jmoz58ctwwzo 192.168.155.69:6443 \
        --discovery-token-ca-cert-hash sha256:124884ada96bcd6dc74dac7bc1588aeeb878c14fd4f688cba1d97aff24a8281d
```

​	

**Token 조회하기**

- Token을 모르겠다면 control-plane node에서 아래 커맨드를 통해 조회할 수 있다.

```bash
$ kubeadm token list
```



**Token 생성하기**

- 기본 Token의 만료기간은 24시간이기 때문에 만료되었다면 새로운 토큰을 생성해야 한다.
- 아래 커맨드로 Token을 생성한다.

```Bash
$ kubeadm token create
```



**--discovery-token-ca-cert-hash 밸류 얻기**

- control-plane node에서 아래 커맨드를 통해 조회할 수 있다.

```Bash
$ openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | \
   openssl dgst -sha256 -hex | sed 's/^.* //'
```



참고

* https://kubernetes.io/ko/docs/setup/production-environment/tools/kubeadm/install-kubeadm/
* https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/