# 1. JPQL

* JPQL은 객체지향 쿼리 언어이다
* JPA는 다양한 쿼리 방법을 지원한다.
  * JPQL, JPA Criteria, QueryDSL, 네이티브 SQL, JDBC API 직접 사용, MyBatis 등
* JPQL은 엔티티 객체를 대상으로 쿼리
* SQL을 추상화해서 특정 데이터베이스 SQL에 의존하지 않는다
* JPQL은 결국 SQL로 변환된다



**JPQL을 사용하는 이유**

* 가장 단순한 조회 방법으로 `EntityManager.find()` 과 같이 엔티티 매니저를 통해 엔티티를 조회할 수 있다.
* 그러나 나이가 18살 이상인 회원을 모두 조회하고 싶다면?
  * 모든 DB 데이터를 객체로 전환해서 애플리케이션에서 나이가 18살 이상인 회원을 검색하는 것은 불가능하다.
* 즉 필요한 데이터만 DB에서 불러오려면 결국 검색 조건이 포함된 SQL이 필요하고 이것이 JPQL이다.

**JPQL 예시**

```java
//검색
String jpql = "select m from Member m where m.age > 18";
List<Member> result = em.createQuery(jpql, Member.class).getResultList();
```

**실제 실행된 SQL**

```sql
select
	m.id as id,
	m.age as age,
	m.USERNAME as USERNAME,
	m.TEAM_ID as TEAM_ID
from
	Member m
where
	m.age > 18 
```



# 2.기본 문법과 기능

* 엔티티와 속성은 대소문자 구분
  * member, Member
* JPQL 키워드는 대소문자를 구분하지 않는다.
  * select, Select
* 엔티티 이름 사용, 테이블 이름이 아니다
* **별칭은 필수**
  * as는 생략가능



## 2.1  TypeQuery

* 반환 타입이 명확할 때 사용

```java
TypedQuery<Member> query = em.createQuery("SELECT m FROM Member m", Member.class); 
```



## 2.2 Query

* 반환 타입이 명확하지 않을 때 사용

```java
Query query = em.createQuery("SELECT m.username, m.age from Member m");
```



## 2.3  결과 조회 API

`query.getResultList()`

* 결과가 하나 이상일 때, 리스트 반환
* 결과가 없으면 빈 리스트 반환

`query.getSingleResult()`

* 결과가 정확히 하나, 단일 객체 반환
* 결과가 없으면 `javax.persistence.NoResultException` 발생
* 둘 이상이면 `javax.persistence.NonUniqueResultException` 발생



## 2.4  파라미터 바인딩

**이름 기준**

* 권장 방식

```java
Query query = em.createQuery("SELECT m FROM Member m where m.username=:username");
query.setParameter("username", usernameParam);
```

**위치 기준**

```java
Query query = em.createQuery("SELECT m FROM Member m where m.username=?1");
query.setParameter(1, usernameParam);
```



## 2.5 프로젝션

* 프로젝션이란 SELECT 절에 조회할 대상을 지정하는 것
* 프로젝션의 대상에는 엔티티, 임베디드 타입, 스칼라 타입(숫자, 문자등 기본 데이터 타입)이 있다.
* DISTINCT로 중복 제거
* 엔티티들은 영속성 컨텍스트에 의해서 관리된다.



**예시**

* 엔티티 프로젝션
  * SELECT m FROM Member m
  * SELECT m.team FROM Member m
* 임베디드 타입 프로젝션
  * SELECT m.address FROM Member m
* 스칼라 타입 프로젝션
  * SELECT m.username, m.age FROM Member m



**여러 값을 조회하는 방법**

* `SELECT m.username, m.age FROM Member m`

1. Query 타입으로 조회
   * 비추천
2. Object[] 타입으로 조회
   * 비추천
3. new 명령어로 조회
   * DTO 클래스를 생성 UserDTO
   * 패키지 명을 포함한 전체 클래스 명 입력
   * 순서와 타입이 일치하는 생성자 필요



**new 명령어로 조회**

```java
List<UserDTO> result = em.createQuery("SELECT new jpabook.jpql.UserDTO(m.username, m.age) FROM Member m", UserDTO.class)
    .getResultList();
```



## 2.6 페이징 API

* JPA는 페이징을 다음 두 API로 추상화
  * setFirstResult(int startPosition) : 조회 시작 위치 (0부터 시작)
  * setMaxResults(int maxResult) : 조회할 데이터 수

**페이징 예시**

