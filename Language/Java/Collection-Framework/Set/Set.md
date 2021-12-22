# 1 Set Interface

* Set은 중복이 없는 원소들을 가진 Collection이다.
* Set 인터페이스는 Collection 인터페이스가 상속한 메소드만 가지고 있다.
* Set에 담기는 원소는 필수적으로 equals와 hashCode 메소드를 적절히 오버라이딩해야한다.
  * 원소의 중복 방지를 위해 원소의 비교가 필수적이기 때문
* 두 가지의 Set 인스턴스가 같은 원소를 가질 때 두 인스턴스가 같다고 할 수 있다.



## 1.1 [메소드](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Set.html)

| Modifier and Type        | Method                                 | Description                                                  |
| :----------------------- | :------------------------------------- | :----------------------------------------------------------- |
| `boolean`                | `add(E e)`                             | Adds the specified element to this set if it is not already present (optional operation). |
| `boolean`                | `addAll(Collection<? extends E> c)`    | Adds all of the elements in the specified collection to this set if they're not already present (optional operation). |
| `void`                   | `clear()`                              | Removes all of the elements from this set (optional operation). |
| `boolean`                | `contains(Object o)`                   | Returns `true` if this set contains the specified element.   |
| `boolean`                | `containsAll(Collection<?> c)`         | Returns `true` if this set contains all of the elements of the specified collection. |
| `static <E> Set<E>`      | `copyOf(Collection<? extends E> coll)` | Returns an [unmodifiable Set](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Set.html#unmodifiable) containing the elements of the given Collection. |
| `boolean`                | `equals(Object o)`                     | Compares the specified object with this set for equality.    |
| `int`                    | `hashCode()`                           | Returns the hash code value for this set.                    |
| `boolean`                | `isEmpty()`                            | Returns `true` if this set contains no elements.             |
| `Iterator<E>`            | `iterator()`                           | Returns an iterator over the elements in this set.           |
| `boolean`                | `remove(Object o)`                     | Removes the specified element from this set if it is present (optional operation). |
| `boolean`                | `removeAll(Collection<?> c)`           | Removes from this set all of its elements that are contained in the specified collection (optional operation). |
| `boolean`                | `retainAll(Collection<?> c)`           | Retains only the elements in this set that are contained in the specified collection (optional operation). |
| `int`                    | `size()`                               | Returns the number of elements in this set (its cardinality). |
| `default Spliterator<E>` | `spliterator()`                        | Creates a `Spliterator` over the elements in this set.       |
| `Object[]`               | `toArray()`                            | Returns an array containing all of the elements in this set. |
| `<T> T[]`                | `toArray(T[] a)`                       | Returns an array containing all of the elements in this set; the runtime type of the returned array is that of the specified array. |



## 1.2 구현체

| Interfaces | Hash table Implementations | Tree Implementations | Hash table + Linked list  Implementations |
| ---------- | -------------------------- | -------------------- | ----------------------------------------- |
| `Set`      | `HashSet`                  | `TreeSet`            | `LinkedHashSet`                           |

* [HashSet](#2-HashSet-Class)
  * 원소를 해시 테이블에 저장
  * 순서 보장 안함
  * [Hash-Table.md](../../../../Computer-Science/Data-Structure/Hash-Table/Hash-Table.md)
  
* [TreeSet](#3-TreeSet-Class)
  * 원소를 red-black tree에 저장한다.
  * 원소가 값을 기준으로 순서가 있다.

* [LinkedHashSet](#4-LinkedHashSet-Class)
  * 원소를 해시 테이블에 저장
  * 원소의 삽입 순서를 유지




## 1.3 중복 원소 제거하기

* Collection의 원소 중 중복된 원소를 하나만 남기고 제거해보자
* `import static org.assertj.core.api.Assertions.*;`
* 원소의 순서가 없는 Set, HashSet은 containsOnly()을 이용해 순서와 관계없이 원소를 가지고 있는지 확인
* 원소의 순서가 있는 TreeSet, LinkedHashSet은 containsExactly()을 이용해 순서대로 원소를 가지고 있는지 확인

**예시1**

```java
@Test
void removeDuplicateElement1() {
  List<Integer> collection = Arrays.asList(5, 4, 3, 2, 2, 1);

  Collection<Integer> noDups = new HashSet<>(collection);

  assertThat(noDups.size()).isEqualTo(5);
  assertThat(noDups).containsOnly(1, 2, 3, 4, 5);
}
```

**예시2**

```java
@Test
void removeDuplicateElement2() {
  Collection<Integer> collection = Arrays.asList(5, 4, 3, 2, 2, 1);

  Set<Integer> noDups = collection.stream().collect(Collectors.toSet());

  assertThat(noDups.size()).isEqualTo(5);
  assertThat(noDups).containsOnly(1, 2, 3, 4, 5);
}
```

**예시3**

* TreeSet은 원소의 값을 기준으로 원소들이 순서를 가지고 있다.

```java
@Test
void removeDuplicateElement3() {
  Collection<Integer> collection = Arrays.asList(5, 4, 3, 2, 2, 1);

  TreeSet<Integer> noDups = collection.stream().collect(Collectors.toCollection(TreeSet::new));

  assertThat(noDups.size()).isEqualTo(5);
  assertThat(noDups).containsExactly(1, 2, 3, 4, 5);
}
```

**예시4**

* LinkedHashSet을 이용해 중복 제거 원소의 순서가 삽입 순서이다.

```java
@Test
void removeDuplicateElement4() {
  Collection<Integer> collection = Arrays.asList(5, 4, 3, 2, 2, 1);

  Collection<Integer> noDups = new LinkedHashSet<>(collection);

  assertThat(noDups.size()).isEqualTo(5);
  assertThat(noDups).containsExactly(5, 4, 3, 2, 1);
}
```

**예시5**

* LinkedHashSet을 이용해 중복 제거 원소의 순서가 삽입 순서이다.

```java
public static <E> Set<E> removeDups(Collection<E> c) {
  return new LinkedHashSet<E>(c);
}

@Test
void removeDuplicateElement5() {
  Collection<Integer> collection = Arrays.asList(5, 4, 3, 2, 2, 1);

  Set<Integer> noDups = removeDups(collection);

  assertThat(noDups.size()).isEqualTo(5);
  assertThat(noDups).containsExactly(5, 4, 3, 2, 1);
}
```



## 1.4 Bulk Operation

* A.containsAll(B)

![contain](./images/contain.png)

* A.addAll(B)

![addAll](./images/addAll.png)

* A.retainAll(B)

![retainAll](./images/retainAll.png)

* A.removeAll(B)

<img src="./images/removeAll.png" alt="removeAll" style="zoom:40%;" />



# 2 HashSet Class

* 원소를 해시 테이블에 저장한다.
* TreeSet, LinkedHashSet과 비교하면 가장 성능이 좋다
  * 대신 원소의 순서를 보장하지 않는다.
  * HashSet의 대부분의 메소드가 O(1)
  * 반면 TreeSet은 대부분의 메소드가 O(logN)

* HashSet의 중복 판단
  * 객체를 저장하기 전 먼저 객체의 `hasCode()` 메소드를 호출해서 이미 저장된 객체들의 해시코드와 비교한다.
  * 동인한 해시코드가 있다면 다시 `equals()` 메소드로 두 객체를 비교해서 `true` 가 나오면 동일한 객체로 판단한다.



**HashSet은 원소의 순서를 보장하지 않는다.**

* iterator() 메소드의 설명을 보면 원소의 순서를 보장하지 않는 Iterator를 반환한다.

```java
public class HashSet<E> ...{
    /**
     * Returns an iterator over the elements in this set.  The elements
     * are returned in no particular order.
     *
     * @return an Iterator over the elements in this set
     * @see ConcurrentModificationException
     */
    public Iterator<E> iterator() {
        return map.keySet().iterator();
    }
}
```



# 3 TreeSet Class

> TreeSet은 이진 트리를 기반으로 한 Set 컬렉션이다. 하나의 노드는 노드값인 value와 왼쪽과 오른쪽 자식 노드를 참조하기 위한 두개의 변수로 구성된다.TreeSet에 객체를 저장하면 자동으로 정렬되는데 부모값과 비교해서 작으면 왼쪽 자식 노드에, 높으면 오른쪽 자식 노드에 저장한다.

* TreeSet은 원소를 red-black tree에 저장한다.
* 원소의 값을 기준으로 원소가 순서를 가진다.
  * 따라서 HashSet과 비교하여 상당히 느리다
* TreeSet의 원소는 저장과 동시에 자동 오름차순 정렬된다. 
* TreeSet의 원소는 정렬을 위해 java.lang.Comparable을 구현해야 한다.
* 사용자 정의 클래스를 사용할 경우 java.lang.Comparable의 compareTo()메소드를 오버라이딩 하면 된다.



**TreeSet은 원소의 순서를 보장한다.**

* HashSet과 달리 원소의 순서를 보장하여 오름차순 Iterator 내림차순 Iterator를 얻을 수 있다.

```java
public class TreeSet<E> ...{
  
    /**
     * Returns an iterator over the elements in this set in ascending order.
     *
     * @return an iterator over the elements in this set in ascending order
     */
    public Iterator<E> iterator() {
        return m.navigableKeySet().iterator();
    }
  
  
    /**
     * Returns an iterator over the elements in this set in descending order.
     *
     * @return an iterator over the elements in this set in descending order
     * @since 1.6
     */
    public Iterator<E> descendingIterator() {
        return m.descendingKeySet().iterator();
    }
}
```



# 4 LinkedHashSet Class

* 원소를 해시 테이블에 저장
* 원소의 삽입 순서를 유지
* LinkedHashSet은 HashSet과 TreeSet의 중간 단계라고 생각할 수 있다
* 성능상 HashSet 보다 아주 조금 느리고 TreeSet 보다 빠르다



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



참고

* https://docs.oracle.com/javase/tutorial/collections/interfaces/set.html
* https://docs.oracle.com/javase/tutorial/collections/implementations/set.html
