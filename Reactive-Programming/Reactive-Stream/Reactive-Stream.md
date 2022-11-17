# 1 Reactive Streams

* 리액티브 프로그래밍은 리액티브 스트림을 사용하는 프로그래밍이다.
* 리액티브 스트림은 잠재적으로 무한의 비동기 데이터를 순서대로 그리고 블록하지 않는 역압력을 전제해 처리하는 표준 기술이다. 
* 즉 비동기 논블록킹 개발을 위한 표준 API다
* 리액티브 스트림은 Publisher와 Subscriber 사이의 간단한 계약을 정의한 명세



## 1.1 역압력

- 트래픽을 가능한 빨리 발행하는 대신에 Subscriber가 Publisher에게 '난 10개만 더 받을 수 있아'라고 알리는 방식으로 트래픽을 제어할 수 있다
- 역압력은 발행-구독 프로토콜에서 이벤트 스트림의 구독자가 발행자가 이벤트를 제공하는 속도보다 느린 속도로 이벤트를 소비하면서 문제가 발생하지 않도록 보장하는 장치다.
- 역압력으로 인해 부하가 발생해 컴포넌트가 완전 불능이 되거나 예기치 않는 방식으로 이벤트를 읽어버리는 등의 문제를 방지할 수 있다
- 그 이유는 부하가 발생한 컴포넌트가 이벤트 발생 속도를 늦추라고 알리거나 얼마나 많은 이벤트를 수신할 수 있는지 등을 업스트림 발행자에게 알려주면 되기 때문이다.



**참고 자료**

* [Reactive Streams 명세](https://www.reactive-streams.org/)
* [Java9 API](https://docs.oracle.com/javase/9/docs/api/java/util/concurrent/Flow.html)
* [구현체가 만족해야할 스펙](https://github.com/reactive-streams/reactive-streams-jvm)



# 2 API Components

* 자바 9에서는 리액티브 프로그래밍을 제공하는 클래스 `java.util.concurrent.Flow`를 제공한다.
* `Flow` 클래스는 인스턴스화 할 수 없으며 아래와 같이 중첩된 네개의 인터페이스를 가지고 있다
  * Publisher
  * Subscriber
  * Subscription 
  * Processor




## 2.1 Publisher

* 제한이 없는 연속된 요소를 제공하는 프로바이더
* Subscriber의 요구를 대로 요소를 제공함
* Publisher는 수많은 일련의 이벤트를 제공할 수 있지만 Subscriber의 요구사항에 따라 역압력 기법에 따라 이벤트 제공 속도가 제한된다.
* Publisher는 여러개의 Subscriber를 가질 수 있다
* Subscriber은 오직 하나의 Publisher만 subscribe할 수 있다



**Publisher 인터페이스**

```java
@FunctionalInterface
public static interface Publisher<T> {
  public void subscribe(Subscriber<? super T> subscriber);
}
```



**subscribe 메서드**

* Publisher에게 데이터 스트리밍 시작을 요청하는 메서드로 인자로 Publisher의 신호를 받을 Subscriber를 받는다
* subscribe 메서드는 여러번 호출이 가능하며 매번 새로운 Subscription을 시작한다
* 각각의 Subscription은 하나의 Subscriber와 관련된다
* Subscriber은 오직 하나의 Publisher만 subscribe할 수 있다



**subscribe 메서드 동작과정**

> Adds the given Subscriber if possible. If already subscribed, or the attempt to subscribe fails due to policy violations or errors, the Subscriber's `onError` method is invoked with an [`IllegalStateException`](https://docs.oracle.com/javase/9/docs/api/java/lang/IllegalStateException.html). Otherwise, the Subscriber's `onSubscribe` method is invoked with a new [`Flow.Subscription`](https://docs.oracle.com/javase/9/docs/api/java/util/concurrent/Flow.Subscription.html). Subscribers may enable receiving items by invoking the `request` method of this Subscription, and may unsubscribe by invoking its `cancel` method.

* 구현체의 subscribe 메서드는 아래와 같은 프로토콜을 따라야한다

```
onSubscribe onNext* (onError | onComplete)?
```

* 먼저 Subscriber의 onSubscribe 메서드를 호출해 Subscription 객체를1 전달한다.
* 다음으로 호출 제한 없이 onNext 메서드를 호출한다
* 실패가 있다면 onError를 호출하고 더 이상 요소가 없다면 onComplete를 호출한다
* () 괄호는 옵션을 의미 따라서 onError 또는 onComplete 없이 무한히 onNext 메서드가 호출될 수 있다



Subscriber는 Publisher가 제공하는 데이터를 받고 싶다면 `Publisher.subscribe(Subscriber)` 메서드를 호출한다



## 2.2 Subscriber

- Publisher가 항목을 발행하면 Subscriber가 한 개씩 도는 한 번에 여러 항목을 소비한다.



**Subscriber 인터페이스**

- Publisher가 이벤트를 발행할 때 호출할 수 있는 콜백 메서드 네개를 제공한다.
- 이 메서드들은 아래와 같이 지정된 순서를 가지고 Publisher에 의해 호출된다.
- `onSubscribe onNext* (onError | onComplete)?`
  - onSubscribe가 항상 처음 호출되고 이어서 onNext기 여러 번 호출될 수 있다.
  - 이벤트 스트림은 영원히 지속되거나 onComplete 메서드를 통해 더 이상 데이터가 없고 종료됨을 알릴 수 있다
  - Publisher에 장애가 발생했을 때는 onError 메서드가 호출된다.

```java
public interface Subscriber<T> {
    public void onSubscribe(Subscription s);
    public void onNext(T t);
    public void onError(Throwable t);
    public void onComplete();
}
```



## 2.3 Subscription

- Publisher와 Subscriber 사이의 제어 흐름, 역압력을 관리한다.

```java
public interface Subscription {
    public void request(long n);
    public void cancel();
}
```



참고

* https://github.com/reactive-streams/reactive-streams-jvm