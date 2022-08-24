# 1 Thread Pool

* 큰 애플리케이션에서는 스레드의 생성과 관리를 직접하는 것이 아니라 ExecutorService를 통해 스레드를 관리하는 것이 좋다.
* 또한 잠깐의 병렬 작업 폭증으로 인한 스레드의 폭증을 막으려면 스레드풀을 사용해야 한다.
  * 병렬 처리 작업이 많아지면 스레드 개수가 증가되고 그에 따른 생성과 스케줄링으로 인해 성능이 저하된다.
* 스레드풀은 작업 처리에 사용되는 스레드를 제한된 개수만큼 정해놓고 작업 큐에 들어오는 작업들을 하나씩 스레드가 맡아 처리한다.
* 작업이 끝난 스레드는 다시 작업 큐에서 새로운 작업을 가져와 처리한다.
* 자바는 스레드풀을 생성하고 사용할 수 있도록 java.util.concurrent 패키지에서 ExecutorService 인터페이스와 Executors 클래스를 제공한다.



## 1.1 ExecutorService의 이점

- 자바 프로그래머가 태스크 제출과 실행을 분리할 수 있는 기능을 제공한다.
- 즉 스레드의 생성과 관리를 직접하는 것이 아니라 ExecutorService를 통해 스레드를 관리하는 것이 좋다.



# 2 Thread Pool 생성

* Executors로 ExecutorService의 구현 객체 만들기
* Executors의 다양한 정적 메소드로 ExecutorService의 구현 객체를 만들 수 있는데 이것이 바로 스레드 풀이다



**Executors의 정적 메소드**

| 메소드              | 초기 스레드 수 | 코어 스레드 수 | 최대 스레드 수    |
| ------------------- | -------------- | -------------- | ----------------- |
| newCachedThreadPool | 0              | 0              | Integer.MAX_VALUE |
| newFixedThreadPool  | 0              | nThreads       | nThreads          |



## 2.1 newCachedThreadPool

* 초기 스레드 개수와 코어 스레드 개수가 0이고 스레드 개수보다 작업 개수가 많으면 새 스레드를 생성시켜 작업을 처리한다.
* 이론적으로 int의 최대값만큼 스레드가 추가되지만 운영체제 성능에 따라 다르다
* 1개 이상의 스레드가 추가되었을 경우 60초 동안 추가된 스레드가 아무 작업을 하지 않으면 추가된 스레드를 종료하고 풀에서 제거한다.

```java
ExecutorService executorService = Executors.newCachedThreadPool();
```



## 2.2 newFixedThreadPool

* 초기 스레드 개수는 0개이다
* 코어 스레드 수는 nThreads이다
* 스레드 개수보다 작업 개수가 많으면 새 스레드를 생성시키고 작업을 처리한다
* 최대 스레드 개수는 nThreads이다 
* 이 스레드 풀은 스레드가 작업을 처리하지 않고 놀고 있더라도 스레드 개수가 줄지 않는다

```java
public static ExecutorService newFixedThreadPool(int nThreads){
  ...
}
```

```java
// CPU 코어의 수만큼 최대 스레드를 사용하는 스레드 풀을 새성하는 예제
Executors.newFixedThreadPool(
  Runtime.getRuntime().availableProcessors()
);
```



# 3 Thread Pool 종료

* 스레드 풀의 스레드는 기본적으로 데몬 스레드가 아니기 때문에 main 스레드가 종료되더라도 작업을 처리하기 위해 계속 실행 상태로 남아있다.
  * 그래서 main() 메소드가 실행이 끝나도 애플리케이션 프로세스는 종료되지 않는다
* 애플리케이션을 종료하려면 스레드풀을 종료시켜 스레드들이 종료 상태가 되도록 처리해야한다.

**ExecutorService 인터페이스**

| 리턴 타입      | 메소드                                        | 설명                                                         |
| -------------- | --------------------------------------------- | ------------------------------------------------------------ |
| void           | shutdown()                                    | 현재 처리 중인 작업뿐만 아니라 작업 큐에 대기하고 있는 모든 작업을 처리한 뒤에 스레드풀을 종료 |
| List<Runnable> | shutdownNow()                                 | 현재 작업 처리중인 스레드를 interrupt해서 작업 중지를 시도하고 스레드플 종료시킨다. 작업 큐에 있던 미처리된 작업을 반환한다. |
| boolean        | awaitTermination(long timeout, TimeUnit unit) | shutdown() 메소드 호출 이후, 모든 작업 처리를 timeout 시간 내 완료하면 true를 반환하고, 완료하지 못하면 작업 처리중인 스레드를 interrupt하고 false를 리턴한다. |

