# 1 Systems-Manager-Parameter-Store

- Parameter Store AWS Systems Manager, 의 기능은 구성 데이터 관리 및 비밀 관리를 위한 안전한 계층적 스토리지를 제공합니다.
- 암호, 데이터베이스 문자열, Amazon Machine Image(AMI) ID, 라이선스 코드와 같은 데이터를 파라미터 값으로 저장할 수 있습니다.
- 값을 일반 텍스트 또는 암호화된 데이터로 저장할 수 있습니다.
- 파라미터를 생성할 때 지정한 고유 이름을 사용하여 스크립트, 명령, SSM 문서, 구성 및 자동화 워크플로에서 Systems Manager 파라미터를 참조할 수 있습니다.

<br>

# 2 AWS Secrets Manager와 비교

## 2.1 AWS Systems Manager Parameter Store

**가격** 
- Parameter Store는 기본적인 사용에 대해 무료이며, 고급 파라미터에 대해서만 비용이 발생합니다.

**기능**
- Parameter Store는 간단한 데이터 문자열, 암호화된 문자열 또는 암호화되지 않은 긴 문자열 등 다양한 유형의 데이터를 저장할 수 있습니다. 
- 이를 통해 환경 변수, 구성 데이터, 비밀번호 등을 저장할 수 있습니다.

**보안**
- AWS KMS(Key Management Service)를 사용하여 파라미터를 암호화할 수 있으며, IAM(Identity and Access Management)을 통해 액세스 제어를 관리합니다.

**자동 회전**
- 자체적으로 자동 회전 기능을 제공하지 않지만, Lambda 함수와 결합하여 회전 로직을 구현할 수 있습니다.

**통합**
- AWS CloudFormation, Elastic Container Service(ECS), Lambda 등 다른 AWS 서비스와의 통합을 지원합니다.
    

## 2.2 AWS Secrets Manager

**가격**
- Secrets Manager는 사용한 만큼 비용을 지불하는 서비스입니다. 
- 시크릿 관리 및 자동 교체 기능에 대해 비용이 발생합니다.

**기능**
- Secrets Manager는 데이터베이스 자격 증명, API 키 및 토큰 같은 민감한 정보를 안전하게 저장하고 관리하는 데 특화되어 있습니다.

**보안**
- 자동 회전, 암호화, 액세스 제어 및 감사 로그와 같은 고급 보안 기능을 제공합니다. 
- AWS KMS를 사용하여 시크릿을 암호화하며, IAM 정책을 통해 세밀한 액세스 제어가 가능합니다.

**자동 회전**
- 데이터베이스 자격 증명과 같은 시크릿을 자동으로 교체할 수 있는 내장 기능이 있으며, 이는 데이터베이스와 직접 통합될 수 있습니다.

**통합**
- AWS RDS, Redshift, DocumentDB 등과 같은 AWS 서비스와의 긴밀한 통합을 제공합니다.
- 또한, 애플리케이션에 시크릿을 주입하는 방식을 단순화합니다.