# 1 Proxy Pattern

* **클라이언트**는 의뢰인이라는 뜻이고, **서버**는 '서비스나 상품을 제공하는 사람이나 물건'을 뜻하는 서버-클라이언트 구조를 생각해보자
* 이 개념을 **네트워크**에 도입하면 **클라이언트는 웹 브라우저**가 되고, 요청을 처리하는 **서버는 웹 서버**가 된다.
* 이 개념을 **객체**에 도입하면, **요청하는 객체는 클라이언트**가 되고, **요청을 처리하는 객체는 서버**가 된다.

<br>

**직접 호출**![image-20220605131942071](./images/1.png)

* 일반적으로 클라이언트가 서버를 직접 호출하고, 처리 결과를 직접 받는다. 
* 이것을 직접 호출이라 한다.



**프록시를 통한 간접 호출**![image-20220605131959907](./images/2.png)

* 클라이언트가 요청한 결과를 서버에 직접 요청하는 것이 아니라 어떤 대리자를 통해서 대신 간접적으로 서버에 요청할 수 있다
* 여기서 대리자를 **프록시**라 한다

<br>

# 2 Proxy의 역할

* 클라이언트는 서버에게 요청을 한 것인지, 프록시에게 요청을 한 것인지 조차 몰라야 한다. 
* **따라서 서버와 프록시는 같은 인터페이스를 사용**해야 한다.
* 같은 인터페이스를 사용하기 때문에 클라이언트가 사용하는 서버 객체를 프록시 객체로 변경해도 클라이언트 코드를 변경하지 않고 동작할 수 있다
* 프록시는 클라이언트와 서버 중간에 위치하며 아래와 같은 기능을 한다.

<br>

**클래스 의존 관계**

![image-20220605132405590](./images/3.png)

* 클라이언트는 ServerInterface에 의존하고 있으며 Server와 Proxy는 같은 인터페이스를 구현하고 있다

<br>

**런타임 객체 의존 관계**

![image-20220605132621229](./images/4.png)

![image-20220605132516978](/Users/YT/GoogleDrive/dev/TIL/Design-Pattern/Proxy/images/5.png)

* 런타임 객체 의존 관계가 클라이언트 -> Server인 상태에서 DI를 사용해서 Server 대신 Proxy를 주입해도 클라이언트의 코드를 변경하지 않아도 된다
* 같은 인터페이스를 사용하기 때문에 Server를 Proxy로 교체해도 예전처럼 그대로 사용가능 

<br>

## 2.1 Proxy의 주요 기능

* 프록시에의 주요 기능에는 크게 2가지로 구분된다

<br>

**접근 제어**

* 권한에 따른 접근 차단
* 캐싱
* 지연 로딩

<br>

**부가 기능 추가**

* 서버가 제공하는 기능에 더해 부가 기능을 수행한다
* 로그 서비스
* 요청이나 응답 값 중간 수정
* 부가 기능 추가의 목적을 가진 프록시 패턴을 데코레이터 패턴이라 부른다

<Br>

## 2.2 GOF의 Proxy 정의

* 프록시 패턴과 데코레이터 패턴은 둘다 프록시를 사용하지만 의도에 따라서 구분한다.
	* 프록시 패턴: **접근 제어가 목적**
	* 데코레이터 패턴: **새로운 기능 추가가 목적**
	* [Decorator.md](../Decorator/Decorator.md) 참고


> 프록시라는 개념은 클라이언트 서버라는 큰 개념안에서 자연스럽게 발생할 수 있다. 프록시는 객체안에서의 개념도 있고, 웹 서버에서의 프록시도 있다. 객체안에서 객체로 구현되어있는가, 웹 서버로 구현되어 있는가 처럼 규모의 차이가 있을 뿐 근본적인 역할은 같다.

<br>

# 3 Proxy Pattern 예제 코드

* 서버의 응답을 캐시에 클라이언트의 접근을 제어하는 프록시를 만들어보자

<br>

## 3.1 Client 클래스

* 클라이언트 클래스로 Subject 인터페이스를 의존하고 있다

```java
public class Client {

  private Subject subject;

  public Client(Subject subject) {
    this.subject = subject;
  }

  public void execute() {
    subject.operation();
  }

}
```

<br>

## 3.2 Subject 인터페이스

* 클라이언트가 의존하는 인터페이스
* Subject 인터페이스는 단순히 operation() 메서드 하나만 가지고 있다.

```java
public interface Subject {
    String operation();
}
```

