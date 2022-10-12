

# 1 Map Interface

* Map은 키와 값을 매핑한다.
  * 여기서 키와 값은 모두 객체이다

* Map은 중복되는 키를 가질 수 없다.
  * 만약 기존에 저장된 키와 동일한 키로 값을 저장하면 기존의 값은 없어지고 새로운 값으로 대치된다.

* Map은 중복된 값을 가질 수 있다
* 각각의 키는 최대 하나의 값과 매핑된다.



## 1.1 메소드

* [참고](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Map.html)



**기본 값을 가지는 맵 만들기**

```java
static <K, V> Map<K, V> newAttributeMap(Map<K, V>defaults, Map<K, V> overrides) {
    Map<K, V> result = new HashMap<K, V>(defaults);
    result.putAll(overrides);
    return result;
}
```



## 1.2 구현체

* [HashMap](#2-hashmap-class)
* [HashTable](#3-hashtable-class)
* [TreeMap](#4-treemap-class)
* [LinkedHashMap](#5-linkedhashmap-class)



## 1.3 aggregate operation

* JDK8의 aggregate operation 사용해서 Map으로 결과 받기 예시



**부서별 직원 리스트**

```java
Map<Department, List<Employee>> byDept = employees.stream()
.collect(Collectors.groupingBy(Employee::getDepartment));
```

**부서별 총 봉급**

```java
Map<Department, Integer> totalByDept = employees.stream()
.collect(Collectors.groupingBy(Employee::getDepartment,
Collectors.summingInt(Employee::getSalary)));
```

**도시별 사람**

```java
Map<String, List<Person>> peopleByCity = personStream
  .collect(Collectors.groupingBy(Person::getCity));
```



## 1.4 Map 순회하기

* Map의 메소드 중 Collection 타입을 반환하는 메소드를 이용해 맵을 순회하는 것이 가능하다
  * 대표적으로 keySet, values, entrySet이 있다

* keySet: Map이 가진 Key의 Set을 반환한다.
* values: Map이 가진 Value의 Collection을 반환한다.
* entrySet: Map이 가진 Key-Value 쌍의 Set을 반환한다.

**Map Interface**

```java
public interface Map<K, V> {
  Set<K> keySet();
  Collection<V> values();
  Set<Map.Entry<K, V>> entrySet();
}
```



**예시1**

```java
for (KeyType key : m.keySet())
  System.out.println(key);
```

```java
for (Iterator<Type> it = m.keySet().iterator(); it.hasNext(); )
  if (it.next().isBogus())
    it.remove();
```

```java
for (Map.Entry<KeyType, ValType> e : m.entrySet())
  System.out.println(e.getKey() + ": " + e.getValue());
```



# 2 HashMap Class

* 해시 테이블을 기반으로 Map 인터페이스를 구현한 클래스
  * 연결 리스트로 이루어진 배열을 가지고 있다

* HashMap의 키로 사용할 객체는 `hasCode()` 와  `equals()` 메소드를 재정의해서 동등 객체가 될 조건을 정해야한다.
* 주로 키 타입은 `String` 을 많이 사용하는데 문자열이 같을 경우 동등 객체가 될 수 있도록 `hasCode()` 와  `equals()` 메소드가 재정의되어 있다.
* 키와 값의 타입은 기본 타입을 사용할 수 없고 클래스 및 인터페이스 타입만 가능하다.
* 키와 값으로 null을 허용한다



## 2.1 성능

* 검색과 삽입에 O(1) 시간이 소요된다
* 해시 테이블은 성능에 영향을 미치는 두 가지 파라미터를 가지고 있다
  * *initial capacity* 와 *load factor*
* initial capacity
  * 해시 테이블의 버킷의 개수
  * 기본값 16
* `load factor == n/k`
  * n: 해시 테이블에 저장된 개수
  * k: 버킷의 개수
  * 해시맵의 디폴트 로드 팩터는 0.75(시간과 공간 비용의 적절한 절충안이라고 한다)
  * 일반적으로 로드 팩터가 증가할 수록 해시 테이블의 성능은 점점 감소한다
  * 자바10의 경우 0.75를 넘어서는 경우 동적 배열처럼 해시 테이블의 공간을 재할당한다



# 3 HashTable Class

* `HashMap` 과  동일한 내부 구조를 가지고있다. 
* `HashMap` 과  차이점:  `HashTable  `은 동기화된 메소드로 구성되어 있기 때문에 멀티 스레드가 동시에 이 메소드를 실행 할 수 없다. 따라서 `Thread Safe`하다



**HashTable 클래스**

- method에 synchronized 키워드가 적용되어 한 스레드만 메소드를 실행할 수 있다.

```java
public class Hashtable<K,V>
  extends Dictionary<K,V>
  implements Map<K,V>, Cloneable, java.io.Serializable {

  public synchronized int size() {
    return count;
  }

  public synchronized boolean isEmpty() {
    return count == 0;
  }

  public synchronized Enumeration<K> keys() {
    return this.<K>getEnumeration(KEYS);
  }

  public synchronized Enumeration<V> elements() {
    return this.<V>getEnumeration(VALUES);
  }

}
```





**Thread Safe Map**

* Thread Safe한 Map이 필요하다면 HashTable 대신 ConcurrentHashMap을 사용하는 것이 권장된다.



## 3.1 HashMap과 HashTable

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



# 4 TreeMap Class

* TreeMap은 이진 트리(Red-Black tree)를 기반으로 한 Map 콜렉션이다. 
* TreeMap에 객체를 저장하면 자동으로 정렬된다.
* TreeMap은 정렬을 위해 엔트리의 키가 Comparable을 구현해야 한다.
  * [Comparable-Comparator.md](../../Comparable-Comparator/Comparable-Comparator.md)
* Comparable를 구현하지 않은 객체를 키로 사용하려면 TreeMap 생성시 정렬자(Comparator의 구현체)를 제공하면 된다.
* 기본적으로 부모 키값과 비교해서 키 값이 낮은 것은 왼쪽 자식노드에, 키 값이 높은 것은 오른쪽 자식 노드에 객체를 저장한다.
* thread-safe하지 않다



## 4.1 [메소드](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/TreeMap.html)

* Map은 순서가 없지만 TreeMap은 순서가 있기 때문에 순서와 관련된 메소드를 사용하려면 참조 변수의 타입을 Map 대신 TreeMap을 사용하자
* 아래는 순서와 관련된 메소드 일부이다.

| Modifier and Type | Method                | Description                                                  |
| :---------------- | :-------------------- | :----------------------------------------------------------- |
| `Map.Entry<K,V>`  | `firstEntry()`        | Returns a key-value mapping associated with the least key in this map, or `null` if the map is empty. |
| `Map.Entry<K,V>`  | `lastEntry()`         | Returns a key-value mapping associated with the greatest key in this map, or `null` if the map is empty. |
| `Map.Entry<K,V>`  | `lowerEntry(K key)`   | Returns a key-value mapping associated with the greatest key strictly less than the given key, or `null` if there is no such key. |
| `Map.Entry<K,V>`  | `higherEntry(K key)`  | Returns a key-value mapping associated with the least key strictly greater than the given key, or `null` if there is no such key. |
| `Map.Entry<K,V>`  | `floorEntry(K key)`   | Returns a key-value mapping associated with the greatest key less than or equal to the given key, or `null` if there is no such key. |
| `Map.Entry<K,V>`  | `ceilingEntry(K key)` | Returns a key-value mapping associated with the least key greater than or equal to the given key, or `null` if there is no such key. |



## 4.2 성능

* 검색과 삽입에 O(log N) 시간이 소요된다



# 5 LinkedHashMap Class

* Map Interface를 구현한 구현체
* LinkedHashMap의 엔트리 순서는 삽입된 순서이다.



## 5.1 성능

* 검색과 삽입에 O(1) 시간이 소요된다



# 6 어떤 구현체를 사용해야 될까?

* 원소의 키로 정렬이 필요하면 TreeMap을 사용한다.
* 최상의 성능과 원소의 순서를 신경쓰지 않는다면 HashMap을 사용한다.
* HashMap에 가까운 성능과 원소 삽인 순서가 필요하다면 LinkedHashMap을 사용한다.



**예시**

* 키의 순서
* HashMap: 무작위
* TreeMap: 키의 값을 기준으로 정렬 됨
* linkedHashMap: 삽입 순서로 정렬 됨

```java
@Test
void testMap() {
  List<String> strings = Arrays.asList("if", "it", "is", "to", "be", "it", "is", "up", "to", "me", "to", "delegate");
  Map<String, Integer> hashMap = new HashMap<>();
  Map<String, Integer> treeMap = new TreeMap<>();
  Map<String, Integer> linkedHashMap = new LinkedHashMap<>();

  for (String a : strings) {
    Integer freq = hashMap.get(a);
    hashMap.put(a, (freq == null) ? 1 : freq + 1);

    freq = treeMap.get(a);
    treeMap.put(a, (freq == null) ? 1 : freq + 1);

    freq = linkedHashMap.get(a);
    linkedHashMap.put(a, (freq == null) ? 1 : freq + 1);
  }

  Assertions.assertThat(hashMap.size()).isEqualTo(8);
  Assertions.assertThat(treeMap.size()).isEqualTo(8);
  Assertions.assertThat(linkedHashMap.size()).isEqualTo(8);

  System.out.println("hashMap: " + hashMap);
  System.out.println("treeMap: " + treeMap);
  System.out.println("linkedHashMap: " + linkedHashMap);
}
```

```java
hashMap: {delegate=1, be=1, me=1, is=2, it=2, to=3, up=1, if=1}
treeMap: {be=1, delegate=1, if=1, is=2, it=2, me=1, to=3, up=1}
linkedHashMap: {if=1, it=2, is=2, to=3, be=1, up=1, me=1, delegate=1}
```



참고

* https://docs.oracle.com/javase/tutorial/collections/interfaces/map.html
* https://docs.oracle.com/javase/tutorial/collections/implementations/map.html
* https://d2.naver.com/helloworld/831311
* 이것이 자바다(이상민 저)

