# Logstash Logback Mysql

* 스프링 로그를 Logstash를 이용해서 Mysql로 적재하기



## 1. Logstash

### 1.1 logstash.conf 작성

```conf
input {
  jdbc {
    jdbc_driver_library => "/config-dir/mysql-connector-java-5.1.38.jar"
    jdbc_driver_class => "com.mysql.jdbc.Driver"
    jdbc_connection_string => "jdbc:mysql://DB접속주소:3306/스키마명?useUnicode=true&characterEncoding=utf8"
    jdbc_user => "DB사용자명"
    jdbc_password => "비밀번호"

    statement => "select * from person" # 실행할 쿼리문

    jdbc_pool_timeout => 10 #jdbc 접속 TimeOut 설정
    jdbc_paging_enabled => true 
    jdbc_page_size => 10000

    schedule => "* * * * *"  # crontab 표기법의 스케쥴 설정
  }
}

output {
  elasticsearch {
    hosts => ["192.168.2.153:9200"]  # 결과값을 입력받을 elasticsearch 주소
    index => "elk_test" # index명
    document_type => "person" # document type 명
  }
  stdout {
    codec => rubydebug
  }
}
```



### 1.2 Logstash 실행

```bash
$ docker run -it --rm -v "$PWD":/config-dir logstash logstash -f /config-dir/logstash.conf
```



## 2. Logback

* 로그를  tcp 통신을 통하여 바로 logstash 로 전송할 수 있는 appender를 사용하기 위해 dependency 를 추가

```groovy
compile 'net.logstash.logback:logstash-logback-encoder:6.3'
```

**src/main/resources/logback.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>

    <appender name="console" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <pattern>%-5level %d [%thread] %logger - %msg%n</pattern>
        </encoder>
    </appender>

    <appender name="stash" class="net.logstash.logback.appender.LogstashTcpSocketAppender">
        <destination>127.0.0.1:5000</destination>

        <!-- encoder is required -->
        <encoder class="net.logstash.logback.encoder.LogstashEncoder" />
    </appender>

    <root level="INFO">
        <appender-ref ref="console"/>
        <appender-ref ref="stash"/>
    </root>

</configuration>
```

**application.yml**

```yml
logging:
	config: classpath:logback.xml
```



**참고**

* https://www.programmersought.com/article/23786127401/