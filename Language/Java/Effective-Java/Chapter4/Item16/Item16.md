# public 클래스에서는 public 필드가 아닌 접근자 메서드를 사용하라



# 1 개요

* Public 클래스는 절대 가변 필드를 직접 노출하면 안 된다
* 불변 필드는 덜 위험하지만 노출하면 안 된다
* pacakage-private 이나 private 중첩 클래스에서는 필드(불변, 가변)를 노출하는 편이 좋을 때도 있다



**퇴보한 Point.java**

* 인스턴스 필드를 모아놓은 일 외 아무 목적도 없는 퇴보한 클래스

```java
class Point {
  public double x;
  public double y;
}
```



**단점**

* 위 클래스 데이터 필드에 직접 접근할 수 있으니 캡슐화 이점을 활용하지 못함
* 캡슐화가 깨져 API를 수정하지 않고 내부 표현을 바꿀 수 없다
* 불변식을 보장할 수 없다



# 2 접근자와 변경자 메서드를 활용한 데이터 캡슐화

**객체지향 프로그래머의 Point.java**

```java
class Point {
  private double x;
  private double y;

  public double getX() {
    return x;
  }

  public double getY() {
    return y;
  }

  public void setX(double x) {
    this.x = x;
  }

  public void setY(double y) {
    this.y = y;
  }
}
```



## 2.1 public 클래스

```java
public class Point {
  private double x;
  private double y;

  public double getX() {
    return x;
  }

  public double getY() {
    return y;
  }

  public void setX(double x) {
    this.x = x;
  }

  public void setY(double y) {
    this.y = y;
  }
}
```

* public 클래스라면 위 방식이 적합하다
  * 필드의 접근 제한자를 private으로 설정하고 접근자(getter)와 변경자(setter) 추가한는 방식
* public 클래스는 패키지 바깥에서 접근할 수 있어 접근자를 제공함으로써 클래스 내부 표현 방식은 언제든지 바꿀 수 있는 유연성이 있다
* public 클래스에서 필드를 공개하면 이를 사용하는 클라이언트가 생기고 내부를 마음대로 수정할 수 없게 된다



## 2.2 package-private 클래스

**package-private Poing 클래스**

```java
class Point {
  public double x;
  public double y;
}
```

* package-private 클래스 혹은 private 중첩 클래스라면 데이터 필드를 노출한다 해도 하등의 문제가 없다.
* 클래스가 표현하려는 추상 개념만 올바르게 표현해주면 된다.
* 클라이언트 측면에서 접근자 방식보다 깔끔하다
* 그러나 클라이언트 코드가 대상 코드에 묶이게 된다
* 하지만 클라이언트가 대상 클래스를 포함한 패키지 안에서만 동작하는 코드여서 패키지 바깥 코드는 수정하지 않고 클라이언트 코드를 수정할 수 있다



## 2.3 private 중첩 클래스

*  private 중첩 클래스의 경우라면 수정 범위가 더 좁아져서 이 클래스를 포함하는 외부 클래스 까지로 제한된다



# 3 불변 필드 노출

* pulic 클래스의 필드가 불변이라면 직접 노출할 때의 단점이 조금 줄어들지만 결코 좋은 생각이 아니다
* 불변식은 보장하지만 캡슐화가 깨져 API를 수정하지 않고 내부 표현을 바꿀 수 없다



**Time.java**

* 아래와 같이 필드가 불변이라도 노출하지 말자

```java
public final class Time {
    private static final int HOURS_PER_DAY = 24;
    private static final int MINUTES_PER_HOUR = 60;

    public final int hour;
    public final int minute;

    public Time(int hour, int minute) {
        if(hour < 0 || hour >= HOURS_PER_DAY)
            throw new IllegalArgumentException("시간: " + hour);
        if(hour < 0 || minute >= MINUTES_PER_HOUR)
            throw new IllegalArgumentException("분: " + minute);
        this.hour = hour;
        this.minute = minute;
    }
}
```



참고

* [이펙티브 자바 3/E](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788966262281)