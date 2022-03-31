# [@WebMvcTest](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/autoconfigure/web/servlet/WebMvcTest.html)

* `org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest`
* @WebMvcTest애노테이션은 스프링 웹 컨트롤러를 테스팅 할 때 필요한 빈을 가진 application context를 만든다
* Spring MVC 컴포넌트에 집중해 테스트를 가능하게 해준다
* 기본적으로 스프링 시큐리티와 MockMvc를 설정해줌
  * MockMvc에 대한 정교한 설정이 필요하다면 [`@AutoConfigureMockMvc`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/autoconfigure/web/servlet/AutoConfigureMockMvc.html)를 이용
* 일반적으로 @MockBean과 같이 사용되며 테스트할 `@Controller` bean가 협력하는 객체를 모킹함



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



# [@DataJpaTest](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/autoconfigure/orm/jpa/DataJpaTest.html)

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



# [@MockBean](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/mock/mockito/MockBean.html)

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



# [@SpyBean](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/mock/mockito/SpyBean.html)

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



관련 자료

* [Testing MVC Web Controllers with Spring Boot and @WebMvcTest](https://reflectoring.io/spring-boot-web-controller-test/)
* [Testing JPA Queries with Spring Boot and @DataJpaTest](https://reflectoring.io/spring-boot-data-jpa-test/)