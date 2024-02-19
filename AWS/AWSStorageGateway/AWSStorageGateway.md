# 1 AWS Storage Gateway

- hybrid cloud storage solution이다.
	- hybrid cloud란 인프라스트럭처의 한 부분은 on premises로 구성되어 있고 다른 한 부분은 cloud에 구성됨을 의미한다.
- Storage Gateway는 온프레미스와 클라우드 사이의 다리 역할을 한다.

<br>

## 1.1 기능

- 백업
	- 온프레미스 데이터의 백업 및 아카이브를 쉽게 수행할 수 있다.
	- 이를 통해 데이터 복구 시간을 줄이고 대규모 데이터를 안전하게 보관할 수 있다.
- 재해 복구
	- Storage Gateway는 재해 복구 전략의 일환으로 사용될 수 있다.
	- 온프레미스 데이터를 AWS 클라우드에 복제함으로써 재해 시 클라우드에서 데이터를 복구하여 서비스 연속성을 유지할 수 있다.
- 데이터 마이그레이션
	- 온프레미스 데이터를 점진적으로 AWS 클라우드로 이동시키면서 비즈니스 연속성을 보장한다.

<br>

## 1.2 종류

- Amazon S3 File Gateway
- Amazon FSx File Gateway
- Tape Gateway
- Volume Gateway

<br>

# 2 Amazon S3 File Gateway

- Amazon S3 File Gateway는 Amazon S3의 파일 인터페이스를 지원한다.
- 네트워크 파일 시스템(Network File System, NFS) 및 서버 메시지 블록(Server Message Block, SMB)과 같은 업계 표준 파일 프로토콜을 사용하여 Amazon S3에서 객체를 저장하고 검색할 수 있다.