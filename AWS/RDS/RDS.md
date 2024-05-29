# 1 Relational Database Service

- [레퍼런스](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html)
- AWS 클라우드에서 관계형 데이터베이스를 설정, 운영 및 확장하는 것을 더 쉽게 만드는 웹 서비스다.

<br>

## 1.1 EC2 인스턴스에 DB를 배포하는 것과 차이점

|Feature|Amazon EC2 management|Amazon RDS management|
|---|---|---|
|Application optimization|Customer|Customer|
|Scaling|Customer|AWS|
|High availability|Customer|AWS|
|Database backups|Customer|AWS|
|Database software patching|Customer|AWS|
|Database software install|Customer|AWS|
|OS patching|Customer|AWS|
|OS installation|Customer|AWS|
|Server maintenance|AWS|AWS|
|Hardware lifecycle|AWS|AWS|
|Power, network, and cooling|AWS|AWS|

- EC2 인스턴스에 DB를 배포하면 직접 관리해야 하는 부분이 많다.


<br>

# 2 인스턴스 중지

- DB 인스턴스를 중지하고 다시 시작하는 것이 DB 스냅샷을 생성하고 인스턴스를 삭제한 후 스냅샷에서 복원하는 것보다 빠릅니다. 
- 인스턴스를 중지하는 일반적인 사용 사례는 다음과 같습니다
- 비용 최적화
	- 비생산 데이터베이스의 경우, Amazon RDS DB 인스턴스를 일시적으로 중지하여 비용을 절감할 수 있습니다.
	- 인스턴스가 중지된 동안에는 DB 인스턴스 시간에 대한 요금이 부과되지 않습니다.
	- DB 인스턴스가 중지된 동안에는 프로비저닝된 스토리지(프로비저닝된 IOPS 포함)에 대한 요금이 부과됩니다.
	- 또한, 수동 스냅샷 및 지정된 보존 기간 내의 자동 백업을 포함한 백업 스토리지에 대한 요금도 부과됩니다.
	- 그러나 DB 인스턴스 시간에 대한 요금은 부과되지 않습니다.
- 일일 개발
	- 개발 목적으로 DB 인스턴스를 유지 관리하는 경우, 필요할 때 인스턴스를 시작하고 필요하지 않을 때 인스턴스를 종료할 수 있습니다.
- 테스트
	- 백업 및 복구 절차, 마이그레이션, 애플리케이션 업그레이드 또는 관련 활동을 테스트하기 위해 임시 DB 인스턴스가 필요할 수 있습니다.
	- 이러한 사용 사례에서는 필요하지 않을 때 DB 인스턴스를 중지할 수 있습니다.
- 교육
	- RDS에서 교육을 진행하는 경우, 교육 세션 동안 DB 인스턴스를 시작하고 이후에 종료할 수 있습니다.

<br>

# 3 Amazon RDS DB 인스턴스 스토리지

- Amazon RDS for Db2, MariaDB, MySQL, PostgreSQL, Oracle, Microsoft SQL Server의 DB 인스턴스는 데이터베이스 및 로그 스토리지에 Amazon Elastic Block Store(Amazon EBS) 볼륨을 사용합니다.

<br>

## 3.1 스토리지 유형

- Amazon RDS는 세 가지 스토리지 유형을 제공합니다.
- 이러한 3가지 유형은 성능 특성과 가격이 다르므로 데이터베이스 워크로드 요건에 따라 스토리지 성능과 비용을 조정할 수 있습니다.
- 범용 SSD (gp2, gp3): 비용 효율적인 스토리지로, 개발 및 테스트 환경에 적합합니다.
- 프로비저닝된 IOPS SSD (io1, io2 Block Express): 높은 I/O 성능을 제공하여, I/O 집약적 워크로드와 프로덕션 환경에 이상적입니다.
- 마그네틱: 역호환성을 위해 제공되지만, 새 스토리지로는 추천되지 않습니다.