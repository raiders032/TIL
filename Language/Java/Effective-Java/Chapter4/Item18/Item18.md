# 상속보다는 컴포지션을 사용하라



# 1 상속의 단점



**상속의 위험**

* 상속은 코드를 재사용하는 강력한 수단이지만 항상 최선이 아니다
* 잘못 사용하면 오류를 내기 쉬운 소프트웨어를 만든다
* 다른 패키지의 구체 클래스를 상속하는 일은 위험하다.



**상속이 안전한 경우**

* 상위 클래스, 하위 클래스를 모두 같은 프로그래머가 통제하는 패키지 안에서라면 상속도 안전한 방법일 수 있다.
* 확장할 목적으로 설계되었고 문서화도 잘된 클래스도 마찬가지로 안전하다



**상속의 단점**

* 메서드 호출과 달리 **상속은 캡슐화를 깨뜨린다**
* 상위 클래스가 어떻게 구현 되느냐에 따라 하위 클래스의 동작에 이상이 생길 수 있다.
* 상위 클래스는 릴리즈마다 내부 구현이 달라질 수 있기 때문에 하위 클래스가 오작동할 수 있다는 것
* 상위 클래스 설계자가 확장을 충분히 고려하지 않으면, 하위 클래스는 상위 크래스 변화에 발 맞춰 수정돼야만 한다.



# 2 상속의 단점 예시

* HashSet 기능을 사용하면서, 생성된 이후 몇개의 원소가 더해졌는지 알 수 있는 기능을 추가한 클래스를 구현해보자.



## 2.1 **InstrumentedHashSet.java**

* HashSet을 상속하여 몇개의 원소가 더해졌는지 알 수 있는 기능을 추가함
* 이 클래스는 잘 구현된 것처럼 보이지만 제대로 동작하지 않는다

```java
public class InstrumentedHashSet<E> extends HashSet<E> {
  private int addCount = 0;

  public InstrumentedHashSet(int initCap, float loadFactor) {
    super(initCap, loadFactor);
  }

  @Override 
  public boolean add(E e) {
    addCount++;
    return super.add(e);
  }

  @Override 
  public boolean addAll(Collection<? extends E> c) {
    addCount += c.size();
    return super.addAll(c);
  }

  public int getAddCount() {
    return addCount;
  }
}
```



**Test**

* 원소의 개수 3을 기대했지만 실제로는 6임

```java
@Test
@DisplayName("InstrumentedHashSet 테스트")
void testAddAll() {
  InstrumentedHashSet<String> s = new InstrumentedHashSet<>();
  s.addAll(List.of("Snap", "Crackle", "Pop"));
  Assertions.assertThat(s.getAddCount()).isEqualTo(6);
}
```



## 2.2 원인

* HashSet의 addAll 메소드는 add 메소드를 사용해 구현되었다
* InstrumentedHashSet의 addAll은 addCount에 3을 더하고 Hash의 addAll 구현을 호출했다
* Hash의 addAll은 각 원소를 add 메소드를 호출해 추가하는데 이 때 호출되는 add는 재정의된 InstrumentedHashSet의 add 메소드이다
* 따라서 addCount 값이 중복으로 더해져 최종적으로 6이 된 것 



## 2.3 해결책

* 이 경우 하위 클래스에서 addAll 메소드를 재정의 하지 않으면 된다



**InstrumentedHashSet.java**

* addAll 메소드를 재정의하지 않았다

```java
public class InstrumentedHashSet<E> extends HashSet<E> {
    private int addCount = 0;

    public InstrumentedHashSet() {
    }

    public InstrumentedHashSet(int initCap, float loadFactor) {
        super(initCap, loadFactor);
    }

    @Override public boolean add(E e) {
        addCount++;
        return super.add(e);
    }

    public int getAddCount() {
        return addCount;
    }
}
```

**테스트**

* 기대한 값 3이 나왔다

```java
@Test
@DisplayName("InstrumentedHashSet 테스트")
void testAddAll() {
  InstrumentedHashSet<String> s = new InstrumentedHashSet<>();
  s.addAll(List.of("Snap", "Crackle", "Pop"));
  Assertions.assertThat(s.getAddCount()).isEqualTo(3);
}
```



**진정한 해결책일까?**

* 지금 당장은 제대로 동작할지 모르나 `HashSet의 addAll 메소드가 add 메소드를 사용해 구현되었다` 라고 가정한 해법이라는 한계를 지님
* 이 가정이 다음 릴리스에서도 유지될지는 알 수 없다
* 따라서 이런 가정에 기댄 InstrumentedHashSet도 깨지기 쉽다



## 2.4 해결책2

* 다른 식의 재정의를 하는 경우
* InstrumentedHashSet에서 아예 새롭게 `addAll` 을 재정의 하는 경우
* 이 방식은 `HashSet`의 `addAll ` 을 더이상 호출하지 않으니 addAll이 add를 상용하는지와 상관없이 결과가 나와 더 나은 해법이다
* 하지만 상위 클래스 메서드와 똑같이 동작하도록 구현해야 하는데, 이 방식은 어려울 수도 있으며, 시간도 더 들고, 오류 및 성능하락의 문제를 가져옴



## 2.5 해결책 3

