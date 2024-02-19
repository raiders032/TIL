# 1 Helm

- 오브젝트 배포에 필요한 사양이 이미 정의된 `차트`라는 `패키지`를 활용한다.
- 헬름 차트 저장소가 온라인에 있어 패키지를 검색하고 내려받아 사용한다.
- 헬름 차트는 자체적인 템플릿 문법을 사용하므로 가변적인 인자를 배포할 때 적용해 다양한 배포 환경에 맞추거나 원하는 조건을 적용할 수 있다
- 쿠버네티스와 헬름의 관계는 레드헷 계열 리눅스와 Yum의 관계라고 할 수 있다.

<br>

**패키지란?**

- 패키지란 실행 파일뿐만 아니라 실행 환경에 필요한 의존성 파일과 환경 정보들의 묶음이다.

<br>

**Helm이 필요한 이유**

- 가장 쉬운 쿠버네티스 배포 방법은 YAML 형식으로 쓰여진 매니페스트를 작성하고 kubectl을 사용해 적용하는 것이다.
- 그러나 시스템이 대규모로 바뀌면서 비슷한 매니페스트를 대량으로 만들어야 하므로 재사용이나 일괄 변경 작업이 어려워 졌다
- 그래서 필요한 것이 매니페스트 범용화라는 개념이다.

<br>

## 1.1 Helm의 작동 원리

- Helm은 쿠버네티스에 패키지를 손쉽게 배포할 수 있도록 패키지를 관리하는 쿠버네티스 전용 패키지 매니저다.
- 패키지 매니저란 외부에 있는 저장소에서 패키지 정보를 받아와 패키지를 안정적으로 관리하는 도구다.

<br>

**패키지 매니저의 기능**

- 패키지 검색: 저장소에서 패키지를 검색할 수 있다.
- 패키지 관리: 패키지 정보를 확인하고 사용자 시스템에 패키지 설치, 삭제, 업데이트, 되돌리기 등을 할 수 있다.
- 패키지 의존성 관리: 패키지를 설치할 때 의존하는 소프트웨어를 같이 설치하고 삭제할 때 같이 삭제한다.
- 패키지 보안 관리: 디지털 인증서와 패키지에 고유하게 발행되는 체크섬으로 패키지의 소프트웨어 의존성이나 변조를 검사할 수 있다.

<br>

**저장소**

- Helm의 기본 저장소는 `artifacthub.io`로 다른 패키지 매니저처럼 외부에 있다.
- https://artifacthub.io/

<br>

# 2 Chart

- 차트는 디렉터리 내부의 파일들의 모음으로 구성된다.
- 디렉터리 이름이 차트의 이름이된다. 

<br>

**디렉토리의 구조**


```
wordpress/
  Chart.yaml          # A YAML file containing information about the chart
  LICENSE             # OPTIONAL: A plain text file containing the license for the chart
  README.md           # OPTIONAL: A human-readable README file
  values.yaml         # The default configuration values for this chart
  values.schema.json  # OPTIONAL: A JSON Schema for imposing a structure on the values.yaml file
  charts/             # A directory containing any charts upon which this chart depends.
  crds/               # Custom Resource Definitions
  templates/          # A directory of templates that, when combined with values,
                      # will generate valid Kubernetes manifest files.
  templates/NOTES.txt # OPTIONAL: A plain text file containing short usage notes
```

- 차트의 디렉토리 구조는 위와 같다.
- 필수적으로 필요한 파일은 Chart.yaml, values.yaml, templates/이 있다.
- 따라서 차트를 생성한다면 위 파일은 필수적으로 생성해야 한다.

<br>

## 2.1 Chart.yaml

- 해당 차트에 대한 메타 정보를 가지고 있다.
- 헬름의 버전, 차트의 이름, 차트의 버전 등을 가지고 있다.
- Chart.yaml 작성 방법은 https://helm.sh/docs/topics/charts/#the-chartyaml-file 이곳을 참조하자

