# Advice

- 프록시가 호출하는 부가 기능이다. 
- 단순하게 프록시 로직이라 생각하면 된다.
- JDK 동적 프록시가 제공하는 InvocationHandler 와 CGLIB가 제공하는 MethodInterceptor의 개념과 유사하다.
  - Advice는 InvocationHandler와 MethodInterceptor를 추상화 한 것이다.



## Advice 생성

- Advice를 만드는 방법은 여러가지가 있다.
- 기본적인 방법은 아래의 인터페이스를 구현하면 된다.



**MethodInterceptor 인터페이스**

- MethodInterceptor은 Interceptor를 상속했다.
- Interceptor는Advice를 상속했다.
- 따라서 MethodInterceptor 인터페이스의 구현체가 Advice라고 할 수 있다.

```java
package org.aopalliance.intercept;

@FunctionalInterface
public interface MethodInterceptor extends Interceptor {

   /**
    * Implement this method to perform extra treatments before and
    * after the invocation. Polite implementations would certainly
    * like to invoke {@link Joinpoint#proceed()}.
    * @param invocation the method invocation joinpoint
    * @return the result of the call to {@link Joinpoint#proceed()};
    * might be intercepted by the interceptor
    * @throws Throwable if the interceptors or the target object
    * throws an exception
    */
   @Nullable
   Object invoke(@Nonnull MethodInvocation invocation) throws Throwable;

}
```



# PointCut

- 어디에 부가 기능을 적용할지, 어디에 부가 기능을 적용하지 않을지 판단하는 필터링 로직이다. 
- 주로 클래스와 메서드 이름으로 필터링 한다. 
- 이름 그대로 어떤 포인트(Point)에 기능을 적용할지 하지 않을지 잘라서(cut) 구분하는 것이다.



**Pointcut 인터페이스**

```java
package org.springframework.aop;

public interface Pointcut {
	ClassFilter getClassFilter();
	MethodMatcher getMethodMatcher();
	Pointcut TRUE = TruePointcut.INSTANCE;
}
```



PointCut이 사용 되는 곳

- 프록시 적용 대상 여부를 체크해서 꼭 필요한 곳에만 프록시를 적용한다.
- 프록시의 어떤 메서드가 호출 되었을 때 어드바이스를 적용할 지 판단한다



# Advisor

- Advisor는 하나의 포인트컷과 하나의 어드바이스로 구성되어 있다.
- 즉 Advisor는 어디(PointCut)에 조언(Advice)을 해야하는지 알고 있다.



## 프록시 팩토리에 등록

- 프록시 팩토리를 통해 프록시를 생성할 때 Advisor를 제공하면 어디에 어떤 기능을 제공할 설정할 수 있다.



**예시**

- Advisor를 생성할 때 PointCut과 Advice가 필요하다.
  - `Pointcut.TRUE`: 항상 true를 반환하는 PointCut
  - TimeAdvice: 앞서 Advice를 구현한 구현체

```java
@Test
void advisorTest1() {
  ServiceInterface target = new ServiceImpl();
  ProxyFactory proxyFactory = new ProxyFactory(target);

  // DefaultPointcutAdvisor: Advisor 인터페이스의 가장 일반적인 구현체 
  DefaultPointcutAdvisor advisor = new DefaultPointcutAdvisor(Pointcut.TRUE, new TimeAdvice());
  proxyFactory.addAdvisor(advisor);
  ServiceInterface proxy = (ServiceInterface) proxyFactory.getProxy();
  proxy.save();
  proxy.find();
}
```



# 프록시 팩토리



**Advice 구현**

```java
@Slf4j
public class TimeAdvice implements MethodInterceptor {

  @Override
  public Object invoke(MethodInvocation invocation) throws Throwable {
    log.info("TimeProxy 실행");
    long startTime = System.currentTimeMillis();
    Object result = invocation.proceed();
    long endTime = System.currentTimeMillis();
    long resultTime = endTime - startTime;
    log.info("TimeProxy 종료 resultTime={}ms", resultTime); 
    return result;
  }
  
}
```



**프록시 생성**

- 프록시 팩토리를 생성할 때, 생성자에 프록시의 호출 대상을 함께 넘겨준다.
  - 이 인스턴스에 인터페이스가 있다면 **JDK 동적 프록시**를 기본으로 사용한다.
  - 인터페이스가 없고 구체 클래스만 있다면 **CGLIB**를 통해서 동적 프록시를 생성한다.
  - 인터페이스가 있어도 CGLIB을 사용해서 동적 프록시를 생성하고 싶다면 아래와 같이 호출한다.
    - `proxyFactory.setProxyTargetClass(true);`
    - 스프링 부트는 AOP를 적용할 때 프록시 팩토리를 proxyTargetClass=true로 설정해서 사용한다.

