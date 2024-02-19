# 1 Traffic Mirroring

- Traffic Mirroring은 Amazon VPC의 기능으로 네트워크 트래픽을 복사하는 데 사용할 수 있다.
- 즉 Source(ENI)의 트래픽을 Target(ENI 또는 network load balancer)으로도 보내준다.
- Target은 보통 아래의 기능을 한다.
	- Content inspection
	- Threat monitoring
	- Troubleshooting
- 필터링 기능을 하여 트패릭을 선택하여 복사할 수 있다.