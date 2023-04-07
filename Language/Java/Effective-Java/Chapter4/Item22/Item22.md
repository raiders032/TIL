# 1 인터페이스는 타입을 정의하는 용도로만 사용하라



# 2 개요

* 인터페이스는 자신을 구현한 클래스의 인스턴스를 참조할 수 있는 타입 역할을 한다
* 클래스가 어떤 인터페이스를 구현하다는 것은 자신의 인스턴스로 무엇을 할 수 있을지 클라이언트에게 알려주는 것이다
* 인터페이스는 오직 이 용도로 사용해야한다.



# 3 안티패턴



## 3.1 상수 인터페이스

* 인터페이스를 지침에 맞지 않게 사용한 예시로 상수 인터페이스가 있다
* 상수 인터페이스는 메서드 없이 상수를 뜻하는 static final 필드로만 가득 찬 인터페이스를 말한다
* 클래스 내부에서 사용하는 상수는 외부 인터페이스가 아니라 내부 구현에 해당된다.
  *  내부구현임에도 불구하고 클라이언트가 이 상수들에 종속되게 됨
  * 이 상수들이 더는 쓰이지 않더라도 바이너리 호환성을 위해 이 상수 인터페이스를 구현하고 있어야 한다



**PhysicalConstants.java**

```java
public interface PhysicalConstants { 
  static final double AVOGADROS_NUMBER = 6.022_140_857e23;
  static final double BOLTZMANN_CONSTANT = 1.380_648_52e-23;
  static final double ELECTRON_MASS = 9.109_383_56e-31; 
}
```



# 4 상수 공개

* 싱수를 공개할 목적이라면 위와 같이 인터페이스를 이용하지 말고 다음과 같은 방법을 사용하자.



## 4.1 특정 클래스와 인터페이스

* 특정 클래스와 인터페이스와 강하게 연관된 상수라면 그 클래스나 인터페이스 자체에 추가한다.
* 대표적인 예시로 모든 숫자 기본 타입의 박싱 클래스 Integer와 Double에 선언된 MAX_VALUE와 MIN_VALUE이다



**Integer.java**

```java
package java.lang;

public final class Integer extends Number implements Comparable<Integer> {
  @Native public static final int   MIN_VALUE = 0x80000000;
  @Native public static final int   MAX_VALUE = 0x7fffffff;
}
```



## 4.2 열거타입

* 열거 타입으로 나타내기 적합한 상수라면 열거 타입으로 만들어 공개하면 된다

**PhysicalConstants.java**

```java
public enum PhysicalConstants {
  AVOCADOS_NUMBER(6.022_140_857e23),
  BOLTZMANN_CONSTANT(1.380_648_52e-23),
  ELECTRON_MASS(9.109_383_56e-31);

  private final double value;

  PhysicalConstants(double value) {
    this.value = value;
  }

  public double getValue() {
    return value;
  }
}
```



## 4.3 유틸리티 클래스

* 특정 클래스나 열거타입에 해당하지 않는다면 인스턴스화할수 없는 유틸리티 클래스에 담아 공개하자

**PhysicalConstants.java**

```java
public class PhysicalConstants {
  private PhysicalConstants() {
    //생성자를 private 으로 하여 인스턴스화 금지
  }

  // 아보가드로 수 (1/몰)
  public static double AVOCADOS_NUMBER = 6.022_140_857e23;

  // 볼츠만 상수 (J/K)
  public static double BOLTZMANN_CONSTANT = 1.380_648_52e-23;

  // 전자 질량(kg)
  public static double ELECTRON_MASS = 9.109_383_56e-31;
}
```



# 5 정리

* 인터페이스는 타입을 정의하는 용도로만 사용해야 한다. 상수 공개용 수단으로 사용하지 말자.



참고

* [이펙티브 자바 3/E](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788966262281)