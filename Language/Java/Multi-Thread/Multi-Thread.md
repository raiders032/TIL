# 1 Multi Thread



# 2 Process와 Thread

## 2.1 Process

* **프로세스**란 실행 중인 프로그램이다
* 프로세스는 종종 프로그램 또는 애플리케이션과 동의어로 간주된다.
  * 그러나 사용자가 단일 애플리케이션으로 인식하는 것은 사실 협력 프로세스 집합일 수 있다.
  * 프로세스 간 통신(IPC)를 통해 프로세스 집합은 서로 통신한다.

* 프로세스는 독립적이기 때문에 하나의 프로세스에서 오류가 발생해도 다른 프로세스에 영향을 미치지 않는다
* [Process.md](../../../Computer-Science/OS/Process/Process.md)



## 2.2 Thread

* 스레드는 사전적 의미로 한 가닥의 실이라는 뜻이다
* 스레드는 경량 프로세스(lightweight processes)라고도 한다. 
* 프로세스와 스레드는 모두 실행 환경을 제공하지만, 새 스레드를 만드는 것은 새 프로세스를 만드는 것보다 더 적은 리소스를 필요로 한다.
* 스레드는 프로세스 내에 존재하며, 모든 프로세스에는 하나 이상의 쓰레드가 있다.
  * 하나의 스레드가 예외를 발생시키면 프로세스 자체가 종료될 수 있어 다른 스레드에 양향을 미칠 수 있다
  * 따라서 멀티 스레드에서는 예외 처리를 잘 해야한다.
  * 스레드는 메모리 및 열린 파일을 포함하여 프로세스의 리소스를 공유합니다. 
    * 이로 인해 효율적이지만 잠재적으로 동시성 문제가 발생할 수 있다.

* [Threads.md](../../../Computer-Science/OS/Threads/Threads.md)



# 3 Main Thread

* 모든 자바 애플리케이션은 메인 스레드가 main() 메소드를 실행하면서 시작한다
* 싱글 스레드 애플리케이션은 메인 스레드가 종료하면 프로세스도 종료된다
* 멀티 스레드 애플리케이션은 실행 중인 스레드가 하나라도 있으면 프로세스가 종료되지 않는다
  * 메인 스레드가 종료되고 작업 스레드가 실행중인 경우 포함
* 메인 스레드는 필요에 따라 **작업 스레드를 만들어 병렬로 코드를 실행**한다.



# 3. Thread 생성 및 실행

* 자바에서는 작업 스레드도 객체로 생성된다
* Thread 객체 생성 방법
  1. `java.lang.Thread` 클래스를 객체화해서 사용
  2. *executor* 를 사용



## 3.1 Thread 클래스로 생성

* 작업 스레드 생성시 스레드가 실행할 코드를 제공해야 한다.
  * 스레드 생성시 생성자의 인자로 Runnable 인터페이스의 구현체가 들어간다.
  * 스레드는 Runnable 인터페이스를 구현한 구현체의 run()메소드를 실행한다.
  * 따라서 작업 스레드를 통해 실행하고자 하는 코드를 Runnable 인터페이스를 구현한 구현체의 run()메소드에 작성하면 된다.

* 작업 스레드는 생성되는 즉시 실행되는 것이 아니라 `start()` 메소드를 호출하면 실행된다
  * `start()`가 호출되면 매개값으로 받은 `Runnable`의 `run()` 메소드를 실행하면서 자신의 작업을 처리한다

```java
// 작업 Thread 생성
Thread thread = new Thread(Runnable target);

// 작업 Thread 실행
thread.start();
```



### 3.1.1 Runnable 인터페이스

* `Runnable`은 인터페이스 하나의 추상 메소드를 가지고 있다
  * 이 메소드가 **스레드가 실행할 코드를 의미**한다.
* `Runnable`을 구현한 객체가 Thread 생성자의 인자로 들어간다.

```java
@FunctionalInterface
public interface Runnable {
    public abstract void run();
}
```



**Runnable 인터페이스를 직접 구현하는 방식**

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

* [익명 구현 객체(Anonymous Class) 참고](../Anonymous-Class/Anonymous-Class.md) 

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

* `Runnable`은 인터페이스는 Functional Interface이기 때문에 람다 표현식을 사용할 수 있다

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



### 3.1.2 Thread 하위 클래스로부터 생성

