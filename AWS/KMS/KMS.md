# 1 KMS

- AWS Key Management Service (AWS KMS)는 데이터 보호를 위해 암호화 키를 생성하고 제어할 수 있도록 지원하는 관리형 서비스입니다.
- AWS KMS는 FIPS 140-2 암호화 모듈 검증 프로그램 하에 하드웨어 보안 모듈(HSM)을 사용하여 AWS KMS 키를 보호하고 검증합니다.

<br>

# 2 키 생성 및 관리

- AWS KMS API를 사용하여 KMS 키와 특수 기능(예: 사용자 지정 키 스토어)을 생성하고 관리할 수 있습니다.
- 다음은 KMS 키 관리의 주요 기능입니다:
	- **대칭 및 비대칭 KMS 키 생성, 편집, 조회**: HMAC 키 포함
	- **키 정책, IAM 정책, 그리고 권한을 통한 접근 제어**: 속성 기반 접근 제어(ABAC) 지원
	- **별칭 생성, 삭제, 목록 조회 및 업데이트**: 별칭을 통해 KMS 키 접근 제어 가능
	- **KMS 키 태그 지정**: 식별, 자동화 및 비용 추적을 위해 태그 사용
	- **KMS 키 활성화 및 비활성화**
	- **자동 키 회전 활성화 및 비활성화**
	- **KMS 키 삭제**: 키 수명 주기 완료

<br>

# 3 암호화 작업

- AWS KMS 키를 사용하여 다양한 암호화 작업을 수행할 수 있습니다
	- 대칭 또는 비대칭 KMS 키를 사용한 데이터 암호화, 복호화 및 재암호화
	- 비대칭 KMS 키를 사용한 메시지 서명 및 검증
	- 내보낼 수 있는 대칭 데이터 키 및 비대칭 데이터 키 쌍 생성
	- HMAC 코드 생성 및 검증
	- 암호화 용도로 적합한 랜덤 숫자 생성

<br>

# 4 고급 기능

- AWS KMS는 다음과 같은 고급 기능을 제공합니다:
- 멀티-리전 키 생성: 여러 AWS 리전에서 동일한 KMS 키 복사본처럼 작동
- 암호화 재료 가져오기: KMS 키로 암호화 재료 가져오기
- AWS CloudHSM 키 스토어: AWS CloudHSM 클러스터로 백업되는 KMS 키 생성
- 외부 키 스토어: AWS 외부의 암호화 키로 백업되는 KMS 키 생성
- VPC 내 프라이빗 엔드포인트를 통해 직접 연결
- 하이브리드 양자 내성 TLS 사용: AWS KMS로 전송하는 데이터에 대한 미래 지향적 암호화 제공

<br>

# 5 통합

## 5.1 CloudTrail과의 통합

- AWS KMS는 AWS CloudTrail과 통합되어 지정된 Amazon S3 버킷으로 로그 파일을 전달합니다.
- 이를 통해 KMS 키가 언제, 어떻게 사용되었는지 모니터링하고 조사할 수 있습니다.