```java
// 남아있는 작업 마무리하고 스레드풀 종료
executorService.shutdown();

// 스레드풀 강제 종료
List<Runnable> runnables = executorService.shutdownNow();
```



# 4 작업 처리

## 4.1 작업 생성

* 하나의 작업은 Runnable 또는 Callable 구현 클래스로 표현된다.
  * 차이는 반환값이 없으면 Runnable 있으면 Callable
* 스레드풀의 스레드는 작업 큐에서 Runnable 또는 Callable 객체를 가져와 run() 또는 call() 메소드를 실행한다.

```java
@FunctionalInterface
public interface Runnable {
    public abstract void run();
}
```

```java
@FunctionalInterface
public interface Callable<V> {
    V call() throws Exception;
}
```



## 4.2 작업 처리 요청

* 작업 처리 요청이란 ExecutorService의 작업 큐에 Runnable 또는 Callable 객체를 넣은 행위를 말한다.



**ExecutorService 인터페이스**

| 리턴 타입 | 메소드                          | 설명                                                         |
| --------- | ------------------------------- | ------------------------------------------------------------ |
| void      | execute(Runnable command)       | Runnable을 작업 큐에 저장. 작업 결과를 받지 못함             |
| Future<T> | submit(Callable<T> task)        | Runnable 또는 Callable을 작업 큐에 저장 리턴된 Future를 통해 작업 결과를 얻음 |
| Future<?> | submit(Runnable task)           | Runnable 또는 Callable을 작업 큐에 저장 리턴된 Future를 통해 작업 결과를 얻음 |
| Future<T> | submit(Runnable task, T result) | Runnable 또는 Callable을 작업 큐에 저장 리턴된 Future를 통해 작업 결과를 얻음 |

* execute()는 작업 처리중 예외 발생하면 스레드 종료되고 스레드 풀에서 제거된다.
* submit()은 작업 처리중 예외가 발생하더라도 스레드 종료되지 않고 다음 작업을 위해 재사용된다.
  * 가급적 스레드 생성 오버헤드를 줄이기 위해 submit()을 사용하자



# 5 블로킹 방식의 작업 완료 통보(Future)

* ExecutorService의 submit() 메소드는 Runnable 또는 Callable를 작업 큐에 넣고 즉시 Future 객체를 리턴한다.
* Future 객체는 작업 결과가 아니라 작업이 완료될 때까지 기다렸다가 최종 결과를 얻는데 사용된다.
* 작업을 처리하는 스레드가 작업을 완료하기 전까지 get() 메소드가 블로킹되어 다른 코드를 실행할 수 없다
  * 따라서 get() 메소드를 호출하는 스레드는 새로운 스레드가 되어야한다.

```java
ExecutorService executorService = Executors.newCachedThreadPool();
Future<String> future = executorService.submit(() -> "result");
// 다른 스레드에서 Future의 get 메소드 호출
executorService.submit(() -> future.get());
```



**Future 인터페이스**

| 리턴 타입 | 메소드                              | 설명                                                         |
| --------- | ----------------------------------- | ------------------------------------------------------------ |
| V         | get()                               | 작업이 완료될 때까지 블로킹되어있다가 처리 결과 V를 리턴     |
| V         | get(long timeout, TimeUnit unit)    | timeout 시간 전에 작업이 완료되면 결과 V를 리턴하지만, 작업이 완료되지 않으면 TImeoutException을 발생시킴 |
| boolean   | cancel(boolean mayInterruptRunning) | 작업 처리가 진행 중일 경우 취소시킴                          |
| boolean   | isCancelled()                       | 작업이 취소되었는지 여부                                     |
| boolean   | isDone()                            | 작업이 처리가 완료되었는지 여부                              |



## 5.1 반환값이 없는 작업 완료 통보

* submit() 메소드의 아규먼트로 Runnable 객체를 전달할 수 있다. 
* Runnable은 결과 값이 없지만 submit()는 Future를 반환한다.
* 반환된 Future는 스레드가 작업 처리를 정상적으로 완료했는지 아니면 예외가 발생했는지 확인할 때 사용된다.
  * 정상 완료: `future.get() == null` 
  * 예외 발생: 스레드가 작업 처리 도중 interrupt되면 InterruptedException을 발생시키고 예외가 발생하면 ExcutionException을 발생시킨다.

