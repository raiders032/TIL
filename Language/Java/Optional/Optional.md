# 1 Optional

![java8-optional-f2](https://www.oracle.com/ocom/groups/public/@otn/documents/digitalasset/2175762.gif)

* 오브젝트를 담는 컨테이너이다.
* Optional 컨테이너는 오브젝트를 담고 있거나 비어 있을 수 있다.
* 코드의 가독성과 NullPointerException을 피하기 위해 Optional을 사용한다.



## 1.1 Optional의 대안

* 메소드에서 제대로 값을 리턴할 수 없는 경우 선택할 수 있는 방법
* 예외를 던진다
  * 스택 트레이스를 찍어야하는 비용이 든다
* null을 리턴한다
  * 비용 문제는 발생하지 않는다
  * 해당 메소드를 사용하는 클라이언트가 null 체크를 해야한다.
* Optional을 반환한다
  * 클라이언트에게 명시적으로 값이 비어 있을 수 있다는 것을 알려준다
  * 빈 값인 경우에 대한 처리를 강제한다



**예시**

![java8-optional-f1](https://www.oracle.com/ocom/groups/public/@otn/documents/digitalasset/2175761.gif)

* 위와 같은 Computer 구조에서 version 정보를 얻고싶다
* `String version = computer.getSoundcard().getUSB().getVersion();`
* 위에 코드에서 `NullPointerException` 을 피하고 싶다면 어떻게 코드를 작성해야 될까?



**NullPointerException을 피하기 위한 코드**

* 코드가 지저분하다
* 실수하기 쉽다
  * 만약 개발자가 실수로 null체크를 하지 않는다면 런타임에 NullPointerException을 만나게 될것이다
* 변수를 접근할 때마다 중첩된 if를 추가되면서 코드 들여쓰기 수준이 증가한다
  * 이와 같은 반복 패턴 코드를 `깊은 의심deep doubt` 이라고 부른다
  * 이를 반복하면 코드의 구조가 엉망이 되고 코드의 가독성도 떨어진다


```java
String version = "UNKNOWN";
if(computer != null){
  Soundcard soundcard = computer.getSoundcard();
  if(soundcard != null){
    USB usb = soundcard.getUSB();
    if(usb != null){
      version = usb.getVersion();
    }
  }
}
```



**Optional을 사용한 동일한 코드**

```java
String version = computer.flatMap(Computer::getSoundcard)
                   .flatMap(Soundcard::getUSB)
                   .map(USB::getVersion)
                   .orElse("UNKNOWN");
```



## 1.2 null 때문에 발생하는 문제

* 에러의 근원이다
  * NullPointerException은 자바에서 가장 흔히 발생하는 에러이다
* 코드를 어지럽힌다
  * 중첩된 null확인 코드를 추가해야 하므로 null 때문에 코드 가독성이 떨어진다
* 아무 의미가 없다
  * null은 아무 의미도 표현하지 않는다
  * 특히 정적 형식 언어에서 값이 없음을 표현하는 방식으로는 적절하지 않다
* 자바 철학에 위배된다
  * 자바는 개발자로부터 모든 포인터를 숨겼다 하지만 예외가 있는데 그것이 바로 null 포인터다
* 형식 시스템에 구멍을 만든다
  * null은 무형식이며 정보를 포함하고 있지 않으므로 모든 참조 형식에 null을 할당할 수 있다
  * 이런 식으로 null이 퍼졌을 때 애초에 null이 어떤 의미로 사용되었는지 알 수 없다



## 1.3 Optional의 목적

- Optional은 모든 null 참조를 대체하기 위해 존재하지 않는다. 

- Optional을 사용하면 메서드 시그니처만 봐도 반환 값이 비어있을 수 있다는 것을 알게된다.
- 따라서 클라이언트가 능동적으로 값이 비어있는 상황을 인지하고 처리하도록 강제하는 것이 Optional의 목적이다.





# 2 Optional 만들기

* Optional 객체를 만드는 방법



## 2.1 empty

* 정적 팩토리 메서드 Optional.empty로 빈 빈 Optional 객체를 얻을 수 있다

```java
Optional<Soundcard> sc = Optional.empty();
```



**Optional.java**

```java
public final class Optional<T> {
  /**
     * Common instance for {@code empty()}.
     */
  private static final Optional<?> EMPTY = new Optional<>();

  public static<T> Optional<T> empty() {
    @SuppressWarnings("unchecked")
    Optional<T> t = (Optional<T>) EMPTY;
    return t;
  }
}
```



## 2.2 of

* 값을 가진 Optional 만들기

```java
SoundCard soundcard = new Soundcard();
Optional<Soundcard> sc = Optional.of(soundcard);
```



## 2.3 ofNullable

* 비어있을 수도 값을 가질 수도 있는 Optional 만들기
* soundcard가 null 이면 비어있는 Optional 객체가 만들어진다.

```
Optional<Soundcard> sc = Optional.ofNullable(soundcard);
```



**Optional.java**

```java
public static <T> Optional<T> ofNullable(T value) {
  return value == null ? empty() : of(value);
}
```



# 3 Optional 사용하기

* 메소드 호출의 반환 값으로 Optional을 받은 클라이언트가 Optional을 사용하는 방법



## 3.1 ifPresent()

```java
// Optional이 값을 가지고 있으면 true 아니면 false 반환
public boolean isPresent() {
  return value != null;
}

// Optional이 값을 가지 있으면 전달 받은 람다를 값에 적용 값이 없으면 아무 일도 안함
public void ifPresent(Consumer<? super T> action) {
  if (value != null) {
    action.accept(value);
  }
}
```

**예시**

```java
SoundCard soundcard = ...;
if(soundcard != null){
  System.out.println(soundcard);
}
```

```java
Optional<Soundcard> soundcard = ...;
soundcard.ifPresent(System.out::println);
```



## 3.2 orElse()

* Optional이 값을 가지고 있으면 값을 반환 비어있는 경우 other 객체 반환

```java
public T orElse(T other) {
  return value != null ? value : other;
}
```

**예시**

```java
Soundcard soundcard = maybeSoundcard.orElse(new Soundcard("defaut"));
```



## 3.3 orElseGet()

* `orElseGet()`은 `orElse()` 메서드에 대응하는 게으른 버전의 메서드이다
* Optional이 비었을 경우에만 supplier가 실행되기 때문이다

```java
public T orElseGet(Supplier<? extends T> supplier) {
  return value != null ? value : supplier.get();
}
```



## 3.4 orElseThrow()

* Optional이 값을 가지고 있으면 값을 반환 아니면 예외를 던짐

```java
public T orElseThrow() {
  if (value == null) {
    throw new NoSuchElementException("No value present");
  }
  return value;
}

public <X extends Throwable> T orElseThrow(Supplier<? extends X> exceptionSupplier) throws X {
  if (value != null) {
    return value;
  } else {
    throw exceptionSupplier.get();
  }
}
```

**예시**

```java
Soundcard soundcard = maybeSoundCard.orElseThrow(IllegalStateException::new);
```



## 3.5 get()

* get()은 값을 읽는 가장 간단한 메서드이면서 동시에 가장 안전하지 않은 메서드다
* Optional이 값을 가지고 있으면 값을 반환하고 값이 없으면 NoSuchElementException 예외를 발생시킨다
* 따라서 반드시 Optional에 값이 있다고 가정할 수 있는 상황이 아니면 사용하지 않는 것이 바람직하다 



## 3.6 map()

* Optional이 값을 가지고 있으면 값에 mapper를 적용하고 Optional 감싸서 반환한다
* Optional이 비어있으면 빈 Optional 반환

```java
public <U> Optional<U> map(Function<? super T, ? extends U> mapper) {
  Objects.requireNonNull(mapper);
  if (!isPresent()) {
    return empty();
  } else {
    return Optional.ofNullable(mapper.apply(value));
  }
}
```

Optional이 값을 가지고 있으면 map의 인수로 제공된 함수가 값을 바꾼다.

```java
@Test
void optionalMapTest() {
  Optional<Integer> optionalInteger = Optional.ofNullable(10);
  Optional<String> stringOptional = optionalInteger.map(String::valueOf);
  assertThat(stringOptional.get()).isEqualTo("10");
}
```

Optional이 비어있으면 아무 일도 일어나지 않는다.

```java
@Test
void emptyOptionalMapTest() {
  Optional<Integer> optionalInteger = Optional.ofNullable(null);
  Optional<String> stringOptional = optionalInteger.map(String::valueOf);
  assertThat(stringOptional.isEmpty()).isTrue();
}
```



## 3.7 flatMap

* Optional이 값을 가지고 있으면 값에 mapper를 적용하고 그 결과를 Optional로 감싸지 않고 반환
* Optional이 비어있으면 빈 Optional 반환

```java
public <U> Optional<U> flatMap(Function<? super T, ? extends Optional<? extends U>> mapper) {
  Objects.requireNonNull(mapper);
  if (!isPresent()) {
    return empty();
  } else {
    @SuppressWarnings("unchecked")
    Optional<U> r = (Optional<U>) mapper.apply(value);
    return Objects.requireNonNull(r);
  }
}
```

**map과 flatMap 비교**

```java
public class Person {
  private String name;

  public Person(String string) {
    this.name = string;
  }

  public Optional<String> getName() {
    return Optional.ofNullable(name);
  }
}

@Test
void testFlatMap1() {
  Person person = new Person("nys");
  Optional<Person> personOptional = Optional.ofNullable(person);
  // Person::getName의 반환 값 Optional을 반환
  Optional<String> optionalS = personOptional.flatMap(Person::getName);
  // Person::getName의 반환 값 Optional을 다시 Optional로 감싸서 반환
  Optional<Optional<String>> optionalOptionalS = personOptional.map(Person::getName);
}

@Test
void testFlatMap2() {
  Optional<Person> optional = Optional.ofNullable(null);
  Optional<String> name = optional.flatMap(Person::getName);
  assertThat(name).isEmpty();
}
```



# 4 주의사항

**리턴값으로만 쓰기를 권장한다**

* 메소드 매개변수 타입, 맵의 키 타입, 인스턴스 필드 타입으로 쓰지 말자
* 도메인 모델에 Optional을 사용했을 때 데이터를 직렬화할 수 없다

> Optional 클래스의 설계자는 Optional의 용도가 선택형 반환값을 지원하는 것이라고 명확하게 못박았다. Optional 클래스는 필드 형식으로 사용할 것을 가정하지 않았으므로 Serializable 인터페이스를 구현하지 않는다 따라서 도메인 모델에 Optional을 사용한다면 직렬화 모델을 사용하는 도구나 프레임워크에서 문제가 될 수 있다



**프리미티브 타입용 Optional은 따로 있다.**

* 예) OptionalInt, OptionalLong
* 프리미티브 타입용 Optional은 사용하지 말자
* 스트림이 많은 요소를 가질 떄는 기본형 특화 스트림을 이용해 성능을 향상시킬 수 있다
* 하지만 Optional의 최대 요소 수는 한 개이므로 성능을 개선할 수 없다
* 기본형 특화 Optional은 map, flatMap, filter등을 지원하지 않는다



**Optional을 리턴하는 메소드에서 null을 리턴하지 말자.**

* 또 다시 중첩된 null 확인 코드를 작성하게 될 것이다



**Collection, Map, Stream Array, Optional은 Opiontal로 감싸지 말 것.**



참고

* https://www.oracle.com/technical-resources/articles/java/java8-optional.html
* https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html
* [모던 자바 인 액션](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9791162242025)