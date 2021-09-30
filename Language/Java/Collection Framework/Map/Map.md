

# 1.Map 인터페이스

> Map은 키와 값으로 구성된 Entity 객체를 저장하는 구조를 가지고 있다. 여기서 키와 값은 모두 객체이다. 키는 중복 저장될 수 없지만 값은 중복 저장될 수 있다. 만약 기존에 저장된 키와 동일한 키로 값을 저장하면 기존의 값은 없어지고 새로운 값으로 대치된다.

**특징**

* 키와 값의 쌍으로 저장
* 키는 중복 저장이 안 됨

**구현체**

* HashMap
* HashTable
* TreeMap
* Properties

**모든 객체 조회**

```java
Map<String,Integer> map = new HashMap<>();
Iterator<String> iterator = map.keySet().iterator();

while (iterator.hasNext()){
  String key = iterator.next();
  Integer value = map.get(key);
}
```

```java
Map<String,Integer> map = new HashMap<>();
Set<Map.Entry<String, Integer>> entries = map.entrySet();
Iterator<Map.Entry<String, Integer>> iterator = entries.iterator();

while (iterator.hasNext()){
  Map.Entry<String, Integer> entry = iterator.next();
  String key = entry.getKey();
  Integer value = entry.getValue();
}
```

**[메소드](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Map.html)**

| Modifier and Type     | Method                        | Description                                                  |
| :-------------------- | :---------------------------- | :----------------------------------------------------------- |
| `void`                | `clear()`                     | Removes all of the mappings from this map (optional operation). |
| `boolean`             | `containsKey(Object key)`     | Returns `true` if this map contains a mapping for the specified key. |
| `boolean`             | `containsValue(Object value)` | Returns `true` if this map maps one or more keys to the specified value. |
| `Set<Map.Entry<K,V>>` | `entrySet()`                  | Returns a [`Set`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Set.html) view of the mappings contained in this map. |
| `V`                   | `get(Object key)`             | Returns the value to which the specified key is mapped, or `null` if this map contains no mapping for the key. |
| `boolean`             | `isEmpty()`                   | Returns `true` if this map contains no key-value mappings.   |
| `Set<K>`              | `keySet()`                    | Returns a [`Set`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Set.html) view of the keys contained in this map. |
| `V`                   | `put(K key, V value)`         | Associates the specified value with the specified key in this map (optional operation). |
| `V`                   | `remove(Object key)`          | Removes the mapping for a key from this map if it is present (optional operation). |

# 2.HashMap 클래스

* Map 인터페이스를 구현한 클래스
* HashMap의 키로 사용할 객체는 `hasCode()` 와  `equals()` 메소드를 재정의해서 동등 객체가 될 조건을 정해야한다.
* 주로 키 타입은 `String` 을 많이 사용하는데 문자열이 같을 경우 동등 객체가 될 수 있도록 `hasCode()` 와  `equals()` 메소드가 재정의되어 있다.
* 키와 값의 타입은 기본 타입을 사용할 수 없고 클래스 및 인터페이스 타입만 가능하다.



## 2.1 HashMap과 HashTable

*  키에 대한 해시 값을 사용하여 값을 저장하고 조회하며, 키-값 쌍의 개수에 따라 동적으로 크기가 증가하는 associate array라고 할 수 있다. 
   *  associate array를 지칭하는 다른 용어가 있는데, 대표적으로 Map, Dictionary, Symbol Table 등이다.
*  HashMap과 HashTable은 Java의 API 이름이다. 
*  HashMap과 HashTable은 Map 인터페이스를 구현하고 있기 때문에 HashMap과 HashTable이 제공하는 기능은 같다. 

**HashTable**

* HashTable이란 JDK 1.0부터 있던 Java의 API이다
* HashTable의 현재 가치는 JRE 1.0, JRE 1.1 환경을 대상으로 구현한 Java 애플리케이션이 잘 동작할 수 있도록 하위 호환성을 제공하는 것

**HashMap**

* HashMap은 Java 2에서 처음 선보인 Java Collections Framework에 속한 API다. 
* HashMap은 보조 해시 함수(Additional Hash Function)를 사용하기 때문에 보조 해시 함수를 사용하지 않는 HashTable에 비하여 해시 충돌(hash collision)이 덜 발생할 수 있어 상대으로 성능상 이점이 있다. 
* HashTable 구현에는 거의 변화가 없는 반면, HashMap은 지속적으로 개선되고 있다. 

# 3.HashTable 클래스

* `HashMap` 과  동일한 내부 구조를 가지고있다. 
* `HashMap` 과  차이점:  `HashTable  `은 동기화된 메소드로 구성되어 있기 때문에 멀티 스레드가 동시에 이 메소드를 실행 할 수 없다. 따라서 `Thread Safe`하다



# 4.TreeMap 클래스

* TreeMap은 이진 트리를 기반으로 한 Map 콜렉션이다. 
* TreeMap에 객체를 저장하면 자동으로 정렬된다.
* 기본적으로 부모 키값과 비교해서 키 값이 낮은 것은 왼쪽 자식노드에, 키 값이 높은 것은 오른쪽 자식 노드에 객체를 저장한다.

> 참고
>
> TreeSet의 객체와 TreeMap의 키는 저장과 동시에 자동 오름차순 정렬된다. TreeSet의 객체와 TreeMap은 정렬을 위해 java.lang.Comparable을 구현한 객체를 요구한다. 사용자 정의 클래스를 사용할 경우 java.lang.Comparable의 compareTo()메소드를 오버라이딩 하면 된다.
>
> java.lang.Comparable 비구현 객체를 정렬하려면 정렬자(Comparator)를 제공하면 된다. 정렬자는 Comparator 인터페이스를 구현한 객체를 말한다.

 

참조

* https://d2.naver.com/helloworld/831311

