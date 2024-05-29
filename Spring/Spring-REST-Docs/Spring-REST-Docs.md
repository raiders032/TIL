# 1 Spring REST Docs

- Spring REST Docs는 RESTful 서비스를 문서화하는 데 도움을 주는 강력한 도구로, 정확하고 읽기 쉬운 API 문서를 작성하는 것을 목표로 합니다.
- 기본적으로 Spring REST Docs는 Asciidoctor를 사용합니다. 
	- Asciidoctor는 일반 텍스트를 처리하여 HTML을 생성하며, 필요에 따라 스타일과 레이아웃을 조정할 수 있습니다. 
	- 선호하는 경우 Markdown을 사용하도록 Spring REST Docs를 구성할 수도 있습니다.
- Spring REST Docs는 Spring MVC의 테스트 프레임워크, Spring WebFlux의 `WebTestClient` 또는 REST Assured 5로 작성된 테스트에서 생성된 스니펫을 사용합니다. 
	- 이러한 테스트 주도 접근 방식은 서비스 문서의 정확성을 보장하는 데 도움이 됩니다. 스니펫이 잘못되면 해당 스니펫을 생성하는 테스트가 실패하게 됩니다.
- RESTful 서비스를 문서화하는 것은 주로 서비스의 리소스를 설명하는 것과 관련이 있습니다. 
	- 각 리소스 설명의 두 가지 핵심 부분은 리소스가 소비하는 HTTP 요청과 생성하는 HTTP 응답의 세부 정보입니다. 
	- Spring REST Docs를 사용하면 이러한 리소스와 HTTP 요청 및 응답을 다룰 수 있으며, 서비스 구현의 내부 세부 사항으로부터 문서를 보호할 수 있습니다.
	- 이러한 분리는 서비스의 구현이 아닌 API를 문서화하는 데 도움이 되며, 문서를 다시 작성하지 않고도 구현을 발전시킬 수 있는 자유를 제공합니다.

<br>

## 1.1 Spring REST Docs 장점

- 테스트 주도 문서 작성
	- Spring REST Docs는 테스트 코드를 기반으로 문서를 생성하기 때문에, 테스트가 성공해야만 문서가 작성됩니다. 
	- 이는 문서와 실제 API 구현 간의 불일치를 방지하고 문서의 정확성을 보장합니다.
- 제품 코드에 영향 없음
	- Spring REST Docs는 제품 코드에 어떠한 영향도 주지 않습니다. 
	- API 문서 생성을 위해 별도의 어노테이션이나 코드 변경이 필요하지 않습니다.
- 사용자 정의 가능
	- Spring REST Docs는 높은 수준의 사용자 정의를 지원합니다.
	- 문서의 구조와 스타일을 자유롭게 조정할 수 있어 프로젝트의 요구사항에 맞는 문서를 작성할 수 있습니다.
- 다양한 출력 형식 지원
	- Spring REST Docs는 AsciiDoc, Markdown 등 다양한 문서 형식을 지원합니다.
	- 이를 통해 생성된 문서를 다양한 플랫폼과 도구에서 쉽게 활용할 수 있습니다

<br>

## 1.2 Swagger와 비교

|      | Spring Rest Docs                | Swagger                                     |
| ---- | ------------------------------- | ------------------------------------------- |
| 장점 | 제품코드에 영향 없다.           | API 를 테스트 해 볼수 있는 화면을 제공한다. |
|      | 테스트가 성공해야 문서작성된다. | 적용하기 쉽다.                              |
| 단점 | 적용하기 어렵다.                | 제품코드에 어노테이션 추가해야한다.         |
|      |                                 | 제품코드와 동기화가 안될수 있다.            |

<br>

# 2 Build configuration



```groovy
plugins { 
	id "org.asciidoctor.jvm.convert" version "3.3.2"
}

configurations {
	asciidoctorExt 
}

dependencies {
	asciidoctorExt 'org.springframework.restdocs:spring-restdocs-asciidoctor:{project-version}' 
	testImplementation 'org.springframework.restdocs:spring-restdocs-mockmvc:{project-version}' 
}

ext { 
	snippetsDir = file('build/generated-snippets')
}

test { 
	outputs.dir snippetsDir
}

asciidoctor { 
	inputs.dir snippetsDir 
	configurations 'asciidoctorExt' 
	dependsOn test 
}

bootJar {
	dependsOn asciidoctor 
	from ("${asciidoctor.outputDir}/html5") { 
		into 'static/docs'
	}
}
```

- `org.asciidoctor.jvm.convert` 플러그인을 사용하여 AsciiDoc 문서를 HTML로 변환합니다.
- `asciidoctorExt` 설정을 추가하여 Spring REST Docs의 AsciiDoc 확장을 포함합니다.
- 테스트 단계에서 생성된 스니펫의 출력 디렉토리를 `snippetsDir`로 설정합니다.
- `asciidoctor` 작업을 구성하여 생성된 스니펫을 입력으로 받고, `asciidoctorExt` 설정을 사용하도록 합니다. 또한 `test` 작업에 의존하도록 설정합니다.
- `bootJar` 작업에서 생성된 HTML 문서를 JAR 파일의 `static/docs` 디렉토리에 포함시킵니다.

<br>

# 3 OpenAPI 스펙 파일 생성

```groovy
plugins { id("com.epages.restdocs-api-spec") version "0.18.2" }
```

```groovy
openapi3 { 
	this.setServer("http://localhost:8080") 
	title = "Spring-Rest-Docs + Swagger-UI + Open-API-3.0.1" 
	description = "PMS api documentation" 
	version = "0.0.1" 
	outputFileNamePrefix = "open-api-3.0.1" 
	format = "yaml" 
}
```

- `openapi3` 태스크
	- Gradle에서 `openapi3` 태스크를 실행하면 RestDocs로 생성된 snippets를 기반으로 OpenAPI 스펙 파일이 생성됩니다.

참고

- [Spring Rest Docs 적용 - 우아한형제들 기술블로그](https://techblog.woowahan.com/2597/)
- https://docs.spring.io/spring-restdocs/docs/current/reference/htmlsingle/