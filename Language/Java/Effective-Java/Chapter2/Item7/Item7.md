# 다 쓴 객체 참조를 해제하라

* C나 C++와는 달리, 자바는 가비지 컬렉터(GC)가 다 쓴 객체를 알아서 회수해 준다.
* 메모리 관리에 더 이상 신경 쓰지 않아도 된다고 생각할 수 있으나, 절대 사실이 아니다.



# 1 메모리 누수 예시



**Stack.java**

```java
public class Stack {
  private Object[] elements;
  private int size = 0;
  private static final int DEFAULT_INITIAL_CAPACITY = 16;

  public Stack() {
    this.elements = new Object[DEFAULT_INITIAL_CAPACITY];
  }

  public Stack(int size) {
    this.elements = new Object[size];
  }

  public void push(final Object e) {
    ensureCapacity();
    elements[size++] = e;
  }

  public Object pop() {
    if (size == 0) {
      return null;
    }
    return elements[--size];
  }

  public Object size() {
    return this.elements.length;
  }

  private void ensureCapacity() {
    if (elements.length == size) {
      elements = Arrays.copyOf(elements, (size * 2) + 1);
    }
  }
}
```

- 위 코드는 특별한 문제가 없어 보이고, 테스트를 수행해도 통과할 것이다.
- 하지만 **메모리 누수**라는 문제가 숨어있는데, 이 스택을 오래 실행하다 보면 점차 가비지 컬렉션 활동과 메모리 사용량이 늘어나 결국 성능이 저하될 것이다.
- 심한 경우 디스크 페이징이나 OutOfMemoryError를 일으켜 프로그램이 예기치 않게 종료되기도 한다.



## 1.1 원인

* 위 코드에서 스택이 커졌다가(push), 줄어들때(pop) 스택에서 꺼내진 객체들을 가비지 컬렉터가 회수하지 않는다.
* 스택이 해당 객체들의 다 쓴 참조를 여전히 가지고 있기 때문이다
  * 다 쓴 참조: 앞으로 다시 쓰지 않을 참조
* GC는 Unreachable한 객체를 찾을 수 있지만 Unused 한 객체를 찾을 수 없다
  * 위에 다 쓴 참조가 Unused 한 객체이다
* Unused 한 객체는 프로그램의 논리에 따라 달라지므로 프로그래머는 비즈니스 코드에 주의해야 한다



## 1.2 해결

* 위 문제를 해결하려면 해당 참조를 다 썼을때 null 처리(참조 해제) 하면 된다.

```java
// 기존 pop 메서드
public Object pop() {
  if (size == 0) {
    throw new EmptyStackException();
  }
  return elements[--size];
}

// 수정된 pop 메서드
public Object pop() {
  if (size == 0) {
    throw new EmptyStackException();
  }
  Object result = elements[--size];
  elements[size] = null;
  return result;
}
```



## 1.3 Java의 Stack 클래스

* 실제 Java의 Stack 클래스를 어떻게 구현되어 있을까?



**Stack의 pop 메소드**

```java
public synchronized E pop() {
  E       obj;
  int     len = size();
  obj = peek();
  removeElementAt(len - 1);
  return obj;
}
```



**Stack의 removeElementAt 메소드**

* `elementData[elementCount] = null;` 다 쓴 참조를 해제하고 있는 것을 볼 수 있다

```java
public synchronized void removeElementAt(int index) {
  if (index >= elementCount) {
    throw new ArrayIndexOutOfBoundsException(index + " >= " +
                                             elementCount);
  }
  else if (index < 0) {
    throw new ArrayIndexOutOfBoundsException(index);
  }
  int j = elementCount - index - 1;
  if (j > 0) {
    System.arraycopy(elementData, index + 1, elementData, index, j);
  }
  modCount++;
  elementCount--;
  elementData[elementCount] = null; /* to let gc do its work */
}
```



# 2 메모리 누수 원인



## 2.1 메모리 직접 관리

- Stack 클래스는 왜 메모리 누수에 취약한 걸까?
- 스택이 자기 자신의 메모리를 직접 관리하기 때문
- Stack 클래스는 배열(elements)로 저장소 풀을 만들어 원소들을 관리함
- 배열의 활성 영역부분에 속한 원소들은 사용되고, 비활성 영역은 쓰이지 않는데 문제점은 이러한 비활성 영역을 가비지 컬렉터가 알 방법이 없다는 것
- 보통 자신의 메모리를 직접 관리하는 클래스는 프로그래머가 항상 메모리 누수에 주의해야 한다
- 원소를 사용한 즉시 그 원소가 참조한 객체들을 다 null 처리해줘야 한다



## 2.2 캐시

- 객체 참조를 캐시에 넣고 객체를 다 쓴 이후에도 그냥 두는 경우가 있다.



**해결방법**

* 캐시 외부에서 키(key)를 참조하는 동안만 엔트리가 살아 있는 캐시가 필요한 경우에는 WeakHashMap을 사용하자.
* 엔트리의 유효 기간을 정해두자.
  * 그러나 이 방법은 유효 기간을 계산하는 것이 어렵다.
* 시간이 지날수록 엔트리의 가치를 떨어뜨려 이따금 쓰지 않는 엔트리를 청소하자
  * ScheduledThreadPoolExecutor와 같은 백그라운드 스레드를 활용하거나 캐시에 새 엔트리를 추가할 때 부수 작업으로 수행하는 방법을 이용하면 된다.
  * LinkedHashMap은 removeEldestEntry 메서드를 사용해 후자의 방식으로 처리한다.
* 더 복잡한 캐시를 만들기 위해서는 java.lang.ref 패키지를 직접 활용하면 된다.



## 2.3 콜백

- 콜백이란 이벤트가 발생하면 특정 메소드를 호출해 알려주는 것입니다.(1개)
- 리스너는 이벤트가 발생하면 연결된 리스너(핸들러)들에게 이벤트를 전달합니다.(n개)
- 클라이언트가 콜백을 등록만 하고 해지하지 않는다면 콜백은 쌓이게 될 것이다.
- 이럴 때 콜백을 약한 참조(weak reference)로 저장하면 GC가 즉시 수거해간다.
- 예를 들어 WeakHashMap에 키로 저장해두면 된다.



# 3 결론

- 메모리 누수를 방지하는 방법은 다쓴 객체 참조를 null로 처리하는 것과 지역변수의 범위를 최소화 하는 방법이다.
- 모든 것을 null로 처리한다고 해서 좋은 것은 아니다. 가장 좋은 방법은 지역 변수의 범위를 최소화 하는 방법이다.
- 메모리 누수의 주범은 자기 메모리를 직접 관리하는 경우, 캐시, 리스너, 콜백이다.
- 자기 메모리를 직접 관리하는 클래스라면 프로그래머는 항시 메모리 누수에 주의해야 한다.
- 메모리 누수는 철저한 코드리뷰, 힙 프로파일링 도구를 통해 디버깅을 해야 발견할 수 있기 때문에 메모리 누수를 철저히 신경써야 합니다.