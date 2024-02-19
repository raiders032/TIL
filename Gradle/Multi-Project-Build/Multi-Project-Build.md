# 1 Multi Project Build

- [레퍼런스](https://docs.gradle.org/current/userguide/intro_multi_project_builds.html)
- Gradle은 여러 서브 프로젝트로 나뉘어진 대규모 프로젝트의 빌드를 지원한다.
	- 이는 일반적으로 '멀티-모듈 프로젝트'로 불립니다.
- 멀티-프로젝트 구조는 하나의 루트 프로젝트와 하나 이상의 서브 프로젝트로 구성된다.

<br>

## 1.1 Multi-Project structure

**예시**

![[Pasted image 20231219003657.png]]

<br>

**디렉토리 구조**

```
├── .gradle
│   └── ⋮
├── gradle
│   ├── libs.version.toml
│   └── wrapper
├── gradlew
├── gradlew.bat
├── settings.gradle.kts  
├── sub-project-1
│   └── build.gradle.kts 
└── sub-project-2
    └── build.gradle.kts
```

- 예를 들어, 두 개의 서브 프로젝트를 포함하는 멀티-프로젝트 구조는 다음과 위와 같다.
- `.gradle`, `gradle`, `gradlew`, `gradlew.bat`, `settings.gradle.kts` 파일이 루트 디렉토리에 위치한다.
- `settings.gradle.kts` 파일은 모든 서브 프로젝트를 포함해야 한다.
- 각 서브 프로젝트는 자체 `build.gradle.kts` 파일을 가진다.