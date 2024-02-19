# 1 IoC Container

- Inversion of Control Container
- Inversion of Control을 dependency injection이라고도 부른다.
- IoC Container란 객체를 생성하고 관리하며 의존관계를 연결해주는 역할을 한다.
  - 최근에는 의존관계 주입에 초점을 맞추어 DI 컨테이너라고 한다.



# 2 ApplicationContext

- `package org.springframework.context`
	- [레퍼런스](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/ApplicationContext.html)



**ApplicationContext**

- ApplicationContext가 스프링의 IoC Container라고 할 수 있다.
- 빈을 초기화하고 설정하고 의존성을 조립하는 역할을 한다.
- ApplicationContext 어떤 빈을 초기화하고 의존성을 어떻게 조립할지 configuration metadata를 읽어 확인한다
- configuration metadata의 형태로 XML, Java Annotation 방식 등이 있다.

<br>


**ApplicationContext의 부가 기능**

- ApplicationContext는 빈 관리 및 조회 기능 외의 수 많은 부가기능이 있다.
- ApplicationEventPublisher: 이벤트를 발행하고 구독하는 모델을 편리하게 지원
- BeanFactory: 빈 관리 및 조회 기능
- EnvironmentCapable: 환경변수(로컬, 개발, 운영등을 구분해서 처리)
- ResourceLoader: 편리한 리소스 조회(파일, 클래스패스 등)

<br>

**스프링 빈**

- 스프링 컨테이너에 등록된 객체를 스프링 빈이라고 한다.
- ApplicationContext를 통해 등록된 빈을 찾아서 사용할 수 있다.
	- applicationContext.getBean() 메서드를 사용함

<br>

## 2.1 BeanFactory

- ApplicationContext는 BeanFactory를 상속해 BeanFactory의 모든 기능을 사용할 수 있어 동일하게 취급한다.
	- 실제로 빈을 관리하는 기능은 BeanFactory에 있다.
	- 보통 BeanFactory의 기능을 직접 사용하지 않고 ApplicationContext를 통해 간접적으로 사용한다.
- BeanFactory은 스프링 컨테이너의 최상위 인터페이스다
- BeanFactory가 스프링 빈을 관리하고 조회하는 역할을 담당한다.
- applicationContext.getBean() 메서드는 BeanFactory로 부터 상속받은 메서드다.

<br>

## 2.2 configuration metadata 설정

- 스프링 컨테이너는 configuration metadata에 명시한대로 빈을 초기화하고 의존관계를 조립한다.
- configuration metadata은 XML, Java Annotation 기반 설정 파일이다.

<br>

**Java-based configuration metadata 설정**

- 스프링 컨테이너는 `@Configuration` 애노테이션이 붙은 설정 정보를 사용한다.
- `@Configuration`의 패키지 : `package org.springframework.context.annotation;`
- `@Configuration` 이 붙은 설정 클래스에 `@Bean` 애노테이션이 붙은 메서드를 모두 호출해서 반환된 객체를 스프링 컨테이너에 등록한다.

 아래와 같이 애노테이션 기반 설정 클래스를 만들고 `@Configuration` 애노테이션을 붙인다.

```java
@Configuration
public class AppConfig {
  
  @Bean
  public MemberService memberService() {
    return new MemberServiceImpl(memberRepository());
  }
  
  @Bean
  public OrderService orderService() {
    return new OrderServiceImpl(
      memberRepository(),
      discountPolicy());
  }
  
  @Bean
  public MemberRepository memberRepository() {
    return new MemoryMemberRepository();
  }
  
  @Bean
  public DiscountPolicy discountPolicy() {
    return new RateDiscountPolicy();
  } 
}
```



## 2.3 Container 생성

- 아래와 같이 ApplicationContext 생성시 configuration metadata를 넘겨주면 된다.
- 아래의 예시는 Java-based configuration을 가지고 ApplicationContext를 생성하는 예시다 



**Java-based configuration 컨테이너 생성 예시**

- `@Configuration` 이 붙은 설정 클래스인 `AppConfig.class`를 인자로 준다.
- AnnotationConfigApplicationContext은 ApplicationContext 인터페이스의 구현체로 애노테이션 기반의 설정 클래스를 읽어 빈을 초기화하고 의존성을 조립한다.

```java
// ApplicationContext 생성
ApplicationContext applicationContext = new AnnotationConfigApplicationContext(AppConfig.class);

// ApplicationContext에서 빈 조회
MemberService memberService = applicationContext.getBean("memberService", MemberService.class);

// ApplicationContext에서 빈 조회
OrderService orderService = applicationContext.getBean("orderService",
OrderService.class);
```



