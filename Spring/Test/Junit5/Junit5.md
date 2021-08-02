### Junit



# 1. JUnit5 소개

* 자바 개발자가 가장 많이 사용하는 테스팅 프레임워크.
* 자바8 이상을 필요로함.
* 대체제: TestNG, Spock, ...

![image-20201007141433847](/Users/YT/GoogleDrive/dev/TIL/images/image-20201007141433847.png)

* JUnit 5 = JUnit Platform + JUnit Jupiter + JUnit Vintage
* JUnit Platform: 테스트를 실행해주는 런처 제공. TestEngine API 제공. 
* Jupiter: TestEngine API 구현체로 JUnit 5를 제공.
* Vintage: JUnit 4와 3을 지원하는 TestEngine 구현체.



## 1.2 Junit5 시작하기

2.2버전 이상의 스프링 부트 프로젝트를 만든다면 기본으로 JUnit 5 의존성 추가 됨.

```xml
<dependency> 
  <groupId>org.junit.jupiter</groupId> 
  <artifactId>junit-jupiter-engine</artifactId> 
  <version>5.5.2</version> 
  <scope>test</scope>
</dependency>
```



# 2. Tests

## 2.1 [애노테이션](https://junit.org/junit5/docs/current/user-guide/#writing-tests-annotations)

**@Test**

- 메서드가 테스트 메서드임을 나타냅니다. 
- JUNIT 4의 `@Test` 주석과는 달리, JUNIT Jupiter의 테스트 확장은 자체 전용 주석을 기반으로 작동하기 때문에 이 주석에는 어떠한 attribute도 선언하지 않습니다.
- Junit5부터는 `public`이 아니여도 된다.
  - 리플렉션을 사용하기 때문에

**@BeforeAll / @AfterAll**

- `@BeforeAll` 주석이 달린 메서드가 모든`@Test`, `@RepeatedTest`, `@ParameterizedTest`, `@TestFactory` 보다 먼저 실행되어야 함을 나타냄
- JUNit 4의 `@BeforeClass`와 유사합니다.
- `static` 이어야 합니다.

```java
@AfterAll
static void afterAll(){
	...
}
```

**@BeforeEach / @AfterEach**

- `@BeforeEach`주석이 달린 메서드가 각 `@Test`, `@RepeatedTest`, `@ParameterizedTest`, `@TestFactory` 전에 실행되어야 함을 나타냅니다.
- JUNit 4의 `@Before`와 유사합니다.

```java
@AfterEach
void afterEach(){
	...
}
```

**@Disabled**

- 테스트 클래스 또는 테스트 메서드를 비활성화하는 데 사용됩니다. 
- JUNIT 4의 `@Ignore`와 유사하다 

```java
@Disabled
@Test
void test(){
	...
}	
```

**@DisplayNameGeneration**

* Method와 Class 레퍼런스를 사용해서 테스트 이름을 표기하는 방법 설정.
* 기본 구현체로 ReplaceUnderscores 제공

**@DisplayName**

* 어떤 테스트인지 테스트 이름을 보다 쉽게 표현할 수 있는 방법을 제공하는 애노테이션.
* @DisplayNameGeneration 보다 우선 순위가 높다.

```java
@DisplayName("메뉴 추가")
@Test
void createMenu() throws Exception {
	...
}
```



## 2.2 [Assertions](https://junit.org/junit5/docs/current/user-guide/#writing-tests-assertions)

* org.junit.jupiter.api.Assertions.*
* AssertJ, Hemcrest, Truth 등의 Third-party Assertion 라이브러리를 사용할 수도 있다.

* assertEqulas(expected, actual)
  * 실제 값이 기대한 값과 같은지 확인
* assertNotNull(actual)
  * 값이 null이 아닌지 확인
* assertTrue(boolean)
  * 다음 조건이 참(true)인지 확인
* assertAll(executables...)
  * 모든 확인 구문 확인
* assertThrows(expectedType, executable)
  * 예외 발생 확인
* assertTimeout(duration, executable)
  * 특정 시간 안에 실행이 완료되는지 확인



## 2.3 [JUnit5 테스트 순서](https://junit.org/junit5/docs/current/user-guide/#writing-tests-test-execution-order)

* 테스트의 순서는 항상 일정하지 않다.
* 순서대로 테스트를 실행하고 싶은 경우
  * `@TestMethodOrder`를 사용해 테스트 메소드의 순서를 정할 수 있다. 
  * `@TestInstance(Lifecycle.PER_CLASS)`와 함께 사용하여 유즈 케이스나 시나리오 테스트를 하는데 용이하다.



## 2.4 [JUnit 5 테스트 인스턴스](https://junit.org/junit5/docs/current/user-guide/#writing-tests-test-instance-lifecycle)

> 개별 테스트 방법이 분리되어 실행될 수 있도록 허용하고 테스트 인스턴스 상태로 인한 예기치 않은 부작용을 방지하기 위해 JUnit은 각 테스트 클래스의 새 인스턴스를 만든 후 각 테스트 메서드를 실행합니다.

**@TestInstance(Lifecycle.PER_CLASS)**

* 테스트 클래스당 인스턴스를 하나만 만들어 사용한다.

* 경우에 따라, 테스트 간에 공유하는 모든 상태를 @BeforeEach 또는 @AfterEach에서

  초기화 할 필요가 있다.

* @BeforeAll과 @AfterAll을 인스턴스 메소드 또는 인터페이스에 정의한 default 메소드로 정의할 수도 있다.

* ![image-20201009172319250](/Users/YT/GoogleDrive/dev/TIL/images/image-20201009172319250.png)

# 3. [JUnit4 -> JUnit5 마이그레이션](https://junit.org/junit5/docs/current/user-guide/#migrating-from-junit4)

* junit-vintage-engine을 의존성으로 추가하면, JUnit 5의 junit-platform으로 JUnit 3과 4로 작성된 테스트를 실행할 수 있다.
* 스프링 부트 버전을 2.2.X대로 올린다. 
* 더 이상 @RunWith을 쓰지 않는다.

| JUnit 4                                    | JUnit 5                                        |
| ------------------------------------------ | ---------------------------------------------- |
| @Category(Class)                           | @Tag(String)                                   |
| @RunWith, @Rule, @ClassRule                | @ExtendWith, @RegisterExtension                |
| @Ignore                                    | @Disabled                                      |
| @Before, @After, @BeforeClass, @AfterClass | @BeforeEach, @AfterEach, @BeforeAll, @AfterAll |

# 4. [Extension Model](https://junit.org/junit5/docs/current/user-guide/#extensions)

* JUnit 4의 확장 모델은 @RunWith(Runner), TestRule, MethodRule.
* JUnit 5의 확장 모델은 단 하나, Extension.
* 확장 모델 등록 방법
  1. 선언적인 등록 `@ExtendWith`
  2. 프로그래밍 등록 `@RegisterExtension`
  3. 자동 등록 자바 `ServiceLoader` 이용
