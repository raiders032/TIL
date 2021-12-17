# 1.Set 인터페이스

**특징**

* 순서를 유지하지 않고 저장
* 중복 저장 안 됨

**구현체**

* HashSet
* TreeSet

**모든 객체 조회**

```java
// iterator 사용
Set<String> set = ...;
Iterator<String> iterator = set.iterator();
while(iterator.hasNext()){
  String str = iterator.next();
}

//향상된 for 문 사용
Set<String> set = ...;
for(String str:set){
  ...
}
```

**[메소드](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Set.html)**

| Modifier and Type | Method                              | Description                                                  |
| :---------------- | :---------------------------------- | :----------------------------------------------------------- |
| `boolean`         | `add(E e)`                          | Adds the specified element to this set if it is not already present (optional operation). |
| `boolean`         | `addAll(Collection<? extends E> c)` | Adds all of the elements in the specified collection to this set if they're not already present (optional operation). |
| `void`            | `clear()`                           | Removes all of the elements from this set (optional operation). |
| `boolean`         | `contains(Object o)`                | Returns `true` if this set contains the specified element.   |
| `boolean`         | `containsAll(Collection<?> c)`      | Returns `true` if this set contains all of the elements of the specified collection. |
| `boolean`         | `isEmpty()`                         | Returns `true` if this set contains no elements.             |
| `Iterator<E>`     | `iterator()`                        | Returns an iterator over the elements in this set.           |
| `boolean`         | `remove(Object o)`                  | Removes the specified element from this set if it is present (optional operation). |
| `int`             | `size()`                            | Returns the number of elements in this set (its cardinality). |

# 2.HashSet 클래스

* Set 인터페이스를 구현한 클래스이다.
* HashSet의 중복 판단
  * 객체를 저장하기 전 먼저 객체의 `hasCode()` 메소드를 호출해서 이미 저장된 객체들의 해시코드와 비교한다.
  * 동인한 해시코드가 있다면 다시 `equals()` 메소드로 두 객체를 비교해서 `true` 가 나오면 동일한 객체로 판단한다.



# 3.TreeSet 클래스

> TreeSet은 이진 트리를 기반으로 한 Set 컬렉션이다. 하나의 노드는 노드값인 value와 왼쪽과 오른쪽 자식 노드를 참조하기 위한 두개의 변수로 구성된다.TreeSet에 객체를 저장하면 자동으로 정렬되는데 부모값과 비교해서 작으면 왼쪽 자식 노드에, 높으면 오른쪽 자식 노드에 저장한다.

* TreeSet의 객체와 TreeMap의 키는 저장과 동시에 자동 오름차순 정렬된다. 
* TreeSet의 객체와 TreeMap은 정렬을 위해 java.lang.Comparable을 구현한 객체를 요구한다. 
* 사용자 정의 클래스를 사용할 경우 java.lang.Comparable의 compareTo()메소드를 오버라이딩 하면 된다.



**모든 객체 조회**

```java
TreeSet<String> treeSet = new TreeSet<>();

// 내림차순으로 모든 원소 조회
Iterator<String> iterator = treeSet.descendingIterator();
while (iterator.hasNext()){
  System.out.println(iterator.next());
}
```

