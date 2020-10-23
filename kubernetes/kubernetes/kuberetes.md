keyword

* cluster
  * Master
  * node
* pod
* Service
* controller
  * pod를 관리
  * 여러종류가있다
    * replication
    * deployment
    * daemoneset
    * cronjob
* 



## 가상화

기존 가상화의 문제점

Vm 가상화를 하기 위해 무거운 OS를 띄워야 한다.



## docker

* 컨테이너 가상화 기술은 서비스간 자원을 격리하는데 OS를 별도로 띄우지 않아도 된다.
  * linux의 자원 격리 기술(namespace, group)을 사용해 서비스를 격리한다.
  * namespace: 커널을 격리
  * cgroup: 자원을 격리
* 자원 효율이 좋다.
* 하나의 서비스를 컨테이너로 가상화하는 용도로 사용되며 많은 서비스들을 운영할 때 일일히 배포하고 운영하는 역할은 하지 않는다.
  * 이러한 기능을 제공하는게 **컨테이너 오케스트레이터**라는 개념이다. 



## 컨테이너 오케스트레이터

* kubernetes
* docker swarm
* AWS ECS



## pod

* 배포의 단위가 된다.
* 여러 컨테이너를 하나로 묶는다.