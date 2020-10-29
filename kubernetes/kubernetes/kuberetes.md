keyword

* 워크로드
* Paas
* Iaas
* SaaS
* cluster
  * Master node
    * api server
      * 사용자는 cli를 통해 api server와 명령어를 통해 커뮤니케이션한다.
      * 모든 요청을 받는 곳
    * controller
      * 생성 요청 검사
      * 팟 생성 요청
    * scheduler
      * 팟 생성 요청 검사
      * 노드에 팟 할당
    * etcd
      * db
      * 오브젝트 저장소
  * worker node
    * kublet
      * Master 명령 수행을 위한 에이전트
      * master node의 요청을 모니터링
      * 팟 할당 검사
      * 컨테이너생성
      * 팟 상태 업데이트
    * docker
    * Kube-proxy
    * Advisor
* pod
* Service
* controller
  * pod를 관리
  * 여러종류가있다
    * replication
    * deployment
    * daemoneset
    * cronjob
* Service discovery
* Storege orchestration



## 가상화

기존 가상화의 문제점

Vm 가상화를 하기 위해 무거운 OS를 띄워야 한다.

sudo cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF

## docker

* 컨테이너 가상화 기술은 서비스간 자원을 격리하는데 OS를 별도로 띄우지 않아도 된다.
  * 컨테이너는 VM과 유사하지만 격리 속성을 완화하여 애플리케이션 간에 운영체제(OS)를 공유한다. 
  * linux의 자원 격리 기술(namespace, group)을 사용해 서비스를 격리한다.
  * namespace: 커널을 격리
  * cgroup: 자원을 격리
* 자원 효율이 좋다.
* 하나의 서비스를 컨테이너로 가상화하는 용도로 사용되며 많은 서비스들을 운영할 때 일일히 배포하고 운영하는 역할은 하지 않는다.
  * 이러한 기능을 제공하는게 **컨테이너 오케스트레이터**라는 개념이다. 



## 컨테이너 오케스트레이터

* 여러 호스트에서 애플리케이션을 로드밸런스 할 수 있나?
* 호스트에서 애플리케이션의 하드웨어 리소르르 제한할 수 있나.
* kubernetes
* docker swarm
* AWS ECS



## pod

* 배포의 단위가 된다.
* 여러 컨테이너를 하나로 묶는다.



```
kubeadm join 172.31.9.4:6443 --token v0sa4m.namcpo81vuzouf5c \
    --discovery-token-ca-cert-hash sha256:2dbc5b2cc9ce7cb6fbe3e396676fd573f4079a3608486be2afb4e6364cd2606e
```