# 3 스프링 컨테이너 생성 과정

1. 스프링 컨테이너를 생성할 때는 구성 정보를 지정해야한다.
   - ApplicationContext 인터페이스의 AnnotationConfigApplicationContext 구현체를 사용해 스프링 컨테이너를 생성하면 @Configuration이 붙은 애노테이션 기반의 구성 정보를 넘겨준다.
2. 스프링 컨테이너는 파라미터로 넘어온 구성 정보를 이용해 스프링 빈을 등록한다.
   - 빈의 이름은 @Bean이 붙은 메서드의 이름으로 등록된다.
   - `@Bean(name="customName")` 를 사용해 빈의 이름을 직접 지정할 수 있다.
   - 빈의 이름은 유니크해야 한다.
3. 빈 사이의 의존관계가 있다면 의존성을 주입한다.



# 4 싱글톤 컨테이너

- 스프링 컨테이너에 getBean으로 빈을 조회할 때 마다 새로운 객체를 생성해 반환하면 오버헤드가 크다.
- 따라서 스프링 컨테이너는 기본적으로 스프링 빈을 싱글톤으로 관리한다.
  - 빈을 오직 하나만 생성하고 같은 이름으로 빈을 조회하면 같은 객체를 반환받는다.
- 스프링의 기본 빈 등록 방식은 싱글톤이지만, 싱글톤 방식만 지원하는 것은 아니다. 
  - 요청할 때 마다 새 로운 객체를 생성해서 반환하는 기능도 제공한다.



**테스트**

- 동일한 이름으로 빈을 조회하고 참조 값이 같은지 비교하면 참조 값이 같다.
- 따라서 스프링 컨테이너는 빈을 싱글톤으로 관리한다는 것을 알 수 있다.

```java
@Test
@DisplayName("스프링 컨테이너와 싱글톤")
void springContainer() {
  // given
  ApplicationContext ac = new AnnotationConfigApplicationContext(AppConfig.class);
  
  // when
  MemberService memberService1 = ac.getBean("memberService", MemberService.class);
  MemberService memberService2 = ac.getBean("memberService", MemberService.class);

  // then
  assertThat(memberService1).isSameAs(memberService2);
}
```



## 4.1 싱글톤 주의사항

- 싱글톤 객체는 stateless해야한다.
- 특정 클라이언트에 의존적인 필드가 있으면 안된다.
- 특정 클라이언트가 값을 변경할 수 있는 필드가 있으면 안된다!
- 가급적 읽기만 가능해야 한다.
- 필드 대신에 자바에서 공유되지 않는, 지역변수, 파라미터, ThreadLocal 등을 사용해야 한다.
- 객체 인스턴스를 하나만 생성해서 공유하는 싱글톤 방식은 여러 클라이언트가 하나의 같은 객체 인스턴스를 공유하기 때문에 싱글톤 객체는 상태를 유지(stateful)하게 설계하면 안된다.



## 4.2 @Configuration과 싱글톤

- Java-based configuration metadata을 사용할 때 설정 클래스에 꼭 @Configuration을 붙여야 싱글톤이 성립된다.

아래의 코드를 보면 memberService() 메서드에서 memberRepository() 메서드를 호출하고 orderService() 메서드에서도 memberRepository() 메서드를 호출한다. 마지막으로 memberRepository() 메서드를 호출하면 memberRepository() 메서드는 총 3회 호출되어 MemberRepository가 싱글톤을 지키지 않는 것처럼 보인다. 



**예시 코드**

```java
@Configuration
public class AppConfig {
  
  @Bean
  public MemberService memberService() {
    System.out.println("call AppConfig.memberService");
    return new MemberServiceImpl(memberRepository());
  }
  
  @Bean
  public OrderService orderService() {
    System.out.println("call AppConfig.orderService");
    return new OrderServiceImpl(memberRepository(), discountPolicy());
  }
  
  @Bean
  public MemberRepository memberRepository() {
    System.out.println("call AppConfig.memberRepository");
    return new MemoryMemberRepository();
  }

}
```



**테스트**

- 테스트 해보면 MemberRepository를 싱글톤으로 관리되어 모두 같은 인스턴스를 가지고있다.

