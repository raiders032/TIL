# Lambda

> 자바는 함수적 프로그래밍을 위해 자바 8부터 람다식을 지원한다. 람다식은 익명 함수(anonymous function)를 생성하기 위한 식으로 객체지향 언어보다는 함수지향 언어에 가깝다. 람다식의 형태는 매개변수를 가진 코드 블록이지만, 런타임 시에는 익명 구현 객체를 생성한다.



예시

```java
 Runnable runnable = new Runnable() {
            @Override
            public void run() {
                ...
            }
        }
```

* Runnable 인터페이스의 익명 구현 객체를 생성하는 코드

```java
Runnable runnable = () -> {
            ...
        }
```

* 람다식은 `(매개변수) -> {실행코드}` 형태로 작성되며 런타임시에 인터페이스의 익명 구현 객체로 생성된다.
* 위 코드는 Runnable 변수에 대입되므로 람다식은 Runnable의 익명 구현 객체를 생성하게 된다.



## Lambda의 기본 문법

```java
(타입 매개변수, ...) -> {실행문; ...}
```

**타입 매개변수**

* 인자가 없을 때: () 
* 인자가 한개일 때: (one) 또는 one
* 인자가 여러개 일 때: (one, two) 
* 인자의 타입은 생략 가능, 컴파일러가 추론하지만 명시할 수도 있다. (Integer one, Integer two)

**실행문**

* 화상표 오른쪽에 함수 본문을 정의한다.
* 여러 줄인 경우에 { }를 사용해서 묶는다.
* 한 줄인 경우에 생략 가능, return도 생략 가능.



## functional interface

* 모든 인터페이스를 람다식의 타겟 타입으로 사용할 수 없다
  * 두 개 이상의 추상 메서드가 선언된 인터페이스는 람다식을 이용해서 구현 객체를 생성할 수 없다.
* 하나의 추상 메서드가 선언된 인터페이스만이 람다식의 타켓 타입이 될 수 있다
  * 이러한 인터페이스를 함수적 인터페이스(functional interface)라고 한다.
* `@FunctionalInterface` 를 인터페이스에 적용하면 두 개 이상의 추상 메서드가 선언되지 않도록 컴파일 시점에 체킹할 수 있다.



## 표준 API의 함수형 인터페이스

* Java가 기본으로 제공하는 함수형 인터페이스
* java.lang.funcation 패키지
  * 자바에서 미리 정의해둔 자주 사용할만한 함수 인터페이스
  * Function, BiFunction, Consumer, Supplier, Predicate, UnaryOperator, BinaryOperator이 있다
* 구분 기준은 인터페이스에 선언된 추상 메서드의 매개값과 리턴값의 유무이다.

**Function**

* T 타입을 받아서 R 타입을 리턴하는 함수 인터페이스
  * R apply(T t)
* 함수 조합용 메소드
  * andThen
  * compose

**BiFunction**

* 두 개의 값(T, U)를 받아서 R 타입을 리턴하는 함수 인터페이스 ○ 
  * R apply(T t, U u) 

**Consumer**

* T 타입을 받아서 아무값도 리턴하지 않는 함수 인터페이스
  * void Accept(T t)
* 함수 조합용 메소드
  * andThen

**Supplier**

* T 타입의 값을 제공하는 함수 인터페이스 
  * T get() 

**Predicate**

* T 타입을 받아서 boolean을 리턴하는 함수 인터페이스
  * boolean test(T t)
* 함수 조합용 메소드
  * and
  * or
  * negate 

**UnaryOperator** 

* Function의 특수한 형태로, 입력값 하나를 받아서 동일한 타입을 리턴하는 함수 인터페이스 

**BinaryOperator** 

* BiFunction의 특수한 형태로, 동일한 타입의 입렵값 두개를 받아 리턴하는 함수 인터페이스