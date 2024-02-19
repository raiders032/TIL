# 1 Aurora

- [레퍼런스](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html)
- Aurora는 MySQL 및 PostgreSQL과 호환되는 완전 관리형 관계형 데이터베이스 엔진이다.
- Aurora는 대부분의 기존 애플리케이션 변경이 필요 없이 MySQL의 처리량의 최대 5배, PostgreSQL의 처리량의 최대 3배를 제공할 수 있다.
- Aurora의 스토리지는 자동으로 늘어난다.
	- 최대 128 tebibytes (TiB)까지
- Aurora는 또한 데이터베이스 관리에서 가장 도전적인 측면 중 하나인 데이터베이스 클러스터링과 복제를 자동화하고 표준화했다.

<br>

# 2 Replication

- [레퍼런스](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Replication.html)
- 프로비전된 Aurora DB 클러스터에 두 번째, 세 번째 DB 인스턴스를 생성하면 Aurora는 writer DB 인스턴스로부터 다른 모든 DB 인스턴스로의 복제를 자동으로 설정한다.
- writer DB를 제외한 다른 DB 인스턴스들은 읽기 전용이며 Aurora Replicas라고 한다.
	- 또는 reader DB라고 부른다.
- Aurora는 읽기 전용 연결의 부하를 클러스터의 Aurora Replicas로 분산한다.
- Aurora Replicas는 가용성을 높이는 데 도움이 된다.
	- 클러스터의 writer 인스턴스가 사용 불가능하게 되면 Aurora는 reader 인스턴스 중 하나를 writer로 자동으로 승진시킨다.
- Aurora DB 클러스터는 최대 15개의 Aurora 복제본을 포함할 수 있다.
- Aurora Replicas는 DB 클러스터의 AWS 리전 범위 내에서 여러 가용 영역에 분산될 수 있다.