# 1 Strategy

* Strategy 패턴은 탬플릿 메서드 패턴처럼 **변하는 것과 변하지 않는 것을 분리**하는 것이 핵심이다
* 전략 패턴은 **변하지 않는 부분을 Context** 라는 곳에 두고, **변하는 부분을 Strategy** 라는 인터페이스를 만들고 해당 인터페이스를 구현하도록 해서 문제를 해결한다. 
  * Context: 변하지 않는 템플릿 역할
  * Strategy: 변하는 알고리즘 역할을 한다.

* 전략 패턴의 핵심은 Context 는 Strategy 인터페이스에만 의존한다는 점이다. 
  * 덕분에 Strategy 의 구현체를 변경하거나 새로 만들어도 Context 코드에는 영향을 주지 않는다.




> #### GOF의 Strategy 정의
>
> 알고리즘 제품군을 정의하고 각각을 캡슐화하여 상호 교환 가능하게 만들자. 
>
> 전략을 사용하면 알고리즘을 사용하는 클라이언트와 독립적으로 알고리즘을 변경할 수 있다.



## 1.1 탬플릿 메서드 패턴과 비교

* 탬플릿 메서드 패턴은 **부모 클래스에 변하지 않는 템플릿**을 두고, **변하는 부분을 자식 클래스**에 두어서 **상속**을 사용해서 문제를 해결했다.
* 전략 패턴은 **변하지 않는 부분을 Context** 라는 곳에 두고, **변하는 부분을 Strategy** 라는 인터페이스를 만들고 해당 인터페이스를 구현하도록 해서 문제를 해결한다. 
* Strategy 패턴은 상속이 아니라 **위임**으로 문제를 해결하는 것이다.
* [Template-Method.md](../Template-Method/Template-Method.md)



## 1.2 탬플릿 콜백 패턴과 비교

**Strategy 패턴**

* Strategy 패턴은 Context의 내부 필드에 Strategy 를 두고 사용한다.
* 이 방식은 Context 와 Strategy 를 실행 전에 원하는 모양으로 조립해두고, 그 다음에 Context 를 실행하는 선 조립, 후 실행 방식에서 매우 유용하다.
* 이 방식의 단점은 Context 와 Strategy 를 조립한 이후에는 전략을 변경하기가 번거롭다는 점이다. 
* 물론 Context 에 setter 를 제공해서 Strategy 를 넘겨 받아 변경하면 되지만, Context 를 싱글톤으로 사용할 때는 동시성 이슈 등 고려할 점이 많다. 
* 그래서 전략을 실시간으로 변경해야 하면 차라리 이전에 개발한 테스트 코드 처럼 Context 를 하나더 생성하고 그곳에 다른 Strategy 를 주입하는 것이 더 나은 선택일 수 있다.

**탬플릿 콜백 패턴**

* 더 유연한 Strategy 패턴
* 기존 Strategy 패턴처럼 Context의 내부 필드에 Strategy를 두고는 것이 아니라 Context 에 실행 시점에 여러 전략을 인수로 전달받아 실행
  * [Behavior-Parameterization.md](../../Language/Java/Behavior-Parameterization/Behavior-Parameterization.md) 참고
* 클라이언트는 Context 를 실행하는 시점에 원하는 Strategy 를 전달할 수 있다.
* [Template-Callback.md](../Template-Callback/Template-Callback.md) 참고



# 2 구성

![image-20211104204536362](./images/image1.png)



## 2.1 Strategy 인터페이스

* 이 인터페이스는 변하는 알고리즘 역할을 한다.

```java
public interface Strategy {
  void call();
}
```



## 2.2 Strategy 인터페이스 구현

* 변하는 알고리즘은 Strategy 인터페이스를 구현하면 된다.

```java
@Slf4j
public class StrategyLogic1 implements Strategy {
  @Override
  public void call() {
    log.info("비즈니스 로직1 실행"); }
}
```

```java
@Slf4j
public class StrategyLogic2 implements Strategy {
  @Override
  public void call() {
    log.info("비즈니스 로직2 실행"); }
}
```



## 2.3 Context