<br>

**Chart.yaml 예시**

```yaml
apiVersion: The chart API version (required)
name: The name of the chart (required)
version: A SemVer 2 version (required)
kubeVersion: A SemVer range of compatible Kubernetes versions (optional)
description: A single-sentence description of this project (optional)
type: The type of the chart (optional)
keywords:
  - A list of keywords about this project (optional)
home: The URL of this projects home page (optional)
sources:
  - A list of URLs to source code for this project (optional)
dependencies: # A list of the chart requirements (optional)
  - name: The name of the chart (nginx)
    version: The version of the chart ("1.2.3")
    repository: (optional) The repository URL ("https://example.com/charts") or alias ("@repo-name")
    condition: (optional) A yaml path that resolves to a boolean, used for enabling/disabling charts (e.g. subchart1.enabled )
    tags: # (optional)
      - Tags can be used to group charts for enabling/disabling together
    import-values: # (optional)
      - ImportValues holds the mapping of source values to parent key to be imported. Each item can be a string or pair of child/parent sublist items.
    alias: (optional) Alias to be used for the chart. Useful when you have to add the same chart multiple times
maintainers: # (optional)
  - name: The maintainers name (required for each maintainer)
    email: The maintainers email (optional for each maintainer)
    url: A URL for the maintainer (optional for each maintainer)
icon: A URL to an SVG or PNG image to be used as an icon (optional).
appVersion: The version of the app that this contains (optional). Needn't be SemVer. Quotes recommended.
deprecated: Whether this chart is deprecated (optional, boolean)
annotations:
  example: A list of annotations keyed by name (optional).
```

<br>

## 2.2 templates/

- 쿠버네티스 리소스를 위한 매니페스트를 이곳에 위치시킨다.
- [Built-in Objects 레퍼런스](https://helm.sh/docs/chart_template_guide/builtin_objects/)

<br>

**Built-in Objects Release**

- `Release.Name`: The release name
- `Release.Namespace`: The namespace to be released into (if the manifest doesn’t override)
- `Release.IsUpgrade`: This is set to `true` if the current operation is an upgrade or rollback.
- `Release.IsInstall`: This is set to `true` if the current operation is an install.
- `Release.Revision`: The revision number for this release. On install, this is 1, and it is incremented with each upgrade and rollback.
- `Release.Service`: The service that is rendering the present template. On Helm, this is always `Helm`

<br>

**Built-in Objects Values**

- `Values`: Values passed into the template from the `values.yaml` file and from user-supplied files. By default, `Values` is empty.

<br>

**Built-in Objects Chart**

- `Chart`: The contents of the `Chart.yaml` file. 
- Any data in `Chart.yaml` will be accessible here. 
- For example `{{ .Chart.Name }}-{{ .Chart.Version }}` will print out the `mychart-0.1.0`.

<br>

## 2.3 values.yaml

- 차트에 대한 기본 값을 설정한다.
- 외부에서 값을 주입하지 않았을 때 사용되는 기본 값을 의미한다.
- `helm install` 또는 `helm upgrade`를 통해 값을 주입해서 사용할 수 있다.
- 따라서 같은 차트에 값을 변경해 재사용할 수 있다.
- [레퍼런스](https://helm.sh/docs/chart_template_guide/values_files/)

<br>

**values.yaml**

- 아래와 같은 내용의 values.yaml가 있다

```yaml
favoriteDrink: coffee
```

- templates/ 디렉토리에 위치한 매니페스트에서 values.yam에 설정한 값을 참조해서 사용할 수 있다.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favoriteDrink }}
```

- values.yaml의 정의된 기본 값은 helm install 명령어에서 --set 옵션으로 오버라이딩할 수 있다.
	- helm install solid-vulture ./mychart --dry-run --debug --set favoriteDrink=slurm

<br>

**values.yaml 파일 미리보기**

- 커스텀한 값을 설정하기 위해서는 차트의 `values.yaml`를 미리 알아야 한다.
- `helm show values [CHART]` 명령어로 차트의 `values.yaml`을 볼 수 있다.

<br>

# 3 Installing Helm

- [레퍼런스](https://helm.sh/docs/intro/install/)

<br>

## 3.1 From the Binary Releases

1. Download your [desired version](https://github.com/helm/helm/releases)
   - 예시) `curl -sL https://get.helm.sh/helm-v3.0.0-linux-amd64.tar.gz`
