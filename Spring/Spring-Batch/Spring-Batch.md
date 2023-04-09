# 1 Spring Batch

- [레퍼런스](https://docs.spring.io/spring-batch/docs/current/reference/html/)



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

- JobInstance란 Job의 실행을 개념적으로 표현한 것이다.
- `JobInstance = Job + JobParameters`
  - JobInstance는 JobParameters를 가지고 실행된 Job을 의미한다.



![Job Hierarchy](images/job-heirarchy.png)

> JobInstance란?
>
> 위 다이어그램의 EndOfDay Job과 같이 하루가 끝날 때 한 번 실행해야 하는 배치 작업을 생각해보자. End Of Day Job이 하나 있지만 Job의 개별적인 실행은 별도로 추적해야 한다. 예를 들어 1월 1일에 실행되는 JobInstance가 있고 1월 2일에 실행되는 JobInstance도 있다. 1월 1일 실행된 JobInstance가  처음 실패하고 다음 날 다시 실행되는 경우에도 여전히 1월 1일의 JobInstance다. 즉 각 JobInstance에는 여러 개의 JobExecution이 있을 수 있다.



## 2.3 JobParameters

- [레퍼런스](https://docs.spring.io/spring-batch/docs/current/reference/html/domain.html#jobparameters)
- JobInstance를 다른 JobInstance와 구별시켜주는 것이 JobParameters다.
- JobParameters는 배치 작업을 시작하는데 사용되는 파라미터들을 가지고 있는 객체다.



**Figure. Job Parameters**

![Job Parameters](images/job-stereotypes-parameters.png)

- EndOfDay Job과 같이 하루가 끝날 때 한 번 실행해야 하는 배치 작업을 생각해보자.

- `JobInstance = Job + JobParameters`다.
- 1월 1일과 1월 2일이라는 개의 JobParameter 객체를 가지고 하나의 잡을 실행한다.
  - 1월 1일이라는 JobParameter를 가지고 실행한 JobInstance
  - 1월 2일이라는 JobParameter를 가지고 실행한 JobInstance
- 따라서 Job은 JobInstance와 일대다 관계이다.

 

## 2.4 JobExecution

- [레퍼런스](https://docs.spring.io/spring-batch/docs/current/reference/html/domain.html#jobexecution)

- JobExecution는 JobInstance의 한번의 시도를 나타내는 객체다.
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

![Figure 2.1: Job Hierarchy With Steps](images/jobHeirarchyWithSteps.png)

![Spring Batch Meta-Data ERD](images/meta-data-erd.png)

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