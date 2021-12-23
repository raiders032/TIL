# 1 Collection Framework

* 컬렉션은 단순히 여러 요소를 하나의 단위로 그룹화하는 객체입니다. 
* 컬렉션은 집계 데이터를 저장, 검색, 조작 및 통신하는 데 사용됩니다. 



**Collection Framework란?**

* 컬렉션 프레임워크는 컬렉션을 표현하고 다룰수 있는 통인된 아키텍쳐다.
* 컬렉션 프레임워크는 **Interface**, **Implementation**, **Algorithm**으로 구성되어 있다.
* **Interface**
  * 컬렉션을 표현하는 추상적인 데이터 타입이다.
  * 인터페이스를 사용함으로써 구현에 대한 세부사항을 몰라도 컬렉션을 이용할 수 있게 한다.
* **Implementation**
  * 인터페이스를 구현한 구체적인 클래스이다.
* **Algorithm**
  * 유용한 계산을 수행하는 메소드를 제공한다.
  * 정렬, 검색
  * 이러한 알고리즘들은 다형성을 만족해 같은 메소드일지라도 컬렉션에 따라 구현이 다를 수 있다.



# 2 Interface & Implementation

![Two interface trees, one starting with Collection and including Set, SortedSet, List, and Queue, and the other starting with Map and including SortedMap.](https://docs.oracle.com/javase/tutorial/figures/collections/colls-coreInterfaces.gif)

* [Collection](Collection/Collection.md)
* [Set](Set/Set.md)
* [List](List/List.md)
* [Queue](Queue/Queue.md)
* [Deque](Deque/Deque.md)
* [Map](Map/Map.md)
* [SortedSet](SortedSet/SortedSet.md)
* [SortedMap](SortedMap/SortedMap.md)



# 3 Synchronization Wrappers

* Synchronization Wrappers 컬렉션은 멀티 스레드 환경에서 하나의 스레드가 요소를 안전하게 처리하게 도와준다.
* 위에 소개한 인터페이스들의 대부분의 구현체들은 싱글 스레드 환경에서 사용할 수 있도록 설계되었다.
  * 즉 thread-safe하지 않다
* 따라서 여러 스레드가 동시에 컬렉션에 접근하면 의도하지 않게 요소가 변결될수 있다.
* 이러한 경우 비동기화된 컬렉션을 동기화된 컬렉션을로 바꿔주는 기능을 하는 Collections의 static 메소드가 있다.



**Collections Class**

* 아래의 메소드들은 thread-safe하지 않은 컬렉션을 받아 thread-safe한 컬렉션을 반환한다.

```java
public class Collections {
  public static <T> Collection<T> synchronizedCollection(Collection<T> c);
  public static <T> Set<T> synchronizedSet(Set<T> s);
  public static <T> List<T> synchronizedList(List<T> list);
  public static <K,V> Map<K,V> synchronizedMap(Map<K,V> m);
  public static <T> SortedSet<T> synchronizedSortedSet(SortedSet<T> s);
  public static <K,V> SortedMap<K,V> synchronizedSortedMap(SortedMap<K,V> m);
}
```



# 4 병렬 처리를 위한 컬렉션

* Synchronization Wrappers 컬렉션은 멀티 스레드 환경에서 하나의 스레드가 요소를 안전하게 처리하게 도와주지만 전체 요소를 빠르게 처리하지 못한다.
  * 하나의 스레드가 요소를 처리할 때 전체 잠금이 발생하기 때문
* 자바는 멀티 스레드가 컬렉션의 요소를 병렬적으로 처리할 수 있도록 특별한 컬렉션을 제공함
* `java.util.concurrent` 패키지의 ConcurrentHashMap 과 ConcurrentLinkedQueue이다



참고

* https://docs.oracle.com/javase/tutorial/collections/index.html
* 이것이 자바다(이상민 저)