```java
@Slf4j
public class ProxyFactoryTest {
  
  @Test
  @DisplayName("인터페이스가 있으면 JDK 동적 프록시 사용") 
  void interfaceProxy() {
    ServiceInterface target = new ServiceImpl();
    
    // 프록시 팩토리를 생성할 때, 생성자에 프록시의 호출 대상을 함께 넘겨준다
    ProxyFactory proxyFactory = new ProxyFactory(target);
    
    // 프록시 팩토리를 통해서 만든 프록시가 사용할 부가 기능 로직을 설정한다.
    proxyFactory.addAdvice(new TimeAdvice());
    ServiceInterface proxy = (ServiceInterface) proxyFactory.getProxy();
    
    log.info("targetClass={}", target.getClass());
    log.info("proxyClass={}", proxy.getClass());
    
    proxy.save();
    
    assertThat(AopUtils.isAopProxy(proxy)).isTrue();
    assertThat(AopUtils.isJdkDynamicProxy(proxy)).isTrue();
    assertThat(AopUtils.isCglibProxy(proxy)).isFalse();
	}
}
```

**실행 결과**

- 타겟 인스턴스에 인터페이스가 존재하기 때문에 동적 JDK를 사용해 프록시를 생성한다.
  - 프록시에 클래스를 확인해보면 `com.sun.proxy.$Proxy13` 

```
ProxyFactoryTest - targetClass=class hello.proxy.common.service.ServiceImpl ProxyFactoryTest - proxyClass=class com.sun.proxy.$Proxy13
TimeAdvice - TimeProxy 실행
ServiceImpl - save 호출
TimeAdvice - TimeProxy 종료 resultTime=1ms
```



# BeanPostProcessor

- ProxyFactory를 사용해서 직접 프록시를 만들어 빈으로 등록하는 방법은 상당히 불편하다.
- 컴포넌트 스캔을 사용하는 경우 스캔 된 빈을 프록시로 대체해서 등록하는 것이 불가능하다.
  - 일반적으로 스프링 컨테이너가 등록하는, 특히 컴포넌트 스캔의 대상이 되는 빈들은 중간에 조작할 방법이 없다.



**BeanPostProcessor**

- 빈이 컨테이너에 등록되기 직전에 빈을 조작하고 싶다면 BeanPostProcessor를 이용하면 된다.
- BeanPostProcessor는 전달된 빈을 조작할 수 있고 아예 다른 객체로 바꿔버릴 수 있다.
- 특히 컴포넌트 스캔의 대상이 되는 빈들이 스프링 컨테이너에 등록되기 전에 BeanPostProcessor를 사용해 빈 객체를 프록시 객체로 변경해서 등록하는 것이 가능하다.



**BeanPostProcessor 인터페이스**

- postProcessBeforeInitialization: 객체 생성 이후 초기화가 발생하기 전에 호출되는 프로세서
  - @PostConstruct 전에 호출 됨
- postProcessAfterInitialization: 객체 생성 이후 초기화가 발생한 후 호출되는 프로세서
  - @PostConstruct 후에 호출 됨

```java
package org.springframework.beans.factory.config;

public interface BeanPostProcessor {

	@Nullable
	default Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}
  
  	@Nullable
	default Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}

}
```



**예시**

- basePackage를 만족하는 빈의 경우 프록시를 만들어 실제 객체 대신 프록시 객체를 빈으로 등록하는 BeanPostProcessor 예시

```java
@Slf4j
public class PackageLogTraceProxyPostProcessor implements BeanPostProcessor {
  private final String basePackage;
  private final Advisor advisor;

  public PackageLogTraceProxyPostProcessor(String basePackage, Advisor advisor) {
    this.basePackage = basePackage;
    this.advisor = advisor;
  }

	@Override
	public Object postProcessAfterInitialization(Object bean, String beanName) 
    throws BeansException {
		
    log.info("param beanName={} bean={}", beanName, bean.getClass());
    
  	//프록시 적용 대상 여부 체크 basePackage로 시작하지 않으면 원본 객체 반환
    String packageName = bean.getClass().getPackageName();
  	if (!packageName.startsWith(basePackage))
    	return bean;
    
    //프록시 대상이면 프록시를 만들어서 반환
    ProxyFactory proxyFactory = new ProxyFactory(bean);
    proxyFactory.addAdvisor(advisor);
    Object proxy = proxyFactory.getProxy();
    log.info("create proxy: target={} proxy={}", bean.getClass(), proxy.getClass());
    return proxy;
	}
}
```



