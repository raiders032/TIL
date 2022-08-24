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



# 4 Thread 상태

* Thread 객체를 생성하고 start()메소드를 호출하면 바로 실행되는 것처럼 보이지만 사실 대기 상태가 된다.
* 이처럼 Thread는 NEW, RUNNABLE, WATING, TIMED_WAITING, BLOCKED TERMINATED 상태를 가지고 있다



| 상태      | 열거 상수     | 설명                                                         |
| --------- | ------------- | ------------------------------------------------------------ |
| 객체 생성 | NEW           | 스레드 객체가 생성되고 아직 `.start()` 메소드가 호출되지 않은 상태 |
| 실행 대기 | RUNNABLE      | `.start()`가 호출된 후, 스케줄링에 의해 선택될 때까지 실행 대기 |
| 일시 정지 | WATING        | 다른 스레드가 실행 대기 상태로 가라고 명령할 때까지 기다리는 상태 |
| 일시 정지 | TIMED_WAITING | 주어진 시간만큼 대기하고 있는 상태                           |
| 일시 정지 | BLOCKED       | 사용하고자 하는 객체의 락이 풀릴 때까지 기다리는 상태        |
| 종료      | TERMINATED    | 실행을 마친 상태                                             |



**예시**

```java
public class StatePrintThread extends Thread {
	private Thread targetThread;

	public StatePrintThread(Thread targeThread) {
		this.targetThread = targeThread;
	}

	@Override
	public void run() {
		while(true) {
			Thread.State state = targetThread.getState();
			System.out.println("타겟 스레드 상태 : " + state);

			if(state == Thread.State.NEW) {
				targetThread.start();
			}

			if(state == Thread.State.TERMINATED) {
				break;
			}

			try {
				Thread.sleep(500);
			} catch (InterruptedException e) { }
		}
	}
}

public class TargetThread extends Thread {
	@Override
	public void run() {
		for(long i=0; i<1000000000; i++) {}

		try {
			Thread.sleep(1500);
		} catch (InterruptedException e) { }

		for(long i=0; i<1000000000; i++) {}
	}
}

public class ThreadStateExample {
	public static void main(String[] args) {
		StatePrintThread statePrintThread = new StatePrintThread(new TargetThread());
		statePrintThread.start();
	}
}
```



**출력 결과**

```
타겟 스레드 상태 : NEW
타겟 스레드 상태 : RUNNABLE
타겟 스레드 상태 : RUNNABLE
타겟 스레드 상태 : TIMED_WAITING
타겟 스레드 상태 : TIMED_WAITING
타겟 스레드 상태 : TIMED_WAITING
타겟 스레드 상태 : RUNNABLE
타겟 스레드 상태 : RUNNABLE
타겟 스레드 상태 : RUNNABLE
타겟 스레드 상태 : TERMINATED
```



## 4.1 Thread 상태 제어 메소드

* Thread의 메소드를 통해 Thread의 상태를 제어할 수 있다.
* https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/Thread.html



**sleep()**

* `sleep(long millis)`
* 주어진 시간 동안 스레드를 일시 정지 상태로 만든다. 
* 주어진 시간이 지나면 자동적으로 실행 대기 상태가 된다.
* 일시 정지 상태에서 주어진 시간을 다 기다리기 전에 `.interrupt()` 메소드가 호출되면 `InterruptedException`이 발생한다.

```java
import java.awt.Toolkit;

public class SleepExample {
	public static void main(String[] args) {
		Toolkit toolkit = Toolkit.getDefaultToolkit();
		for(int i=0; i<10; i++) {
			toolkit.beep();
			try {
				Thread.sleep(3000);
			} catch (InterruptedException e) { }
		}
	}
}
```



**yield()**

* yield() 메소드를 호출한 스레드는 실행 대기 상태가 되고 우선순위가 동일하거나 높은 다른 스레드에게 실행을 양보한다.
* 스레드에 무의미한 반복이 있는 시점에 .yield() 메소드를 사용하면 성능에 도움이 된다.



**join()**

* ThreadA가 ThreadB의 결과값을 사용할 경우 ThreadA는 ThreadB가 종료될 때 까지 기다려야한다.
* 이러한 경우 ThreadA가 `threadB.join()` 을 호출하면 ThreadB의 run() 메소드가 종료될 때까지 일시정지 상태가 된다. 

```java
public class SumThread extends Thread {
	private long sum;

	public long getSum() {
		return sum;
	}

	public void setSum(long sum) {
		this.sum = sum;
	}

	@Override
	public void run() {
		for(int i=1; i<=100; i++) {
			sum += i;
		}
	}
}

public class JoinExample {
	public static void main(String[] args) {
		SumThread sumThread = new SumThread();
		sumThread.start();

		try {
      // sumThread가 종료될 때가지 메인 스레드를 일시 정지시킴
			sumThread.join();
		} catch (InterruptedException e) { }
		
		System.out.println(sumThread.getSum());
	}
}
```



# 5 Thread Scheduling

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



# 6 Synchronization

