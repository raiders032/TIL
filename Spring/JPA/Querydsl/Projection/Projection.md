# 1 프로젝션

* 프로젝션: select 대상을 지정하는 것



## 1.1 프로젝션 대상이 하나

* 프로젝션 대상이 하나면 타입을 명확하게 지정할 수 있음 
* 프로젝션 대상이 둘 이상이면 튜플이나 DTO로 조회

```
List<String> result = queryFactory
.select(member.username)
.from(member)
.fetch();
```



## 1.2 프로젝션 대상이 둘 이상

* 튜플로 조회하거나 DTO로 조회하는 방법이 있다



# 2 튜플 조회

* 프로젝션 대상이 둘 이상일 때 사용

```java
List<Tuple> result = queryFactory
  .select(member.username, member.age)
  .from(member)
  .fetch();

for (Tuple tuple : result) {
  String username = tuple.get(member.username);
  Integer age = tuple.get(member.age);
  System.out.println("username=" + username);
  System.out.println("age=" + age);
}
```



# 2 DTO 조회

* 결과를 DTO로 반환할 때 3가지 방법이 있다.
  * 프로퍼티 접근
  * 필드 직접 접근
  * 생성자 사용



## 2.1 프로퍼티 접근 - Setter

```java
  List<MemberDto> result = queryFactory
          .select(Projections.bean(MemberDto.class,
                  member.username,
                  member.age))
          .from(member)
          .fetch();
```



## 2.2 필드 직접 접근

```java
  List<MemberDto> result = queryFactory
          .select(Projections.fields(MemberDto.class,
                  member.username,
                  member.age))
          .from(member)
          .fetch();
```

**프로퍼티나, 필드 접근 생성 방식에서 이름이 다를 때 해결 방안**

* `ExpressionUtils.as(source, alias)` : 필드나, 서브 쿼리에 별칭 적용 
* `username.as("memberName")` : 필드에 별칭 적용

```java
List<UserDto> fetch = queryFactory
  .select(Projections.fields(UserDto.class,
                             member.username.as("name"),
                             ExpressionUtils.as(
                               JPAExpressions
                               .select(memberSub.age.max())
                               .from(memberSub), "age")
                            )
         ).from(member)
  .fetch();
```



## 2.3 생성자 사용

```java
List<MemberDto> result = queryFactory
  .select(Projections.constructor(MemberDto.class, member.username, member.age))
  .from(member)
  .fetch();
}
```



## 2.4 생성자 사용 + @QueryProjection

* DTO 생성자에 @QueryProjection을 적용한다.
* ./gradlew compileQuerydsl 실행
  * QMemberDto가 생성될 것
* 컴파일러로 타입을 체크할 수 있으므로 가장 안전한 방법이다.
* DTO에 QueryDSL 어노테이션을 유지해야 하는 점과 DTO까지 Q 파일을 생성해야 하는 단점이 있다.

**적용 하기**

```java
import com.querydsl.core.annotations.QueryProjection;
import lombok.Data;

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

**사용 하기**

```java
List<MemberDto> result = queryFactory
  .select(new QMemberDto(member.username, member.age))
  .from(member)
  .fetch()
```