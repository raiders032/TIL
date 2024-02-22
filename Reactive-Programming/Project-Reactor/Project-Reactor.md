# 1 Project Reactor

* Project Reactor는 Reactive Streams specification의 구현체다
* 리액터를 사용하면 아래와 같은 특성을 갖는 리액티브 프로그래밍을 활용할 수 있다
	* 논블로킹, 비동기 프로그래밍 모델
	* 함수형 프로그래밍 스타일
	* 스레드를 신경 쓸 필요 없는 동시성
* 리액터는 핵심 타입인 `Flux<T>` 를 사용해서 수요 조절을 구현한다
* [Reference](https://projectreactor.io/docs/core/release/reference/)
* [Javadoc](https://projectreactor.io/docs/core/release/api/)

<br>

# 2 Mono

- [레퍼런스](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Mono.html)

<br>

## 2.1 Method

### defer

```java
public static <T> Mono<T> defer(Supplier<? extends Mono<? extends T>> supplier)
```

![deferForMono](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/doc-files/marbles/deferForMono.svg)

* defer 메서드를 통해 cold publisher를 생성할 수 있다
* defer 메서드는 Mono를 제공하는 Supplier를 인수로 받는다
* 다운 스트림에서 구독한 시점에 Lazy하게 Supplier를 통해 Mono를 반환한다

> 참고
>
> * https://www.baeldung.com/java-mono-defer

<br>

### flatMap

```java
public final <R> Mono<R> flatMap(Function<? super T,? extends Mono<? extends R>> transformer)
```

![[Pasted image 20240213141324.png]]

<br>

### justOrEmpty

```java
public static <T> Mono<T> justOrEmpty(@Nullable
                                      Optional<? extends T> data)
```
![[Pasted image 20231230170005.png]]

- [레퍼런스](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Mono.html#justOrEmpty-java.util.Optional-)
- data의 isPresent()가 true인 경우 원소를 반환하는 새로운 Mono를 생성한다.
- isPresent()가 false인 경우 onComplete 신호만 방출한다.
- just()의 확장 오퍼레이터로 just와 달리 emit할 데이터가 null일 경우 NPE가 발생하지 않고 onComplete 신호를 전송합니다.

<br>

```java
public static <T> Mono<T> justOrEmpty(@Nullable
                                      T data)
```
![[Pasted image 20231230165732.png]]

- [레퍼런스](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Mono.html#justOrEmpty-T-)
- data가 null이 아니면 원소를 반환하는 새로운 Mono를 생성한다.
- data가 null인 경우 onComplete 신호만 방출하는 Mono를 생성한다.

<br>

### map

```java
public final <R> Mono<R> map(Function<? super T,? extends R> mapper)
```

![[Pasted image 20240214142005.png]]

- [레퍼런스](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Mono.html#map-java.util.function.Function-)
- 이 메소드는 Mono에 의해 방출된 아이템을 변환하기 위해 동기적 함수를 적용하는 방법을 제공합니다.
- 원래 `Mono`가 방출하는 아이템에 `mapper` 함수가 적용된 결과를 방출하는 새로운 `Mono` 객체를 반환한다.

<br>

### switchIfEmpty

```java
public final Mono<T> switchIfEmpty(Mono<? extends T> alternate)
```

![image-20220524091637584](./images/switchIfEmpty.png)

* this Mono가 onNext 시그널 없이 onComplete 시그널을 보내면 alternate Mono로 전환한다

<br>

### then

```java
public final Mono<Void> then()
```

![image-20220524092004367](./images/then1.png)

* this Mono의 complete 시그널과 error 시그널을 리플레이한다


```java
public final <V> Mono<V> then(Mono<V> other)
```

![image-20220524091926215](./images/then2.png)

* this Mono가 complete 시그널을 보내면 other Mono로 전환한다
	* 즉 this Mono가 방출한 요소를 무시한다
* this Mono가 error 시그널을 보내면 error시그널을 리플레이 한다

<br>

### when

```java
public static Mono<Void> when(Iterable<? extends Publisher<?>> sources)
```

![[Pasted image 20230818090047.png]]

- [레퍼런스](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Mono.html#when-java.lang.Iterable-)
- 지정된 Publisher를 모든 Publisher가 완료되면 이행될 새로운 모노로 대체한다.
- 오류가 발생하면 보류 중인 결과가 취소되고 반환된 모노에 즉시 오류가 방출된다.

<br>

# 3 Flux

* 결과가 아직 정해지지 않았고 미래 어느 시점이 되어야 알 수 있다는 점에서 Flux는 Future와 비슷하다
	* 하지만 Future는 이미 시작되었음을 나타내지만 Flux는 시작할 수 있음을 나타낸다
* Flux는 시작할 수 있음을 나타낸다것의 의미
	* 프로젝트 리액터에서 필요한 모든 흐름과 모든 핸들러를 정의할 수 있지만 구독하기 전까지는 실제로 아무런 연산도 일어나지 않는다
* [JavaDoc](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html)

<br>

**Flux와 레스토랑 점원 비유**

>`Flux<T>`는 실제 물건을 전달해주는 플레이스 홀더로 쉽게 말해 레스토랑에서 일하는 서빙 점원과 비슷하다. 주방에 요리가 완성되면 점원이 주방에서 요리를 받아서 손님에게 가져다주고, 다시 제자리로 돌아와 다음 요리를 기다린다. 서빙 점원은 요리가 주방에서 언제 완성될지 알 수 없다. 점원은 `Flux<Dish>` 를 바로 받을 수 있는데 `Flux<Dish>` 에 포함된 요리는 아직 완성되지 않았지만 머지않아 완성될 것이다. 요리가 완성되면 서빙 점원은 행동에 나설 수 있다. 즉 요리 완성에 대한 반응 행동 리액트라고 할 수 있다. 리액터는 논 블로킹으로 동작하기 때문에 주방에서 요리가 완성될 때까지 점원이(서버 스레드) 다른 일을 못 한 채 계속 기다리지 않는다

<br>

## 3.1 Flux의 특징

* 하나 이상의 요소 포함 가능
* 각 요소가 제공될 때 어떤 일이 발생하는지 지정 가능
* 성공과 실패 두 가지 경로 모두에 처리 방향 정의 가능
* 결과 폴링 불필요
* 함수형 프로그래밍 지원

<br>

## 3.2 method

### collectList

```java
public final Mono<List<T>> collectList()
```

![[Pasted image 20230922152255.png]]

- [레퍼런스](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html#collectList--)
- this 플럭스가 방출한 아이템을 List모아놓다가 this 플럭스가 완료되면 List 하나를 담은 Mono를 반환한다.

<br>

### concatWith

```java
public final Flux<T> concatWith(Publisher<? extends T> other)
```

![[Pasted image 20230922151859.png]]

- this 플럭스와 제공된 Publisher의 데이터 방출을 이어준다.
- 데이터 방출이 인터리빙되지 않는다.
	- 즉 this 플럭스의 데이터 방출이 끝나면 제공된 Publisher의 데이터 방출이 시작된다.

<br>

### defer

```java
public static <T> Flux<T> defer(Supplier<? extends Publisher<T>> supplier)
```

![[Pasted image 20231230172640.png]]

- [레퍼런스](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html#defer-java.util.function.Supplier-)
- Flux.defer는 Flux를 즉시 생성하지 않는다.
	- 대신, 실제 소스의 생성을 구독 시점까지 지연시킵니다.
	- 이는 구독이 일어날 때마다 Supplier가 호출되어 새로운 Publisher 인스턴스를 생성합니다.

<br>

### doOnNext

```java
public final Flux<T> doOnNext(Consumer<? super T> onNext)
```

![[Pasted image 20230903102726.png]]

- [레퍼런스](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html#doOnNext-java.util.function.Consumer-)
- 플럭스가 아이템을 방출할 때 트리거되는 동작을 추가한다.
- Consumer(트리거되는 동작)이 먼저 실행된 다음 OnNext 신호가 다운스트림으로 전파된다.


### doFinally

```java
public final Flux<T> doFinally(Consumer<SignalType> onFinally)
```

![[Pasted image 20230904105713.png]]

- [레퍼런스](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html#doFinally-java.util.function.Consumer-)
- Flux가 어떠한 이유로든 종료된 후 트리거되는 동작을 추가한다.
- 종료 이벤트(SignalType.ON_COMPLETE, SignalType.ON_ERROR 및 SignalType.CANCLE)가 Consumer에게 전달되며 해당 이벤트를 다운 스트림으로 전달하고 동작을 실행한다.

<br>

### filter

```java
public final Flux<T> filter(Predicate<? super T> p)
```

![[Pasted image 20231231142710.png]]

- [레퍼런스](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html#filter-java.util.function.Predicate-)
- 이 연산자는 소스로부터 받은 각 값에 대해 주어진 조건(`Predicate`)을 평가하고, 이 조건을 만족하는 값만을 방출한다.
- 조건을 만족하지 않는 값은 무시되고, 상위 스트림에게 다음 요소(1개 요청)를 요청한다.

<br>

### flatMap

```java
public final <R> Flux<R> flatMap(Function<? super T,? extends Publisher<? extends R>> mapper)
```

![[Pasted image 20240219143741.png]]

- [레퍼런스](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html#flatMap-java.util.function.Function-)


<br>

### fromIterable

```java
public static <T> Flux<T> fromIterable(Iterable<? extends T> it)
```

![[Pasted image 20231230170240.png]]

- [레퍼런스](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html#fromIterable-java.lang.Iterable-)
- 제공된 Iterable이 가지고 있는 아이템을 방출하는 새로운 Flux를 생성한다.

<br>

### fromStream

```java
public static <T> Flux<T> fromStream(Stream<? extends T> s)
```

![[Pasted image 20231230170737.png]]

- [fromStream](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html#fromStream-java.util.stream.Stream-)
- Stream에 포함된 항목들을 방출하는 Flux를 생성한다.
- Stream은 재사용할 수 없기 때문에, 여러 구독이나 재구독(예: repeat() 또는 retry() 사용 시) 상황에서 문제가 발생할 수 있다.
	- 해당 오퍼레이터는 구독 취소, 에러 발생, 완료 시 자동으로 Stream을 닫는다.

<br>

### just

```java
public static <T> Flux<T> just(T... data)
```

![[Pasted image 20231224122714.png]]

- 여러 데이터 요소를 순서대로 방출하는 Flux 객체를 생성합니다.

<br>

### map

```java
public final <V> Flux<V> map(Function<? super T,? extends V> mapper)
```

![[Pasted image 20231224123017.png]]

- [레퍼런스](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html#map-java.util.function.Function-)
- 해당 플럭스에서 방출된 아이템에 동기적 함수(mapper)를 적용해 변환한다.

<br>

### mergeWith

```java
public final Flux<T> mergeWith(Publisher<? extends T> other)
```


![[Pasted image 20230903102233.png]]

- [레퍼런스](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html#mergeWith-org.reactivestreams.Publisher-)
- 플럭스와 Publisher의 데이터를 인터리브된 새로운 Flux를 반환한다.
- 두 스트림이 동시에 데이터를 발행할 경우 순서를 보장하지 않는다.
- 한 스트림에서 에러가 발생하면 병합된 Flux도 에러를 발행한다.
- 두 스트림 모두 완료될 때 병합된 Flux도 완료된다.

<br>

### range

```java
public static Flux<Integer> range(int start,
                                  int count)
```

![[Pasted image 20231230171128.png]]

- [레퍼런스](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html#range-int-int-)
- n부터 1씩 증가하는 연속된 수를 m개 방출하는 Flux를 생성한다.

<br>

### then

```java
public final Mono<Void> then()
```

![[Pasted image 20230902150320.png]]

- [레퍼런스](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html#then--)
- then은 원본 Flux 처리 완료 후 다른 동작을 수행하고자 할 때 유용하게 사한다
- then은 소스의 원소를 무시하고 오직 완료 또는 에러 시그널만 전달한다.
- 원본 Flux가 완료될 때 완료되는 `Mono<Void>`를 반환한다.
	- 즉 기존 Flux의 완료 신호를 받고 싶을 떄 사용하자.

<br>

# 4 Hot Versus Cold

* [레퍼런스](https://projectreactor.io/docs/core/release/reference/#reactor.hotCold)
* Publisher의 종류로 Hot, Cold가 있다

<br>

## 4.1 Cold Publisher

* Cold Publisher는 비동기 데이터 시퀀스를 나타내며 구독이 일어나기 전에는 아무런 일이 일어나지 않는다
* 각각의 구독마다 새로운 데이터를 생성한다
* 구독이 일어나지 않으면 데이터는 생성되지 않는다

<br>

## 4.2 Hot Publisher

* Hot Publisher는 Subscriber의 수와 관련이 없다
	* Subscriber가 하나도 없어도 데이터를 생성해낸다는 것
* Hot Publisher 즉시 데이터를 생성할 수 있다
* 새로운 Subscriber가 Subscribtion을 하면 Subscriber는 Subscribtion 이후 방출된 요소만 볼 수 있다
* Cold Publisher는 Subscribtion을 하지 않으면 아무일도 발생하지 않지만 Hot Publisher는 내가 Subscribtion을 하지 않아도 어떠한 일이 일어나고 있는 것이다

<br>

## 4.3 비교

* Cold Publisher와 Hot Publisher를 비유해보자면 Cold Publisher는 넷플릭스에서 영화를 스트리밍으로 보는것이고 Hot Publisher는 TV에서 방영되는 영화를 보는것이며 영화 시작 이후 TV를 켜면 이후 내용만 볼 수 있다

<br>


> 참고
>
> * https://projectreactor.io/docs/core/release/reference/#reactor.hotCold



# 5 Testing



> 참고
>
> * [StepVerifier Docs](https://projectreactor.io/docs/test/release/api/reactor/test/StepVerifier.html)


<br>

# 6 Scheduler

- 스케줄러는 ExecutorService와 비슷한 스케줄링 역할을 하지만, 전용 추상화를 통해 더 많은 기능을 제공한다.
- React의 Schedulers 클래스에는 다양한 실행 컨텍스트에 접근할 수 있는 정적 메서드들이 있다.

<br>

**정적 메서드**

- Schedulers.immediate()
	- 별도의 스레드를 추가적으로 생성하지 않고 현재 스레드에서 작업을 처리한다.
- Schedulers.single()
	- 이 메서드는 모든 호출자에 대해 동일한 스레드를 재사용한다.
	- 스케줄러가 폐기될 때까지 유지된다.
	- 호출마다 전용 스레드가 필요하다면, 각 호출에 Schedulers.newSingle()을 사용하자.
- Schedulers.newSingle()
	- 매번 새로운 스레드를 생성해서 사용한다.
- Schedulers.elastic()
	- Schedulers.boundedElastic()의 도입으로 현재는 사용되지 않는다.
- Schedulers.boundedElastic()
	- ExecutorService 기반의 스레드 풀을 생성한 후, 그 안에서 정해진 수만큼의 스레드를 사용하여 작업을 처리한다.
	- 기본적으로 CPU 코어 수의 열배만큼의 스레드를 생성한다.
	- 모든 스레드가 사용중이라면 최대 100,000개의 작업이 큐에 대기할 수 있다.
	- 블로킹 I/O 작업을 효과적으로 처리할 수 있다.
- Schedulers.parallel()
	- 정된 수의 워커 스레드 풀을 생성합니다. 
	- 이 풀의 크기는 보통 시스템의 CPU 코어 수와 동일합니다.
	- I/O 바운드 작업보다는 CPU 바운드 작업에 적합하다.
- Schedulers.fromExecutorService(ExecutorService)
	- 이미 사용하고 있는 ExecutorService로부터 스케줄러를 생성하는 방식이다.
	- Reactor에서 권장하는 방식은 아니다.






참고

* https://projectreactor.io/docs/core/release/reference/
* https://projectreactor.io/docs/core/release/api/