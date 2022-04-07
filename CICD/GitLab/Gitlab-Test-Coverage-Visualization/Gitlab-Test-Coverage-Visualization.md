

# 1 Test coverage visualization

* Gitlab CI/CD를 사용하면 Jacoco 등 테스트 커버리지 분석 툴의 정보를 Gitlab 상에 시각화할 수 있다
* 아래와 같이 머지 리퀘스트의 diff를 확인해보면 테스트된 코드인지 아닌지 시각화된 정보를 볼 수 있다

![Test Coverage Visualization Diff View](https://docs.gitlab.com/ee/user/project/merge_requests/img/test_coverage_visualization_v12_9.png)



# 2 Gradle 설정

* 테스트 커버리지 리포트를 만들기 위한 Jacoco 설정
* Jacoco가 생성한 리포트를  Gitlab CI/CD에 전달한다



**build.gradle**

* csv 형태의 리포트를 만든다 

```groovy
plugins {
    id 'jacoco'
}

jacoco {
    toolVersion = "0.8.7"
}

test {
    useJUnitPlatform()
    finalizedBy 'jacocoTestReport'
}

jacocoTestReport {
    reports {
        html.enabled true
        csv.enabled true
        csv.destination file("${buildDir}/jacoco/jacocoCsv")
        xml.enabled true
        xml.destination file("$buildDir/jacoco/jacoco.xml")
    }

    finalizedBy 'jacocoTestCoverageVerification'
}

jacocoTestCoverageVerification {
    violationRules {
        rule {
            enabled = true
            element = 'CLASS'
            // includes = []

            limit {
                counter = 'LINE'
                value = 'COVEREDRATIO'
                minimum = 0.7
            }

            excludes = []
        }
    }
}
```



# 2. `.gitlab-ci.yml` 작성

```yml
# ...
variables:
  JACOCO_CSV_LOCATION: '$CI_PROJECT_DIR/build/jacoco/jacocoCsv'
# ...
stages:
  - test
# ...
test:
  stage: test
  script:
    # Any task that runs your tests
    - ./gradlew check 
    - awk -F"," '{ instructions += $4 + $5; covered += $5 } END { print covered, "/", instructions, " instructions covered"; print 100*covered/instructions, "% covered" }' $JACOCO_CSV_LOCATION

```



# 3. GitLab 설정



## 3.1 Test coverage parsing 작성

* *Settings -> CI/CD -> General pipelines -> Test coverage parsing*

`([0-9]{1,3}.[0-9]*).%.covered` 입력

![image-20210720122604755](./images/1.png)



## 3.2 **cicd 파이프라인 실행 후**

* 아래와 같이 `Pipeline status` 와 `Coverage report`를 볼 수 있다.
* 뱃지 이미지 URL: `https://gitlab~~~.svg`
* 링크: `https://gitlab~~~/master`

![image-20210720191610909](./images/4.png)

****

**깃랩 Badge 등록하기**

* Settings -> General -> Badges -> Test coverage parsing
* 위에서 복사한 값을 아래와 같이 등록한다.

![image-20210720123126966](./images/3.png)



참고

* https://akobor.me/posts/how-to-gitlab-test-coverage-with-jacoco-and-gradle

