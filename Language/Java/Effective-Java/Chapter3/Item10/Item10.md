# equals는 일반 규약을 지켜 재정의하라

- equals 메서드 재정의는 곳곳에 함정이 도사리고 있어 끔찍한 결과를 초래한다.
- 따라서 아예 재정의를 하지 않는 것이 더 좋을 때도 있다.



# 1 equals 재정의 하지 않는 경우



## 1.1 각 인스턴스가 본질적으로 고유할 경우

- 값을 표현하는 게 아닌 동작하는 개체를 표현하는 클래스일때 
  - 예: `Thread`



## 1.2 인스턴스의 '논리적 동치성'을 검사할 일이 없을 경우

* 논리적 동치성: 두 객체를 비교할 때 두 객체가 같은지가 아니라 값이 같음을 비교하는 경우
  * 주로 값 클래스를 논리적 동치성으로 비교한다
  * 값 클래스: Integer, String 등
* 객체의 식별성: 두 객체를 비교할 때 두 객체가 같은지 비교하는 경우
* `java.util.regex.Pattern`의 `equals`는 논리적 동치성 검사가 필요없다라고 판단하여 equals를 재정의하지 않았다



**Integer.java**

* 값 클래스 Integer의 equals 메소드는 논리적 동치성을 따진다
* 두 객체간의 값이 같은지를 비교하고 있다

```java
public boolean equals(Object obj) {
  if (obj instanceof Integer) {
    return value == ((Integer)obj).intValue();
  }
  return false;
}
```



## 1.3 상위 클래스에서 재정의한 equals가 하위 클래스에도 딱 들어맞는 경우



**AbstractList.java**

```java
public abstract class AbstractList<E> extends AbstractCollection<E> implements List<E> {
	public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof List))
            return false;

        ListIterator<E> e1 = listIterator();
        ListIterator<?> e2 = ((List<?>) o).listIterator();
        while (e1.hasNext() && e2.hasNext()) {
            E o1 = e1.next();
            Object o2 = e2.next();
            if (!(o1==null ? o2==null : o1.equals(o2)))
                return false;
        }
        return !(e1.hasNext() || e2.hasNext());
    }
}
```

- 대부분의 List의 구현체들은 AbstractList로부터 equals를 상속받아 그대로 쓴다



## 1.4 클래스가 private이거나 package-private이고 equals 메서드를 호출할 일이 없을 경우

- equlas 자체를 호출하는 걸 막고 싶다면 아래와 같이 하는것이 좋다

```java
@Override
public boolean equals (Object object) {
	throw new AssertionError();
}
```



## 1.5 인스턴스 통제 클래스

- 인스턴스가 2개 이상 만들어지지 않기 때문에 논리적 동치성과 객체 식별성이 같은 의미가 되기 때문이다.
- 예: Enum, 싱글톤



# 2 equals 메서드를 재정의해야 하는 경우

- 객체 식별성이 아니라 논리적 동치성을 확인해야 하는데, 상위 클래스의 equals가 논리적 동치성을 비교하도록 재정의되지 않은 경우



# 3 equals 메서드 일반 규약

- equals 메서드를 재정의할 때는 반드시 다섯 가지의 일반 규약을 지켜야한다.
  - 반사성: `x.equlas(x) == true`
  - 대칭성: `x.equals(y) == y.equals(x)`
  - 추이성
    - `x.equals(y) == true`
    - `y.equals(z) == true`
    - `x.equals(z) == true`
  - 일관성
    - `x.equals(y) == true`
    - `x.equals(y) == true`
    - `x.equals(y) == true`
  - non-null: `x.equals(null) == false`



## 3.1 반사성(reflexivity)

```java
x.equlas(x) == true
```

- 단순히 말하면 객체는 자기 자신과 같아야 한다는 뜻이다.
- 이걸 지키는지를 확인할 수 있는 방법은 인스턴스가 들어있는 컬렉션에 contains 메서드를 호출해 true가 나오면 된다.



**Member.java**

