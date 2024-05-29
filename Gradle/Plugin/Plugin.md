# 1 Plugin

- plugins 블록에서 java-gradle-plugin을 적용하여 Gradle 플러그인 개발을 위한 설정을 합니다.
- gradlePlugin 블록에서 플러그인의 ID와 구현 클래스를 지정합니다.
	- id는 플러그인의 고유 식별자이며, 다른 프로젝트에서 플러그인을 적용할 때 사용됩니다.
	- implementationClass는 플러그인의 기능을 구현하는 클래스의 전체 경로를 지정합니다.


# 배포하기

- publishing 블록에서 플러그인 배포를 위한 설정을 합니다.
- repositories 블록에서 플러그인을 배포할 Maven 리포지토리의 URL과 인증 정보를 지정합니다.
- publications 블록에서 배포할 플러그인의 정보를 설정합니다.
- pluginMaven은 배포할 Publication의 이름입니다.
- from components.findByName("javaGradlePlugin")은 Gradle 플러그인 컴포넌트를 찾아 배포 대상으로 지정합니다.
- groupId, artifactId, version은 배포할 플러그인의 Maven 좌표를 지정합니다.