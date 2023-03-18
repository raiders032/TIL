# 1 CRI

- Container Runtime Interface
- kubelet과 컨테이너 런타임 사이를 연결하는 인터페이스다
  - CRI는 클러스터 kubelet과 컨테이너 런타임 사이의 통신을 위한 주요 gRPC 프로토콜을 정의한다.
- CRI를 준수하는 컨테이너 런타임이라면 쿠버네티스에서 사용 가능하다.
  - CRI를 만족하는 Docker, containderd, CRI-O 등의 컨테이너 런타임이 있다.



참고

- https://kubernetes.io/docs/concepts/architecture/cri/