<br>

## 3.3 RealSubject 클래스

* Server 인터페이스를 구현한 구현체
* operation() 메서드는 호출할 때 마다 시스템에 큰 부하를 주는 데이터 조회를 시뮬레이션한 것으로 1초가 소요됨

```java
@Slf4j
public class RealSubject implements Subject {
  @Override
  public String operation() {
    log.info("RealSubject 호출");
    sleep(1000);
    return "data";
  }

  private void sleep(int millis) {
    try {
      Thread.sleep(millis);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
  }
}
```

<br>

## 3.4 클래스 의존 관계


![[6.png]]

<br>

**런타임 객체 의존 관계**

* 런타임에는 클라이언트 객체는 realSubject 객체를 의존하고 있다

![image-20220605134122765](./images/7.png)

<br>

## 3.5 테스트 코드

```java
@Test
void noProxyTest() {
  RealSubject realSubject = new RealSubject();
  Client client = new Client(realSubject);
  client.execute();
  client.execute();
  client.execute();
}
```

* RealSubject 객체를 만들어 Client에 의존성 주입 후 `client.execute()` 메서드 3회 호출
* 아래는 테스트 결과로 RealSubject 호출한 것을 볼 수 있다
* 바로 위 그림에서 런타임 객체 의존 관계가 client -> realSubject 이기 때문

```
RealSubject - RealSubject 호출
RealSubject - RealSubject 호출
RealSubject - RealSubject 호출
```



## 3.6 프록시 패턴 적용

* 테스트 코드를 통해 데이터를 조회하는 데 3초 가량 소요되었다
* 만약 데이터가 변하지 않는 데이터라면 데이터를 캐싱해두고 캐싱된 데이터를 조회하는 것이 성능상 좋다
* 이처럼 캐시를 적용하고 싶다면 프록시 패턴를 이용할 수 있다
  * 캐시는 프록시 패턴의 주요 기능 중 접근 제어 기능이다



**Proxy 클래스**

![image-20220605140048751](./images/8.png)

* Proxy는 Subject 인터페이스를 구현한다.
* RealSubject도 Subject 인터페이스를 구현해 Proxy와 RealSubject는 인터페이스가 같음

![image-20220605140103421](./images/9.png)

* proxy는 client와 realSubject 사이에 존재하기 때문에 realSubject 객체를 참조하고 있다
* 따라서 런타임 시 객체 의존 관계는 `client -> proxy -> realSubject`
* client는 realSubject의 operation 메서드를 직접 호출하지 않고 proxy의 operation 메서드를 호출하게 된다
* proxy의 operation 메서드는 아래와 같이 작동한다
	* 프록시는 캐싱된 값이 없으면 realSubject의 operation 메서드를 호출하고 결과 값을 `cacheValue` 변수에 저장한다
	* 캐싱된 값이 있으면 realSubject의 operation 메서드를 호출하지 않고 캐싱된 `cacheValue` 의 값을 반환한다



**Proxy.java**

* 프록시도 실제 객체와 그 모양이 같아야 하기 때문에 Subject 인터페이스를 구현
* `private Subject target` 
	* 클라이언트가 프록시를 호출하면 프록시가 최종적으로 실제 객체를 호출
	* 따라서 내부에 실제 객체의 참조를 가지고 있어야 한다

```java
@Slf4j
public class Proxy implements Subject {
    private Subject target;
    private String cacheValue;

    public Proxy(Subject target) {
        this.target = target;
    }

    @Override
    public String operation() {
        log.info("프록시 호출");
        if (cacheValue == null) {
            cacheValue = target.operation();
        }
        return cacheValue;
    }

}
```



## 3.7 프록시 적용 Test 코드

* 클라이언트가 프록시를 의존하고 있다.
* 런타임 객체 의존 관계: client -> proxy -> realSubject
* 클라이언트와 서버 사이에 프록시가 존재에 접근 제어
	* `RealSubject - 실제 객체 호출` 이 한번만 일어났다

```java
@Test
void cacheProxyTest() {
  Subject realSubject = new RealSubject();
  Subject proxy = new Proxy(realSubject);
  Client client = new Client(proxy);
  client.execute();
  client.execute();
  client.execute();
}
```

**실행결과**

```
Proxy - 프록시 호출
RealSubject - RealSubject 호출
Proxy - 프록시 호출
Proxy - 프록시 호출
```



## 3.8 결론

* 프록시 패턴의 핵심은 접근 제어 또는 새로운 기능의 추가를 Client의 코드 변경없이 추가할 수 있다는 점

