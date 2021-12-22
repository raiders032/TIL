# 1 Deque Interface

* Deque는 Queue와 유사하지만 양쪽 끝에서 삽입과 삭제가 가능한 Collection이다.
* 보통 덱이라고 발음한다.
* Deque는 Stack과 Queue의 추상화된 인터페이스라고 생각할 수 있다.
  * 즉 Deque를 Stack과 Queue를 대신해서 사용하는 것이 가능하다.



## 1.1 [메소드](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Deque.html)

**Insert**

* 원소의 수의 제한이 있는 Deque를 사용해 원소를 삽입 하는 경우 `offerFirst(e)` 와 `offerLast(e)` 를 사용한다.
  * `addFirst(e)`와 `addLast(e)`는 예외를 던지기 때문

**Remove**

* Deque가 비어있는 상태에서 아래 메소드 호출 시
* `removeFirst()`, `removeLast()`  throw `Exception`
* `pollFirst()`,  `pollLast()` return ``NULL`.`

**Retrieve**

* Deque가 비어있는 상태에서 아래 메소드 호출 시
* `getFirst()`, `getLast()` throw an exception
* `peekFirst()`,  `peekLast()` return `NULL`.

**Deque 메소드**

| Type of Operation | First Element (Beginning of the `Deque` instance) | Last Element (End of the `Deque` instance) |
| ----------------- | ------------------------------------------------- | ------------------------------------------ |
| **Insert**        | `addFirst(e)` `offerFirst(e)`                     | `addLast(e)` `offerLast(e)`                |
| **Remove**        | `removeFirst()` `pollFirst()`                     | `removeLast()` `pollLast()`                |
| **Examine**       | `getFirst()` `peekFirst()`                        | `getLast()` `peekLast()`                   |



## 1.2 구현체

* ArrayDeque
* LinkedList



## 1.3 원소 순회

* LinkedList는 iterate하기에 좋은 구조가 아니므로 ArrayDeque를 예시로 들겠다.

### foreach

```java
ArrayDeque<String> aDeque = new ArrayDeque<String>();

. . .
for (String str : aDeque) {
    System.out.println(str);
}
```

### Iterator

```java
ArrayDeque<String> aDeque = new ArrayDeque<String>();
. . .
for (Iterator<String> iter = aDeque.iterator(); iter.hasNext();  ) {
    System.out.println(iter.next());
}
```



# 2 ArrayDeque Class

* ArrayDeque를 size 조절이 가능한 Deque Interface의 구현체이다.
  * 용량 제한이 없다
* 원소로 null을 허용하지 않는다.
* thread-safe하지 않다.
* ArrayDeque를 스택처럼 사용할 때 Stack보다 성능이 좋다.
* ArrayDeque를 큐처럼 사용할 때 LinkedList보다 성능이 좋다.
* 대부분의 오퍼레이션이 O(1) 시간복잡도를 가진다.
  *  remove, removeFirstOccurrence, removeLastOccurrence, contains, iterator.remove() 메소드는 O(N)



# 3 LinkedList Class

* Deque Interface의 구현체
  * List Interface의 구현체이기도 하다
* 원소로 null을 허용한다.
* thread-safe하지 않다.



# 4 어떤 구현체를 사용할까?

* 성능면에서 ArrayDeque가 LinkedList 보다 좋다.
* LinkedList는 iterate하기에 좋은 구조가 아니다.
* LinkedList이 ArrayDeque 보다 메모리를 더 차지한다.



참고

* https://docs.oracle.com/javase/tutorial/collections/interfaces/deque.html
* https://docs.oracle.com/javase/tutorial/collections/implementations/deque.html