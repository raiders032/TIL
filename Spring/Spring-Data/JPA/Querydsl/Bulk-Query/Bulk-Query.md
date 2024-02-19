# 1 수정, 삭제 벌크 연산

**쿼리 한번으로 대량 데이터 수정**

* 반환 값 `count`는 영향을 받은 로우의 수

```java
long count = queryFactory
  .update(member)
  .set(member.username, "비회원") 
  .where(member.age.lt(28))
  .execute();
```

**기존 숫자에** **1** **더하기**

```java
long count = queryFactory
  .update(member)
  .set(member.age, member.age.add(1))
  .execute();
```

**쿼리 한번으로 대량 데이터 삭제**

```
long count = queryFactory
  .delete(member)
  .where(member.age.gt(18))
  .execute();
```

> JPQL 배치와 마찬가지로, 영속성 컨텍스트에 있는 엔티티를 무시하고 실행되기 때문에 배치 쿼리를 실행하고 나면 영속성 컨텍스트를 초기화 하는 것이 안전하다.