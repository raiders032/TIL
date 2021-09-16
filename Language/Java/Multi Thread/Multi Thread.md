# Multi Thread



# 1. Process와 Thread

**Process**

* 프로세스는 독립적이기 때문에 하나의 프로세스에서 오류가 발생해도 다른 프로세스에 영향을 미치지 않는다

**Thread**

* 스레드는 사전적 의미로 한 가닥의 실이라는 뜻이다
* 한 가지 작업을 위해 실행하기 위해 순차적으로 실행할 코드를 실처럼 이어 놓았다고 해서 유래된 이름이다
* 스레드는 하나의 프로세스 내부에 생성되기 때문에 하나의 스레드가 예외를 발생시키면 프로세스 자체가 종료될 수 있어 다른 스레드에 양향을 미칠 수 있다



# 2. Main Thread

* 모든 자바 애플리케이션은 메인 스레드가 main() 메소드를 실행하면서 시작한다
* 싱글 스레드 애플리케이션은 메인 스레드가 종료하면 프로세스도 종료된다
* 멀티 스레드 애플리케이션은 실행 중인 스레드가 하나라도 있으면 프로세스가 종료되지 않는다
  * 메인 스레드가 종료되고 작업 스레드가 실행중인 경우 포함



# 3. Thread 생성 및 실행

* 자바에서는 작업 스레드도 객체로 생성된다
* `java.lang.Thread` 클래스를 객체화해서 사용해도 되고 `java.lang.Thread` 클래스를 상속한 하위 클래스를 만들어 생성할 수 있다



## 3.1 Thread 클래스로 생성

* 작업 스레드는 생성되는 즉시 실행되는 것이 아니라 `start()` 메소드를 호출하면 실행된다
  * `start()`가 호출되면 매개값으로 받은 `Runnable`의 `run()` 메소드를 실행하면서 자신의 작업을 처리한다

```java
// 작업 Thread 생성
Thread thread = new Thread(Runnable target);

// 작업 Thread 실행
thread.start();
```



**Runnable 인터페이스**

* `Runnable`은 작업 스레드가 실행할 수 있는 코드를 가지고 있는 객체라고 해서 붙여진 이름이다
* `Runnable`은 인터페이스 타입이기 때문에 구현 객체를 만들어 대입해야 한다

```java
@FunctionalInterface
public interface Runnable {
    public abstract void run();
}
```



**Runnable 인터페이스를 구현 방식**

```java
public class ImplementRunnable implements Runnable{
    @Override
    public void run() {
        System.out.println("ImplementRunnable.run");
    }
}
```

```java
public class Main {

    public static void main(String[] args) {
        ImplementRunnable task = new ImplementRunnable();
      	// 작업 Thread 생성
        Thread thread = new Thread(task);
      	// 작업 Thread 실행
        thread.start();
    }
}
```

**Runnable 익명 구현 객체 사용하는 방식**

```java
public class Main {
    public static void main(String[] args) {
      	// 작업 Thread 생성
        Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("Main.run");
            }
        });
      	// 작업 Thread 실행
        thread.start();
    }
}
```

**Runnable 익명 구현 객체 사용하는 방식: 람다식 이용**

```java
public class Main {
    public static void main(String[] args) {
      	// 작업 Thread 생성
        Thread thread = new Thread(() -> System.out.println("Main.run"));
      	// 작업 Thread 실행
        thread.start();
    }
}
```

