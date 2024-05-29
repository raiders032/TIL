# 1 ItemWriter

- ItemWriter는 처리된 데이터를 저장하거나 출력하는 역할을 맡습니다.
- 데이터베이스에 저장하거나, 파일로 출력하는 등 다양한 방식으로 데이터를 처리할 수 있습니다. 
- 스프링 배치는 다양한 ItemWriter 구현체를 제공하며, 필요에 따라 커스텀 ItemWriter를 개발할 수도 있습니다.

<br>

## 1.1 인터페이스

```java
@FunctionalInterface
public interface ItemWriter<T> {
	void write(@NonNull Chunk<? extends T> chunk) throws Exception;
}
```

<br>

# 2 구현체

- [레퍼런스](https://docs.spring.io/spring-batch/reference/readers-and-writers/item-reader-writer-implementations.html#repositoryItemWriter)


## 2.1 JdbcBatchItemWriter

- JdbcBatchItemWriter는 JDBC를 사용하여 데이터베이스에 데이터를 일괄 삽입하는 ItemWriter 구현체입니다.
- 내부적으로 PreparedStatement를 사용하여 SQL 쿼리를 실행하며, 일괄 처리를 위해 BatchPreparedStatementSetter를 사용합니다.
- DataSource, SQL 쿼리, ItemPreparedStatementSetter 등을 설정하여 사용할 수 있습니다.

<br>

**예시**

```java
@Bean
public JdbcBatchItemWriter<Person> writer(DataSource dataSource) {
    return new JdbcBatchItemWriterBuilder<Person>()
            .dataSource(dataSource)
            .sql("INSERT INTO people (first_name, last_name) VALUES (:firstName, :lastName)")
            .beanMapped()
            .build();
}
```

<br>

## 2.2 HibernateItemWriter

- HibernateItemWriter는 Hibernate를 사용하여 데이터베이스에 데이터를 저장하는 ItemWriter 구현체입니다.
- Hibernate Session을 사용하여 엔티티 객체를 저장하며, 일괄 처리를 위해 flush()와 clear()를 호출합니다.
- SessionFactory와 엔티티 클래스 정보를 설정하여 사용할 수 있습니다.

**예시**

```java
@Bean
public HibernateItemWriter<Person> writer(SessionFactory sessionFactory) {
    return new HibernateItemWriterBuilder<Person>()
            .sessionFactory(sessionFactory)
            .build();
}
```

<br>

## 2.3 FlatFileItemWriter

- FlatFileItemWriter는 데이터를 파일로 출력하는 ItemWriter 구현체입니다.
- 다양한 형식(CSV, XML, JSON 등)으로 데이터를 출력할 수 있으며, 파일 경로와 출력 포맷을 설정할 수 있습니다.
- LineAggregator를 사용하여 객체를 문자열로 변환하여 출력합니다.

**예시**

```java
@Bean
public FlatFileItemWriter<Person> writer() {
    return new FlatFileItemWriterBuilder<Person>()
            .name("personItemWriter")
            .resource(new FileSystemResource("output/persons.csv"))
            .delimited()
            .names("firstName", "lastName")
            .build();
}
```

<br>

## 2.4 ClassifierCompositeItemWriter

- ClassifierCompositeItemWriter는 Spring Batch에서 제공하는 ItemWriter의 한 형태로, 분류기(Classifier) 기능을 사용하여 항목을 기반으로 다른 ItemWriter를 선택합니다.
- 즉, 기록하려는 항목의 유형 또는 상태에 따라 서로 다른 ItemWriter를 선택할 수 있습니다. 
- 이렇게 하면 동일한 흐름에서 서로 다른 유형의 데이터를 동적으로 처리하는 것이 가능해집니다.
- 예를 들어, 여러분이 고객 데이터와 제품 데이터를 각각 다른 테이블에 작성해야하는 경우가 있다고 가정해보겠습니다. 이 경우 ClassifierCompositeItemWriter를 사용하면, 입력 데이터의 유형(고객 또는 제품)에 따라 적절한 ItemWriter(고객 데이터 또는 제품 데이터를 처리하는)를 선택할 수 있습니다.
- 분류기(Classifier)는 고유의 분류 로직을 포함하는 컴포넌트로, 보통 람다 표현식 또는 별도의 클래스로 정의됩니다.
- 이 분류기는 각 항목에 대해 호출되며, 선택된 ItemWriter의 write() 메서드를 호출 합니다. 
- 이를 통해 항목 유형에 따라 다른 쓰기 작업을 수행하도록 구성할 수 있습니다.

<br>

# 3 커스텀 ItemWriter 개발

- 스프링 배치에서 제공하는 ItemWriter 구현체로 처리할 수 없는 경우, 커스텀 ItemWriter를 개발할 수 있습니다.
- ItemWriter 인터페이스를 구현하여 write() 메서드를 오버라이드하면 됩니다.
- 필요에 따라 다양한 방식으로 데이터를 처리하고 출력할 수 있습니다.