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