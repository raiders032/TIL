# 1 Gradle 프로젝트 초기화

```bash
$ gradle init --type basic
```

<br>

## 1.1 project type

* Java 프로그래머는 java-application, java-library만 알고 있으면 충분하다.

**java-application**

* Java 애플리케이션 프로젝트 작성에 대한 타입이다. 기본적으로 App.java가 제공된다.

**java-library**

* Java 라이브러리 프로젝트 생성을 위한 타입이다. 단순히 샘플로 제공되는 소스 코드 파일이 응용 프로그램의 메인 클래스가 되어 있지 않다는 정도의 차이이다. (그리고, build.gradle도 조금 다르다)

**groovy-application**

* Groovy 애플리케이션 개발을 위한 프로젝트이다. Groovy 개발의 기본 타입이라고 해도 좋을 것이다.

**groovy-library**

* Groovy 라이브러리 개발을 위한 프로젝트이다. 기본적으로 groovy-application과 같고, 샘플 코드가 다른 정도이다.

**scala-library**

* 이것은 Java 가상 머신에서 구동되는 언어 Scala의 개발 타입이다. Scala에서는 여전히 응용 프로그램의 타입은 준비되어 있지 않은 것 같다.

**basic**

* 기본 타입이다. 이것은 모든 타입의 기반이 되는 것으로 src 는 제공되지 않는다. 
* 또한 빌드 파일도 구체적인 처리 등은 기술되지 않고, build.gradle과 settings.gradle만 생성된다.
*  `--type`을 붙이지 않고, 단순히 `gradle init`만 실행하면 이 basic 타입이 지정된다.

**pom**

* Maven의 pom.xml을 바탕으로 build.gradle 을 생성한다.

<br>

# 2 Gradle 프로젝트 구성

```
. 
├── build.gradle 
├── gradle 
│ 	└── wrapper 
│ 			├── gradle-wrapper.jar 
│ 			└── gradle-wrapper.properties 
├── gradlew 
├── gradlew.bat 
├── settings.gradle 
└── src 
		├── main 
		│ 	└── java 
		│ 			└── App.java 
		└── test 
				└── java 
						└── AppTest.java
```



## 2.1 build.gradle

* 이 Gradle 기본 빌드 설정 파일이다.
* 이 안에 프로젝트의 빌드 처리에 대해서 내용이 작성되어 있다.

<br>

## 2.2 src

* 프로젝트에서 만든 프로그램 관련 폴더이다. 
* 프로젝트에서 사용하는 파일(소스 코드 파일, 각종 리소스 파일 등)은 모두 이 안에 들어간다.

<br>

## 2.3 gradlew, gradlew.bat

* 이 2개는 Gradle의 명령이다. 
* bat가 붙어있는 것이 Windows 용이고, macOS 및 Linux 용이다.

<br>

## 2.4 settings.gradle

* 프로젝트에 대한 설정 정보를 작성한 파일이다.

<br>

## 2.5 gradle

* 이것도 Gradle이 필요한 경우 사용할 폴더이다. 
* 기본적으로 Gradle 환경을 정리한 "wrapper 파일"이라는 파일들이 저장되어 있다.

<br>

# 3 Tasks

##  3.1 Build

빌드 과정과 관련된 태스크들을 포함합니다.

- **`assemble`**: 모든 아카이브 타입의 아티팩트를 생성합니다.
- **`build`**: 프로젝트를 컴파일, 테스트, 아카이브 등을 포함한 전체 빌드 프로세스를 수행합니다.
- **`clean`**: 이전 빌드에서 생성된 파일들을 삭제합니다.
- **`jar`**: Java 프로젝트의 JAR 파일을 생성합니다.
- **`bootJar`**: Spring Boot 애플리케이션의 실행 가능한 JAR 파일을 생성합니다.

<br>

**jar와 bootJar의 차이**

jar

- jar 작업은 표준 Java 라이브러리 JAR 파일을 생성합니다. 
	- 이 JAR 파일은 주로 Java 클래스, 리소스 파일, 메타데이터 등을 포함합니다.
- 일반 Java 애플리케이션 또는 라이브러리를 개발할 때 사용됩니다.
- 이 파일은 자체적으로는 실행되지 않으며, 실행을 위해서는 Java 런타임 환경이 필요합니다
- build.gradle 파일 내에서 jar 블록을 통해 JAR 파일 생성 과정을 구성할 수 있습니다. 
- 예를 들어, 메니페스트 파일의 속성을 설정하거나, 포함될 파일을 정의할 수 있습니다.

bootJar

