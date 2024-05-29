# 1 CDC

- Change Data Capture(CDC)는 데이터 소스(데이터베이스, 데이터 웨어하우스 등)의 모든 변경 사항을 추적하여 대상 시스템에서 캡처할 수 있도록 하는 기술입니다.
- 간단히 말해, CDC는 모든 시스템과 배포 환경에서 데이터 무결성과 일관성을 유지할 수 있게 해줍니다.
- 또한 레거시 데이터베이스에서 데이터를 이동하여 문서 또는 검색 데이터베이스, 데이터 웨어하우스와 같은 목적에 맞게 구축된 데이터 플랫폼에서 적절한 도구를 사용할 수 있도록 합니다.

<br>

## 1.1 CDC의 주요 기능

- 데이터 변경 사항 실시간 추적
	- CDC는 데이터베이스의 INSERT, UPDATE, DELETE 작업을 실시간으로 감지하고 캡처합니다.
- 데이터 동기화
	- 캡처된 변경 사항을 대상 시스템으로 전파하여 소스 데이터베이스와 대상 시스템 간의 데이터 동기화를 유지합니다.
- 데이터 마이그레이션
	- 온프레미스 환경과 클라우드 환경을 연결하고, 기업이 자체 속도에 맞춰 클라우드로 마이그레이션하거나 하이브리드 환경에서 계속 운영할 수 있도록 지원합니다.

<br>

## 1.2 CDC의 작동 방식

- 데이터가 소스 데이터베이스(일반적으로 MySQL, Microsoft SQL, Oracle, PostgreSQL 등의 관계형 데이터베이스)에서 변경(INSERT, UPDATE, DELETE)되면 캐시, 검색 인덱스, 데이터 웨어하우스, 데이터 레이크 등의 다운스트림 시스템으로 전파되어야 합니다.
- CDC에는 크게 두 가지 방식이 있습니다
	- Push 방식: 소스 데이터베이스가 다운스트림 서비스 및 애플리케이션에 업데이트를 푸시합니다.
	- Pull 방식: 다운스트림 서비스 및 애플리케이션이 일정한 간격으로 소스 데이터베이스를 폴링하여 업데이트된 데이터를 가져옵니다.

**push**
<br>

# 2 CDC 패턴

- 타임스탬프 기반
	- 데이터베이스 테이블에 가장 최근 변경 시간을 반영하는 열(LAST_MODIFIED, LAST_UPDATED 등)을 추가하여 변경 사항을 감지합니다.
- 트리거 기반
	- 데이터베이스 트리거를 사용하여 INSERT, UPDATE, DELETE 작업 발생 시 자동으로 실행되는 저장 프로시저를 통해 변경 사항을 캡처합니다.
- 로그 기반
	- 데이터베이스 트랜잭션 로그를 활용하여 변경 사항을 실시간으로 캡처합니다.

<br>

# 3 CDC 솔루션

- Debezium: 오픈 소스 CDC 도구로, 다양한 데이터베이스 시스템을 지원하며 변경 사항을 Kafka와 같은 메시지 큐에 이벤트로 전달합니다.
- Maxwell: MySQL 데이터베이스를 위한 오픈 소스 CDC 도구로, 바이너리 로그를 읽어 변경 사항을 JSON 형태로 Kafka나 Kinesis에 전달합니다.
- Kafka Connect CDC: Apache Kafka의 일부로, 다양한 데이터베이스의 변경 사항을 캡처하여 Kafka로 전달하는 기능을 제공합니다.
- Monstache: MongoDB를 위한 오픈 소스 CDC 도구로, 변경 스트림을 사용하여 변경 사항을 캡처하고 Elasticsearch나 Kafka로 전달합니다.

<br>

## 3.1 솔루션 선택 시 고려사항

- 소스 데이터베이스 종류: 선택한 CDC 솔루션이 해당 데이터베이스를 지원하는지 확인합니다.
- 데이터 변환 요구사항: 소스와 대상 시스템의 데이터 스키마가 다른 경우, 변환 기능을 제공하는 솔루션을 선택합니다.
- 대상 시스템과의 호환성: CDC 솔루션과 대상 시스템 간의 원활한 통합을 위해 호환성을 고려합니다.
- 성능 및 확장성: 대량의 데이터 변경 사항을 처리할 수 있는 성능과 확장성을 갖춘 솔루션을 선택합니다.