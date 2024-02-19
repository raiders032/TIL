# 1 Lombok

## 1.1 dependency

**gradle**

```groovy
repositories {
  mavenCentral()
}

dependencies {
  compileOnly 'org.projectlombok:lombok:1.18.22'
  annotationProcessor 'org.projectlombok:lombok:1.18.22'

  testCompileOnly 'org.projectlombok:lombok:1.18.22'
  testAnnotationProcessor 'org.projectlombok:lombok:1.18.22'
}
```

<br>

# 2 Annotation

## @NonNull

* 필드와 메소드와 생성자의 파라미터에 적용할 수 있다
* 롬복이 null을 체크하는 코드를 생성해준다

<br>

**with Lombok**

```java 
import lombok.NonNull;

public class NonNullExample extends Something {
  private String name;
  
  public NonNullExample(@NonNull Person person) {
    super("Hello");
    this.name = person.getName();
  }
}
```

<br>

**Vanilla Java**
* 롬복이 파라미터의 null 체크하는 코드를 생성해준다

```java
import lombok.NonNull;

public class NonNullExample extends Something {
  private String name;
  
  public NonNullExample(@NonNull Person person) {
    super("Hello");
    if (person == null) {
      throw new NullPointerException("person is marked non-null but is null");
    }
    this.name = person.getName();
  }
}
```

<br>

## @EqualsAndHashCode

* [레퍼런스](https://projectlombok.org/features/EqualsAndHashCode)
* 클래스에 `@EqualsAndHashCode` 애노테이션을 적용하면 롬복이 `equals(Object other)` 와 `hashCode()`를 생성해준다
* 기본적으로 모든 non-static 필드를 이용한다
* 특정 필드를 지정하고 싶다면 @EqualsAndHashCode.Include 또는@EqualsAndHashCode.Exclude를 필드에 사용한다

<br>

### of

* 특정 필드 지정

```java
@EqualsAndHashCode(of = "id", callSuper=false)
public class UserAccount extends BaseTimeEntity {
    private Long id;
}
```


### onlyExplicitlyIncluded

* 특정 필드 지정

```java
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class OpenBankingAccount extends BaseTimeEntity {
  
  private Long id;
  
  @EqualsAndHashCode.Include
  private String fintechUseNum;
}
```



### callSuper

* callSuper 속성을 통해 eqauls와 hashCode 메소드 자동 생성 시 부모 클래스의 필드까지 감안할지의 여부를 설정할 수 있다.
* 기본 값 false

```java
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = true)
public class OpenBankingAccount extends BaseTimeEntity {
  @EqualsAndHashCode.Include
  private Long id;
  
  @EqualsAndHashCode.Include
  private String fintechUseNum;
}
```

<br>

## @Builder
* [레퍼런스](https://projectlombok.org/features/Builder)

### builderMethodName
* 빌더 인스턴스를 만드는 메서드의 이름을 지정
* 기본 값: `builder`

**예시**

```java
@Builder(builderMethodName = "testBuilder")
public Person(Long id, String name, Integer age) {
  log.info("builderMethodName: testBuilder");
  this.id = id;
  this.name = name;
  this.age = age;
}
```

```java
Person person1 = Person.testBuilder()
  .id(1L)
  .age(10)
  .name("홍길동")
  .build();
```


### buildMethodName

* @Builder 애노테이션이 붙은 인스턴스를 생성하는 메서드의 이름을 지정
* 기본 값: `build`

**예시**

```java
@Builder(buildMethodName="execute")
public Person(Long id, String name, Integer age) {
  log.info("builderMethodName: testBuilder");
  this.id = id;
  this.name = name;
  this.age = age;
}
```

```java
Person person1 = Person.builder()
  .id(1L)
  .age(10)
  .name("홍길동")
  .execute();
```



### builderClassName

* 빌더 클래스의 이름을 지정
* 빌더를 여러개 사용할 떄 사용하면 유용하다



**예시**

```java
@Builder
public Person(String name, Integer age) {
  this.name = name;
  this.age = age;
}

@Builder(builderClassName = "testBuilder", builderMethodName = "testBuilder")
public Person(Long id, String name, Integer age) {
  this.id = id;
  this.name = name;
  this.age = age;
}
```

```java
Person person1 = Person.testBuilder()
  .id(1L)
  .age(10)
  .name("홍길동")
  .build();

Person person2 = Person.builder()
  .name("홍길동2")
  .age(20)
  .build();
```



## @Builder.Default

- 빌드 세션에 세팅되지 않은 필드는 `0`, `null`, `false`의 값을 가진다.
- 필드의 기본값을 지정하고 싶은 경우 `@Builder.Default` 애노테이션을 필드에 적용한다.



```java
@Builder.Default
private TakeoutOrderStatus takeoutOrderStatus = TakeoutOrderStatus.NEW;
```

> 참고
>
> - https://www.baeldung.com/lombok-builder-default-value





## @ToString





참고

* https://projectlombok.org/features/all