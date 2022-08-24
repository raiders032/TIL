# 1 Future

- Java 5부터 미래의 어느 시점에 결과를 얻는 모델에 활용할 수 있도록 Future 인터페이스를 제공하고 있다
- Future는 비동기 계산의 결과를 표현할 수 있다
- Future 객체는 작업 결과가 아니라 작업이 완료될 때까지 기다렸다가 최종 결과를 얻는데 사용된다.
- ExecutorService의 submit() 메소드는 Runnable 또는 Callable를 작업 큐에 넣고 즉시 Future 객체를 리턴한다.



## 1.1 Future 인터페이스

| 리턴 타입 | 메소드                              | 설명                                                         |
| --------- | ----------------------------------- | ------------------------------------------------------------ |
| V         | get()                               | 작업이 완료될 때까지 블로킹되어있다가 처리 결과 V를 리턴     |
| V         | get(long timeout, TimeUnit unit)    | timeout 시간 전에 작업이 완료되면 결과 V를 리턴하지만, 작업이 완료되지 않으면 TImeoutException을 발생시킴 |
| boolean   | cancel(boolean mayInterruptRunning) | 작업 처리가 진행 중일 경우 취소시킴                          |
| boolean   | isCancelled()                       | 작업이 취소되었는지 여부                                     |
| boolean   | isDone()                            | 작업이 처리가 완료되었는지 여부                              |



## 1.2 Future의 단순 활용

**활용 예시**

```java
@Test
void useSimpleFuture() {
  // 스레드 풀에 태스크를 제출하기 위해 ExecutorService를 생성한다.
  ExecutorService executorService = Executors.newCachedThreadPool();

  // 시간이 오래 걸리는 작업을 다른 스레드에서 비동기적으로 실행한다.
  Future<Double> future = executorService.submit(() -> doSomeLongComputation());

  // 비동기 작업을 수행하는 동안 다른 작업을 수행한다.
  doSomeThingElse();

  try {
    // 비동기 작업의 결과를 가져온다. 결과가 준비되어 있지 않으면 호출 스레드가 블록되며 최대 1초까지만 기다린다.
    Double result = future.get(1, TimeUnit.SECONDS);
  } catch (ExecutionException e) {
    // 계산 중 예외 발생
    e.printStackTrace();
  } catch (InterruptedException e) {
    // 현재 스레드에서 대기 중 인터럽트 발생
    e.printStackTrace();
  } catch (TimeoutException e) {
    // Future가 완료되기 전에 타임아웃 발생
    e.printStackTrace();
  }
}
```



## 1.3 Future의 한계

- Future 인터페이스는 비동기 계산이 끝났는지 확인할 수 있는 isDone 메서드, 계산이 끝나길 기다리는 메서드, 결과를 회수하는 메서드를 제공하지만 이 메서드로 간결한 동시 실행 코드를 구현하기 충분하지 않다
- Future를 사용하면 여러 Future의 결과가 있을 때 이들의 의존성을 표현하는 것이 어렵다.
- Future를 사용하면 아래와 같은 기능을 작성하는 것이 어렵다.
  - 두 개의 비동기 계산 결과를 하나로 합친다.
  - Future 집합이 실행하는 모든 태스크의 완료를 기다린다.
  - Future 집합에서 가장 빨리 완료되는 태스크를 기다렸다가 결과를 얻는다.
  - Future 완료 동작에 반응한다. 즉 결과를 기다리면서 블록되지 않고 결과가 준비되었다는 알림을 받은 다음에 Future의 결과로 원하는 추가 동작을 한다.