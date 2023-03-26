# 1 GithubAction



# 2 workflow file

- workflow의 yaml 문법에대해서 알아보자.
- [레퍼런스](https://docs.github.com/ko/actions/learn-github-actions/understanding-github-actions#understanding-the-workflow-file)



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



**예시**

- 아래의 예시는 master 브랜치에 푸시 이벤트가 발생하거나 master 브랜치에 풀 리퀘스트 이벤트가 발생하면 workflow가 실행된다.

```yaml
on:
	push:
		branches: [ master]
	pull_request:
		branches: [ master]
```



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
- env의 위치에 따라 환경 변수의 스코프가 결정된다.
- [미리 정의된 환경변수들](https://docs.github.com/en/actions/learn-github-actions/variables#default-environment-variables)



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



# 3 action

- [Marketplace](https://github.com/marketplace?type=actions)에서 사람들이 정의한 action을 그대로 가져와 나의 workflow에서 실행할 수 있다.



## 3.1 [Checkout](https://github.com/marketplace/actions/checkout)

**예시**

```yaml
- name: Checkout Argocd Repo
  uses: actions/checkout@v3
  with:
    repository: 'OOM-DEV/backend-argocd'
    token: '${{ secrets.GIT_HUB_TOKEN }}'
```



## 3.2 [Add & Commit](https://github.com/marketplace/actions/add-commit)

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



## 3.3 [GitHub Push](https://github.com/marketplace/actions/github-push)

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





## 3.4 [Setup Java JDK](https://github.com/marketplace/actions/setup-java-jdk#supported-version-syntax)

**예시**

```yaml
- name: Set up JDK 17
  uses: actions/setup-java@v1
  with:
    java-version: 17
```



## 3.5 [Docker Build & Push Action](https://github.com/marketplace/actions/docker-build-push-action)



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

