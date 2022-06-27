# 1. consumer 개념

* `topic` 의 `partition` 으로 부터 데이터를 가져가기 위해 `consumer`를 운영하는 방법은 크게 2가지다.

1. 1개 이상의 `consumer`로 이루어진 `consumer` 그룹을 운영하는 방법
2. `topic` 의 특정  `partition`만 구독하는 `consumer`를 운영하는 방법



## 1.1 컨슈머 그룹을 운영하는 방법

* `consumer`그룹으로 묶인 `consumer`들은 `topic`의 1개 이상  `partition`들에 할당되어 데이터를 가져갈 수 있다.
*  `partition`은 최대 1개의 `consumer`에게 할당이 가능하다.
* 이러한 특징으로 `consumer` 그룹의 `consumer`의 수는 `topic`의 `partition`의 개수보다 작거나 같다.
  * `consumer` 의 수가 `partition` 의 수를 넘어가면  `consumer의 수 - partition의 수` 만큼의 `consumer`가 유휴 상태가 된다. 



**컨슈머 그룹의 컨슈머에게 장애가 발생한다면?**

* 장애간 발생한 `consumer`에 할당된 `partition`은 정상 작동하는 `consumer`에 소유권이 넘어간다.
* 이를 `rebalancing`이라 한다.



## 1.2 Rebalancing

* `rebalancing`은 두가지 상황에서 발생한다.
  1. 그룹에  `consumer`가 추가되는 상황
  2. 그룹에  `consumer`가 제외되는 상황
* `rebalancing` 은 자주 일어나서는 안 된다.
  * `rebalancing`이 발생 할 때 `consumer` 그룹의 `consumer`들이 `topic`의 데이터를 읽을 수 없기 때문
* `group coordinator`는 `rebalancing`을 발동시키는 역할을 한다.
  * `broker중` 하나가 group coordinator역할을 한다.



## 1.3 Commit

* `consumer`는 카프카 `broker`로부터 데이터를 어디까지 가져갔는지 `commit`을 통해 기록한다.
* 특정 `topic`의 `partition`을 어떤 `consumer`그룹이 몇 번째 가져갔는지 `broker` 내부에 기록된다.
* 오프셋 `commit` 은 명시적 또는 비명시적으로 수행할 수 있다.
* 기본 옵션은 `poll()` 메서드가 실행될 때 일정 간격마다 오프셋을 `commit` 하도록 `enable.auto.commit=ture`로 설정되어 있다.
  * 이것이 비명시적인 오프셋 `commit` 이다.
  * `auto.commit.interval.ms` 옵션으로 설정된 시간 이상이 지나면 현재까지 읽은 레코드의 오프셋을  `commit`한다.
  * `poll()` 메서드가 실행될 때 `commit` 도 수행되므로 따로 `commit`을 위한 코드를 작성할 필요는 없다.
  * 비명시 오프셋 `commit`은 편리하지만 데이터 중복 또는 유실될 가능성이 있으므로 선택시 고려가 필요하다.



# 2. 컨슈머 API

* `producer`가 전송한 데이터는 `broker`에 적재된다.
* `consumer`는 적재된 데이터를 사용하기 위해 `broker`로부터 데이터를 가져와 처리한다.



## 2.1 자바 컨슈머 애플리케이션

* 자바 애플리케이션으로 간단한 카프카 컨슈머를 구현해보자.

**디펜던시 추가**

```groovy
compile 'org.apache.kafka:kafka-clients:2.8.0'
```

```xml
<dependency>
	<groupId>org.apache.kafka</groupId>
	<artifactId>kafka-clients</artifactId>
	<version>2.8.0</version>
</dependency>
```



**SimpleConsumer.java 작성**

