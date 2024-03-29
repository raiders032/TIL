# 1 NoSQL

## 1.1 관계형 데이터베이스

### 1.1.1 관계형 데이터베이스의 가치

**데이터 저장**

- 보조 저장소는 어떤 것으로든 구성할 수 있다.
	- 데이터를 읽지 않으려면 휘발성인 주 메모리가 아니라 보조 저장소에 저장해야 한다.
- 워드 프로세서 같은 많은 애플리케이션에서는 운영체제의 파일 시스템에 파일을 쓴다.
- 엔터프라이즈 애플리케이션은 대부분 보조 저장소로 데이터베이스를 사용한다.
- 데이터베이스는 많은 양의 데이터를 저장할 때 파일 시스템보다 뛰어난 융통성을 제공한다.

<br>

**동시성**

- 엔터프라이즈 애플리케이션에서는 많은 사람이 동시에 같은 데이터를 보고 수정할 수 있다.
- 호텔 방이 이중으로 예약되는 것 같은 상태를 피하려면 이런 상호작용을 조율해야 한다.
- 관계형 데이터베이스는 트랜잭션을 통해 데이터에 대한 접근을 통제해 이런 문제를 처리한다.

<br>

### 1.1.2 단점

**객체-관계 불일치**

- 애플리케이션 개발자는 관계형 모델과 메모리 내 데이터 구조 간의 객체-관계 불일치로 불만이 많다.

<br>

**클러스터**

- 데이터와 트래픽이 증하면 더 많은 컴퓨팅 자원이 필요하다.
- 수평 확장과 수직 확장을 통해 컴퓨팅 자원을 늘릴 수 있다.
- 수직 확장은 더 많은 프로세서, 디스크 스토리지, 메로리를 장착하는 방법이다.
	- 장비를 키우는 방법에는 실질적인 한계가 있고 장비 가격도 엄청나게 비싸진다.
- 다른 방법인 수평 확장은 작은 장비를 많이 모아 클러스터를 구성하는 것이다.
	- 클러스터는 장비 한 대가 실패해도 클러스터 전체는 중단없이 서비스하도록 구축할 수 있으므로 높은 가용성을 제공할 수 있다.
- 하지만 관계형 데이터베이스는 클러스터에서 효율적으로 동작하도록 설계되지 않았다.
	- 물론 관계형 데이터베이스에는 `샤딩`을 이용해 데이터 집합을 분리하고 각 데이터 집합을 별도 서버에서 처리할 수 있다.
	- 부하 분산은 가능해지지만 여러 샤드에 걸치는 쿼리나 참조 정합성, 트랜잭션, 일관성 제어 같은 것은 물 건너간다.
	- 라이센스 비용 면에서도 상용 관계형 데이터베이스는 단일 서버를 가정해 가격을 책정해 비용이 올라간다.
- 관계형 데이터베이스는 Atomicity (원자성), Consistency (일관성), Isolation (격리성), Durability (지속성)의 ACID 특성을 강하게 보장한다.
	- 이러한 엄격한 일관성 요구는 분산 환경에서 데이터를 동기화하는 데 복잡성과 오버헤드를 추가한다.

<br>

## 1.2 NoSQL 특징 

- 먼저 NoSQL은 우연한 신조어이며 규정된 정의도 없다.
	- NoSQL에 대한 일관성 있는 정의는 나오기 힘들며 공통 특징을 살펴볼 수밖에 없다.
- 대부분 오픈 소스고 SQL을 사용하지 않는 데이터베이스를 의미한다.
- 스키마 없이 동작하며, 구조에 대한 정의를 변경할 필요 없이 데이터베이스 레코드에 자유롭게 필드를 추가할 수 있다.
	- 균일하지 않은 데이터나 커스텀 필드를 다룰 때 특히 유용하다.
	- 관계형 데이터 베이스에서 customField6 같은 이해하기 어려운 커스텀 필드 테이블을 사용해야 했다.
	- 스키마가 없는 데이터베이스 또한 데이터에 접근하는 코드에 존재하는 암묵적 스키마가 있다.
- 클러스터에서 잘 동작한다.
- 관계형 모델을 사용하지 않는다.
	- 관계형 모델은 저장하고자 하는 정보를 튜플(행)으로 나눈다.
	- 튜플은 제한적인 데이터 구조다.
	- 여러개의 단순한 값을 모아놓은 것
	- 한 튜플을 다른 튜플에 넣어 중첩 레코드를 만들 수 없다.

<br>

## 1.3 NoSQL 데이터베이스 종류

