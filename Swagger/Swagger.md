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





참고

* https://springdoc.org/#Introduction
* https://www.baeldung.com/spring-rest-openapi-documentation
