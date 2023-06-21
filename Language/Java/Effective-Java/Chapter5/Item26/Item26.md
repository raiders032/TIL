# 로 타입은 사용하지 말라



# 1 제네릭 타입

* 클래스 선언에 타입 매개변수가 쓰이면 **`제네릭 클래스`**라고 한다
* 인터페이스 선언에 타입 매개변수가 쓰이면 **`제네릭 인터페이스`**라고 한다
  * 예컨대 List 인터페이스는 원소의 타입을 나타내는 타입 매개변수 E를 받는다
* 제네릭 클래스와 제네릭 인터페이스를 통틀어 **제네릭 타입**이라고 한다



# 2 로 타입(raw type)

* 제네릭 타입을 정의하면 그에 딸린 로 타입(raw type)도 함께 정의된다
* 로 타입은 제네릭 타입에서 타입 매개변수를 전혀 사용하지 않을 때를 말한다
* `List<E>`의 로 타입은 `List`다
* 제네릭이 도래하기 전 코드와 호환되도록 하기 위한 궁여지책이다
* **로 타입을 쓰면 제네릭이 안겨주는 안정성과 표현력을 모두 읽게 된다**



## 2.1 단점

**Raw type 사용**

- 경고 메시지를 보여주긴 하지만 아무 오류 없이 컴파일 된다.
- ClassCastException이 런타임에 발생한다.

```java
// Stamp 인스턴스만 취급한다.
private final Collection stamps = ...; 

// 컴파일 오류가 발생하지 않는다.
stamps.add(new Coin(...))
```

```java
for (Iterator i = stamps.iterator(); i.hasNext();) {
  Stamp stamp = (Stamp) i.next(); // ClassCastException 발생
  stamp.cancel();
}
```



**매개변수화 타입 사용**

- 매개변수화 타입(parameterized type)은 클래스(또는 인터페이스) 이름이 나오고 이어서 꺽쇠괄호 안에 실제 타입 매개변수를 나열한 것을 의미한다.
  - 예시) `List<String>`
- 컴파일 타임에 오류가 발생한다.

```java
// Stamp 인스턴스만 취급한다.
private final Collection<Stamp> stamps = ...; 
// 컴파일 오류가 발생한다.
stamps.add(new Coin(...))
```



## 2.2 로 타입의 존재 이유

- 자바가 제네릭을 받아들이기까지 10년이 걸렸다.
- 제네릭 없이 작성된 코드와 제네릭을 사용하는 새로운 코드가 맞물려 돌아가도록 로 타입을 지원하고 제네릭 구현에는 소거 방식을 적용했다.
- 로 타입은 제네릭이 없을 때 작성된 코드와의 호환성을 위해 존재 하는 것으로 직접 사용하지는 말자.



## 2.3 로 타입을 사용하는 예외

- class 리터럴에는 로 타입을 써야한다.
  - class 리터럴에는 매개변수화 타입을 사용하지 못하게 했다.
  - 예를 들어 `List.class`는 허용되지만 `List<String>.class`은 허용되지 않는다.
- instance 연산자
  - 런타임에는 제네릭 타입 정보가 지워지므로 instance 연산자는 비한정적 와일드카드 이외의 매개변수화 타입에는 적용할 수 없다.



# 3 `List` vs `List<Object>`

* `List` 같은 로 타입은 사용해서는 안되나, `List<Object>` 처럼 임의 객체를 허용하는 매개변수화 타입을 사용해도 괜찮다
* 구체적인 예시를 보고 이유를 알아보자



**로 타입을 사용한 메소드**

```java
private static void unsafeAdd(List list, Object o) {
  list.add(o);
}
```

```java
@Test
void test1() {
  List<String> strings = new ArrayList<>();
  unsafeAdd(strings, Integer.valueOf(42));
  String s = strings.get(0);
}
```

* 컴파일은 되지만 로 타입인 List를 사용하여 경고가 발생한다
* strings.get(0)의 결과를 형변환하려 할 때 `ClassCastException` 예외 발생
  * Integer를 String으로 변환하려고 함

* 컴파일러의 경고를 무시하여 그 대가를 치른 것



**`List<Object>`를 사용한 메소드**

```java
private static void unsafeAdd(List<Object> list, Object o) {
  list.add(o);
}
```

* 로 타입을 `List<Object>`으로 바꾸면 아래와 같은 오류 메시지가 출력되며 컴파일조차 되지 않는다
  * `List<String>`가 `List<Object>`의 서브 타입이 아니기 때문에 발생하는 오류
  * 컬렉션의 원소의 타입을 모르는 경우 혹은 어떤 타입이든 상관없다면 와일드 카드를 사용하자
* 이처럼 로 타입을 사용하지 않으면 오류를 컴파일 시점에 알 수 있다는 장점이 있다

```
error: incompatible types: List<String> cannot be converted to List<Object>
        unsafeAdd(strings, Integer.valueOf(42));
```



# 4 와일드 카드

* 컬렉션의 원소의 타입을 모르는 경우 혹은 어떤 타입이든 상관없다면 와일드 카드(Unbounded Wildcard)를 사용하자
  * [Generic.md](../../../Generic/Generic.md)의 Unbounded Wildcard 참고



# 5 정리

* 로 타입을 사용하면 런타임에 예외가 발생할 수 있으니 사용하면 안 된다



참고

* [이펙티브 자바 3/E](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788966262281)