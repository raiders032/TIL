# 1 Collection

* 컬렌션은 객체의 그룹을 나타낸다. 여기서 객체를 요소라고 부른다.
* 컬렉션은 주로 일반적인 요소의 그룹을 넘겨줄 때 사용된다.



아래와 같이 컬렉션 구현체들은 Collection 타입의 파라미터가 있는 생성자를 가지고 있다.

```java
public class ArrayList<E> ... {
  public ArrayList(Collection<? extends E> c) {}
}
```

```java
Collection<String> c = ...;
// c의 모든 요소를 가진 새로운 ArrayList를 만들기
List<String> list = new ArrayList<>(c);
```



# 2 [Collection 메소드](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Collection.html)

| Modifier and Type        | Method                                  | Description                                                  |
| :----------------------- | :-------------------------------------- | :----------------------------------------------------------- |
| `boolean`                | `add(E e)`                              | Ensures that this collection contains the specified element (optional operation). |
| `boolean`                | `addAll(Collection<? extends E> c)`     | Adds all of the elements in the specified collection to this collection (optional operation). |
| `void`                   | `clear()`                               | Removes all of the elements from this collection (optional operation). |
| `boolean`                | `contains(Object o)`                    | Returns `true` if this collection contains the specified element. |
| `boolean`                | `containsAll(Collection<?> c)`          | Returns `true` if this collection contains all of the elements in the specified collection. |
| `boolean`                | `equals(Object o)`                      | Compares the specified object with this collection for equality. |
| `int`                    | `hashCode()`                            | Returns the hash code value for this collection.             |
| `boolean`                | `isEmpty()`                             | Returns `true` if this collection contains no elements.      |
| `Iterator<E>`            | `iterator()`                            | Returns an iterator over the elements in this collection.    |
| `default Stream<E>`      | `parallelStream()`                      | Returns a possibly parallel `Stream` with this collection as its source. |
| `boolean`                | `remove(Object o)`                      | Removes a single instance of the specified element from this collection, if it is present (optional operation). |
| `boolean`                | `removeAll(Collection<?> c)`            | Removes all of this collection's elements that are also contained in the specified collection (optional operation). |
| `default boolean`        | `removeIf(Predicate<? super E> filter)` | Removes all of the elements of this collection that satisfy the given predicate. |
| `boolean`                | `retainAll(Collection<?> c)`            | Retains only the elements in this collection that are contained in the specified collection (optional operation). |
| `int`                    | `size()`                                | Returns the number of elements in this collection.           |
| `default Spliterator<E>` | `spliterator()`                         | Creates a [`Spliterator`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Spliterator.html) over the elements in this collection. |
| `default Stream<E>`      | `stream()`                              | Returns a sequential `Stream` with this collection as its source. |
| `Object[]`               | `toArray()`                             | Returns an array containing all of the elements in this collection. |
| `default <T> T[]`        | `toArray(IntFunction<T[]> generator)`   | Returns an array containing all of the elements in this collection, using the provided `generator` function to allocate the returned array. |
| `<T> T[]`                | `toArray(T[] a)`                        | Returns an array containing all of the elements in this collection; the runtime type of the returned array is that of the specified array. |



# 3 Collection 순차 조회

* Collection을 순차 조회하는 3가지 방법이 있다.
  * aggregate operation 사용, for-each 사용, `Iterator` 사용



## 3.1 Aggregate Operations

* 자바8 이상부터 선호되는 방식
* Collection으로 부터 스트림을 얻어 aggregate operation을 수행한다.
* aggregate operation은 주로 람다식으로 표현됨
* 즉 스트림을 통해 원소 하나하나에 람다식을 적용한다고 생각할 수 있다.



**예시**

```java
@Test
void testCollection() {
  Shape redShape = new Shape(Color.RED, "red");
  Shape greenShape = new Shape(Color.GREEN, "green");
  Shape blueShape = new Shape(Color.BLUE, "blue");
  
  Collection<Shape> shapes = Arrays.asList(redShape, greenShape, blueShape);
  
  shapes.stream()
    .filter(e -> e.getColor() == Color.RED)
    .forEach(e -> System.out.println(e.getName()));
}
```

```
red
```



**예시 2**

```java
@Test
void testCollection2() {
  Shape redShape = new Shape(Color.RED, "red");
  Shape greenShape = new Shape(Color.GREEN, "green");
  Shape blueShape = new Shape(Color.BLUE, "blue");

  Collection<Shape> shapes = Arrays.asList(redShape, greenShape, blueShape);

  String result = shapes.stream()
    .map(e -> e.getName())
    .collect(Collectors.joining(", "));

  Assertions.assertThat(result).isEqualTo("red, green, blue");
}
```



## 3.2 for-each 사용

* 향상된 for문 사용 가능



**예시**

```java
@Test
void testForEach() {
  Shape redShape = new Shape(Color.RED, "red");
  Shape greenShape = new Shape(Color.GREEN, "green");
  Shape blueShape = new Shape(Color.BLUE, "blue");

  Collection<Shape> shapes = Arrays.asList(redShape, greenShape, blueShape);

  for (Shape shape : shapes) {
    System.out.println(shape.getName());
  }
}
```

```
red
green
blue
```



## 3.3 Iterator 사용

* Iterator는 컬렉션의 원소를 하나씩 조회하거나 삭제할 수 있게 해주는 객체이다.
* Collection의 iterator()를 호출해 Iterator를 얻을 수 있다.
  * `Iterator<Shape> iterator = collection.iterator();`



**Collection 인터페이스**

* Iterable 인터페이스를 상속받음

```java
package java.util;

public interface Collection<E> extends Iterable<E> {
	... 
}
```



**Iterable 인터페이스**

* Iterable 인터페이스의 iterator() 메소드를 통해  Iterator를 얻을 수 있다.

```java
public interface Iterable<T> {
  Iterator<T> iterator();
  
	default void forEach(Consumer<? super T> action) {
        Objects.requireNonNull(action);
        for (T t : this) {
            action.accept(t);
        }
    }
}
```



**Iterator 인터페이스**

* remove 메소드는 next 메소드로 조회한 가장 최근 원소를 제거한다.
  * 따라서 next 메소드 실행 후 최대 한번 실행 가능하고 remove 메소드를 두번 연속 실행하면 예외가 발생한다.

```java
public interface Iterator<E> {
  boolean hasNext();
  E next();
  void remove(); //optional
}
```



**예시**

```java
@Test
void testIterator() {
  Shape redShape = new Shape(Color.RED, "red");
  Shape greenShape = new Shape(Color.GREEN, "green");
  Shape blueShape = new Shape(Color.BLUE, "blue");

  Collection<Shape> collection = Arrays.asList(redShape, greenShape, blueShape);
  Iterator<Shape> iterator = collection.iterator();

  while (iterator.hasNext()) {
    Shape shape = iterator.next();
    System.out.println(shape.getName());
  }
}
```

```
red
green
blue
```



**Iterator가 유용한 경우**

* Iterator가 for-each보다 유용한 경우는 바로 필터링이다.
* for-each 문은 iterator를 숨겼기 때문에 원소를 제거하는 것이 불가능하다
* 아래의 예시는 특정 조건을 만족하지 못하면 컬렉션에서 원소를 제거하는 코드이다.

```java
static void filter(Collection<?> c) {
  for (Iterator<?> it = c.iterator(); it.hasNext(); )
    if (!cond(it.next()))
      it.remove();
}
```



참고

* https://docs.oracle.com/javase/tutorial/collections/interfaces/collection.html