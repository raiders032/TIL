# 1 Jenkins 설치 및 설정 자동화

* Docker와 JCasC로 Jenkins 설치 및 설정 자동화하기



## 1.1 JCasC

* [Jenkins Configuration as Code](https://www.jenkins.io/projects/jcasc/)
* 환경 설정을 yml 파일로 정의하면 설치시 정의한 대로 젠킨스를 설정한다.
  * 위자드에서 수동으로 환경 설정할 필요 없다
* JCasC를 사용하기 위해 젠킨스에 Configuration as Code 플러그인을 설치해야 한다.



**수동 설치의 단점**

* 일반적으로 Jenkins 구성은 웹 기반 설정 마법사를 통해 수동으로 수행한다.
* 느리고 human error 발생 가능성이 높다.
* 수동 설정으로 인해 scalable하지 않다.
* 수동 설정을 깃으로 버전을 관리 할 수 없다.
  * 따라서 정밀한 점검이나 코드 리뷰를 할 수 없음



**prerequisite**

* docker
* Gradle



## 1.2 gradle 프로젝트 생성

- 젠킨스 이미지 빌드와 컨테이너 실행을 코드로 제어하기 위해 gradle을 사용한다.
- 먼저 그래들 프로젝트를 만들자

```bash
$ gradle init --type basic
$ ls
build.gradle    gradle          gradlew         gradlew.bat     settings.gradle
```



## 1.3 build.gradle 수정

- build.gradle를 아래와 같이 수정하자.
- `com.palantir.docker`와 `com.palantir.docker-run` 를 추가하면 그래들을 통해 도커 이미지를 만들고 컨테이너를 실행할 수 있다.
  - docker-compose와 유사하게 docker 명령어를 통해 이미지를 만들거나 컨테이너를 만들지 않고 코드로관리 가능
  - 각각 docker, dockerRun 태스크가 추가된다.

```groovy
plugins {
    id 'base'
    id 'com.palantir.docker' version '0.34.0'
    id 'com.palantir.docker-run' version '0.34.0'
    id 'pl.allegro.tech.build.axion-release' version '1.14.1'
}

project.version = scmVersion.version

docker {
    name "${project.name}:${project.version}"
    files "plugins.txt"
}

dockerRun {
    name "${project.name}"
    image "${project.name}:${project.version}"
    ports '8080:8080'
    clean true
    daemonize false
}
```



## 1.4 Dockerfile 작성

- `com.palantir.docker` 사용해도 이미지를 만들 때 dockerfile이 필요하다
- Jenkins 설정을 코드로 관리하기 위해 SetupWizard를 비활성화 한다.
- 설치하고자 하는 플러그인 목록 파일을 `jenkins-plugin-cli`에 넘겨주면 플러그인이 설치된다.

```dockerfile
FROM jenkins/jenkins:latest

# 설치 위자드 비활성화
ENV JAVA_OPTS -Djenkins.install.runSetupWizard=false

# plugins.txt에 설치하고자 하는 플러그를 명시하고 jenkins-plugin-cli을 통해 설치
COPY --chown=jenkins:jenkins plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli -f /usr/share/jenkins/ref/plugins.txt
```



## 1.5 plugins.txt 작성

* 설치할 플러그인의 목록을 작성한 파일을 작성한다.
* `Configuration as Code` 플러그인 추가
* 아래는 젠킨스 설치 위자드가 추천하는 모든 플러그인들이다.
* authorize-project:latest는 직접 추가



**설치 위자드가 추천하는 모든 플러그인**

```
ant:latest
antisamy-markup-formatter:latest
build-timeout:latest
cloudbees-folder:latest
configuration-as-code:latest
credentials-binding:latest
email-ext:latest
git:latest
github-branch-source:latest
gradle:latest
ldap:latest
mailer:latest
matrix-auth:latest
pam-auth:latest
pipeline-github-lib:latest
pipeline-stage-view:latest
ssh-slaves:latest
timestamper:latest
workflow-aggregator:latest
ws-cleanup:latest
```



**추가 플러그인**

* `authorize-project:latest`
* `job-dsl:latest`: Job DSL script를 작성할 때 필요
* `workflow-job:latest`: Pipeline Jobs 정의에 필요
* `workflow-cps:latest`: Pipeline Jobs 정의에 필요

```
authorize-project:latest
job-dsl:latest
workflow-job:latest
workflow-cps:latest
```



## 1.6 이미지 빌드 및 실행

- 이제 젠킨스 이미지를 빌드하고 컨테이너를 실행시킨다.

```bash
./gradlew docker 
./gradlew dockerRun
```



## 1.7 defaultJob.xml 만들기

- JCasC 젠킨스를 코드로 설정하는 것과 더불어 잡도 코드로 미리 만들어 둘 수 있다
- `/usr/share/jenkins/ref/jobs/{잡이름}` 디렉토리에 `confing.xml` 파일을 넣으면 된다.
- `confing.xml` 을 직접 작성하는 것을 어려우니 젠킨스에서 GUI로 잡을 하나만들고 이를 통해 만들어진 `confing.xml` 파일을 로컬 호스트로 옮겨보자



**defaultJob 만들기**



**defaultJob 만들기**

1. 젠킨스에 접속
2. 새로운 아이템 만들기
3. `defaultJob` 이란 이름으로 Freestyle project 만들기
4. 소스 코드 관리(Source Code Management) 에서 Git 선택 후 리포지토리 설정
   1. Repository URL에 젠킨스 리포지토리 URL 입력
5. Build Steps에서 **Process Job DSLs** 선택
   1. Look on Filesystem 체크
   2. DSL Scripts란에 `seedJob.groovy` 입력
6. 저장



**defaultJob.xml 만들기**

- 방금 만든 잡은 `/var/jenkins_home/jobs/defaultJob/config.xml` 파일로 만들어진다.
- 해당 파일을 아래와 같은 명령어로 로컬로 옮기자.

 ```bash
 $ docker cp jenkins:/var/jenkins_home/jobs/defaultJob/config.xml defaultJob.xml
 $ ls
 Dockerfile      README.md       build           build.gradle    defaultJob.xml  gradle          gradlew         gradlew.bat     plugins.txt     settings.gradle
 ```



**defaultJob.xml**

- 젠킨스 초기 실행시 기본적으로 존재하는 잡을 설정하는 파일
- defaultJob.xml 은 깃 리포지토리에서 시드 잡(`seedJob.groovy`)을 가져와 실행하는 역할을 한다.
  - `<url>이곳에 리포지토리 url 명시</url>`
- defaultJob 잡을 빌드하면 시드 잡(`seedJob.groovy`)에 정의된 잡들이 만들어진다.

```groovy
<?xml version='1.1' encoding='UTF-8'?>
<project>
  <description></description>
  <keepDependencies>false</keepDependencies>
  <properties/>
  <scm class="hudson.plugins.git.GitSCM" plugin="git@4.12.1">
    <configVersion>2</configVersion>
    <userRemoteConfigs>
      <hudson.plugins.git.UserRemoteConfig>
        <url>https://github.com/KimGoDing/Jenkins.git</url>
      </hudson.plugins.git.UserRemoteConfig>
    </userRemoteConfigs>
    <branches>
      <hudson.plugins.git.BranchSpec>
        <name>*/master</name>
      </hudson.plugins.git.BranchSpec>
    </branches>
    <doGenerateSubmoduleConfigurations>false</doGenerateSubmoduleConfigurations>
    <submoduleCfg class="empty-list"/>
    <extensions/>
  </scm>
  <canRoam>true</canRoam>
  <disabled>false</disabled>
  <blockBuildWhenDownstreamBuilding>false</blockBuildWhenDownstreamBuilding>
  <blockBuildWhenUpstreamBuilding>false</blockBuildWhenUpstreamBuilding>
  <triggers/>
  <concurrentBuild>false</concurrentBuild>
  <builders>
    <javaposse.jobdsl.plugin.ExecuteDslScripts plugin="job-dsl@1.81">
      <targets>seedJob.groovy</targets>
      <usingScriptText>false</usingScriptText>
      <sandbox>false</sandbox>
      <ignoreExisting>false</ignoreExisting>
      <ignoreMissingFiles>false</ignoreMissingFiles>
      <failOnMissingPlugin>false</failOnMissingPlugin>
      <failOnSeedCollision>false</failOnSeedCollision>
      <unstableOnDeprecation>false</unstableOnDeprecation>
      <removedJobAction>IGNORE</removedJobAction>
      <removedViewAction>IGNORE</removedViewAction>
      <removedConfigFilesAction>IGNORE</removedConfigFilesAction>
      <lookupStrategy>JENKINS_ROOT</lookupStrategy>
    </javaposse.jobdsl.plugin.ExecuteDslScripts>
  </builders>
  <publishers/>
  <buildWrappers/>
</project>
```



## 1.8 seedJob.groovy 작성

* 시드 잡이란 다른 잡을 만드는 잡이다
* seedjob은 일반적으로 추가적인 잡을 만드는 스크립트를 가지고 있다.
* [참고](https://jenkinsci.github.io/job-dsl-plugin/#path/pipelineJob)

```groovy
pipelineJob('theme-park-job') {
    definition {
        cpsScm {
            scm {
                git {
                    remote {
                        url 'https://github.com/raiders032/spring-boot-api-example.git'
                    }
                    branch 'master'
                }
            }
        }
    }
}

pipelineJob('theme-park-job-docker') {
    definition {
        cpsScm {
            scm {
                git {
                    remote {
                        url 'https://github.com/raiders032/spring-boot-api-example.git'
                    }
                    branch 'master'
                    scriptPath('Jenkinsfile-docker')
                }
            }
        }
    }
}
```



## 1.9 casc.yml 작성

* 프로젝트 루트 디렉토리에 젠킨스 환경설정 파일 casc.yml를 작성한다.
* [참고](#2-casc.yml-작성 )



## 1.10 build.gradle 수정

- Docker In Docker를 쓰기 위한 설정

```groovy
plugins {
    id 'base'
    id 'com.palantir.docker' version '0.34.0'
    id 'com.palantir.docker-run' version '0.34.0'
    id 'pl.allegro.tech.build.axion-release' version '1.14.1'
}

project.version = scmVersion.version

docker {
    name "${project.name}:${project.version}"
    files "plugins.txt", "defaultJob.xml", "casc.yml"
}

Process process
process = "stat -c %g /var/run/docker.sock".execute()

dockerRun {
    name "${project.name}"
    image "${project.name}:${project.version}"
    ports '8080:8080'
    clean true
    daemonize false
    env 'JENKINS_ADMIN_ID' : 'admin', 'JENKINS_ADMIN_PASSWORD' : '1234'
    arguments '-v', "/var/run/docker.sock:/var/run/docker.sock", '--group-add', 'jenkins'
}
```



## 1.11  Dockerfile 수정

- 모든 준비가 완료되었고 기존 Dockerfile을 아래와 같이 수정한다.

```dockerfile
FROM jenkins/jenkins:2.303.3-jdk11

# 설치 위자드 비활성화
ENV JAVA_OPTS -Djenkins.install.runSetupWizard=false
# JCasC가 읽을 설정 파일 위치 지정하는 환경 변수
ENV CASC_JENKINS_CONFIG /var/jenkins_home/casc.yml

# Jenkins Docker image에 Docker 설치 Docker In Docker를 사용하는 경우
USER root
RUN curl -sSL https://get.docker.com/ | sh
RUN usermod -a -G docker jenkins
USER jenkins

# plugins.txt에 설치하고자 하는 플러그를 명시하고 jenkins-plugin-cli을 통해 설치
COPY --chown=jenkins:jenkins plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli -f /usr/share/jenkins/ref/plugins.txt

# 앞에 작성한 설정 파일 casc.yaml 복사
COPY casc.yml /var/jenkins_home/casc.yml

# 젠킨스 기본 시드잡 설정 파일 복사
COPY defaultJob.xml /usr/share/jenkins/ref/jobs/default-job/config.xml
```



## 1.12 최종 이미지 빌드 및 실행

- 아래와 같이 앞서 작성한 Dockerfile, plugins.txt, defaultJob.xml, seedJob.groovy, casc.yml이 있는지 확인한다.

````bash
$ ls
Dockerfile      README.md       build           build.gradle    casc.yml        defaultJob.xml  gradle          gradlew         gradlew.bat     plugins.txt     seedJob.groovy  settings.gradle
````

- 이제 최종 젠킨스 이미지를 빌드하고 컨테이너를 실행시킨다.

```bash
./gradlew docker 
./gradlew dockerRun
```



# 2 casc.yml 작성

* 프로젝트 루트 디렉토리에 젠킨스 환경설정 파일 casc.yml를 단계별로 작성해보자



## 4.1 Jenkins URL 설정

* 젠킨스 인스턴스에 접근하기 위한 URL을 설정한다.

```yml
unclassified:
  location:
    url: http://server_ip:8080/
```



## 4.2 User 생성

* local: ID 와 비밀번호 인증을 의미
* allowsSignup: false 
  * 웹 인터페이스로 유저를 생성하는 것을 막는다
* JENKINS_ADMIN_ID, JENKINS_ADMIN_PASSWORD: 아이디와 비밀번호를 하드 코딩으로 입력하지 않고 환경 변수를 사용
  * `docker run --name jenkins --rm -p 8080:8080 --env JENKINS_ADMIN_ID=admin --env JENKINS_ADMIN_PASSWORD=password jenkins:jcasc`

```yml
jenkins:
  securityRealm:
    local:
      allowsSignup: false
      users:
       - id: ${JENKINS_ADMIN_ID}
         password: ${JENKINS_ADMIN_PASSWORD}
```



## 4.3 권한 부여

* 앞에서 생성한 admin 유저에게 권한을 부여한다.
* 이 때 matrix-auth 플러그인을 사용한다.
* authorizationStrategy: 글로벌 권한 설정
* permissions: 
  * `<permission-group>/<permission-name>:<role>` 형태
  * `Overall/Administer:admin` : admin 유저에게 Overall/Administer 권한을 부여
  * `Overall/Read:authenticated` authenticated이란 role은 인증된 유저를 의미 따라서 인증된 유저에게 Overall/Read 권한을 부여
  * 또 다른 role로 anonymous가 있다

```yml
jenkins:
  authorizationStrategy:
    globalMatrix:
      permissions:
        - "Overall/Administer:admin"
        - "Overall/Read:authenticated"
```

```yml
security:
  queueItemAuthenticator:
    authenticators:
    - global:
        strategy: triggeringUsersAuthorizationStrategy
```



## 4.4 casc.yml

```yml
jenkins:
  securityRealm:
    local:
      allowsSignup: false
      users:
        - id: ${JENKINS_ADMIN_ID}
          password: ${JENKINS_ADMIN_PASSWORD}
  authorizationStrategy:
    globalMatrix:
      permissions:
        - "Overall/Administer:admin"
        - "Overall/Read:authenticated"
unclassified:
  location:
    url: http://server_ip:8080/
security:
  queueItemAuthenticator:
    authenticators:
      - global:
          strategy: triggeringUsersAuthorizationStrategy
```



참고

* https://plugins.jenkins.io/configuration-as-code/
* https://www.digitalocean.com/community/tutorials/how-to-automate-jenkins-setup-with-docker-and-jenkins-configuration-as-code
* https://www.digitalocean.com/community/tutorials/how-to-automate-jenkins-job-configuration-using-job-dsl
* https://tomgregory.com/building-a-spring-boot-application-in-jenkins/#1_Creating_a_Spring_Boot_application