```java
String jpql = "select m from Member m order by m.name desc";
List<Member> resultList = em.createQuery(jpql, Member.class)
    .setFirstResult(10)
    .setMaxResults(20)
    .getResultList();
```



## 2.6 조인

**내부 조인**

* `SELECT m FROM Member m [INNER] JOIN m.team t`

**외부 조인** 

* `SELECT m FROM Member m LEFT [OUTER] JOIN m.team t`

**조인 대상 필터링**

* ON절을 활용한다.
* `SELECT m, t FROM Member m LEFT JOIN m.team t on t.name = 'A'`
  * 회원과 팀을 조인하면서, 팀 이름이 A인 팀만 조인



## 2.7 서브 쿼리

나이가 평균보다 많은 회원

```sql
select m from Member m
where m.age > (select avg(m2.age) from Member m2)
```

한 건이라도 주문한 고객

```sql
select m from Member m
where (select count(o) from Order o where m = o.member) > 0
```

팀A 소속인 회원

```sql
select m from Member m
where exists (select t from m.team t where t.name = "팀A")
```

전체 상품 각각의 재고보다 주문량이 많은 주문들

```sql
select o from Order o
where o.orderAmount > ALL (select p.stockAmount from Product p) 
```

어떤 팀이든 팀에 소속된 회원

```sql
select m from Member m
where m.team = ANY (select t from Team t)
```

JPA 서브 쿼리 한계

* JPA는 WHERE, HAVING 절에서만 서브 쿼리 사용 가능
* SELECT 절도 가능(하이버네이트에서 지원)
* FROM 절의 서브 쿼리는 현재 JPQL에서 불가능
  * 조인으로 풀 수 있으면 풀어서 해결



## 2.8 JPQL 기본 함수

* CONCAT
* SUBSTRING
* TRIM
* LOWER
* UPPER
* LENGTH
* LOCATE
* ABS
* SQRT
* MOD
* SIZE, INDEX(JPA 용도)



## 2.9 사용자 정의 함수 호출

* 하이버네이트는 사용전 방언에 추가해야 한다.
* 사용하는 DB 방언을 상속받고, 사용자 정의 함수를 등록한다.

**사용자 정의 함수 등록**

```java
public class MyH2Dialect extends H2Dialect {
	public MyH2Dialect (){
    	registerFunction("group_concat", new StandardSQLFunction("group_concat",StandardBasicTypes.STRING));
    }
}
```

**프로퍼티 설정**

```properties
hibernate.dialect=dialect.MyH2Dialect
```

**사용자 정의 함수 호출**

```java
String query = "select group_concat(m.username) from Member m";
List<String> resultList = em.createQuery(query, String.class).getResultList();
```



# 3.페치 조인 

* JPQL에서 성능 최적화를 위해 제공하는 기능이다
* 연관된 엔티티나 컬렉션을 SQL 한 번에 함께 조회하는 것이 가능하다



**예시**

* 회원을 조회하면서 연관된 팀도 함께 조회

```sql
# JPQL
select m from Member m join fetch m.team
# 실제 SQL
SELECT M.*, T.* FROM MEMBER M
INNER JOIN TEAM T ON M.TEAM_ID=T.ID 
```

![image-20210929204355851](./images/fetch-join)



## 3.1 컬렉션 페치 조인

* 컬렉션 페치 조인을 사용하면 중복된 결과가 발생할 수 있다.
  * JPQL의 DISTINCT를 사용해서 중복을 제거할 수 있다.
  * 따라서 컬렉션을 페치 조인하면 페이징 API(setFirstResult, setMaxResults)를 사용할 수 없다.
  * 일대일, 다대일 같은 단일 값 연관 필드들은 페치 조인해도 페이징 가능
* 둘 이상의 컬렉션은 페치 조인 할 수 없다

```sql
# JPQL
select t
from Team t join fetch t.members
where t.name = "팀A" 

# SQL
SELECT T.*, M.*
FROM TEAM T
INNER JOIN MEMBER M ON T.ID=M.TEAM_ID
WHERE T.NAME = '팀A' 
```

![image-20210929204944768](./images/collection-fetch-join)



## 3.2 페치 조인과 DISTINCT

JPQL의 DISTINCT 2가지 기능 제공한다

1. SQL에 DISTINCT를 추가
2. 애플리케이션에서 엔티티 중복 제거

**예시**

![image-20210929205604722](./images/distinct)

* SQL에 DISTINCT를 추가: 데이터가 다르므로 중복 제거 실패

![image-20210929205633360](./images/distinct2)

* 애플리케이션에서 엔티티 중복 제거: 같은 식별자를 가진 엔티티 제거