```java
try {
  future.get();
} catch (InterruptedException e) {
  // 작업 도중 스레드가 interrupt 될 경우 처리 코드
} catch (ExecutionException e) {
  // 작업 도중 예외가 발생된 경우 처리 코드
}
```

**예시**

```java
public class NoResultExample {
  public static void main(String[] args) {
    ExecutorService executorService = Executors.newFixedThreadPool(
      Runtime.getRuntime().availableProcessors()
    );

    System.out.println("[작업 처리 요청]");
    Runnable runnable = () -> {
      int sum = 0;
      for (int i = 1; i <= 10; i++) {
        sum+=i;
      }
      System.out.println("[처리 결과] " + sum);
    };

    Future future = executorService.submit(runnable);

    try {
      future.get();
      System.out.println("[작업 처리 완료]");
    } catch (Exception e) {
      System.out.println("[실행 예외 발생] " + e.getMessage());
      e.printStackTrace();
    }

    executorService.shutdown(); // 스레드 풀 종료
  }
}
```



## 5.2 반환값이 있는 작업 완료 통보

* 스레드가 작업 완료한 후에 처리 결과를 얻어야 된다면 작업 객체를 Callable로 생성하면 된다.

```java
public class YesResultExample {
  public static void main(String[] args) {
    ExecutorService executorService = Executors.newFixedThreadPool(
      Runtime.getRuntime().availableProcessors()
    );

    System.out.println("[작업 처리 요청]");
    Callable<Integer> callable = () -> {
      int sum = 0;

      for (int i = 1; i <= 10; i++) {
        sum += i;
      }
      System.out.println("[처리 결과] " + sum);

      return sum;
    };

    Future<Integer> future = executorService.submit(callable);

    try {
      Integer resultInteger = future.get();
      System.out.println("[future.get()] " + resultInteger);
      System.out.println("[작업 처리 완료]");
    } catch (Exception e) {
      System.out.println("[실행 예외 발생] " + e.getMessage());
      e.printStackTrace();
    }

    executorService.shutdown();
  }
}
```



## 5.3 콜백 방식 작업 완료 통보

* 콜백이란 애플리케이션이 스레드에게 작업 처리를 요청한 후 스레드가 작업을 완료하면 특정 메소드를 자동 실행하는 기법을 말한다.
  * 이때 자동 실행되는 메소드를 콜백 메소드라고 한다.
* 콜백 메소드를 가진 클래스가 필요하다.
  - 직접 정의하거나 `java.nio.channels.CompletionHandler`를 이용한다.
* `java.nio.channels.CompletionHandler`
  - 비동기 통신에서 콜백 객체를 만들 때 사용된다.
  - 정상종료를 위한 `.completed()` 메소드가 존재한다.
  - 예외처리를 위한 `.failed()` 메소드가 존재한다.

```java
public interface CompletionHandler<V,A> {
    void completed(V result, A attachment);
    void failed(Throwable exc, A attachment);
}
```

* 위에서 A attachment는 콜백 메소드 결과값 외에 추가적으로 전달할 객체가 있으면 설정해주면 된다.
  * 없으면 null



**예시**

```java
public class CallbackExample {
    private ExecutorService executorService;

    public CallbackExample() {
        executorService = Executors.newFixedThreadPool(
                Runtime.getRuntime().availableProcessors()
        );
    }

    private CompletionHandler<Integer, Void> callback = new CompletionHandler<Integer, Void>() {
        @Override
        public void completed(Integer result, Void attachment) {
            System.out.println("completed() 실행: " + result);
        }

        @Override
        public void failed(Throwable exc, Void attachment) {
            System.out.println("failed() 실행: " + exc.toString());
        }
    };

    public void doWork(final String x, final String y) {
        Runnable task = new Runnable() {
            @Override
            public void run() {
                try {
                    int intX = Integer.parseInt(x);
                    int intY = Integer.parseInt(y);
                    int result = intX + intY;
                    callback.completed(result, null);
                } catch (NumberFormatException e) {
                    callback.failed(e, null);
                }
            }
        };

        executorService.submit(task);
    }

    public void finish() {
        executorService.shutdown();
    }

    public static void main(String[] args) {
        CallbackExample callbackExample = new CallbackExample();
        callbackExample.doWork("3", "3");
        callbackExample.doWork("3", "삼");
        callbackExample.finish();
    }
}
```