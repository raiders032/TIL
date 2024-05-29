# 1 Firewall-Manager

- AWS Firewall Manager는 AWS Network Firewall과 같은 보안 서비스를 중앙에서 관리할 수 있는 서비스입니다.
- 이를 사용하면, 다수의 VPC 및 AWS 계정에 걸쳐 일관된 보안 정책을 쉽게 적용하고 관리할 수 있습니다.
- 이는 특히 대규모 환경에서 보안 정책의 일관성을 유지하고, 복잡한 구성 관리를 단순화하는 데 매우 유용합니다.

<br>

# 2 Network Firewall과 Firewall Manager의 연동

- AWS Network Firewall과 AWS Firewall Manager의 통합은 강력한 네트워크 보안 구성을 가능하게 합니다.
	- [[Network-Firewall]] 참고
- 사용자는 Network Firewall을 통해 세부적인 보안 규칙을 설정하고, 이 규칙들을 Firewall Manager를 사용하여 여러 VPC 및 계정에 걸쳐 일관되게 적용할 수 있습니다.
- 이러한 방식으로, 사용자는 AWS 환경 전체에 걸쳐 일관된 보안 정책을 유지하면서도, 필요에 따라 특정 VPC 또는 계정에 대한 세부적인 규칙 조정이 가능합니다.