## 3.3 페치 조인과 일반 조인의 차이

**일반 조인 실행시 연관된 엔티티를 함께 조회하지 않음**

* **SELECT 절에 지정한 엔티티만 조회한다**
* 여기서는 팀 엔티티만 조회하고 회원 엔티티는 조회하지 않는다
* 페치 조인을 사용할 때만 연관된 엔티티도 함께 조회

**일반 조인**

```sql
# JPQL
select t
from Team t join t.members m
where t.name = '팀A'

# SQL
SELECT T.*
FROM TEAM T
INNER JOIN MEMBER M ON T.ID=M.TEAM_ID
WHERE T.NAME = '팀A'
```

**join fetch**

```sql
# JPQL
select t
from Team t join fetch t.members
where t.name = '팀A'

# SQL
SELECT T.*, M.*
FROM TEAM T
INNER JOIN MEMBER M ON T.ID=M.TEAM_ID
WHERE T.NAME = '팀A'
```

> 여러 테이블을 조인해서 엔티티가 가진 모양이 아닌 전혀 다른 결과를 내야 하면, 페치 조인 보다는 일반 조인을 사용하고 필요 한 데이터들만 조회해서 DTO로 반환하는 것이 효과적



## 3.4 페치 조인의 특징과 한계

* 페치 조인 대상에는 별칭을 줄 수 없다
  * 하이버네이트는 가능, 가급적 사용하지 말자
  * 페치 조인은 조인 대상 모두를 가져오는것에 초점
  * 조인 대상 일부를 선택하기 위해 별칭을 주고 whrer절에서 사용하는 것은 잘못된 것
  * 잘못된 예) `select t from Team t join fetch t.members m where m.age > 10`
  * 팀이아닌 멤버에서 조회를 하는 것으로 해결해야한다.
* **둘 이상의 컬렉션은 페치 조인 할 수 없다**
* **컬렉션을 페치 조인하면 페이징 API(setFirstResult, setMaxResults)를 사용할 수 없다.**
  * 일대일, 다대일 같은 단일 값 연관 필드들은 페치 조인해도 페이징 가능
* 연관된 엔티티들을 SQL 한 번으로 조회 -> 성능 최적화



## 3.5 언제 페치 조인을 사용해야 될까?

* 페치 조인은 객체 그래프를 유지할 때 사용하면 효과적이다.

  * 엔티티를 조회하고 조회된 엔티티로 객체 그래프 탐색을 한다면 페치 조인은 효과적이다.

* 여러 테이블을 조인해서 엔티티가 가진 모양이 아닌 전혀 다른 결과를 내야 한다면?

  * 페치 조인 보다는 일반 조인을 사용하고 필요한 데이터들만 조회해서 DTO로 반환하는 것이 효과적

  

# 4.경로 표현식

* 경로 표현식이란 jpql에서 `.`으로 객체 그래프를 탐색하는 것

**상태 필드(state field)**

* 단순히 값을 저장하기 위한 필드
* 더 이상 객체 탐색이 불가능하다

```java
// m.username: 상태 필드
String query = "select m.username from Member m";
List<Member> result = em.createQuery(query, Member.class).getResultList();
```

**연관 필드(association field)**

* 연관관계를 위한 필드
* 단일 값 연관 필드: @ManyToOne, @OneToOne, 대상이 엔티티, 객체 탐색 가능

```java
// m.team: 단일 값 연관 필드
// 추가적인 객체 탐색 가능 m.team.name
String query = "select m.team.name from Member m";
List<Member> result = em.createQuery(query, Member.class).getResultList();
```

* 컬렉션 값 연관 필드: @OneToMany, @ManyToMany, 대상이 컬렉션,  객체 탐색 불가능

```java
// t.members: 컬렉션 값 연관 필드
// 더이상 객체 탐색 불가능
String query = "select t.members from Team t";
Collection result = em.createQuery(query, Collection.class).getResultList();
```

**예시**

```sql
select m.username -> 상태 필드
from Member m
join m.team t -> 단일 값 연관 필드
join m.orders o -> 컬렉션 값 연관 필드
where t.name = '팀A'
```

**경로 표현식 특징**

* 상태 필드(state field): 경로 탐색의 끝, 추가적인 탐색 불가

* 단일 값 연관 경로: 묵시적 내부 조인(inner join) 발생, 추가적인  탐색 가능