<br>

# 4 JDK 동적 프록시

- 프록시를 적용하기 위해 적용 대상의 숫자 만큼 많은 프록시 클래스를 만들어야 한다.
- 적용 대상이 100 개면 프록시 클래스도 100개 만들어야 한다.
- 프록시의 로직은 같은데, 적용 대상만 차이가 있는 경우 동적 프록시 기술을 사용하면 개발자가 직접 프록시 클래스를 만들지 않아도 된다.
- 자바가 기본으로 제공하는 JDK 동적 프록시 기술이나 CGLIB 같은 프록시 생성 오픈소스 기술을 활용하면 프록시 객체를 동적으로 만들어낼 수 있다.



> 주의
>
> JDK 동적 프록시는 인터페이스를 기반으로 프록시를 동적으로 만들어준다. 따라서 인터페이스가 필수이다. 인터페이스 없이 클래스만 있는 경우에는 CGLIB 라는 바이트코드를 조작하는 특별한 라이브러리를 사용해야 한다.

<br>

**예시**

```java
public interface AInterface {
  String call();
}
```

```java
@Slf4j
public class AImpl implements AInterface {
  
  @Override
  public String call() {
    log.info("A 호출");
    return "a"; }

}
```

```java
public interface BInterface {
  String call();
}
```

```java
@Slf4j
public class BImpl implements BInterface {
  
  @Override
  public String call() {
    log.info("B 호출");
    return "b"; }

}
```

- AInterface와 BInterface가 존재하고 각각 구현체인 AImpl과 BImpl가 있다.

<br>

## 4.1 InvocationHandler

```java
package java.lang.reflect;

public interface InvocationHandler {
  public Object invoke(Object proxy, Method method, Object[] args) throws Throwable;
}
```

- JDK 동적 프록시에 적용할 로직은 InvocationHandler 인터페이스의 invoke 메서드를 구현하면 된다.
- `Object proxy` : 프록시 자신
- `Method method` : 호출한 메서드
- `Object[] args` : 메서드를 호출할 때 전달한 인수

<br>

## 4.2 프록시 기능 구현

```java
import lombok.extern.slf4j.Slf4j;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

@Slf4j
public class TimeInvocationHandler implements InvocationHandler {
  private final Object target;

  public TimeInvocationHandler(Object target) {
    this.target = target;
  }

  @Override
  public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
    log.info("TimeProxy 실행");
    long startTime = System.currentTimeMillis();
    
    Object result = method.invoke(target, args);
    
    long endTime = System.currentTimeMillis();
    long resultTime = endTime - startTime; 
    log.info("TimeProxy 종료 resultTime={}", resultTime); 
    return result;
  } 
}
```

- TimeInvocationHandler는 InvocationHandler를 구현한다.
- TimeInvocationHandler에 공통 로직을 구현한다.
- Object target은 동적 프록시가 호출할 대상이다.
- `method.invoke(target, args)` 리플렉션을 사용해서 target 인스턴스의 메서드를 실행하면서 인자를 넘겨준다

<br>

## 4.3 프록시 생성

```java
@Slf4j
public class JdkDynamicProxyTest {

  @Test
  void dynamicA() {
    AInterface target = new AImpl();
    TimeInvocationHandler handler = new TimeInvocationHandler(target);
    AInterface proxy = (AInterface)Proxy
      .newProxyInstance(AInterface.class.getClassLoader(), 
                        new Class{AInterface.class}, handler);
    proxy.call();
    log.info("targetClass={}", target.getClass());
    log.info("proxyClass={}", proxy.getClass());
  }

  @Test
  void dynamicB() {
    BInterface target = new BImpl();
    TimeInvocationHandler handler = new TimeInvocationHandler(target);
    BInterface proxy = (BInterface)Proxy
      .newProxyInstance(BInterface.class.getClassLoader(), 
                        new Class[]{BInterface.class}, handler);
    proxy.call();
    log.info("targetClass={}", target.getClass());
    log.info("proxyClass={}", proxy.getClass());
  }
}

```

- `new TimeInvocationHandler(target)`는 동적 프록시에 적용할 핸들러 로직이다.
- 동적 프록시는 `java.lang.reflect.Proxy` 를 통해서 생성할 수 있다.
	-  `Proxy.newProxyInstance()`
	- 클래스 로더 정보, 인터페이스, 그리고 핸들러 로직을 넣어주면 된다. 
	- 그러면 해당 인터페이스를 기반으로 동적 프록시를 생성하고 그 결과를 반환한다.

