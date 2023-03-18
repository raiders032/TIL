# finalizer와 cleaner 사용을 피하라



# 1 자바의 객체 소멸자

- 자바는 두 가지 객체 소멸자를 제공한다.
  - finalizer
  - cleaner




# 2 finalizer

- finalizer는예측할 수 없고, 상황에 따라 위험할 수 있어 일반적으로 불필요하다.
- **finalizer는 나름의 쓰임새가 있기는 하지만 기본적으로 쓰지 말아야 한다.**
- 자바 9에서는 finalizer를 deprecated API로 지정했다.



# 3 cleaner

-  finalizer보다 덜 위험하지만, 여전히 예측할 수 없고, 느리고 일반적으로 불필요하다.



# 4 finalizer와 cleaner를 지양하는 이유

- finalizer와 cleaner는 즉시 수행된다는 보장이 없다.
- 객체에 접근할 수 없게 된 후 finalizer나 cleaner가 실행되기 까지 얼마나 걸릴지 알 수 없다.
- 예를 들어 파일 닫기를 finalizer나 cleaner에 맡기면 언제 파일을 닫는지 알 수 없으므로 시스템이 동시에 열 수 있는 파일 개수에 한계 때문에 중대한 오류가 발생할 수 있다.
- finalizer나 cleaner의 수행 여부조차 보장하지 않는다.
  - 상태를 영구적으로 수정하는 작업에서는 절대 finalizer나 cleaner에 의존해서는 안 된다.
  - 데이터베이스 같은 공유 자원의 영구 락을 해제하는 로직을 finalizer나 cleaner에 작성하면 수행 여부를 보장하지 않기 때문에 분산 시스템 전체가 멈출 수 있다.
- finalizer나 cleaner는 심각한 성능 문제를 동반한다.



**finalizer**

- finalizer 쓰레드는 다른 애플리케이션 쓰레드보다 우선 순위가 낮아서 실행될 기회를 제대로 얻지 못할 수 있다.
- 자바 언어 명세에 어떤 쓰레드가 finalizer를 수행할 지 명시하지 않았다.
- 따라서 이 문제를 예방할 보편적인 방법이 없다.
- 그러므로 finalizer를 사용하면 안된다.
- finalizer의 동작 중 발생한 예외는 무시되며 처리할 작업이 남아있어도 그 순간 종료된다.
- finalizer 공격에 노출되어 심각한 보안 문제를 일으킬 수 있다.



**cleaner**

- 자신을 수행할 스레드를 제어할 수 있다는 면에서 조금 낫다
- 하지만 여전히 백그라운드에서 실행되며 가비지 콜렉터의 통제하에 있어 언제 수행되는지 알 수 없다.



# 5 AutoCloseable

- AutoCloseable은 finalizer나 cleaner를 대신해줄 묘안이다.



## 이렇게 지양하는데 왜 finalizer와 cleaner가 있는건데?

1. 자원의 소유자가 close 메서드를 호출하지 않는 것에 대비한 안전망 역할
2. 네이티브 피어를 회수하기 위해서이다. 왜냐하면 네이티브 피어는 자바 객체가 아니기 때문에 가비지 컬렉터에서 회수하지 못하기 때문이다.

- 즉시 자원을 회수해야 한다면 close 메서드를 사용해야한다.



## finalizer나 cleaner를 대신해줄 묘안은 무엇일까?

1. **AutoCloseable을 구현해주고, 클라이언트에서 인스턴스를 다 쓰고 나면 close 메서드를 호출해주면 된다.**
2. **AutoCloseable에서 Cleaner를 사용하여 해주는 경우, try-with-resources을 사용하자.**



## 책 예제

```
import java.lang.ref.Cleaner;  
  
public class Room implements AutoCloseable {  
  
      private static final Cleaner cleaner = Cleaner.create();  
      
      private static class State implements Runnable {  
      int numJunkpiles;  
      
      State(int numJunkpiles) {  
	      this.numJunkpiles = numJunkpiles;  
      }  
      
      @Override  
      public void run() {  
	      System.out.println("방 청소");  
	      numJunkpiles = 0;  
      }  
     }  
     private final State state;  
     private final Cleaner.Cleanable cleanable;  
      
     public Room(int numJunkpiles) {  
      state = new State(numJunkpiles);  
      cleanable = cleaner.register(this, state);  
      }  
      
      @Override  
      public void close() throws Exception {  
      cleanable.clean();  
      }  
}

public class main {  
  public static void main(String[] args) throws Exception {  
      try (Room myRoom = new Room(7)) {
	      System.out.println("안녕~");
	  }
	  new Room(99);
	  System.out.println("아무렴~");
  }
```

결과 :

```
안녕~
방청소
아무렴
```