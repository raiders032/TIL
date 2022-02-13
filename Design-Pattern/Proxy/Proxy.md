# 1 Proxy Pattern

* **클라이언트**는 의뢰인이라는 뜻이고, **서버**는 '서비스나 상품을 제공하는 사람이나 물건'을 뜻하는 서버-클라이언트 구조를 생각해보자
* 이 개념을 **네트워크**에 도입하면 **클라이언트는 웹 브라우저**가 되고, 요청을 처리하는 **서버는 웹 서버**가 된다.
* 이 개념을 **객체**에 도입하면, **요청하는 객체는 클라이언트**가 되고, **요청을 처리하는 객체는 서버**가 된다.
* 일반적으로 클라이언트가 서버를 직접 호출하고, 처리 결과를 직접 받는다. 이것을 직접 호출이라 한다.
* 클라이언트가 요청한 결과를 서버에 직접 요청하는 것이 아니라 어떤 대리자를 통해서 대신 간접적으로 서버에 요청할 수 있다
  * 여기서 대리자를 **프록시**라 한다.



## 1.1 GOF의 정의

* 프록시 패턴과 데코레이터 패턴은 둘다 프록시를 사용하지만 의도에 따라서 구분한다.
  * 프록시 패턴: 접근 제어가 목적
  * 데코레이터 패턴: 새로운 기능 추가가 목적
  * [Decorator.md](../Decorator/Decorator.md) 참고

> 프록시라는 개념은 클라이언트 서버라는 큰 개념안에서 자연스럽게 발생할 수 있다. 프록시는 객체안에서의 개념도 있고, 웹 서버에서의 프록시도 있다. 객체안에서 객체로 구현되어있는가, 웹 서버로 구현되어 있는가 처럼 규모의 차이가 있을 뿐 근본적인 역할은 같다.



# 2 Proxy의 역할

* 클라이언트는 서버에게 요청을 한 것인지, 프록시에게 요청을 한 것인지 조차 몰라야 한다. 
  * 따라서 **서버와 프록시는 같은 인터페이스를 사용**해야 한다.
  * 클라이언트가 사용하는 서버 객체를 프록시 객체로 변경해도 클라이언트 코드를 변경하지 않고 동작할 수 있어야 한다.
* 프록시는 클라이언트와 서버 중간에 위치하며 아래와 같은 기능을 한다.



## 2.1 Proxy의 주요 기능

* 접근 제어
  * 권한에 따른 접근 차단
  * 캐싱
  * 지연 로딩
* 부가 기능 추가
  * 서버가 제공하는 기능에 더해 부가 기능을 수행한다
  * 로그 서비스
  * 요청이나 응답 값 중간 수정



# 3 Proxy Pattern 예제 코드

* 서버의 응답을 캐시에 클라이언트의 접근을 제어하는 프록시를 만들어보자



**Server 인터페이스**

* 클라이언트가 의존하는 인터페이스

```java
public interface Server {
  String operation();
}
```



**RealServer 클래스**

* 실제 서버로 Server 인터페이스를 구현

```java
@Slf4j
public class RealServer implements Server {
  @Override
  public String operation() {
    log.info("실제 객체 호출");
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



**CacheProxy 클래스**

* 프록시로 서버와 같은 Server 인터페이스를 구현한다.

```java
@Slf4j
public class CacheProxy implements Server {
  private Subject target;
  private String cacheValue;

  public CacheProxy(Subject target) {
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



**Test 코드**

* 클라이언트가 실제 서버를 의존하고 있다.
* 런타임 객체 의존 관계: client -> realServer

```java
@Test
void noProxyTest() {
  RealServer realServer = new RealServer();
  ProxyPatternClient client = new ProxyPatternClient(realServer);
  client.execute();
  client.execute();
  client.execute();
}
```

```
RealServer - 실제 객체 호출 
RealServer - 실제 객체 호출 
RealServer - 실제 객체 호출
```



**Test 코드: Proxy Pattern**

* 클라이언트가 프록시를 의존하고 있다.
* 런타임 객체 의존 관계: client -> cacheProxy -> realServer
* 클라이언트와 서버 사이에 프록시가 존재에 접근 제어
  * `RealServer - 실제 객체 호출` 이 한번만 일어났다

```java
@Test
void cacheProxyTest() {
  Server realServer = new RealServer();
  Server cacheProxy = new CacheProxy(realServer);
  ProxyPatternClient client = new ProxyPatternClient(cacheProxy);
  client.execute();
  client.execute();
  client.execute();
}
```

```
CacheProxy - 프록시 호출 
RealServer - 실제 객체 호출 
CacheProxy - 프록시 호출 
CacheProxy - 프록시 호출
```



참고

* [스프링 핵심 원리 - 고급편](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B3%A0%EA%B8%89%ED%8E%B8/dashboard)
