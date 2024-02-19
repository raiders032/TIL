# 1 Spring Webflux

## 1.1 용도

* 비동기 논블록킹 리액티브 개발에 사용
* 효율적으로 동작하는 고성능 웹 애플리케이션 개발
* 서비스간 호출이 많은 마이크로서비스 아키텍처에 적합


## 1.2 비동기 논블록킹 리액티브 개발

* 비동기 논블록킹 리액티브 웹 애플리케이션을 개발하려면
* WebFlux + 리액티브 리포지토리, 리액티브 원격 API 호출, 리액티브 지원 외부 서비스, @Async 블록킹 IO
* 코드에서 블록킹 작업이 발생하지 않도록 Flux 스트림 또는 Mono에 데이터 넣어서 전달



# 2 동기 비동기

## 2.1 동기

* 동기란 A와 B가 시작시간 또는 종료시간이 일치하는 것을 의미한다



**동기에 다양한 예시**

* A, B 쓰레드가 동시에 작업을 시작하면 동기
  * CyclicBarrier
* A(메소드 리턴시간), B(결과를 전달받는 시간)이 일치하면 동기
* A끝나는 시간과 B가 시작하는 시간이 같으면 동기
  * synchronized
  * BlockingQueue



## 2.2 비동기



## 2.3 블록킹 논블록킹

* 동기, 비동기와는 관점이 다르다
* 내가 직접 제어할 수 없는 대상을 상대하는 방법이다
* 대상이 제한적이다
  * IO
  * 멀티쓰레드 동기화



# 3 @Async

## 3.1 @Async 메서드가 지원하는 반환 타입

* void
* `Future<T>`
* `ListenableFuture<T>`
* `CompletableFuture<T>`



## 3.2 주의사항

* @Async가 붙은 메서드를 호출할 때 마다 새로운 쓰레드를 만들고 버린다
* 쓰레드 풀을 사용하는 것이 아니기 때문에 일회용 쓰레드를 만들어 쓰는것은 상당한 낭비
* @Async를 본격적으로 사용한다면 쓰레드 풀을 지정해서 사용하자



# Mono



# Flux

## 프로그래밍으로 아이템 Emitting

* 코드를 짜서 퍼블리셔 쉽게 만들기



### create 메서드

* generate 메서드와 비교하면 더 로우 레벨 직접 반복문을 제어한다



### generate 메서드

* create 메서드와 비교하면 더 하이 레벨 직접 반복문을 제어하지 않는다
* synchronousSink 사용
* generate 메서드 안에서 오직 한번만 next 메서드를 호출한다
* 반복을 종료하고 싶다면 반본 종료 조건이 만족될 때 complete 메서드를 호출하자

```java
Flux.generate(sysnchronousSink -> {
  String country = Util.faker().country().name();
  System.out.println("Emitting : " + country);
  sysnchronousSink.next(country);
  if (country.toLowerCase().equals("india")) {
    sysnchronousSink.complete();
  }
}).subscribe(Util.subscriber());
```

```java
// complete if country is india
// complete if the couter is > 10

Flux.generate(() -> 1, (counter, synchronousSink) -> {
  String country = Util.faker().country().name();
  synchronousSink.next(country);
  if (country.toLowerCase().equals("india") || counter >= 10) {
    synchronousSink.complete();
  }
  return counter + 1;
}).subscribe(Util.subscriber());
```



### push 메서드

* create 메서드와 같지만 스레드세이프하지 않다



# Operators



## handle

```java
Flux.range(1, 20).handle((integer, synchronousSink) -> {
  if (integer % 2 == 0) {
    synchronousSink.next(integer); // filter
  } else {
    synchronousSink.next(integer + "a"); // map
  }
}).subscribe(Util.subscriber());
```

```java
Flux.range(1, 20).handle((integer, synchronousSink) -> {
  if (integer == 7) {
    synchronousSink.complete(); // filter
  } else {
    synchronousSink.next(integer); // map
  }
}).subscribe(Util.subscriber());
```



## delayElements

```java
Flux.range(1, 100)
  .log()
  .delayElements(Duration.ofSeconds(1))
  .subscribe(Util.subscriber());
```



## onErrorReturn

```java
Flux.range(1, 10)
  .log()
  .map(i -> 10 / (5 - i))
  .onErrorReturn(-1)
  .subscribe(Util.subscriber());
```

```
16:34:45.443 [Test worker] INFO reactor.Flux.Range.1 - | onSubscribe([Synchronous Fuseable] FluxRange.RangeSubscription)
16:34:45.445 [Test worker] INFO reactor.Flux.Range.1 - | request(unbounded)
16:34:45.445 [Test worker] INFO reactor.Flux.Range.1 - | onNext(1)
..Recevied : 2
16:34:45.446 [Test worker] INFO reactor.Flux.Range.1 - | onNext(2)
..Recevied : 3
16:34:45.446 [Test worker] INFO reactor.Flux.Range.1 - | onNext(3)
..Recevied : 5
16:34:45.447 [Test worker] INFO reactor.Flux.Range.1 - | onNext(4)
..Recevied : 10
16:34:45.447 [Test worker] INFO reactor.Flux.Range.1 - | onNext(5)
16:34:45.451 [Test worker] INFO reactor.Flux.Range.1 - | cancel()
..Recevied : -1
.. Completed 
```

