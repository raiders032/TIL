# 1 Shield

- AWS Shield는 Amazon Web Services(AWS)에서 제공하는 DDoS(Distributed Denial of Service) 공격 방어 서비스입니다.
- AWS Shield는 두 가지 버전, 즉 기본 보호 기능을 제공하는 AWS Shield Standard와 향상된 보호 기능을 제공하는 AWS Shield Advanced로 나뉩니다. 

<br>

# 2 AWS Shield Standard

- AWS Shield Standard는 모든 AWS 고객에게 기본적으로 제공되는 DDoS 보호 서비스입니다. 
- 추가 비용 없이 제공되며, 대부분의 일반적인 네트워크 및 전송 계층 DDoS 공격을 자동으로 감지하고 완화합니다.

<br>

**주요기능**

- 자동 보호: AWS Shield Standard는 모든 AWS 서비스에 기본적으로 적용되어 네트워크 및 전송 계층에서 발생하는 DDoS 공격을 자동으로 방어합니다.
- 24/7 모니터링: AWS 인프라는 연중무휴 모니터링되며, DDoS 공격 발생 시 자동으로 탐지 및 완화됩니다.
- 글로벌 네트워크: AWS의 글로벌 네트워크 인프라를 활용하여 대규모 DDoS 공격을 효율적으로 완화합니다.
- 추가 비용 없음: AWS Shield Standard는 추가 비용 없이 제공되며, AWS WAF 및 기타 AWS 서비스 요금에 포함되어 있습니다.

<br>

# 3 AWS Shield Advanced

- AWS Shield Advanced는 보다 강화된 DDoS 보호 기능을 제공하며, 중요한 애플리케이션을 보호하기 위한 추가적인 보안 기능과 전문적인 지원을 제공합니다. 
- AWS Shield Advanced는 추가 비용이 발생하지만, 대규모 DDoS 공격에 대한 보다 종합적인 보호를 원하는 고객에게 적합합니다.
- AWS Shield Advanced는 Amazon EC2 인스턴스, Elastic Load Balancing 로드 밸런서, Amazon CloudFront, 그리고 Amazon Route 53 호스팅 영역에 대한 확장된 DDoS 공격 보호 기능을 제공합니다.

<br>

**주요 기능**

- 확장된 DDoS 보호: AWS Shield Advanced는 네트워크 및 전송 계층뿐만 아니라 애플리케이션 계층의 DDoS 공격도 방어합니다.
- 실시간 공격 대시보드: AWS 관리 콘솔에서 실시간으로 DDoS 공격 현황을 모니터링할 수 있는 대시보드를 제공합니다.
- DDoS 대응 팀(DRT) 지원: DDoS 공격 발생 시 AWS의 DDoS 대응 팀(DRT)으로부터 24/7 지원을 받을 수 있습니다.
- 비용 보호: DDoS 공격으로 인해 발생한 AWS 서비스 사용량 증가 비용을 보호합니다.
- 애플리케이션 레이어 보호: AWS WAF(Web Application Firewall)와 통합하여 애플리케이션 계층의 공격도 방어합니다.
- 확장된 로그 및 보고: 공격 로그와 보고서를 통해 상세한 분석과 대응을 지원합니다.