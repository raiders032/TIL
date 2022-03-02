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





# 2 [@EqualsAndHashCode](https://projectlombok.org/features/EqualsAndHashCode)

* 클래스에 `@EqualsAndHashCode` 애노테이션을 적용하면 롬복이 `equals(Object other)` 와 `hashCode()`를 생성해준다
* 기본적으로 모든 non-static 필드를 이용한다
* 특정 필드를 지정하고 싶다면 @EqualsAndHashCode.Include 또는 @EqualsAndHashCode.Exclude를 필드에 사용한다



## 2.1 of

* 특정 필드 지정

```java
@EqualsAndHashCode(of = "id", callSuper=false)
public class UserAccount extends BaseTimeEntity {
    private Long id;
}
```



## 2.2 onlyExplicitlyIncluded

* 특정 필드 지정

```java
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class OpenBankingAccount extends BaseTimeEntity {
  @EqualsAndHashCode.Include
  private Long id;
  
  @EqualsAndHashCode.Include
  private String fintechUseNum;
}
```



## 2.3 callSuper

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



참고

* https://projectlombok.org/features/all
