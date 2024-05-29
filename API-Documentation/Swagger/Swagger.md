# 1 Swagger

* 스프링 부트에서 Swagger 사용하기

<br>

## 1.1 디펜던시

- https://mvnrepository.com/artifact/org.springdoc/springdoc-openapi-ui

```groovy
implementation group: 'org.springdoc', name: 'springdoc-openapi-ui', version: '1.7.0'
```

- 해당 의존성 추가하면 swagger-ui가 자동으로 스프링 부트 애플리케이션에 배포된다.



**Swagger UI 문서 주소**

- `http://server:port/context-path/swagger-ui.html`



**Json 포맷으로 보기**

- `http://server:port/context-path/v3/api-docs`



**yaml 포맷으로 보기**

- `http://server:port/context-path/v3/api-docs.yaml`



# 2 설정





- `@Api` → `@Tag`
- `@ApiIgnore` → `@Parameter(hidden = true)` or `@Operation(hidden = true)` or `@Hidden`
- `@ApiImplicitParam` → `@Parameter`
- `@ApiImplicitParams` → `@Parameters`
- `@ApiModel` → `@Schema`
- `@ApiModelProperty(hidden = true)` → `@Schema(accessMode = READ_ONLY)`
- `@ApiModelProperty` → `@Schema`
- `@ApiOperation(value = "foo", notes = "bar")` → `@Operation(summary = "foo", description = "bar")`
- `@ApiParam` → `@Parameter`
- `@ApiResponse(code = 404, message = "foo")` → `@ApiResponse(responseCode = "404", description = "foo")`

<br>

# 3 OpenAPI 스펙 기반 Swagger UI 생성

```groovy
plugins {
    id("org.hidetake.swagger.generator") version "2.18.2"
}
```

```groovy
swaggerSources {
    register("apiDocs") {
        setInputFile(file("build/api-spec/open-api-3.0.1.yaml"))
    }
}
```

- `swaggerSources` 블록에서 Swagger UI에 사용할 OpenAPI 스펙 파일을 등록합니다.
- `generateSwaggerUI` 태스크 실행: Gradle에서 `generateSwaggerUI` 태스크를 실행하면 생성된 OpenAPI 스펙 파일을 기반으로 Swagger UI가 생성됩니다.


참고

* https://springdoc.org/#Introduction
* https://www.baeldung.com/spring-rest-openapi-documentation
