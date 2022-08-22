# 익명 클래스보다는 람다를 사용하라



# 1 개요

* 예전 자바에서는 함수 타입을 표현할 때 추상 메서드를 하나만 담은 인터페이스를 사용했다
* 이 인터페이스의 인스턴스를 함수 객체라고 하여, 특정 함수나 동작을 나타내는 데 썻다
* 이 **함수 객체를 만드는 주요 수단이 바로 익명 클래스**이다



**익명 클래스로 Comparator 함수 객체 만들기**

* 전략 패턴처럼 함수 객체를 사용하는 과거 객체 지향 디자인 패턴에는 익명 클래스면 충분했다
* 아래의 코드에서 Comparator 인터페이스가 정렬을 담당하는 추상 전략을 뜻하며, 문자열을 정렬하는 구체적인 전략을 익명 클래스로 구현했다
* 하지만 익명 클래스 방식은 코드가 너무 길어 자바에서는 함수형 프로그래밍에 적합하지 않았다
* 전략 패턴과 템플릿 콜백 패턴은 [Strategy.md](../../../../../Design-Pattern/Strategy/Strategy.md), [Template-Callback.md](../../../../../Design-Pattern/Template-Callback/Template-Callback.md) 참고하기

```java
@Test
void test() {
  List<String> words = Arrays.asList("banana", "apple");
  
  Collections.sort(words, new Comparator<String>() {
    @Override
    public int compare(String o1, String o2) {
      return Integer.compare(o1.length(), o2.length());
    }
  });
}
```



# 2 함수형 인터페이스

* 자바 8에서 **추상 메서드 하나짜리 인터페이스**는 특별한 의미를 인정받아 특별 대우를 받게 되어 **함수형 인터페이스**라고 부르게 되었다
* **함수형 인터페이스의 인스턴스는 람다식을 사용해 만들 수 있다**
* 람다(식)는 익명 클래스와 개념은 비슷하지만 코드는 훨씬 간결하다



**익명 클래스를 사용한 앞의 코드를 람다식로 바꾼 모습**

* 자질구레한 코드들이 사라지고 어떤 동작을 하는지 명확하게 드러난다

```java
@Test
void test() {
  List<String> words = Arrays.asList("banana", "apple");
  Collections.sort(words, (o1, o2) -> Integer.compare(o1.length(), o2.length()));
  System.out.println("words = " + words);
}
```

**더 간결한 버전**

* Comparator 생성 메서드를 사용하면 코드를 더 간결하게 만들 수 있다

```java
@Test
void test() {
  List<String> words = Arrays.asList("banana", "apple");
  Collections.sort(words, Comparator.comparingInt(String::length));
  System.out.println("words = " + words);
}
```



**컴파일러의 타입 추론**

* 특이한 점은 코드에 타입을 명시하지 않았다
* 우리 대신 컴파일러가 문맥을 살펴 타입을 추론해주기 때문이다
* 상황에 따라 컴파일러가 타입을 추론하지 못하면 직접 명시해야한다
* 타입 추론 규칙은 매우 복잡하기 때문에 이 규칙을 다 이해하는 프로그래머는 거의 없다
* **따라서 타입을 명시해야 코드가 더 명확할 때만 제외하고는, 람다의 모든 매개변수 타입은 생략하자**
* 그런 다음 컴파일러가 "타입을 알 수 없다"는 오류를 낼 때만 해당 타입을 명시하면 된다
* [Lambda.md](../../../Lambda/Lambda.md)의 형식 검사, 형식 추론 참고



# 3 Enum과 람다 같이 쓰기

* [Item34](../../Chapter6/Item34/Item34.md) 에서 