- **문서 기반**: MongoDB, CouchDB (JSON 또는 BSON 형식의 문서를 사용)
- **키-값 저장소**: Redis, DynamoDB (단순한 키-값 쌍을 사용)
- **컬럼 기반**: Cassandra, HBase (컬럼 패밀리를 사용하여 빅데이터를 효율적으로 처리)
- **그래프 기반**: Neo4j, Amazon Neptune (엔티티 간의 관계를 그래프 형태로 저장)

<br>

# 2 key-value 데이터베이스

- 키-값 저장소는 간단한 해시 테이블로, 주키(PK)를 통해서만 데이터베이스에 접근할 때 사용한다.
	- 항수 주키를 사용해 접근하기 때문에 성능과 확정성이 뛰어나다.
- 클라이언트는 키에 대한 값을 얻거나, 키에 대한 값을 넣을 수 있고,키를 삭제할 수 있다.
- 데이터 저장소는 값을 BLOB(Binary Large Object)로 저장할 뿐 값의 내부를 알지도 못하고 신경 쓰지도 않는다.
	- 무엇이 저장되었는지 이해하는 것은 애플리케이션의 책임이다.

<br>

## 2.1 데이터 구조

- 많은 key-value 데이터베이스는 값 부분에 무엇이 저장되든 상관하지 않는다.
- BLOB, 텍스트, JSON, XML 등이 값이 될 수 있다.

<br>

## 2.2 조회 기능

- 모든 key-value 데이터베이스는 키로 조회할 수 있다.
	- 값 컬럼의 특정 속성을 사용해 조회할 수 없다.
	- 애플리케이션에서 값을 읽어 해당 속성이 조건을 만족하는지 직접 확인해야 한다.

<br>

## 2.3 확장성

- 모든 key-value 데이터베이스 샤딩을 통해 확장한다.
- 키 값에 따라 어느 노드에 키를 저장할지 결정한다.

<br>

## 2.4 사용처

**적절한 사용처**

- 세션 정보 저장
	- 세션에 대한 모든 정보가 한 객체로 저장되어 있으므로 이런 단일 요청 연산은 매우 빠르게 수행된다.
- 사용자 프로필, 설정
	- 사용자의 언어, 색상, 시간대 등의 사용자 프로파일을 객체에 넣어두면 GET 연산 하나로 얻을 수 있다.
- 장바구니 데이터

<br>

**사용하지 말아야 할 때**

- 데이터 간의 관계가 있는 경우
	- 일부 key-value 데이터베이스가 링크 순회 기능을 제공하지만 다른 데이터 집합 사이에 관계가 필요한 경우 최적의 해법이 아니다.
- 다중 연산 트랜잭션을 사용하는 경우
	- 여러 개 키를 저장하는 중 하나라도 실패하면 다른 연산도 되돌리거나 취소하고 싶다면 최적의 해법이 아니다.
- 데이터로 조회하는 경우
	- 값 부분의 무언가로 키를 검색할 필요가 있다면 key-value 데이터베이스를 원하는대로 사용하기 어렵다.
- 집합의 의한 연산
	- 연산이 한 번에 키 하나로 제한되므로 동시에 여러 키에 연산을 진행할 수 없다.
	- 여러 키에 연산을 진행하려면 클라이언트에서 처리해야 한다.

<br>

# 3 Document 데이터베이스

- 문서는 문서 데이터베이스의 주요 개념이다.
	- 문서 데이터베이스는 문서를 저장하고 조회한다.
	- 문서는 XML, JSON, BSON 등이 될 수 있다.
	- 저장된 문서는 서로 비슷하지만 구조가 완전히 똑같을 필요는 없다.
	- 문서 데이터베이스는 키-값 데이터베이스의 값 부분에 문서를 저장하는 것이다.
	- 문서 데이터베이스는 값을 검사할 수 있는 키-값 데이터베이스라 생각해도 무방하다.
- 관계형 데이터베이스는 모든 컬럼을 정의해야 하지만, 문서 저장소에서는 그럴 필요가 없다.
	- 데이터를 가지고 있지 않으면 빈 값 또는 null이 된다.
	- 문서에서 빈 속성이란 없다.
	- 주어진 속성을 찾지 못하면 해당 속성이 설정되지 않았거나 문서와 관계 없다고 가정한다.

<br>

## 3.1 스키마 전환

- 스키마가 없는 데이터베이스 또한 데이터에 접근하는 코드에 존재하는 암묵적 스키마가 있으므로 전환에 주의해야 한다.
- 스키마가 없는 데이터베이스에서는 데이터의 암묵적 스키마를 변경하는 방식으로 데이터를 읽을 수 있다.
- 점증적 전환을 사용해 데이터를 업데이트할 수 있다.


