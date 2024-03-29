# 1 ElastiCache

- AWS의 ElastiCache는 웹 애플리케이션의 속도를 향상시키기 위해 자주 사용되는 데이터를 메모리에 캐시하는 데 사용되는 완전 관리형 인 메모리 데이터 스토어 및 캐시 서비스다.
- Redis와 Memcached라는 두 가지 인기 있는 오픈 소스 인-메모리 캐싱 엔진을 지원합니다.
- 인-메모리 데이터 스토어 또는 캐시를 제공함으로써 ElastiCache는 디스크 기반 데이터베이스보다 빠른, 관리된, 인-메모리 캐시에서 정보를 검색할 수 있게 하여 웹 애플리케이션의 속도와 성능을 크게 향상시킵니다.

<br>

## 1.1 ElastiCache의 주요 기능

- 완전 관리형 서비스: AWS가 캐시 환경의 관리, 모니터링 및 스케일링을 모두 처리하여 애플리케이션 개발에 집중할 수 있게 합니다.
- 높은 성능: 인-메모리 캐싱을 통해 마이크로초 응답 시간과 초당 수백만 요청을 처리할 수 있습니다.
- 확장성: 작은 캐시 클러스터에서 시작하여 애플리케이션의 요구가 증가함에 따라 스케일 업하거나 스케일 아웃할 수 있습니다.
- 가용성 및 신뢰성: 멀티 존 복제 및 자동 장애 전환 메커니즘을 통해 높은 가용성을 제공합니다.
- 보안: 이동 중 및 저장 중 암호화, VPC 통합 및 IAM 역할과 같은 강력한 보안 옵션을 제공합니다.

<br>

# 2 ElastiCache 엔진 선택하기

- ElastiCache는 두 가지 엔진, Redis와 Memcached를 지원하며, 각각 다른 사용 사례에 적합합니다

<br>

## 2.1 Redis

- **고가용성**: Redis는 자동 장애 조치를 통해 다중 AZ(가용성 영역) 배포를 지원하여 고가용성을 보장합니다. 이 기능을 사용하면 Redis는 기본 노드 오류가 발생할 경우 읽기 전용 복제본으로 자동 전환하여 가동 중지 시간을 최소화할 수 있습니다.
- **확장성**: 읽기 전용 복제본을 사용하여 읽기를 확장하고 가용성을 향상합니다. 이는 읽기 트래픽을 여러 인스턴스에 분산하여 처리량을 늘릴 수 있음을 의미합니다.
- **데이터 내구성**: Redis는 AOF(Append Only File) 지속성을 사용하여 데이터 내구성을 제공합니다. 즉, 데이터가 데이터베이스에 기록될 때마다 변경 사항이 기록되므로 오류가 발생하더라도 데이터가 손실되지 않습니다.
- **백업 및 복원**: 백업 및 복원 기능이 내장되어 있어 데이터를 쉽게 백업하고 필요할 때 복원할 수 있습니다. 이는 재해 복구 시나리오에 매우 중요합니다.
- **데이터 구조**: 세트 및 정렬된 세트를 포함한 복잡한 데이터 유형을 지원하므로 더 복잡한 애플리케이션과 데이터 조작이 가능합니다.

<br>

## 2.2 Memcached

- **샤딩**: 단순성과 속도를 위해 설계된 Memcached는 데이터 분할(샤딩)을 위한 다중 노드를 지원합니다. 샤딩은 데이터를 여러 노드에 분산하여 확장성과 성능을 향상시킵니다.
- **가용성**: 복제와 같은 고가용성 기능을 제공하지 않습니다. 즉, 노드가 다운되면 복원될 때까지 해당 노드의 캐시를 사용할 수 없게 됩니다.
- **지속성**: Memcached는 비영구적입니다. 즉, Memcached에 저장된 데이터는 디스크에 저장되지 않으며 캐시를 다시 시작하면 손실됩니다. 따라서 원본 데이터 소스에서 다시 생성하거나 다시 로드할 수 있는 중요하지 않은 데이터를 캐싱하는 데 적합합니다.
- **백업 및 복원**: 지속성이 주요 관심사가 아닌 임시 저장소라는 설계 철학을 반영하여 내장된 백업 및 복원 기능이 부족합니다.
- **아키텍처**: 다수의 동시 연결 및 요청을 효율적으로 처리할 수 있는 멀티스레드 아키텍처를 활용합니다. 따라서 Memcached는 데이터 복잡성이나 내구성보다 속도와 단순성이 더 중요한 시나리오에 특히 적합합니다.

<br>

## 2.3 요약

- **고가용성, 데이터 내구성, 복잡한 데이터 유형 사용 기능이 필요할 때 Redis를 사용하세요**. Redis는 데이터가 중요하고 손실이 허용되지 않는 애플리케이션에 적합합니다. 백업 및 복원 기능 덕분에 Redis는 데이터를 복구해야 하는 시나리오에 더 나은 선택이 됩니다.
- **비지속적 데이터에 대해 간단하고 효율적이며 빠른 캐싱 솔루션이 필요한 경우 Memcached를 사용하세요**. Memcached의 멀티스레드 아키텍처는 대량의 단순 키-값 데이터를 매우 효율적으로 처리하므로 데이터와 개체를 RAM에 캐시하여 동적 웹 애플리케이션 속도를 높이는 데 이상적입니다.

<br>

# 3 ElastiCache의 사용 사례

- 웹 세션 저장소: 세션 데이터를 빠른 키-값 저장소에 저장하여 빠른 액세스와 원활한 사용자 경험을 제공합니다.
- 데이터베이스 캐싱: 데이터베이스 쿼리의 결과를 캐싱하여 데이터베이스의 부하를 줄이고 데이터 검색 속도를 빠르게 합니다.
- 실시간 분석: ElastiCache를 실시간 분석 애플리케이션을 위한 빠른 인-메모리 데이터 스토어로 사용합니다.
- 게임 리더보드: 게임 애플리케이션을 위한 고성능 실시간 리더보드를 구현합니다.