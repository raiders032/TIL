# 1 Partitioning

- 스프링 배치에서의 파티셔닝(Partitioning)은 대량의 데이터를 병렬로 처리하여 성능을 향상시키는 방법 중 하나입니다. 
- 파티셔닝을 통해 데이터를 여러 개의 작은 청크로 나누고, 각 청크를 별도의 스레드 또는 프로세스에서 병렬로 처리할 수 있습니다. 
- 스프링 배치에서는 이를 위해 Partitioner와 PartitionHandler 인터페이스를 제공합니다.

<br>

# 2 주요 인터페이스

## 2.1 Partitioner

```java
public interface Partitioner {
    Map<String, ExecutionContext> partition(int gridSize);
}
```

- Partitioner는 데이터를 분할하는 로직을 정의하는 인터페이스입니다. 
- 주로 데이터베이스, 파일, 또는 기타 데이터 소스를 기반으로 데이터를 여러 파티션으로 나누는 역할을 합니다. 
- Partitioner는 map<String, ExecutionContext>를 반환하는 partition 메서드를 제공합니다.
- `gridSize`는 생성할 파티션의 수를 나타냅니다.
- 반환된 Map의 각 엔트리는 파티션의 이름(String)과 해당 파티션의 컨텍스트(ExecutionContext)를 포함합니다.

<br>

## 2.2 PartitionHandler

```java
public interface PartitionHandler {
    Collection<StepExecution> handle(StepExecutionSplitter stepSplitter, StepExecution stepExecution) throws Exception;
}
```

- PartitionHandler는 파티션된 작업을 처리하는 방법을 정의하는 인터페이스입니다. 
- PartitionHandler는 파티셔너가 생성한 파티션을 받아 각각의 파티션을 실행하는 역할을 합니다.
- 주요 구현체로는 TaskExecutorPartitionHandler가 있으며, 이는 TaskExecutor를 사용하여 병렬로 스텝을 실행합니다.
