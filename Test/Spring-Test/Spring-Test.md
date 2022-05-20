

# 1 Spring Boot Test

* 스프링 부트는 테스트의 중요성을 알고 테스트에 필요한 여러 도구를 쉽게 사용할 수있도록 스타터를 제공한다



## 1.1 의존성 추가

```groovy
testImplementation 'org.springframework.boot:spring-boot-starter-test'
```

* 스프링 부트 스타터를 추가하면 아래와 같은 테스트 라이브러리가 자동으로 추가된다
  * Spring Boot Test
  * JsonPath
  * JUnit5
  * AssertJ
  * Mockito
  * JSONassert
  * Spring Test



# 2 Test Annotation



* 



**등록 되는 빈**

* `@Controller`, `@ControllerAdvice`
* `@JsonComponent`
*  `Converter`/`GenericConverter`
*  `Filter`
* `WebMvcConfigurer`
*  `HandlerMethodArgumentResolver` 

**등록되지 않는 빈**

* `@Component`
*  `@Service`
*  `@Repository`

> #### Use `@WebMvcTest` with or without the `controllers` parameter?
>
> By setting the `controllers` parameter to `RegisterRestController.class` in the example above, we're telling Spring Boot to restrict the application context created for this test to the given controller bean and some framework beans needed for Spring Web MVC. All other beans we might need have to be included separately or mocked away with `@MockBean`.
>
> If we leave away the `controllers` parameter, Spring Boot will include *all* controllers in the application context. Thus, we need to include or mock away *all* beans any controller depends on. This makes for a much more complex test setup with more dependencies, but saves runtime since all controller tests will re-use the same application context.
>
> I tend to restrict the controller tests to the narrowest application context possible in order to make the tests independent of beans that I don't even need in my test, even though Spring Boot has to create a new application context for each single test.

