# 태그 달린 클래스보다는 클래스 계층구조를 활용하라



# 1 태그 달린 클래스

* 두 가지 이상의 의미를 표현할 수 있으며, 그중 현재 표현하는 의미를 태그 값으로 알려주는 클래스



**Figure.java**

* 원과 사각형을 표현하는 태그 달린 클래스

```java
// 코드 23-1 태그 달린 클래스 - 클래스 계층구조보다 훨씬 나쁘다! (142-143쪽)
class Figure {
  enum Shape { RECTANGLE, CIRCLE };

  // 태그 필드 - 현재 모양을 나타낸다.
  final Shape shape;

  // 다음 필드들은 모양이 사각형(RECTANGLE)일 때만 쓰인다.
  double length;
  double width;

  // 다음 필드는 모양이 원(CIRCLE)일 때만 쓰인다.
  double radius;

  // 원용 생성자
  Figure(double radius) {
    shape = Shape.CIRCLE;
    this.radius = radius;
  }

  // 사각형용 생성자
  Figure(double length, double width) {
    shape = Shape.RECTANGLE;
    this.length = length;
    this.width = width;
  }

  double area() {
    switch(shape) {
      case RECTANGLE:
        return length * width;
      case CIRCLE:
        return Math.PI * (radius * radius);
      default:
        throw new AssertionError(shape);
    }
  }
}
```



# 2 태그 달린 클래스의 단점

* 열거 타입 선언, 태그 필드, switch 문 등 쓸데없는 코드가 많다
* 여러 구현이 한 클래스에 혼합돼 있어서 가독성도 나쁘다
* 다른 의미를 위한 코드도 언제나 함께 하니 메모리도 많이 사용함
* final 필들가 있다면 쓰이지 않는 필드까지 생성자에서 초기화해야함
* 생성자가 태그 필드를 설정하고 해당 의미에 쓰이는 필드들을 초기화하는데 컴파일러가 도움을 줄 수 없다
  * 예를 들어 사각형용 생성자에서 사각형용으로 쓰이는 필드를 초기화하지 않고 엉뚱한 필드를 초기화해도 런타임에 문제가 들어남
* 새로운 의미(예를 들어 오각형)를 추가하려면 모든 switch 문을 찾아 새로운 의미를 처리하는 코드를 추가해야한다
* 인스턴스의 타입만으로는 현재를 나타내는 의미를 알 수 없다
  * Figure라는 타입 만으로 원을 나타내는지 사각형을 나타내는지 알 수 없다



# 3 클래스 계층 구조

* 태그 달린 클래스는 장황하고 오류를 내기 쉽고 비효율적이다
* 태그 달린 클래스는 클래스 계층 구조를 어설프게 흉내낸 아류일 뿐 태그 달린 클래스는 클래스 계층 구조로 바꾸어야한다



## 3.1 태그 달린 클래스 클래스 계층 구조로 변환하는 방법

**루트 클래스**

* 가장 먼저 계층구조의 루트가 될 추상 클래스를 정의한다
* 태그 값에 따라 **동작이 달라지는 메서드를 추상 메서드**로 선언한다
* 태그 값에 상관없이 **동작이 일정한 메서드들은 일반 메서드**로 선언한다
* 하위 클래스에서 공통으로 사용하는 데이터 필드를 전부 루트 클래스로 올린다

**하위 클래스**

* 각 하위 클래스는 각자의 의미에 해당하는 데이터 필드들을 넣는다
* 태그 값에 따라 동작이 달라지는 메서드를 추상 메서드로 선언한다



## 3.2 클래스 계층 구조 예시

**Figure.java**

```java
// 가장 먼저 계층구조의 루트가 될 추상 클래스를 정의한다
abstract class Figure {
  // 태그 값에 따라 동작이 달라지는 메서드를 추상 메서드로 선언한다
  abstract double area();
}
```

**Circle.java**

```java
class Circle extends Figure {
  // 각 하위 클래스는 각자의 의미에 해당하는 데이터 필드들을 넣는다
  final double radius;

  Circle(double radius) { this.radius = radius; }

  // 루트 클래스가 정의한 추상 메서드를 각자 의미에 맞게 구현한다.
  @Override double area() { return Math.PI * (radius * radius); }
}
```

**Rectangle.java**

```java
class Rectangle extends Figure {
  // 각 하위 클래스는 각자의 의미에 해당하는 데이터 필드들을 넣는다
  final double length;
  final double width;

  Rectangle(double length, double width) {
    this.length = length;
    this.width  = width;
  }
  // 루트 클래스가 정의한 추상 메서드를 각자 의미에 맞게 구현한다.
  @Override double area() { return length * width; }
}
```



## 3.3 변환 결과

* 각 의미를 독립된 클래스에 담아 관련 없는 데이터 필드를 모두 제거했다
* 살아 남은 필드는 모두 final이다
* 각 클래스의 생성자가 모든 필드를 남김없이 초기화하고 추상 메서드를 구현했는지 컴파일러가 알려준다
  * 실수로 빼먹은 case문 때문에 런타임 오류가 발생할 일이 없다
* 루트 클래스의 코드를 건드리지 않고 계층구조를 확장하고 함께 사용할 수 있다
* 타입 사이의 자연스러운 계층 관계를 반영할 수 있어서 유연성은 물론 컴파일 타입 검사 능력을 높여준다



참고

* [이펙티브 자바 3/E](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788966262281)