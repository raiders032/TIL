# 1. [GitLab CI/CD](https://docs.gitlab.com/ee/ci/)

> GitLab CI/CD는 소프트웨어 개발을 위해 GitLab에 내장된 도구로 아래와 같은 기능을 제공한다.

* Continuous Integratisdfon (CI)
* Continuous Delivery (CD)
* Continuous Deployment (CD)
* [CICD 개념](https://docs.gitlab.com/ee/ci/introduction/index.html)



## 1.1 Concepts

| Concept                                                      | Description                                                  |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [Pipelines](https://docs.gitlab.com/ee/ci/pipelines/index.html) | 파이프라인을 통해 CI/CD 프로세스를 구성합니다                |
| [CI/CD variables](https://docs.gitlab.com/ee/ci/variables/README.html) | 변수/값 키 쌍을 기반으로 값을 재사용합니다.                  |
| [Environments](https://docs.gitlab.com/ee/ci/environments/index.html) | 다양한 환경(예: 스테이징, 프로덕션)에 애플리케이션을 배포합니다. |
| [Job artifacts](https://docs.gitlab.com/ee/ci/pipelines/job_artifacts.html) | 작업 아티팩트를 출력, 사용 및 재사용합니다.                  |
| [Cache dependencies](https://docs.gitlab.com/ee/ci/caching/index.html) | 빠른 실행을 위해 종속성을 캐시합니다.                        |
| [GitLab Runner](https://docs.gitlab.com/runner/)             | 스크립트를 실행할 수 있도록 사용자 자신의 GitLab Runner를 구성합니다. |
| [Pipeline efficiency](https://docs.gitlab.com/ee/ci/pipelines/pipeline_efficiency.html) | 빠르고 효율적으로 실행되도록 파이프라인을 구성합니다.        |
| [Test cases](https://docs.gitlab.com/ee/ci/test_cases/index.html) | 빠르고 효율적으로 실행되도록 파이프라인 구성                 |



## 1.2 GitLab CI/CD 프로세스 흐름

1. GitLab CI/CD를 사용하기 위해선 작업을 실행할 수 있는 `Runner`가 있는지 확인합니다. 

2. `Runner`가 없는 경우 GitLab Runner를 설치하고 프로젝트에 `Runner`를 등록합니다.

3. 리포지토리의 루트에 `.gitlab-ci.yml` 파일을 만듭니다. 

   * 이 파일은 CI/CD 작업을 정의하는 곳입니다.

   * `.gitlab-ci.yml`파일을 리포지토리에 커밋하면  `Runner`가 작업을 실행합니다. 
   * 작업 결과는 파이프라인에 표시됩니다.

>  Runner란?
>
> * GitLab에서 `Runner`는 CI/CD 작업을 실행하는 에이전트입니다.
> * runner는 .gitlab-ci.yml에 정의된 코드를 실행합니다.
> * GitLab 인스턴스의 모든 프로젝트에서 사용할 수 있는 공유  `Runner`를 포함하여 프로젝트에 사용할 수 있는  `Runner`가 이미 있을 수 있습니다.



## 1.3 실행 가능한 러너 확인하기

* Settings > CI/CD > Runners > Expand

<img src=".\images\러너확인.png" alt="image-20210610162604764" style="zoom:70%;" />



# 2. Gitlab Runner 설치 및 등록

**[설치](https://docs.gitlab.com/runner/install/)**

* [Run GitLab Runner in a container](https://docs.gitlab.com/runner/install/docker.html)
* [Install GitLab Runner using the official GitLab repositories](https://docs.gitlab.com/runner/install/linux-repository.html)



**[등록](https://docs.gitlab.com/runner/register/)**

* `Runner` 등록은 하나 이상의 GitLab 인스턴스로 러너를 바인딩하는 프로세스입니다.
* register 명령을 반복하여 각각 다른 구성의 동일한 호스트 시스템에 여러 개의 runner를 등록할 수 있습니다.



**도커를 이용한 Gitlab Runner 설치 및 등록 예시 **

1. gitlab-runner를 컨테이너로 실행한다.

```bash
   docker run -d --name gitlab-runner --restart always \
     -v /srv/gitlab-runner/config:/etc/gitlab-runner \
     -v /var/run/docker.sock:/var/run/docker.sock \
     gitlab/gitlab-runner:latest
```

>  On macOS, use `/Users/Shared` instead of `/srv`.

2. 깃랩 컨테이너로 접속

```bash
docker exec -it gitlab-runner /bin/bash
```

3. Runner 등록

* 깃랩 콘솔에서 Settings > CI/CD > Runners > Expand
* Register URL과 registration token 확인

![image-20210615114705037](.\images\러너URL토큰확인.png)

```bash
sudo gitlab-runner register -n \
  --url https://gitlab.gabia.com/ \
  --registration-token hBR6G-8pwzaJ-SnZxSWv \
  --executor shell \
  --description "My Runner"
```

4. 등록 확인

![image-20210615114836082](.\images\러너등록확인.png)



## 2.1 [Executors](https://docs.gitlab.com/runner/executors/README.html)

> `Gitlab Runner` 는 다양한 `Executor` 를 구현해 제공하고 있습니다. `Executor`는 다양한 시나리오에서 빌드를 실행하는 데 사용됩니다.



### 2.1.1 **제공되는 Executors**

- [SSH](https://docs.gitlab.com/runner/executors/ssh.html)

- [Shell](https://docs.gitlab.com/runner/executors/shell.html)

- [Parallels](https://docs.gitlab.com/runner/executors/parallels.html)

- [VirtualBox](https://docs.gitlab.com/runner/executors/virtualbox.html)

- [Docker](https://docs.gitlab.com/runner/executors/docker.html)

- [Docker Machine (auto-scaling)](https://docs.gitlab.com/runner/executors/docker_machine.html)

- [Kubernetes](https://docs.gitlab.com/runner/executors/kubernetes.html)

- [Custom](https://docs.gitlab.com/runner/executors/custom.html)

  

### 2.1.2 [Shell executor](https://docs.gitlab.com/runner/executors/shell.html#selecting-your-shell)

> Shell executor는 GitLab Runner가 설치된 시스템에서 로컬로 빌드를 실행하는 데 사용하는 단순 실행자입니다. Runner를 설치할 수 있는 모든 시스템을 지원합니다. 즉, Bash, PowerShell Core, Windows PowerShell로 생성된 스크립트를 사용할 수 있습니다.

* 셸은 가장 간단하게 구성할 수 있습니다. 
* 빌드에 필요한 모든 종속성은 GitLab Runner가 설치된 동일한 시스템에 수동으로 설치해야 합니다.



### 2.1.3 [Docker executor](https://docs.gitlab.com/runner/executors/docker.html)

> Docker를 사용하여 손쉽게 종속성 관리(프로젝트를 빌드하기 위한 모든 종속성을 Docker 이미지에 넣을 수 있음)를 수행할 수 있습니다. Docker executor는 GitLab CI와 함께 사용될 때 Docker Engine에 연결되고 .gitlab-ci.yml에 설정된 미리 정의된 이미지와 config.toml에 따라 분리된 컨테이너에서 각 빌드를 실행합니다.

* Docker executor를 사용하면 MySQL과 같은 종속 서비스를 사용하여 빌드 환경을 쉽게 만들 수 있습니다.
* Docker executor를 사용하면 GitLab Runner는 Docker를 사용하여 사용자가 제공한 이미지에서 작업을 실행할 수 있습니다.



# 3. `.gitlab-ci.yml` file 작성하기

* Runner가 수행할 instructions을 정의하는 파일
* repository 루트에 .gitlab-ci.yml라는 파일울 작성해야 한다.
* .gitlab-ci.yml 파일을 저장소에 저장하면 GitLab이 이를 감지하고 GitLab Runner라는 애플리케이션이 .gitlab-ci.yml에 정의된 스크립트를 실행합니다.

**예시**

```yaml
build-job:
  stage: build
  script:
    - echo "Hello, $GITLAB_USER_LOGIN!"

test-job1:
  stage: test
  script:
    - echo "This job tests something"

test-job2:
  stage: test
  script:
    - echo "This job tests something, but takes more time than test-job1."
    - echo "After the echo commands complete, it runs the sleep command for 20 seconds"
    - echo "which simulates a test that runs 20 seconds longer than test-job1"
    - sleep 20

deploy-prod:
  stage: deploy
  script:
    - echo "This job deploys something from the $CI_COMMIT_BRANCH branch."
```



## 3.1 [Keyword reference for the .gitlab-ci.yml file](https://docs.gitlab.com/ee/ci/yaml/README.html)



[**The `image` keyword**](https://docs.gitlab.com/runner/executors/docker.html#the-image-keyword)

>  `image` 키워드는 빌드가 실행될 컨테이너를 만드는 데 사용되는 Docker 이미지를 나타낸다.

[**The `services` keyword**](https://docs.gitlab.com/runner/executors/docker.html#the-services-keyword)

> `services` 키워드는 빌드 중에 실행되고 `image`키워드가 정의하는 Docker 이미지에 연결된 다른 Docker 이미지를 의미한다. 이를 통해 빌드 시간 동안 서비스 이미지에 액세스 할 수 있습니다.



# 4. Use Docker to build Docker images

> Docker와 함께 GitLab CI/CD를 사용하여 Docker 이미지를 생성할 수 있습니다.  애플리케이션의 Docker 이미지를 만들고 테스트한 후 컨테이너 레지스트리에 업로드할 수 있습니다.



CI/CD job에서 도커 커맨드를 실행하기 위해선 3가지 방법이 있습니다.

1. [The shell executor](https://docs.gitlab.com/ee/ci/docker/using_docker_build.html#use-the-shell-executor)
2. [The Docker executor with the Docker image (Docker-in-Docker)](https://docs.gitlab.com/ee/ci/docker/using_docker_build.html#use-the-docker-executor-with-the-docker-image-docker-in-docker)
3. [Docker socket binding](https://docs.gitlab.com/ee/ci/docker/using_docker_build.html#use-docker-socket-binding)



## 4.1 shell executor 사용하기

* 깃랩 러너가 설치된 곳에 도커가 설치되어 있어야함
* 따라서 깃랩 러너를 컨테이너로 띄우지 말아야한다.

1. 깃랩 러너 설치
2. 깃랩 러너 등록

```bash
sudo gitlab-runner register -n \
  --url https://gitlab.com/ \
  --registration-token REGISTRATION_TOKEN \
  --executor shell \
  --description "My Runner"
```

3. `gitlab-runner` 유저를  `docker` group에 추가하기

```bash
sudo usermod -aG docker gitlab-runner
```

4. `.gitlab-ci.yml` 작성하기

* 이제 Docker 명령을 사용할 수 있습니다
* 필요한 경우 Docker-compose 설치

```yml
before_script:
  - docker info

build_image:
  script:
    - docker build -t demo-email-service .
    - docker stop demo-email-service
    - docker run --rm -d --name demo-email-service -p 8080:8080 demo-email-service
```



## 4.2 Docker executor 사용하기





## 4.3 Docker socket binding 사용하기

* CI/CD 작업에서 Docker 명령을 사용하기위해 `/var/run/docker`를 컨테이너로 바인딩 마운트한다.

1. 깃랩 러너 컨테이너로 실행하기

```bash
$ docker run -d --rm --name gitlab-runner \
  -v /srv/gitlab-runner/config:/etc/gitlab-runner \
  -v /var/run/docker.sock:/var/run/docker.sock \
  gitlab/gitlab-runner:latest
  
$ docker ps
CONTAINER ID   IMAGE                         COMMAND                  CREATED          STATUS          PORTS     NAMES
bea09d631fe1   gitlab/gitlab-runner:latest   "/usr/bin/dumb-init …"   14 seconds ago   Up 13 seconds             gitlab-runner
```

2. 깃랩 러너 컨테이너 접속

```bash
$ docker container exec -it gitlab-runner bash
```

3. 러너 등록
   * Docker executor를 사용하고 Docker commands를 사용할 수 있도록  `/var/run/docker.sock`을 공유한다.
   * 이 명령어는 docker:19.03.12를 사용하는 새로운 러너를 등록한다.
   * Docker 명령에 의해 생성 된 모든 컨테이너는 러너의 자식이 아니라 러너의 형제다.

```bash
sudo gitlab-runner register -n \
  --url https://gitlab.gabia.com/ \
  --registration-token SZb7XiRiMefNKDdTkp-3 \
  --executor docker \
  --description "Demo App on 238" \
  --docker-image "docker:19.03.12" \
  --docker-volumes /var/run/docker.sock:/var/run/docker.sock
  
```

4. `.gitlab-ci.yml` 작성

```yml
image: docker:19.03.12

stages:
  - build
  - push
  - deploy

variables:
  IMAGE_NAME: neptunes032/demo
  CONTAINER_NAME: demo
  ENVIROMENT: staging

build:
  image: gradle:6.9.0-jdk11
  stage: build
  script:
    - gradle clean build
  artifacts:
    paths:
      - build/libs/*.jar

build-docker-image:
  stage: build
  script:
    - docker login -u $DOCKER_HUB_ID -p $DOCKER_HUB_PASSWORD
    - docker build -t $IMAGE_NAME .
    - docker push $IMAGE_NAME
  environment:
    name: $ENVIROMENT

deploy-container:
  stage: deploy
  script:
    - apk upgrade && apk update
    - apk add openssh-client
    - apk add sshpass
    - sshpass -p "$USER_PASSWORD" ssh -o StrictHostKeyChecking=no $USER_ID@$STAGING_SERVER docker pull $IMAGE_NAME
    - sshpass -p "$USER_PASSWORD" ssh -o StrictHostKeyChecking=no $USER_ID@$STAGING_SERVER "docker stop $CONTAINER_NAME || true"
    - sshpass -p "$USER_PASSWORD" ssh -o StrictHostKeyChecking=no $USER_ID@$STAGING_SERVER docker run --rm -d -p 80:8080 --name $CONTAINER_NAME $IMAGE_NAME
  environment:
    name: $ENVIROMENT
    url: http://$STAGING_SERVER
```



# 5. [Push Docker Images by using GitLab CI/CD](https://docs.gitlab.com/ee/user/packages/container_registry/#build-and-push-by-using-gitlab-cicd)

* GitLab CI/CD를 사용하여 이미지를 작성하고 컨테이너 레지스트리로 푸시합니다. 
* 작성한 Docker 이미지에서 프로젝트를 테스트, 빌드 및 배포하는 데 사용합니다.



### 컨테이너 레지스트리 인증



참고

* https://www.slideshare.net/ienvyou/docker-gitlab-cicd