- bootJar는 Spring Boot 애플리케이션을 위한 실행 가능한 JAR 파일, 종종 "fat jar" 또는 "uber jar"라고 불립니다. 
- 이 파일에는 애플리케이션의 모든 의존성, 클래스, 리소스, 그리고 내장된 서블릿 컨테이너(예: Tomcat)가 포함됩니다.
- Spring Boot 애플리케이션에서 사용됩니다. 이 JAR 파일은 java -jar 명령어로 바로 실행할 수 있으며, 추가적인 의존성 설치 없이 독립적으로 실행될 수 있습니다.
- build.gradle 파일 내에서 bootJar 블록을 통해 JAR 파일의 생성을 구성할 수 있습니다. 예를 들어, 시작 클래스를 지정하거나, 포함될 리소스를 정의할 수 있습니다.

<br>

# 4 Fat Jar 만들기

- [[Jar]] 참고

<br>
## 4.1 Java 플러그인의 Jar Task 사용

- Java Gradle 플러그인에서 jar 태스크를 수정해서 Fat Jar를 생설할 수 있습니다.
- 기본적으로 jar 태스크는 종속성이 없는 jar를 생성합니다.
- jar 태스크를 덮어쓰기 위해 몇 줄의 코드를 추가해야 합니다.
	- 메니페스트 파일에 Main-Class 속성
	- 의존성 jar 포함

<br>

**예시**

```groovy
jar {
    manifest {
        attributes "Main-Class": "com.test.fatjar.Application"
    }

    from {
        configurations.runtimeClasspath.collect { it.isDirectory() ? it : zipTree(it) }
    }
}
```

<br>

## 4.2 별도의 태스크 생성

- 본래의 jar 태스크를 그대로 두고 싶다면, 동일한 작업을 수행할 별도의 태스크를 생성할 수 있습니다.

<br>

**예시**

```groovy
task customFatJar(type: Jar) {
    manifest {
        attributes 'Main-Class': 'com.test.fatjar.Application'
    }
    archiveBaseName = 'all-in-one-jar'
    duplicatesStrategy = DuplicatesStrategy.EXCLUDE
    from { configurations.runtimeClasspath.collect { it.isDirectory() ? it : zipTree(it) } }
    with jar
}
```

- 위 코드는 customFatJar라는 새 작업을 추가합니다:

<br>

## 4.3 전용 플러그인 사용

- fat jar를 빌드하기 위해 기존 Gradle 플러그인을 사용할 수도 있습니다.

**예시**

```
buildscript {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
    dependencies {
        classpath "gradle.plugin.com.github.johnrengelman:shadow:7.1.2"
    }
}
```
```
plugins {
  id 'com.github.johnrengelman.shadow' version '7.1.2'
  id 'java'
}
```

- 위 예시에서는 Shadow 플러그인을 사용합니다.
- Shadow 플러그인을 적용하면 shadowJar 태크스를 사용해 Far Jar를 생성할 수 있습니다.


<br>

# 5 Plugin

- Gradle에서 플러그인은 빌드 스크립트의 기능을 확장하고 커스터마이즈할 수 있는 코드 모음입니다.
- 플러그인을 사용하면 빌드 프로세스에 새로운 태스크, 설정, 규칙 등을 추가할 수 있습니다. 
- 플러그인은 빌드 로직을 모듈화하고 재사용 가능하게 만들어주어 빌드 스크립트를 간소화하고 가독성을 높일 수 있습니다.
- 예를 들어, Spring Boot 플러그인은 Spring Boot 애플리케이션을 빌드하고 실행하는 데 필요한 태스크와 설정을 제공하며, JaCoCo 플러그인은 코드 커버리지 보고서를 생성하는 기능을 추가합니다.

<br>

## 5.1 유형

- Gradle에서는 두 가지 유형의 플러그인이 있습니다:
- 스크립트 플러그인
	- 빌드 스크립트 파일(`build.gradle` 또는 `build.gradle.kts`)에 직접 정의되는 플러그인입니다. 
	- 스크립트 플러그인은 빌드 스크립트 내에서 사용할 수 있는 추가 기능을 제공합니다.
- 바이너리 플러그인
	- 별도의 프로젝트에서 구현되어 JAR 파일로 배포되는 플러그인입니다. 
	- 바이너리 플러그인은 재사용성이 높고 여러 프로젝트에서 공유할 수 있습니다.
	- 바이너리 플러그인은 플러그인 포털 또는 외부 저장소에 게시되어 있는 플러그인을 참조하는 방식입니다. 
	- 플러그인 ID와 버전을 지정하여 플러그인을 적용할 수 있습니다.