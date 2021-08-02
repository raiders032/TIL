# 1. Spring for Apache Kafka

* 카프카 클라이언트 라이브러리를 래핑하여 카프카 클라이언트에서 사용하는 여러 가지 패턴을 제공한다

# 2. 시작하기

**디펜던시 추가**

* 스프링 부트를 사용한다면 버전은 생략해도 된다.

```xml
<dependency>
  <groupId>org.springframework.kafka</groupId>
  <artifactId>spring-kafka</artifactId>
  <version>2.7.2</version>
</dependency>
```

```groovy
compile 'org.springframework.kafka:spring-kafka:2.7.2'
```



# 3.Connecting to Kafka

# 4.Configuring Topics

# 5. Sending Messages



## 5.1 `KafkaTemplate` 사용하기

> 카프카 템플릿은 토픽으로 데이터를 전송할 수 있는 편리한 방법을 제공합니다.

* 카프카 클라이언트를 직접 사용하는 것이 아닌 `KafkaTemplate` 을 이용해 편리하게 간접적으로 카프카 클라이언트 API를 이용할 수 있다.



**`KafkaTemplate`을 사용하기 위한 설정**

* 템플릿을 사용하려면 `producer factory`를 구성하고 템플릿의 생성자에  `producer factory`를 넘겨준다.

```java
//producer factory 빈 등록
@Bean
public ProducerFactory<Integer, String> producerFactory() {
    return new DefaultKafkaProducerFactory<>(producerConfigs());
}

//producer factory 설정
@Bean
public Map<String, Object> producerConfigs() {
    Map<String, Object> props = new HashMap<>();
    props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
    props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
    props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
    // See https://kafka.apache.org/documentation/#producerconfigs for more properties
    return props;
}

//KafkaTemplate 빈 등록
@Bean
public KafkaTemplate<Integer, String> kafkaTemplate() {
    return new KafkaTemplate<Integer, String>(producerFactory());
}
```



**비동기식으로 전송 여부를 확인하기**

* 콜백을 등록하여 비동기적으로 전송 결과를 수신할 수 있습니다. 
* 아래는 예시

```java
@Component
@Slf4j
public class LibraryEventProducer {

    @Autowired
    KafkaTemplate<Integer,String> kafkaTemplate;

    @Autowired
    ObjectMapper objectMapper;

    public void sendLibraryEvent(LibraryEvent libraryEvent) throws JsonProcessingException {

        Integer key = libraryEvent.getLibraryEventId();
        String value = objectMapper.writeValueAsString(libraryEvent);

        ListenableFuture<SendResult<Integer,String>> listenableFuture = kafkaTemplate.sendDefault(key,value);
        listenableFuture.addCallback(new ListenableFutureCallback<SendResult<Integer, String>>() {
            @Override
            public void onFailure(Throwable ex) {
                handleFailure(key, value, ex);
            }

            @Override
            public void onSuccess(SendResult<Integer, String> result) {
                handleSuccess(key, value, result);
            }
        });

    }

    private void handleFailure(Integer key, String value, Throwable ex) {
        log.error("Error Sending the Message and the exception is {}", ex.getMessage());
        try {
            throw ex;
        } catch (Throwable throwable) {
            log.error("Error in OnFailure: {}", throwable.getMessage());
        }


    }

    private void handleSuccess(Integer key, String value, SendResult<Integer, String> result) {
        log.info("Message Sent SuccessFully for the key : {} and the value is {} , partition is {}", key, value, result.getRecordMetadata().partition());
    }
}
```

* 버전 2.5부터는 `ListenableFutureCallback` 대신 `KafkaSendCallback`을 사용할 수 있습니다

```java
public void sendToKafka(final MyOutputData data) {
    final ProducerRecord<String, String> record = createRecord(data);

    ListenableFuture<SendResult<Integer, String>> future = template.send(record);
    future.addCallback(new KafkaSendCallback<SendResult<Integer, String>>() {

        @Override
        public void onSuccess(SendResult<Integer, String> result) {
            handleSuccess(data);
        }

        @Override
        public void onFailure(KafkaProducerException ex) {
            handleFailure(data, record, ex);
        }

    });
}
```



# 6. Receiving Messages

