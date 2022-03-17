# 불필요한 객체 생성을 피하라



# 1 개요

* 똑같은 기능의 객체를 매번 생성하는 것보다 객체 하나를 재사용하는 편이 좋다
* 특히 불변 객체는 언제든 재사용할 수 있다.



# 2 불필요한 객체 생성

**불필요한 객체 생성 방식**

```java
String s1 = new String("java");
String s2 = new String("java");
Assertions.assertThat(s1 == s2).isFalse();
```

* `java`라는 문자열을 매번 새로 생성한다



**객체 재사용 방식**

```java
String s1 = "java";
String s2 = "java";
Assertions.assertThat(s1 == s2).isTrue();
```

* **[String Constant Pool](https://starkying.tistory.com/entry/what-is-java-string-pool)**을 사용하여 `java`라는 문자열을 **캐싱**하여 사용한다.
* 즉 똑같은 기능의 객체를 매번 생성하지 않고 객체 하나를 재사용하는 방식



## 2.1 auto boxing

* 불필요한 객체를 생성하는 또 다른 방법으로 오토박싱이 있다. 
* 오토박싱은 프로그래머가 기본 타입과 Wrapper 타입을 섞어 쓸 수 있게 해주고 박싱과 언박싱을 자동으로 해준다.
* 오토박싱은 기본 타입과 Wrapper 타입의 경계가 안보이게 해주지만 그렇다고 그 경계를 없애주진 않는다.



**성능 비교**

* sum 변수의 타입을 Long으로 만들었기 때문에 불필요한 Long 객체를 2의 31 제곱개 만큼 만들게 된다
* **불필요한 오토박싱을 피하려면 박스 타입 보다는 프리미티브 타입을 사용해야 한다.**

```java
long start = System.currentTimeMillis();
Long sum = 0l;
for (long i = 0 ; i <= Integer.MAX_VALUE ; i++) {
  sum += i;
}
System.out.println(System.currentTimeMillis() - start);
```

```
4713
```

```java
long start = System.currentTimeMillis();
long sum = 0l;
for (long i = 0 ; i <= Integer.MAX_VALUE ; i++) {
  sum += i;
}
System.out.println(System.currentTimeMillis() - start);
```

```
689
```



# 3 객체의 재사용

**불필요한 객체 생성 방식**

```java
Integer num1 = new Integer(100);
Integer num2 = new Integer(100);
Assertions.assertThat(num1 == num2).isFalse();
```



**캐싱을 이용한 객체 재사용**

```java
Integer num1 = Integer.valueOf(50);
Integer num2 = Integer.valueOf(50);
Assertions.assertThat(num1 == num2).isTrue();
```

```java
Integer num1 = Integer.valueOf(1000);
Integer num2 = Integer.valueOf(1000);
Assertions.assertThat(num1 == num2).isFalse();
```

* Wrapper Class에서는 캐싱을 지원해주는 `valueOf()`라는 메소드가 존재한다.
* 대표적으로 자주 사용하는 `Boolean`의 경우에는 true/false를,
* `Short`, `Integer`와 `Long`의 경우에는 -128 ~ 127까지의 수의 캐싱을 지원해준다.



**정적 팩토리 메소드**

* 생성자 대신 정적 팩토리 메서드를 제공하는 불변 클래스에서는 정적 팩토리 메서드를 사용해 불필요한 객체 생성을 피할 수 있다.
* `new Boolean(true)` 생성자 대신 `Boolean.valueOf(true)` 팩토리 메서드를 사용하는 것이 좋다
  * 생성자는 호출할 때마다 새로운 객체를 만들지만 팩토리 메소드는 그렇지 않다

```java
Boolean b1 = new Boolean(true);
Boolean b2 = new Boolean(true);
Assertions.assertThat(b1 == b2).isFalse();
```

```java
Boolean b1 = Boolean.valueOf(true);
Boolean b2 = Boolean.valueOf(true);
Assertions.assertThat(b1 == b2).isTrue();
```



# 4 생성 비용이 비싼 객체

* 인스턴스 생성 비용이 비싸다는 의미는 인스턴스를 생성하는데 드는 비용이 크다는 의미이다. 
* 즉, 메모리, 디스크 사용랑, 네트워크 대역폭 등이 높을수록 생성 비용이 비싸다는 이야기를 한다.
  * 크기가 아주 큰 Array
  * Database Connection
  * I/O 작업을 필요로 하는 Object
  * 보통 `Connection`, `Pattern` 인스턴스들이 비싼 객체로 소개된다.

**예시**

```java
// 매번 Pattern 객체를 생성하는 방식
static boolean isRomanNumeralSlow(String s) {
  return s.matches("^(?=.)M*(C[MD]|D?C{0,3})"
                   + "(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$");
}
```

* Java의 String에서는 패턴에 맞는 문자열임을 확인할 수 있는 `matches` 메서드를 제공한다. 
* 다만, 이 메서드는 매번 `Pattern` 객체를 생성하여 해당 문자열이 패턴에 맞는지 검사한다. 
* 때문에 가끔 한번 사용하는 경우는 문제되지 않지만 성능이 중요한 경우 비싼 `Pattern`을 매번 생성하므로 적절치 못하다. 

```java
// 매번 Pattern 객체를 미리 생성하고 재사용 하는 방식
private static final Pattern ROMAN = Pattern.compile(
  "^(?=.)M*(C[MD]|D?C{0,3})"
  + "(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$");

static boolean isRomanNumeralFast(String s) {
  return ROMAN.matcher(s).matches();
}
```

* 따라서 `Pattern` 객체를 미리 생성해두고 재사용하는 것이 성능상 유리하다.
* 저자에 따르면 6.5배 정도 빨라졌다고 한다
* 개선된 방식에서 isRomanNumeralFast 메소드가 한번도 호출되지 않으면 `ROMAN` 필드가 쓸데없이 초기화된 꼴이다
* 메서드가 처음 호출될 때 필드를 초기화하는 지연 초기화(lazy initializatoin)이 불필요한 초기화를 없앨 수 있지만 권하지 않는다
  * 코드를 복잡하게 만드는데 성능은 크게 개선되지 않을 때가 많다

# 5 결론

* **불필요한 객체를 생성하지 말자라는 것이지 객체 생성을 피하라는 말이 아니다.**
* JVM에서 별다른 일을 하지 않는 작은 객체를 생성하고 회수하는 것은 크게 부담이 되지 않는 일이다. 
* 또한 프로그램의 명확성, 간결성, 기능을 위해서 객체를 추가로 생성하는 것은 일반적으로 좋다. 
* 특히 값 객체 VO, value object로써 객체 자체를 값으로 사용하는 방식은 Thread Safe하므로 멀티스레드 환경에서 안전한 프로그래밍을 할 수 있다.
* 단순히 객체 생성을 피하고자 객체 풀을 만드는 것 또한 지양해야한다. 
* 객체 풀은 코드를 헷갈리게 만들 뿐만 아니라 메모리 사용량을 늘리고 성능을 떨어뜨릴 수 있다.



참고

* [이펙티브 자바 3/E](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788966262281)