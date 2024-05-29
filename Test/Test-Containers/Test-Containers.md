# 1 testcontainers

- Testcontainers는 JUnit 테스트에서 Docker 컨테이너를 관리하기 위한 Java 라이브러리입니다.
- 이를 사용하면 테스트를 실행할 때 Docker 컨테이너를 프로그래밍 방식으로 생성, 시작 및 중지할 수 있습니다.
- Testcontainers를 사용하면 애플리케이션 코드에서 실제 서비스(예: 데이터베이스, 메시지 브로커 또는 기타 종속성)와 상호 작용하는 통합 테스트를 작성할 수 있습니다.

<br>

# 2 의존성

```groovy
testImplementation "org.junit.jupiter:junit-jupiter:5.8.1" testImplementation "org.testcontainers:testcontainers:1.19.7" testImplementation "org.testcontainers:junit-jupiter:1.19.7"
```

<br>

# 3 Docker Compose 모듈

- Testcontainers의 Docker Compose 모듈을 사용하면 docker-compose.yml 파일에 정의된 서비스들을 테스트에 활용할 수 있습니다.
- 이를 통해 개발자나 테스트 엔지니어는 실제 Docker Compose를 설치하지 않고도 테스트를 수행할 수 있습니다.
- Testcontainers는 내부적으로 임시 Docker Compose 클라이언트를 컨테이너로 실행하여 이를 가능하게 합니다

<br>

## 3.1 사용법

```java
@ClassRule
public static DockerComposeContainer environment =
    new DockerComposeContainer(new File("src/test/resources/compose-test.yml"))
            .withExposedService("redis_1", REDIS_PORT)
            .withExposedService("elasticsearch_1", ELASTICSEARCH_PORT);
```

- 위 예시에서는 compose-test.yml 파일을 사용하여 Redis와 Elasticsearch 서비스를 정의하고 있습니다.
- 이 때, YAML 파일에서 포트를 노출할 필요는 없습니다.
- Testcontainers는 Compose로 관리되는 컨테이너와 테스트에서 접근 가능한 포트 사이에서 프록시 역할을 하는 경량 프록시 컨테이너를 실행합니다.

<br>

## 3.1 테스트에서 컨테이너 접근

```java
String redisUrl = environment.getServiceHost("redis_1", REDIS_PORT)
                    + ":" +
                  environment.getServicePort("redis_1", REDIS_PORT);
```

- Testcontainers는 테스트에서 컨테이너와 상호작용할 수 있는 방법을 제공합니다.
- getServiceHost(serviceName, servicePort)
	- 컨테이너가 수신 대기 중인 IP 주소를 반환합니다.
- getServicePort(serviceName, servicePort)
	- 노출된 포트에 대해 Docker에서 매핑된 포트를 반환합니다.