* 작업 스레드가 실행할 작업을 Runnable로 만들지 않고, Thread의 하위 클래스로 작업 스레드를 정의하면서 작업 내용을 포함시킬 수도 있다. 
* Thread 클래스를 상속한 후 run 메소드를 overriding해서 스레드가 실행할 코드를 작성하면 된다.



**하위 클래스 직접 생성**

```java
public class WorkerThread extends Thread {
  @Override
  public void run() {
      //스레드가 실행할 코드
  }
}
```



**익명 구현 객체 이용**

```java
Thread thread = new Thread() {
  public void run() {
      //스레드가 실행할 코드
  }
}
```



**스레드 실행**

```java
thread.start()
```



# 4 Thread Scheduling

* Thread Scheduling은 스레드의 개수가 코어의 수보다 많을 경우 **스레드를 어떤 순서에 의해 동시성으로 실행**할 것인가 결정하는 것
* 멀티 스레드
  * **동시성(Concurrency):** 하나의 코어에서 멀티 스레드가 번갈아가며 실행하는 성질
  * **병렬성(Parallelism)**: 멀티 코어에서 개별 스레드를 동시에 실행하는 성질
* 자바의 스레드 스케줄링은 우선순위 방식과 round robin방식을 사용한다.
  * 우선순위 방식
    * 우선순위가 높은 스레드가 실행 상태를 더 많이 가져감
    * 스레드에 우선순위를 부여할 수 있다.
    * 우선순위는 1~10, 10이 가장 높은 우선순위
    * 우선순위 기본값은 5
    * `thread.setPriority(10)` : 스레드에 우선순위 10 부여
  * round robin방식
    * 시간 할당량 만큼 스레드를 실행하고 다시 다른 스레드를 실행하는 방식
    * JVM에 의해서 순서가 정해져 코드로 제어 불가

# 5 Synchronization

* 스레드는 주로 필드 및 오브젝트 참조 필드에 대한 액세스를 공유하여 통신한다.
* 이는 매우 효율적인 방법이지만 **thread interference** 와 **memory consistency errors** 두가지 문제점이 발생할 수 있다.
* 이 문제를 해결하는 것이 Synchronization이다.



## 5.1 Thread Interference

* Thread Interference는 여러 스레드가 공유 변수를 사용할 때 스레드의 실행 순서에 따라 결과 값이 달라지는 상황을 의미한다.
* Thread Interference의 원인
  *  여러 쓰레드가 하나의 공유 변수를 동시에 조작할 때 *interleave*가 발생

**interleave**

* 단일 명령어처럼 보이는 오퍼레이션이 JVM에서는 여러 단계를 거쳐 실행된다.
* 두개의 스레드가 공유 변수를 동시에 조작에 오퍼레이션의 단계들이 서로 포개지는 현상을 **interleave**라 한다.



**Counter.java**

```java
class Counter {
    private int c = 0;

    public void increment() {
        c++;
    }

    public void decrement() {
        c--;
    }

    public int value() {
        return c;
    }

}
```



**interleave 예시**

```java
public void increment() {
  c++;
}
```

* 위에 `c++;` 은 단일 오퍼레이션 처럼 보이지만 아래와 같은 단계로 구성되어 있다.
  1. c의 현재 값을 읽는다.
  2. 검색된 값을 1씩 증가시킵니다.
  3. 증가된 값을 다시 c에 저장합니다.
* `c--;` 도 위와 비슷하다
* ThreadA와 ThreadB가 각각 increment()와 decrement()를 호출한다고 해보자
  1. ThreadA: c를 읽는다. (c == 0)
  2. ThreadB: c를 읽는다. (c == 0)
  3. ThreadA: 읽은 값을 1 증가시킨다. (c == 1)
  4. ThreadB: 읽은 값을 1 감소시킨다. (c == -1)
  5. ThreadA: 결과를 c에 저장합니다. (c == 1)
  6. ThreadB: 결과를 c에 저장합니다. (c == -1)
* 우리가 원하는 최종 결과는 c == 0 이지만 오퍼레이션의 단계들이 interleave되면서 결과는 c == -1이 되었다.



## 5.2 Memory Consistency Errors

* [참고](https://docs.oracle.com/javase/tutorial/essential/concurrency/memconsist.html)



## 5.3 Synchronized Methods



참고

* https://docs.oracle.com/javase/tutorial/essential/concurrency/index.html
* 이것이 자바다(이상민 저)
