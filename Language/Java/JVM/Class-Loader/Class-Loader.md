# 1 Class Loader

* 자바는 동적 로드, 즉 컴파일타임이 아니라 **런타임에 클래스를 처음으로 참조할 때 해당 클래스를 로드하고 링크하는 특징**이 있다. 
* 이 동적 로드를 담당하는 부분이 JVM의 클래스 로더이며 컴파일된 자바 바이트코드를 런타임 데이터 영역(Runtime Data Areas)에 로드한다.
* 클래스 로더가 아직 로드되지 않은 클래스를 찾으면, 다음 그림과 같은 과정을 거쳐 클래스를 로드하고 링크하고 초기화한다.
* `Loading`, `Linking`, `Initalization` 단계를 거친다.

![classloder](images/classloder.png)



# 2 클래스 로더 구조

* 클래스 로더끼리 부모-자식 관계를 이루어 계층 구조를 가진다
* 클래스를 로드할 때 먼저 상위 클래스 로더를 확인하여 해당 클래스가 있다면 사용하고 없다면 로드를 요청받은 클래스 로더가 클래스를 로드한다
* 아래 계층 순서대로 클래스 로더의 종류를 나열하였다

 

1. BOOTSTRAP Class Loader
   * JVM을 기동할 때 생성되며, Object 클래스들을 비롯하여 자바 API들을 로드한다.
   * <JAVA_HOME>/jre/lib 디렉터리에 위치한 핵심 자바 JDK class를 로드한다.
   * 다른 클래스 로더와 달리 자바가 아니라 네이티브 코드로 구현되어 있다.
2. EXTENSION Class Loader
   * 기본 자바 API를 제외한 확장 클래스들을 로드한다. 다양한 보안 확장 기능 등을 여기에서 로드하게 된다.
   * <JAVA_HOME>/jre/lib/ext에 위치한 class를 로드한다.
3. System Class Loader
   * 부트스트랩 클래스 로더와 익스텐션 클래스 로더가 JVM 자체의 구성 요소들을 로드하는 것이라 한다면
   * 시스템 클래스 로더는 애플리케이션의 클래스들을 로드한다고 할 수 있다. 
   * 사용자가 지정한 $CLASSPATH 내의 클래스들을 로드한다.
   * CLASSPATH ENV variable로 명시된 위치에서 jar 와 class를 로드한다. 
     * CLASSPATH, -cp
4. User-Defined Class Loader
   * 애플리케이션 사용자가 직접 코드 상에서 생성해서 사용하는 클래스 로더이다.



# 3 클래스 로드의 단계

* 클래스 로더가 아직 로드되지 않은 클래스를 찾으면 Loading, Linking, Initalization 단계를 거쳐 클래스를 로딩한다

![JVMinternal3](images/helloworld-1230-3.png)



## 3.1 Loading 단계

* 자바 파일을 컴파일해서 만든 class파일을 메모리에 로드하는 역할을 한다.



## 3.2Linking 단계

* 3가지 단계를 거친다

1. Verification 단계
   * 읽어 들인 클래스가 자바 언어 명세(Java Language Specification) 및 JVM 명세에 명시된 대로 잘 구성되어 있는지 검사한다. 
2. Preparation 단계
   * Static 변수가 메모리에 할당되고 default value로 초기화한다.
   * 클래스가 필요로 하는 메모리를 할당하고, 클래스에서 정의된 필드, 메서드, 인터페이스들을 나타내는 데이터 구조를 준비한다.
3. Resolution 단계

   * 클래스의 상수 풀 내 모든 심볼릭 레퍼런스를 다이렉트 레퍼런스로 변경한다.



## 3.3 Initalization 단계

* 클래스 변수들을 적절한 값으로 초기화한다
* Static 변수에 실제 값이 할당된다.
* static initalizer를 실행한다.

