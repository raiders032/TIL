# 1. Spring Cloud Config

> Spring Cloud Config는 분산 시스템에서 외부화 된 configuration을 위한 서버 측 및 클라이언트 측 지원을 제공합니다. Config Server를 사용하면 모든 환경에서 애플리케이션의 외부 속성을 중앙에서 관리할 수 있습니다. 클라이언트와 서버의 개념은 Spring 환경 및 PropertySource 추상화와 동일하게 매핑되므로 Spring 애플리케이션과 매우 잘 맞지만 모든 언어로 실행되는 모든 애플리케이션에서 사용할 수 있습니다. 애플리케이션이 배포 파이프라인을 통해 개발에서 테스트 및 운영 환경으로 이동할 때 이러한 환경 간의 구성을 관리하고 애플리케이션이 마이그레이션 시 실행해야 하는 모든 사항을 충족할 수 있습니다.서버 스토리지 백엔드의 기본 구현은 git을 사용하므로 레이블이 지정된 configuration 환경 버전을 쉽게 지원할뿐만 아니라 콘텐츠 관리를위한 다양한 도구에 액세스 할 수 있습니다. 대체 구현을 추가하고이를 Spring 구성으로 연결하는 것은 쉽습니다.

* 분산 시스템에서 서버 클라이언트 구성에 필요한 configuration 정보를 외부 시스템에서 관리
* 하나의 중앙화 된 저장소에서 구성요소 관리
* 각 서비스를 다시 빌드하지 않고, 바로 적용 가능
* 애플리케이션 배포 파이프라인을 통해 dev-test-prod 환경에 맞는 구성 정보 사용

# 2. Spring Cloud Config Server

> Spring Cloud Config Server는 외부 configuration (이름-값 쌍 또는 YAML 콘텐츠)을위한 HTTP 리소스 기반 API를 제공합니다. 

**dependency 추가**

```xml
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-config-server</artifactId>
</dependency>
```



**Config Server 실행 방법**

* Config 서버는 `@EnableConfigServer` 어노테이션을 사용하여 Spring Boot 애플리케이션에 임베드 할 수 있습니다. 결과적으로 아래는 애플리케이션은 Config Server 입니다.

```java
@SpringBootApplication
@EnableConfigServer
public class ConfigServer {
  public static void main(String[] args) {
    SpringApplication.run(ConfigServer.class, args);
  }
}
```



**Config Server configuration**

* Spring Boot 애플리케이션과 마찬가지로 기본적으로 포트 8080에서 실행되지만  8888 포트가 컨벤션이다.
* `spring.cloud.config.server.git.uri` : configuration(YAML 및 properties 파일)이 저장된 깃 저장소를 지정
* 여기서 `${user.home}/config-repo`는 YAML 및 properties 파일이 포함 된 git 저장소입니다.

```yml
server:
  port: 8888
spring:
  application:
    name: config-service
  cloud:
    config:
      server:
        git:
          uri: file://${user.home}/config-repo
```

> git 저장소에 로컬 파일 시스템을 사용하는 것은 테스트용입니다.



**깃 저장소에 configuration 파일 만들기**

* 앞서 지정한 깃 저장소에 아래와 같이 `ecommerce.yml` 이라는 이름으로 configuration 파일을 만들어 보자.

```yml
token:
  expiration_time: 86400000
  secret: user_token

gateway:
  ip: 192.168.0.12
```

* 서버를 기동하고 http://localhost:8888/ecommerce/default 요청에 대한 응답

```json
// 20210531222910
// http://localhost:8888/ecommerce/default

{
  "name": "ecommerce",
  "profiles": [
    "default"
  ],
  "label": null,
  "version": "c99217a8823b3d63d38fcc75b5831a438817906f",
  "state": null,
  "propertySources": [
    {
      "name": "file://Users/YT/Desktop/project/study-spring-cloud/git-local-repo/ecommerce.yml",
      "source": {
        "token.expiration_time": 86400000,
        "token.secret": "user_token",
        "gateway.ip": "192.168.0.12"
      }
    }
  ]
}
```



## 2.1 Environment Repository

* Config Server가 가지고 있는 configuration이 저장되는 곳
* git, file system 등이 있다.



# 3. Spring Cloud Config Client

**dependency 추가**



## 3.1 Config First Bootstrap

* Config Server를 사용하려는 모든 클라이언트 애플리케이션에 `bootstrap.yml`이 필요합니다.

* Config Server에 연결하려면 부트스트랩을 활성화해야 합니다

  * `spring-cloud-starter-bootstrap starter` 디펜던시 추가를 통해 활성화 할 수 있다.
  * 또는 `spring.cloud.bootstrap.enabled=true` 로 설정해서 활성화한다.

* 부트스트랩을 활성화하면 클래스 경로에 `Spring Cloud Config Client`가 있는 애플리케이션이 Config Server에 연결됩니다. 

  * 클라이언트가 시작되면 Config 서버에 바인딩되고( `bootstrap.yml` 에 정의된 `spring.cloud.config.uri` 로 바인딩)
  * 원격 property 소스를 사용하여 Spring Environment를 초기화합니다.

  









