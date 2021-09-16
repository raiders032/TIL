# Collection Framework

> 애플리케이션을 개발하다 보면 다수의 객체를 저장해 두고 필요할 때 꺼내서 사용하는 경우가 많이 있다.자바는 자료구조를 바탕으로 객체를 효율적으로 추가, 삭제, 검색할 수 있도록 java.util 패키지에 컬렉션과 관련된 인터페이스와 클래스를 포함시켜 놓앗다. 컬렉션 프레임 워크에 주요 인터페이스에는 `List`, `Set`, `Map` 이 있다.



## List 인터페이스

* 특징
  * 순서를 유지하고 저장
  * 중복 저장 가능
* 구현체
  * ArrayList
  * Vector
  * LinkedList

### ArrayList 클래스

* `List` 인터페이스의 구현 클래스이다.

* 내부 배열에 객체를 저장하고 인덱스로 관리한다.

* `ArrayList` 생성시 저장 용량을 설정할 수 있다.

  * 저장용량을 초과한 객체들이 들어오면 자동적으로 저장 용량이 늘어난다.

  * ```java
    // 저장 용량이 30인 ArrayList 생성
    List<String> list = new ArrayList<String>(30);
    ```

* 빈번한 객체 삭제와 삽입이 일어나는 곳에서는 `ArrayList` 를 사용하지 않는다.

  * 특정 인덱스의 객체를 제거하면 바로 뒤 인덱스부터 마지막 인덱스까지 모두 앞으로 한칸씩 당겨진다.
  * 특정 인덱스의 객체를 추사하면 바로 해당 인덱스부터 마지막 인덱스까지 모두 뒤로 한칸씩 밀려난다.

* 인덱스 검색이나 리스트 마지막에 객체를 추가할 때는 좋은 성능을 발휘한다.



### Vector 클래스

* `List` 인터페이스의 구현 클래스이다.
* `ArrayList`와 동일한 내부 구조를 가지고 있다.
* `ArrayList` 와 차이점은 `vector` 는 동기화된 메소드로 구성되어 있기 때문에 멀티 스레드가 동시에 이 메소드를 실행 할 수 없다. 따라서 `Thread Safe`하다



### LinkedList 클래스

* `List` 인터페이스의 구현 클래스이다.
* `LinkedList` 는 객체를 인접 참조를 링크해서 체인처럼 관리한다.
* 빈번한 객체 삭제와 삽입이 일어나는 곳에서는 `LinkedList` 를 사용한다.
  * 특정 인덱스의 객체를 제거하면 앞뒤 링크만 변경되고 나머지 링크는 변경되지 않는다.
  * 특정 인덱스의 객체를 생성또한 마찬가지다.



## Set 인터페이스

* 특징
  * 순서를 유지하지 않고 저장
  * 중복 저장 안 됨
  
* 구현체
  * HashSet
  * TreeSet
  
* 모든 객체 조회

  * iterator 사용

  * ```java
    Set<String> set = ...;
    Iterator<String> iterator = set.iterator();
    while(iterator.hasNext()){
      String str = iterator.next;
    }
    ```

  * 향상된 for 문 사용

  * ```java
    Set<String> set = ...;
    for(String str:set){
      ...
    }
    ```

### HashSet 클래스

* Set 인터페이스를 구현한 클래스이다.
* HashSet의 중복 판단
  * 객체를 저장하기 전 먼저 객체의 `hasCode()` 메소드를 호출해서 이미 저장된 객체들의 해시코드와 비교한다.
  * 동인한 해시코드가 있다면 다시 `equals()` 메소드로 두 객체를 비교해서 `true` 가 나오면 동일한 객체로 판단한다.



### TreeSet 클래스

> TreeSet은 이진 트리를 기반으로 한 Set 컬렉션이다. 하나의 노드는 노드값인 value와 왼쪽과 오른쪽 자식 노드를 참조하기 위한 두개의 변수로 구성된다.TreeSet에 객체를 저장하면 자동으로 정렬되는데 부모값과 비교해서 작으면 왼쪽 자식 노드에, 높으면 오른쪽 자식 노드에 저장한다.

>  참고
>
> TreeSet의 객체와 TreeMap의 키는 저장과 동시에 자동 오름차순 정렬된다. TreeSet의 객체와 TreeMap은 정렬을 위해 java.lang.Comparable을 구현한 객체를 요구한다. 사용자 정의 클래스를 사용할 경우 java.lang.Comparable의 compareTo()메소드를 오버라이딩 하면 된다.



---



## Map 인터페이스

> Map은 키와 값으로 구성된 Entity 객체를 저장하는 구조를 가지고 있다. 여기서 키와 값은 모두 객체이다. 키는 중복 저장될 수 없지만 값은 중복 저장될 수 있다. 만약 기존에 저장된 키와 동일한 키로 값을 저장하면 기존의 값은 없어지고 새로운 값으로 대치된다.

