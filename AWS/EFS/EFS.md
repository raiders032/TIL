# 1 EFS

- 완전 관리형 NFS(Network File System)서비스다.
- Amazon EC2, Amazon ECS 및AWS Lambda 같은 여러 컴퓨팅 인스턴스가 Amazon EFS 파일 시스템에 동시에 액세스할 수 있다.
	- 따라서 하나의 EFS 파일 시스템은 두 개 이상의 컴퓨팅 인스턴스 또는 서버에서 실행하는 워크로드 및 애플리케이션에 대한 공통 데이터 소스로 사용될 수 있다.
- Linux 베이스의 AMI와 호환된다.
	- Window와 호환되지 않는다.
