# 1 SDKMAN

- SDKMAN!을 사용하여 Java를 설치하고 관리하는 방법에 대한 완벽 가이드를 제공하려고 합니다.
- SDKMAN!은 Java, Groovy, Scala 등 다양한 소프트웨어 개발 키트(SDK)를 쉽게 설치하고 관리할 수 있는 도구입니다.

<br>

# 2 SDKMAN 설치

```bash
// SDKMAN 설치
$ curl -s "https://get.sdkman.io" | bash

// SDKMAN 초기화
$ source "$HOME/.sdkman/bin/sdkman-init.sh"
```

<br>

# 3 Java 설치

```bash
// Java 버전 목록 조회
$ sdk list java

// java 17.0.10-amzn 설치
$ sdk install java 17.0.10-amzn
```

<br>

# 4 Java 버전 확인

```bash
$ sdk current java
Using java version 17.0.10-amzn
```

<br>

# 5 Java 버전 변경

```bash
$ sdk use java 8.0.252-open
```

- 버전 변경 전에 해당 버전이 설치되어 있어야 한다.

<br>

# 6 기본값 설정

```bash
$ sdk default java java 17.0.10-amzn
```

- 특정 Java 버전을 기본값으로 설정