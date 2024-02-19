# 1 StatefulSet

- StatefulSet은 stateful 애플리케이션을 관리하는 오브젝트이다.
- 애플리케이션의 인스턴스가 각각 안정적인 이름과 상태를 가지며 개별적으로 취급돼야 하는 애플리케이션에 알맞게 만들어졌다.



## 1.1 용도

아래와 같은 특성이 필요한 애플리케이션에 StatefulSet을 사용하기 적합하다.
  
- Stable, unique network identifiers.
- Stable, persistent storage.
- Ordered, graceful deployment and scaling.
- Ordered, automated rolling updates.



## 1.2 StatefulSet을 사용하는 이유

- 레플리카셋은 하나의 파드 템플릿에서 여러 개의 파드 레플리카를 생성한다.
- 레플리카는 이름과 IP주소를 제외하면 서로 동일하다
- 파드 템플릿이 특정 PVC를 참조하는 볼륨을 포함하면 레플리카셋의 모든 레플리카는 동일한 PVC를 사용하고 PVC에 바인딩 된 동일한 PV를 사용하게 된다.
- 따라서 각 인스턴스가 별도의 스토리지를 필요로 하는 분산 데이터 저장소를 실행하려면 레플리카셋을 사용할 수 없다.



## 1.3 Deployment와 차이점 

- StatefulSet은 Deployment 처럼 파드들을 관리하지만 차이점은 파드마다 고유한 identity를 가지고 있다는 점이다.
- Deployment은 stateless한 애플리케이션에 적합하다 애플리케이션의 상태가 없기 때문에 파드가 죽으면 스펙이 똑같은 파드를 만들어서 완벽히 대체할 수 있다.
- 그러나 stateful한 애플리케이션의 경우 상태를 가지고 있기 때문에 파드가 죽으면 해당 파드와 같은 상태의 파드가 필요하므로 StatefulSet을 이용해야한다.
- 디플로이먼트가 파드를 교체하면 새 파드가 갖는 스토리지 볼륨의 데이터는 이전 파드의 것일지라도 완전히 새로운 호스트 이름과 IP를 가지게 된다.
  - 이 처럼 새로운 아이덴티티로 인해 문제가 발생할 수 있다.

- StatefulSet을 이용하면 교체되는 파드와 동일한 이름, 네트워크 아이덴티티, 상태의 파드가 되살아난다.



# 2 특징

- StatefulSet이 만드는 파드는 접미사로 숫자 인덱스가 부여된다.
  - 예) sample-statefulset-0, sample-statefulset-1, sample-statefulset-2
- 파드명이 바뀌지 않는다.
- 데이터를 영구적으로 저장하기 위한 구조로 되어있다.



# 3 헤드리스 서비스로 파드명 이름 해석

- 스테이트풀셋이 헤드리스 서비스를 사용하고 서비스의 metadata.named이 스테이트풀셋의 spec.serviceName과 같은 경우 아래와 같이 파드 단위의 이름을 해석할 수 있다.
  - `파드명.서비스명.네임스페이스명.svc.cluster.local`



참고

- https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/
- https://kubernetes.io/docs/tutorials/stateful-application/basic-stateful-set/