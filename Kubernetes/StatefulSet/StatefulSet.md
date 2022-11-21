# 1 StatefulSet

- StatefulSet은 stateful 애플리케이션을 관리하는 오브젝트이다.
- 애플리케이션의 인스턴스가 각각 안정적인 이름과 상태를 가지며 개별적으로 취급돼야 하는 애플리케이션에 알맞게 만들어졌다.



## 1.1 용도

아래와 같은 특성이 필요한 애플리케이션에 StatefulSet을 사용하기 적합하다.

- Stable, unique network identifiers.
- Stable, persistent storage.
- Ordered, graceful deployment and scaling.
- Ordered, automated rolling updates.



## 1.2 Deployment와 차이점 

- StatefulSet은 Deployment 처럼 파드들을 관리하지만 차이점은 파드마다 고유한 identity를 가지고 있다는 점이다.
- Deployment은 stateless한 애플리케이션에 적합하다 애플리케이션의 상태가 없기 때문에 파드가 죽으면 스펙이 똑같은 파드를 만들어서 완벽히 대체할 수 있다.
- 그러나 stateful한 애플리케이션의 경우 상태를 가지고 있기 때문에 파드가 죽으면 해당 파드와 같은 상태의 파드가 필요하므로 StatefulSet을 이용해야한다.
- 디플로이먼트가 파드를 교체하면 새 파드가 갖는 스토리지 볼륨의 데이터는 이전 파드의 것일지라도 완전히 새로운 호스트 이름과 IP를 가지게 된다.
  - 이 처럼 새로운 아이덴티티로 인해 문제가 발생할 수 있다.

- StatefulSet을 이용하면 교체되는 파드와 동일한 이름, 네트워크 아이덴티티, 상태의 파드가 되살아난다.



참고

- https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/
- https://kubernetes.io/docs/tutorials/stateful-application/basic-stateful-set/