# 프로젝션과 결과 DTO로 반환

* 프로젝션과 결과 DTO로 반환하는 4가지 방식이있다
  * 프로퍼티 접근
  * 필드 직접 접근
  * 생성자 사용
  * @QueryProjection 사용



## 순수 JPA에서 DTO 조회

* 먼저 순수 JPA에서 DTO 조회 방식을 알아보자
* 순수 JPA에서 DTO를 조회할 때는 new 명령어를 사용하며 패키지명까지 다 적어야하는 불편함이 있다.
* 생성자 방식만 지원한다.

```java
@Data
public class MemberDto {
    private String username;
    private int age;

    public MemberDto() {
    }

    public MemberDto(String username, int age) {
        this.username = username;
        this.age = age;
    }
}
```

```java
    List<MemberDto> result = em.createQuery(
            "select new study.querydsl.dto.MemberDto(m.username, m.age) "
      		+ "from Member m", MemberDto.class).getResultList();
```



## 프로퍼티 접근

* 기본 생성자와 Setter가 필요하다
* 기본 생성자로 객체 생성 후 Setter로 데이터를 넣어준다.

```java
List<MemberDto> result = queryFactory
  .select(Projections.bean(MemberDto.class, member.username, member.age))
  .from(member)
  .fetch();
```



## 필드 직접 접근

* Setter가 필요하지 않다

```java
List<MemberDto> result = queryFactory
  .select(Projections.fields(MemberDto.class, member.username, member.age))
  .from(member)
  .fetch();
```



## 별칭이 다른 경우 해결법

* 프로퍼티나, 필드 접근 생성 방식에서 이름이 다를 때 해결 방안
  * 별칭을 적용해서 이름을 같게 만든다 아래 2가지 방법이 있다.
* ExpressionUtils.as(source,alias) : 필드나, 서브 쿼리에 별칭 적용
  * 예시) `ExpressionUtils.as(JPAExpressions.select(memberSub.age.max()).from(memberSub), "age")`
* username.as("memberName") : 필드에 별칭 적용
  *  예시) `member.username.as("name")`

```java
@Data
public class UserDto {
    private String name;
    private int age;
}
```

```java
List<UserDto> fetch = queryFactory
  .select(Projections.fields(UserDto.class, 
                             member.username.as("name"), 
                             ExpressionUtils.as(
                               JPAExpressions
                               .select(memberSub.age.max())
                               .from(memberSub), "age")))
  .from(member)
  .fetch();
```



## 생성자 사용

* 파라미터 타입이 맞는 생성자를 먼저 정의해야한다.

**생성자**

```java
@Data
public class MemberDto {
    private String username;
    private int age;

    public MemberDto() {
    }

    public MemberDto(String username, int age) {
        this.username = username;
        this.age = age;
    }
}
```

**생성자 사용 DTO 반환**

```java
List<MemberDto> result = queryFactory.select(Projections.constructor(MemberDto.class, member.username, member.age))
  .from(member)
  .fetch();
```



## @QueryProjection 활용

* DTO의 생성자에  @QueryProjection을 적용한다.
* 장점
  * DTO까지 Q파일을 생성해 컴파일러로 타입을 체크할 수 있으므로 가장 안전한 방법
  * 컴파일 시점에 오류를 발견할 수 있다
* 단점
  * DTO에 QueryDSL 어노테이션을 유지해야 하는 점(의존성)
  * DTO까지 Q파일을 생성해야 하는 단점이 있다.
* 생성자 사용 방식과 차이점
  * 생성자 사용 방식은 런타임 시점에 시점에 오류를 발견할 수 있다

**DTO의 생성자에  @QueryProjection을 적용**

```java
@Data
public class MemberDto {
    private String username;
    private int age;

    public MemberDto() {
    }

    @QueryProjection
    public MemberDto(String username, int age) {
        this.username = username;
        this.age = age;
    }
}
```

**@QueryProjection 활용**

```java
List<MemberDto> result = queryFactory
  .select(new QMemberDto(member.username, member.age)).from(member)
  .fetch();
```



참조

* https://www.inflearn.com/course/Querydsl-%EC%8B%A4%EC%A0%84/dashboard