```java
import com.google.gson.Gson;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;
import java.util.Arrays;
import java.util.Properties;

public class SimpleConsumer {
    private final static Logger logger = LoggerFactory.getLogger(SimpleConsumer.class);
    private final static String TOPIC_NAME = "test";
    private final static String BOOTSTRAP_SERVERS = "my-kafka:9092";
    private final static String GROUP_ID = "test-group";

    public static void main(String[] args) {
        Properties configs = new Properties();
        configs.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, BOOTSTRAP_SERVERS);
        configs.put(ConsumerConfig.GROUP_ID_CONFIG, GROUP_ID);
        configs.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        configs.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());

        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(configs);

        consumer.subscribe(Arrays.asList(TOPIC_NAME));

        while (true) {
            ConsumerRecords<String, String> records = consumer.poll(Duration.ofSeconds(1));
            for (ConsumerRecord<String, String> record : records) {
                logger.info("record:{}", record);
            }
        }
    }
}
```

`ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG`

* 토픽 데이터를 가져올 카프카 클러스터의 IP, Port를 입력한다

`ConsumerConfig.GROUP_ID_CONFIG`

* 컨슈머 그룹을 선언한다.

> 컨슈머 그룹
>
> 컨슈머 그룹을 통해 컨슈머의 목적을 구분할 수 있다. 컨슈머 그룹을 기준으로 컨슈머 오프셋을 관리하기 때문에 subscribe() 메서드를 사용해 토픽을 구독하는 경우에는 컨슈머 그룹을 선언해야한다. 컨슈머가 중단되거나 재시작되더라도 컨슈머 그룹의 컨슈머 오프셋을 기준으로 이후 데이터를 처리한다. 컨슈머 그룹을 선언하지 않으면 어떤 그룹에도 속하지 않은 컨슈머로 동작한다.

`consumer.subscribe(Arrays.asList(TOPIC_NAME));`

* 컨슈머에게 토픽을 할당하기 위해 subscribe() 메서드를 사용한다.
* 1개 이상의 토픽 이름을 받을 수 있다.

`ConsumerRecords<String, String> records = consumer.poll(Duration.ofSeconds(1));`

* 컨슈머는 poll() 메서드를 통해 ConsumerRecords를 반환한다
* Duration 타입을 넘겨주는 이유는 브로커로부터 데이터를 가져올 때 컨슈머 버퍼에 데이터를 기다리기 위한 타임 아웃 간격을 설정하기 위함이다.



## 2.2 Consumer 옵션

**필수 옵션**

`bootstrap.servers` 

* `consummer`가 데이터를 가져올 대상 카프카 클러스터에 속한 브로커의 호스트 이름
* 포트를 1개 이상 작성한다.
* 2개 이상 브로커 정보를 입력하여 일부 브로커에 이슈가 발생하더라도 접속하는 데에 이슈가 없도록 설정 가능하다.

`key.serializer`

* 레코드의 메시지 키를 역직렬화하는 클래스를 지정한다.

`value.serializer`

* 레코드의 메시지 값을 역직렬화하는 클래스를 지정한다.

**선택 옵션**

`group.id`

* `consummer`의 그룹 아이디를 지정한다.
* `subscribe()`메서드로 `topic`을 구독하여 사용할 때 이 옵션을 필수로 넣어야한다. 기본값은 `null`이다.

`auto.offset.reset`

* `consummer` 그룹이 특정 `partition` 을 읽을 때 저장된 오프셋이 없는 경우 어느 오프셋부터 읽을지 설정한다.
* `auto.offset.reset=latest` : 가장 최근 오프셋부터 읽기 시작
* `auto.offset.reset=earliest` : 가장 낮은 오프셋부터 읽기 시작
* `auto.offset.reset=none` : `consummer` 그룹이 `commit` 한 기록이 있는지 확인 후 없다면 오류 반환 있으면 기존 `commit` 이후 오프셋부터 읽는다.

`enable.auto.commit`

* 자동 `commit` 을 설정한다.
* 기본값 `true`

`auto.commit.interval.ms`

* 자동 `commit`일 경우 오프셋 `commit` 간격을 지정한다.
* 기본값 5000(5초)

`max.poll.records`

* `poll()` 메서드를 통해 반환되는 `record` 의 개수를 설정한다.
* 기본값 500

