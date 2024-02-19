# 1 SortedSet Interface

* SortedSet은 원소들은 오름차순 순서로 유지하는 Set이다.
	* 원소는 원소의 자연스러운 순서로 정렬되어있다. 즉 원소가 구현한 Comparable에 정의된 대로
	* 또는 SortedSet을 생성하는 시점에 Comparator를 제공해 원하는 순서로 정렬할 수 있다.
* [[Set]] 참고
* [[Comparable-Comparator]] 참고



**SortedSet Interface**

```java
public interface SortedSet<E> extends Set<E> {
    // Range-view
    SortedSet<E> subSet(E fromElement, E toElement);
    SortedSet<E> headSet(E toElement);
    SortedSet<E> tailSet(E fromElement);

    // Endpoints
    E first();
    E last();

    // Comparator access
    Comparator<? super E> comparator();
}
```



## 1.1 [메소드](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/SortedSet.html)

* Set으로부터 상속받은 모든 메소드는 SortedSet에서 똑같이 작동하나 두 가지의 예외가 있다.
	* iterator()로 반환된 Iterator는 SortedSet의 원소를 순차적으로 조회한다.
	* toArray()로 반환된 array는 정렬된 원소를 가진다.

| Modifier and Type        | Method                               | Description                                                  |
| :----------------------- | :----------------------------------- | :----------------------------------------------------------- |
| `Comparator<? super E>`  | `comparator()`                       | Returns the comparator used to order the elements in this set, or `null` if this set uses the [natural ordering](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/Comparable.html) of its elements. |
| `E`                      | `first()`                            | Returns the first (lowest) element currently in this set.    |
| `SortedSet<E>`           | `headSet(E toElement)`               | Returns a view of the portion of this set whose elements are strictly less than `toElement`. |
| `E`                      | `last()`                             | Returns the last (highest) element currently in this set.    |
| `default Spliterator<E>` | `spliterator()`                      | Creates a `Spliterator` over the elements in this sorted set. |
| `SortedSet<E>`           | `subSet(E fromElement, E toElement)` | Returns a view of the portion of this set whose elements range from `fromElement`, inclusive, to `toElement`, exclusive. |
| `SortedSet<E>`           | `tailSet(E fromElement)`             | Returns a view of the portion of this set whose elements are greater than or equal to `fromElement`. |

<br>

## 1.2 구현체

* TreeSet
	* 원소를 red-black tree에 저장한다.
	* 원소가 값을 기준으로 순서가 있다.