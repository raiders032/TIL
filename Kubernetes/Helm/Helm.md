# 1 Helm

- 오브젝트 배포에 필요한 사양이 이미 정의된 `차트`라는 `패키지`를 활용한다.
- 헬름 차트 저장소가 온라인에 있어 패키지를 검색하고 내려받아 사용한다.
- 헬름 차트는 자체적인 템플릿 문법을 사용하므로 가변적인 인자를 배포할 때 적용해 다양한 배포 환경에 맞추거나 원하는 조건을 적용할 수 있다
- 쿠버네티스와 헬름의 관계는 레드헷 계열 리눅스와 Yum의 관계라고 할 수 있다.



**Helm이 필요한 이유**

- 가장 쉬운 쿠버네티스 배포 방법은 YAML 형식으로 쓰여진 매니페스트를 작성하고 kubectl을 사용해 적용하는 것이다.
- 그러나 시스템이 대규모로 바뀌면서 비슷한 매니페스트를 대량으로 만들어야 하므로 재사용이나 일괄 변경 작업이 어려워 졌다
- 그래서 필요한 것이 매니페스트 범용화라는 개념이다.



## 1.1 Helm의 작동 원리

- Helm은 쿠버네티스에 패키지를 손쉽게 배포할 수 있도록 패키지를 관리하는 쿠버네티스 전용 패키지 매니저다.
- 패키지란 실행 파일뿐만 아니라 실행 환경에 필요한 의존성 파일과 환경 정보들의 묶음이다.
- 패키지 매니저란 외부에 있는 저장소에서 패키지 정보를 받아와 패키지를 안정적으로 관리하는 도구다.



**패키지 매니저의 기능**

- 패키지 검색: 저장소에서 패키지를 검색할 수 있다.
- 패키지 관리: 패키지 정보를 확인하고 사용자 시스템에 패키지 설치, 삭제, 업데이트, 되돌리기 등을 할 수 있다.
- 패키지 의존성 관리: 패키지를 설치할 때 의존하는 소프트웨어를 같이 설치하고 삭제할 때 같이 삭제한다.
- 패키지 보안 관리: 디지털 인증서와 패키지에 고유하게 발행되는 체크섬으로 패키지의 소프트웨어 의존성이나 변조를 검사할 수 있다.



**저장소**

- Helm의 기본 저장소는 `artifacthub.io`로 다른 패키지 매니저처럼 외부에 있다.



# 2 Installing Helm

- [레퍼런스](https://helm.sh/docs/intro/install/)



## 2.1 From the Binary Releases

1. Download your [desired version](https://github.com/helm/helm/releases)
   - 예시) `curl -sL https://get.helm.sh/helm-v3.0.0-linux-amd64.tar.gz`
2. Unpack it (`tar -zxvf helm-v3.0.0-linux-amd64.tar.gz`)
3. Find the `helm` binary in the unpacked directory, and move it to its desired destination (`mv linux-amd64/helm /usr/local/bin/helm`)



## 2.2  From Script

- 최신 버전의 Helm을 로컬에 설치한다.

```bash
$ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```



# 3 헬름 저장소

- 기본적으로 참조하는 저장소가 등록되어 있지 않다.
- 저장소를 추가하려면 `helm repo add` 명령어를 사용한다.



**저장소 등록**

```bash
$ helm repo add bitnami https://charts.bitnami.com/bitnami
$ helm repo add jenkins https://charts.jenkins.io
$ helm repo add harbor https://helm.goharbor.io
```



**등록된 저장소 조회**

```bash
$ helm repo list
NAME   	URL
jenkins	https://charts.jenkins.io
bitnami	https://charts.bitnami.com/bitnami
harbor 	https://helm.goharbor.io
```



**헬름 저장소 업데이트**

```bash
helm repo update
```



# 4 차트 설치

## 4.1 Install Chart

```bash
$ helm install [RELEASE_NAME] jenkins/jenkins [flags]
```



파리미터가 적은 경우 다음과 같이 --set 옵션을 사용한다.

```
$ helm install sample-wordpress bitnami/wordpress --version 10.9.1 \
--set wordpressUsername=sample-user \
--set wordpressPassword=sample-pass \
--set wordpressBlogName="sample-blog" \
--set persistence.size=5Gi
```



파라미터가 많은 경우나 코드화가 필요한 경우 다음과 같이 values.yaml 파일을 생성하여 읽어 들이는 방식을 사용한다.

**values.yaml**

```yaml
wordpressUsername: sample-user
wordpressPassword: sample-pass
wordpressBlogName: "sample-blog"
persistence:
  size: 5Gi
```

```bash
$ helm install sample-wordpress bitnami/wordpress --version 10.9.1 \
--values values.yaml
```



## 4.2 Uninstall Chart

```bash
$ helm uninstall [RELEASE_NAME]
```



## 4.3 Upgrade Chart

```bash
$ helm upgrade [RELEASE_NAME] jenkins/jenkins [flags]
```