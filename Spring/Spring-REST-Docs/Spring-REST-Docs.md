# 1 Spring REST Docs

- Spring MVC Test, WebTest Client 또는 REST Assured를 사용하여 생성된 자동 생성 스니펫과 손으로 작성한 문서를 결합하여 RESTful 서비스를 문서화할 수 있다
- Spring REST Docs는 정확하고 읽기 쉬운 API documentation을 생성하는데 도움을 준다



## 1.1 Swagger와 비교

|      | Spring Rest Docs                | Swagger                                     |
| ---- | ------------------------------- | ------------------------------------------- |
| 장점 | 제품코드에 영향 없다.           | API 를 테스트 해 볼수 있는 화면을 제공한다. |
|      | 테스트가 성공해야 문서작성된다. | 적용하기 쉽다.                              |
| 단점 | 적용하기 어렵다.                | 제품코드에 어노테이션 추가해야한다.         |
|      |                                 | 제품코드와 동기화가 안될수 있다.            |



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





참고

- [Spring Rest Docs 적용 - 우아한형제들 기술블로그](https://techblog.woowahan.com/2597/)