`session.timeout.ms`

* `consummer`가 `broker` 와 연결이 끊기는 최대 시간을 설정한다.
* 이 시간 내에 하트 비트를 전송하지 않으면 `broker`는 `consumer`가 이슈가 발생했다고 가정하고 `rebalancing` 을 시작한다.
* 기본값 10000(10초)

`hartbeat.interval.ms`

* 하트비트를 전송하는 간격을 설정한다.
* 기본값 3000(3초)



## 2.3 동기 오프셋 commit

* `poll()` 메서드 이후에 `commitSync()` 메서드를 호출하여 오프셋을 명시적으로 `commit`할 수 있다.



**동기 오프셋 commit**

```java
public class ConsumerWithSyncCommit {
    private final static Logger logger = LoggerFactory.getLogger(ConsumerWithSyncCommit.class);
    private final static String TOPIC_NAME = "test";
    private final static String BOOTSTRAP_SERVERS = "my-kafka:9092";
    private final static String GROUP_ID = "test-group";

    public static void main(String[] args) {
        Properties configs = new Properties();
        configs.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, BOOTSTRAP_SERVERS);
        configs.put(ConsumerConfig.GROUP_ID_CONFIG, GROUP_ID);
        configs.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        configs.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        configs.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);

        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(configs);
        consumer.subscribe(Arrays.asList(TOPIC_NAME));

        while (true) {
            ConsumerRecords<String, String> records = consumer.poll(Duration.ofSeconds(1));
            for (ConsumerRecord<String, String> record : records) {
                logger.info("record:{}", record);
            }
            consumer.commitSync();
        }
    }
}
```

`consumer.commitSync();`

* `commitSync()` 는 `poll()` 메서드로 받은 가장 마지막 `record`의 오프셋을 기준으로 `commit` 한다.
* 동기 오프셋 커밋을 사용할 경우 `poll()` 메서드로 받은 모든 레코드의 처리가 끝난 이후 `commitSync()`을 호출해야한다.
* 동기 커밋의 경우 브로커로 커밋을 요청한 이후 커밋이 완료되기까지 기다린다.
  * `consumer`는 데이터를 더 처리하지 않고 기다리기 때문에 자동 커밋이나 비동기 오프셋 커밋보다 동일 시간당 처리량이 적다.
* `commitSync()` 에 파라미터를 넣지 않으면 `poll()` 메서드로 반환된 가장 마지막 레코드의 오프셋을 기준으로 `commit`한다.



## 2.4 비동기 오프셋 commit

* 동기 오프셋 커밋을 사용할 경우 커밋 응답을 기다리는 동안 데이터 처리가 일시적으로 중단되는 단점이있다.
* 이 때 비동기 오프셋 커밋을 사용할 수 있다.
* 비동기 오프셋 커밋은 `commitAsync()` 메서드를 호출해 사용한다.

```java
public class ConsumerWithASyncCommit {
    private final static Logger logger = LoggerFactory.getLogger(ConsumerWithASyncCommit.class);
    private final static String TOPIC_NAME = "test";
    private final static String BOOTSTRAP_SERVERS = "my-kafka:9092";
    private final static String GROUP_ID = "test-group";

    public static void main(String[] args) {
        Properties configs = new Properties();
        configs.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, BOOTSTRAP_SERVERS);
        configs.put(ConsumerConfig.GROUP_ID_CONFIG, GROUP_ID);
        configs.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        configs.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        configs.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);

        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(configs);
        consumer.subscribe(Arrays.asList(TOPIC_NAME));

        while (true) {
            ConsumerRecords<String, String> records = consumer.poll(Duration.ofSeconds(1));
            for (ConsumerRecord<String, String> record : records) {
                logger.info("record:{}", record);
            }
            consumer.commitAsync(new OffsetCommitCallback() {
                public void onComplete(Map<TopicPartition, OffsetAndMetadata> offsets, Exception e) {
                    if (e != null)
                        System.err.println("Commit failed");
                    else
                        System.out.println("Commit succeeded");
                    if (e != null)
                        logger.error("Commit failed for offsets {}", offsets, e);
                }
            });
        }
    }
}
```

