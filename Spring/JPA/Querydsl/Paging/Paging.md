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

