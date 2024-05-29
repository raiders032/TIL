# 1 Spring Data Redis

- Spring Data Redis는 Redis 데이터 액세스를 위한 스프링 기반 모듈로, 복잡한 Redis 명령어와 연결 관리를 단순화합니다.
- 이를 통해 개발자는 더 직관적으로 데이터 작업을 수행할 수 있습니다.

<br>

# 2 Pub/Sub Messaging

- [레퍼런스](https://docs.spring.io/spring-data/redis/reference/redis/pubsub.html)
- Spring Data Redis는 Redis를 이용한 발행/구독(Pub/Sub) 메시징 패턴을 지원합니다.
- 이는 메시지를 발행하는 측과 이를 구독하는 측으로 나누어져, 비동기 메시징 시스템을 구축할 수 있게 합니다.
- 메시지는 `RedisTemplate`을 사용해 발행되며, `RedisMessageListenerContainer`를 통해 메시지가 비동기적으로 수신됩니다.
- 사용자 정의 메시지 리스너를 통해 수신된 메시지를 처리할 수 있습니다.

<br>

## 2.1 Publishing (Sending Messages)

- 메시지를 게시하려면 하위 수준 'RedisConnection' 및 상위 수준 'RedisOperations' 엔터티를 모두 사용할 수 있습니다.
	-  각각은 'publish' 메서드를 제공합니다. 
- 이 방법에는 메시지와 대상 채널이 매개변수로 필요합니다.
- 'RedisConnection'은 원시 데이터(바이트 배열)를 요구하는 반면, 'RedisOperations'는 임의의 개체를 메시지로 전달할 수 있습니다. 다음 예에서는 명령형 접근 방식과 반응형 접근 방식을 모두 보여줍니다.

<br>

**예시**

```java
// Send message through RedisConnection
RedisConnection con = …;
byte[] msg = …;
byte[] channel = …;
con.pubSubCommands().publish(msg, channel);

// Send message through RedisOperations
RedisOperations operations = …;
Long numberOfClients = operations.convertAndSend("hello!", "world");
```

<br>

## 2.2 Subscribing (Receiving Messages)

- 수신을 위해서는 직접 또는 패턴 매칭을 통해 채널을 구독할 수 있습니다.
	- 패턴 매칭을 통해 하나의 명령으로 여러 채널을 구독할 수 있고 심지어 현재 존재하지 않는 채널에 대해서도 구독을 할 수 있습니다.
- 하위 수준 `RedisConnection`은 이러한 목적을 위해 'subscribe' 및 'pSubscribe' 메서드를 제공합니다.
- 구독 명령은 blocking 된다.
	- `subscribe`를 호출하면 현재 스레드가 구독이 취소될 때까지 메시지를 기다리게 됩니다.
	- 해당 스레드는 구독을 취소할 경우에만 릴리즈 된다.

<br>

## 2.3 RedisMessageListenerContainer

- `RedisMessageListenerContainer`는 논블로킹 특성과 효율적인 연결 및 스레드 관리로 인해 하위 수준 구독에 비해 더 사용자 친화적인 접근 방식을 제공합니다.
	- 즉 `RedisConnection`을 직접 사용하는 것보다 편리합니다.
- `RedisMessageListenerContainer`은 메시지 리스너 컨테이너로 작동합니다.
- 이것은 Redis 채널로부터 메시지를 수신하고 RedisMessageListenerContainer에 주입된 MessageListener 인스턴스를 작동시키는 데 사용됩니다.
- 리스너 컨테이너는 메시지 수신과 리스너로의 전달을 위한 모든 쓰레딩을 담당합니다.
- 메시지 리스너 컨테이너는 MDP와 메시징 제공자 사이의 중재자로서, 메시지 수신을 위한 등록, 리소스 획득 및 해제, 예외 변환 등을 처리합니다.
	- MDP는 메시지를 수신할 때 특정 작업을 수행하도록 설계된 자바 클래스를 의미합니다.
- 이를 통해 응용 프로그램 개발자는 메시지를 수신하고 그에 반응하는 것과 관련된 (복잡할 수 있는) 비즈니스 로직을 작성할 수 있으며, 기본적인 Redis 인프라 관련 문제는 프레임워크에 위임하게 됩니다.

<br>

## 2.4 MessageListenerAdapter

- `MessageListenerAdapter`를 사용하면 `MessageListener` 인터페이스를 직접 구현할 필요 없이 거의 모든 클래스가 메시지 기반 POJO(MDP)로 작동할 수 있습니다. 
- 이 어댑터를 사용하면 수신된 메시지 유형에 따라 메서드별 처리가 가능합니다.


참고

- https://docs.spring.io/spring-data/redis/reference/