* 동기 커밋과 마찬가지로 `poll()` 메서드로 반환된 가장 마지막 레코드의 오프셋을 기준으로 `commit`한다.

* OffsetCommitCallback 인터페이스

  * `commitAsync()` 의 응답을 받을 수 있도록 도와주는 콜백 인터페이스이다.

  * ```java
    public interface OffsetCommitCallback {
        void onComplete(Map<TopicPartition, OffsetAndMetadata> offsets, Exception exception);
    }
    ```

  * `onComplete()` 메서드를 통해 비동기 커밋의 응답을 확인할 수 있다.

  * 정상적으로 커밋되었다면 exception은 `null`이다.

  * 커밋 완료된 오프셋 정보가 offsets에 포함되어있다.



## 2.5 리밸런스 리스너를 가진 consumer

* `consumer` 그룹에서 `consumer`가 추가 또는 제거되면 `partition` 을 `consumer`에게 재할당하는 과정인 `rebalacing` 과정이 발생한다.
* `poll()` 메서드를 통해 반환받은 데이터를 모두 처리하기 전에 `rebalacing` 이 일어나면 데이터를 중복 처리할 수 있다.
  * 데이터 중 일부를 처리했으나 아직 커밋하지 않았기 때문이다.
* `rebalacing` 발생 시 데이터를 중복 처리하지 않게 하기 위해서는 `rebalacing` 발생 시 처리한 데이터를 기준으로 `commit`을 시도해야한다.
* `rebalacing` 발생 감지를 위해 카프카 라이브러리는 `ConsumerRebalanceListener` 인터페이스를 지원한다.



**ConsumerRebalanceListener 인터페이스**

```java
package org.apache.kafka.clients.consumer;

public interface ConsumerRebalanceListener {
  void onPartitionsRevoked(Collection<TopicPartition> partitions);
  void onPartitionsAssigned(Collection<TopicPartition> partitions);
  ...
}
```

* `onPartitionsAssigned()` 
  * `rebalacing` 이 끝난 뒤에 파티션이 할당 완료되면 호출되는 메서드이다.
* `onPartitionsRevoked()`
  * `rebalacing` 이 시작되기 직전에 호출되는 메서드이다
  * 이 메서드를 통해 `rebalacing` 이 되기전 마지막 처리한 레코드를 기준으로 커밋을해 데이터 중복 처리를 방지할 수 있다.



**리밸런스 리스너를 가진 consumer**

```java
public class ConsumerWithRebalanceListener {
    private final static Logger logger = LoggerFactory.getLogger(ConsumerWithRebalanceListener.class);
    private final static String TOPIC_NAME = "test";
    private final static String BOOTSTRAP_SERVERS = "my-kafka:9092";
    private final static String GROUP_ID = "test-group";


    private static KafkaConsumer<String, String> consumer;
    private static Map<TopicPartition, OffsetAndMetadata> currentOffsets = new HashMap();

    public static void main(String[] args) {
        Properties configs = new Properties();
        configs.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, BOOTSTRAP_SERVERS);
        configs.put(ConsumerConfig.GROUP_ID_CONFIG, GROUP_ID);
        configs.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        configs.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        configs.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);

        consumer = new KafkaConsumer<>(configs);
        consumer.subscribe(Arrays.asList(TOPIC_NAME), new RebalanceListener());
        while (true) {
            ConsumerRecords<String, String> records = consumer.poll(Duration.ofSeconds(1));
            for (ConsumerRecord<String, String> record : records) {
                logger.info("{}", record);
                currentOffsets.put(new TopicPartition(record.topic(), record.partition()),
                        new OffsetAndMetadata(record.offset() + 1, null));
                consumer.commitSync(currentOffsets);
            }
        }
    }

    private static class RebalanceListener implements ConsumerRebalanceListener {
        public void onPartitionsAssigned(Collection<TopicPartition> partitions) {
            logger.warn("Partitions are assigned");

        }
        public void onPartitionsRevoked(Collection<TopicPartition> partitions) {
            logger.warn("Partitions are revoked");
            consumer.commitSync(currentOffsets);
        }
    }
}
```

