# 1 GithubAction

<br>

# 2 workflow file

- workflow란 자동화 된 프로세스를 작성하는 것을 뜻한다.
	- 이 프로세스 안에서 한개 이상의 잡이 실행된다.
- 이러한 workflow는 YAML file로 작성되고 특정 이벤트 발생 시 실행시키거나 직접 실행시킬 수 도 있다.
- Workflows file은 리포지토리의 `.github/workflows` 디렉토리에 작성한다.
	- 이 디렉토리에 여러개의 workflow를 작성하는 것도 가능하다.
- [레퍼런스](https://docs.github.com/ko/actions/learn-github-actions/understanding-github-actions#understanding-the-workflow-file)

<br>

## 2.1 name

- Optional
- workflow의 이름을 지정한다.

```yaml
name: learn-github-actions
```



## 2.2 on

- required
- workflow를 트리거할 이벤트를 지정한다.
	- push, pull_reqeust, pull_reqeust_review, pull_reqeust_review_comment 등
	- [이벤트 더 자세히 보기](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows)

<br>

**예시**

- 아래의 예시는 master 브랜치에 푸시 이벤트가 발생하거나 master 브랜치에 풀 리퀘스트 이벤트가 발생하면 workflow가 실행된다.

```yaml
on:
	push:
		branches: [ master]
	pull_request:
		branches: [ master]
```



### 2.2.1 push

- [레퍼런스](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#push)
- 커밋 또는 태그를 푸시했을 때 workflow가 트리거된다.
- 여러 필터를 사용해서 세세한 조절이 가능하다.



`branches`

- [레퍼런스](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#running-your-workflow-only-when-a-push-to-specific-branches-occurs)
- branches 필터를 사용하면 특정 브랜치에 push가 발생했을 때만 workflow를 시작할 수 있다.

```yaml
on:
  push:
    branches:
      - 'main'
      - 'releases/**'
```

- 위처럼 branches 필터를 설정하면 main 브랜치 또는 releases/로 시작하는 브랜치에 푸시가 발생하면 workflow가 시작된다. 



`paths`

- [레퍼런스](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#running-your-workflow-only-when-a-push-affects-specific-files)
- paths 필터를 사용하면 특정 파일에 대한 push 이벤트가 발생했을 때만 workflow를 시작할 수 있다.
- branches 필터와 함께 사용하면 두 조건을 모두 만족했을 때 workflow가 시작된다.

```yaml
on:
  push:
    branches:
      - 'releases/**'
    paths:
      - '**.js'
```

- `releases/`로 시작하는 브랜치에 JavaScript (`.js`) file이 변경될 때만 workflow가 시작되는 예시



### 2.2.2 pull request

- [레퍼런스](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request)
- pull request 발생 시 workflow를 트리거할 수 있다.
- pull request의 여러 액티비티 타입을 지정해서 pull request가 open되었을 때 또는 pull request가 reopne되었을 때 등 세세한 조절이 가능하다.



**예시**

- 아래는 pull_request의 액티비티 타입으로 opened, reopened를 지정했다.
- 따라서 pull_request가 open되거나 reopen될 때 workflow가 트리거된다.

```yaml
on:
  pull_request:
    types: [opened, reopened]
```



**Activity types**

- 지원되는 Activity types은 아래와 같다.
- Activity types을 지정하지 않으면 기본적으로 pull_request가 open, reopen 또는 헤드 브랜치가 변경될 때 workflow가 트리거 된다.
- assigned
- unassigned
- labeled
- unlabeled
- opened
- edited
- closed
- reopened
- synchronize
- converted_to_draft
- ready_for_review
- locked
- unlocked
- review_requested
- review_request_removed
- auto_merge_enabled
- auto_merge_disabled



## 2.3 jobs

- workflow에서 실행할 잡들의 묶음



**예시**

```yaml
jobs:
  build-java:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2

    - name: Set up JDK 1.8
      uses: actions/setup-java@v1
      with:
        java-version: 1.8

    - name: Grant execute permission for gradlew
      run: chmod +x gradlew

    - name: Build with Gradle
      run: ./gradlew build

    - name: Build and Push Docker Image
      uses: mr-smithers-excellent/docker-build-push@v4
      with:
        image: nanajanashia/demo-app
        registry: docker.io
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
```



## 2.4 env

- `env` 키를 사용해서 workflow에 환경변수를 지정할 수 있다.
- `env`의 위치에 따라 환경 변수의 스코프가 결정된다.
    - 최상위 레벨의 `env`에 정의된 변수는 워크플로의 모든 작업과 단계에서 사용할 수 있다.
    - 작업 레벨의 `env`에 정의된 변수는 해당 작업의 모든 단계에서 사용할 수 있다.
    - 단계 레벨의 `env`에 정의된 변수는 해당 단계에서만 사용할 수 있다.
- 환경 변수는 `${{ env.VARIABLE_NAME }}` 구문을 사용하여 워크플로 파일의 다른 부분에서 참조할 수 있다.
- 동일한 이름의 환경 변수가 여러 레벨에서 정의된 경우, 가장 구체적인 레벨의 변수가 우선한다.
    - 예를 들어, Step 레벨의변수가 Job 레벨이나 최상위 레벨의 동일한 이름의 변수를 오버라이드한다.



 **예시**

```yaml
name: Greeting on variable day

on:
  workflow_dispatch

# 탑레벨에 env를 사용하면 workflow 내부 전체에서 사용이 가능하다.
env:
  DAY_OF_WEEK: Monday

jobs:
  greeting_job:
    runs-on: ubuntu-latest
    env:
      Greeting: Hello
    steps:
      - name: "Say Hello Mona it's Monday"
        run: echo "$Greeting $First_Name. Today is $DAY_OF_WEEK!"
        env:
          First_Name: Mona
```



# 3 Context



## 3.1 gitHub context

`github.ref_name`

- 워크플로가 시작된 브랜치의 이름 또는 태그의 심플 버전

`github.run_number`

- 워크플로를 실행을 나타내는 고유한 번호 
- 워크플로의 첫 번째 실행에 대해 1에서 시작하여 새로운 실행마다 1씩 증가한다. 
- 워크플로 실행을 다시 실행해도 번호가 변경되지 않는다.



# 4 Default environment variables

- [미리 정의된 환경변수들](https://docs.github.com/en/actions/learn-github-actions/variables#default-environment-variables)



`GITHUB_REF_NAME`

- 워크플로가 시작된 `브랜치의 이름` 또는 `태그`의 심플 버전
- 풀 버전은 `GITHUB_REF`를 사용한다.



`GITHUB_REF_TYPE`

- 워크플로가 트리거된 종류로 값으로 `branch` 또는 `tag`를 가진다

<br>

# 5 action

- [Marketplace](https://github.com/marketplace?type=actions)에서 사람들이 정의한 action을 그대로 가져와 나의 workflow에서 실행할 수 있다.

<br>

## 5.1 [Checkout](https://github.com/marketplace/actions/checkout)

**예시**

```yaml
- name: Checkout Argocd Repo
  uses: actions/checkout@v3
  with:
    repository: 'OOM-DEV/backend-argocd'
    token: '${{ secrets.GIT_HUB_TOKEN }}'
```



## 5.2 [Add & Commit](https://github.com/marketplace/actions/add-commit)

**예시**

```yaml
- name: Commit Changes
  uses: EndBug/add-and-commit@v9
  with:
    author_name: github-action-bot
    author_email: nameks@naver.com
    add: oom-deployment.yaml
    message: 'Update image tag to ${{ github.ref_name }}'
```



## 5.3 [GitHub Push](https://github.com/marketplace/actions/github-push)

- The GitHub Actions for pushing to GitHub repository local changes authorizing using GitHub token.



**예시**

```yaml
- name: Push Changes
  uses: ad-m/github-push-action@v0.6.0
  with:
    repository: 'OOM-DEV/backend-argocd'
    branch: main
    github_token: ${{ secrets.GIT_HUB_TOKEN }}
```



**Inputs**

| name             | value   | default               | description                                                  |
| ---------------- | ------- | --------------------- | ------------------------------------------------------------ |
| github_token     | string  | `${{ github.token }}` | [GITHUB_TOKEN](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#using-the-github_token-in-a-workflow) or a repo scoped [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token). |
| ssh              | boolean | false                 | Determines if ssh/ Deploy Keys is used.                      |
| branch           | string  | (default)             | Destination branch to push changes. Can be passed in using `${{ github.ref }}`. |
| force            | boolean | false                 | Determines if force push is used.                            |
| force_with_lease | boolean | false                 | Determines if force-with-lease push is used. Please specify the corresponding branch inside `ref` section of the checkout action e.g. `ref: ${{ github.head_ref }}`. |
| atomic           | boolean | true                  | Determines if [atomic](https://git-scm.com/docs/git-push#Documentation/git-push.txt---no-atomic) push is used. |
| tags             | boolean | false                 | Determines if `--tags` is used.                              |
| directory        | string  | '.'                   | Directory to change to before pushing.                       |
| repository       | string  | ''                    | Repository name. Default or empty repository name represents current github repository. If you want to push to other repository, you should make a [personal access token](https://github.com/settings/tokens) and use it as the `github_token` input. |

<br>

## 5.4 [Setup Java JDK](https://github.com/marketplace/actions/setup-java-jdk#supported-version-syntax)

**예시**

```yaml
- name: Set up JDK 17
  uses: actions/setup-java@v1
  with:
    java-version: 17
```

<br>

## 5.5 [Docker Build & Push Action](https://github.com/marketplace/actions/docker-build-push-action)



**예시**

```yaml
env:
  DOCKER_IMAGE_NAME: neptunes032/oom

...

- name: Build and Push Docker Image
  uses: mr-smithers-excellent/docker-build-push@v6
  with:
    image: $DOCKER_IMAGE_NAME
    tags: ${{ github.ref_name }}
    registry: docker.io
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}
```



# 6 runner

- runner란 실제 workflow를 실행하는 서버를 의미한다.
- github는 Ubuntu Linux, Microsoft Windows, and macOS runners를 제공한다.
- 각각의 workflow는 새롭게 프로비저닝된 가상 머신에서 실행된다.
- 다른 OS가 필요하거나 특정 하드웨어가 필요하다면 직접 runner를 구성할 수도 있습니다.
	- [Hosting your own runners](https://docs.github.com/en/actions/hosting-your-own-runners)

<br>

# 6.1 self-hosted runners

- GitHub에서 호스팅하는 러너보다 하드웨어, 운영 체제 및 소프트웨어 도구에 대한 더 많은 제어를 제공합니다.
- 자체 호스팅 러너를 사용하면, 더 큰 작업을 실행할 수 있는 처리 능력이나 메모리와 같은 사용자의 요구에 맞는 맞춤 하드웨어 구성을 만들 수 있습니다.
- 또한, 로컬 네트워크에서 사용 가능한 소프트웨어를 설치하고, GitHub에서 호스팅하는 러너가 제공하지 않는 운영 체제를 선택할 수 있습니다.
- 자체 호스팅 러너는 물리적, 가상, 컨테이너 내, 현장(온프레미스), 또는 클라우드 내에서 사용할 수 있습니다.

<br>

### 6.1.1 관리 레벨

- 관리 레벨에 따라 관리 범위를 지정할 수 있습니다.
- Repository-level: 리포지토리 수준 러너는 단일 리포지토리에 한정합니다.
- Organization-level: 조직 수준 러너는 조직 내 여러 리포지토리의 작업을 처리할 수 있습니다.
- Enterprise-level: 엔터프라이즈 수준 러너는 엔터프라이즈 계정의 여러 조직에 할당될 수 있습니다.

<br>

### 6.1.2 self-hosted runner application 설치

- self-hosted runner로 사용될 호스트에 self-hosted runner application을 설치해야 합니다.

<br>

**설치 과정**

- 조직 레벨의 runner를 설치해봅시다.

1. GitHub에 로그인한 후 조직의 메인 페이지로 이동합니다.
2. 조직의 설정으로 이동하기 위해 페이지 상단의 메뉴에서 'Settings'를 선택합니다.
3. 왼쪽 사이드바에서 'Actions' 메뉴를 찾아 선택한 후, 'Runners' 탭으로 이동합니다.
4. 페이지 상단의 'New runner' 버튼을 클릭합니다.
5. 러너를 설치할 운영 체제(OS)와 아키텍처를 선택한 다음, GitHub에서 제공하는 지시사항을 따릅니다. 이 지시사항은 자체 호스팅 러너 애플리케이션을 다운로드하고, 해당 조직에 대해 러너를 구성하는 방법을 안내합니다.
6. 다운로드한 러너 애플리케이션을 조직의 서버에 설치하고, 구성 스크립트를 실행할 때 조직의 URL과 특정 조직에 대한 러너의 등록 토큰을 사용합니다.
7. 러너 구성이 완료되면, 지시된 대로 러너 서비스를 시작합니다.

<br>

### 6.1.3 서비스 설정

- [레퍼런스](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/configuring-the-self-hosted-runner-application-as-a-service)
- 자체 호스팅 러너 애플리케이션을 서비스로 설정하여 머신이 시작될 때마다 러너 애플리케이션이 자동으로 시작되도록 할 수 있습니다.
- systemd를 사용하는 Linux 시스템의 경우, 러너를 성공적으로 추가한 후 생성된 svc.sh 스크립트를 사용하여 애플리케이션을 서비스로 설치하고 관리할 수 있습니다.
- 러너 애플리케이션을 설치한 디렉토리에서 셸을 엽니다. 
- 아래의 명령어를 사용하여 자체 호스팅 러너 서비스를 설치하고 관리할 수 있습니다.

<br>

**명령어**

```bash
// 서비스 설치
$ sudo ./svc.sh install

// 서비스 시작
$ sudo ./svc.sh start

// 서비스 상태 확인
$ sudo ./svc.sh status

// 서비스 중지
$ sudo ./svc.sh stop

// 서비스 제거
$ sudo ./svc.sh uninstall
```