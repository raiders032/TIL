# 인스턴스화를 막으려거든 private 생성자를 사용하라



# 1. 개요

* 정적 멤버만 담은 유틸리티 클래스는 인스턴스로 만들어 사용하려고 설계한 것이 아니다.
* 유틸리티 클래스의 인스턴스화를 막으려면 어떻게 해야할까?



## 1.1 **유틸리티 클래스**

* 정적 메서드와 정적 필드만을 담은 클래스

**java.lang.Math**

```java
public final class Math {

    /**
     * Don't let anyone instantiate this class.
     */
    private Math() {}

    public static final double E = 2.7182818284590452354;
    public static final double PI = 3.14159265358979323846;
    
    // ...

    public static int max(int a, int b) {
        return (a >= b) ? a : b;
    }
}
```

**java.util.Arrays**

```java
public class Arrays {

    private static final int MIN_ARRAY_SORT_GRAN = 1 << 13;

    // Suppresses default constructor, ensuring non-instantiability.
    private Arrays() {}
    
    // ...
    @SafeVarargs
    @SuppressWarnings("varargs")
    public static <T> List<T> asList(T... a) {
        return new ArrayList<>(a);
    }
```

## 

# 2 문제점

* 유틸리티 클래스는 인스턴스로 만들어 쓰려고 설계한 것이 아니다
* 하지만 생성자를 명시하지 않으면 컴파일러가 자동으로 기본 생성자를 만들어준다.
  * 매개변수를 받지 않는 public 생성자가 만들어진다
* 사용자는 해당 생성자를 사용해서 유틸리티 클래스를 인스턴스화 할 수 있다.



# 3 해결책



## 3.1 추상 클래스 사용하기

* 추상 클래스를 사용하면 인스턴스화를 막을 수 있을까?
  * 정답은 아니다
* 하위 클래스를 만들어 인스턴스화가 가능하기 때문
* 사용자는 추상 클래스를 보고 상속해서 쓰라는 뜻으로 받아들임으로 더 큰 문제가 된다



**예시**

* 하위 클래스를 만들어 인스턴스화가 가능

```java
public class AbstractPrivateConstructorTest {
    
}

public class PrivateConstructorTest extends AbstractPrivateConstructorTest {
    public PrivateConstructorTest() { }
}

@Test
void 추상클래스_Private_생성자_테스트() {
    PrivateConstructorTest privateConstructorTest = new PrivateConstructorTest();
    assertThat(privateConstructorTest).isInstanceOf(AbstractPrivateConstructorTest.class);
}
```



## 3.2 private 생성자 만들기

* 인스턴스화를 막는 방법은 아주 간단한데 바로 private 생성자를 만드는 것이다
* 컴파일러는 명시된 생성자가 없는 경우에만 기본 생성자를 만든다
  * 따라서 private 생성자를 만들면 컴파일러가 기본 생성자를 만들지 않는다
* 생성자가 존재하는데 호출할 수 없는것은 직관적이지 않으므로 주석을 달거나 Exception을 던져서 알기 쉽도록 하자
* 이 방식은 상속도 불가능하게 하는 효과도 있다
  * private으로 선언했으니 하위 클래스가 상위 클래스의 생성자에 접근할 수 없기 때문



참고

* [이펙티브 자바 3/E](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788966262281)