2. Unpack it (`tar -zxvf helm-v3.0.0-linux-amd64.tar.gz`)
3. Find the `helm` binary in the unpacked directory, and move it to its desired destination (`mv linux-amd64/helm /usr/local/bin/helm`)

<br>

## 3.2  From Script

- 최신 버전의 Helm을 로컬에 설치한다.

```bash
$ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```

<br>

## 3.3 From Apt (Debian/Ubuntu)

```bash
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null

sudo apt-get install apt-transport-https --yes

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list

sudo apt-get update

sudo apt-get install helm
```

<br>

# 4 헬름 저장소

- 기본적으로 참조하는 Chart Repository가 등록되어 있지 않다.
- Chart Repository를 추가하려면 `helm repo add` 명령어를 사용한다.

> Chart Repository
>
> - 여러 차트를 저장, 공유, 검색할 수 있는 중앙 저장소다.

<br>

**저장소 등록**

```bash
$ helm repo add bitnami https://charts.bitnami.com/bitnami
$ helm repo add jenkins https://charts.jenkins.io
$ helm repo add harbor https://helm.goharbor.io
```

<br>

**등록된 저장소 조회**

```bash
$ helm repo list
NAME   	URL
jenkins	https://charts.jenkins.io
bitnami	https://charts.bitnami.com/bitnami
harbor 	https://helm.goharbor.io
```

<br>

**헬름 저장소 업데이트**

```bash
helm repo update
```

<br>

pull# 5 Helm Commands

## 5.1 helm install

```bash
$ helm install [RELEASE_NAME] jenkins/jenkins [flags]
```

