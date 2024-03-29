# 1 SecretsManager

- [레퍼런스](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html)
- 클라우드 컴퓨팅 영역에서는 데이터베이스 자격 증명, 애플리케이션 키, OAuth 토큰, API 키와 같은 민감한 정보를 보호하는 것이 중요합니다.
- AWS Secrets Manager는 수명 주기 전반에 걸쳐 이러한 민감 정보의 관리, 검색 및 교체를 간소화하도록 설계된 강력한 도구입니다.

<br>

## 1.1 AWS Secrets Manager의 주요 기능

- **시크릿 수명주기 관리**: Secrets Manager는 생성부터 폐기까지 시크릿을 관리하는 도구를 제공하여 시크릿을 항상 최신 상태로 안전하게 유지합니다.
- **자동 시크릿 교체**: Secrets Manager의 뛰어난 기능 중 하나는 정의된 일정에 따라 시크릿 교체를 자동화하는 기능입니다. 이렇게 하면 장기 자격 증명을 단기 자격 증명으로 교체하여 관련 위험을 줄일 수 있습니다.
- **런타임 시 보안 검색**: Secrets Manager를 사용하면 애플리케이션 소스 코드에 하드 코딩된 자격 증명이 필요하지 않습니다. 대신 애플리케이션이 런타임 시 Secrets Manager를 호출하여 자격 증명을 동적으로 검색할 수 있습니다. 이러한 관행은 잠재적인 위반에 대한 노출을 최소화하여 보안을 크게 강화합니다.
- **AWS 서비스와의 통합**: 많은 AWS 서비스는 Secrets Manager와 원활하게 통합되어 AWS 환경 전체에서 암호를 저장하고 액세스하는 프로세스를 단순화하도록 설계되었습니다.

<br>

# 2 프로세스

1. 요청하기: 애플리케이션은 AWS SDK를 활용하여 Secrets Manager로 요청을 보내고, 특정 이름이나 ARN에 연결된 비밀값을 요구합니다. 
2. 인증 및 권한 부여: AWS는 요청을 보낸 IAM 역할이나 사용자에게 부여된 IAM 정책을 검토하여 해당 비밀에 접근할 권한이 있는지 확인합니다. 
3. 시크릿 검색: 인증과 권한 부여가 성공적으로 이루어지면, Secrets Manager는 저장된 시크릿을 암호화된 상태로 가져와 AWS KMS를 이용하여 해독한 뒤, 애플리케이션에 평문 값으로 반환합니다.
4. 시크릿 사용: 이후 애플리케이션은 데이터베이스 비밀번호 등의 시크릿 값을 사용하여 애플리케이션 소스 코드에 자격 증명을 직접 코딩하지 않고도 데이터베이스나 서비스와의 연결을 구성합니다.