# 1 SQL function 호출하기

* SQL function은 JPA와 같이 Dialect에 등록된 내용만 호출할 수 있다.

**member -> M으로 변경하는 replace 함수 사용**

```java
String result = queryFactory
  .select(Expressions.stringTemplate("function('replace', {0}, {1}, {2})", 
                                     member.username, "member", "M"))
  .from(member)
  .fetchFirst();
```

**소문자로 변경해서 비교해라.**

```java
String result = queryFactory
  .select(member.username)
  .from(member)
  .where(member.username.eq(Expressions.stringTemplate("function('lower', {0})", member.username)))
```

* lower 같은 ansi 표준 함수들은 querydsl이 상당부분 내장하고 있다. 따라서 다음과 같이 처리해도 결과는 같다.

```java
.where(member.username.eq(member.username.lower()))
```

