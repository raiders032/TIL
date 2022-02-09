# 1 Behavior Parameterization

* 어떤 상황에서 일을 하든 소비자 요구사항은 항상 바뀐다. 이때 동작 파라미터화를 이용하면 자주 바뀌는 요구사항에 효과적으로 대응할 수 있다.
* 동작 파라미터화란 **아직은 어떻게 실행할 것인지 결정하지 않은 코드 블록**을 의미한다
* 이 코드 블록은 나중에 프로그램에서 호출 된다.
* 예를 들어 나중에 실행될 메서드의 인수로 코드 블록을 전달할 수 있다.



# 2 요구사항에 대응하기



## 2.1 녹색 사과 필터링

```java
public static List<Apple> filterGreenApples(List<Apple> inventory) {
  List<Apple> result = new ArrayList<>();
  for (Apple apple : inventory) {
    if (apple.getColor() == Color.GREEN) {
      result.add(apple);
    }
  }
  return result;
}
```



## 2.2 빨간 사과 필터링

* 2.1의 코드를 복사해 색 부분만 바꾸었다
* 그러나 클라이언트가 다른 색으로 필터링하도록 요구하면 대응이 점점 어려워진다.

```java
public static List<Apple> filterGreenApples(List<Apple> inventory) {
  List<Apple> result = new ArrayList<>();
  for (Apple apple : inventory) {
    if (apple.getColor() == Color.RED) {
      result.add(apple);
    }
  }
  return result;
}
```



## 2.3 색을 파라미터화

* 색을 파라미터화 할 수 있도록 메서드에 파라미터를 추가하면 변화하는 요구사항에 좀 더 유연하게 대응하는 코드를 만들 수 있다.

```java
public static List<Apple> filterApplesByColor(List<Apple> inventory, Color color) {
  List<Apple> result = new ArrayList<>();
  for (Apple apple : inventory) {
    if (apple.getColor() == color) {
      result.add(apple);
    }
  }
  return result;
}
```



## 2.4 무게로 필터링

* 갑자기 클라이언트가 사과를 무게로 필터링 해달라고 요구사항을 변경했다.
  * 요구: 보통 무게가 150 그램 이상인 사과가 무거운 사과입니다!
* 무게의 기준이 언제든 바뀔수 있기 때문에 무게를 파라미터화 했다
* 이러한 코드도 좋은 해결책이 될 수 있지만 사과에 필터링을 적용하는 코드가 색 필터링 코드와 대부분 중복된다.
* 이는 소프트웨어 공학에 DRY(don't repeat yourself)원칙을 위반한다.
* 또한 색으로 필터링을 할지 무게로 필터링을 할지 구분하는 코드 또한 추가되어야 한다

```java
public static List<Apple> filterApplesByWeight(List<Apple> inventory, int weight) {
  List<Apple> result = new ArrayList<>();
  for (Apple apple : inventory) {
    if (apple.getWeight() > weight) {
      result.add(apple);
    }
  }
  return result;
}
```



## 2.5 동작 파라미터화

* 다음엔 클라이언트가 색과 무게 말고 또 다른 조건으로 필터링 해달라고 요구사항을 변경할 때 마다 코드 수정이 불가피하다.
* 이러한 경우 동작 파라미터화를 사용하면 변하는 요구사항에 유연하게 대응할 수 있다.

**ApplePredicate**

* 참 또는 거짓을 반환하는 함수를 프레디케이트라고 한다.
* ApplePredicate는 사과의 어떤 속성에 기초해서 참 또는 거짓을 반환한다.

```java
interface ApplePredicate {
  boolean test(Apple a);
}
```

**filter 메소드**

* filter는 ApplePredicate 타입의 파라미터를 가지고 있으며 ApplePredicate 구현 객체에 의해 filter 메소드의 동작이 결정된다.
* filter 메소드의 동작을 파라미터화한 것이다.
* 즉 어떤 ApplePredicate를 넣는지에 따라 filter 메소드의 동작이 변한다.

```java
public static List<Apple> filter(List<Apple> inventory, ApplePredicate p) {
  List<Apple> result = new ArrayList<>();
  for (Apple apple : inventory) {
    if (p.test(apple)) {
      result.add(apple);
    }
  }
  return result;
}
```

**예시**

```java
List<Apple> inventory = Arrays.asList(
  new Apple(80, Color.GREEN),
  new Apple(155, Color.GREEN),
  new Apple(120, Color.RED)
);
```

**익명 클래스 사용**

* 익명 클래스를 사용해서 ApplePredicate를 구현한 클래스의 선언과 동시에 인스턴스화
* 녹색 사과를 필터링하는 ApplePredicate 구현

```java
List<Apple> greenApples = filter(inventory, new ApplePredicate() {
  @Override
  public boolean test(Apple a) {
    return a.getColor() == Color.GREEN;
  }
});
System.out.println(greenApples);
// [Apple{color=GREEN, weight=80}, Apple{color=GREEN, weight=155}]
```

**람다 사용**

* 익명 클래스를 사용하니 코드가 장황해짐 위에 코드를 아래와 같이 람다를 이용해 간결하게 나타낼 수 있다.
* 이것을 Template Callback 패턴이라고 한다.
  * 여기서 filter가 Context이고 ApplePredicate이 Callback이다.
  * [Strategy.md](../../../Design-Pattern/Strategy/Strategy.md), [Template-Callback.md](../../../Design-Pattern/Template-Callback/Template-Callback.md) 참고


```java
List<Apple> greenApples = filter(inventory, (Apple a) -> a.getColor() == Color.GREEN);
System.out.println(greenApples);
// [Apple{color=GREEN, weight=80}, Apple{color=GREEN, weight=155}]
```



## 2.6 바나나, 오렌지...

* 이번엔 클라이언트가 바나나 또는 오렌지를 필터링해 달라고 요구했다!

```java
interface Predicate<T> {
  boolean test(T t);
}
```

```java
public static <T> List<T> filter(List<T> list, Predicate<T> p) {
  List<T> result = new ArrayList<>();
  for (T e : list) {
    if (p.test(e)) {
      result.add(e);
    }
  }
  return result;
}
```



참고

* 모던 자바 인 액션