```java
@Test
void configurationTest() {
  // given
  ApplicationContext ac = new AnnotationConfigApplicationContext(AppConfig.class);
  
  // when
  MemberServiceImpl memberService = ac.getBean("memberService", MemberServiceImpl.class);
  OrderServiceImpl orderService = ac.getBean("orderService", OrderServiceImpl.class);
  MemberRepository memberRepository = ac.getBean("memberRepository", MemberRepository.class);
 
	// then 모두 같은 인스턴스를 참고하고 있다.
  assertThat(memberService.getMemberRepository()).isSameAs(memberRepository);
  assertThat(orderService.getMemberRepository()).isSameAs(memberRepository);
}

```



**출력 결과**

- 분명 memberRepository() 메서드가 3번 호출되서 3개의 객체가 만들어질 것 같은데?
- 출력 결과를 보면 실제로 memberRepository() 메서드는 한번만 호출되었다.

```bash
call AppConfig.memberService
call AppConfig.memberRepository
call AppConfig.orderService
```



**한번만 호출되는 이유**

- `ApplicationContext ac = new AnnotationConfigApplicationContext(AppConfig.class);`
- AnnotationConfigApplicationContext에 넘긴 설정 메타 정보는 빈으로 등록된다.
  - 즉 AppConfig가 스프링 빈이 된다.
- AppConfig를 스프링 컨테이너에서 조회해 출력해보면 아래와 같은 결과가 나온다.
  - bean = class hello.core.AppConfig$$EnhancerBySpringCGLIB$$bd479d70
  - 순수 클래스라면 class hello.core.AppConfig가 나와야 한다
- 즉 스프링 컨테이너에 등록된 빈은 AppConfig가 아니라 CGLIB라는 바이트코드 조작 라이브러리를 사용해서 AppConfig 클래스 를 상속받은 임의의 다른 클래스를 만들고, 그 다른 클래스를 스프링 빈으로 등록한다.
- 스프링은 설정 클래스를 상속하고 바이트 코드를 조작해 빈이 이미 등록되어 있으면 다른 객체를 생성하지 않아 싱글톤을 지키도록 수정했을 것이다
- 아래는 CGLIB이 만든 예상 코드이다 



**예상코드**

```java
@Bean
public MemberRepository memberRepository() {
  if (memoryMemberRepository가 이미 스프링 컨테이너에 등록되어 있으면) { 
    return 스프링 컨테이너에서 찾아서 반환;
  } else { 
    //스프링 컨테이너에 없으면 기존 로직을 호출해서 MemoryMemberRepository를 생성하고 스프링 컨테이너에 등록 
    return 반환
  } 
}
```



**@Configuration을 사용하지 않으면?**

- @Configuration을 삭제하고 빈을 생성하면 memberRepository()가 총 3회 호출되며 각기 다른 인스턴스로 존재해 싱글턴 패턴이 지켜지지 않은것을 볼 수 있다.



# 5 컴포넌트 스캔

- 스프링 빈을 등록하기 위해 configuration metadata를 직접 작성하였다.
- 예제 수준에서는 빈이 많지 않아 설정이 쉬웠지만 프로젝트 규모가 커지면 관리가 어려워진다.
- 그래서 스프링에서는 configuration metadata가 없어도 스프링 빈으로 자동으로 등록해주는 컴포넌트 스캔 기능을 제공한다.



**컴포넌트 스캔**

- 컴포넌트 스캔이란 이름 그대로 `@Component` 애노테이션이 붙은 클래스를 찾아 스프링 빈으로 등록한다.
- `package org.springframework.stereotype.Component`
- 또한 `@Autowired` 애노테이션을 붙이면 의존관계를 자동으로 주입해준다.



**컴포넌트 스캔 적용 전 configuration metadata**

```java
@Configuration
public class AppConfig {

  @Bean
  public MemberService memberService() {
    System.out.println("call AppConfig.memberService");
    return new MemberServiceImpl(memberRepository());
  }

  @Bean
  public OrderService orderService() {
    System.out.println("call AppConfig.orderService");
    return new OrderServiceImpl(memberRepository(), discountPolicy());
  }

  @Bean
  public MemberRepository memberRepository() {
    System.out.println("call AppConfig.memberRepository");
    return new MemoryMemberRepository();
  }

}
```



**컴포넌트 스캔 사용**

- 위에 configuration metadata를 이용한 것과 아래처럼 컴포넌트 스캔을 사용한 최종 결과는 같다.
- configuration metadata가 없기 때문에 의존관계를 클래스 내에서 직접 해결해야 한다.
- @Autowired 애노테이션을 생성자에 붙이면 생성자의 인자들을 스프링 컨테이너에서 찾아서 주입해준다. 

