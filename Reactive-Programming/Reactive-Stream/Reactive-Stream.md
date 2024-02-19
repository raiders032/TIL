# 1 Reactive Streams가 생겨난 이유

* 여러 업체와 단체에서 데이터 스트림을 비동기로 다루는 라이브러리와 프레임워크를 출시했다.
	* 같은 처리를 하는데도 불구하고 라이브러리나 프레임워크 차이 때문에 서로 다르게 구현하는 상황이 발생함
	* 그래서 관련 단체들이 모여 데이터 스트림을 비동기로 다루는 최소한의 API를 정하고 제공했으며 이것이 Reactive Streams다.
* Reactive Streams는 **비동기 논블록킹 개발을 위한 표준 API다**
* Reactive Streams은 라이브러리나 프레임워크에 상관없이 데이터 스트림을 비동기로 다룰 수 있는 공통 메커니즘이다.
	* Reactive Streams는 인터페이스만 제공하고 구현은 각 라이브러리와 프레임워크에서 한다.

<br>

**참고 자료**

* [Reactive Streams 명세](https://www.reactive-streams.org/)
* [Java9 API](https://docs.oracle.com/javase/9/docs/api/java/util/concurrent/Flow.html)
* [구현체가 만족해야할 스펙](https://github.com/reactive-streams/reactive-streams-jvm)

<br>

## 1.1 리액티브 프로그래밍

- 리액티브 프로그래밍은 데이터가 통지될 때마다 관련된 프로그램이 반응해 데이터를 처리하는 프로그래밍 방식이다.
- 예를 들어 GPS 위치 정보가 변경될 때마다 데이터를 전송하고 이동을 멈추면 데이터 전송도 중지하는 것처럼 생성되는 데이터를 한 번에 보내지 않고 데이터가 생성될 때마다 순서대로 보낸다.
	- 이러한 데이터 흐름을 데이터 스트림이라고 한다.
	- 데이터 스트림은 이미 생성된 데이터 집합인 리스트와는 다르게 앞으로 발생할 가능성이 있는 데이터까지 포함하는 집합이다.
- 리액티브 프로그래밍은 이러한 데이터 스트림으로 데이터를 전달받은 프로그램이 그때마다 적절히 처리할 수 있게 구성된다.
	- 즉 필요한 데이터를 직접 가져와 처리하는 것이 아니라 보내온 데이터를 받은 시점에 이를 처리하는 프로그래밍이다.
- 리액티브 프로그래밍에서는 데이터를 생산하는 측은 데이터를 전달하는 것까지 책임진다.
	- 데이터를 생산하는 측은 데이터를 소비하는 측에서 전달받은 데이터로 무엇을 하는지 몰라도 된다.
	- 소비하는 측에서 무엇을 하든지 상관이 없으므로 소비하는 측을 기다릴 필요가 없다.
	- 즉 비동기 처리를 쉽게 구현할 수 있다.

<br>

## 1.2 역압력

- 트래픽을 가능한 빨리 발행하는 대신에 Subscriber가 Publisher에게 `난 10개만 더 받을 수 있어`라고 알리는 방식으로 트래픽을 제어할 수 있다
- 역압력은 발행-구독 프로토콜에서 이벤트 스트림의 구독자가 발행자가 이벤트를 제공하는 속도보다 느린 속도로 이벤트를 소비하면서 문제가 발생하지 않도록 보장하는 장치다.
- 역압력으로 인해 부하가 발생해 컴포넌트가 완전 불능이 되거나 예기치 않는 방식으로 이벤트를 읽어버리는 등의 문제를 방지할 수 있다
- 그 이유는 부하가 발생한 컴포넌트가 이벤트 발생 속도를 늦추라고 알리거나 얼마나 많은 이벤트를 수신할 수 있는지 등을 업스트림 발행자에게 알려주면 되기 때문이다.

<br>

## 1.3 구현체

- RxJava 2.x
	- RxJava 1.x 버전은 Reactive Streams가 만들어지기 전에 개발되었다.
- Reactor
- Akka Streams

<br>

# 2 API Components

- Reactive Streams의 API는 4개의 컴포넌트로 이루어져 있으며 옵저버 패턴을 확장한 형태다.
	- Publisher
	- Subscriber
	- Subscription
	- Processor
- Reactive Stream 구현체는 반드시 4개의 API 컴포넌트를 구현해야 한다.

<br>

**옵저버 패턴과 비교**

- 데이터 통지 완료와 에러 통지를 할 수 있다.
	- 따라서 데이터 통지가 끝나거나 에러가 발생하는 시점에 별도로 대응할 수 있다.

<br>

## 2.1 Publisher

* 제한이 없는 연속된 요소를 제공하는 프로바이더
* Subscriber의 요구대로 요소를 제공함
	* Publisher는 수많은 일련의 이벤트를 제공할 수 있지만 Subscriber의 요구사항에 따라 역압력 기법에 따라 이벤트 제공 속도가 제한된다.
* Publisher는 여러개의 Subscriber를 가질 수 있다
* Subscriber은 오직 하나의 Publisher만 subscribe할 수 있다

<br>

**Publisher 인터페이스**

```java
@FunctionalInterface
public static interface Publisher<T> {
  public void subscribe(Subscriber<? super T> subscriber);
}
```



**subscribe 메서드**

* Publisher에게 데이터 스트리밍 시작을 요청하는 메서드다.
	* 인자로 Publisher의 신호를 받을 Subscriber를 받는다
* subscribe 메서드는 여러번 호출이 가능하며 매번 새로운 Subscription을 시작한다
* 각각의 Subscription은 하나의 Subscriber와 관련된다
* Subscriber은 오직 하나의 Publisher만 subscribe할 수 있다

<br>

**subscribe 메서드 동작과정**

> Adds the given Subscriber if possible. If already subscribed, or the attempt to subscribe fails due to policy violations or errors, the Subscriber's `onError` method is invoked with an [`IllegalStateException`](https://docs.oracle.com/javase/9/docs/api/java/lang/IllegalStateException.html). Otherwise, the Subscriber's `onSubscribe` method is invoked with a new [`Flow.Subscription`](https://docs.oracle.com/javase/9/docs/api/java/util/concurrent/Flow.Subscription.html). Subscribers may enable receiving items by invoking the `request` method of this Subscription, and may unsubscribe by invoking its `cancel` method.

```
onSubscribe onNext* (onError | onComplete)?
```

* 구현체의 subscribe 메서드는 위와 같은 프로토콜을 따라야한다
* `onSubscribe`
	* 먼저 Subscriber의 onSubscribe 메서드를 호출해 Subscription 객체를 전달한다.
* `onNext*`
	* 다음으로 호출 제한 없이(0회 이상) onNext 메서드를 호출한다
* `(onError | onComplete)?`
	* 실패가 있다면 onError를 호출하고 더 이상 요소가 없다면 onComplete를 호출한다
	* () 괄호는 옵션을 의미 따라서 onError 또는 onComplete 없이 무한히 onNext 메서드가 호출될 수 있다.

<br>

### 2.1.1 Rule

- [레퍼런스](https://github.com/reactive-streams/reactive-streams-jvm#specification)
- Publisher가 지켜야한 규칙을 아래와 같다.

<br>

**Rule**

1. Publisher는 Subscriber의 Subscription으로부터 요구 받은 요소의 수보다 많은 요소를 전송할 수 없다.
	1. Subscriber의 요구보다 많은 데이터를 전송할 수 없다.
	2. Publisher가 일방적으로 데이터를 전송해 Subscriber의 데이터 처리 속도를 압도하는 문제를 방지하기 위함
2. Publisher는 Subscriber의 요구보다 작은 수의 `onNext` 메서드를 호출할 수 있다. 그리고 `onComplete` 또는 `onError` 메서드를 호출해서 `Subscription`을 종료한다.
3. Publisher는 `onSubscribe`, `onNext`, `onError` 와 `onComplete` 시그널을 `Subscriber`에 보낼 수 있는데 반드시 순서가 지켜져야한다.
	1. `onSubscribe` -> `onNext` ->  `onError` 또는  `onComplete` 의 순서가 지켜져야함
4. Publisher가 실패하면 반드시 onError를 신호해야 한다.
	1. Subscriber가 Publisher의 실패에 대처하거나 자원을 정리할 기회를 주기 위해
5. Publisher가 성공적으로 종료되면(유한 스트림) 반드시 onComplete를 신호해야 한다.
	1. 이 규칙의 의도는 발행자(Publisher)가 최종 상태에 도달했음을 구독자(Subscriber)에게 통지하는 책임이 있다는 것을 명확히 하기 위함입니다. 
	2. 그러면 구독자는 이 정보에 따라 행동할 수 있으며, 자원을 정리하는 등의 조치를 취할 수 있다.
6. Publisher가 Subscriber에게 onError나 onComplete를 신호하면, 그 Subscriber의 Subscription은 취소된 것으로 간주되어야 한다.
	1. Publisher가 전송한 onError나 onComplete 신호는 구독 취소와 동일한 기능을 한다
7. 종료 상태(onError, onComplete)가 신호되면 더 이상의 신호가 발생하지 않아야 한다.
8. Subscription이 취소되면 Publisher는 결국 신호를 받지 않게 되어야 한다.
9. 발행자가 subscribe를 호출하면 제공된 구독자에게 다른 신호를 보내기 전에 반드시 onSubscribe를 호출하고 정상적으로 반환해야 한다.
10. 발행자의 subscribe는 원하는 만큼 여러 번 호출될 수 있지만, 매번 다른 구독자와 함께 호출되어야 한다.
11. 발행자는 여러 구독자를 지원할 수 있으며 각 구독이 유니캐스트인지 멀티캐스트인지 결정한다.

<br>


## 2.2 Subscriber

- Publisher가 항목을 발행하면 Subscriber가 한 개씩 또는 한 번에 여러 항목을 소비한다.

<br>

**Subscriber 인터페이스**

```java
public interface Subscriber<T> {
    public void onSubscribe(Subscription s);
    public void onNext(T t);
    public void onError(Throwable t);
    public void onComplete();
}
```

- Publisher가 이벤트를 발행할 때 호출할 수 있는 콜백 메서드 네개를 제공한다.
- 이 메서드들은 아래와 같이 지정된 순서를 가지고 Publisher에 의해 호출된다.
	- `onSubscribe onNext* (onError | onComplete)?`
	- onSubscribe가 항상 처음 호출되고 이어서 onNext기 여러 번 호출될 수 있다.
	- 이벤트 스트림은 영원히 지속되거나 onComplete 메서드를 통해 더 이상 데이터가 없고 종료됨을 알릴 수 있다
	- Publisher에 장애가 발생했을 때는 onError 메서드가 호출된다.
- `onSubscribe`: 데이터 통지가 준비됐음을 통지
	- Publisher가 데이터를 통지할 수 있게 처음에 통지되는 데이터 개수를 Subscription의 request 메서드로 요청한다.
	- 위 작업이 수행되지 않으면  Publisher가 데이터를 통지하지 않으니 주의해야 한다.
	- Subscription의 request 메서드는 `onSubscribe` 메서드 가장 마지막에 호출해야 한다.
- `onNext`: Publisher가 통지한 데이터를 처리하는 역할
- `onError`: Publisher가 데이터를 통지하는 과정에서 에러가 발생했을 때 호출
- `onComplete`: Publisher가 데이터 통지를 완료했음을 알릴 때 호출

<br>

### 2.2.1 Rule

- [레퍼런스](https://github.com/reactive-streams/reactive-streams-jvm?tab=readme-ov-file#2-subscriber-code)

<br>

**Rule**

1. 구독자는 `Subscription.request(long n)`을 통해 수요를 신호해야 한다.
2. 구독자가 신호 처리가 발행자의 반응성에 부정적인 영향을 미칠 것으로 의심되면, 신호를 비동기적으로 전달하는 것이 권장된다.
3. 구독자의 `onComplete()` 및 `onError(Throwable t)`는 구독이나 발행자에 대한 어떠한 메소드도 호출하지 말아야 한다.
4. 구독자의 `onComplete()` 및 `onError(Throwable t)`는 신호를 받은 후 구독을 취소된 것으로 간주해야 한다.
5. 구독자는 `onSubscribe` 신호 후 이미 활성화된 구독이 있는 경우 해당 구독에 대해 `Subscription.cancel()`을 호출해야 한다.
6. 구독자는 구독이 더 이상 필요하지 않은 경우 `Subscription.cancel()`을 호출해야 한다.
7. 구독자는 구독의 요청 및 취소 메소드에 대한 모든 호출을 순차적으로 수행해야 한다.
8. 구독자는 `Subscription.cancel()`을 호출한 후에도 여전히 요청된 요소가 남아 있는 경우 하나 이상의 `onNext` 신호를 받을 준비가 되어 있어야 한다.
9. 구독자는 `Subscription.request(long n)` 호출 여부와 관계없이 `onComplete` 신호를 받을 준비가 되어 있어야 한다.
10. 구독자는 `Subscription.request(long n)` 호출 여부와 관계없이 `onError` 신호를 받을 준비가 되어 있어야 한다.
11. 구독자는 모든 신호 메소드에 대한 호출이 해당 신호의 처리보다 먼저 일어나야 한다는 것을 확실히 해야 한다.
12. 구독자에 대한 `onSubscribe`는 주어진 구독자에 대해 최대 한 번만 호출되어야 한다.
13. `onSubscribe`, `onNext`, `onError` 또는 `onComplete`의 호출은 제공된 매개변수가 null인 경우를 제외하고는 정상적으로 반환해야 한다.

<br>

## 2.3 Subscription

- Publisher와 Subscriber 사이의 제어 흐름, 역압력을 관리한다.
- 역압력을 관리하지 않으면 Publisher가 일방적으로 트래픽을 가능한 빨리 발행하고 부하가 발생해 Subscriber가 완전 불능이 되거나 예기치 않는 방식으로 이벤트를 읽어버리는 등의 문제가 발생할 수 있다.
- 따라서 Subscriber는 이벤트 발생 속도를 늦추라고 알리거나 얼마나 많은 이벤트를 수신할 수 있는지 등을 Publisher에게 알려주는 방식으로 흐름을 관리한다.
	- 이 때 Subscription의 request 메서드를 통해 간접적으로 Publisher에게 내가 얼만큼의 이벤트를 수신할 수 있을지 전달한다.

<br>

**Subscription 인터페이스**

```java
public interface Subscription {
    public void request(long n);
    public void cancel();
}
```

- Publisher와 Subscriber가 사용하는 Subscription은 통지받을 데이터 개수를 지정해 데이터 통지를 요청하거나 통지받지 않게 구독을 해지할 때 사용하는 인터페이스다.
- Subscription은 Publisher에서 인스턴스가 생성되어 `onSubscribe` 메서드를 통해 Subscriber에게 전달된다.
- Subscription을 받은 Subscriber는 Subscription의 메서드를 호출해 데이터 개수를 요청하거나 구독을 해지한다.
- Subscriber가 `onNext` 메서드에서 Subscription을 사용하려면 Subscription을 Subscriber 내부에 저장해야 한다.
- request에 `Long.MAX_VALUE`를 인자로 주면 통지할 데이터 개수의 제한이 없다.
	- 따라서  request 호출 후에 데이터 개수 요청을 보내지 않아도 데이터 통지를 계속 받을 수 있다.

<br>

## 2.4 Processor

- Publisher로부터 전달된 데이터를 아무런 처리를 거치지 않고 그대로 사용하는 경우가 거의 없다.
- Processor가 Publisher와 Subscriber 사이에 위치하여 데이터 가공 처리를 담당한다.
	- 데이터 필터링, 데이터 변환 등

<br>

**Processor 인터페이스**

```java
public interface Processor<T, R> extends Subscriber<T>, Publisher<R> {
}
```

- Processor는 Publisher와 Subscriber의 역할을 동시에 한다.

<br>

참고

* https://github.com/reactive-streams/reactive-streams-jvm