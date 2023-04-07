# 상속을 고려해 설계하고 문서화하라. 그러지 않았다면 상속을 금지하라



#  1 상속용 클래스 주의점

* **상속용 클래스는 재정의할 수 있는 메서드들을 내부적으로 어떻게 이용하는지 문서로 남겨야한다**
  * 상속용 클래스의 공개 API에서 클래스 자신의 또 다른 메서드를 호출할 수 있다
  * 이런 경우 호출되는 클래스 자신의 또 다른 메서드를 공개 API에 정확히 명시해야한다
  * 또한 어떤 순서로 호출되는지
  * 각각의 호출 결과가 이어지는 처리에 어떤 영향을 주는지 모든 상황을 문서로 남겨야한다
* **클래스의 내부 동작 과정 중간에 끼어들 수 있는 훅을 잘 선별하여 protected 메서드 형태로 공개해야할 수도 있다.**
* **상속용 클래스의 생성자는 직접적으로든 간접적으로든 재정의 가능 메서드를 호출해서는 안된다.**



# 2 상속용 클래스 문서화

* API 문서의 메서드 설명 끝에 종종 Implementation Requirements로 시작하는 문단을 볼 수 있는데 이 곳이 메서드의 내부 동작 방식을 설명하는 곳
* 이 문단은 메서드 주석에 @implSpec 태크를 붙이면 자바독 도구가 생성해준다