## onErrorResume

```java
Flux.range(1, 10)
  .log()
  .map(i -> 10 / (5 - i))
  .onErrorResume(e -> Mono.fromSupplier(() -> 
                                        Util.faker().random().nextInt(100, 200)))
  .subscribe(Util.subscriber());
```

```
16:40:08.356 [Test worker] INFO reactor.Flux.Range.1 - | onSubscribe([Synchronous Fuseable] FluxRange.RangeSubscription)
16:40:08.358 [Test worker] INFO reactor.Flux.Range.1 - | request(unbounded)
16:40:08.358 [Test worker] INFO reactor.Flux.Range.1 - | onNext(1)
..Recevied : 2
16:40:08.359 [Test worker] INFO reactor.Flux.Range.1 - | onNext(2)
..Recevied : 3
16:40:08.359 [Test worker] INFO reactor.Flux.Range.1 - | onNext(3)
..Recevied : 5
16:40:08.359 [Test worker] INFO reactor.Flux.Range.1 - | onNext(4)
..Recevied : 10
16:40:08.359 [Test worker] INFO reactor.Flux.Range.1 - | onNext(5)
16:40:08.363 [Test worker] INFO reactor.Flux.Range.1 - | cancel()
..Recevied : 198
.. Completed 
```



## onErrorContinue

* onErrorReturn, onErrorResume은 에러 발생시 즉시 cancel() 메서드를 호출해 더 이상 진행되지 않는다
* 더 진행하고 싶은 경우 onErrorContinue를 사용하라
* `(e, o) -> {}`
  * e: 예외 객체
  * o: 예외를 발생시킨 객체 아래 예제에서는 `5`

```java
Flux.range(1, 10)
  .log()
  .map(i -> 10 / (5 - i))
  .onErrorContinue((e, o) -> {

  })
  .subscribe(Util.subscriber());
```

```
16:42:42.025 [Test worker] INFO reactor.Flux.Range.1 - | onSubscribe([Synchronous Fuseable] FluxRange.RangeSubscriptionConditional)
16:42:42.027 [Test worker] INFO reactor.Flux.Range.1 - | request(unbounded)
16:42:42.028 [Test worker] INFO reactor.Flux.Range.1 - | onNext(1)
..Recevied : 2
16:42:42.028 [Test worker] INFO reactor.Flux.Range.1 - | onNext(2)
..Recevied : 3
16:42:42.029 [Test worker] INFO reactor.Flux.Range.1 - | onNext(3)
..Recevied : 5
16:42:42.029 [Test worker] INFO reactor.Flux.Range.1 - | onNext(4)
..Recevied : 10
16:42:42.029 [Test worker] INFO reactor.Flux.Range.1 - | onNext(5)
16:42:42.031 [Test worker] INFO reactor.Flux.Range.1 - | onNext(6)
..Recevied : -10
16:42:42.031 [Test worker] INFO reactor.Flux.Range.1 - | onNext(7)
..Recevied : -5
16:42:42.031 [Test worker] INFO reactor.Flux.Range.1 - | onNext(8)
..Recevied : -3
16:42:42.031 [Test worker] INFO reactor.Flux.Range.1 - | onNext(9)
..Recevied : -2
16:42:42.032 [Test worker] INFO reactor.Flux.Range.1 - | onNext(10)
..Recevied : -2
16:42:42.032 [Test worker] INFO reactor.Flux.Range.1 - | onComplete()
.. Completed 
```



## timeout

* 설정한 시간이 지나면 fallback으로 전환한다

```java
public final Flux<T> timeout(Duration timeout, @Nullable Publisher<? extends T> fallback)
```



**예시**

* getOrderNumbers는 실행 후 3초 뒤에 아이템을 퍼블리싱한다
* timeout 오퍼레이터를 이용해 최대 2초를 기다리고 아이템 emit이 없으면 fallback으로 전환한다

```java
@Test
void test5() {
  getOrderNumbers()
    .timeout(Duration.ofSeconds(2), fallback())
    .log()
    .subscribe(Util.subscriber());

  Util.sleepSeconds(60);
}

private static Flux<Integer> getOrderNumbers() {
  return Flux.range(1, 10)
    .delayElements(Duration.ofSeconds(3));
}

private static Flux<Integer> fallback() {
  return Flux.range(800, 10)
    .delayElements(Duration.ofSeconds(1));
}
```



**결과**

* request이후 2초를 기다리는 동안 onNext 호출이 없어 fallback으로 전환 후 아이템을 받고있다

