# 1 Spring Log

- 스프링에서는 따로 설정하지 않는한 기본적으로 Apache의 **Jakarta Common Logging(JCL)을 사용한다.
- JCL은 인터페이스로 대표적인 구현체로 **Log4j** 와 **Logback**이 존재한다.



## 1.1 JCL

- 



## 1.2 SLF4j

- SLF4J는 simple front-facing facade다.
- 주요 이점은 로깅 프레임워크 간에 쉽게 전환할 수 있다는 것입니다. 
  - Logback에서 Log4j, Log4j2 또는 JUL로 로깅을 쉽게 전환할 수 있다.



# 2 Log4j

- Log4j는 가장 오래된 프레임워크이며 Apache 의 Java 기반 Logging Framework다.
- xml, properties 파일로 로깅 환경을 구성하고, 콘솔 및 파일 출력의 형태로 로깅을 할 수 있게 도와준다.
- 로그 레벨의 경우는 6단계로 구성되어있다.
- 현재는 2015년 기준으로 개발이 중단되었다.
	- 다음 버전인 **log4j2**가 존재한다.



# 3 Logback

- Logback 은 log4j 이후에 출시된 Java 기반 Logging Framework 중 하나로 가장 널리 사용되고 있다. 
- `SLF4j` 의 구현체이며 Spring Boot 환경이라면 별도의 dependency 추가 없이 기본적으로 포함되어 있다.
	- Springboot 환경의 경우는 spring-boot-starter-web안에 spring-boot-starter-logging의 logback이 기본적으로 포함되어 있어서 별다른 dependency 추가 없이 사용할 수 있다.
- SLF4J 는 JCL 의 가진 문제를 해결하기 위해 클래스 로더 대신에 컴파일 시점에서 구현체를 선택하도록 변경시키기 위해 도입된 것이다. 
- Logback 은 log4j 에 비해 향상된 필터링 정책, 기능, 로그 레벨 변경 등에 대해 서버를 재시작할 필요 없이 자동 리로딩을 지원한다는 장점이 있다.
- Logback 은 5단계의 로그 레벨을 가진다.

<br>

## 3.1 Logback 설정 파일

- `logback-spring.xml` 파일에 Logback을 설정한다.
	- application.yml을 통해 Logback 설정이 가능하지만 기능의 한계로 logback-spring.xml을 사용한다.
- logback-spring.xml의 위치는 `src/main/resources/logback-spring.xml`
- `logback-spring.xml`은 `appender`와 `logger`로 구성된다.



**appender**

- `appender`는 콘솔, 파일, DB 등 로그를 출력하는 방법을 지정할 수 있으며,



**logger**

- logger는 출력할 곳을 설정한다.



**patter 작성법**

- [참조](https://logback.qos.ch/manual/layouts.html#conversionWord)

| Conversion Word                               | Effect                                                       |
| --------------------------------------------- | ------------------------------------------------------------ |
| c{length}<br />lo{length}<br />logger{length} | Outputs the name of the logger at the origin of the logging event. |
| d{pattern}<br/>date{pattern}                  | Used to output the date of the logging event.                |
| m<br />msg<br />message                       | Outputs the application-supplied message associated with the logging event. |
| M<br />method                                 | Outputs the method name where the logging request was issued. |
| n                                             | Outputs the platform dependent line separator character or characters. |
| p / le / level                                | Outputs the level of the logging event.                      |
| t / thread                                    | Outputs the name of the thread that generated the logging event. |
| X{key:-defaultVal}<br/>mdc{key:-defaultVal}   | Outputs the MDC (mapped diagnostic context) associated with the thread that generated the logging event.<br /><br />If the mdc conversion word is followed by a key between braces, as in %mdc{userid}, then the MDC value corresponding to the key 'userid' will be output. If the value is null, then the default value specified after the :- operator is output. If no default value is specified than the empty string is output. |
|                                               |                                                              |



## 3.2 컬러 설정

```xml
<configuration>
    <conversionRule conversionWord="color" converterClass="org.springframework.boot.logging.logback.ColorConverter" />
</configuration>
```

- conversionRule을 먼저 정의한다.

```xml
<configuration>    
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%color(${springAppName}){green} %date{yyyy-MM-dd HH:mm:ss.SSS} %highlight(%-5level) [%thread] %color([%X{traceId:-none}]){magenta} %logger{36} - %message%n</pattern>
        </encoder>
    </appender>
</configuration>
```

- 위 처럼 사용한다.