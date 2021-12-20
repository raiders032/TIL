

# 1.Map Interface

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

* HashMap
* TreeMap
* LinkedHashMap
* HashTable
* Properties



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



# 2.HashMap Class

* Map 인터페이스를 구현한 클래스
* HashMap의 키로 사용할 객체는 `hasCode()` 와  `equals()` 메소드를 재정의해서 동등 객체가 될 조건을 정해야한다.
* 주로 키 타입은 `String` 을 많이 사용하는데 문자열이 같을 경우 동등 객체가 될 수 있도록 `hasCode()` 와  `equals()` 메소드가 재정의되어 있다.
* 키와 값의 타입은 기본 타입을 사용할 수 없고 클래스 및 인터페이스 타입만 가능하다.



**예시1**

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

# 3.HashTable Class

* `HashMap` 과  동일한 내부 구조를 가지고있다. 
* `HashMap` 과  차이점:  `HashTable  `은 동기화된 메소드로 구성되어 있기 때문에 멀티 스레드가 동시에 이 메소드를 실행 할 수 없다. 따라서 `Thread Safe`하다



# 4 TreeMap Class

* TreeMap은 이진 트리를 기반으로 한 Map 콜렉션이다. 
* TreeMap에 객체를 저장하면 자동으로 정렬된다.
* 기본적으로 부모 키값과 비교해서 키 값이 낮은 것은 왼쪽 자식노드에, 키 값이 높은 것은 오른쪽 자식 노드에 객체를 저장한다.

> 참고
>
> TreeSet의 객체와 TreeMap의 키는 저장과 동시에 자동 오름차순 정렬된다. TreeSet의 객체와 TreeMap은 정렬을 위해 java.lang.Comparable을 구현한 객체를 요구한다. 사용자 정의 클래스를 사용할 경우 java.lang.Comparable의 compareTo()메소드를 오버라이딩 하면 된다.
>
> java.lang.Comparable 비구현 객체를 정렬하려면 정렬자(Comparator)를 제공하면 된다. 정렬자는 Comparator 인터페이스를 구현한 객체를 말한다.

 

# 5 LinkedHashMap Class

참조

* https://docs.oracle.com/javase/tutorial/collections/interfaces/map.html
* https://d2.naver.com/helloworld/831311