* 특징
  * 키와 값의 쌍으로 저장
  * 키는 중복 저장이 안 됨
  
* 구현체
  * HashMap
  * HashTable
  * TreeMap
  * Properties
  
* 모든 객체 조회

  * 2가지 방법이 존재

  * ```java
    Map<String,Integer> map = new HashMap<>();
    Iterator<String> iterator = map.keySet().iterator();

    while (iterator.hasNext()){
      String key = iterator.next();
      Integer value = map.get(key);
  }
    ```
    
  * ```java
    Map<String,Integer> map = new HashMap<>();
    Set<Map.Entry<String, Integer>> entries = map.entrySet();
  Iterator<Map.Entry<String, Integer>> iterator = entries.iterator();
    
    while (iterator.hasNext()){
      Map.Entry<String, Integer> entry = iterator.next();
      String key = entry.getKey();
      Integer value = entry.getValue();
    }
    ```
    
    
    



### HashMap 클래스

* Map 인터페이스를 구현한 클래스
* HashMap의 키로 사용할 객체는 `hasCode()` 와  `equals()` 메소드를 재정의해서 동등 객체가 될 조건을 정해야한다.
* 주로 키 타입은 `String` 을 많이 사용하는데 문자열이 같을 경우 동등 객체가 될 수 있도록 `hasCode()` 와  `equals()` 메소드가 재정의되어 있다.
* 키와 값의 타입은 기본 타입을 사용할 수 없고 클래스 및 인터페이스 타입만 가능하다.



### HashTable 클래스

* `HashMap` 과  동일한 내부 구조를 가지고있다. 
* `HashMap` 과  차이점:  `HashTable  `은 동기화된 메소드로 구성되어 있기 때문에 멀티 스레드가 동시에 이 메소드를 실행 할 수 없다. 따라서 `Thread Safe`하다



### TreeMap 클래스

> TreeMap은 이진 트리를 기반으로 한 Map 콜렉션이다. TreeMap에 객체를 저장하면 자동으로 정렬되는데, 기본적으로 부모 키값과 비교해서 키 값이 낮은 것은 왼쪽 자식노드에, 키 값이 높은 것은 오른쪽 자식 노드에 객체를 저장한다.

> 참고
>
> TreeSet의 객체와 TreeMap의 키는 저장과 동시에 자동 오름차순 정렬된다. TreeSet의 객체와 TreeMap은 정렬을 위해 java.lang.Comparable을 구현한 객체를 요구한다. 사용자 정의 클래스를 사용할 경우 java.lang.Comparable의 compareTo()메소드를 오버라이딩 하면 된다.
>
> java.lang.Comparable 비구현 객체를 정렬하려면 정렬자(Comparator)를 제공하면 된다. 정렬자는 Comparator 인터페이스를 구현한 객체를 말한다.



## Stack 클래스

> 컬렉션 프레임워크는 LIFO 자료구조를 제공하는 스택 클래스가 있다. LIFO(Last In First Out)은 나중에 넣은 객체가 먼저 빠져나가는 자료구조를 말한다.

| Modifier and Type | Method             | Description                                                  |
| :---------------- | :----------------- | :----------------------------------------------------------- |
| `boolean`         | `empty()`          | Tests if this stack is empty.                                |
| `E`               | `peek()`           | Looks at the object at the top of this stack without removing it from the stack. |
| `E`               | `pop()`            | Removes the object at the top of this stack and returns that object as the value of this function. |
| `E`               | `push(E item)`     | Pushes an item onto the top of this stack.                   |
| `int`             | `search(Object o)` | Returns the 1-based position where an object is on this stack. |



## Queue 인터페이스

> 컬렉션 프레임워크는 FIFO 자료구조를 제공하는 큐 인터페이스가 있다. FIFO(First In First Out)은 먼저 넣은 객체가 먼저 빠져나가는 자료구조를 말한다.

| Modifier and Type | Method       | Description                                                  |
| :---------------- | :----------- | :----------------------------------------------------------- |
| `boolean`         | `add(E e)`   | Inserts the specified element into this queue if it is possible to do so immediately without violating capacity restrictions, returning `true` upon success and throwing an `IllegalStateException` if no space is currently available. |
| `E`               | `element()`  | Retrieves, but does not remove, the head of this queue.      |
| `boolean`         | `offer(E e)` | Inserts the specified element into this queue if it is possible to do so immediately without violating capacity restrictions. |
| `E`               | `peek()`     | Retrieves, but does not remove, the head of this queue, or returns `null` if this queue is empty. |
| `E`               | `poll()`     | Retrieves and removes the head of this queue, or returns `null` if this queue is empty. |
| `E`               | `remove()`   | Retrieves and removes the head of this queue.                |