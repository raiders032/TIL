# 1 Mockito 개요

- Mockito는 Java에서 가장 널리 사용되는 mocking 프레임워크 중 하나입니다.
- Mockito를 사용하면 개발자가 손쉽게 모의 객체(mock object)를 생성하고 관리할 수 있습니다.
- 모의 객체는 실제 객체처럼 동작하지만, 그 행동을 개발자가 직접 제어할 수 있습니다.
- 이를 통해 복잡한 의존성을 가진 코드를 효과적으로 단위 테스트할 수 있습니다.

<br>

## 1.1 Mockito의 주요 기능

1. 모의 객체 생성: `mock()` 메서드나 `@Mock` 애노테이션을 통해 쉽게 모의 객체를 만들 수 있습니다.
2. Stubbing: `when()`, `given()` 등의 메서드를 사용하여 모의 객체의 행동을 미리 정의할 수 있습니다.
3. 검증: `verify()` 메서드를 통해 모의 객체의 메서드가 예상대로 호출되었는지 검증할 수 있습니다.
4. Argument Matchers: `any()`, `eq()` 등의 Argument Matcher를 사용하여 메서드 호출 시 전달된 인자를 유연하게 매칭할 수 있습니다.
5. Spying: `spy()` 메서드나 `@Spy` 애노테이션을 사용하면 실제 객체를 감싸서 특정 메서드만 stub할 수 있습니다.

<br>

# 2 Mockito 설정하기

## 2.1 의존성 추가

- 스프링 부트 2.2 이상을 사용한다면 `spring-boot-starter-test`에 Mockito 의존성이 자동으로 포함됩니다.
- 수동으로 의존성을 추가하고 싶다면 아래와 같이 pom.xml에 의존성을 명시하면 됩니다.

**Maven**

```
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <version>4.5.1</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-junit-jupiter</artifactId>
    <version>4.5.1</version>
    <scope>test</scope>
</dependency>
```

**Gradle**

```
testImplementation 'org.mockito:mockito-core:4.5.1'
testImplementation 'org.mockito:mockito-junit-jupiter:4.5.1'
```
`
<br>

## 2.2 Mockito 확장 기능 사용하기

- JUnit 5의 `@ExtendWith` 애노테이션과 `MockitoExtension` 클래스를 함께 사용하면 `@Mock`, `@InjectMock` 등의 애노테이션을 사용할 수 있습니다.

```java
@ExtendWith(MockitoExtension.class)
class MyServiceTest {

    @Mock
    private MyRepository myRepository;
    
    @InjectMocks
    private MyService myService;
    
    // ...
}
```

<br>

# 3 Mock 객체 생성하기

- Mockito를 사용하여 모의 객체를 만드는 방법은 크게 두 가지가 있습니다.

1. `mock()` 메소드 사용하기

```java
MyRepository repo = Mockito.mock(MyRepository.class);
MyService service = Mockito.mock(MyService.class);
```

2. `@Mock` 애노테이션 사용하기

```java
@ExtendWith(MockitoExtension.class)
class MyServiceTest {
    
    @Mock
    private MyRepository repo;
    
    @Mock
    private MyService service;
    
    // ...
}
```

<br>

# 4 모의 객체 Stubbing 하기

- 모의 객체가 특정 상황에서 어떻게 동작해야 할지 미리 정의하는 것을 Stubbing이라고 합니다. 
- `when()`, `given()` 등의 메서드를 사용하여 모의 객체의 동작을 정의할 수 있습니다. 예를 들어:

```java
// when 사용
when(myRepository.findById(1L)).thenReturn(Optional.of(new Entity()));

// BDDMockito의 given 사용
given(myService.doSomething()).willThrow(new RuntimeException());
```

모의 객체의 기본 행동은 다음과 같이 정의되어 있습니다.
- 리턴 타입이 참조 타입인 경우 null 리턴 (Optional의 경우 Optional.empty 리턴)
- 리턴 타입이 기본 타입(Primitive)인 경우 0, false 등의 기본값 리턴
- 리턴 타입이 컬렉션인 경우 비어있는 컬렉션 리턴
- void 메소드는 아무 일도 일어나지 않음

<br>

# 5 호출 검증하기

- `verify()` 메서드를 사용하여 모의 객체의 메소드가 예상한 대로 호출되었는지 검증할 수 있습니다.

```java
// myService.doSomething()이 정확히 한 번 호출되었는지 검증 
verify(myService, times(1)).doSomething();

// myService.doSomething()이 호출되지 않았는지 검증
verify(myService, never()).doSomething();
```

<br>

## Argument Matcher 사용하기

메소드에 전달된 인자를 검증할 때 사용하는 것이 Argument Matcher입니다. `any()`, `eq()`, `contains()` 등의 메서드를 통해 유연하게 인자를 매칭할 수 있습니다.

java

Copy code

`// name에 "java"라는 문자열이 포함되어 있으면 매치   when(myRepository.findByName(contains("java"))).thenReturn(someEntity); // 어떤 Long 타입의 인자라도 매치 when(myService.doSomething(any(Long.class))).thenReturn(someResult);`

## Mockito Annotation 알아보기

### @Mock

클래스나 인터페이스를 모의 객체로 생성합니다. JUnit 테스트에서 `@ExtendWith(MockitoExtension.class)`와 함께 사용되면 모의 객체를 필드 주입받을 수 있습니다.

### @Spy

실제 객체를 감싸서 특정 메서드만 stub하고 싶을 때 사용합니다. `@Mock`과 달리 stub되지 않은 메서드는 실제 메서드가 호출됩니다.

### @InjectMocks

`@InjectMocks`이 붙은 필드에 `@Mock` 이나 `@Spy`로 생성한 모의 객체를 주입합니다. 생성자 주입, 필드 주입, 수정자 주입을 모두 지원합니다.


관련 자료

* [Mockito, 이대로 괜찮은가?](https://tecoble.techcourse.co.kr/post/2020-10-16-is-ok-mockito/)