<br>

출력 내용

```
TimeInvocationHandler - TimeProxy 실행
AImpl - A 호출
TimeInvocationHandler - TimeProxy 종료 resultTime=0
JdkDynamicProxyTest - targetClass=class hello.proxy.jdkdynamic.code.AImpl JdkDynamicProxyTest - proxyClass=class com.sun.proxy.$Proxy1
```

<br>

## 4.4 제약

- JDK 동적 프록시는 인터페이스를 기반으로 프록시를 동적으로 만들어준다. 
- 따라서 인터페이스가 필수이다. 
- 인터페이스 없이 클래스만 있는 경우에는 CGLIB라는 바이트코드를 조작하는 특별한 라이브러리를 사용해야 한다.

<br>

# 5 CGLIB

- Code Generator Library
- CGLIB는 바이트코드를 조작해서 동적으로 클래스를 생성하는 기술을 제공하는 라이브러리이다.
- CGLIB를 사용하면 인터페이스가 없어도 구체 클래스만 가지고 동적 프록시를 만들어낼 수 있다.

<br>

## 5.1 MethodInterceptor

- JDK 동적 프록시에서 실행 로직을 위해 InvocationHandler 를 제공했듯이, CGLIB는 MethodInterceptor 를 제공한다.

<br>

**MethodInterceptor 인터페이스**

```java
package org.springframework.cglib.proxy;

public interface MethodInterceptor extends Callback {
  Object intercept(
	  Object obj, 
	  Method method, 
	  Object[] args, 
	  MethodProxy proxy) throws Throwable;
}
```

- obj : CGLIB가 적용된 객체
- method : 호출된 메서드
- args : 메서드를 호출하면서 전달된 인수
- proxy : 메서드 호출에 사용

<br>

## 5.2 프록시 기능 구현

```java
import lombok.extern.slf4j.Slf4j;  
import org.springframework.cglib.proxy.MethodInterceptor;  
import org.springframework.cglib.proxy.MethodProxy;  
  
import java.lang.reflect.Method;  
  
@Slf4j  
public class TimeMethodInterceptor implements MethodInterceptor {  
    private final Object target;  
  
    public TimeMethodInterceptor(Object target) {  
        this.target = target;  
    }  
  
    @Override  
    public Object intercept(Object obj,  
                            Method method,  
                            Object[] args,  
                            MethodProxy proxy) throws Throwable {  
        log.info("TimeProxy 실행");  
        long startTime = System.currentTimeMillis();  
        Object result = proxy.invoke(target, args);  
        long endTime = System.currentTimeMillis();  
        long resultTime = endTime - startTime;  
        log.info("TimeProxy 종료 resultTime={}", resultTime);  
        return result;  
    }  
}
```

- 메서드 실행 시간을 측정하는 부가 기능을 가진 프록시 기능을 구현했다.
- RealSubject 클래스의 메서드를 호출할 때 method와 proxy 둘다 사용이 가능하다.
	- CGLIB는 성능상 MethodProxy proxy 를 사용하는 것을 권장한다.

<br>

## 5.3 프록시 생성

```java
import org.springframework.cglib.proxy.Enhancer;

ConcreteService target = new ConcreteService();  

// CGLIB는 Enhancer를 사용해서 프록시를 생성한다.
Enhancer enhancer = new Enhancer();

// CGLIB는 구체 클래스를 상속 받아서 프록시를 생성할 수 있다.
// 어떤 구체 클래스를 상속 받을지 지정한다.
enhancer.setSuperclass(ConcreteService.class);

// 프록시에 적용할 실행 로직을 할당한다
enhancer.setCallback(new TimeMethodInterceptor(target));  

// 프록시를 생성한다
ConcreteService proxy = (ConcreteService)enhancer.create();  
log.info("targetClass={}", target.getClass());  
log.info("proxyClass={}", proxy.getClass());  

proxy.call();
```

<br>

## 5.4 제약

- CGLIB는 자식 클래스를 동적으로 생성하기 때문에 기본 생성자가 필요하다.
- 클래스에 final 키워드가 붙으면 CGLIB을 사용할 수 없다.
- 메서드에 final 키워드가 붙으면 해당 메서드를 오버라이딩 할 수 없다.

<br>

참고

* [스프링 핵심 원리 - 고급편](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B3%A0%EA%B8%89%ED%8E%B8/dashboard)
