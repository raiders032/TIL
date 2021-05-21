# Spring Cloud Netflix

> Spring Cloud Netflix는 스프링 부트 앱에 대한 넷플릭스 OSS integrations을 자동 구성 및 스프링 환경 및 기타 스프링 프로그래밍 모델에 바인딩하여 제공한다. 몇 가지 간단한 주석을 사용하면 애플리케이션 내부의 공통 패턴을 빠르게 활성화 및 구성하고, 검증된 Netflix 구성 요소를 사용하여 대규모 분산 시스템을 구축할 수 있습니다. 제공되는 패턴에는 서비스 검색(Eureka), 회로 차단기(Hystrix), 지능형 라우팅(Zuul) 및 클라이언트 측 부하 분산(Ribbon)이 포함됩니다.



## Spring Cloud Netflix 특징

서비스 검색

* 유레카 인스턴스를 등록할 수 있으며 클라이언트는 스프링이 관리하는 빈를 사용하여 인스턴스를 검색할 수 있습니다.

서비스 검색

* 등록할 Eureka 서버를 declarative Java configuration으로 만들 수 있습니다.

회로 차단기

* 간단한 주석 기반 메서드 데코레이터로 Hystrix 클라이언트를 구축할 수 있습니다.

회로 차단기

* declarative Java configuration이포함 된 임베디드 Hystrix 대시 보드

Declarative REST 클라이언트

* Feign은 JAX-RS 또는 Spring MVC 주석으로 인터페이스의 동적 구현을 생성합니다.

클라이언트 측 로드 밸런서

* 리본

외부 구성

* Spring Environment에서 Archaius로 연결되는 브리지(Spring Boot 규칙을 사용하여 Netflix 구성 요소를 네이티브로 구성할 수 있음)

라우터 및 필터

* Zuul 필터의 자동 등록 및 역방향 프록시 생성을 위한 구성 접근 방식



## Service Discovery

> Service Discovery는 마이크로 서비스 기반 아키텍처의 핵심 원칙 중 하나입니다. 각 클라이언트 또는 특정 형식의 규칙을 직접 구성하는 것은 어렵고 취약 할 수 있습니다. Eureka는 서비스 검색 서버 및 클라이언트입니다. 각 서버는 등록 된 서비스에 대한 상태를 다른 서버에 복제하여 서버를 고가용성으로 구성하고 배포 할 수 있습니다.



## Service Discovery: Eureka Client

* Eureka  Server에 등록 할 Eureka Client



**dependency 추가**

* `spring-cloud-starter-netflix-eureka-client`

```xml
<dependencies>        
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
</dependencies>
```



**Eureka 클라이언트 실행 방법**

* `@EnableDiscoveryClient` 어노테이션을 붙인다.

```java
@SpringBootApplication
@EnableDiscoveryClient
public class UserServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }

}
```



**유레카 Server에 등록**

> 클래스 경로에 `spring-cloud-starter-netflix-eureka-client`를 설정하면 응용 프로그램이 자동으로 Eureka Server에 등록됩니다. 다음 예와 같이 Eureka 서버를 찾으려면 Configuration 이 필요합니다.

```yaml
eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
```

```yaml
spring:
  application:
    name: user-service
```

![image-20210521091031324](.\images\.gitignore)

* `spring.application.name`으로 등록된 유레카 클라이언트를 유레카 서버에서 위와같이 확인할 수 있다



**유레카 인스턴스 ID 변경**

* 기본적으로 인스턴스는 호스트 이름과 동일한 ID로 등록됩니다. 아래는 기본 값
* `${spring.cloud.client.hostname}:${spring.application.name}:${spring.application.instance_id:${server.port}}}`
  * ex) myhost:myappname:8080
* 다음 예제와 같이 eureka.instance.instanceId에 고유 식별자를 제공하여이 인스턴스 ID 값을 재정의 할 수 있다.
* `server.port` 를 이용해 하나의 서비스를 서로 다른 포트의 인스턴스로 기동할 수 있으나 인스턴스 ID 값이 같아 유레카 서버에는 하나의 인스턴스만 등록되는 것을 방지하기위해 각각의 인스턴스마다 고유의 인스턴스 ID를 부여하는 예시

```yaml
server:
  port: 0
eureka:
  instance:
    instance-id: ${spring.cloud.client.hostname}:${spring.application.instance_id:${random.value}}
```



## Service Discovery: Eureka  Server

* Eureka Client를 등록할 수 있는 Eureka  Server
* 사용자의 요청 정보에 따라 해당되는 서비스가 어디에 있는지 그 위치를 알려주는 역할을 한다.



**dependency 추가**

* `spring-cloud-starter-netflix-eureka-server`

```xml
 <dependencies>        
		<dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
        </dependency>
</dependencies>
```



**Eureka 서버 실행 방법**

* `@EnableEurekaServer` 아래와 같이 어노테이션 붙이기

```java
@SpringBootApplication
@EnableEurekaServer
public class Application {

    public static void main(String[] args) {
        new SpringApplicationBuilder(Application.class).web(true).run(args);
    }

}
```



## Standalone Mode

* Eureka 서버를 하나 실행하는 모드

> 기본적으로 모든 Eureka 서버도 Eureka 클라이언트이며 피어를 찾으려면 서비스 URL이 하나 이상 필요합니다. 서비스를 제공하지 않으면 서비스가 실행되어 작동하지만 피어에 등록할 수 없다는 많은 로그가 발생하므로 아래와 같이 설정하면 Standalone Mode로 실행되므로 더이상 로그가 발생하지 않습니다.

```yml
eureka:
  client:
    register-with-eureka: false
    fetch-registry: false
```



## Peer Awareness

> Eureka는 여러 인스턴스를 실행하고 서로 등록하도록 요청함으로써 훨씬 더 복원력을 높일 수 있습니다. Peer를 등록하는 것이 기본 동작이므로 다음 예와 같이 피어에 유효한 serviceUrl을 추가하면 됩니다.

```yml
---
spring:
  profiles: peer1
eureka:
  instance:
    hostname: peer1
  client:
    serviceUrl:
      defaultZone: https://peer2/eureka/

---
spring:
  profiles: peer2
eureka:
  instance:
    hostname: peer2
  client:
    serviceUrl:
      defaultZone: https://peer1/eureka/
```



##  a list of common Spring Cloud Netflix properties

| Name                               | Default | Description                                                  |
| :--------------------------------- | :------ | :----------------------------------------------------------- |
| eureka.client.register-with-eureka | true    | 이 인스턴스가 다른 사용자가 검색하기 위해 eureka 서버에 정보를 등록해야 하는지 여부를 나타냅니다 |