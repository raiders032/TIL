# Item 생성자 대신 정적 팩토리 메소드를 고려하라



# 1 개요

* 클라이언트가 클래스의 인스턴스를 얻는 수단은 다음과 같이 두 가지로 나눌 수 있다.
* 일반적인 public생성자에 비해 정적 팩터리 메서드는 다양한 장점을 가지고 있다.



**public 생성자**

```
public Book(){}
```



**정적 팩터리 메서드**

```
public static Book createBook(){
    return instance();
}
```



# 2 정적 팩터리 메서드의 장점



## 2.1 이름을 가질 수 있다

- 정적 팩터리 메소드는 '메소드'이기 때문에 이름을 가질 수 있다.
- 그 이름을 통해 해당 정적 메서드가 어떤 특징을 갖는지, `어떤 인스턴스를 반환하는지 명시적으로 표현`할 수 있다.
- 한 클래스에 시그니처가 같은 생성자가 여러 개 필요한 경우 생성자를 정적 팩토리 메소드로 바꾸고 각각의 차이를 잘 드러내는 이름을 지어주자



**생성자의 단점**

- 하나의 시그니처로는 생성자를 하나만 만들 수 있다.
- 입력 매개변수들의 순서를 다르게해 시그니처를 변경하여 이 제한을 피할 수 있지만 좋은 발상이 아니다
- 코드를 읽는 사람도 클래스 설명 문서를 찾아보지 않고는 의미를 모르기 때문



## 2.2 인스턴스 캐싱과 통제

* 생성자는 항상 새로운 인스턴스를 만들기 때문에 인스턴스를 통제할 수 없다.
* 정적 팩터리 메서드를 통해 **인스턴스 캐싱**과 **인스턴스 통제**를 활용할 수 있다.



**인스턴스 캐싱**

* 인스턴스를 미리 생성해 놓고, 필요할 때마다 이를 가져다 쓰는 방식을 뜻한다.
* 불필요한 객체 생성을 피하고, 객체 생성의 비용을 줄여 준다.
* 아래 Boolean 클래스는 인스턴스를 미리 생성해 두고 정적 팩토리 메소드를 통해 이를 가져다 쓰는 방식

```java
public final class Boolean implements java.io.Serializable, Comparable<Boolean> {
  public static final Boolean TRUE = new Boolean(true);
  public static final Boolean FALSE = new Boolean(false);

  public static Boolean valueOf(boolean b) {
    return (b ? TRUE : FALSE);
  }
  ...
}
```



**인스턴스 통제**

* 반복되는 요청에 같은 객체를 반환하는 식으로 정적 팩토리 방식의 클래스는 언제 어느 인스턴스를 살아 있게 할지를 철저히 통제할 수 있다
* 이런 클래스를 인스턴스 통제 클래스라고 한다
* 해당 인스턴스의 생명주기를 통제하는 것을 뜻한다.
* 인스턴스를 통제하는 이유
  * 싱글턴을 만들기 위해
  * 인스턴스화 불가로 만들기 위해
  * 불변 클래스에서 값(value)이 같은 인스턴스는 단 하나임을 보장



## 2.3 반환 타입의 하위 타입 객체를 반환할 수 있는 능력이 있다

* 생성자를 사용하면 해당하는 클래스의 인스턴스만 얻을 수 있다.
* 정적 팩터리 메서드의 리턴 타입을 인터페이스로 할 경우 하위 타입 객체를 반환 할 수 있다.
* 정적 팩토리 메서드를 사용하는 클라이언트는 얻은 객체를 인터페이스만으로 다루게 된다.
  * 이럴 경우의 장점은, 사용자들이 해당 인터페이스의 구현체를 일일이 알아 볼 필요가 없다는 것이다.



**동반 클래스**

* 동반 클래스 : 자바 1.8 이전에는 인터페이스에 정적 메서드를 선언할 수 없었다. 
* 따라서 인터페이스에 기능을 추가하기 위해서는 `동반 클래스`라는 것을 만들어 그 안에 정적 메서드를 추가했다.

```
인터페이스 Collection의 동반 클래스 -> Collections
```

* 다음은 Collections 클래스의 정적 팩토리 메소드 unmodifiableList의 모습이다.

```
public static <T> List<T> unmodifiableList(List<? extends T> list) {
        return (list instanceof RandomAccess ?
                new UnmodifiableRandomAccessList<>(list) :
                new UnmodifiableList<>(list));
}
```