```java
@AllArgsConstructor
public class Member {
  private String email;
  private String name;
  private Integer age;

  @Override
  public boolean equals(Object o) {
    if (o == null) {
      return false;
    }
    return this == o;
  }
}
```



**Test**

```java
@Test
void testReflexivity() {
  List<Member> members = new ArrayList<>();
  Member member = new Member("nameks17@gmail.com", "nys", 31);
  members.add(member);

  Assertions.assertThat(members.contains(member)).isTrue();
}
```



## 3.2 대칭성(symmetry)

```java
x.equals(y) == y.equals(x)
```

- 서로에 대한 동치 여부에 똑같이 답해야 한다는 뜻이다
- 반사성 요건과 달리 대칭성 요건은 자칫하면 어길 수 있다



**CaseInsensitiveString.java**

```java
@AllArgsConstructor
public class CaseInsensitiveString {
  private final String s;

  @Override
  public boolean equals(Object o) {
    if (o instanceof String) {
      return s.equalsIgnoreCase((String) o);
    }
    return false;
  }
}
```

**Test**

* 대칭성(symmetry) 위반
* CaseInsensitiveString의 equals 자체는 잘 작동하지만 **그 반대는 작동하지 않는다.**
* String의 equals는 CaseInsensitiveString의 존재를 알지 못하기 때문이다.
* 이를 해결하기 위해서는 equals에서 **일반 String과 비교하는 부분을 없애야 한다.**

```java
@Test
void testSymmetry() {
  CaseInsensitiveString x = new CaseInsensitiveString("AAA");
  String y = "aaa";

  assertThat(x.equals(y)).isTrue();
  assertThat(y.equals(x)).isFalse();
}
```



**수정된 CaseInsensitiveString.java**

```java
@Override
public boolean equals(Object o) {
    return o instanceof CaseInsensitiveString &&
           ((CaseInsensitiveString) o).s.equalsIgnoreCase(s);
}
```

**Test**

* 대칭성 규약을 지킴

```java
@Test
void testSymmetry() {
  CaseInsensitiveString x = new CaseInsensitiveString("AAA");
  CaseInsensitiveString y = new CaseInsensitiveString("AAA");

  assertThat(x.equals(y)).isTrue();
  assertThat(y.equals(x)).isTrue();
}
```



## 3.3 추이성(transitivity)

```java
x.equals(y) == true
y.equals(z) == true
x.equals(z) == true
```



**Point.java**

```java
@AllArgsConstructor
public class Point {
  private final int x;
  private final int y;

  @Override
  public boolean equals(Object o) {
    if (!(o instanceof Point))
      return false;
    Point p = (Point) o;
    return p.x == x && p.y == y;
  }
}
```



**ColorPoint.java**

* 대칭성 위반 equals

```java
public class ColorPoint extends Point {
  private final Color color;

  public ColorPoint(int x, int y, Color color) {
    super(x, y);
    this.color = color;
  }

  @Override
  public boolean equals(Object o) {
    if (!(o instanceof ColorPoint))
      return false;
    return super.equals(o) && ((ColorPoint) o).color == color;
  }
}
```



**Test**

* Point의 equals는 색상을 무시하고 ColorPoint의 equals는 입력 매개변수의 클래스 종류가 다르다면 매번 false 반환

```java
@DisplayName("대칭성 위반")
@Test
void testTransitivity() {
  Point x = new Point(1, 2);
  ColorPoint y = new ColorPoint(1, 2, Color.RED);

  assertThat(x.equals(y)).isTrue();
  assertThat(y.equals(x)).isFalse();
}
```



**수정된 ColorPoint.java**

```java
@Override
public boolean equals(Object o) {
    if (!(o instanceof Point))
        return false;

    // o가 일반 Point면 색상을 무시하고 비교
    if (!(o instanceof ColorPoint))
        return o.equals(this);

    // o가 일반 ColorPoint 색상까지 비교
    return super.equals(o) && ((ColorPoint) o).color == color;
}
```

**Test**

* 수정 후 대칭성은 만족하나 추이성을 위반한다

