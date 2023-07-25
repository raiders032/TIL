# 1 Spring-Cloud-Sleuth



## 1.1 Terminology

- [레퍼런스](https://docs.spring.io/spring-cloud-sleuth/docs/3.1.8/reference/html/getting-started.html#getting-started-terminology)



**Span**

- 작업의 기본 단위입니다. 
- 예를 들어, RPC를 보내는 것이 새로운 Span이며, RPC 응답을 보내는 것도 마찬가지입니다. 
- Span에는 설명, 타임스탬프가 있는 이벤트, 키-값 형태의 주석(태그), Span을 발생시킨 ID, 프로세스 ID(일반적으로 IP 주소) 등의 데이터도 포함됩니다.
- Span은 시작하고 멈출 수 있으며 시간 정보를 추적할 수 있다.
- Span을 생성하면, 미래의 어느 시점에 반드시 그것을 멈춰야 한다.



**Trace**

- 트리 구조의 Span의 집합이다. 



**Annotation/Event**

- 이벤트를 기록하는데 Annotation을 사용한다.
  - 일반적으로 RPC 시나리오에서는 이러한 애노테이션을 이용해서 이벤트를 마킹하여 어떤 종류의 액션이 발생했는지를 설명한다.
- **cs(Client Sent)**
  - 이 Annotation은 Span의 시작을 나타낸다.
  - 클라이언트가 요청을 보낸 상태를 의미한다.
- **sr(Server Received)**
  - cs 타임스탬프를 이 타임스탬프에서 빼면 네트워크 지연 시간을 알 수 있다.
  - 서버 측이 요청을 받고 처리를 시작했음을 의미한다.
- **ss(Server Sent)**
  - 요청에 대한 처리를 완료하고 응답을 클라이언트에게 보냈음을 의미한다.
  - sr 타임스탬프를 이 타임스탬프에서 빼면 서버 측에서 요청을 처리하는 데 필요한 시간을 알 수 있습니다.
- **cr(Client Received)**
  - Span의 끝을 나타냅니다. 
  - 클라이언트가 서버 측에서의 응답을 성공적으로 받았음을 의미한다.
  - cs 타임스탬프를 이 타임스탬프에서 빼면 클라이언트가 서버로부터 응답을 받는 데 필요한 전체 시간을 알 수 있다.



## 1.2 의존성 추가

- [레퍼런스](https://spring.io/projects/spring-cloud-sleuth)



**Gradle**

```groovy
buildscript {
    dependencies {
        classpath "io.spring.gradle:dependency-management-plugin:0.5.2.RELEASE"
    }
}

apply plugin: "io.spring.dependency-management"

dependencyManagement {
     imports {
          mavenBom "org.springframework.cloud:spring-cloud-dependencies:${releaseTrainVersion}"
     }
}
dependencies {
    compile 'org.springframework.cloud:spring-cloud-starter-sleuth'
}
```



**Maven**

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>${release.train.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
<dependencies>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-sleuth</artifactId>
    </dependency>
</dependencies>
```

