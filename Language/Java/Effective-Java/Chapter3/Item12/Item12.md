# toString을 항상 재정의하라



# 1 개요

* Object의 기본 toString 메서드가 우리가 작성한 클래스에 적합한 문자열을 반환하는 경우는 거의 없다
  * Object의 기본 toString메서드는 `클래스_이름@16진수로_표시한_해시코드`를 반환한다
*  toString 메서드는 개발자가 직접 호출하지 않더라도, 객체를 println, printf, 문자열 연결 연산자(+), assert 구문에 넘길 때, 혹은 디버거가 객체를 출력하도록 할 때 자동으로 불린다



# 2 Object의 toString



## 2.1 Object의 toString 규약

* 간결하면서 사람이 읽기 쉬운 형태의 유익한 정보를 반환해야한다
* 모든 하위 클래스에서 이 메서드를 재정의하라

> Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object. The result should be a **concise but informative representation** that is easy for a person to read. It is recommended that **all subclasses override this method**.
> The toString method for class Object returns a string consisting of the name of the class of which the object is an instance, the at-sign character `@', and the unsigned hexadecimal representation of the hash code of the object. In other words, this method returns a string equal to the value of:
>
> ​       `getClass().getName() + '@' + Integer.toHexString(hashCode())`
>
> Returns: a string representation of the object.



# 3 toString 재정의

* 재정의할 때 가장 중요한 건 **객체 스스로를 완벽히 설명하는 문자열**이어야 한다는 것이다.
* 보통은 **객체가 가진 주요 정보를 모두 반환**하는 것이 좋다.



**PhoneNumber.java**

* 전화번호처럼 포맷이 정해져 있는 경우, 아래 코드와 같이 재정의하고 주석을 달아서 문서화를 해줄 수도 있다

```java
/** 
 * 전화번호의 문자열 표현을 반환합니다.
 * 이 문자열은 XXX-YYYY-ZZZZ 형태의 11글자로 구성됩니다.
 * XXX는 지역코드, YYYY는 접두사, ZZZZ는 가입자 번호입니다.
 * 
 * 전화번호의 각 부분의 값이 너무 작아 자릿수를 채울 수 없다면
 * 앞에서부터 0으로 채워나간다. 예컨대 가입자 번호가 123이라면
 * 전화번호의 마지막 네 문자는 "0123"이 된다
*/
@Override
public String toString() {
    return String.format("%03d-%04d-%04d", areaCode, prefix, lineNum);
}
```



# 4 toString 재정의가 필요하지 않은 경우

* 유틸리티 클래스는 `toString()`을 사용할 이유가 없다
* `Enum` 은 아래 코드처럼 `toString()` 이미 정의되어 있으므로 `toString()`을 재정의하지 않아도 된다.



**Enum.java**

```java
public abstract class Enum<E extends Enum<E>> implements Comparable<E>, Serializable {
  private final String name;
  public String toString() {
    return name;
  }
}
```



# 5 예시



## 5.1 AbstractMap 클래스

```java
public abstract class AbstractMap<K,V> implements Map<K,V> {
  public String toString() {
    Iterator<Entry<K,V>> i = entrySet().iterator();
    if (! i.hasNext())
      return "{}";

    StringBuilder sb = new StringBuilder();
    sb.append('{');
    for (;;) {
      Entry<K,V> e = i.next();
      K key = e.getKey();
      V value = e.getValue();
      sb.append(key   == this ? "(this Map)" : key);
      sb.append('=');
      sb.append(value == this ? "(this Map)" : value);
      if (! i.hasNext())
        return sb.append('}').toString();
      sb.append(',').append(' ');
    }
  }
}
```



## 5.2 AbstractCollection 클래스

```java
public abstract class AbstractCollection<E> implements Collection<E> {
  public String toString() {
    Iterator<E> it = iterator();
    if (! it.hasNext())
      return "[]";

    StringBuilder sb = new StringBuilder();
    sb.append('[');
    for (;;) {
      E e = it.next();
      sb.append(e == this ? "(this Collection)" : e);
      if (! it.hasNext())
        return sb.append(']').toString();
      sb.append(',').append(' ');
    }
  }
}
```



참고

* [이펙티브 자바 3/E](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788966262281)