# Comparable을 구현할지 고려하라



# 1 개요

* Comparable의 compareTo 메소드는 단순 동치성 비교에 더해 순서까지 비교할 수 있다
* Comparable를 구현했다는 것은 그 클래스의 인스턴스들에는 자연적인 순서가 있음을 뜻한다
* 순서를 고려해야 하는 값 클래스를 작성한다면 꼭 Comparable 인터페이스를 구현하여 인스턴스들을 쉽게 정렬하고, 검색하고, 비교 기능을 제공하는 컬렉션과 어우러지도록 하자



# 2 Comparable 인터페이스



**Comparable.java**

```java
public interface Comparable<T> {
      public int compareTo(T o);
}
```



## 2.1 **compareTo 메소드 규약**

* 이 객체와 주어진 객체의 순서를 비교한다
* 이 객체가 주어진 객체보다 작으면 음의 정수를, 같으면 0을, 크면 양의 정수를 반환한다
* 이 객체와 비교할 수 없는 타입의 객체가 주어지면 ClassCastException을 던진다

- **`x.compareTo(y) == -y.compareTo(x)`**
  * 두 객체의 참조의 순서를 바꿔도 비교해도 예상한 결과가 나와야한다


- `(x.compareTo(y) > 0 && y.compareTo(z) > 0) == x.compareTo(z) > 0`
  - 추이성: 1번 객체가 2번 객체 보다 크고 2번 객체가 3번 객체보다 크면 1번 객체는 3번 객체보다 커야한다

- **`x.compareTo(y) == 0 == (x.compareTo(z) == y.compareTo(z))`**
  * 크기가 같은 객체들끼리는 어떤 객체와 비교하더라도 항상 같아야한다


- **`(x.compareTo(y) == 0) == x.eqauls(y)`**

  * 필수가 아니지만, 꼭 지키는것이 좋다. (혹시 지키지 못하면 명시해줘야 한다.)

  * compareTo 메소드로 수행한 동치성 테스트의 결과가 eqauls와 같아야한다

  * 지키지 않는다면 컬렉션에 넣으면 해당 컬렉션이 구현한 인터페이스에 정의한 동작과 엇박자를 낼 것이다.

  * 정렬된 컬렉션(TreeSet 등)은 equals가 아닌 compareTo를 사용해 동치성을 비교하기 떄문이다.




**예시**

* HashSet은 equals 메소드를 사용해서 객체를 비교함
  * BigDecimal number1 = new BigDecimal("1.0");
  * BigDecimal number2 = new BigDecimal("1.00");
  * 위 두 객체를 equals로 비교하면 다르다
* TreeSet은 compareTo 메소드를 사용해서 객체를 비교함
  * BigDecimal number1 = new BigDecimal("1.0");
  * BigDecimal number2 = new BigDecimal("1.00");
  * 위 두 객체를 compareTo로 비교하면 같다

```java
@Test
void test() {
  BigDecimal number1 = new BigDecimal("1.0");
  BigDecimal number2 = new BigDecimal("1.00");

  Set<BigDecimal> hashSet = new HashSet<>();
  hashSet.add(number1);
  hashSet.add(number2);

  Set<BigDecimal> treeSet = new TreeSet<>();
  treeSet.add(number1);
  treeSet.add(number2);

  assertThat(hashSet).hasSize(2);
  assertThat(treeSet).hasSize(1);
}
```



## 2.2 주의사항

* equals()와 같이 상속을 사용해 새로운 값을 추가하면 규약을 지킬 방법이 없다.
* equals()와 같이 상속이 아닌 컴포지션을 사용해서 이 문제점은 해결하자



# 3 compareTo 메소드 작성 요령

* 정수 기본 타입 필드를 비교할 때 관계 연산자(<, >)를 사용하지 말자
  * 박싱된 기본 타입 클래스의 정적 메서드 compare를 사용하자
  * 또는 Comparator 인터페이스가 제공하는 비교자 생성 메서드를 사용하자
* 클래스 핵심 필드가 여러개라면 어느 것을 먼저 비교하는지가 중요라므로 핵심 필드부터 비교하라
  * 비교 결과가 0이 아니라면 즉 순서가 결정되면 거기서 끝 곧장 결과를 반환하자



**PhoneNumber.java**

* 핵심 필드 순으로 비교
* 박싱된 기본 타입 클래스의 정적 메서드 compare를 사용

```java
public final class PhoneNumber implements Comparable<PhoneNumber> {

  private final short areaCode;
  private final short prefix;
  private final short lineNum;

  @Override
  public int compareTo(PhoneNumber o) {
    // 가장 중요한 필드 비교
    int result = Short.compare(areaCode, o.areaCode);
    if (result == 0)
      return result;

    // 두 번째로 중요한 필드 비교
    result = Short.compare(prefix, o.prefix);
    if (result == 0)
      return result;

    // 세 번째로 중요한 필드 비교
    return Short.compare(lineNum, o.lineNum);
  }
}
```



**PhoneNumber.java**

* Comparator 생성 메소드(comparingInt)를 활용한 compareTo 메소드 작성
* Comparator 생성 메소드로 `comparingLong`, `comparingDouble` 메소드도 존재한다

```java
@Getter
public final class PhoneNumber implements Comparable<PhoneNumber> {
  private final short areaCode;
  private final short prefix;
  private final short lineNum;

  private static final Comparator<PhoneNumber> COMPARATOR = Comparator.comparingInt(PhoneNumber::getAreaCode)
    .thenComparing(PhoneNumber::getPrefix)
    .thenComparing(PhoneNumber::getLineNum);

  @Override
  public int compareTo(PhoneNumber phoneNumber) {
    return COMPARATOR.compare(this, phoneNumber);
  }
}
```



참고

* [이펙티브 자바 3/E](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788966262281)