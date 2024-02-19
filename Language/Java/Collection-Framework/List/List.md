# 1 List Interface

* List 순서가 있는 원소를 가진 Collection이다.
* List는 중복된 원소를 가질 수 있다.
	* Set은 중복된 원소를 가지지 않는다.

<br>

## 1.1 [메소드](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/List.html)

| Modifier and Type        | Method                                         | Description                                                  |
| :----------------------- | :--------------------------------------------- | :----------------------------------------------------------- |
| `void`                   | `add(int index, E element)`                    | Inserts the specified element at the specified position in this list (optional operation). |
| `boolean`                | `add(E e)`                                     | Appends the specified element to the end of this list (optional operation). |
| `boolean`                | `addAll(int index, Collection<? extends E> c)` | Inserts all of the elements in the specified collection into this list at the specified position (optional operation). |
| `boolean`                | `addAll(Collection<? extends E> c)`            | Appends all of the elements in the specified collection to the end of this list, in the order that they are returned by the specified collection's iterator (optional operation). |
| `void`                   | `clear()`                                      | Removes all of the elements from this list (optional operation). |
| `boolean`                | `contains(Object o)`                           | Returns `true` if this list contains the specified element.  |
| `boolean`                | `containsAll(Collection<?> c)`                 | Returns `true` if this list contains all of the elements of the specified collection. |
| `static <E> List<E>`     | `copyOf(Collection<? extends E> coll)`         | Returns an [unmodifiable List](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/List.html#unmodifiable) containing the elements of the given Collection, in its iteration order. |
| `boolean`                | `equals(Object o)`                             | Compares the specified object with this list for equality.   |
| `E`                      | `get(int index)`                               | Returns the element at the specified position in this list.  |
| `int`                    | `hashCode()`                                   | Returns the hash code value for this list.                   |
| `int`                    | `indexOf(Object o)`                            | Returns the index of the first occurrence of the specified element in this list, or -1 if this list does not contain the element. |
| `boolean`                | `isEmpty()`                                    | Returns `true` if this list contains no elements.            |
| `Iterator<E>`            | `iterator()`                                   | Returns an iterator over the elements in this list in proper sequence. |
| `int`                    | `lastIndexOf(Object o)`                        | Returns the index of the last occurrence of the specified element in this list, or -1 if this list does not contain the element. |
| `ListIterator<E>`        | `listIterator()`                               | Returns a list iterator over the elements in this list (in proper sequence). |
| `ListIterator<E>`        | `listIterator(int index)`                      | Returns a list iterator over the elements in this list (in proper sequence), starting at the specified position in the list. |
| `E`                      | `remove(int index)`                            | Removes the element at the specified position in this list (optional operation). |
| `boolean`                | `remove(Object o)`                             | Removes the first occurrence of the specified element from this list, if it is present (optional operation). |
| `boolean`                | `removeAll(Collection<?> c)`                   | Removes from this list all of its elements that are contained in the specified collection (optional operation). |
| `default void`           | `replaceAll(UnaryOperator<E> operator)`        | Replaces each element of this list with the result of applying the operator to that element. |
| `boolean`                | `retainAll(Collection<?> c)`                   | Retains only the elements in this list that are contained in the specified collection (optional operation). |
| `E`                      | `set(int index, E element)`                    | Replaces the element at the specified position in this list with the specified element (optional operation). |
| `int`                    | `size()`                                       | Returns the number of elements in this list.                 |
| `default void`           | `sort(Comparator<? super E> c)`                | Sorts this list according to the order induced by the specified [`Comparator`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Comparator.html). |
| `default Spliterator<E>` | `spliterator()`                                | Creates a [`Spliterator`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Spliterator.html) over the elements in this list. |
| `List<E>`                | `subList(int fromIndex, int toIndex)`          | Returns a view of the portion of this list between the specified `fromIndex`, inclusive, and `toIndex`, exclusive. |
| `Object[]`               | `toArray()`                                    | Returns an array containing all of the elements in this list in proper sequence (from first to last element). |
| `<T> T[]`                | `toArray(T[] a)`                               | Returns an array containing all of the elements in this list in proper sequence (from first to last element); the runtime type of the returned array is that of the specified array. |

<br>

## 1.2 구현체

* [ArrayList](#2-arraylist)
* [LinkedList](#3-linkedlist)

<br>

## 1.3 List 조회

* Iterator는 컬렉션의 원소를 하나씩 조회하거나 삭제할 수 있게 해주는 객체이다.
* List의 iterator()를 호출해 Iterator를 얻을 수 있다.
	* `Iterator<Integer> iterator = list.iterator();`
* List는 또한 Iterator에서 기능이 추가된 ListIterator를 제공한다.
	* ListIterator는 커서를 뒤로 움직일 뿐만 아니라 앞으로 움직이는게 가능
	* 즉 next() 메소드 뿐만 아니라 previous() 메소드도 제공한다.

<br>

**ListIterator 인터페이스**

```java
public interface ListIterator<E> extends Iterator<E> {
  boolean hasNext();
  E next();
  // 역방향으로 다음 원소를 가지고 있으면 true 아니면 false
  boolean hasPrevious();
  // 이전 원소를 반환하고 커서를 역방향으로 이동시킴
  E previous();
  int nextIndex();
  // previous를 호출 할 때 반환될 원소의 인덱스를 반환한다
  int previousIndex();
  void remove();
  void set(E e);
  void add(E e);
}
```



**Iterator 예시**

```java
@Test
void testIterator() {
  List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);
  Iterator<Integer> iterator = list.iterator();
  int sum = 0;

  while (iterator.hasNext()) {
    sum += iterator.next();
  }

  assertThat(sum).isEqualTo(15);
}
```



**ListIterator 예시**

```java
@Test
void testIterator2() {
  List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);
  List<Integer> result = new ArrayList<>();

  // Iterator를 통해 앞에서 뒤로 List 조회
  for (Iterator<Integer> it = list.iterator(); it.hasNext(); ) {
    result.add(it.next());
  }

  assertThat(result).containsExactly(1, 2, 3, 4, 5);
}

@Test
void testListIterator() {
  List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);
  List<Integer> result = new ArrayList<>();

  // ListIterator를 통해 뒤에서 앞으로 List 조회
  for (ListIterator<Integer> it = list.listIterator(list.size()); it.hasPrevious(); ) {
    result.add(it.previous());
  }

  assertThat(result).containsExactly(5, 4, 3, 2, 1);
}
```

<br>

## 1.4 List Algorithms

* sort — sorts a List using a merge sort algorithm, which provides a fast, stable sort. (A stable sort is one that does not reorder equal elements.)
* shuffle — randomly permutes the elements in a List.
* reverse — reverses the order of the elements in a List.
* rotate — rotates all the elements in a List by a specified distance.
* swap — swaps the elements at specified positions in a List.
* replaceAll — replaces all occurrences of one specified value with another.
* fill — overwrites every element in a List with the specified value.
* copy — copies the source List into the destination List.
* binarySearch — searches for an element in an ordered List using the binary search algorithm.
* indexOfSubList — returns the index of the first sublist of one List that is equal to another.
* lastIndexOfSubList — returns the index of the last sublist of one List that is equal to another.

<br>

# 2 ArrayList Class

* List Interface의 구현체
* ArrayList에는 초기 용량이라는 튜닝 매개 변수가 하나 있다.
	* 초기 용량은 ArrayList가 초기에 보유할 수 있는 요소의 수를 나타낸다.
* 용량을 초과하는 원소가 들어오면 자동적으로 용량이 늘어난다.

<br>

**ArrayList Class**

* 생성자에서 initialCapacity라는 튜닝 파라미터가 정의되어 있다.

```java
public class ArrayList<E> ...{
  public ArrayList(int initialCapacity) {
    if (initialCapacity > 0) {
      this.elementData = new Object[initialCapacity];
    }
    ...
  }
}
```



**예시**

* 초기 용량이 30인 ArrayList 생성

```java
ArrayList<Integer> integers = new ArrayList<>(30);
```

<br>

# 3 LinkedList Class

* List Interface의 구현체
	* 또한 Queue interface의 구현체이기도 하다.
* LinkedList에는 튜닝 매개 변수가 없다.

<br>

# 4 어떤 구현체를 사용해야 될까?

* 보통 ArrayList가 더 빠르기 때문에 대부분의 경우 ArrayList를 사용하게 될 것이다. 
* LinkedList를 사용하기 전에 performance를 측정하는 편이 좋다.

<br>

**조회 성능**

- ArrayList: O(1)
* LinkedList: O(N)

<br>

**맨 앞의 원소 삽입**

- ArrayList: O(N)
* LinkedList: O(1)

<br>

**순회 도중 원소 삭제 및 삽입**

- ArrayList: O(N)
* LinkedList: O(1)

<br>

**성능 비교 예시**

```java
@Test
void testPerformance() {
  List<String> list1 = new ArrayList<>();
  List<String> list2 = new LinkedList<>();

  long startTime;
  long endTime;

  startTime = System.nanoTime();
  for(int i = 0; i < 10000; i++) list1.add(0, String.valueOf(i));
  endTime = System.nanoTime();
  System.out.println("ArrayList 걸린 시간: " + (endTime - startTime) + " ns");

  startTime = System.nanoTime();
  for(int i = 0; i < 10000; i++) list2.add(0, String.valueOf(i));
  endTime = System.nanoTime();
  System.out.println("LinkedList 걸린 시간: " + (endTime - startTime) + " ns");
}
```

```
ArrayList 걸린 시간: 5335161 ns
LinkedList 걸린 시간: 1938724 ns
```

* List의 앞쪽에 삽입하는 연산은 LinkedList가 더 빠르다

<br>

참고

* https://docs.oracle.com/javase/tutorial/collections/interfaces/list.html
* https://docs.oracle.com/javase/tutorial/collections/implementations/list.html
* 이것이 자바다(이상민 저)