<br>

# 4 다중 저장소 지속성

- NoSQL 등장의 가장 중요한 결과는 다중 저장소 지속성이다.
- 다중 저장소 지속성이란 다양한 데이터 저장소 요건에 대해 다른 데이터 저장소 기술을 사용하는 것이다.
	- 즉 상황에 따라 다른 데이터 저장소를 사용한다는 뜻이다.
- 데이터 저장소 기술을 추가할수록 프로그래밍 운영 복잡도가 증가하므로, 데이터 저장소 도입의 장점과 복잡도 증가 문제의 경중을 따져야 한다.

<br>

# 5 집합적 데이터 모델

- 데이터 모델이란 데이터를 인식하고 조작하는데 사용되는 모델을 말한다.
- NoSQL 솔루션은 각각 다른 모델을 사용하며 아래와 같이 구분한다.
	- 키-값
	- 문서
	- 컬럼 패밀리
	- 그래프
- 처음 셋은 집합 지향이라 불리는 특징을 공유한다.

<br>

## 5.1 집합

- 관계형 모델에서는 저장하고자 하는 정보를 튜플(행)으로 나눈다.
	- 튜플은 제한적인 데이터 구조다.
	- 여러개의 단순한 값을 모아놓은 것
	- 한 튜플을 다른 튜플에 넣어 중첩 레코드를 만들 수 없다.
- **집합 지향**은 다른 접근법을 취한다.
	- 튜플의 집합보다 더 복잡한 구조를 데이터의 단위로 다룬다.
	- 리스트나 중첩 레코드를 허용하는 복잡한 레코드로 생각하면 된다.
	- 이러한 복잡한 레코드에 대한 공통 용어가 없으므로 집합이라 부르겠다.
- 집합은 도메인 주도 개발에서 나온 용어다.
	- 집합은 단위로 다루고 싶은 관련된 객체의 무리를 뜻한다.
	- 집합은 데이터 조작과 일관성 관리가 된다.
	- 원자적으로 집합을 업데이트하기 때문이다.
	- 집합은 복제나 샤딩에서도 자연스러운 단위기 때문에 클러스터에서 데이터를 처리하는 것도 쉽다.

<br>

**집합 지향**

- 집합 지향의 경우 클러스터에서 동작하기 좋다.
- 클러스터에서 실행했을 때 데이터 수집을 위해 질의해야 하는 노드 수를 최소해야 한다.

<br>

## 5.2 집합의 경계

- 집합의 경계를 어떻게 그리는 것이 옳을지에 대한 일반적인 해답은 없다.
- 집합의 경계는 데이터를 조작하는 방식에 따라 완전히 달라진다.
- 고객 데이터를 접근할 때 그 고객의 모든 주문 정보도 한꺼번에 접근하는 경우가 많다면 단일 집하이 좋을 것이다.
- 그러나 한 번에 한 주문에 집중하는 경우가 대부분이라면 각각을 별도의 집합으로 분리하는 것이 좋다.

<br>

## 5.3 집합 무지

- 관계형 데이터베이스는 데이터 모델에 집합 개념이 없어 집합 무지라 부른다.
- NoSQL 세계에서 그래프 데이터베이스도 집합 무지다.
- 지합 무지는 나쁜것이 아니다.
- 집합의 경계를 제대로 그리는 것은 어려운 일이기 때문이다.
	- 똑같은 데이터가 여러 가지 다른 맥락에서 사용되는 경우 특히 그렇다.
- 예를 들어 고객 주문을 할 때나 주문을 검토할 때, 판매자가 주문을 처리할 때 좋은 집합이지만 판매자가 몇 달간의 제품 판매 상황을 분석할 때 주문 집합은 문제가 된다.
	- 제품 판매 분석과 같이 다른 맥락에서 필요한 정보를 추출하려면, 이 주문 집합 전체를 탐색하며 필요한 정보를 추출해야 합니다.
	- 예를 들어, 특정 제품의 판매량을 알기 위해서는 모든 주문을 검사하여 해당 제품이 포함된 주문을 찾아야 합니다.

<br>

## 5.4 트랜잭션

- NoSQL은 ACID 트랜잭션을 지원하지 않아 데이터 일관성을 희생하는 것이라 흔히 말한다.
- 집합 지향 데이터베이스는 여러 집합을 포괄하는 ACID 트랜잭션을 지원하지 않는다.
- 대신 한 번에 한 집합에 대한 원자적 조작은 지원한다.
- 여러 집합을 원자적으로 조작해야 한다면 애플리케이션 코드에서 직접 관리해야 한다.