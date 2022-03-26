# 비검사 경고를 제거하라

* 제네릭을 사용하기 시작하면 수많은 컴파일러 경고를 보게 될 것이다
* 비검사 형변환 경고, 비검사 메소드 호출 경고, 비검사 매개변수화 가변인수 타입 경고, 비검사 변환 경고 등이다
* 할 수 있는 한 모든 비검사 경고를 제거하라
* 모두 제거한다면 코드의 타입 안정성이 보장되어 런타임에 ClassCastException이 발생할 일이 없다



# 1 개요

```java
Set<String> words = new HashSet();
```

* 위 코드를 `-Xlint:unchecked` 옵션과 함께 javac로 컴파일해보면
  * 기본적으로 Java 컴파일러는 비검사 경고를 활성화하지 않으며 이를 사용하기 위해서는 컴파일러에 -Xlint:uncheck 옵션을 주어야한다.

```java
Item27.java:15: warning: [unchecked] unchecked conversion
        Set<String> words = new HashSet();
                            ^
  required: Set<String>
  found:    HashSet
```

* 위와 같은 경고가 나온다

```java
Set<String> words = new HashSet<>();
```

* `HashSet`을 Raw 타입으로 사용했기 때문에 나타난 비검사 경고이다. 
* 이를 해결하기 위해서는 HashSet에도 `HashSet<String>`과 같이 타입 매개변수를 명시하던가 자바 7부터 지원하는 제네릭 타입 추론을 활용하여 다이아몬드 연산자 `<>`를 사용할 수 있다.



# 2 @SuppressWarninigs

* 경고를 제거할 수 없지만 타입 안전하다고 확신한다면 @SuppressWarninigs("unchecked") 애노테이션을 달아 경고를 숨겨라

**SuppressWarninigs.java**

```java
package java.lang;

import java.lang.annotation.*;
import static java.lang.annotation.ElementType.*;

@Target({TYPE, FIELD, METHOD, PARAMETER, CONSTRUCTOR, LOCAL_VARIABLE, MODULE})
@Retention(RetentionPolicy.SOURCE)
public @interface SuppressWarnings {
  String[] value();
}
```





## 2.1 범위

* @SuppressWarninigs 애노테이션은 개별 지역변수 선언부터 클래스 전체까지 선언할 수 있다
* **@SuppressWarninigs은 항상 가능한 좁은 범위에 적용하자**
* 보통은 변수 선언, 아주 짧은 메소드, 혹은 생성자가 될 것
* 절대로 클래스 전체에 적용하지 마라
* 한 줄이 넘는 메소드나 생성자에 달린 @SuppressWarninigs은 지역변수 선언 쪽으로 옮기자



**예시**

```java
public <T> T[] toArray(T[] a) {
  if (a.length < size) {
    return (T[]) Arrays.copyOf(elementData, size, a.getClass());
  }
  System.arraycopy(elementData, 0, a, 0, size);
  if (a.length > size)
    a[size] = null;
  return a;
}
```

* 위 코드를 컴파일하면 아래와 같은 비검사 형변환 경고가 발생한다
* 경고를 없애기 위해 @SuppressWarnings("unchecked")를 사용 범위를 최대한 작게 지역 변수 선언으로

```java
public <T> T[] toArray(T[] a) {
  if (a.length < size) {
    // 생성한 배열과 매개변수로 받은 배열의 타입이 모두 T[]로 같으므로 올바른 형변환이다.
    @SuppressWarnings("unchecked")
    T[] result = (T[]) Arrays.copyOf(elementData, size, a.getClass());
    return result;
  }

  System.arraycopy(elementData, 0, a, 0, size);
  if (a.length > size)
    a[size] = null;
  return a;
}
```

* 컴파일도 되고 비검사 경고를 숨기는 범외도 최소로 좁혔다



## 2.2 주의사항

* @SuppressWarnings 애노테이션을 사용할 떄는 그 경고를 무시해도 안전한 이유를 항상 주석으로 남겨야한다



# 3 정리

* 모든 비검사 경고는 런타임에 ClassCastException을 일으킬 수 있는 잠재적 가능성을 뜻하니 가능한 모두 제거해야한다. 
* 경고를 없앨 방법을 찾지 못하겠다면, 그 코드가 타입 안전함을 증명하고 가능한 범위를 좁혀 `@SupressWarnings("unchecked")` 에너테이션으로 경고를 숨겨라. 
* 그런 다음 경고를 숨기기로 한 근거를 주석으로 남겨라.



참고

* [이펙티브 자바 3/E](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788966262281)