## AutoProxyCreator

- 스프링 부트 자동 설정으로 `AnnotationAwareAspectJAutoProxyCreator`라는 BeanPostProcessor가 스프링 빈에 자동으로 등록된다.
- 이 BeanPostProcessor는 빈으로 등록된 Advisor들을 찾아 프록시가 필요한 곳에 자동으로 프록시를 적용해준다.
  - Advisor안에 Pointcut 과 Advice이 포함되어 있기 때문에 Advisor를 알면 Pointcut을 알 수 있다.
  - Pointcut으로 어떤 스프링 빈에 프록시 적용 여부를 결정할 수 있다.



**동작 과정**

1. 생성 
   - 스프링이 스프링 빈 대상이 되는 객체를 생성한다. ( @Bean , 컴포넌트 스캔 모두 포함)
2. 전달 
   - 생성된 객체를 빈 저장소에 등록하기 직전에 빈 후처리기에 전달한다.
3. 모든 Advisor 빈 조회
   - 스프링 컨테이너에서 모든 Advisor 를 조회한다.
4. 프록시 적용 대상 체크
   - 앞서 조회한 Advisor 에 포함되어 있는 포인트컷을 사용해서 해당 객체가 프록시를 적용할 대상인지 아닌지 판단한다. 
   - 이때 객체의 클래스 정보는 물론이고, 해당 객체의 모든 메서드를 포인트컷에 하나하나 모두 매칭해본다. 
   - 그래서 조건이 하나라도 만족하면 프록시 적용 대상이 된다. 
   - 예를 들어서 10개의 메서드 중에 하나만 포인트컷 조건에 만족해도 프록시 적용 대상이 된다.
5. 프록시 생성
   - 프록시 적용 대상이면 프록시를 생성하고 반환해서 프록시를 스프링 빈으로 등록한다. 
   - 만약 프록시 적용 대상이 아니라면 원본 객체를 반환해서 원본 객체를 스프링 빈으로 등록한다.
6. 빈 등록 
   - 반환된 객체는 스프링 빈으로 등록된다.



# AspectJ

-  포인트컷과 어드바이스로 구성되어 있는 Advisor를 만들어서 스프링 빈으로 등록하면 포인트 컷에 매칭되는 빈들이 프록시로 대체해서 등록된다.
  - 앞서 언급한 `AnnotationAwareAspectJAutoProxyCreator`에 의해서 프록시로 등록 됨
- 스프링은 `@Aspect` 애노테이션으로 매우 편리하게 포인트컷과 어드바이스로 구성되어 있는 어드바이저를 생성할 수 있다.



> AspectJ
>
> - AOP의 대표적인 구현으로 AspectJ 프레임워크가 있다.
> - 스프링도 AOP를 지원하지만 대부분 AspectJ의 문법을 차용하고, AspectJ가 제공하는 기능의 일부만 제공한다.
> - 



## @Aspect

- AnnotationAwareAspectJAutoProxyCreator는 Advisor 를 자동으로 찾아와서 필요한 곳에 프록시를 생성하고 적용해준다
- 추가적으로 `@Aspect` 애노테이션을 붙은 빈을 발견하면 자동으로 `Advisor`를 생성해 준다.
- `@Aspect` 애노테이션이 있어도 스프링 빈으로 등록을 해줘야 한다



**Advisor 생성 과정**

1. 실행
   - 스프링 애플리케이션 로딩 시점에 자동 프록시 생성기(AnnotationAwareAspectJAutoProxyCreator)를 호출한다.
 2. 모든 @Aspect 빈 조회
    - 자동 프록시 생성기는 스프링 컨테이너에서 @Aspect 애노테이션이 붙은 스프링 빈을 모두 조회한다.
3. 어드바이저 생성
   - @Aspect 어드바이저 빌더를 통해 @Aspect 애노테이션 정보를 기반으로 어드바이저를 생성한다.
4. @Aspect 기반 어드바이저 저장
   - 생성한 어드바이저를 @Aspect 어드바이저 빌더 내부에 저장한다.



## @Around

- `@Around("execution(* hello.proxy.app..*(..))")` 처럼 포인트컷 표현식을 넣는다.
- 표현식은  AspectJ 표현식을 사용한다.
- 메서드 호출 전후에 수행, 가장 강력한 어드바이스, 조인 포인트 실행 여부 선택, 반환 값 변환, 예외 변환 등이 가능하다



## @Before 

