# 1 Reactive Streams

* 비동기 논블록킹 개발을 위한 표준 API
* 리액티브 스트림은 Publisher와 Subscriber 사이의 간단한 계약을 정의한 명세
* 트래픽을 가능한 빨리 발행하는 대신에 Subscriber가 Publisher에게 '난 10개만 더 받을 수 있아'라고 알리는 방식으로 트래픽을 제어할 수 있다

**참고 자료**

* [Reactive Streams 명세](https://www.reactive-streams.org/)
* [Java9 API](https://docs.oracle.com/javase/9/docs/api/java/util/concurrent/Flow.html)
* [구현체가 만족해야할 스펙](https://github.com/reactive-streams/reactive-streams-jvm)



# 2 API Components

* Publisher
* Subscriber: 데이터를 받아 최종적으로 사용하는 쪽
* Subscription: 
* Processor



## 2.1 Publisher

* 제한이 없는 연속된 요소를 제공하는 프로바이더
* Subscriber의 요구를 대로 요소를 제공함
  * 백프레셔
* Publisher는 여러개의 Subscriber를 가질 수 있다
* Subscriber은 오직 하나의 Publisher만 subscribe할 수 있다



**Publisher**

* subscribe 메서드
  * Publisher에게 데이터 스트리밍 시작을 요청하는 메서드
  * subscribe 메서드는 여러번 호출이 가능하며 매번 새로운 Subscription을 시작한다
  * 각각의 Subscription은 하나의 Subscriber와 관련된다
  * Subscriber은 오직 하나의 Publisher만 subscribe할 수 있다
  * 인자로 Publisher의 신호를 받을 Subscriber를 받는다

```java
@FunctionalInterface
public static interface Publisher<T> {
  public void subscribe(Subscriber<? super T> subscriber);
}
```



**subscribe 메서드**

> Adds the given Subscriber if possible. If already subscribed, or the attempt to subscribe fails due to policy violations or errors, the Subscriber's `onError` method is invoked with an [`IllegalStateException`](https://docs.oracle.com/javase/9/docs/api/java/lang/IllegalStateException.html). Otherwise, the Subscriber's `onSubscribe` method is invoked with a new [`Flow.Subscription`](https://docs.oracle.com/javase/9/docs/api/java/util/concurrent/Flow.Subscription.html). Subscribers may enable receiving items by invoking the `request` method of this Subscription, and may unsubscribe by invoking its `cancel` method.

* 구현체의 subscribe 메서드는 아래와 같은 프로토콜을 따라야한다

```
onSubscribe onNext* (onError | onComplete)?
```

* 먼저 Subscriber의 onSubscribe 메서드를 호출한다
* 다음으로 호출 제한 없이 onNext 메서드를 호출한다
* 실패가 있다면 onError를 호출하고 더 이상 요소가 없다면 onComplete를 호출한다
  * () 괄호는 옵션을 의미 따라서 onError 또는 onComplete 없이 무한히 onNext 메서드가 호출될 수 있다



Subscriber는 Publisher가 제공하는 데이터를 받고 싶다면 `Publisher.subscribe(Subscriber)` 메서드를 호출한다



## 2.2 Subscriber

```java
public interface Subscriber<T> {
    public void onSubscribe(Subscription s);
    public void onNext(T t);
    public void onError(Throwable t);
    public void onComplete();
}
```



## 2.3 Subscription

```java
public interface Subscription {
    public void request(long n);
    public void cancel();
}
```



참고

* https://github.com/reactive-streams/reactive-streams-jvm