> 참고
>
> * [Testing MVC Web Controllers with Spring Boot and @WebMvcTest](https://reflectoring.io/spring-boot-web-controller-test/)





## [@MockBean](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/mock/mockito/MockBean.html)

* `org.springframework.boot.test.mock.mockito.MockBean`
* Mock Bean은 같은 타입의 Bean을 대체하여 Spring ApplicationContext에 추가된다.
  * 같은 타입이 없다면 새로운 타입으로 Spring ApplicationContext에 추가된다.
* Mock Bean은 기존에 사용되던 Bean의 껍데기만 가져오고 내부의 구현 부분은 모두 사용자에게 위임한 형태다.
* 즉, 해당 Bean의 어떤 메소드가 어떤 값이 입력 되면 어떤 값이 리턴 되어야 한다는 내용 모두 개발자 필요에 의해서 조작이 가능하다
* `@MockBean`은 `given`에서 **선언한 코드 외에는 전부 사용할 수 없다**.



**ExampleTests.java**

```java
@RunWith(SpringRunner.class)
public class ExampleTests {

  @MockBean
  private ExampleService service;

  @Autowired
  private UserOfService userOfService;

  @Test
  public void testUserOfService() {
    given(this.service.greet()).willReturn("Hello");
    String actual = this.userOfService.makeUse();
    assertEquals("Was: Hello", actual);
  }

  @Configuration
  @Import(UserOfService.class) // A @Component injected with ExampleService
  static class Config {
  }
}
```

> 참고
>
> * https://jojoldu.tistory.com/226?category=1036934
> * https://jojoldu.tistory.com/320?category=1036934



## [@SpyBean](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/mock/mockito/SpyBean.html)

* `org.springframework.boot.test.mock.mockito.SpyBean`
* `@SpyBean`은 `given`에서 **선언한 코드 외에는 전부 실제 객체의 것을 사용**합니다.
* 이미 존재하는 Bean을 SpyBean으로 Wrapping한 형태
  * 컨텍스트에 존재하는 같은 타입의 빈을 Wrapping 한다



**ExampleTests.java**

```java
@RunWith(SpringRunner.class)
public class ExampleTests {

  @SpyBean
  private ExampleService service;

  @Autowired
  private UserOfService userOfService;

  @Test
  public void testUserOfService() {
    String actual = this.userOfService.makeUse();
    assertEquals("Was: Hello", actual);
    verify(this.service).greet();
  }

  @Configuration
  @Import(UserOfService.class) // A @Component injected with ExampleService
  static class Config {
  }


}
```

> 참고
>
> * https://jojoldu.tistory.com/226?category=1036934
> * https://jojoldu.tistory.com/320?category=1036934



## @SpringBootTest

* 스프링 부트가 실제 애플리케이션을 구동하게 만든다
* @SpringBootApplication이 붙은 클래스를 찾아서 내장 컨테이너를 실행한다
* `@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)`
  * 테스트할 때 임의의 포트에 내장 컨테이너를 바인딩한다



## @AutoConfigureWebClient

* 애플리케이션에 요청을 날리는 WebTestClient 인스턴스를 생성한다

**WebTestClient**

* WebTestClient에는 단언 기능이 포함되어 있다

**예시**

* @AutoConfigureWebClient 애노테이션으로 WebTestClient 인스턴스를 생성하고 @Autowired를 통해 주입받는다

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebClient
class CashReceiptControllerIntegrationTest {
   @Autowired
    private WebTestClient webTestClient;
}
```



# 3 스프링 부트 슬라이스 테스트

* @SpringBootTest를 이용해 내장 웹 컨테이너를 실행하는 비용은 크다
* 그렇다면 단위 테스트와 종단 간 통합 테스트 중간 정도에 해당하는 테스트를 할 수 없을까?
* 이런경우 사용하는게 슬라이스 테스트다



## 3.1 지원하는 슬라이스 테스트

* @AutoConfigureRestDocs
* @DataJdbcTest
* @DataJpaTest
* @DataMongoTest
* @JdbcTest
* @JsonTest
* @RestClientTest
* @WebFluxTest
* @WebMvcTest



## 3.2 [@WebMvcTest](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/autoconfigure/web/servlet/WebMvcTest.html)

* `org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest`
* @WebMvcTest애노테이션은 스프링 웹 컨트롤러를 테스팅 할 때 필요한 빈을 가진 application context를 만든다
* Spring MVC 컴포넌트에 집중해 테스트를 가능하게 해준다
* 기본적으로 스프링 시큐리티와 MockMvc를 설정해줌
  * MockMvc에 대한 정교한 설정이 필요하다면 [`@AutoConfigureMockMvc`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/autoconfigure/web/servlet/AutoConfigureMockMvc.html를 이용
* 일반적으로 @MockBean과 같이 사용되며 테스트할 `@Controller` bean가 협력하는 객체를 모킹함



## 3.3 [@DataJpaTest](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/autoconfigure/orm/jpa/DataJpaTest.html)

* `org.springframework.boot.test.autoconfigure.orm.jpa` 패키지
* @DataJpaTest 애노테이션은 auto-configuration하지 않고 JPA 테스트와 관련된 configuration만 스캔한다
  * DataSource, Spring Data JPA Repository Interface, JdbcTemplate, EntityManager 등등
* 기본적으로 Transactional이 적용되어 각각의 테스트 메소드가 끝나면 롤백된다
* embedded in-memory database를 사용한다
  * DataSource를 대체함



**DataJpaTest.java**

```java
...
@Transactional
...
public @interface DataJpaTest {
	...
}
```



**테스트 실행 시 로그**

```
Finished Spring Data repository scanning in 61 ms. Found 7 JPA repository interfaces.
Replacing 'dataSource' DataSource bean with embedded version
Starting embedded database: url='jdbc:h2:mem:d1d81c63-a190-49e4-b63d-ae027d6ce935;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=false', username='sa'
```



## 3.4 @DataMongoTest

* 스프링 데이터 몽고디비 관련 모든 기능을 사용할 수 있게하고 그 외 @Component 애노테이션이 붙은 다른 빈 정의를 무시한다



## 3.5 @WebFluxTest

* @WebFluxTest는 Spring WebFlux 인프라를 자동으로 구성한다
* 모든 빈을 스캐닝하지 않고 WebFluxTest에 관련된 빈만 스캔한다
* 등록되는 빈
  * @Controller
  * @ControllerAdvice
  * @JsonComponent
  * Converter, GenericConverter, WebFluxConfigurer
* @WebFluxTest 어노테이션을 사용하면 일반 @Component 빈은 등록되지 않는다
* WebTestClient를 자동 설정한다
  * 따라서 세밀한 설정이 필요한 경우만 @AutoConfigureWebClient를 사용하면 된다
* 일반적으로 테스트 대상 컨트롤러의 협력자를 대체하기 위해 @MockBean or @Import 애노테이션과 함께 사용된다
* 전체 설정을 로드하고 WebTestClient를 사용하고 싶다면 @SpringBootTest, @AutoConfigureWebTestClient 두 애노테이션을 함께 사용하라



# 3 리액티브 단위 테스트

* 



관련 자료

* [Testing MVC Web Controllers with Spring Boot and @WebMvcTest](https://reflectoring.io/spring-boot-web-controller-test/)
* [Testing JPA Queries with Spring Boot and @DataJpaTest](https://reflectoring.io/spring-boot-data-jpa-test/)