# 1 Querydsl

* Querydsl은 JPQL 빌더
* JPQL과 달리 컴파일 시점에 오류를 확인할 수 있다
  * JPQL은 문자 따라서 실행 시점에 오류가 발생한다

* JPQL은 파라미터 바인딩을 직접 하지만 Querydsl은 파라미터 바인딩 자동으로 처리해준다



# 2 기본 문법

* `EntityManager` 로 `JPAQueryFactory` 생성
* `JPAQueryFactory`를 필드 레벨로 가져가도 동시성 문제 없이 잘 사용할 수 있다
  * 동시성 문제는 JPAQueryFactory를 생성할 때 주입되는 EntityManager에 달려있다
  * 주입되는 `EntityManager` 자체가 Thread Safe하다
  * 스프링 프레임워크는 여러 쓰레드에서 동시에 같은 EntityManager에 접근해도, 트랜잭션 마다 별도의 영속성 컨텍스트를 제공하기 때문에, 동시성 문제는 걱정하지 않아도 된다.


```java
@SpringBootTest
@Transactional
public class QuerydslBasicTest {
  @PersistenceContext
  EntityManager em;
  
  JPAQueryFactory queryFactory;
  
  @BeforeEach
  public void before() {
  	queryFactory = new JPAQueryFactory(em);
	}

  @Test
  public void startQuerydsl() {
    QMember m = new QMember("m");

    Member findMember = queryFactory
      .select(m)
      .from(m)
      .where(m.username.eq("member1"))
      .fetchOne();

    assertThat(findMember.getUsername()).isEqualTo("member1");
  }
}
```



# 3 기본 Q-Type 활용

* Q 클래스 인스턴스를 사용하는 두 가지 방법이 있다
* 하나는 별칭을 직접 지정하는 것이고 다른 하나는 기본 인스턴스를 사용하는 것이다



**Q클래스 인스턴스를 사용하는 2가지 방법**

* 같은 테이블을 조인하는 경우가 아니라면 **기본 인스턴스를 사용하자**

```java
QMember qMember = new QMember("m"); //별칭 직접 지정 
QMember qMember = QMember.member; //기본 인스턴스 사용
```

**기본 인스턴스를 static import와 함께 사용**

* `QMember.member` -> `member` static import하면 깔끔하게 사용할 수 있다

```java
import static study.querydsl.entity.QMember.*;

@Test
public void startQuerydsl3() {
  //member1을 찾아라.
  Member findMember = queryFactory
    .select(member)
    .from(member)
    .where(member.username.eq("member1"))
    .fetchOne();
  assertThat(findMember.getUsername()).isEqualTo("member1");
}
```



# 4 검색 조건 쿼리

**Predicate 체이닝**

* 검색조건(Predicate)은 `.and()`,`.or()`를 메서드 체인으로 연결할 수 있다.

```java
@Test
public void search() {
  Member findMember = queryFactory
    .selectFrom(member)
    .where(member.username.eq("member1")
           .and(member.age.eq(10)))
    .fetchOne();
  assertThat(findMember.getUsername()).isEqualTo("member1");
}
```



**Predicate 아규먼트 여러개 넘겨주기**

* where()에 아규먼트로 검색조건(Predicate)을 여러개 추가하면 AND 연산으로 조건들이 묶인다
* 이 경우 Predicate가 null인 경우는 무시된다 
* 메서드 추출을 활용해서 동적 쿼리를 깔끔하게 만들 수 있음

```java
@Test
public void searchAndParam() {
  List<Member> result1 = queryFactory
    .selectFrom(member)
    .where(member.username.eq("member1"),
           member.age.eq(10))
    .fetch();
  assertThat(result1.size()).isEqualTo(1);
}
```



**다양한 검색 조건**

```java
member.username.eq("member1") // username = 'member1'
member.username.ne("member1") //username != 'member1'
member.username.eq("member1").not() // username != 'member1'
  
member.username.isNotNull() //이름이 is not null

member.age.in(10, 20) // age in (10,20)
member.age.notIn(10, 20) // age not in (10, 20)
member.age.between(10,30) //between 10, 30
member.age.goe(30) // age >= 30
member.age.gt(30) // age > 30
member.age.loe(30) // age <= 30
member.age.lt(30) // age < 30

member.username.like("member%") //like 검색 
member.username.contains("member") // like ‘%member%’ 검색 
member.username.startsWith("member") //like ‘member%’ 검색
```