```java
@Component
public class MemoryMemberRepository implements MemberRepository {

}
```

```java
@Component
public class MemberServiceImpl implements MemberService {
  private final MemberRepository memberRepository;
  
  @Autowired
  public MemberServiceImpl(MemberRepository memberRepository) {
    this.memberRepository = memberRepository;
  }
  
}
```

```java
@Component
public class OrderServiceImpl implements OrderService {
  private final MemberRepository memberRepository;
  private final DiscountPolicy discountPolicy;

  @Autowired
  public OrderServiceImpl(MemberRepository memberRepository,
                          DiscountPolicy discountPolicy) {
    this.memberRepository = memberRepository;
    this.discountPolicy = discountPolicy;
  }
}
```



## 5.1 @ComponentScan 애노테이션

- @ComponentScan 애노테이션을 사용해서 탐색할 패키지의 시작 위치를 지정할 수 있다.



**예시**

```java
@ComponentScan(
          basePackages = {"hello.core", "hello.service"}
}
```

- basePackages
  - 탐색할 패키지의 시작 위치를 지정한다. 
  - 이 패키지를 포함해서 하위 패키지를 모두 탐색한다.
- 탐색 위치를 지정하지 않으면 `@ComponentScan` 이 붙은 설정 정보 클래스의 패키지가 시작 위치가 된다.



**@SpringBootApplication**

- 스프링 부트를 사용하면 스프링 부트의 대표 시작 정보인 `@SpringBootApplication`을 이 프로젝 트 시작 루트 위치에 두는 것이 관례이다.
- `@SpringBootApplication` 에는 `@ComponentScan`이 포함되어 있다.
- 따라서 프로젝스 시작 루트 위치부터 컴포넌트 스캔이 시작된다.

```java
@ComponentScan(excludeFilters = { @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
		@Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication {
}
```





# 6 빈 생명주기 콜백

- 스프링은 의존관계 주입이 완료되면 스프링 빈에게 콜백 메서드를 통해서 초기화 시점을 알려주는 다양한 기능을 제공한다
- 스프링은 스프링 컨테이너가 종료되기 직전에 소멸 콜백을 준다
- 스프링은 크게 3가지 방법으로 빈 생명주기 콜백을 지원한다.



**스프링 빈의 이벤트 라이프사이클**

1. 스프링컨테이너 생성
2. 스프링빈 생성
3. 의존관계 주입
4. 초기화콜백 
5. 사용 
6. 소멸전콜백 
7. 스프링 종료



> 싱글톤 빈들은 스프링 컨테이너가 종료될 때 싱글톤 빈들도 함께 종료되기 때문에 스프링 컨테이너가 종료되기 직전에 소멸전 콜백이 일어난다.



## 6.1 인터페이스

- InitializingBean 은 afterPropertiesSet() 메서드로 초기화를 지원한다.
- DisposableBean 은 destroy() 메서드로 소멸을 지원한다.

```java
public class NetworkClient implements InitializingBean, DisposableBean {
  private String url;
  
  public NetworkClient() {
    System.out.println("생성자 호출, url = " + url); 
  }
  
  public void setUrl(String url) {
    this.url = url;
  }
  
  //서비스 시작시 호출
  public void connect() {
    System.out.println("connect: " + url);
  }
  
  public void call(String message) {
    System.out.println("call: " + url + " message = " + message);
  }
  
  //서비스 종료시 호출
  public void disConnect() {
    System.out.println("close + " + url);
  }
  
  @Override
  public void afterPropertiesSet() throws Exception {
    connect();
    call("초기화 연결 메시지"); 
  }
  
  @Override
  public void destroy() throws Exception {
    disConnect();
  }
}
```



**초기화, 소멸 인터페이스 단점**

- 이 인터페이스는 스프링 전용 인터페이스다. 해당 코드가 스프링 전용 인터페이스에 의존한다. 
- 초기화, 소멸 메서드의 이름을 변경할 수 없다.
- 내가 코드를 고칠 수 없는 외부 라이브러리에 적용할 수 없다.
- 현재는 사용하지 않는 방식이다.



## 6.2 설정 정보에 초기화 메서드, 종료 메서드 지정

- 아래와 같이 설정 정보에 초기화 소멸 메서드 지정할 수 있다.