```java
@DisplayName("대칭성 만족")
@Test
void testTransitivity2() {
  Point x = new Point(1, 2);
  ColorPoint y = new ColorPoint(1, 2, Color.RED);

  assertThat(x.equals(y)).isTrue();
  assertThat(y.equals(x)).isTrue();
}
```

* x와 y와의 비교에서, 그리고 y와 z와의 비교는 색상을 무시했지만, x와 z와의 비교에서는 색상을 고려했기 때문에 추이성이 깨졌다.

```java
@DisplayName("추이성 위반")
@Test
void testTransitivity3() {
  ColorPoint x = new ColorPoint(1, 2, Color.RED);
  Point y = new Point(1, 2);
  ColorPoint z = new ColorPoint(1, 2, Color.BLUE);

  assertThat(x.equals(y)).isTrue();
  assertThat(y.equals(x)).isTrue();
  assertThat(x.equals(z)).isFalse();
}
```



**해결책**

* 구체 클래스를 확장해 새로운 값을 추가하면서 equals 규약을 만족시킬 방법은 존재하지 않는다
* 구체 클래스의 하위 클래스에서 값을 추가할 방법은 없지만 괜찮은 우회 방법이 있다
  * 상속 대신 컴포지션을 사용하라!



**수정된 ColorPoint.java**

* 상속대신 컴포지션을 사용한다

```java
public class ColorPoint {
  private final Point point;
  private final Color color;

  public ColorPoint(int x, int y, Color color) {
    point = new Point(x, y);
    this.color = Objects.requireNonNull(color);
  }

  @Override
  public boolean equals(Object o) {
    if (!(o instanceof ColorPoint))
      return false;
    ColorPoint cp = (ColorPoint) o;
    return cp.point.equals(point) && cp.color.equals(color);
  }
}
```



## 3.4 일관성(consistency)

```java
x.equals(y) == true;
x.equals(y) == true;
x.equals(y) == true;
```

- 일관성은 두 객체가 같다면 앞으로도 영원히 같아야 한다는 뜻
  - 어느 하나 혹은 두 객체 모두가 수정되지 않는 경우
- 가변 객체는 비교 시점에 따라 서로 다를 수도 혹은 같을 수도 있다
- 일관성을 지키기 위한 가장 좋은 방법은 불변 객체이다
  - 불변 객체는 한번 같은 객체는 영원히 같고  한번 다르면 끝까지 달라야한다



## 3.5 non-null

```java
x.equals(null) == false;
```

- 모든 객체가 null과 같지 않아야 한다



# 4 양질의 equals 메소드 구현 방법

1. `==` 연산자를 사용해 입력이 자기 자신의 참조인지 확인한다
   * 자기 자신이면 `true`를 반환한다.
   * 단순 성능 최적화용으로 비교 작업이 복잡한 경우 값어치를 한다
2. `instanceof` 연산자로 입력이 올바른 타입인지 확인한다
   * 올바른 타입이 아니라면 `false` 반환
   * 같은 인터페이스를 구현한 클래스끼리 비교하고 싶을 땐 equals에서 인터페이스를 사용해야 한다
   * 예 `List`, `Map`, `Map.Entry`
3. 입력을 올바른 타입으로 형변환한다
   * 앞에 `instanceof` 검사를 했기 때문에 100% 성공한다
4. 입력 객체와 자기 자신의 대응되는 핵심 필드들이 모두 일치하는지 하나씩 검사한다
   * 모든 필드가 일치하면 `true`
   * 하나라도 다르면 `false`
   * 2 단계에서 인터페이스를 사용했다면 필드 값을 가져올 때 인터페이스의 메소드를 사용해야한다.



## 4.1 필드 비교

* 기본 타입(float, double 제외)
  *  `==` 연산자로 비교한다
* float, double
  * float: `Float.compare(f1, f2);` 정적 메소드 사용
  * double: `Double.compare(d1, d2);`정적 메소드 사용
* 참조 타입
  * 각각의 equals 메소드로 비교한다
* 배열  
  * 원소 각각을 지침대로 비교



참고

* [이펙티브 자바 3/E](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788966262281)