# 5 결과 조회

**`fetch()`**

* 리스트 조회 데이터가 없으면 빈 리스트 반환

```java
List<Member> fetch = queryFactory
  .selectFrom(member)
  .fetch();
```

**`fetchOne()`**

* 단 건 조회
* 결과 없으면 null
* 결과가 둘 이상이면 `com.querydsl.core.NonUniqueResultException` 발생

```java
Member findMember1 = queryFactory
  .selectFrom(member)
  .fetchOne();
```

**`fecthFirst()`**

* `limit(1).fetchOne()` 과 같은 결과

```java
Member findMember2 = queryFactory
  .selectFrom(member)
  .fetchFirst();
```

**`fetchResults()`**

* 페이징 정보 포함
* total count 쿼리 추가 실행
* count 쿼리가 실행되니 성능상 주의해야한다.

```java
QueryResults<Member> results = queryFactory
  .selectFrom(member)
  .fetchResults();

// 조회 결과 가져오기
results.getResults();
// 조회 결과 수 자져오기
results.getTotal();
// 쿼리에 사용된 limit 값 가져오기
results.getLimit();
// 쿼리에 사용된 offset 값 가져오기
results.getOffset();
```

> 실무에서 페이징 쿼리를 작성할 때, 데이터를 조회하는 쿼리는 여러 테이블을 조인해야 하지만, count 쿼리는 조인이 필요 없는 경우도 있다. 그런데 이렇게 자동화된 count 쿼리는 원본 쿼리와 같이 모두 조인을 해버리기 때문에 성능이 안나올 수 있다. count 쿼리에 조인이 필요없는 성능 최적화가 필요하다면, count 전용 쿼리를 별도로 작성해야 한다.

**`fetchCount()`**

* count 쿼리로 변경해서 count 수 조회

```java
long count = queryFactory
  .selectFrom(member)
  .fetchCount();
```



# 6 정렬

* desc() , asc() : 일반 정렬
* nullsLast() , nullsFirst() : null 데이터 순서 부여
* 정렬 순서: `.orderBy(member.age.desc(), member.username.asc().nullsLast())`
  1. 회원 나이 내림차순
  2. 회원 이름 올림차순(회원 이름이 없으면(null이면) 마지막)

```java
@Test
public void sort() {
  em.persist(new Member(null, 100));
  em.persist(new Member("member5", 100));
  em.persist(new Member("member6", 100));
  
  List<Member> result = queryFactory
    .selectFrom(member)
    .where(member.age.eq(100))
    .orderBy(member.age.desc(), member.username.asc().nullsLast())
    .fetch();
 
  Member member5 = result.get(0);
  Member member6 = result.get(1);
  Member memberNull = result.get(2);
  assertThat(member5.getUsername()).isEqualTo("member5");
  assertThat(member6.getUsername()).isEqualTo("member6");
  assertThat(memberNull.getUsername()).isNull();
  System.out.println("result = " + result);
}
```

```
result = [Member(id=8, username=member5, age=100), Member(id=9, username=member6, age=100), Member(id=7, username=null, age=100)]
```



# 7 페이징

```java
@Test
public void paging() {
  List<Member> result = queryFactory
    .selectFrom(member)
    .orderBy(member.username.desc()) 
    .offset(1) //0부터 시작(zero index) 
    .limit(2) //최대 2건 조회
    .fetch();

  assertThat(result.size()).isEqualTo(2);
}
```

**페이징 정보 조회**

* 페이징 정보를 포함하는 결과를 얻기 위해  `fetchResults()` 사용

```java
@Test
public void paging() {
  QueryResults<Member> queryResults = queryFactory
    .selectFrom(member)
    .orderBy(member.username.desc())
    .offset(1)
    .limit(2)
    .fetchResults();
  
  assertThat(queryResults.getTotal()).isEqualTo(4);
  assertThat(queryResults.getLimit()).isEqualTo(2);
  assertThat(queryResults.getOffset()).isEqualTo(1);
  assertThat(queryResults.getResults().size()).isEqualTo(2);
}
```