> **AbstractCollection의 remove 메서드**
>
> public boolean remove(Object o) 주어진 원소가 이 컬렉션 안에 있다면 그 인스턴스를 하나 제거한다. 더 정확하게 말하면 이 컬렉션 안에 'Object.equals(e, e)가 참인 원소' e가 하나 이상 있다면 그 중 하나를 제거한다. 주어진 원소가 컬렉션 안에 있다면 true를 반환한다.
>
> **Implementation Requirements**
>
> 이 메서드는 컬렉션을 순회하며 주어진 원소를 찾도록 구현되었다. 주어진 원소를 찾으면 반복자의 remove 메서드를 사용해 컬렉션에서 제거한다. 이 컬렉션이 주어진 객체를 갖고 있으나, 이 컬렉션의 iterator 메서드가 반환한 반복자가 remove 메서드를 구현하지 않았으면 UnsupportedOperationException을 던지니 주의하자.
>
> [링크](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/AbstractCollection.html#remove(java.lang.Object))

* 위 remove의 Implementation Requirements 설명에 따르면 iterator 메서드를 재정의하면 remove 메서드에 영향을 줌을 확실히 알 수 있다



## 2.1 이것이 좋은 API 문서일까?

* 앞서 AbstractCollection의 remove 메서드는 내부 동작 방식은 문서화를 통해 잘 설명했다
* 하지만 `좋은 API는 '어떻게'가 아닌 '무엇'을 하는지 설명해야한다` 라는 격언과는 대치된다.
* 상속이 캡슐화를 해치기 때문에 일어나는 현상이다
* 안전한 상속을 위해 기술하지 않았어야할 내부 구현 방식(어떻게)을 설명했다



# 3 메서드 공개

* 효율적인 하위 클래스를 어려움 없이 만들 수 있게 하려면 문서화 말고도 필요한 것이 더 있다
* **클래스의 내부 동작 과정 중간에 끼어들 수 있는 훅을 잘 선별하여 protected 메서드 형태로 공개해야할 수도 있다.**



## 3.1 메서드 공개 예시

> **java.util.AbsractList의 removeRange 메서드**
>
> protected void removeRange(int fromIndex, int toIndex) fromIndex(포함)부터 toIndex(미포함)까지의 모든 원소를 이 리스트에서 제거한다. toIndex 이후의 원소들은 앞으로 (index만큼씩) 당겨진다. 이 호출로 리스트는 'toIndex - fromIndex'만큼 짧아진다. (toIndex == fromIndex라면 아무 효과도 없다.) 이 리스트 혹은 이 리스트의 부분리스트에 정의된 clear 연산이 이 메서드를 호출한다. 리스트 구현의 내부 구조를 활용하도록 이 메서드를 재정의하면 이 리스트와 부분리스트의 clear 연산 성능을 크게 개선할 수 있다. 
>
> **Implementation Requirements**
>
> 이 메서드는 fromIndex에서 시작하는 리스트 반복자를 얻어 모든 원소를 제거할 때까지 ListIterator.next와 ListIterator.remove를 반복 호출하도록 구현되었다. **주의: ListIterator.remove가 선형 시간이 걸리면 이 구현의 성능은 제곱에 비례한다.**
>
> Parameters: fromIndex 제거할 첫 원소의 인덱스 toIndex 제거할 마지막 원소의 다음 인덱스
>
> [링크](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/AbstractList.html#removeRange(int,int))

* 리스트 구현체의 최종 사용자는 AbsractList의 removeRange 메서드에는 관심이 없다
* 그럼에도 removeRange 메서드를 공개한 이유는 단지 하위 클래스에서 부분리스트의 clear 메서드의 성능을 높이기 위해서다
* removeRange를 공개하지 않았다면 하위 클래스의 clear를 호출하면 제거할 원소 수의 제곱에 비례한 성능 보일 것이다.
* 따라서 성능을 높이고 싶다면 removeRange를 다른 방식으로 오버라이딩하면 된다



## 3.2 공개 메서드 선택

* 상속용 클래스를 설계할 때 어떤 메서드를 protected로 노출해야 할까?
* 정답은 없다. 심사숙고해서 예측한 다음 실제 하위 클래스를 만들어 시험해보는 것이 유일하다
* 널리 쓰일 클래스를 상속용으로 설계한다면 문서화한 내부 사용 패턴과, protected 메서드와 필드를 구현하면서 선택한 결정에 영원히 책임져야 함을 인식하자



# 4 상속용 클래스의 생성자

* **상속용 클래스의 생성자는 직접적으로든 간접적으로든 재정의 가능 메서드를 호출해서는 안된다.**
* 이 규칙을 어기면 프로그램이 오작동한다.
  * 상위 클래스의 생성자가 하위 클래스의 생성자보다 먼저 호출된다
  * 그러므로 하위 클래스에서 재정의한 메서드가 하위 클래스의 생성자보다 먼저 호출된다.
  * 이때 재정의한 메서드가 하위 클래스의 생성자에서 초기화하는 값에 의존한다면 오작동한다



## 4.1 오작동 예시

**Super.java**

* 상속용 클래스의 생성자에서 재정의 가능 메서드를 호출함

```java
public class Super {
  public Super() {
    overrideMe();
  }

  public void overriedMe() {

  }
}
```



**Sub.java**

* 상위 클래스의 생성자가 제일 먼저 호출됨
* 오버라이딩된 overrideMe 메소드가 호출 됨
* 오버라이딩된 overrideMe는 instant 필드를 의존함
* 하지만 instant 필드는 아직 초기화되지 않음 따라서 NullPointerException 발생

```java
public final class Sub extends Super {
  private final Instant instant;

  Sub() {
    instant = Instant.now();
  }

  @Override public void overrideMe() {
    System.out.println(instant);
  }

  public static void main(String[] args) {
    Sub sub = new Sub();
    sub.overrideMe();
  }
}
```



# 5 정리

* 앞에 예시를 통해 클래스를 상속용으로 설계하려면 엄청난 노력이 들고 그 클래스에 안기는 제약도 상당함을 알았다
* 따라서 상속을 고려하지 않고 설계된 일반 클래스는 상속을 금지해야한다.
* 상속을 금지하는 법
  * 클래스를 final로 선언한다.
  * 모든 생성자를 private이나 package-private으로 선언하고 public 정적 팩터리를 만들어준다.



**상속을 허용해야 한다면?**

* 재정의 가능 메서드를 호출하는 자기 사용 코드를 완벽하게 제거하자.
* 클래스의 동작을 유지하면서 재정의 가능 메서드를 사용하는 코드를 제거하는 방법
  * 각각의 재정의 가능 메서드는 자신의 본문 코드를 private '도우미 메서드'로 옮기고, 이 도우미 메서드를 호출하도록 수정한다.
  * 재정의 가능 메서드를 호출하는 다른 코드들도 모두 이 도우미 메서드를 직접 호출하도록 수정한다.



참고

* [이펙티브 자바 3/E](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788966262281)