- 이와 같이 팩터리 메서드를 통해 `메소드의 반환 타입은 List이지만 실제로는 List의 하위 객체를 반환`시킬 수 있다.



## 2.4 입력 매개변수에 따라 매번 다른 클래스의 객체를 반환할 수 있다

* 반환 타입의 하위 타입이기만 하면 어떤 클래스의 객체를 반환해도 상관없다.



**예시**

* EnumSet 클래스는 public 생성자 없이 오직 정적 팩토리 메소드만 제공한다.
* 메서드 내부에서 universe.length 따라 리턴 타입을 다르게 반환 한다.
* 클라이언트는 이 두 클래스의 존재(하위 타입)를 모르고 반환 타입만 알기 때문에
  * `RegularEnumSet`을 사용할 이점이 없다면 다음 릴리스 때는 이를 삭제해도 클라이언트에게 아무 문제가 없다.
  * 비슷하게 성능을 더 개선한 세 번째 클래스를 다음 릴리스에 추가해도 클라이언트에게 아무 문제가 없다.

```java
public static <E extends Enum<E>> EnumSet<E> noneOf(Class<E> elementType) {
  Enum<?>[] universe = getUniverse(elementType);
  if (universe == null)
    throw new ClassCastException(elementType + " not an enum");

  if (universe.length <= 64)
    return new RegularEnumSet<>(elementType, universe);
  else
    return new JumboEnumSet<>(elementType, universe);
}
```



## 2.5 정적 팩터리 메서드를 작성하는 시점에는 반환할 객체의 클래스가 존재하지 않아도 된다



# 3 정적 팩터리 메서드의 단점



## 3.1 상속 불가능 

- 상속하려면 public이나 protected 생성자가 필요하다.
  - 상속을 위해서는 하위 클래스에서 사용할 수 있는 생성자가 필요하기 때문
- private 생성자를 통해 외부 생성을 막고, 정적 팩터리 메서드만을 사용하여 인스턴스를 반환할 경우, 하위 클래스를 만들 수 없다.
- 이런 경우 상속을 막아 상속보다 컴포지션을 사용하도록 유도하고 불변 타입을 만들기 위해 필요야 제약이라 오히려 장점이 될 수 있다.



## 3.2 정적 팩터리 메서드는 프로그래머가 찾기 어렵다

- 생성자는 이름이 클래스의 이름과 같아서 명확히 알 수 있다.
- 하지만 정적 팩터리 메서드는 다른 메서드와 섞여 찾기 어려울 수 있다.



# 4 정적 팩터리 메서드의 네이밍

* 정적 팩터리 메서드는 다른 메서드와 섞여 찾기 어려울 수 있다.
* 따라서 API 문서를 잘 작성하고 **메서드 이름도 널리 알려진 규약에** 따라 짓는 식으로 문제를 완화 해야한다.



**from**

* 매개변수를 하나 받아, 해당 타입의 인스턴스를 반환하는 형변환 메서드

```java
// instant 타입을 Date로 변환하여 반환
Date d = Date.from(instant);
```



**of**

* 매개변수를 여러개 받아 적합한 타입의 인스턴스를 반환하는 집계 메서드

```java
// 파라미터로 전달 받은 타입의 Enum을 담은 Set을 반환
Set<Rank> faceCards = Enumset.of(JACK, QUEEN, KING);
```



**valueOf**

* from과 of의 더 자세한 버전



**instance 혹은 getInstance**

* 인스턴스를 반환, 그러나 같은 인스턴스임을 보장하지는 않음.



**create 혹은 newInstance**

* instance 혹은 getInstance와 같지만 매번 새로운 인스턴스 생성하여 반환



**getType** 

* getInstance와 같으나, 생성할 클래스가 아닌 다른 클래스에 팩터리 메서드를 정의할 때 사용.

```
// Files 클래스에서 FileStore의 인스턴스를 반환
FileStore fs = Files.getFileStore(path);
```



**newType** 

* newInstance와 같으나, 생성할 클래스가 아닌 다른 클래스에 팩터리 메서드를 정의할 때 사용.

```
// Files 클래스에서 BufferedReader를 반환
BufferedReader br = Files.newBufferedReader(path);
```



**Type**

*  getType과 newType의 간결한 버전

```
List<Complaint> litany = Collections.list(legacyListany);
```



참고

* [이펙티브 자바 3/E](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788966262281)