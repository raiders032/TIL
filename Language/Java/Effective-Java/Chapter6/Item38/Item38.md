# 확장할 수 있는 열거 타입이 필요하면 인터페이스를 사용하라



# 1 개요

* **열거 타입은 거의 모든 상황에서 타입 안전 열거 패턴보다 우수하다**
* 단, 예외가 하나 있으니, **타입 안전 열거 패턴은 확장이 가능하나 열거 타입은 확장이 불가능하다**
  * 타입 안전 열거 패턴은 열거한 값을 그대로 가져온 다음 값을 더 추가하여 다른 목적으로 쓸 수 있다
  * 하지만 열거 타입은 의도적으로 확장이 불가능하게 설계되었다
* **열거 타입 확장이 필요한 경우 인터페이스와 그 인터페이스를 구현하는 기본 열거 타입을 함께 사용해 확장 효과를 낼 수 있다.**



## 1.1 타입 안전 열거 패턴

* enum이 도입되기 전(JDK 1.5 이전)에 사용하던 방식으로 제한된 수의 정적 타입을 만들어놓고 사용하는 패턴을 말한다.
* 정수 열거 패턴의 단점을 해결하고자 제안되었다.
  * [Item34.md](../Item34/Item34.md) 정수 열거 패턴 참고
* 참고로 자바 이펙티브 초판에 기술된 내용이다.



**정수 열거 패턴**

* 타입 안전성이 없다

```java
public class AppleV1 {
  public static final int APPLE_FUJI = 0;
  public static final int APPLE_PIPPIN = 1;
  public static final int APPLE_GRANNY_SMITH = 2;
}
```

```java
public class OrangeV1 {
  public static final int ORANGE_NAVEL = 0;
  public static final int ORANGE_TEMPLE = 1;
  public static final int ORANGE_BLOOD = 2;
}
```

```java
@Test
void test() {
  assertThat(AppleV1.APPLE_FUJI).isEqualTo(OrangeV1.ORANGE_NAVEL);
}
```



**타입 안전 열거 패턴**

* 타입 안전성이 있다
* 열거 타입은 상수 하나당 자신의 인스턴스를 하나씩 만들어 public static final 필드로 공개하는데 열거 타입이 존재하기전 같은 방식으로 타입 안전 열거 패턴을 사용했다

```java
public class AppleV2 {
  private final String name;

  public static final AppleV2 FUJI = new AppleV2("fuji");
  public static final AppleV2 PIPPIN = new AppleV2("pippin");
  public static final AppleV2 GRANNY_SMITH = new AppleV2("granny smith");

  public AppleV2(String name) {
    this.name = name;
  }
}
```

```java
public class OrangeV2 {
  private final String name;

  public static final OrangeV2 NAVEL = new OrangeV2("navel");
  public static final OrangeV2 TEMPLE = new OrangeV2("temple");
  public static final OrangeV2 BLOOD = new OrangeV2("blood");

  public OrangeV2(String name) {
    this.name = name;
  }
}
```

```java
@Test
void test() {
  assertThat(AppleV2.FUJI).isNotEqualTo(OrangeV2.NAVEL);
}
```



## 1.2 열거 타입

**타입 안전 열거 패턴**

```java
public class Operation {
  public static final Operation PLUS = new Operation("+", (x, y) -> x + y);
  public static final Operation MINUS = new Operation("-", (x, y) -> x - y);
  public static final Operation TIMES = new Operation("*", (x, y) -> x * y);
  public static final Operation DIVIDE = new Operation("/", (x, y) -> x / y);

  private final String symbol;
  private final BiFunction<Double, Double, Double> func;

  private Operation(String symbol, BiFunction<Double, Double, Double> func) {
    this.symbol = symbol;
    this.func = func;
  }

  public double apply(double x, double y) {
    return this.func.apply(x, y);
  }
}
```

**열거 타입**

```java
public enum Operation {
  PLUS("+", (x, y) -> x + y),
  MINUS("-", (x, y) -> x - y),
  TIMES("*", (x, y) -> x * y),
  DIVIDE("/", (x, y) -> x / y);

  private final String symbol;
  private final BiFunction<Double, Double, Double> func;

  Operation(String symbol, BiFunction<Double, Double, Double> func) {
    this.symbol = symbol;
    this.func = func;
  }

  public double apply(double x, double y) {
    return this.func.apply(x, y);
  }
}
```

**열거 타입 디컴파일 간략 버전**

* 타입 안전 열거 패턴과 유사하다
* 생성자가 private
  * 열거 타입 밖에서 접근할 수 있는 생성자를 제공하지 않는다
  * 열거 타입을 상속 받는 것이 불가능 하다