```
13:04:23.682 [Test worker] INFO reactor.Flux.Timeout.1 - onSubscribe(SerializedSubscriber)
13:04:23.684 [Test worker] INFO reactor.Flux.Timeout.1 - request(unbounded)
13:04:26.701 [parallel-3] INFO reactor.Flux.Timeout.1 - onNext(800)
..Recevied : 800
13:04:27.705 [parallel-4] INFO reactor.Flux.Timeout.1 - onNext(801)
..Recevied : 801
13:04:28.707 [parallel-5] INFO reactor.Flux.Timeout.1 - onNext(802)
..Recevied : 802
```



## defaultIfEmpty

* 어떠한 데이터의 emit 없이 완료될 때 반환할 기본 값을 설정한다

```java
package reactor.core.publisher;

public final Flux<T> defaultIfEmpty(T defaultV)
```



**예시**

* filter로 인해 넘겨 받는 데이터 없이 완료됨
* 이러한 경우 기본 값 `-50`을 반환함

```java
@Test
void test6() {
  getOrderNumbers()
    .filter(i -> i > 10)
    .defaultIfEmpty(-50)
    .subscribe(Util.subscriber());
}

private static Flux<Integer> getOrderNumbers() {
  return Flux.range(1, 10);
}
```

```
..Recevied : -50
.. Completed 
```



## switchIfEmpty

* defaultIfEmpty와 마찬가지로 어떠한 데이터의 emit 없이 완료될 때 사용된다
* 다른 점은 defaultIfEmpty 값을 반환하지만 switchIfEmpty는 다른 퍼블리셔를 구독한다
* 예를 들어 레디스 캐시에 데이터를 먼저 조회하고 데이터가 없는 경우 데이터베이스를 조회할 때 사용하면 유용하다

**예시**

```java
@Test
void test() {
  getOrderNumbers()
    .filter(i -> i > 10)
    .switchIfEmpty(fallback())
    .subscribe(Util.subscriber());
}

// redis cache
private static Flux<Integer> getOrderNumbers() {
  return Flux.range(1, 10);
}

// db
private static Flux<Integer> fallback() {
  return Flux.range(100, 110);
}
```

```
13:38:41.780 [Test worker] DEBUG reactor.util.Loggers - Using Slf4j logging framework
13:38:41.815 [Test worker] INFO reactor.Flux.FilterFuseable.1 - | onSubscribe([Fuseable] FluxFilterFuseable.FilterFuseableSubscriber)
13:38:41.818 [Test worker] INFO reactor.Flux.FilterFuseable.1 - | request(unbounded)
13:38:41.818 [Test worker] INFO reactor.Flux.FilterFuseable.1 - | onComplete()
..Recevied : 100
..Recevied : 101
..Recevied : 102
.. Completed 
```



## transform



**예시**

```java
@Test
void test() {
  getPerson()
    .transform(applyFilterMap())
    .subscribe(Util.subscriber());
}

public static Flux<Person> getPerson() {
  return Flux
    .range(1, 10)
    .map(i -> new Person());
}

public static Function<Flux<Person>, Flux<Person>> applyFilterMap() {
  return flux -> flux.filter(p -> p.getAge() > 10)
    .doOnNext(p -> p.setName(p.getName().toUpperCase()))
    .doOnDiscard(Person.class, p -> System.out.println("Not Allowing : " + p));
}
```

```
..Recevied : Person [name=PALMER, age=28]
..Recevied : Person [name=JAMEY, age=30]
..Recevied : Person [name=LI, age=29]
Not Allowing : Person [name=Tobias, age=4]
Not Allowing : Person [name=Hulda, age=4]
..Recevied : Person [name=MILO, age=20]
..Recevied : Person [name=RAMON, age=12]
..Recevied : Person [name=ENDA, age=20]
..Recevied : Person [name=CHERISE, age=29]
Not Allowing : Person [name=Maximo, age=8]
.. Completed 
BUILD SUCCESSFUL in 2s
4 actionable tasks: 2 executed, 2 up-to-date
2:29:59 오후: Task execution finished ':test --tests "com.example.webflux.reative.Transform.test"'.
```





참고자료

* [스프링5 웹플럭스와 테스트 전략- 토비](https://tv.kakao.com/channel/3150758/cliplink/391418995)
* [스프링캠프 2017 [Day1 A2] : Async & Spring - 토비](https://www.youtube.com/watch?v=HKlUvCv9hvA)
* [스프링캠프 2017 [Day1 A3] : Spring Web Flux - 토비](https://www.youtube.com/watch?v=2E_1yb8iLKk)
* [사용하면서 알게 된 Reactor, 예제 코드로 살펴보기 - 카카오테크](https://tech.kakao.com/2018/05/29/reactor-programming/)
* [스프링 리액티브 세미나 후기 - 우아한형제들 기술 블로그(이동욱)](https://techblog.woowahan.com/2619/)
* https://projectreactor.io/docs/core/release/reference/#about-doc
* 
