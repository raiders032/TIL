# 1 Paging

* 스프링 데이터의 Page, Pageable을 활용해보자.
* 전체 카운트를 한번에 조회하는 단순한 방법
* 데이터 내용과 전체 카운트를 별도로 조회하는 방법



**전체 카운트를 한번에 조회하는 단순한 방법**

* Querydsl이 제공하는 `fetchResults()` 를 사용하면 내용과 전체 카운트를 한번에 조회할 수 있다
* `fetchResult()`는 카운트 쿼리 실행시 필요없는 order by 는 제거한다.

```java
public Page<MemberTeamDto> searchPageSimple(MemberSearchCondition condition,
                                            Pageable pageable) {

  QueryResults<MemberTeamDto> results = queryFactory
    .select(new QMemberTeamDto(
      member.id,
      member.username,
      member.age,
      team.id,
      team.name))
    .from(member)
    .leftJoin(member.team, team)
    .where(usernameEq(condition.getUsername()),
           teamNameEq(condition.getTeamName()),
           ageGoe(condition.getAgeGoe()),
           ageLoe(condition.getAgeLoe()))
    .offset(pageable.getOffset())
    .limit(pageable.getPageSize())
    .fetchResults();
  List<MemberTeamDto> content = results.getResults();
  long total = results.getTotal();
  return new PageImpl<>(content, pageable, total);
}
```



**데이터 내용과 전체 카운트를 별도로 조회하는 방법**

* 전체 카운트를 조회 하는 방법을 최적화 할 수 있으면 이렇게 분리하면 된다
* 코드를 리펙토링해서 내용 쿼리과 전체 카운트 쿼리를 읽기 좋게 분리하면 좋다.

```java
@Override
public Page<MemberTeamDto> searchPageComplex(MemberSearchCondition condition,
                                             Pageable pageable) {
  List<MemberTeamDto> content = queryFactory
    .select(new QMemberTeamDto(
      member.id,
      member.username,
      member.age,
      team.id,
      team.name))
    .from(member)
    .leftJoin(member.team, team)
    .where(usernameEq(condition.getUsername()),
           teamNameEq(condition.getTeamName()),
           ageGoe(condition.getAgeGoe()),
           ageLoe(condition.getAgeLoe()))
    .offset(pageable.getOffset())
    .limit(pageable.getPageSize())
    .fetch();

  long total = queryFactory
    .select(member)
    .from(member)
    .leftJoin(member.team, team)
    .where(usernameEq(condition.getUsername()),
           teamNameEq(condition.getTeamName()),
           ageGoe(condition.getAgeGoe()),
           ageLoe(condition.getAgeLoe()))
    .fetchCount();
  
  return new PageImpl<>(content, pageable, total);
}

```



**PageableExecutionUtils.getPage()**

* count 쿼리가 생략 가능한 경우 생략해서 처리
  * 페이지 시작이면서 컨텐츠 사이즈가 페이지 사이즈보다 작을 때
  * 마지막 페이지 일 때 (offset + 컨텐츠 사이즈를 더해서 전체 사이즈 구함)

```java
JPAQuery<Member> countQuery = queryFactory
  .select(member)
  .from(member)
  .leftJoin(member.team, team)
  .where(usernameEq(condition.getUsername()),
         teamNameEq(condition.getTeamName()),
         ageGoe(condition.getAgeGoe()),
         ageLoe(condition.getAgeLoe()));

return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchCount);
```



# 2 Sort

- 스프링 데이터 JPA는 자신의 정렬(Sort)을 Querydsl의 정렬(OrderSpecifier)로 편리하게 변경하는 기능을 제공한다.



**스프링 데이터 Sort를 Querydsl의 OrderSpecifier로 변환하는 예시**

```java
JPAQuery<Member> query = queryFactory.selectFrom(member);

for (Sort.Order o : pageable.getSort()) {
  PathBuilder pathBuilder = new PathBuilder(member.getType(), member.getMetadata());
  query.orderBy(new OrderSpecifier(o.isAscending() ? Order.ASC : Order.DESC, pathBuilder.get(o.getProperty())));
  List<Member> result = query.fetch();
}
```

- 정렬( Sort )은 조건이 조금만 복잡해져도 Pageable 의 Sort 기능을 사용하기 어렵다. 
- 루트 엔티티 범위를 넘어가는 동적 정렬 기능이 필요하면 스프링 데이터 페이징이 제공하는 Sort 를 사용하기 보다는 파라미터를 받아서 직접 처리하는 것을 권장한다.
  - 조인이 들어가는 경우