* 컨텍스트는 변하지 않는 로직을 가지고 있는 템플릿 역할을 하는 코드이다. 
  * 텍스트(문맥)는 크게 변하지 않지만, 그 문맥 속에서 strategy 를 통해 일부 전략이 변경된다
* 전략 패턴의 핵심은 Context 는 Strategy 인터페이스에만 의존한다는 점이다. 
  * 덕분에 Strategy의 구현체를 변경하거나 새로 만들어도 Context 코드에는 영향을 주지 않는다.
  * 바로 스프링에서 의존관계 주입에서 사용하는 방식이 바로 전략 패턴이다.



**ContextV1.java**

* Context 클래스는 변하지 않는 로직을 가지고 있는 템플릿 역할을 한다
* Context 클래스는 변하는 로직인 Strategy를 필드로 가지고 있다
* 변하는 로직을 Strategy 인터페이스를 구현한 구현체에 작성해서 Context 객체에 주입해서 사용한다.

```java
@Slf4j
public class ContextV1 {
  private Strategy strategy;

  public ContextV1(Strategy strategy) {
    this.strategy = strategy;
  }

  public void execute() {
    long startTime = System.currentTimeMillis(); 
    
    //비즈니스 로직 실행
    strategy.call(); //위임
    //비즈니스 로직 종료

    long endTime = System.currentTimeMillis();
    long resultTime = endTime - startTime;
    log.info("resultTime={}", resultTime);
  }
}
```



# 3 사용



## 3.1 Strategy 인터페이스 구현

* 컨텍스트에 원하는 전략(변하는 로직)의 구현체를 주입해 사용한다.

```java
@Test
void strategyV1() {
  // context에 StrategyLogic1를 주입해 사용
  Strategy strategyLogic1 = new StrategyLogic1();
  ContextV1 context1 = new ContextV1(strategyLogic1);
  context1.execute();
  
  // context에 StrategyLogic2 주입해 사용
  Strategy strategyLogic2 = new StrategyLogic2();
  ContextV1 context2 = new ContextV1(strategyLogic2);
  context2.execute();
}
```

```
StrategyLogic1 - 비즈니스 로직1 실행 
ContextV1 - resultTime=3
StrategyLogic2 - 비즈니스 로직2 실행 
ContextV1 - resultTime=0
```



## 3.2 Anonymous Class 사용

* Strategy 인터페이스 구현을 한번만 사용한다면 아래와 같이 Anonymous Class를 사용해 구현 클래스의 선언과 동시에 인스턴스화 가능
* 출력 결과를 보면 익명 내부 클래스가 생성된 것을 확인할 수 있다

```java
@Test
void strategyV2() {
  Strategy strategyLogic1 = new Strategy() {
    @Override
    public void call() {
      log.info("비즈니스 로직1 실행");
    }
  };
  log.info("strategyLogic1={}", strategyLogic1.getClass());
  ContextV1 context1 = new ContextV1(strategyLogic1);
  context1.execute();

  Strategy strategyLogic2 = new Strategy() {
    @Override
    public void call() {
      log.info("비즈니스 로직2 실행");
    }
  };
  log.info("strategyLogic2={}", strategyLogic2.getClass());
  ContextV1 context2 = new ContextV1(strategyLogic2);
  context2.execute();
}
```

```
ContextV1Test - strategyLogic1=class 
hello.advanced.trace.strategy.ContextV1Test$1 
ContextV1Test - 비즈니스 로직1 실행
ContextV1 - resultTime=0

ContextV1Test - strategyLogic2=class 
hello.advanced.trace.strategy.ContextV1Test$2 
ContextV1Test - 비즈니스 로직2 실행
ContextV1 - resultTime=0
```



## 3.3 람다 사용

* 위에 Anonymous Class는 장황하다 코드를 더 깔끔하게 하려면 람다를 사용한다.

```java
@Test
void strategyV4() {
  ContextV1 context1 = new ContextV1(() -> log.info("비즈니스 로직1 실행"));
  context1.execute();
  ContextV1 context2 = new ContextV1(() -> log.info("비즈니스 로직2 실행"));
  context2.execute();
}
```



참고

* [스프링 핵심 원리 - 고급편](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B3%A0%EA%B8%89%ED%8E%B8/dashboard)