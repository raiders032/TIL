# 1 SecretsManager

- [레퍼런스](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html)
- Secrets Manager는 데이터베이스 자격 증명, 응용 프로그램 자격 증명, OAuth 토큰, API 키 및 기타 비밀 정보를 그들의 생명 주기 동안 관리, 검색 및 회전하는 데 도움을 준다.
- 많은 AWS 서비스들이 Secrets Manager에서 secrets을 저장하고 사용한다.
- Secrets Manager를 사용하면 응용 프로그램 소스 코드에 하드 코딩된 자격 증명이 더 이상 필요하지 않기 때문에 보안에 도움을 준다. 
	- 하드 코딩된 자격 증명 대신 Secrets Manager를 런타임에 호출하야 필요할 때 동적으로 자격 증명을 조회해서 사용한다.
- Secrets Manager를 사용하면 Secrets에 대한 자동 변경하도록 일정을 설정할 수 있다.
	- 이를 통해 장기 자격 증명을 단기 자격 증명으로 교체하여 위험을 크게 줄일 수 있다.