> **fetchResults 주의**
>
> * count 쿼리가 실행되니 성능상 주의해야 한다
>
> 실무에서 페이징 쿼리를 작성할 때, 데이터를 조회하는 쿼리는 여러 테이블을 조인해야 하지만, count 쿼리는 조인이 필요 없는 경우도 있다. 그런데 이렇게 자동화된 count 쿼리는 원본 쿼리와 같이 모두 조인을 해버리기 때문에 성능이 안나올 수 있다. count 쿼리에 조인이 필요없는 성능 최적화가 필요하다면, count 전용 쿼리를 별도로 작성해야 한다.

# 8 집합

* JPQL이 제공하는 모든 집합 함수를 제공한다.

```java
@Test
public void aggregation() throws Exception {
  List<Tuple> result = queryFactory
    .select(member.count(),
            member.age.sum(),
            member.age.avg(),
            member.age.max(),
            member.age.min())
    .from(member)
    .fetch();
  
  Tuple tuple = result.get(0);
  assertThat(tuple.get(member.count())).isEqualTo(4);
  assertThat(tuple.get(member.age.sum())).isEqualTo(100);
  assertThat(tuple.get(member.age.avg())).isEqualTo(25);
  assertThat(tuple.get(member.age.max())).isEqualTo(40);
  assertThat(tuple.get(member.age.min())).isEqualTo(10);
}
```

```java
/**
 * 팀의 이름과 각 팀의 평균 연령을 구하라
 * @throws Exception
 */
@Test
public void group() throws Exception {
  List<Tuple> result = queryFactory
    .select(team.name, member.age.avg())
    .from(member)
    .join(member.team, team)
    .groupBy(team.name)
    .fetch();

  Tuple teamA = result.get(0);
  Tuple teamB = result.get(1);

  assertThat(teamA.get(team.name)).isEqualTo("teamA");
  assertThat(teamA.get(member.age.avg())).isEqualTo(15);
  assertThat(teamB.get(team.name)).isEqualTo("teamB");
  assertThat(teamB.get(member.age.avg())).isEqualTo(35);
}
```



# 9 조인

* 첫 번째 파라미터에 조인 대상을 지정하고, 두 번째 파라미터에 별칭(alias)으로 사용할 Q 타입을 지정하면 된다.
* join() , innerJoin() : 내부 조인(inner join) 
* leftJoin() : left 외부 조인(left outer join) 
* rightJoin() : rigth 외부 조인(rigth outer join)

**기본 조인**

```java
@Test
public void join() throws Exception {
  QMember member = QMember.member;
  QTeam team = QTeam.team;
  
  List<Member> result = queryFactory
    .selectFrom(member)
    .join(member.team, team)
    .where(team.name.eq("teamA"))
    .fetch();
  
  assertThat(result)
    .extracting("username")
    .containsExactly("member1", "member2");
}
```

**세타 조인**

* from 절에 여러 엔티티를 선택해서 세타 조인
* 외부 조인 불가능
  * 조인 on을 사용하면 외부 조인 가능

```java
@Test
public void theta_join() throws Exception {
  em.persist(new Member("teamA"));
  em.persist(new Member("teamB"));
  
  List<Member> result = queryFactory
    .select(member)
    .from(member, team)
    .where(member.username.eq(team.name))
    .fetch();
  
  assertThat(result)
    .extracting("username")
    .containsExactly("teamA", "teamB");
}
```



# 10 조인 - on절

* ON절을 활용한 조인
  1. 조인 대상 필터링
  2. 연관관계 없는 엔티티 외부 조인

**조인 대상 필터링**

* 회원과 팀을 조인하면서, 팀 이름이 teamA인 팀만 조인, 회원은 모두 조회

```java
// JPQL: SELECT m, t FROM Member m LEFT JOIN m.team t on t.name = 'teamA'
// SQL: SELECT m.*, t.* FROM Member m LEFT JOIN Team t ON m.TEAM_ID=t.id and t.name='teamA'
@Test
public void join_on_filtering() throws Exception {
  List<Tuple> result = queryFactory
    .select(member, team)
    .from(member)
    .leftJoin(member.team, team).on(team.name.eq("teamA"))
    .fetch();
  for (Tuple tuple : result) {
    System.out.println("tuple = " + tuple);
  } 
}
```

결과

```
t=[Member(id=3, username=member1, age=10), Team(id=1, name=teamA)]
t=[Member(id=4, username=member2, age=20), Team(id=1, name=teamA)]
t=[Member(id=5, username=member3, age=30), null]
t=[Member(id=6, username=member4, age=40), null]
```