- [레퍼런스](https://helm.sh/docs/helm/helm_install/)
- `RELEASE_NAME`
	- 설치된 차트의 인스턴스 이름을 의미한다.
	- 차트를 여러 번 설치해도 이름으로 인스턴스를 식별할 수 있다.
- `jenkins/jenkins`
	- jenkins 리포지토리에 jenkins 차트를 의미한다.



### 5.1.1 --set

- 파리미터가 적은 경우 다음과 같이 `--set` 옵션을 사용한다.
- `--values`와 -`-set`으로 같은 키를 가지는 파라미터를 정의하면 `-set`으로 정의한 파라미터가 우선순위가 더 높다.


**예시**

```
$ helm install sample-wordpress bitnami/wordpress --version 10.9.1 \
--set wordpressUsername=sample-user \
--set wordpressPassword=sample-pass \
--set wordpressBlogName="sample-blog" \
--set persistence.size=5Gi
```


### 5.1.2 --values

- 파라미터가 많은 경우 일일이  `--set` 옵션을 사용해서 파라미터를 명시하는 것은 불편한다.
- 이런 경우 별도의 파일을 만들어 파라미터를 명시하고 `--values` 옵션을 사용해 해당 파일을 넘겨주면 편하다.


**values.yaml**

```yaml
wordpressUsername: sample-user
wordpressPassword: sample-pass
wordpressBlogName: "sample-blog"
persistence:
  size: 5Gi
```

- 먼저 파라미터들을 `values.yaml`에 작성한다.

```bash
$ helm install sample-wordpress bitnami/wordpress \
--version 10.9.1 \
-n namespace \
--values values.yaml
```

- `--values` 옵션을 사용해서 앞서 정의한 파일을 명시한다.
<br>
### 5.1.3 --version

- 차트의 버전을 명시한다. `--version` 옵션을 사용하지 않으면 latest 버전이 사용된다.

<br>

## 5.2 helm uninstall

```bash
$ helm uninstall [RELEASE_NAME]
```

<br>

## 5.3 helm upgrade

```bash
$ helm upgrade [RELEASE_NAME] jenkins/jenkins [flags]
```

<br>

## 5.4 helm pull

```bash
$ helm pull [chart URL | repo/chartname] [...] [flags]
```

- [레퍼런스](https://helm.sh/docs/helm/helm_pull/)
- 리포지토리에서 차트를 로컬 디렉토리에 다운로드 받는다.
- [options](https://helm.sh/docs/helm/helm_pull/#options)

<br>

# 6 차트 찾기

- [레퍼런스](https://helm.sh/docs/intro/using_helm/#helm-search-finding-charts)

<br>

## 6.1 helm search hub

- [Artifact Hub](https://artifacthub.io/)에서 차트를 찾는다.

<br>

**예시**

```bash
$ helm search hub wordpress
URL                                               	CHART VERSION	APP VERSION        	DESCRIPTION
https://artifacthub.io/packages/helm/kube-wordp...	0.1.0        	1.1                	this is my wordpress package
https://artifacthub.io/packages/helm/truecharts...	1.1.16       	6.1.1              	The WordPress rich content management system ca...
https://artifacthub.io/packages/helm/bitnami-ak...	15.2.13      	6.1.0              	WordPress is the world's most popular blogging ...
https://artifacthub.io/packages/helm/bitnami/wo...	15.4.1       	6.2.0              	WordPress is the world's most popular blogging ...
```

<br>

## 6.2 helm search repo

- 로컬에 추가한 리포지토리 내에서 차트를 찾는다.
- 로컬에서 찾기 때문에 네트워크 연결이 필요하지 않다.

<br>

**예시**

```bash
$ helm search repo rook-release/rook-ceph --versions
NAME                          	CHART VERSION	APP VERSION	DESCRIPTION
rook-release/rook-ceph        	v1.11.4      	v1.11.4    	File, Block, and Object Storage Services for yo...
rook-release/rook-ceph        	v1.11.3      	v1.11.3    	File, Block, and Object Storage Services for yo...
rook-release/rook-ceph        	v1.11.2      	v1.11.2    	File, Block, and Object Storage Services for yo...
rook-release/rook-ceph        	v1.11.1      	v1.11.1    	File, Block, and Object Storage Services for yo...
rook-release/rook-ceph        	v1.11.0      	v1.11.0    	File, Block, and Object Storage Services for yo...
```](<--ca-file string             verify certificates of HTTPS-enabled servers using this CA bundle
      --cert-file string           identify HTTPS client using this SSL certificate file
  -d, --destination string         location to write the chart. If this and untardir are specified, untardir is appended to this (default ".")
      --devel                      use development versions, too. Equivalent to version '%3E0.0.0-0'. If --version is set, this is ignored.
  -h, --help                       help for pull
      --insecure-skip-tls-verify   skip tls certificate checks for the chart download
      --key-file string            identify HTTPS client using this SSL key file
      --keyring string             location of public keys used for verification (default "~/.gnupg/pubring.gpg")
      --pass-credentials           pass credentials to all domains
      --password string            chart repository password where to locate the requested chart
      --prov                       fetch the provenance file, but don't perform verification
      --repo string                chart repository url where to locate the requested chart
      --untar                      if set to true, will untar the chart after downloading it
      --untardir string            if untar is specified, this flag specifies the name of the directory into which the chart is expanded (default ".")
      --username string            chart repository username where to locate the requested chart
      --verify                     verify the package before using it
      --version string             specify a version constraint for the chart version to use. This constraint can be a specific tag (e.g. 1.1.1) or it may reference a valid range (e.g. ^2.0.0). If this is not specified, the latest version is used>)