* 스레드는 주로 필드 및 오브젝트 참조 필드에 대한 액세스를 공유하여 통신한다.
* 이는 매우 효율적인 방법이지만 **thread interference** 와 **memory consistency errors** 두가지 문제점이 발생할 수 있다.
* 이 문제를 해결하는 것이 Synchronization이다.



## 6.1 Thread Interference

* Thread Interference는 여러 스레드가 공유 변수를 사용할 때 스레드의 실행 순서에 따라 결과 값이 달라지는 상황을 의미한다.
* Thread Interference의 원인
  *  여러 쓰레드가 하나의 공유 변수를 동시에 조작할 때 *interleave*가 발생

**interleave**

* 단일 명령어처럼 보이는 오퍼레이션은 사실 JVM에서는 여러 단계를 거쳐 실행된다.
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



## 6.2 Memory Consistency Errors

* [참고](https://docs.oracle.com/javase/tutorial/essential/concurrency/memconsist.html)



## 6.3 Synchronized Methods

* Java는 동기화 메소드와 동기화 statements 두 가지 기본 동기화 방식을 제공한다.
* 메소드를 동기화하려면 메소드 선언에 synchronized 키워드를 추가한다.
* `synchronized` 키워드를 사용하면 thread interference와 memory consistency errors를 방지할 수 있다.



**Synchronized의 효과**

* 한 스레드가 어떤 객체의 Synchronized 메소드를 호출한 후 다른 스레드가 같은 객체의 임의의 Synchronized 메소드 호출하면 블록된다.
* synchronized 메소드가 종료될 때 자동적으로 happens-before 관계가 성립한다.
  * 동일한 객체에 대해 synchronized 메소드 호출하면 앞선 스레드가 변화시킨 객체의 상태를 뒤에 스레드가 볼 수 있을 때 첫 번째 스레드와 두 번째 스레드가 happens-before 관계라고 한다.



**Synchronized Methods 예시**

```java
public class SynchronizedCounter {
    private int c = 0;

    public synchronized void increment() {
        c++;
    }

    public synchronized void decrement() {
        c--;
    }

    public synchronized int value() {
        return c;
    }
}
```



## 6.4 Intrinsic Locks

* 모든 객체는 intrinsic lock을 가지고 있다. 
* 객체의 필드에 대한 독점적인 접근이 필요한 스레드는 접근하기 전에 객체의 intrinsic lock을 획득하고, 작업이 완료되면 intrinsic lock을 해제해야 한다.
* 스레드는 lock을 획득하고 해제하는 시간 동안  intrinsic lock을 소유한다고 한다.
* 한 스레드가  intrinsic lock을 소유하고 있으면 다른 스레드 intrinsic lock을 획득할 수 없다.
  * 다른 스레드는 lock을 획득하려고 할 때 블록된다.
* 스레드가 lock을 해제하면 그 이후 동일한 lock을 획득하는 스레드와 happens-before 관계가 성립된다.



**Locks In Synchronized Methods**

* 스레드가 synchronized 메소드를 호출할 때 자동으로 메소드의 객체에 대한 intrinsic lock을 획득하고 메소드가 반환될 때 이를 해제한다. 
  * 예외로 인해 return되는 경우에도 lock이 해제된다.
* static 메소드는 객체가 아닌 클래스와 연결되기 때문에 이 경우 스레드는 클래스와 연결된 클래스 객체에 대한 intrinsic lock을 획득한다.
  * 따라서 클래스의 static 필드에 대한 액세스는 클래스의 모든 인스턴스에 대한 lock과 구별되는 lock이다.



## 6.5 Synchronized Statements

* 동기화된 코드를 만드는 또 다른 방법은 Synchronized Statements를 사용하는 것이다
* Synchronized 메소드와 달리 Synchronized Statements는 intrinsic lock을 제공하는 객체를 지정해야한다.



**Synchronized Statements 예시**

```java
public void addName(String name) {
    synchronized(this) {
        lastName = name;
        nameCount++;
    }
    nameList.add(name);
}
```



**concurrency 향상**

* 위에 코드보다 아래의 코드가 동시 실행에 좋다
* c1, c2 필드에 대한 연산 `c1++`, `c2++` 이 interleave 되어도 무관한 상황이라 순전히 lock을 위한 객체를 생성

```java
public class MsLunch {
    private long c1 = 0;
    private long c2 = 0;

    public void inc1() {
        synchronized(this) {
            c1++;
        }
    }

    public void inc2() {
        synchronized(this) {
            c2++;
        }
    }
}
```

```java
public class MsLunch {
    private long c1 = 0;
    private long c2 = 0;
    private Object lock1 = new Object();
    private Object lock2 = new Object();

    public void inc1() {
        synchronized(lock1) {
            c1++;
        }
    }

    public void inc2() {
        synchronized(lock2) {
            c2++;
        }
    }
}
```



참고

* https://docs.oracle.com/javase/tutorial/essential/concurrency/index.html
* 이것이 자바다(이상민 저)
