# 1 Queue Interface

* Queue는 처리할 원소들을 가지고 있는 Collection이다.
* Queue는 일반적으로 FIFO의 형태로 원소가 순서를 가진다.
  * PriorityQueue는 원소의 값에 따라 순서를 가짐
* `java.util.concurrent` 의 Queue 몇몇 구현체들은 원소의 수를 제한함
  * 이러한 Queue를 bounded Queue라고 한다.
  * `java.util`의 Queue 구현체들은 제한 없음



## 1.1 메소드

* Collection이 제공하는 기능에 추가적인 삽입, 삭제, 조회 기능을 제공한다.



**Queue Interface**

```java
public interface Queue<E> extends Collection<E> {
    E element();
    boolean offer(E e);
    E peek();
    E poll();
    E remove();
}
```



**Queue의 메소드**

* Queue의 메소드는 두 가지의 형태
  * 오퍼레이션 실패 시 예외 발생
    * `add(e)`, `remove()`, `element()`
  * 오페리이션 실패 시 특정 값 반환
    * `offer(e)` return `false` 
    * `poll()`, `peek()` return `null`
* `offer(e)` 메소드는 bounded queue에 원소를 삽입하가 위해 만들어짐

| Type of Operation         | Throws exception | Returns special value |
| ------------------------- | ---------------- | --------------------- |
| 원소 삽입                 | `add(e)`         | `offer(e)`            |
| 헤드 원소를 삭제하고 반환 | `remove()`       | `poll()`              |
| 헤드 원소를 반환          | `element()`      | `peek()`              |



## 1.2 구현체

* [LinkedList](#2-linkedlist-class)
* [PriorityQueue](#3-priorityqueue-class)



# 2 LinkedList Class

* Queue Interface의 구현체
  * List Interface의 구현체이기도 하다



# 3 PriorityQueue Class

* 우선순위 heap 자료구조를 이용한다.
* PriorityQueue의 원소들은 자연스러운 순서를 가지고 있다.
  * 자연스러운 순서란 원소가 구현한 Comparable에 명시된 원소의 순서이다.
  * 원소가 Comparable를 구현하지 않았거나 자연스러운 순서를 대신한 임의의 순서를 사용하고 싶은 경우 PriorityQueue 생성 시 Comparator를 제공한다.
  * [Comparable-Comparator.md](../../Comparable-Comparator/Comparable-Comparator.md)
* 순서를 비교할 수 없는 객체를 삽입하면 ClassCastException 예외 발생
* 원소로 null을 허용하지 않는다.



참고

* https://docs.oracle.com/javase/tutorial/collections/interfaces/queue.html
* https://docs.oracle.com/javase/8/docs/api/java/util/PriorityQueue.html