# 1 Template Callback

* Template Callback 패턴은 탬플릿 메서드 패턴처럼 **변하는 것과 변하지 않는 것을 분리**하는 것이 핵심이다
  * [Template-Method.md](../Template-Method/Template-Method.md) 참고
* Template Callback 패턴은 더 유연한 Strategy 패턴이다
  * [Strategy.md](../Strategy/Strategy.md) 참고
  * 참고로 템플릿 콜백 패턴은 GOF 패턴은 아니고, 스프링 내부에서 이런 방식을 자주 사용하기 때문에, 스프링 안에서만 이렇게 부른다. 
  * 전략 패턴에서 템플릿과 콜백 부분이 강조된 패턴이라 생각하면 된다.
* 기존 Strategy 패턴처럼 Context의 내부 필드에 Strategy를 두고는 것이 아니라 Context에 실행 시점에 여러 전략을 인수로 전달받아 실행
  * [Behavior-Parameterization.md](../../Language/Java/Behavior-Parameterization/Behavior-Parameterization.md) 참고
* 클라이언트는 Context 를 실행하는 시점에 원하는 Strategy 를 전달할 수 있다.
* **Context는 변하지 않는 템플릿** 역할을 한다. 그리고 **변하는 부분은 파라미터로 넘어온 Strategy**의 코드를 실행해서 처리한다. 
* 이렇게 다른 코드의 인수로서 넘겨주는 실행 가능한 코드를 콜백(callback)이라 한다.



> #### 콜백 정의
>
> 프로그래밍에서 콜백(callback) 또는 콜애프터 함수(call-after function)는 다른 코드의 인수로서 넘겨주는 실행 가능한 코드를 말한다. 콜백을 넘겨받는 코드는 이 콜백을 필요에 따라 즉시 실행할 수도 있고, 아니면 나중에 실행할 수도 있다.

> #### 자바에서 콜백
>
> * 자바 언어에서 실행 가능한 코드를 인수로 넘기려면 객체가 필요하다. 자바8부터는 람다를 사용할 수 있다. 
> * 자바 8 이전에는 보통 하나의 메소드를 가진 인터페이스를 구현하고, 주로 익명 내부 클래스를 사용했다. 
> * 최근에는 주로 람다를 사용한다.

> #### Template
>
> 스프링에서는 JdbcTemplate , RestTemplate , TransactionTemplate , RedisTemplate 처럼 다양한 템플릿 콜백 패턴이 사용된다. 스프링에서 이름에 XxxTemplate 가 있다면 템플릿 콜백 패턴으로 만들어져 있다 생각하면 된다.



# 2 Template

## 2.1 Callback

* 콜백 로직을 전달할 인터페이스이다.

```java
public interface Callback {
  void call();
}
```



## 2.2 Template

* Template은 변하지 않는 로직을 가지고 있다.
* 변하는 로직은 Callback에 담겨 인수로 전달된다.

```java
@Slf4j
public class TimeLogTemplate {
  public void execute(Callback callback) {
    long startTime = System.currentTimeMillis(); 
    //비즈니스 로직 실행
    callback.call(); //위임
    //비즈니스 로직 종료
    long endTime = System.currentTimeMillis();
    long resultTime = endTime - startTime;
    log.info("resultTime={}", resultTime);
  }
}
```

# 3 사용

* Context에 실행 시점에 여러 전략을 인수로 전달해 유연한 사용이 가능 하다

```java
@Test
void callbackV2() {
  TimeLogTemplate template = new TimeLogTemplate(); 
  template.execute(() -> log.info("비즈니스 로직1 실행")); 
  template.execute(() -> log.info("비즈니스 로직2 실행"));
}
```



참고

* [스프링 핵심 원리 - 고급편](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B3%A0%EA%B8%89%ED%8E%B8/dashboard)