> on 절을 활용해 조인 대상을 필터링 할 때, 외부조인이 아니라 내부조인(inner join)을 사용하면, where 절에서 필터링 하는 것과 기능이 동일하다. 따라서 on 절을 활용한 조인 대상 필터링을 사용할 때, 내부조인 이면 익숙한 where 절로 해결하고, 정말 외부조인이 필요한 경우에만 이 기능을 사용하자.



**연관관계 없는 엔티티 외부 조인**

* 회원의 이름과 팀의 이름이 같은 대상 **외부 조인**
* 하이버네이트 5.1부터 on 을 사용해서 서로 관계가 없는 필드로 외부 조인하는 기능이 추가되었다. 물론 내부 조인도 가능하다.
* 주의! 문법을 잘 봐야 한다. **leftJoin()** 부분에 일반 조인과 다르게 엔티티 하나만 들어간다.
  * 일반조인: leftJoin(member.team, team) 
  * on조인: from(member).leftJoin(team).on(xxx)

```java
// JPQL: SELECT m, t FROM Member m LEFT JOIN Team t on m.username = t.name
// SQL: SELECT m.*, t.* FROM Member m LEFT JOIN Team t ON m.username = t.name

@Test
public void join_on_no_relation() throws Exception {
  em.persist(new Member("teamA"));
  em.persist(new Member("teamB"));
  
  List<Tuple> result = queryFactory
    .select(member, team)
    .from(member)
    .leftJoin(team).on(member.username.eq(team.name))
    .fetch();
  
  for (Tuple tuple : result) {
    System.out.println("t=" + tuple);
  } 
}
```

결과

```
t=[Member(id=3, username=member1, age=10), null]
t=[Member(id=4, username=member2, age=20), null]
t=[Member(id=5, username=member3, age=30), null]
t=[Member(id=6, username=member4, age=40), null]

t=[Member(id=7, username=teamA, age=0), Team(id=1, name=teamA)]
t=[Member(id=8, username=teamB, age=0), Team(id=2, name=teamB)]
```



# 11 페치 조인

* 페치 조인은 SQL에서 제공하는 기능은 아니다. 
* SQL조인을 활용해서 연관된 엔티티를 SQL 한번에 조회하는 기능이다. 
* 주로 성능 최적화에 사용하는 방법이다.
* `join()`, `leftJoin()` 등 조인 기능 뒤에 `fetchJoin()`을 추가한다.

**페치 조인 미적용**

* entityManagerFactory로 `PersistenceUnitUtil` 을 얻어 프록시 인스턴스의 초기화 여부를 확인할 수 있다

```java
@Test
void fetchJoinNo() {
  // given
  entityManager.flush();
  entityManager.clear();

  // when
  Member findMember = queryFactory
    .selectFrom(member)
    .where(member.username.eq("member1"))
    .fetchOne();

  // then
  boolean loaded = entityManagerFactory.getPersistenceUnitUtil().isLoaded(findMember.getTeam());
  assertThat(loaded).as("페치 조인 미적용").isFalse();
}
```

**페치 조인 적용**

```java
@Test
public void fetchJoinUse() throws Exception {
  // given
  entityManager.flush();
  entityManager.clear();

  // when
  Member findMember = queryFactory
    .selectFrom(member)
    .where(member.username.eq("member1"))
    .join(member.team, team).fetchJoin()
    .fetchOne();

  // then
  boolean loaded = entityManagerFactory.getPersistenceUnitUtil().isLoaded(findMember.getTeam());
  assertThat(loaded).as("페치 조인 적용").isTrue();
}
```



# 12 서브 쿼리

* `com.querydsl.jpa.JPAExpressions`를 사용한다

**가장 나이가 많은 멤버 조회**

```java
@Test
public void subQuery() throws Exception {
  QMember memberSub = new QMember("memberSub");
  
  List<Member> result = queryFactory
    .selectFrom(member)
    .where(member.age.eq(
      JPAExpressions
      .select(memberSub.age.max())
      .from(memberSub)
    )) .fetch();
  
  assertThat(result).extracting("age")
    .containsExactly(40);
}
```

**나이가 평균 이상인 멤버 조회**

```java
@Test
public void subQueryGoe() throws Exception {
  QMember memberSub = new QMember("memberSub");
  
  List<Member> result = queryFactory
    .selectFrom(member)
    .where(member.age.goe(
      JPAExpressions
      .select(memberSub.age.avg())
      .from(memberSub)
    )) .fetch();
  
  assertThat(result).extracting("age")
    .containsExactly(30,40);
}
```

