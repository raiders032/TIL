# 1 Dynamic Query

* 동적 쿼리를 해결하는 두가지 방식이 있다.
  * BooleanBuilder 
  * Where 다중 파라미터 사용

# 2 BooleanBuilder

```java
@Test
public void 동적쿼리_BooleanBuilder() throws Exception {
  String usernameParam = "member1";
  Integer ageParam = 10;
  
  List<Member> result = searchMember1(usernameParam, ageParam);
  Assertions.assertThat(result.size()).isEqualTo(1);
}

private List<Member> searchMember1(String usernameCond, Integer ageCond) {
  BooleanBuilder builder = new BooleanBuilder();
  
  if (usernameCond != null) {
    builder.and(member.username.eq(usernameCond));
  }
  
  if (ageCond != null) {
    builder.and(member.age.eq(ageCond));
  }
  
  return queryFactory
    .selectFrom(member)
    .where(builder)
    .fetch();
}
```

```java
public List<MemberTeamDto> searchByBuilder(MemberSearchCondition condition) {
  BooleanBuilder builder = new BooleanBuilder();
  
  if (hasText(condition.getUsername())) {
    builder.and(member.username.eq(condition.getUsername()));
  }
  
  if (hasText(condition.getTeamName())) {
    builder.and(team.name.eq(condition.getTeamName()));
  }
  
  if (condition.getAgeGoe() != null) {
    builder.and(member.age.goe(condition.getAgeGoe()));
  }
  
  if (condition.getAgeLoe() != null) {
    builder.and(member.age.loe(condition.getAgeLoe()));
  }
  
  return queryFactory
    .select(new QMemberTeamDto(
      member.id,
      member.username,
      member.age,
      team.id,
      team.name))
    .from(member)
    .leftJoin(member.team, team)
    .where(builder)
    .fetch();
}
```



# 3 Where 다중 파라미터 사용

* where 조건에 null 값은 무시된다. 
* 메서드를 다른 쿼리에서도 재활용 할 수 있다. 
* 쿼리 자체의 가독성이 높아진다.

```java
@Test
public void 동적쿼리_WhereParam() throws Exception { 
  String usernameParam = "member1";
  Integer ageParam = 10;
  List<Member> result = searchMember2(usernameParam, ageParam);                                                    	 Assertions.assertThat(result.size()).isEqualTo(1);
}

private List<Member> searchMember2(String usernameCond, Integer ageCond) {
  return queryFactory
    .selectFrom(member)
    .where(usernameEq(usernameCond), ageEq(ageCond))
    .fetch();
}

private BooleanExpression usernameEq(String usernameCond) {
  return usernameCond != null ? member.username.eq(usernameCond) : null;
}

private BooleanExpression ageEq(Integer ageCond) {
  return ageCond != null ? member.age.eq(ageCond) : null;
}
```

```java
public List<MemberTeamDto> search(MemberSearchCondition condition) {
  return queryFactory
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
    .fetch();
}

private BooleanExpression usernameEq(String username) {
    return isEmpty(username) ? null : member.username.eq(username);
}

private BooleanExpression teamNameEq(String teamName) {
    return isEmpty(teamName) ? null : team.name.eq(teamName);
}

private BooleanExpression ageGoe(Integer ageGoe) {
    return ageGoe == null ? null : member.age.goe(ageGoe);
}

private BooleanExpression ageLoe(Integer ageLoe) {
    return ageLoe == null ? null : member.age.loe(ageLoe);
}
```

