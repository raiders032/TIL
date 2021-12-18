# 1 Queue Interface

* Queue는 처리할 원소들을 가지고 있는 Collection이다.
* Queue는 일반적으로 FIFO의 형태로 원소가 순서를 가진다.
  * priority queue는 원소의 값에 따라 순서를 가짐
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
  * 오페리이션 실패 시 특정 값 반환
    * `offer(e)` return `false` 
    * `poll()`, `peek()` return `null`
* `offer(e)` 메소드는 bounded queue에 원소를 삽입하가 위해 만들어짐

| Type of Operation | Throws exception | Returns special value |
| ----------------- | ---------------- | --------------------- |
| Insert            | `add(e)`         | `offer(e)`            |
| Remove            | `remove()`       | `poll()`              |
| Examine           | `element()`      | `peek()`              |



참고

* https://docs.oracle.com/javase/tutorial/collections/interfaces/queue.html