* 컬렉션 값 연관 경로: 묵시적 내부 조인 발생, 추가적인  탐색 불가

  * FROM 절에서 명시적 조인을 통해 별칭을 얻으면 별칭을 통해 탐색 가능

  * ```sql
    # 불가능 t.members은 컬렉션 값 연관 경로
    select t.members.username from Team t
    
    # 명시적 조인을 통해 별칭으로 탐색
    select m.username from Team t join t.mebers m

**명시직 조인, 묵시적 조인**

* 묵시적 조인
  * 경로 표현식에 의해 묵시적으로 SQL 조인 발생 (내부 조인만 가능)
  * `select m.team from Member m`
* 명시적 조인
  * join 키워드 직접 사용
  * `select m from Member m join m.team t`
* 묵시적 조인을 사용하지 않는 것이 좋다
  * 즉 **연관 필드(association field)**를 사용하지 말자
* JPQL에 join을 직접 입력하는 명시적 조인을 항상 사용하자.

# 5.다형성 쿼리

* 조회 대상을 특정 자식으로 한정할 수 있다

**예시**

* Item 중에 Book, Movie를 조회해라

```sql
#JPQL
select i from Item i where type(i) IN (Book, Movie)

#SQL
select i from i where i.DTYPE in (‘B’, ‘M’)
```

```sql
#JPQL
select i from Item i
where treat(i as Book).auther = ‘kim’

#SQL(싱글 테이블 전략인 경우)
select i.* from Item i
where i.DTYPE = ‘B’ and i.auther = ‘kim’
```

# 6.엔티티 직접 사용

* JPQL에서 엔티티를 직접 사용하면 SQL에서 해당 엔티티의 기본키 값을 사용

```sql
# JPQL 엔티티의 아이디를 사용
select count(m.id) from Member m
# JPQL 엔티티 직접 사용
select count(m) from Member m

# SQL 두경우 모두 아래와 같이 실행
select count(m.id) as cnt from Member m
```

* 아래처럼 엔티티를 파라미터로 전달하거나 식별자를 직접 전달하거나 실행되는 SQL은 같다

```java
// 엔티티를 파라미터로 전달
String jpql = "select m from Member m where m = :member";
List resultList = em.createQuery(jpql)
 .setParameter("member", member)
 .getResultList();

// 식별자를 직접 전달
String jpql = "select m from Member m where m.id = :memberId";
List resultList = em.createQuery(jpql)
 .setParameter("memberId", memberId)
 .getResultList(); 
```



# 7.Named 쿼리

* 미리 정의해서 이름을 부여해두고 사용하는 JPQL
* 정적 쿼리
* 어노테이션, XML에 정의
* 애플리케이션 로딩 시점에 초기화 후 재사용
* **애플리케이션 로딩 시점에 쿼리를 검증하는 장점이 있다.**
* Named 쿼리를 아래처럼 직접 사용하는 것보다 Spring Data JPA의 `@Query`를 사용하는 것이 더 좋다



**어노테이션 기반의 Named  쿼리 정의와 사용**

```java
// Named 쿼리 정의
@Entity
@NamedQuery(
 name = "Member.findByUsername",
 query = "select m from Member m where m.username = :username")
public class Member {
 ...
}

// Named 쿼리 사용
List<Member> resultList = em.createNamedQuery("Member.findByUsername", Member.class)
 .setParameter("username", "회원1")
 .getResultList();
```



# 8.벌크 연산

* 재고가 10개 미만인 모든 상품의 가격을 10% 상승하려면?
  * JPA 변경 감지 기능을 이용하면 너무 많은 SQL 실행된다.
  * 10개 미만의 상품이 100건 이라면 UPDATE SQL이 100번 실행된다.
* 벌크 연산은 쿼리 한 번으로 여러 테이블 로우 변경할 수 있다
* UPDATE, DELETE를 지원한다.



**예시**

```java
String qlString = "update Product p " +
                  "set p.price = p.price * 1.1 " +
                  "where p.stockAmount < :stockAmount";

// executeUpdate()의 영향받은 엔티티 수가 반환된다.
int resultCount = em.createQuery(qlString)
 .setParameter("stockAmount", 10)
 .executeUpdate(); 
```



**벌크 연산 주의점**

* 벌크 연산은 영속성 컨텍스트를 무시하고 데이터베이스에 직접 쿼리
* 해결법
  1. 벌크 연산을 먼저 실행(영속성 컨텍스가 비어 있기 때문)
  2. **벌크 연산 수행 후 영속성 컨텍스트 초기화**(벌크 연산이 적용되지 않은 엔티티가 영속성 컨텍스트에 캐싱되어 있기 때문)