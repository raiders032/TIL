

# 1 Test coverage visualization

* Gitlab CI/CD를 사용하면 Jacoco 등 테스트 커버리지 분석 툴의 정보를 Gitlab 상에 시각화할 수 있다
* 아래와 같이 머지 리퀘스트의 diff를 확인해보면 테스트된 코드인지 아닌지 시각화된 정보를 볼 수 있다

![Test Coverage Visualization Diff View](test_coverage_visualization_v12_9.png)



## 1.1 작동 방식

- Gitlab CI/CD는 커버리지 정보를 아티팩트로부터 얻는다
- 커버리지 분석이 정상적으로 작동하기 위해서는 Cobertura XML을 `artifacts:reports:coverage_report`로 등록하면 된다.



# 2 .gitlab-ci.yml 작성

- Gradle 프로젝트 기준
- JaCoCo 플러그인을 통해 테스트 커버리지 정보를 artifact로 만든다.
- Gitlab CI/CD는 Cobertura format을 원하기 때문에 JaCoCo가 생성한 결과를 Cobertura format으로 변환하는 과정이 필요하다
- [레퍼런스](https://docs.gitlab.com/ee/ci/testing/test_coverage_visualization.html#gradle-example)



```yml
test-jdk11:
  stage: test
  image: gradle:6.6.1-jdk11
  script:
    - 'gradle test jacocoTestReport' # jacoco must be configured to create an xml report
  artifacts:
    paths:
      - build/jacoco/jacoco.xml

coverage-jdk11:
  # Must be in a stage later than test-jdk11's stage.
  # The `visualize` stage does not exist by default.
  # Please define it first, or chose an existing stage like `deploy`.
  stage: visualize
  image: registry.gitlab.com/haynes/jacoco2cobertura:1.0.7
  script:
    # convert report from jacoco to cobertura, using relative project path
    - python /opt/cover2cover.py build/jacoco/jacoco.xml $CI_PROJECT_DIR/src/main/java/ > build/cobertura.xml
  needs: ["test-jdk11"]
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: build/cobertura.xml
```



# 3 build.gradle 작성

- Gitlab CI/CD는 Cobertura format을 원하기 때문에 JaCoCo가 레포트를 생성해야 한다.
- test 태스크 이후 jacocoTestReport가 이어서 실행되도록 `finalizedBy jacocoTestReport`
- xml 형태의 레포트를 만드는 것을 볼 수 있다.
  - 레포트의 위치는 `$buildDir/jacoco/jacoco.xml`에 생성된다



**예시**

```groovy
tasks.named('test') {
    useJUnitPlatform()

    // test 태스크 종류 후 jacocoTestReport 태스크 실행
    finalizedBy jacocoTestReport
}

jacocoTestReport {
    reports {
        html.enabled true
        html.destination file("$buildDir/jacoco/jacocoHtml")

        xml.enabled true
        xml.destination file("$buildDir/jacoco/jacoco.xml")
    }

    def Qdomains = []
    for (qPattern in "**/QA".."**/QZ") {
        Qdomains.add(qPattern + "*")
    }

    afterEvaluate {
        classDirectories.setFrom(files(classDirectories.files.collect {
            fileTree(dir: it,
                    exclude: [] + Qdomains)
        }))
    }

    // jacocoTestReport 태스크는 test 태스크에 의존한다
    // 즉 test 태스크 실행 후 jacocoTestReport가 실행된다
    dependsOn test

    // jacocoTestReport 태스크 실행 후 jacocoTestCoverageVerification 태스크가 시행된다
    finalizedBy 'jacocoTestCoverageVerification'
}

jacocoTestCoverageVerification {
    def Qdomains = []

    for (qPattern in '*.QA'..'*.QZ') {
        Qdomains.add(qPattern + '*')
    }

    violationRules {
        rule {
            enabled = true
            element = 'CLASS'
            limit {
                counter = 'LINE'
                value = 'COVEREDRATIO'
                minimum = 0.00
            }
            excludes = ["*Command", "*Query"] + Qdomains
        }
    }
}
```



참고

* https://docs.gitlab.com/ee/ci/testing/test_coverage_visualization.html



