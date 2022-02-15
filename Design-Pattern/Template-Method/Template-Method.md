# 1 Template Method

* **변하는 것과 변하지 않는 것을 분리**
  * 좋은 설계는 변하는 것과 변하지 않는 것을 분리하는 것이다.
* 이 둘을 분리해서 모듈화해야 할 때 템플릿 메서드 패턴(Template Method Pattern)을 사용한다.
* 부모 클래스에 알고리즘의 **골격인 템플릿**을 정의하고, 일부 **변경되는 로직**은 자식 클래스에 정의하는 것이다. 
* 이렇게 하면 자식 클래스가 알고리즘의 **전체 구조를 변경하지 않고**, **특정 부분만 재정의**할 수 있다. 
* 결국 상속과 오버라이딩을 통한 다형성으로 문제를 해결하는 것이다.

> 템플릿 메서드 디자인 패턴의 목적은 다음과 같습니다.
>
> "작업에서 알고리즘의 골격을 정의하고 일부 단계를 하위 클래스로 연기합니다. 템플릿 메서드를 사용하면
> 하위 클래스가 **알고리즘의 구조**를 변경하지 않고도 알고리즘의 **특정 단계를 재정의**할 수 있습니다." [GOF]



# 2 Template Method 적용

* 로그를 출력하는 템플릿 메소드 패턴을 만들어보자



**AbstractTemplate.java**

* AbstractTemplate 은 템플릿 메서드 패턴에서 부모 클래스이고, 템플릿 역할을 한다.
  * 알고리즘의 골격 역할을 한다.

* 템플릿 코드 중간에 call() 메서드를 통해서 변하는 부분을 처리한다.
* abstract T call() 은 변하는 부분을 처리하는 메서드이다.
  * 변경되는 로직은 자식 클래스에서 구현한다.


```java
public abstract class AbstractTemplate<T> {
  private final LogTrace trace;
  
  public AbstractTemplate(LogTrace trace) {
    this.trace = trace;
  }
  
  // 변하지 않는 부분(템플릿)
  public T execute(String message) {
    TraceStatus status = null;
    try {
      status = trace.begin(message); 
      
      // 로직 호출(변하는 부분)
      T result = call();
      
      trace.end(status);
      return result;
    } catch (Exception e) {
      trace.exception(status, e);
      throw e; }
  }
  
  // 변하는 부분
  protected abstract T call();
}

```



# 3 사용

## 3.1 상속

* AbstractTemplate를 상속한 자식 클래스를 구현
* 변경되는 로직을 자식 클래스에서 오버라이딩한다.

**SubClassLogic1.java**

```java
@Slf4j
public class SubClassLogic1 extends AbstractTemplate {
  @Override
  protected void call() {
    log.info("비즈니스 로직1 실행"); }
}
```



## 3.2 Anonymous Class

* 클래스를 별도로 만들기를 원치 않는다면 Anonymous Class를 사용한다.
  * 객체를 생성하면서 AbstractTemplate 를 상속받은 자식 클래스를 정의함.
  * 따라서 별도의 자식 클래스를 직접 만들지 않아도 된다.

```java
@RestController
@RequiredArgsConstructor
public class OrderControllerV4 {
  private final OrderServiceV4 orderService;
  private final LogTrace trace;
  @GetMapping("/v4/request")
  public String request(String itemId) {
    
    AbstractTemplate<String> template = new AbstractTemplate<>(trace) {
      @Override
      protected String call() {
        orderService.orderItem(itemId);
        return "ok";
      } };
    
    return template.execute("OrderController.request()");
  }
}
```



# 4 한계

* 템플릿 메서드 패턴은 상속을 사용한다. 따라서 상속에서 오는 단점들을 그대로 안고간다.
* 특히 자식 클래스가 부모 클래스와 컴파일 시점에 강하게 결합되는 문제가 있다. 
  * 이것은 의존관계에 대한 문제이다. 
* 자식 클래스 입장에서는 부모 클래스의 기능을 전혀 사용하지 않는다.
  * 그럼에도 불구하고 템플릿 메서드 패턴을 위해 자식 클래스는 부모 클래스를 상속 받고 있다.
* 자식 클래스 입장에서는 부모 클래스의 기능을 전혀 사용하지 않는데, 부모 클래스를 알아야한다. 이것은 좋은 설계가 아니다
  * 부모 클래스를 수정하면, 자식 클래스에도 영향을 줄 수 있다.
* 추가로 템플릿 메서드 패턴은 상속 구조를 사용하기 때문에, 별도의 클래스나 익명 내부 클래스를 만들어야 하는 부분도 복잡하다.
* 템플릿 메서드 패턴과 비슷한 역할을 하면서 상속의 단점을 제거할 수 있는 디자인 패턴이 바로 전략 패턴(Strategy Pattern)이다



참고

* [스프링 핵심 원리 - 고급편](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B3%A0%EA%B8%89%ED%8E%B8/dashboard)