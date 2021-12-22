# 1 SortedMap Interface

* SortedMap은 엔트리은 오름차순 순서로 유지하는 Set이다.
  * 엔트리는 자연스러운 순서로 정렬되어있다. 즉 엔트리의 Key가 구현한 Comparable에 정의된 대로
  * 또는 SortedMap을 생성하는 시점에 Comparator를 제공해 원하는 순서로 엔트리를 정렬할 수 있다.
* [Map.md](../Map/Map.md)
* [Comparable-Comparator.md](../../Comparable-Comparator/Comparable-Comparator.md)



**SortedMap Interface**

```java
public interface SortedMap<K, V> extends Map<K, V>{
  // Comparator access
  Comparator<? super K> comparator();

  // Range-view
  SortedMap<K, V> subMap(K fromKey, K toKey);
  SortedMap<K, V> headMap(K toKey);
  SortedMap<K, V> tailMap(K fromKey);
  
  // Endpoints
  K firstKey();
  K lastKey();
}
```



## 1.1 [메소드](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/SortedMap.html)

* Map으로부터 상속받은 모든 메소드는 SortedMap에서 똑같이 작동하나 두 가지의 예외가 있다.
  * Map의 keySet, values, entrySet메소드로 반환된 Collection을 통해 iterator()로 얻은 Iterator는 정렬된 원소를 순차조회한다.
  * toArray()로 반환된 array는 정렬된 엔트리를 가진다.

| Modifier and Type       | Method                       | Description                                                  |
| :---------------------- | :--------------------------- | :----------------------------------------------------------- |
| `Comparator<? super K>` | `comparator()`               | Returns the comparator used to order the keys in this map, or `null` if this map uses the [natural ordering](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/Comparable.html) of its keys. |
| `Set<Map.Entry<K,V>>`   | `entrySet()`                 | Returns a [`Set`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Set.html) view of the mappings contained in this map. |
| `K`                     | `firstKey()`                 | Returns the first (lowest) key currently in this map.        |
| `SortedMap<K,V>`        | `headMap(K toKey)`           | Returns a view of the portion of this map whose keys are strictly less than `toKey`. |
| `Set<K>`                | `keySet()`                   | Returns a [`Set`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Set.html) view of the keys contained in this map. |
| `K`                     | `lastKey()`                  | Returns the last (highest) key currently in this map.        |
| `SortedMap<K,V>`        | `subMap(K fromKey, K toKey)` | Returns a view of the portion of this map whose keys range from `fromKey`, inclusive, to `toKey`, exclusive. |
| `SortedMap<K,V>`        | `tailMap(K fromKey)`         | Returns a view of the portion of this map whose keys are greater than or equal to `fromKey`. |
| `Collection<V>`         | `values()`                   | Returns a [`Collection`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Collection.html) view of the values contained in this map. |



참고

* https://docs.oracle.com/javase/tutorial/collections/interfaces/sorted-map.html