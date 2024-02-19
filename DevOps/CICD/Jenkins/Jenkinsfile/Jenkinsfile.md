# 1 Jenkinsfile

- Jenkinsfile은 파이프라인을 만드는데 사용되는 텍스트 파일로 source-control management(git)에 의해 관리한다
  - 즉 Jenkinsfile을 통해 전체의 빌드 프로세스를 정의할 수 있다
  - 보통 이 프로세스에는 앱을 빌드하고 테스트하고 전달하는 단계가 포함된다
- Jenkinsfile은 두가지 방식으로 작성될 수 있다
  - Declarative 방식
  - Scripted 방식
- Declarative 방식이 비교적 최근에 도입되었고 Scripted 방식보다 풍부한 기능을 제공하며 가독성을 고려해 만들어졌다



# 2 Jenkinsfile 다루기



## 2.1 환경변수 사용하기

- 젠킨스 파이프라인은 전역적인 환경변수를 제공한다.
- 이 환경변수는 Jenkinsfile 어디에서나 접근이 가능하다
- **BUILD_ID**, **BUILD_NUMBER**, **JOB_NAME** 등을 제공한다
  - [제공되는 환경변수 목록](https://www.jenkins.io/doc/book/pipeline/jenkinsfile/#using-environment-variables)



**예시**

- 아래와 같이 `env.환경변수이름` 으로 Jenkinsfile 어디에서나 사용이 가능하다

```groovy
pipeline {
    agent any
    stages {
        stage('Example') {
            steps {
                echo "Running ${env.BUILD_ID} on ${env.JENKINS_URL}"
            }
        }
    }
}
```



## 2.2 환경변수 설정하기

- `environment` directive를 사용해 환경변수를 설정할 수 있다
- pipeline 블록 안에 정의된 environment는 전역적으로 사용이 가능하다
- 반변 stage 안에 정의된 environment는 해당 stage 안에서만 사용이 가능하다



**예시**

```groovy
pipeline {
    agent any
    environment { 
        CC = 'clang'
    }
    stages {
        stage('Example') {
            environment { 
                DEBUG_FLAGS = '-g'
            }
            steps {
                sh 'printenv'
            }
        }
    }
}
```



> 참고
>
> - https://www.jenkins.io/doc/book/pipeline/jenkinsfile/