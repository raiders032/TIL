# 1 Spring Boot Actuator

- Spring Boot Actuator는 프로덕션에서 Spring Boot 애플리케이션을 모니터링하고 관리하는 데 도움이 되는 여러 가지 추가 기능이 포함되어 있다. 
- HTTP Endpoints 또는 JMX를 사용하여 응용프로그램을 관리 및 모니터링하도록 선택할 수 있다. 
- Actuator를 적용하면 Auditing, health, metrics 정보를 자동으로 모아주며 이러한 정보를 우리가 사용할 수 있다.



## 1.1 Spring Boot Actuato 의존성 추가하기

**메이븐**

```xml
<dependencies>
	<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-actuator</artifactId>
	</dependency>
</dependencies>
```



**그래들**

```groovy
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
}
```



# 2 Endpoints

- Actuator의 Endpoints을 사용하여 응용 프로그램을 모니터링하고 상호 작용할 수 있다.
- Spring Boot에는 여러 기본 제공 엔드포인트가 포함되어 있으며 사용자가 자신의 엔드포인트를 추가할 수 있다.
  - 예를 들어 `health` endpoint은 기본 애플리케이션의 상태 정보를 제공한다.

- HTTP 또는 JMX를 통해 각 개별 엔드포인트를 활성화할 수 있다. 
- 엔드포인트는 활성화되고 동시에 노출되었을 때 사용할 수 있는 것으로 간주된다. 
- 대부분의 응용 프로그램은 HTTP를 통해 엔드포인트를 노출한다.
- 이러한 엔드포인트의 Path는 접두사와 endpoint ID를 이용해 만들어진다.
  - `health`의 endpoint id와 접두사(/actuator)를 가지고 `actuator/health` Path를 만든다.



**엔드포인트 ID와 설명**

| Endpoint ID    | Description                                                  |
| :------------- | :----------------------------------------------------------- |
| auditevents    | Exposes audit events (e.g. auth_success, order_failed) for your application |
| info           | Displays information about your application.                 |
| health         | Displays your application’s health status.                   |
| metrics        | Shows various metrics information of your application.       |
| loggers        | Displays and modifies the configured loggers.                |
| logfile        | Returns the contents of the log file (if `logging.file` or `logging.path` properties are set.) |
| httptrace      | Displays HTTP trace info for the last 100 HTTP request/response. |
| env            | Displays current environment properties.                     |
| flyway         | Shows details of Flyway database migrations.                 |
| liquidbase     | Shows details of Liquibase database migrations.              |
| shutdown       | Lets you shut down the application gracefully.               |
| mappings       | Displays a list of all @RequestMapping paths.                |
| scheduledtasks | Displays the scheduled tasks in your application.            |
| threaddump     | Performs a thread dump.                                      |
| heapdump       | Returns a GZip compressed JVM heap dump.                     |

web application (Spring MVC, Spring WebFlux, or Jersey)인 경우 아래의 endpoint도 이용할 수 있다.

| ID           | Description                                                  |
| :----------- | :----------------------------------------------------------- |
| `heapdump`   | Returns an `hprof` heap dump file. Requires a HotSpot JVM.   |
| `jolokia`    | Exposes JMX beans over HTTP (when Jolokia is on the classpath, not available for WebFlux). Requires a dependency on `jolokia-core`. |
| `logfile`    | Returns the contents of the logfile (if `logging.file.name` or `logging.file.path` properties have been set). Supports the use of the HTTP `Range` header to retrieve part of the log file’s content. |
| `prometheus` | Exposes metrics in a format that can be scraped by a Prometheus server. Requires a dependency on `micrometer-registry-prometheus`. |



## 2.1 Endpoints 활성화(비활성화)하기

- 기본적으로 모든 endpoint은 활성화 되어 있다. (shutdown 빼고) 
- properties파일을 통해 endpoint를 활성화하고 비활성화 할 수 있다.



**예시**

- shutdown 엔드포인트 활성화하기

```yml
management:
  endpoint:
    shutdown:
      enabled: true
```



## 2.2 Endpoints 공개하기

- 기본적으로 HTTP상에서 `health` 엔드포인트만 공개되어 있다.

```yml
management:
  endpoints:
    web:
      exposure:
        include: "*" # 공개
        exclude: "env,beans" # 비공개
```

<br>

## 2.3 Kubernetes Probes

- [레퍼런스](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html#actuator.endpoints.kubernetes-probes)
- 애플리케이션을 쿠버네티스에 배포한다면  `kubelet`이 컨테이너의 상태를 진단하는데 이를 `probe `라고 한다.
- `kubelet`이 컨테이너의 `Liveness` 와  `Readiness`를 판단해 적잘한 조치를 취한다.
- 기본적으로 Spring Boot는 애플리케이션의 상태를 관리하는데 이러한 정보를 Actuator를 통해 kubelet이 컨테이너의 상태를 진단하도록 정보를 전달할 수 있다.
- 

<br>

# 3 HTTP

- [레퍼런스](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html#actuator.monitoring)
- HTTP를 이용해 애플리케이션을 모니터링하고 관리할 수 있다.



## 3.1 Endpoint Paths 커스텀

- Endpoint의 prefix는 기본적으로 `/actuator`로 설정되어 있다.
- 이 prefix를 수정하려면 아래와 같이 설정한다.
  - info endpoint의 경우 `actuator/info` 에서 `/manage/info`로 Path가 변경된다.

```yaml
management:
  endpoints:
    web:
      base-path: "/manage"
```



# 4 Loggers



# 5 Metrics



# 6 Tracing



참고

* https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html#actuator



더 보기

- [Actuator 안전하게 사용하기](https://techblog.woowahan.com/9232/)