```java
@Configuration
static class LifeCycleConfig {
  @Bean(initMethod = "init", destroyMethod = "close")
  public NetworkClient networkClient() {
    NetworkClient networkClient = new NetworkClient();
    networkClient.setUrl("http://hello-spring.dev");
    return networkClient;
  } 
}
```



**설정 정보 사용 특징**

- 메서드 이름을 자유롭게 줄 수 있다.
- 스프링 빈이 스프링 코드에 의존하지 않는다.
- 코드가 아니라 설정 정보를 사용하기 때문에 코드를 고칠 수 없는 외부 라이브러리에도 초기화, 종료 메서드 를 적용할 수 있다.



## 6.3 @PostConstruct, @PreDestory 애노테이션

- @PostConstruct , @PreDestroy 이 두 애노테이션을 사용하면 가장 편리하게 초기화와 종료를 실행할 수 있다.
- 초기화 콜백에 @PostConstruct을 적용하고 종료 콜백에 @PreDestroy 을 적용하면 된다.

```java
public class NetworkClient {
  private String url;
  
  public NetworkClient() {
    System.out.println("생성자 호출, url = " + url); 
  }
  
  public void setUrl(String url) {
    this.url = url;
  }
  
  //서비스 시작시 호출
  public void connect() {
    System.out.println("connect: " + url);
  }
  
  public void call(String message) {
    System.out.println("call: " + url + " message = " + message);
  }
  
  //서비스 종료시 호출
  public void disConnect() {
    System.out.println("close + " + url);
  }
  
  @PostConstruct
  public void init() throws Exception {
    connect();
    call("초기화 연결 메시지"); 
  }
  
  @PreDestroy
  public void close() throws Exception {
    disConnect();
  }
}
```



**@PostConstruct, @PreDestory 애노테이션 특징**

- 최신 스프링에서 가장 권장하는 방법이다.
- 애노테이션 하나만 붙이면 되므로 매우 편리하다.
- 패키지를 잘 보면 javax.annotation.PostConstruct 이다. 
- 스프링에 종속적인 기술이 아니라 JSR-250 라는 자바 표준이다. 따라서 스프링이 아닌 다른 컨테이너에서도 동작한다.
- 컴포넌트 스캔과 잘 어울린다.
- 유일한 단점은 외부 라이브러리에는 적용하지 못한다는 것이다. 
- 외부 라이브러리를 초기화, 종료 해야 하면 @Bean의 기능을 사용하자.



# 7 빈 스코프

- 스프링 컨테이너의 빈 스코프는 아래와 같이 지원된다
  - 싱글톤
  - 프로토타입
  - 웹 관련 스코프
    - **request**: 웹 요청이 들어오고 나갈때 까지 유지되는 스코프이다. 
    - **session**: 웹 세션이 생성되고 종료될 때 까지 유지되는 스코프이다. 
    - **application**: 웹의 서블릿 컨텍스와 같은 범위로 유지되는 스코프이다.



## 7.1 빈 스코프 지정

- 빈 스코프는 다음과 같이 지정할 수 있다

```java
@Scope("prototype")
@Component
public class HelloBean {}
```

```java
@Scope("prototype")
@Bean
PrototypeBean HelloBean() {
  return new HelloBean();
}
```



## 7.2 프로토파입 스코프

- 싱글톤 스코프의 빈을 조회하면 항상 같은 인스턴스를 반환한다.
- 프로토파입 스코프의 빈은 조회하면 스프링 컨테이너는 항상 새로운 인스턴스를 생성해서 반환한다.
- 스프링 컨테이너는 프로토타입 빈을 생성하고, 의존관계 주입, 초기화까지만 처리한다.
  -  @PostConstruct가 적용된 초기화 콜백은 실행된다.

- 클라이언트에 빈을 반환하고, 이후 스프링 컨테이너는 생성된 프로토타입 빈을 관리하지 않는다. 
- 프로토타입 빈을 관리할 책임은 프로토타입 빈을 받은 클라이언트에 있다. 
  - 따라서 @PreDestory 같은 종료 메서드가 호출되지 않는다.



``**빈 생성 과정**

1. 프로토타입 스코프의 빈을 스프링 컨테이너에 요청한다.
2. 스프링 컨테이너는 이 시점에 프로토타입 빈을 생성하고, 필요한 의존관계를 주입한다.
3. 스프링 컨테이너는 생성한 프로토타입 빈을 클라이언트에 반환한다.
4. 이후에 스프링 컨테이너에 같은 요청이 오면 항상 새로운 프로토타입 빈을 생성해서 반환한다.