- 조인 포인트 실행 이전에 실행된다.
- @Around 와 다르게 작업 흐름을 변경할 수는 없다.
- @Around 는 ProceedingJoinPoint.proceed() 를 호출해야 다음 대상이 호출된다. 
  - 만약 호출하지 않으면 다음 대상이 호출되지 않는다. 
  - 반면에 @Before 는 ProceedingJoinPoint.proceed() 자체를 사용하지 않는다. 
  - 메서드 종료시 자동으로 다음 타켓이 호출된다. 
  - 물론 예외가 발생하면 다음 코드가 호출되지는 않는다.

```java
@Before("hello.aop.order.aop.Pointcuts.orderAndService()")
public void doBefore(JoinPoint joinPoint) {
    log.info("[before] {}", joinPoint.getSignature());
}
```



## @AfterReturning 

- 메서드 실행이 정상적으로 반환될 때 실행된다.
- returning 속성에 사용된 이름은 어드바이스 메서드의 매개변수 이름과 일치해야 한다.
- @Around 와 다르게 반환되는 객체를 변경할 수는 없다. 
  - 반환 객체를 변경하려면 @Around 를 사용해야한다. 
  - 참고로 반환 객체를 조작할 수 는 있다.

```java
@AfterReturning(value = "hello.aop.order.aop.Pointcuts.orderAndService()",
returning = "result")
public void doReturn(JoinPoint joinPoint, Object result) {
    log.info("[return] {} return={}", joinPoint.getSignature(), result);
}
```



##  @AfterThrowing 

- 메서드 실행이 예외를 던져서 종료될 때 실행



## @After 

- 메서드 실행이 종료되면 실행된다. (finally를 생각하면 된다.) 
- 정상 및 예외 반환 조건을 모두 처리한다.
- 일반적으로 리소스를 해제하는 데 사용한다.



## ProceedingJoinPoint

- 어드바이스에서 살펴본 MethodInvocation invocation 과 유사한 기능이다. 
- 내부에 실제 호출 대상, 전달 인자, 그리고 어떤 객체와 어떤 메서드가 호출되었는지 정보가 포함되어 있다.
- `joinPoint.proceed()` 메서드를 호출해서 실제 객체를 호출한다.
- ProceedingJoinPoint 는 org.aspectj.lang.JoinPoint 의 하위 타입이다.



**JoinPoint 인터페이스의 주요 기능**

- getArgs() : 메서드 인수를 반환합니다.
- getThis() : 프록시 객체를 반환합니다.
- getTarget() : 대상 객체를 반환합니다.
- getSignature() : 조언되는 메서드에 대한 설명을 반환합니다. 
- toString() : 조언되는 방법에 대한 유용한 설명을 인쇄합니다.



**ProceedingJoinPoint 인터페이스의 주요 기능**

- proceed() : 다음 어드바이스나 타켓을 호출한다.



## 사용 예시

- @Around 애노태이션의 값이 포인트 컷이 된다.
  - `execution(* hello.aop.order..*(..))`
  - 위 표현식의 의미는 ello.aop.order 패키지와 하위 패키지이다.
- @Around 애노테이션이 붙은 메서드가 Advice가 된다.
- 빈으로 등록하기 위해 @Component 애노테이션을 추가했다.
  - @Aspect가 붙은 빈을 통해 Advisor가 자동 생성되기 때문

```java
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;

@Slf4j
@Aspect
@Component
public class AspectV1 {

    @Around("execution(* hello.aop.order..*(..))")
    public Object doLog(ProceedingJoinPoint joinPoint) throws Throwable {
        log.info("[log] {}", joinPoint.getSignature()); //join point 시그니처
        return joinPoint.proceed();
    }
    
}
```



**포인트컷 분리**

- 앞 예시에서 @Around의 값으로 포인트 컷 지정이 가능하나 @Pointcut을 사용해서 별도로 분리할 수 있다.
- 별도로 분리된 포인트컷은 여러 어드바이스에서 함께 사용할 수 있다.

```java
@Slf4j
@Aspect
public class AspectV2 {

  // 메서드의 반환 타입은 void 코드 블록은 비워둔다. 포인트컷의 시그니처는 allOrder()
  @Pointcut("execution(* hello.aop.order..*(..))") 
  private void allOrder(){}

	// 포인트컷 시그니처를 사용해 포인트컷 참조가 가능하다.
  @Around("allOrder()")
  public Object doLog(ProceedingJoinPoint joinPoint) throws Throwable {
      log.info("[log] {}", joinPoint.getSignature());
      return joinPoint.proceed();
  }

}
```



**포인트컷 분리**

