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



# 2 Optional 만들기

* Optional 객체를 만드는 방법



## 2.1 empty

* 빈 Optional 만들기

```java
Optional<Soundcard> sc = Optional.empty();
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



# 3 Optional 사용하기

* 메소드 호출의 반환 값으로 Optional을 받은 클라이언트가 Optional을 사용하는 방법



## 3.1 ifPresent 메소드

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



## 3.2 orElse 메소드

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



## 3.3 orElseThrow 메소드

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



## 3.4 map

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



## 3.5 flatMap

* Optional이 값을 가지고 있으면 값에 mapper를 적용하고 그 결과가 Optional이면 Optional로 감싸지 않고 반환
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

* 리턴값으로만 쓰기를 권장한다
  * 메소드 매개변수 타입, 맵의 키 타입, 인스턴스 필드 타입으로 쓰지 말자
* Optional을 리턴하는 메소드에서 null을 리턴하지 말자.
* 프리미티브 타입용 Optional을 따로 있다. 
  * 예) OptionalInt, OptionalLong
* Collection, Map, Stream Array, Optional은 Opiontal로 감싸지 말 것.



참고

* https://www.oracle.com/technical-resources/articles/java/java8-optional.html
* https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html