`configs.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);`

* `rebalacing` 발생 시 수동 커밋을 위해 false로 설정

`consumer.subscribe(Arrays.asList(TOPIC_NAME), new RebalanceListener());`

* 앞서 구현한 `rebalacing` 클래스를 `subscribe()` 메서드에 파라미터로 넘긴다.

`currentOffsets.put(new TopicPartition(record.topic(), record.partition()), new OffsetAndMetadata(record.offset() + 1, null));`

* 레코드의 데이터 처리가 끝나면 레코드가 속한 토픽, 파티션, 오프셋에 관한 정보를 `currentOffsets`에 담는다.
* currentOffsets은 오프셋 지정 커밋 시에 사용된다.

`RebalanceListener` 클래스의 `consumer.commitSync(currentOffsets);`

* `rebalacing` 발생하면 가장 마지막으로 처리 완료한 레코드를 기준으로 커밋을 실행한다.
* 이를통해 데이터 중복을 방지할 수 있다.



## 2.6 Consumer의 안전한 종료

* 정상적으로 종료되지 않은 `consumer` 는 세션 타임아웃이 발생할때가지 `consumer` 그룹에 남게된다.
  * 더는 동작하지 않는 `consumer` 때문에 파티션의 데이터는 소모되지 못하고 `consumer` 랙이 늘어나게 된다.
  * `consumer` 랙이 늘어나면 데이터 처리 지연이 발생하게 된다.
* `KafkaConsumer` 의 `wakeup()` 메서드를 통해 `KafkaConsumer` 인스턴스를 안전하게 종료할 수 있다.
* `wakeup()` 메서드 이후 `poll()` 메서드가 호출되면 `WakeupException` 예외가 발생한다.

```java
public class ConsumerWithSyncOffsetCommit {
    private final static Logger logger = LoggerFactory.getLogger(ConsumerWithSyncOffsetCommit.class);
    private final static String TOPIC_NAME = "test";
    private final static String BOOTSTRAP_SERVERS = "my-kafka:9092";
    private final static String GROUP_ID = "test-group";
    private static KafkaConsumer<String, String> consumer;

    public static void main(String[] args) {
        Runtime.getRuntime().addShutdownHook(new ShutdownThread());

        Properties configs = new Properties();
        configs.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, BOOTSTRAP_SERVERS);
        configs.put(ConsumerConfig.GROUP_ID_CONFIG, GROUP_ID);
        configs.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        configs.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        configs.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);

        consumer = new KafkaConsumer<>(configs);
        consumer.subscribe(Arrays.asList(TOPIC_NAME));

        try {
            while (true) {
                ConsumerRecords<String, String> records = consumer.poll(Duration.ofSeconds(1));
                for (ConsumerRecord<String, String> record : records) {
                    logger.info("{}", record);
                }
            }
        } catch (WakeupException e) {
            logger.warn("Wakeup consumer");
        } finally {
            consumer.close();
        }
    }

    static class ShutdownThread extends Thread {
        public void run() {
            logger.info("Shutdown hook");
            consumer.wakeup();
        }
    }
}
```

* `poll()` 메서드를 통해 레코드를 받아 처리하다가 `wakeup()` 메서드가 호출된 이후 `poll()` 메서드가 호출될 때 WakeupException 예외가 발생한다.
* `wakeup()` 메서드를 호출하기 위해선 셧다운 훅을 구현해야한다.
  * 셧다운 훅이랑 사용자 또는 운영체제로부터 종료 요청을 받으면 실행되는 스레드를 뜻한다.
  * 셧다운 훅이 발생되면 사용자가 정의한 ShutdownThread 스레드가 실행되면서 `wakeup()` 메서드가 호출되어 컨슈머를 안전하게 종료할 수 있다.

