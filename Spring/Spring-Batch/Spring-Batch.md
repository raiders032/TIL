# 1 Spring Batch

- [레퍼런스](https://docs.spring.io/spring-batch/docs/current/reference/html/)
- 배치 처리는 `어떠한 완료 상태에 도달할 때까지 추가적인 상호작용 없이 실행하는 처리`를 말한다.



# 2 Domain Of Batch

- [레퍼런스](https://docs.spring.io/spring-batch/docs/current/reference/html/domain.html#domainLanguageOfBatch)



## 2.1 Job

- [레퍼런스](https://docs.spring.io/spring-batch/docs/current/reference/html/domain.html#job)
- Job은 전체 배치 프로세스를 캡슐화하는 엔티티다. 
- 다른 Spring 프로젝트와 마찬가지로 Job은 XML 구성 파일 또는 Java 기반 구성과 연결된다.
- Spring Batch에서 Job은 단순히 Step 인스턴스의 컨테이너다.
- Job을 설정할 때 아래와 같은 요소를 설정한다.
  - 잡의 이름
  - Step 인스턴스의 정의와 순서 지정
  - job의 재실행 여부



## 2.2 JobInstance

- JobInstance란 Job의 실행을 논리적으로 표현한 것이다.
- 잡의 이름과 잡의 논리적 시행을 위해 제공되는 교유한 식별 파라미터의 모음이라고 할 수 있다.
  - 식으로 나타내면 이와 같다. `JobInstance = Job + JobParameters`
  - JobInstance는 JobParameters를 가지고 실행된 Job을 의미한다.

- JobInstance는 한 번 성공적으로 완료되면 다시 실행시킬 수 없다.
  - JobInstance는 잡 이름과 전달된 식별 파라미터로 식별되므로 , 동일한 식별 파라미터를 사용하는 잡은 한 번만 실행할 수 있다.




![Job Hierarchy](job-heirarchy.png)

> JobInstance란?
>
> 위 다이어그램의 EndOfDay Job과 같이 하루가 끝날 때 한 번 실행해야 하는 배치 작업을 생각해보자. End Of Day Job이 하나 있지만 Job의 개별적인 실행은 별도로 추적해야 한다. 예를 들어 1월 1일에 실행되는 JobInstance가 있고 1월 2일에 실행되는 JobInstance도 있다. 1월 1일 실행된 JobInstance가  처음 실패하고 다음 날 다시 실행되는 경우에도 여전히 1월 1일의 JobInstance다. 즉 각 JobInstance에는 여러 개의 JobExecution이 있을 수 있다.



## 2.3 JobParameters

- [레퍼런스](https://docs.spring.io/spring-batch/docs/current/reference/html/domain.html#jobparameters)
- JobInstance를 다른 JobInstance와 구별시켜주는 것이 JobParameters다.
- JobParameters는 배치 작업을 시작하는데 사용되는 파라미터들을 가지고 있는 객체다.



**Figure. Job Parameters**

![Job Parameters](job-stereotypes-parameters.png)

- EndOfDay Job과 같이 하루가 끝날 때 한 번 실행해야 하는 배치 작업을 생각해보자.

- `JobInstance = Job + JobParameters`다.
- 1월 1일과 1월 2일이라는 개의 JobParameter 객체를 가지고 하나의 잡을 실행한다.
  - 1월 1일이라는 JobParameter를 가지고 실행한 JobInstance
  - 1월 2일이라는 JobParameter를 가지고 실행한 JobInstance
- 따라서 Job은 JobInstance와 일대다 관계이다.

 

## 2.4 JobExecution

- [레퍼런스](https://docs.spring.io/spring-batch/docs/current/reference/html/domain.html#jobexecution)

- JobInstance이 Job의 실행을 논리적으로 표현한 것이라면 JobExecution은 실제 실행을 의미한다.
  - JobExecution는 JobInstance의 한번의 시도를 나타낸다.
  - 따라서 잡을 실행할 때마다 매번 새로운 JobExecution을 얻게 된다.

- 잡을 실행하며 발생한 정보를 저장한다.
  - 아래 참고



**JobInstance와의 관계**

- JobInstance과 JobExecution은 일대다 관계이다.
- JobExecution은 Job의 실행 결과로서 `FAILED` 또는 `COMPLETED` 상태를 가지고 있다. 
- JobExecution이 `COMPLETED`면 JobInstance는 실행이 완료된 것으로 간주해 재실행하지 않는다.
  - 즉 더이상 JobExecution이 생성되지 않는다.
- JobExecution이 `FAILED`면 JobInstance는 실행이 완료되지 않은 것으로 간주해 재실행이 가능하다.
  - JobExecution이 더 생성될 수 있다. 
- JobExecution이 `COMPLETED`가 될 때가지 JobInstance가 여러번 시도될 수 있다.



***Table. JobExecution Properties***

| Property            | Definition                                                   |
| ------------------- | ------------------------------------------------------------ |
| `Status`            | A `BatchStatus` object that indicates the status of the execution. While running, it is `BatchStatus#STARTED`. If it fails, it is `BatchStatus#FAILED`. If it finishes successfully, it is `BatchStatus#COMPLETED` |
| `startTime`         | A `java.util.Date` representing the current system time when the execution was started. This field is empty if the job has yet to start. |
| `endTime`           | A `java.util.Date` representing the current system time when the execution finished, regardless of whether or not it was successful. The field is empty if the job has yet to finish. |
| `exitStatus`        | The `ExitStatus`, indicating the result of the run. It is most important, because it contains an exit code that is returned to the caller. See chapter 5 for more details. The field is empty if the job has yet to finish. |
| `createTime`        | A `java.util.Date` representing the current system time when the `JobExecution` was first persisted. The job may not have been started yet (and thus has no start time), but it always has a `createTime`, which is required by the framework for managing job-level `ExecutionContexts`. |
| `lastUpdated`       | A `java.util.Date` representing the last time a `JobExecution` was persisted. This field is empty if the job has yet to start. |
| `executionContext`  | The “property bag” containing any user data that needs to be persisted between executions. |
| `failureExceptions` | The list of exceptions encountered during the execution of a `Job`. These can be useful if more than one exception is encountered during the failure of a `Job`. |



## 2.5 Step

- [레퍼런스](https://docs.spring.io/spring-batch/docs/current/reference/html/domain.html#step)
- `Job`은 하나 이상의 `Step`으로 구성된다.
- `Step`은 실제 배치 작업을 정의하고 제어하는 데 필요한 모든 정보를 가지고있다.
  - 배치 작업으로 처리하고 싶은 로직을 Step에 정의한다.
  - 예를 들어 파일에서 데이터베이스로 데이터를 적재하는 로직



## 2.6 StepExecution

- [레퍼런스](https://docs.spring.io/spring-batch/docs/current/reference/html/domain.html#stepexecution)
- StepExecution은 Step의 한번의 시도를 나타내는 객체다.
  - 즉 Step이 실행될 때마다 새로운 StepExecution이 생성된다.



**JobExecution과의 관계**

![Figure 2.1: Job Hierarchy With Steps](jobHeirarchyWithSteps.png)

![Spring Batch Meta-Data ERD](meta-data-erd.png)

- JobExecution과 `StepExecution`의 관계는 일대다 관계이다.
  - 하나의 Job을 여러 Step으로 구성했을 때 `StepExecution`은 하나의 JobExecution을 부모로 가진다.
- JobExecution의 모든 자식 `StepExecution`이 정상적으로 완료 되어어야 JobExecution이 정상적으로 완료된다.
- JobExecution의 자식 `StepExecution` 중 하나라도 실패하면 JobExecution은 실패한다.



**StepExecution의 속성들**

| Property           | Definition                                                   |
| ------------------ | ------------------------------------------------------------ |
| `Status`           | A `BatchStatus` object that indicates the status of the execution. While running, the status is `BatchStatus.STARTED`. If it fails, the status is `BatchStatus.FAILED`. If it finishes successfully, the status is `BatchStatus.COMPLETED`. |
| `startTime`        | A `java.util.Date` representing the current system time when the execution was started. This field is empty if the step has yet to start. |
| `endTime`          | A `java.util.Date` representing the current system time when the execution finished, regardless of whether or not it was successful. This field is empty if the step has yet to exit. |
| `exitStatus`       | The `ExitStatus` indicating the result of the execution. It is most important, because it contains an exit code that is returned to the caller. See chapter 5 for more details. This field is empty if the job has yet to exit. |
| `executionContext` | The “property bag” containing any user data that needs to be persisted between executions. |
| `readCount`        | The number of items that have been successfully read.        |
| `writeCount`       | The number of items that have been successfully written.     |
| `commitCount`      | The number of transactions that have been committed for this execution. |
| `rollbackCount`    | The number of times the business transaction controlled by the `Step` has been rolled back. |
| `readSkipCount`    | The number of times `read` has failed, resulting in a skipped item. |
| `processSkipCount` | The number of times `process` has failed, resulting in a skipped item. |
| `filterCount`      | The number of items that have been “filtered” by the `ItemProcessor`. |
| `writeSkipCount`   | The number of times `write` has failed, resulting in a skipped item. |



## 2.7 ExecutionContext

- [레퍼런스](https://docs.spring.io/spring-batch/docs/current/reference/html/domain.html#executioncontext)
- 프레임워크에서 관리하는 key, value 쌍의 콜렉션(Map)이다.
- StepExecution 스코프 또는 JobExecution 스코프에서 사용 가능한 콜렉션이다.



**Spring Batch Meta-Data ERD**

- StepExecution 스코프에서 사용 가능한 ExecutionContext는 BATCH_STEP_EXCUTION_CONTEXT에 저장된다.
- JobExecution 스코프에서 사용 가능한 ExecutionContext는 BATCH_JOB_EXCUTION_CONTEXT에 저장된다.

![Spring Batch Meta-Data ERD](meta-data-erd-1096595.png)



## 2.8 JobRepository

![Figure 2.1: Batch Stereotypes](spring-batch-reference-model.png)

- [레퍼런스](https://docs.spring.io/spring-batch/docs/current/reference/html/domain.html#jobrepository)
- 배치 잡 실행 중 오류가 발생하면 어떻게 복구할까?
  - 실행 중 오류가 발생했을 때 어떤 처리를 하고 있었는지 기록해야 다시 잡을 오류 발생 이전의 상태를 가지고 재시작될 수 있다.
  - 즉 잡의 상태를 저장하는 기능이 필요한데  스프링 배치는 잡의 상태를 JobRepository에 저장해 관리한다.

- JobRepository는 다양한 배치 수행과 관련된 데이터(시작 시간, 종료 시간, 상태, 읽기 쓰기 횟수 등)뿐만 아니라 잡의 상태를 유지 관리한다.
  - JobRepository는 오류 발생 복구를 위한 잡의 상태 저장 뿐만아니라 모니터링 영역에서도 유용하게 사용된다.

- JobRepository는 일반적으로 관계형 데이터베이스를 사용하며 스프링 배치 내의 주요 컴포넌트가 공유한다.



## 2.9 JobLauncher

- [레퍼런스](https://docs.spring.io/spring-batch/docs/current/reference/html/domain.html#joblauncher)
- `JobLauncher`는 `Job`을 실행하는 인터페이스다.
  - 실행할 `Job`과 `JobParameters`를 받아 Job을 실행하고 `JobExecution`을 반환한다.
  - 잡을 실행하는 역할 이외에도 잡의 재실행 가능 여부 검증, 잡의 실행 방법(현재 스레드에서 실행할지 스레드 풀을 통해 실행할지 등), 파라미터 유효성 검증 등을 처리한다.
- 스프링 부트를 사용하면 `JobLauncher` 빈이 자동 등록된다.
  - 스프링부트에서는 JobLauncherApplicationRunner가 자동으로 `JobLauncher`을 실행시킨다.
  - 따라서 일반적으로 `JobLauncher`를 직접 다루진 않는다.



**JobLauncher Interface**

```java
public interface JobLauncher {

public JobExecution run(Job job, JobParameters jobParameters)
            throws JobExecutionAlreadyRunningException, JobRestartException,
                   JobInstanceAlreadyCompleteException, JobParametersInvalidException;
}
```



# 3 설정

## 3.1 @EnableBatchProcessing

- 배치 인프라스트럭처를 부트스트랩하는 데 사용된다.
- 배치 인프라스트럭처를 위한 대부분의 스프링 빈 정의를 제공한다.
  - JobRepository
  - JobLauncher
  - JobExplorer
  - JobRegistry
  - JobOperator
  - PlatformTransactionManager: 잡 진행 과정에서 트랜잭션을 다루는데 사용
- 해당 애노테이션을 사용하기 위해서는 DataSource 제공이 필수다.
- **Spring boot 3.0** 부터 @EnableBatchProcessing 애노테이션을 사용하지 않는다.
  - [레퍼런스](https://www.baeldung.com/spring-boot-spring-batch)




## 3.2 DataSource 설정

- MySQL 드라이버를 사용하는 데이터 소스를 생성하도록 스프링 부트를 구성한다.
- 데이터베이스에 메타 데이터 스키마를 자동 생성하도록 구성한다.
  - [메타 데이터 스키마](https://docs.spring.io/spring-batch/docs/current/reference/html/schema-appendix.html#metaDataSchema)
  - [spring.batch.initialize-schema](https://docs.spring.io/spring-boot/docs/2.1.x/reference/html/howto-database-initialization.html#howto-initialize-a-spring-batch-database)
    - Spring Boot 2.5.0 이후 deprecated 
    - `spring.batch.jdbc.initialize-schema`을 대체 사용한다.

```yaml
spring:
  datasource:
    driverClassName: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/spring_batch
    username: root
    password: p@ssw0rd
  batch:
    job:
      names: conditionalStepLogicJob
    jdbc:
      initialize-schema: always
```



## 3.3 JobBuilderFactory

- JobBuilder를 생성하는 팩토리 클래스
- JobBuilderFactory.get() 메서드를 호출하면서 잡 이름을 전달하면 JobBuilder를 얻을 수 있으며 이 빌더를 통해 Job을 구성할 수 있다.
- JobBuilderFactory는 Deprecated 되었으며 대신 JobBuilder를 사용한다.



**JobBuilder**

- 스프링 5.0부터는 JobBuilderFactory를 통해 JobBuilder를 생성하지 않는다.
- JobBuilder의 `public JobBuilder(String name, JobRepository jobRepository)` 생성자를 통해 `JobBuilder`를 생성한다.
  - JobBuilder: `package org.springframework.batch.core.job.builder`
- 이후 start 메서드에 Step을 인자로 넘기면 SimpleJob을 만들 수 있고 Flow를 넘기면 FlowJob을 생성할 수 있다.
- 아래는 SimpleJob을 생성하는 예시다.

```kotlin
@Configuration
class CreateAnswerJobConfig(
  val entityManagerFactory: EntityManagerFactory,
  val jobRepository: JobRepository,
  val transactionManager: PlatformTransactionManager,
) {

  @Bean
  fun createAnswerJob(step1: Step): Job {
      return JobBuilder("create-answer-job", jobRepository)
          .incrementer(RunIdIncrementer())
          .start(step1)
          .build()
  }

 @Bean
  fun step1(): Step {
      return StepBuilder("step1", jobRepository)
          .chunk<Question, Answer>(10, transactionManager)
          .reader(reader())
          .processor(processor())
          .writer(writer())
          .build()
  }

}
```









## 3.4 StepBuilderFactory

- StepBuilder를 생성하는 팩토리 클래스
- StepBuilderFactory.get() 메서드를 호출하면서 스텝 이름을 전달하면 StepBuilder를 얻을 수 있으며 이 빌더를 통해 Step을 구성할 수 있다.
- StepBuilderFactory는 Deprecated 되었으며 대신 StepBuilder를 사용한다.



## 3.5 기타 설정

**`spring.batch.job.name`**

- 여러가지의 Job 중 특정한 Job을 실행시키고 싶은 경우 Job의 이름을 명시한다.
- 쉼표로 구분된 Job을 순서대로 실행한다.
- `${job.name:NONE}`으로 설정하고 외부에서 값을 입력받아 원하는 Job만 실행할 수 있다.
  - java 명령어로 실행 시 `--job.name=job1,job2`와 같이 옵션을 입력하면 job1, job2만 특정해 실행 가능하다.
  - 옵션을 지정하지 않으면 기본 값 NONE이 적용되어 아무런 Job이 실행되지 않는다. 




**`spring.batch.job.enable`**

- 애플리케이션 구동 시 자동으로 배치 작업이 실행된다.
- 기본값 `true`



**`spring.batch.jdbc.initialize-schema`**

- 메타 데이터 스키마 생성에 대한 설정
- always: 생성 스크립트 항상 실행
- embedded: 내장 DB일 때만 실행되며 스키마 자동 생성됨
- never: 스크립트 항상 실행 안함
  - 운영에서 수동으로 스크립트 생성 후 설정하는 것을 권장 


```yaml
spring:
  datasource:
    driverClassName: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/oom-data
    username: oom
    password: 1234
  batch:
    jdbc:
      initialize-schema: always
    job:
      enabled: true
      name: testJob
```



`spring.batch.jdbc.table-prefix`

- 메타 데이터 스키마 생성시 테이블 이름의 prefix를 지정한다.



# 4 Parameters



# 5 Job



## 5.1 Job 실행하기

- 스프링 부트는 CommandLineRunner와 ApplicationRunner라는 두 가지 메커니즘을 이용해 실행 시 로직을 수행한다.
- 이 두 인터페이스는 ApplicationContext가 리프레시 되고 애플리케이션이 코드를 실행할 준비가 된 이후에 호출되는 하나의 메서드를 가지고 있다.
- 스프링 부트를 스프링 배치와 함께 사용하면 



**CommandLineRunner 인터페이스**

```java
package org.springframework.boot;

@FunctionalInterface
public interface CommandLineRunner{
  void run(String... args) throws Exception;
}
```



**ApplicationRunner 인터페이스**

```java
package org.springframework.boot;

@FunctionalInterface
public interface ApplicationRunner {
	void run(ApplicationArguments args) throws Exception;
}
```



## 5.2 JobParameters

- JobInstance는 Job의 이름과 전달된 식별 파라미터로 식별된다.
  - 따라서 동일한 식별 파라미터로 잡을 두 번 이상 실행할 수 없다.
  - 파라미터에는 식별을 위해 쓰이는 식별 파라미터와 그렇지 않은 비식별 파라미터로 구분된다.



**JobParameters 전달하기**

- 잡에 파라미터를 전달하는 방법은 잡을 어떻게 호출하는지에 따라 달라진다.
  - 명령행에서 잡을 시작할 때 쿼츠 스케줄러에서 잡을 시작할 때 파라미터를 전달하는 방식이 다르다.





# 6 Step

- 스프링 배치가 제공하는 스텝 유형에는 Tasklet 기반 Step과 Chunk 기반 Step이 있다.



## 6.1 Chunk

- 청크 기반 스텝은 최소한 2-3개의 주요 컴포넌트로 구성된다.
  - ItemReader: 필수
  - ItemProcessor: 선택
  - ItemWriter: 필수
- 위 컴포넌트를 이용해 레코드를 청크 또는 레코드 그룹 단위로 처리한다.
- 각 청크는 자체 트랜잭션으로 실행되며 처리에 실패하면 마지막 성공 트랜잭션 이후부터 다시 시작할 수 있다.



**동작 과정**

- 위 세 가지 컴포넌트를 사용하면 세 가지 루프를 수행한다.
- ItemReader는 청크 단위로 처리할 모든 레코드를 반복적으로 메모리로 읽어온다.
- ItemProcessor는 메모리로 읽어들인 아이템을 반복적으로 ItemProcessor를 거쳐간다.
- 마지막으로 한 번에 기록할 수 있는 ItemWriter를 호출하면서 모든 아이템을 전달한다.



**pseudo code**

- [레퍼런스](https://docs.spring.io/spring-batch/docs/current/reference/html/step.html#chunkOrientedProcessing)
- 동작 과정을 pseudo code로 표현하면 아래의 코드와 같다.

```java
// ItemReader: commitInterval에 도달할 때 까지 아이템을 하나씩 읽는다.
List items = new Arraylist();
for(int i = 0; i < commitInterval; i++){
    Object item = itemReader.read();
    if (item != null) {
        items.add(item);
    }
}

// ItemProcessor: 읽어온 아이템을 하나씩 처리한다.
List processedItems = new Arraylist();
for(Object item: items){
    Object processedItem = itemProcessor.process(item);
    if (processedItem != null) {
        processedItems.add(processedItem);
    }
}

// ItemWriter: 마지막으로 처리된 아이템을 한번에 쓴다.
itemWriter.write(processedItems);
```



**Commit Interval**

- [레퍼런스](https://docs.spring.io/spring-batch/docs/current/reference/html/step.html#commitInterval)
- 앞서 언급한 Commit Interval에 대해 알아보자
- Commit Interval을 1로 설정하면 아이템 하나를 쓰고 커밋하게 된다.
  - 그러나 이는 대부분의 경우 불합리적이다.
  - 트랜잭션을 시작하고 커밋하는 비용은 비싸기 때문
  - 처리하는 데이터에 따라 다르지만 일반적으로 한 트랜잭션 안에서 가능한 많은 아이템을 처리하는 것을 원한다.



```java
@Bean
public Job sampleJob(JobRepository jobRepository) {
    return new JobBuilder("sampleJob", jobRepository)
                     .start(step1())
                     .build();
}

@Bean
public Step step1(JobRepository jobRepository, PlatformTransactionManager transactionManager) {
	return new StepBuilder("step1", jobRepository)
				.<String, String>chunk(10, transactionManager)
				.reader(itemReader())
				.writer(itemWriter())
				.build();
}
```

- 위 예시는 commit-interval을 10으로 지정한 예시다.
  - 즉 한 트랜잭션 안에서 10개의 아이템을 처리하겠다는 의미다.
- ItemReader가 아이템을 하나 씩 읽으면 카운터가 하나씩 증가하는데 이 카운터가 10에 도달하면 아이템 집합을 ItemWriter에 넘기고 트랜잭션을 커밋한다.



## 6.2 Tasklet

- [레퍼런스](https://docs.spring.io/spring-batch/docs/current/reference/html/step.html#taskletStep)
- Chunk-oriented processing 방식의 Step만 있는 것이 아니다.
  - Chunk-oriented processing 방식은 3 단계로 구성되어 있다.(읽기, 처리, 쓰기)
  - 반면에 Tasklet의 경우는 1 단계로 모든 것을 처리하는 것으로 이해하면 된다.

- Tasklet 인터페이스를 사용하면 execute 메서드가 `RepeatStatus.FINISHED`를 반환할 때까지 트랙잭션 범위 내에서 반복적으로 실행되는 코드 블록을 만들 수 있다.



**Tasklet 인터페이스**

- `org.springframework.batch.core.step.tasklet` 패키지



**Tasklet 인터페이스**

```java
@FunctionalInterface
public interface Tasklet {

	@Nullable
	RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception;

}
```

- Tasklet 구현체의 처리가 완료되면 org.springframework.batch.repeat.RepeatStatus 객체를 반환한다.
- RepeatStatus.CONTINUABLE 또는 RepeatStatus.FINISHED을 반환한다.
- `RepeatStatus.CONTINUABLE`
  - 스프링 배치에게 해당 Tasklet을 다시 실행하라고 말하는 것이다.
  - 어떤 조건이 충족될 때까지 Tasklet을 반복해서 실행해야 할 경우가 필요하다.
  - 이런 경우에도 Tasklet의 실행 횟수, 트랜잭션 등을 추적하길 원하는 경우 사용한다.
- `RepeatStatus.FINISHED`
  - 처리의 성공 여부에 관계없이 해당 Tasklet의 처리를 완료하고 다음 처리를 이어가겠다는 의미다.



# 7 Chunk-oriented processing 

- 웹 애플리케이션, 배치 그 외의 어떤 프로그램이든 그 기반에는 데이터를 읽어서 특정 방법으로 데이터를 처리한 뒤 처리된 데이터를 기록하는 기능이 존재한다.
- 청크 기반 스텝은 이런 세 가지 개념을 각각 ItemReader, ItemProcessor, ItemWrite로 해결한다.
  - ItemReader: 데이터 읽기
  - ItemProcessor: 읽은 데이터 처리
  - ItemWrite: 처리된 데이터 기록



## 7.1 ItemReader

- 입력이로 제공되는 데이터의 유형으로는 플랫 파일, XML, 데이터베이스 등이 있다.
- 지원하지 않은 포맷의 데이터는 커스텀 리더를 개발해서 해결한다.



> 플랫 파일
>
> - 한 개 또는 그 이상의 레코드가 포함된 특정한 파일
> - 파일 내에 데이터의 포맷이나 의미를 정의하는 메타데이터가 없는 파일



**ItemReader 인터페이스**

- org.springframework.batch.item 패키지
- ItemReader는 전략 인터페이스다.
- 스프링 배피는 입력 유형에 맞는 여러 구현체를 제공한다.
  - 플랫 파일, 데이터베이스, JMS 소스 등
- ItemReader의 read 메서드를 호출하면 해당 메서드는 Step 내에서 처리할 아이템 한개를 반환한다.

```java
@FunctionalInterface
public interface ItemReader<T> {

	@Nullable
	T read() throws Exception, UnexpectedInputException, ParseException, NonTransientResourceException;

}
```



**JPA**



## 7.2 ItemProcessor



## 7.3 ItemWriter

- ItemWriter는 스프링 배치의 출력을 담당하는 기능을 한다.
- 청크 기반으로 처리하는 ItemWriter는 아이템을 건건이 쓰지 않고 청크 단위로 쓴다.
  - 청크 기반 처리 방식이 도입되고 ItemWriter를 호출하는 횟수가 훨씬 작아짐
- 청크 기반 처리 주의점
  - 파일과 같이 트랜잭션이 적용되지 않는 리소스를 처리하는 작업에서 파일 쓰기를 실패했을 때 이미 쓰여진 내용을 롤백할 방법이 없다.
  - 따라서 이러한 경우 추가적인 보호 조치가 필요하다.



**ItemWriter 인터페이스**

- `package org.springframework.batch.item`

```java
@FunctionalInterface
public interface ItemWriter<T> {
	void write(@NonNull Chunk<? extends T> chunk) throws Exception;
}
```



### 8.3.1 데이터베이스 기반 ItemWriter

- 데이터베이스를 접근하는 다양한 옵션이 존재한다.
  - JDBC, JPA, 하이버네이트



**JdbcBatchItemWriter**

- JDBC를 사용해 데이터베이스에 접근하는 방식



**JpaItemWriter**

- 



#  8메타 데이터 스키마

- [레퍼런스](https://docs.spring.io/spring-batch/docs/current/reference/html/schema-appendix.html#metaDataSchema)



## 8.1 `BATCH_JOB_INSTANCE`

```sql
CREATE TABLE BATCH_JOB_INSTANCE  (
  JOB_INSTANCE_ID BIGINT  PRIMARY KEY ,
  VERSION BIGINT,
  JOB_NAME VARCHAR(100) NOT NULL ,
  JOB_KEY VARCHAR(32) NOT NULL
);
```

- `JOB_INSTANCE_ID`: The unique ID that identifies the instance. It is also the primary key. The value of this column should be obtainable by calling the `getId` method on `JobInstance`.
- `VERSION`: See [Version](https://docs.spring.io/spring-batch/docs/current/reference/html/schema-appendix.html#metaDataVersion).
- `JOB_NAME`: Name of the job obtained from the `Job` object. Because it is required to identify the instance, it must not be null.
- `JOB_KEY`: A serialization of the `JobParameters` that uniquely identifies separate instances of the same job from one another. (`JobInstances` with the same job name must have different `JobParameters` and, thus, different `JOB_KEY` values).





더 읽을거리

- [Spring Batch를 더 우아하게 사용하기 - Spring Batch Plus](https://d2.naver.com/helloworld/9879422)
