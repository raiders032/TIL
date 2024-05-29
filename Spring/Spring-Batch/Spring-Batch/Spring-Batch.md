# 1 Spring Batch

- [레퍼런스](https://docs.spring.io/spring-batch/docs/current/reference/html/)
- 배치 처리는 `어떠한 완료 상태에 도달할 때까지 추가적인 상호작용 없이 실행하는 처리`를 말한다.

<br>

# 2 설정

## 2.1 @EnableBatchProcessing

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
	- 이전에는 `@EnableBatchProcessing` 어노테이션을 통해서 스프링 배치의 스프링 부트 자동설정을 활성화할 수 있었습니다.\
	- 하지만 이제는 스프링 부트의 자동설정을 사용하기 위해서는 삭제해야 합니다. 
	- `@EnableBatchProcessing` 명시하는 방법 또는 `DefaultBatchConfiguration` 을 상속하여 활성화되는 빈은 이제 스프링 부트의 자동설정을 밀어내고(back-off), 애플리케이션의 설정을 커스텀하는 용도로 사용됩니다.

<br>

## 2.2 DataSource 설정

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

<br>

## 2.3 JobBuilderFactory

- JobBuilder를 생성하는 팩토리 클래스
- JobBuilderFactory.get() 메서드를 호출하면서 잡 이름을 전달하면 JobBuilder를 얻을 수 있으며 이 빌더를 통해 Job을 구성할 수 있다.
- JobBuilderFactory는 Deprecated 되었으며 대신 JobBuilder를 사용한다.

<br>

## 2.4 JobBuilder

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

<br>

## 2.5 StepBuilderFactory

- StepBuilder를 생성하는 팩토리 클래스
- StepBuilderFactory.get() 메서드를 호출하면서 스텝 이름을 전달하면 StepBuilder를 얻을 수 있으며 이 빌더를 통해 Step을 구성할 수 있다.
- StepBuilderFactory는 Deprecated 되었으며 대신 StepBuilder를 사용한다.

<br>

## 2.6 StepBuilder



## 2.7 기타 설정

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

<br>

# 3 Parameters

- JobParameters는 Job을 실행할 때 필요한 파라미터들을 Key-Value 쌍으로 전달하는 객체입니다.
- JobParameters는 JobInstance를 구분하는 기준이 됩니다.
	- 같은 Job이라도 JobParameters가 다르면 별도의 JobInstance로 인식됩니다.

<br>

## 4.1 JobParameters 종류

- JobParameters에는 크게 두 가지 종류가 있습니다:
- 식별 파라미터(Identifying Parameter)
	- JobInstance를 고유하게 식별하는 데 사용되는 파라미터입니다. 
	- 동일한 식별 파라미터를 가진 Job은 여러 번 실행될 수 없습니다.
- 비식별 파라미터(Non-Identifying Parameter)
	- JobInstance 식별에 사용되지 않는 파라미터입니다.
	- 단순히 Job에 추가적인 데이터를 전달하는 용도로 사용됩니다.
- 기본적으로 모든 파라미터는 식별 파라미터로 간주됩니다. 
	- 하지만 명시적으로 비식별 파라미터로 지정할 수도 있습니다. 
- JobParameters를 만들 때 파라미터 이름 뒤에 식별 여부를 boolean으로 덧붙이면 됩니다.
- 식별 파라미터가 여러 개 있을 때는 AND 조건으로 동작합니다.
	- 즉, 모든 식별 파라미터가 일치해야 동일한 JobInstance로 인식됩니다.

<br>

**예시**
```java
JobParameters jobParameters = new JobParametersBuilder()
        .addString("date", "20220314", true)
        .addLong("seq", 1L, false) 
        .toJobParameters();
```

- "date" 파라미터는 식별 파라미터로 지정되었습니다. 
	- 따라서 date=20220314인 Job은 단 한 번만 실행될 수 있습니다.
- "seq" 파라미터는 비식별 파라미터로 지정되었습니다.
	- 따라서 동일한 date에 대해 seq가 다른 Job을 여러 번 실행할 수 있습니다.

<br>

# 4 Job

## 4.1 Job 실행하기

- Spring Batch에서 Job을 실행하는 방법에는 여러 가지가 있습니다.
	- CommandLineRunner/ApplicationRunner를 사용하는 방법
	- CommandLineJobRunner는 사용하는 방법

<br>

### 4.1.1 CommandLineRunner/ApplicationRunner 사용하기

- `CommandLineRunner`와 `ApplicationRunner`는 스프링 부트에서 제공하는 인터페이스로, 애플리케이션 구동 시점에 특정 코드를 실행시키고 싶을 때 사용합니다.
- 이를 활용하면 배치 잡을 애플리케이션 구동 시점에 실행시킬 수 있습니다.


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


**예시**

```java
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Date;

@RequiredArgsConstructor
@Component
public class JobRunner implements CommandLineRunner {

    private final JobLauncher jobLauncher;
    private final Job job;

    @Override
    public void run(String... args) throws Exception {
        JobParameters jobParameters = new JobParametersBuilder()
                .addString("param1", "value1")
                .addDate("date", new Date())
                .toJobParameters();
        
        jobLauncher.run(job, jobParameters);
    }
}
```

- CommandLineRunner 또는 ApplicationRunner 인터페이스를 구현한 클래스를 만들고 @Component를 붙여 스프링 빈으로 등록합니다.
- 생성자 주입을 통해 JobLauncher와 실행할 Job을 주입받습니다.
- 구현한 run 메소드 안에서 원하는 JobParameters를 생성합니다.
- jobLauncher.run(job, jobParameters)를 호출해서 job을 실행시킵니다.
- 이렇게 하면 스프링 부트 애플리케이션이 구동될 때 자동으로 해당 잡이 실행됩니다.

<br>

## 4.2 JobParameters

- JobInstance는 Job의 이름과 전달된 식별 파라미터로 식별된다.
	- 따라서 동일한 식별 파라미터로 잡을 두 번 이상 실행할 수 없다.
	- 파라미터에는 식별을 위해 쓰이는 식별 파라미터와 그렇지 않은 비식별 파라미터로 구분된다.

<Br>

**JobParameters 전달하기**

- 잡에 파라미터를 전달하는 방법은 잡을 어떻게 호출하는지에 따라 달라진다.
- 명령행에서 잡을 시작할 때 쿼츠 스케줄러에서 잡을 시작할 때 파라미터를 전달하는 방식이 다르다.

<br>
참고

- [Spring Batch를 더 우아하게 사용하기 - Spring Batch Plus](https://d2.naver.com/helloworld/9879422)
