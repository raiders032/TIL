# 1 Network Firewall

- AWS에서 제공하는 AWS Network Firewall은 완전 관리형 방화벽 서비스입니다.
- Network Firewall은 사용자의 Virtual Private Cloud(VPC) 내부 트래픽을 모니터링하고 필터링합니다.
- 이 서비스를 통해 사용자는 실시간으로 웹 애플리케이션과 네트워크 리소스를 보호하면서, 원치 않는 트래픽을 차단할 수 있는 세밀한 네트워크 트래픽 제어 규칙을 정의할 수 있습니다.
- 이는 인터넷 연결에 대한 보안을 강화하고, 특정 유형의 공격으로부터 사용자의 네트워크를 보호하는 데 중요한 역할을 합니다.

<br>

# 2 Network Firewall과 Firewall Manager의 연동

- AWS Network Firewall과 AWS Firewall Manager의 통합은 강력한 네트워크 보안 구성을 가능하게 합니다.
	- [[Firewall-Manager]] 참고
- 사용자는 Network Firewall을 통해 세부적인 보안 규칙을 설정하고, 이 규칙들을 Firewall Manager를 사용하여 여러 VPC 및 계정에 걸쳐 일관되게 적용할 수 있습니다.
- 이러한 방식으로, 사용자는 AWS 환경 전체에 걸쳐 일관된 보안 정책을 유지하면서도, 필요에 따라 특정 VPC 또는 계정에 대한 세부적인 규칙 조정이 가능합니다.