- 포인트컷을 공용으로 사용하기 위해 별도의 외부 클래스에 모아두었다.
- 접근 제어자를 public으로 변경

```java
package hello.aop.order.aop;
import org.aspectj.lang.annotation.Pointcut;

public class Pointcuts {
  //hello.springaop.app 패키지와 하위 패키지 
  @Pointcut("execution(* hello.aop.order..*(..))") 
  public void allOrder(){}

  //타입 패턴이 *Service
  @Pointcut("execution(* *..*Service.*(..))")
  public void allService() {}

  //allOrder && allService
  @Pointcut("allOrder() && allService()")
  public void orderAndService() {}
}
```



## Adive 순서 지정

- 어드바이스는 기본적으로 순서를 보장하지 않는다.
- 순서를 지정하고 싶다면 `org.springframework.core.annotation.@Order`를 사용한다.
- 하지만 클래스 단위로 적용되기 때문에 하나의 클래스에 여러 어드바이스가 있으면 순서를 보장할 수 없다.



**예시**

- 아래의 예시 처럼 @Aspect가 붙은 클래스 안에 하나의 Advice만 지정하고 @Order 애노테이션으로 순서를 지정했다.
- 순서는 낮을수록 우선순위가 높다.

```java
@Slf4j
public class AspectV5Order {
    @Aspect
    @Order(2)
    public static class LogAspect {
        @Around("hello.aop.order.aop.Pointcuts.allOrder()")
        public Object doLog(ProceedingJoinPoint joinPoint) throws Throwable {
            log.info("[log] {}", joinPoint.getSignature());
            return joinPoint.proceed();
        }
    }

    @Aspect
    @Order(1)
    public static class TxAspect {
        @Around("hello.aop.order.aop.Pointcuts.orderAndService()")
        public Object doTransaction(ProceedingJoinPoint joinPoint) throws
                Throwable {
            try {
                log.info("[트랜잭션 시작] {}", joinPoint.getSignature());
                Object result = joinPoint.proceed();
                log.info("[트랜잭션 커밋] {}", joinPoint.getSignature());
                return result;
            } catch (Exception e) {
                log.info("[트랜잭션 롤백] {}", joinPoint.getSignature());
                throw e;
            } finally {
                log.info("[리소스 릴리즈] {}", joinPoint.getSignature());
            }
        }
    }
    
}
```



# AOP 적용 방식

- 부가 기능이 적용되는 시점에는 크게 3가지가 있다.
  - 컴파일 시점
  - 클래스 로딩 시점
  - 런타임 시점(프록시)



## 컴파일 시점

- .java 소스 코드를 컴파일러를 사용해서 .class 를 만드는 시점에 부가 기능 로직을 추가한다.
- AspectJ가 제공하는 특별한 컴파일러를 사용해야 한다.
- AspectJ 컴파일러는 Aspect를 확인해서 해당 클래스가 적용 대상인지 먼저 확인하고, 적용 대상인 경우에 부가 기능 로직을 적용한다.
- 컴파일 시점에 부가 기능을 적용하려면 특별한 컴파일러도 필요하고 복잡하다.



## 클래스 로딩 시점

- `.class` 파일을 JVM 내부의 클래스 로더에 보관한다
- 이 파일이 JVM에 올라기기 전에 조작이 가능하다.
- 로드 타임 위빙은 자바를 실행할 때 특별한 옵션( java -javaagent )을 통해 클래스 로더 조작기를 지정해야 하는데, 이 부분이 번거롭고 운영하기 어렵다.



## 런타임 시점

- 스프링 컨테이너, DI, 빈 포스트 프로세서를 통해 부가 기능이 추가된 `프록시`를 실제 빈을 대체해서 빈으로 등록한다.
- 프록시를 사용하기 때문에 AOP 기능에 일부 제약이 있다.



## 비교

- AspectJ를 사용해서 컴파일 시점과 클래스 로딩 시점에 적용하는 AOP는 바이트코드를 실제 조작하기 때문에 해당 기능을 모든 지점에 다 적용할 수 있다.
- 프록시 방식을 사용하는 스프링 AOP는 메서드 실행 지점에만 AOP를 적용할 수 있다.
  - 생성자나 static 메서드, 필드 값 접근에는 프록시 개념이 적용될 수 없다.
  - 프록시를 사용하는 `스프링 AOP의 조인 포인트는 메서드 실행으로 제한`된다.
- 프록시 방식을 사용하는 `스프링 AOP는 스프링 컨테이너가 관리할 수 있는 스프링 빈에만 AOP를 적용`할 수 있다.