```java
public final class Operation extends java.lang.Enum<Operation> {
    public static final Operation PLUS;
    public static final Operation MINUS;
    public static final Operation TIMES;
    public static final Operation DIVIDE;
  
    private final java.lang.String symbol;
    private final java.util.function.BiFunction<java.lang.Double, java.lang.Double, java.lang.Double> func;

    private Operation(java.lang.String, java.util.function.BiFunction<java.lang.Double, java.lang.Double, java.lang.Double>);

}
```



# 2 열거 타입 확장

* 대부분의 상황에서 열거 타입을 확장한다는 건 좋지 않은 생각이다. 이유는 다음과 같다.
  - 확장한 타입의 원소는 기반 타입의 원소로 취급되지만 그 반대는 성립하지 않는다.
  - 기반 타입과 확장된 타입들의 원소 모두를 순회할 방법이 마땅치 않다.
  - 확장성을 높이려면 고려할 요소가 늘어나 설계와 구현이 더 복잡해진다.



## 2.1 열거 타입 확장하기

* 열거 타입을 확장하는 것이 좋은 상황이 하나는 있다. 바로 연산 코드(operation code 혹은 opcode)다. 
* 이따금 API가 제공하는 기본 연산 외에 사용자 확장 연산을 추가할 수 있도록 열어줘야 할 때가 있다.
* 다행히 열거 타입으로 확장 효과를 내는 방법이 있다
* 열거 타입을 확장하려면 열거 타입이 임의의 인터페이스를 구현할 수 있다는 사실을 이용하면 된다.
* 연산 코드용 인터페이스를 정의하고 열거 타입이 이 인터페이스를 구현하면 된다



**Operation.java**

* 확장이 가능한 인터페이스

```java
public interface Operation {
  double apply(double x, double y);
}
```



**BasicOperation.java**

* 열거 타입인 BasicOperation은 확장할 수 없지만 인터페이스인 Operation은 확장할 수 있고, 이 인터페이스를 연산의 타입으로 사용하면 된다.
* 각 상수별 클래스 몸체에서 추상 메서드를 구현한다

```java
public enum BasicOperation implements Operation {
  PLUS("+") {
    public double apply(double x, double y) { return x + y; }
  },
  MINUS("-") {
    public double apply(double x, double y) { return x - y; }
  },
  TIMES("*") {
    public double apply(double x, double y) { return x * y; }
  },
  DIVIDE("/") {
    public double apply(double x, double y) { return x / y; }
  };

  private final String symbol;

  BasicOperation(String symbol) {
    this.symbol = symbol;
  }

  @Override public String toString() {
    return symbol;
  }
}
```



**ExtendedOperation.java**

* 앞의 연산 타입을 확장해 지수 연산(EXP)와 나머지 연산(REMAINDER)을 추가해보자. 
* 이를 위해 우리가 할 일은 Operation 인터페이스를 구현한 열거 타입을 작성하는 것 뿐이다.
* 새로 작성한 연산은 기존 연산을 쓰던 곳이면 어디든 쓸 수 있다. Operation 인터페이스를 사용하도록 작성되어 있기만 하면 된다.

```java
public enum ExtendedOperation implements Operation {
  EXP("^") {
    public double apply(double x, double y) {
      return Math.pow(x, y);
    }
  },
  REMAINDER("%") {
    public double apply(double x, double y) {
      return x % y;
    }
  };
  private final String symbol;
  ExtendedOperation(String symbol) {
    this.symbol = symbol;
  }
  @Override public String toString() {
    return symbol;
  }
}
```



## 2.2 사용하기

* 새로 작성한 연산은 기존 연산을 쓰던 곳이면 어디든 쓸 수 있다
  * Operation 인터페이스를 사용하도록 작성되어 있기만 하면 된다



**클라이언트 코드**

* Operation 인터페이스를 사용하고 있다

```java
public static double operate(Operation operation, double x, double y) {
  return operation.apply(x, y);
}
```

```java
@Test
void test() {
  // given
  double x = 3;
  double y = 2;

  // when
  double result = operate(BasicOperation.PLUS, x, y);

  // then
  assertThat(result).isEqualTo(5);
}
```

```java
@Test
void test() {
  // given
  double x = 3;
  double y = 2;

  // when
  double result = operate(ExtendedOperation.REMAINDER, x, y);

  // then
  assertThat(result).isEqualTo(1);
}
```



## 2.3 한계

* 인터페이스를 이용해 확장 가능한 열거 타입을 흉내 내는 방식에도 한 가지 사소한 문제가 있다
* 바로 열거 타입 끼리 구현을 상속할 수 없다는 점이다
  * `public enum ExtendedOperation extends BasicOperation` 불가능



참고

* [이펙티브 자바 3/E](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788966262281)