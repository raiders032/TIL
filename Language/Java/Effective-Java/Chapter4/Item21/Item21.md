# 1 인터페이스는 구현하는 쪽을 생각해 설계해라

- 자바 8 이전에는 기존 구현체를 깨뜨리지 않고 인터페이스에 메서드를 추가할 수 없었다.
- 자바 8에서 기존 인터페이스에 메서드를 추가할 수 있도록 디폴트 메서드가 추가되었다.
  - 디폴트 메서드를 선언하면 디폴트 메서드를 재정의하지 않은 모든 클래스에서 디폴트 구현이 쓰이게 된다.
  - 하지만 모든 기존 구현체들과 매끄럽게 연동되리라는 보장은 없다
  - 자바 7까지는 `현재의 인터페이스에 새로운 메서드가 추가될 일은 영원히 없다`라고 가정하고 작성되었기 때문
- 불변식을 해치지 않는 디폴티 메서드를 작성하기란 어렵다.



# 2 예시

- Collection에 추가된 default 메서드를 보면서 왜 불변식을 해치지 않는 디폴티 메서드를 작성하기란 어려운지 알아보자.
- Collection에 추가된 removeIf 메서드는 주어진 predicate가 true를 반환하는 원소를 제거하는 일을 하며 아래와 같이 구현되었을 것이다.

```java
public interface Collection<E> extends Iterable<E> {

	default boolean removeIf(Predicate<? super E> filter) {
		Objects.requireNonNull(filter);
		boolean removed = false;
		final Iterator<E> each = iterator();
		while (each.hasNext()) {
			if (filter.test(each.next())) {
				each.remove();
				removed = true;
			}
		}
		return removed;
	}

}
```



**SynchroziedCollection**

- 아파치 커먼즈 라이브러리 클래스로 클라이언트가 제공한 객체로 락을 거는 능력을 추가 제공한다.
  - 모든 메서드에 락 객체로 동기화한 후 내부 컬렉션 객체에 기능을 위임하는 래퍼클래스다.
  - 따라서 SynchroziedCollection을 통해 콜렉션을 사용하면 Thread Safe하다.
- SynchroziedCollection은 removeIf을 재정의하지 않았다.(최신 버전에서는 재정의 함)
  - 따라서 Collectiond의 removeIf의 디폴트 구현을 물려받는다.
  - removeIf의 디폴트 구현에서는 락을 이용해 동기화하는 로직이 없기 때문에 SynchroziedCollection 인스턴스를 여러 스레드가 공유하는 환경에서 removeIf를 사용하면 **ConcurrentModificationException**이 발생할 수 있다.
- removeIf 디폴트 메서드의 추가로 SynchroziedCollection을 통해 콜렉션을 Thread Safe하게 사용할 수 있는 불변식을 깨졌다.



# 3 결론

- 기존 인터페이스에는 꼭 필요한 경우가 아니면 `디폴트 메서드는 추가하지 않는 것이 좋다`.
- 새로운 인터페이스를 만드는 경우에는 default가 굉장히 유용한 수단이며, 쉽게 구현해 활용할 수 있게 해준다. 
- 하지만 세심한 주의를 기울여서 인터페이스를 설계해야하고, 릴리즈 전 반드시 테스트를 거쳐야한다,