* 이상의 두 해결책 모두 메소드 재정의가 문제의 원인이였다.
* 새로운 메서드를 추가해서 해결하면 괜찮지 않을까?
* 하지만, 이 방법도 상위 클래스 변화에 따라 문제가 생길 수도 있다.
* 하위 클래스에 새로운 메서드를 정의해 사용 중이라고 하자.
* 이후, 상위 클래스에 새로운 메서드가 추가 되었는데, 하위 클래스에 정의한 메서드와 시그니처는 같은데 반환 타입은 다르다면 하위 클래스는 컴파일조차 되지 않는다
* 반환 타입도 같으면 상위 클래스를 재정의한 꼴이다.
* 또한 먼저 만든 메서드는 상위 클래스의 메서드 요구사항을 만족시키지 못할 가능성이 크다.



# 3 컴포지션

* 위 문제를 모두 피해가는 묘안이 있다
* 기존 클래스를 확장하는 대신 새로운 클래스를 만들고 private 필드로 기존 클래스의 인스턴스를 참조하는 것
* 기존 클래스가 새로운 클래스의 구성요소로 쓰인다는 뜻에서 이러한 설계를 컴포지션이라고 한다
* 새로운 클래스의 인스턴스 메소드들은 기존 클래스의 대응하는 메소드를 호출해 그 결과를 반환한다
  * 이 방식을 포워딩이라 한다
  * 포워딩 하는 새로운 클래스의 인스턴스 메소드를 포워딩 메소드라고 부른다
* 결과적으로 새로운 클래스는 기존 클래스의 내부 구현 방식의 영향에서 벗어난다
  * 기존 클래스에 새로운 메소드가 추가되어도 새로운 클래스는 전혀 영향받지 않는다



# 4 컴포지션 예시

* InstrumentedHashSet을 컴포지션 방식으로 다시 구현해보자
* 이번 구현은 둘로 나누었다
  * InstrumentedSet: 집합 클래스 자신
  * ForwardingSet: 전달 메소드로만 이뤄진 재사용 가능한 전달 클래스



## 4.1 InstrumentedSet



**InstrumentedSet.java**

* Set 인스턴스를 감싸고 있다는 뜻에서 InstrumentedSet 클래스를 래퍼 클래스라고 한다
  * `InstrumentedSet<String> s = new InstrumentedSet<>(new HashSet<>());`
* 또한 Set에 계측 기능을 덧씌운다는 뜻에서 데코레이터 패턴이라고 한다
  * [Proxy.md](../../../../../Design-Pattern/Proxy/Proxy.md) 참조
  * [Decorator.md](../../../../../Design-Pattern/Decorator/Decorator.md) 참조

```java
// Wrapper class - uses composition in place of inheritance  (Page 90)
public class InstrumentedSet<E> extends ForwardingSet<E> {
  private int addCount = 0;

  public InstrumentedSet(Set<E> s) {
    super(s);
  }

  @Override public boolean add(E e) {
    addCount++;
    return super.add(e);
  }
  @Override public boolean addAll(Collection<? extends E> c) {
    addCount += c.size();
    return super.addAll(c);
  }
  public int getAddCount() {
    return addCount;
  }
}
```

```java
@Test
void test() {
  InstrumentedSet<String> s = new InstrumentedSet<>(new HashSet<>());
  s.addAll(List.of("Snap", "Crackle", "Pop"));
  Assertions.assertThat(s.size()).isEqualTo(3);
}
```



## 4.2 ForwardingSet

**ForwardingSet.java**

* 전달 메소드를 작성하는게 지루하겠지만 재사용할 수 있는 전달 클래스를 인터페이스당 하나씩만 만들어두면 원하는 기능을 덧씌우는 전달 클래스를 아주 손쉽게 구현할 수 있다
* ForwardingSet 전달 클래스를 만들어 계측 기능을 덧씌우는 InstrumentedSet를 쉽게 만들 수 있었고 다른 기능을 덧씌운 클래스도 ForwardingSet 전달 클래스를 이용해 쉽게 만들 수 있다.

```java
// Reusable forwarding class (Page 90)
public class ForwardingSet<E> implements Set<E> {
  private final Set<E> s;
  public ForwardingSet(Set<E> s) { this.s = s; }

  public void clear()               { s.clear();            }
  public boolean contains(Object o) { return s.contains(o); }
  public boolean isEmpty()          { return s.isEmpty();   }
  public int size()                 { return s.size();      }
  public Iterator<E> iterator()     { return s.iterator();  }
  public boolean add(E e)           { return s.add(e);      }
  public boolean remove(Object o)   { return s.remove(o);   }
  public boolean containsAll(Collection<?> c)
  { return s.containsAll(c); }
  public boolean addAll(Collection<? extends E> c)
  { return s.addAll(c);      }
  public boolean removeAll(Collection<?> c)
  { return s.removeAll(c);   }
  public boolean retainAll(Collection<?> c)
  { return s.retainAll(c);   }
  public Object[] toArray()          { return s.toArray();  }
  public <T> T[] toArray(T[] a)      { return s.toArray(a); }
  @Override public boolean equals(Object o)
  { return s.equals(o);  }
  @Override public int hashCode()    { return s.hashCode(); }
  @Override public String toString() { return s.toString(); }
}
```



# 5 정리

* **상속은 반드시 하위 클래스가 상위 클래스의 '진짜' 하위 타입인 상황에서만 사용해야한다.**
  - 클래스 간에 'is-a' 관계 일때인 경우에만 상속을 사용하자.
  - 클래스 A를 상속하는 클래스 B를 작성하려 한다면 "B가 정말 A인가" 자문해보자
  - 만약 아닌경우, 컴포지션을 사용하자
  - 예를 들어 스택은 벡터가 아니므로 Stack은 Vector를 확장해서는 안 됐다.
  - 이 경우 컴포지션을 사용했으면 더 좋았을 것이다



참고

* [이펙티브 자바 3/E](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788966262281)