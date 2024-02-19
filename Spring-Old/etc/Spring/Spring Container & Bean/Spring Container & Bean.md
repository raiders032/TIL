# 용어 정리

**제어의 역전 IoC(Inversion of Control)**

> 클라이언트 구현 객체가 스스로 필요한 서버 구현 객체를 생성하고, 연결하고, 실행했다. 한 마디로 구현 객체가 프로그램의 제어 흐름을 스스로 조종한느 것이 아니라 구현 객체는 자신의 로직을 실행하는 역할만 담당하며 프로그램에 대한 제어 흐름에 대한 권한은 외부에서 관리하는 것을 제어의 역전(IoC)이라 한다.

**의존관계 주입 DI(Dependency Injection)**

> 애플리케이션 **실행 시점(런타임**에 외부에서 실제 구현 객체를 생성하고 클라이언트에 전달해서 클라이언트와 서버의 실제 의존관계가 연결 되는 것을 **의존관계 주입**이라 한다.
>
> 의존관계 주입을 사용하면 클라이언트 코드를 변경하지 않고, 클라이언트가 호출하는 대상의 타입 인스턴스를 변경할 수 있다.



# 1. 스프링 컨테이너

* `ApplicationContext`를 **스프링 컨테이너**라 한다
  * `ApplicationContext` 는 인터페이스이다.
  * 스프링 컨테이너는 XML을 기반으로 만들 수 있고, 애노테이션 기반의 자바 설정 클래스로 만들 수 있다.
* 스프링 컨테이너는 `@Configuration` 이 붙은  클래스를 설정(구성) 정보로 사용한다. 
  * 여기서 @Bean 이라 적힌 메서드를 모두 호출해서 반환된 객체를 스프링 컨테이너에 등록한다. 
  * 이렇게 스프링 컨테이너에 등록된 객체를 **스프링 빈**이라 한다.
* 스프링 빈은 @Bean 이 붙은 메서드의 이름을 스프링 빈의 이름으로 사용한다.

> 스프링 컨테이너를 부를 때 BeanFactory , ApplicationContext 로 구분해서 이야기 한다.BeanFactory 를 직접 사용하는 경우는 거의 없으므로 일반적으로 ApplicationContext 를 스프링 컨테이너라 한다.

# 2. 스프링 컨테이너 생성과정

1. 스프링 컨테이너 생성
   * `new AnnotationConfigApplicationContext(AppConfig.class);`	
   * 스프링 컨테이너를 생성할 때는 설정 정보를 지정해주어야 한다.					 		 		
2. 스프링 빈 등록
   * 스프링 컨테이너는 파라미터로 넘어온 설정 클래스 정보를 사용해서 스프링 빈을 등록한다.
3. 스프링 빈 의존 관계 설정
   * 스프링 컨테이너는 설정 정보를 참고해서 의존관계를 주입(DI)한다.



# 3. 스프링 빈 조회

**빈 조회하기**

* `ac.getBean(빈이름, 타입)`
* `ac.getBean(타입)`



**특정 타입의 빈 모두 조회하기**

* `ac.getBeansOfType(MemberRepository.class);`

```java
@Test
@DisplayName("특정 타입을 모두 조회하기")
void findAllBeanByType() {
	Map<String, MemberRepository> beansOfType = ac.getBeansOfType(MemberRepository.class);
  for (String key : beansOfType.keySet()) {
    System.out.println("key = " + key + " value = " + beansOfType.get(key));
  }
  System.out.println("beansOfType = " + beansOfType);
  assertThat(beansOfType.size()).isEqualTo(2);
}
```



**스프링 빈 조회 - 상속 관계**

* 부모 타입으로 조회하면, 자식 타입도 함께 조회한다.
* `Object` 타입으로 조회하면, 모든 스프링 빈을 조회한다.

```java
@Test
@DisplayName("부모 타입으로 모두 조회하기 - Object")
void findAllBeanByObjectType() {
  Map<String, Object> beansOfType = ac.getBeansOfType(Object.class);
  for (String key : beansOfType.keySet()) {
    System.out.println("key = " + key + " value=" + beansOfType.get(key));
  }
}
```

# 4.BeanFactory

![image-20210915203748366](bean-factory.png)

* 스프링 컨테이너의 최상위 인터페이스다.
* 스프링 빈을 관리하고 조회하는 역할을 담당한다.
* `getBean()` 을 제공한다.
* **ApplicationContext**는 BeanFactory 기능을 모두 상속받아서 제공한다.
* BeanFactory를 직접 사용할 일은 거의 없다. 부가기능이 포함된 ApplicationContext를 사용한다.
* BeanFactory나 ApplicationContext를 스프링 컨테이너라 한다.



# 5. ApplicationContext

![image-20210915203855032](applcation-context.png)

* **메시지소스를 활용한 국제화 기능**
  * 예를 들어서 한국에서 들어오면 한국어로, 영어권에서 들어오면 영어로 출력 
* **환경변수**
  * 로컬, 개발, 운영등을 구분해서 처리 
* **애플리케이션 이벤트**
  * 이벤트를 발행하고 구독하는 모델을 편리하게 지원
* **편리한 리소스 조회**
  * 파일, 클래스패스, 외부 등에서 리소스를 편리하게 조회



# 6. 싱글톤 컨테이너

* 스프링 컨테이너는 싱글톤 패턴의 문제점을 해결하면서, 객체 인스턴스를 싱글톤(1개만 생성)으로 관리한다.
* **스프링 빈이 바로 싱글톤**으로 관리되는 빈이다.
* 싱글톤 패턴을 위한 지저분한 코드가 들어가지 않아도 된다.
* DIP, OCP, 테스트, private 생성자로 부터 자유롭게 싱글톤을 사용할 수 있다.
* 스프링 컨테이너 덕분에 고객의 요청이 올 때 마다 객체를 생성하는 것이 아니라, 이미 만들어진 객체를 공유 해서 효율적으로 재사용할 수 있다.



**싱글톤 확인 테스트 코드**

```java
@Test
@DisplayName("스프링 컨테이너와 싱글톤")
void springContainer() {
  ApplicationContext ac = new AnnotationConfigApplicationContext(AppConfig.class);

  //1. 조회: 호출할 때 마다 같은 객체를 반환
  MemberService memberService1 = ac.getBean("memberService", MemberService.class);

  //2. 조회: 호출할 때 마다 같은 객체를 반환
  MemberService memberService2 = ac.getBean("memberService", MemberService.class);

  //memberService1 == memberService2
  assertThat(memberService1).isSameAs(memberService2);
}
```



**싱글톤 방식의 주의점**

> 싱글톤 패턴이든, 스프링 같은 싱글톤 컨테이너를 사용하든, 객체 인스턴스를 하나만 생성해서 공유하는 싱글톤 방식은 여러 클라이언트가 하나의 같은 객체 인스턴스를 공유하기 때문에 싱글톤 객체는 상태를 유지(stateful)하게 설계하면 안된다.
>
>  **무상태(stateless)로 설계해야 한다!**

* 특정 클라이언트에 의존적인 필드가 있으면 안된다.
* 특정 클라이언트가 값을 변경할 수 있는 필드가 있으면 안된다!
* 가급적 읽기만 가능해야 한다.
* 필드 대신에 자바에서 공유되지 않는, 지역변수, 파라미터, ThreadLocal 등을 사용해야 한다.
* 스프링 빈의 필드에 공유 값을 설정하면 정말 큰 장애가 발생할 수 있다!!!



참고

* https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8/dashboard