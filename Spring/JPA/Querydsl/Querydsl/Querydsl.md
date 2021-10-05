# 1 Querydsl

* Querydsl은 JPQL 빌더
* JPQL과 달리 컴파일 시점에 오류를 확인할 수 있다
* JPQL은 파라미터 바인딩을 직접 하지만 Querydsl은 파라미터 바인딩 자동으로 처리해준다

# 2 기본 문법

* `EntityManager` 로 `JPAQueryFactory` 생성

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

**Q클래스 인스턴스를 사용하는 2가지 방법**

* 같은 테이블을 조인하는 경우가 아니라면 **기본 인스턴스를 사용하자**

```java
QMember qMember = new QMember("m"); //별칭 직접 지정 
QMember qMember = QMember.member; //기본 인스턴스 사용
```

**기본 인스턴스를 static import와 함께 사용**

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

* 검색조건은 `.and()`,`.or()`를 메서드 체인으로 연결할 수 있다.

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

* where() 에 파라미터로 검색조건을 추가하면 AND 조건이 추가됨
* 이경우 null 값은 무시 
  * 메서드 추출을 활용해서 동적 쿼리를 깔끔하게 만들 수 있음



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

* limit(1).fetchOne()

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
}
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

* `join()`, `leftJoin()` 등 조인 기능 뒤에 `fetchJoin()`을 추가한다 

```java
@Test
public void fetchJoinUse() throws Exception {
  em.flush();
  em.clear();
  
  Member findMember = queryFactory
    .selectFrom(member)
    .join(member.team, team).fetchJoin()
    .where(member.username.eq("member1"))
    .fetchOne();
  
  boolean loaded = emf.getPersistenceUnitUtil().isLoaded(findMember.getTeam());
  assertThat(loaded).as("페치 조인 적용").isTrue(); 
}
```



# 12 서브 쿼리

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

**from 절의 서브쿼리 한계**

JPA JPQL 서브쿼리의 한계점으로 from 절의 서브쿼리(인라인 뷰)는 지원하지 않는다. 당연히 Querydsl 도 지원하지 않는다. 하이버네이트 구현체를 사용하면 select 절의 서브쿼리는 지원한다. Querydsl도 하이버네이트 구현체를 사용하면 select 절의 서브쿼리를 지원한다.

**from 절의 서브쿼리 해결방안**

1. 서브쿼리를 join으로 변경한다. (가능한 상황도 있고, 불가능한 상황도 있다.)
2. 애플리케이션에서 쿼리를 2번 분리해서 실행한다.
3. nativeSQL을 사용한다.



# 13 Case 문

* select, 조건절(where), order by에서 사용 가능

```java
List<String> result = queryFactory
  .select(member.age
          .when(10).then("열살")
          .when(20).then("스무살") 
          .otherwise("기타"))
  .from(member)
  .fetch();
```

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