```java
@Test
public void subQueryIn() throws Exception {
  QMember memberSub = new QMember("memberSub");
  
  List<Member> result = queryFactory
    .selectFrom(member)
    .where(member.age.in(
      JPAExpressions
      .select(memberSub.age)
      .from(memberSub)
      .where(memberSub.age.gt(10))
    )) .fetch();
  
  assertThat(result).extracting("age")
    .containsExactly(20, 30, 40);
}
```

**select 절에 subquery**

```java
@Test
public void subQuery() throws Exception {
  List<Tuple> fetch = queryFactory
    .select(member.username,
            JPAExpressions
            .select(memberSub.age.avg())
            .from(memberSub)
           ).from(member)
    .fetch();
  
  for (Tuple tuple : fetch) {
    System.out.println("username = " + tuple.get(member.username));
    System.out.println("age = " + tuple.get(JPAExpressions.select(memberSub.age.avg()).from(memberSub)));
}

```

**static import 활용**

```java
import static com.querydsl.jpa.JPAExpressions.select;

List<Member> result = queryFactory
  .selectFrom(member)
  .where(member.age.eq(
    select(memberSub.age.max())
    .from(memberSub)
  )) .fetch();
```



## 12. 서브쿼리 한계

**from 절의 서브쿼리 한계**

* JPA JPQL 서브쿼리의 한계점으로 from 절의 서브쿼리(인라인 뷰)는 지원하지 않는다. 
* 당연히 Querydsl 도 지원하지 않는다. 
* 하이버네이트 구현체를 사용하면 select 절의 서브쿼리는 지원한다. 
* Querydsl도 하이버네이트 구현체를 사용하면 select 절의 서브쿼리를 지원한다.

**from 절의 서브쿼리 해결방안**

1. 서브쿼리를 join으로 변경한다. (가능한 상황도 있고, 불가능한 상황도 있다.)
2. 애플리케이션에서 쿼리를 2번 분리해서 실행한다.
3. nativeSQL을 사용한다.



# 13 Case 문

* select, 조건절(where), order by에서 사용 가능
* Case 기능을 정말 써야할까?
  * 가급적 이런 계산 문제는 DB에서 하지말고 애플리케이션에서 수행하자


**단순한 조건**

```java
List<String> result = queryFactory
  .select(member.age
          .when(10).then("열살")
          .when(20).then("스무살") 
          .otherwise("기타"))
  .from(member)
  .fetch();
```

**복잡한 조건**

```java
List<String> result = queryFactory
             .select(new CaseBuilder()
									.when(member.age.between(0, 20)).then("0~20살")
                  .when(member.age.between(21, 30)).then("21~30살")
                  .otherwise("기타"))
             .from(member)
             .fetch();
```

```java
NumberExpression<Integer> rankPath = new CaseBuilder()
  .when(member.age.between(0, 20)).then(2)
  .when(member.age.between(21, 30)).then(1)
  .otherwise(3);

List<Tuple> result = queryFactory
  .select(member.username, member.age, rankPath)
  .from(member)
  .orderBy(rankPath.desc())
  .fetch();

for (Tuple tuple : result) {
  String username = tuple.get(member.username);
  Integer age = tuple.get(member.age);
  Integer rank = tuple.get(rankPath);
  System.out.println("username = " + username + " age = " + age + " rank = " + rank);
}
```

결과

```
username = member4 age = 40 rank = 3
username = member1 age = 10 rank = 2
username = member2 age = 20 rank = 2
username = member3 age = 30 rank = 1
```



# 14 상수, 문자 더하기

* 상수가 필요하면 Expressions.constant(xxx) 사용

```java
Tuple result = queryFactory
  .select(member.username, Expressions.constant("A"))
  .from(member)
  .fetchFirst();
```



**문자 더하기**

* member.age.stringValue() 부분이 중요한데, 문자가 아닌 다른 타입들은 stringValue() 로문자로 변환할 수 있다. 
* 이 방법은 ENUM을 처리할 때도 자주 사용한다.

```java
String result = queryFactory
  .select(member.username.concat("_").concat(member.age.stringValue()))
  .from(member)
  .where(member.username.eq("member1"))
  .fetchOne();
```
