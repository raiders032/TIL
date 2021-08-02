# 1. [Spring Cloud Bus](https://docs.spring.io/spring-cloud-bus/docs/3.0.3/reference/html/#bus-endpoints)

> Spring Cloud Bus는 분산 시스템의 노드를 경량 메시지 브로커와 연결합니다. 그런 다음이 브로커를 사용하여 상태 변경 (예 : configuration 변경)등을 브로드 캐스트 할 수 있습니다. 핵심 아이디어는 버스가 확장 된 Spring Boot 애플리케이션을위한 분산 actuator 같다는 것입니다. 그러나 앱 간의 통신 채널로도 사용할 수 있습니다.
>
> 현재 버스는 특정 서비스 (Eureka에서 정의한대로)를 수신하는 모든 노드 또는 모든 노드에 메시지를 보내는 것을 지원합니다. 두 가지의 엔드포인트를 제공합니다. 첫 번째 엔드포인트 `/bus/env`는 키/값 쌍을 전송하여 각 노드의 Spring 환경을 업데이트합니다. 두 번째 엔드포인트 `/bus/refresh`는 마치 `/refresh` 엔드포인트가 호출된 것처럼 각 응용 프로그램의 configuration을 다시 로드합니다.



**마이크로 서비스의 configuration 변경을 위한 방식 3가지**

1. 서버 재기동

   * 고려할 가치가 없다

2. `Spring Boot Actuator` 이용

   * `actuator/refresh` 엔드포인트를 이용 서버의 configuration를 다시 읽도록 한다.

   * 각각의 마이크로 서비스에 refresh를 호출하는 것이 번거롭다.

3. `Spring Cloud Bus`

   * 상태 및 구성에 대한 변경 사항을 연결된 마이크로 서비스들에게 전달한다.



**Spring Cloud Bus 실행하기**

* Spring Cloud Bus를 활성화 하려면 `spring-cloud-starter-bus-amqp` 또는 `spring-cloud-starter-bus-kafka` 을 추가한다.
* 나머지는 스프링클라우드(Spring Cloud)가 처리한다.
* 브로커(RabbitMQ 또는 Kafka)가 정상 작동되고 있는지 확인한다.
* 브로커가 로컬 호스트에서 실행될 때는 아무 작업도 수행할 필요가 없습니다
* 브로커가 원격으로 실행하는 경우 Rabbit의 다음 예와 같이 브로커를 정의합니다.
  * 마이크로 서비스(Api gateway 서버, Cloud Config 서버 등)에서 아래와 같이 설정한다.

```yaml
spring:
  rabbitmq:
    host: mybroker.com
    port: 5672
    username: user
    password: secret
```



# 2. Bus Endpoints

* Spring Cloud Bus는 `/actuator/busrefresh` 와 `/actuator/busenv` 2가지 엔드포인트를 제공한다.
* Spring Cloud Bussms 분산 Spring Boot Actuator 같다.
  * `/actuator/busrefresh` : 개별 Actuator endpoint `/actuator/refresh` 와 같다. 
  *  `/actuator/busenv` : 개별 Actuator endpoint `/actuator/env` 와 같다.



## 2.1 Bus Refresh Endpoint

* `/actuator/busrefresh` 엔드 포인트는 RefreshScope 캐시를 지우고 `@ConfigurationProperties`를 리바인드한다.



## 2.2 Bus Env Endpoint

* `/actuator/busenv` 엔드 포인트는 여러 인스턴스에서 지정된 키 / 값 쌍으로 각 인스턴스 환경을 업데이트한다.

* `/actuator/busenv` 엔드 포인트는 POST 요청을 받는다.

  * ```json
    {
        "name": "key1",
        "value": "value1"
    }
    ```



참고

* https://docs.spring.io/spring-cloud-bus/docs/current/reference/html/