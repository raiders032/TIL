# 1 Systems-Manager-Session-Manager

- AWS Systems Manager Session Manager는 AWS Systems Manager의 완전 관리형 기능으로, Amazon EC2 인스턴스, 엣지 디바이스, 온프레미스 서버 및 가상 머신(VM)을 안전하게 관리할 수 있는 방법을 제공합니다
- Session Manager를 사용하면 인바운드 포트를 열거나, bastion 호스트를 유지 관리하거나, SSH 키를 관리할 필요 없이 안전하게 노드 관리를 할 수 있습니다.
- Session Manager는 관리되는 노드에 대한 접근을 제어하고, 엄격한 보안 관행을 준수하며, 노드 접근 세부 정보를 포함한 완전한 감사 로그를 제공하면서 엔드 유저에게 간편한 원클릭 크로스 플랫폼 액세스를 제공합니다.

<br>

# 2 Session Manager의 장점

## 2.1 중앙 집중식 접근 제어

- Session Manager를 사용하면 IAM 정책을 통해 관리되는 노드에 대한 접근을 제어할 수 있습니다.
- 관리자들은 단일 위치에서 접근 권한을 부여하고 철회할 수 있습니다. 
- IAM 정책만을 사용하여 조직의 개별 사용자나 그룹이 Session Manager를 사용할 수 있는지, 그리고 어떤 노드에 접근할 수 있는지를 제어할 수 있습니다.

## 2.2 인바운드 포트 없음 및 bastion 호스트 관리 불필요

- 관리되는 노드에 인바운드 SSH 포트나 원격 PowerShell 포트를 열어두면, 비인가된 명령어가 실행될 위험이 크게 증가합니다.
- Session Manager는 이러한 인바운드 포트를 닫고 SSH 키와 인증서, bastion 호스트 및 점프 박스를 관리할 필요 없이 보안을 개선할 수 있도록 도와줍니다.

<br>

## 2.3 원클릭 접근

- AWS Systems Manager 콘솔이나 Amazon EC2 콘솔을 사용하여 클릭 한번에 세션을 시작할 수 있습니다.
- AWS CLI를 사용하여 단일 명령어 또는 일련의 명령어를 실행하는 세션을 시작할 수도 있습니다.
- 접근 권한은 SSH 키나 기타 메커니즘 대신 IAM 정책을 통해 제공되므로, 연결 시간이 크게 단축됩니다.

<br>

## 2.4 하이브리드 및 멀티클라우드 환경 지원

- Session Manager를 사용하면 Amazon EC2 인스턴스뿐만 아니라 하이브리드 및 멀티클라우드 환경의 비 EC2 노드에도 연결할 수 있습니다. 
- 비 EC2 노드에 연결하려면 고급 인스턴스 티어를 활성화해야 하며, 이에 대한 비용이 발생합니다.
- 그러나 EC2 인스턴스에 연결하는 데 추가 비용이 발생하지 않습니다.

<br>

## 2.5 포트 포워딩

- 관리되는 노드 내부의 포트를 클라이언트의 로컬 포트로 리디렉션할 수 있습니다. 그런 다음 로컬 포트에 연결하여 노드 내부에서 실행 중인 서버 애플리케이션에 접근할 수 있습니다.

<br>

## 2.6 크로스 플랫폼 지원

- Session Manager는 Windows, Linux 및 macOS를 모두 지원합니다.
- 예를 들어, Linux 및 macOS 관리 노드에 대해 SSH 클라이언트를 사용하거나 Windows Server 관리 노드에 대해 RDP 연결을 사용할 필요가 없습니다.

<br>

## 2.7 세션 활동 로깅 및 감사

- 운영 또는 보안 요구 사항을 충족하기 위해 관리되는 노드에 대한 접속 및 실행된 명령어 기록을 제공해야 할 수도 있습니다.
- Session Manager는 다음 AWS 서비스와 통합하여 로깅 및 감사 기능을 제공합니다
	- **AWS CloudTrail**: Session Manager API 호출에 대한 정보를 캡처하고 이를 지정된 Amazon S3 버킷에 저장된 로그 파일에 기록합니다.
	- **Amazon Simple Storage Service (S3)**: 세션 로그 데이터를 Amazon S3 버킷에 저장할 수 있습니다. 로그 데이터는 AWS KMS 키를 사용하여 암호화할 수 있습니다.
	- **Amazon CloudWatch Logs**: 다양한 AWS 서비스의 로그 파일을 모니터링, 저장 및 액세스할 수 있습니다. 로그 데이터를 CloudWatch Logs 로그 그룹으로 전송하여 디버깅 및 문제 해결에 사용할 수 있습니다.
	- **Amazon EventBridge 및 Amazon Simple Notification Service (SNS)**: EventBridge를 사용하여 세션이 시작되거나 종료될 때 알림을 받을 수 있습니다. 또한, 특정 이벤트에 대한 규칙을 설정하여 자동화된 응답을 트리거할 수 있습니다.