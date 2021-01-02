

# 용어 정리

## Java bytecode(자바 바이트코드)

> 자바 바이트코드(Java bytecode)는 자바 가상 머신이 실행하는 명령어의 형태이다. 각각의 바이트코드는 1바이트로 구성되지만 몇 개의 파라미터가 사용되는 경우가 있어 총 몇 바이트로 구성되는 경우가 있다. 256개의 명령코드 모두가 사용되지는 않는다.
>
> 자바 프로그래머가 자바 바이트코드를 꼭 인지하거나 이해할 필요는 없다. 하지만 IBM의 developerWorks journal에서 제안했듯이 "바이트코드를 이해하고 자바 컴파일러에 의해 바이트코드가 어떻게 생성될 것인지를 이해하는 것은 C나 C++ 프로그래머가 어셈블리어를 이해하는 것과 같다" 라고 볼 수 있다.

예시

```java
for (int i = 2; i < 1000; i++) {
    for (int j = 2; j < i; j++) {
        if (i % j == 0)
            continue outer;
    }
    System.out.println (i);
}
```

자바 컴파일러는 위의 자바 코드를 아래와 같은 바이트 코드로 번역한다:

```
0:   iconst_2
1:   istore_1
2:   iload_1
3:   sipush  1000
6:   if_icmpge       44
9:   iconst_2
10:  istore_2
11:  iload_2
12:  iload_1
13:  if_icmpge       31
16:  iload_1
17:  iload_2
18:  irem
19:  ifne    25
22:  goto    38
25:  iinc    2, 1
28:  goto    11
31:  getstatic       #84; // Field java/lang/System.out:Ljava/io/PrintStream;
34:  iload_1
35:  invokevirtual   #85; // Method java/io/PrintStream.println:(I)V
38:  iinc    1, 1
41:  goto    2
44:  return
```



## **JAR**

> JAR(Java Archive, 자바 아카이브)는 여러개의 자바 클래스 파일과, 클래스들이 이용하는 관련 리소스(텍스트, 그림 등) 및 메타데이터를 하나의 파일로 모아서 자바 플랫폼에 응용 소프트웨어나 라이브러리를 배포하기 위한 소프트웨어 패키지 파일 포맷이다. JAR 파일은 실제로 ZIP 파일 포맷으로 이루어진 압축 파일로서, 파일 확장자는 .jar이다. 

# JVM

> 자바 가상 머신(Java Virtual Machine, JVM)은 자바 바이트코드를 실행할 수 있는 주체이다. 자바 바이트코드는 플랫폼에 독립적이며 모든 자바 가상 머신은 자바 가상 머신 규격에 정의된 대로 자바 바이트코드를 실행한다. 따라서 표준 자바 API까지 동일한 동작을 하도록 구현한 상태에서는 이론적으로 모든 자바 프로그램은 CPU나 운영 체제의 종류와 무관하게 동일하게 동작할 것을 보장한다. 크게 `Class Loader Runtime`,  `Data Area`, `Execution Engine` 로 구성되어 있다.



## Class Loader

> 자바 클래스로더(Java Classloader)는 자바 클래스를 자바 가상 머신(JVM)으로 동적 로드하는 자바 런타임 환경(JRE)의 일부이다.

* `Loading`, `Linking`, `Initalization` 단계를 거친다.

### Loading 단계

* 자바파일을 컴파일해서 만든 class파일을 메모리에 로드하는 역할을 한다.

* 아래와 같이 3가지 종류의 클래스 로더가 있다.

1. **BOOTSTRAP Class Loader**
   * JVM을 기동할 때 생성되며, Object 클래스들을 비롯하여 자바 API들을 로드한다.
   * <JAVA_HOME>/jre/lib 디렉터리에 위치한 핵심 자바 JDK classe를 로드한다.
   * 다른 클래스 로더와 달리 자바가 아니라 네이티브 코드로 구현되어 있다.

2. **EXTENSION Class Loader**
   * 기본 자바 API를 제외한 확장 클래스들을 로드한다. 다양한 보안 확장 기능 등을 여기에서 로드하게 된다.
   * <JAVA_HOME>/jre/lib/ext에 위치한 classe를 로드한다.
3. **APPLICATION Class Loader**
   * 사용자가 지정한 $CLASSPATH 내의 클래스들을 로드한다.
   * CLASSPATH ENV variable로 명시된 위치에서 jar 와 classe 를 로드한다. 
     * CLASSPATH, -cp



### Linking 단계

3가지 단계를 거친다

1. **Verification** 단계

   클래스 파일의 유효성을 검사하고 유효하지 않으면 에러를 던지며 Linking 단계를 중지한다.

2. **Preparation** 단계

   Static 변수가 메모리에 할당되고 default value로 초기화한다.

3. **Resolution** 단계

   모든 symbolic 레퍼런스를 actual 레페런스로 바꾼다.



### Initalization 단계 

* Static 변수에 실제 값이 할당된다.
* static initalizer를 실행한다.



___



# Runtime Data Area

5가지의 메모리 타입이 존재한다.

### Method Area

> 메서드 영역은 모든 스레드가 공유하는 영역으로 JVM이 시작될 때 생성된다. JVM이 읽어 들인 각각의 클래스와 인터페이스에 대한 런타임 상수 풀, 필드와 메서드 정보, Static 변수, 메서드의 바이트코드 등을 보관한다.



### Heap Area

> 쓰레드간 공유가 가능한 지역이며 오브젝트, 클래스의 메타데이터, 배열등 런타임에 생성되는 것들이 저장되는 곳이다. Heap Area는 JVM이 시작 될 때 생성되고 멈추면 삭제된다. Heap Area 용량을 지정할 수 있으며 너무 적거나 많이 요구하지 않도록 주의를 해야한다. `Garbage Collector` 가 이 공간을 지속적으로 모니터링하며 더이상 사용하지 않는 오브젝트를 찾아 공간을 해제한다.



### Stack Memory

> 파라미터, 로컬 변수, 메소드 호출시 return address 등을 저장하는 곳 쓰레드가 허용된 범위 이상으로 스택을 요구하게 되면 스택오버플로우가 발생한다.



### PC Register

> 각각의 쓰레드의 현재 실행중인 인스트럭션의 주소를 저장하는 곳이다.



### Native Method Stack

>  자바 외의 언어로 작성된 네이티브 코드를 위한 스택이다. 즉, JNI(Java Native Interface)를 통해 호출하는 C/C++ 등의 코드를 수행하기 위한 스택으로, 언어에 맞게 C 스택이나 C++ 스택이 생성된다.



___



# Execution Engine

* 바이트코드를 머신코드로 바꾸고 실행하는 역할을 한다.

### Interpreter

* 클래스파일 또는 바이트코드를 한줄 한줄 읽어서 실행한다.
* 단점은 메소드가 여러번 호출될 때 마다 바이트코드를 중복적으로 변환하고 실행하는 과정을 거친다.



### JIT Compiler

> 전통적인 입장에서 컴퓨터 프로그램을 만드는 방법은 두 가지가 있는데, 인터프리트 방식과 정적 컴파일 방식으로 나눌 수 있다. 이 중 인터프리트 방식은 실행 중 프로그래밍 언어를 읽어가면서 해당 기능에 대응하는 기계어 코드를 실행하며, 반면 정적 컴파일은 실행하기 전에 프로그램 코드를 기계어로 번역한다.
>
> JIT 컴파일러는 두 가지의 방식을 혼합한 방식으로 생각할 수 있는데, 실행 시점에서 인터프리트 방식으로 기계어 코드를 생성하면서 그 코드를 캐싱하여, 같은 함수가 여러 번 불릴 때 매번 기계어 코드를 생성하는 것을 방지한다.
>
> JIT 컴파일러가 컴파일하는 과정은 바이트코드를 하나씩 인터프리팅하는 것보다 훨씬 오래 걸리므로, 만약 한 번만 실행되는 코드라면 컴파일하지 않고 인터프리팅하는 것이 훨씬 유리하다. 따라서, JIT 컴파일러를 사용하는 JVM들은 내부적으로 해당 메서드가 얼마나 자주 수행되는지 체크하고, 일정 정도를 넘을 때에만 컴파일을 수행한다.

1. Intermediate Code Generator

* 임시 코드를 생성한다.

2. Code Optimizer

* 더 나은 성능을 위해 임시코드를 최적화 한다.

3. Taget Code Generator

* 임시 코드를 네이티브 머신 코드로 변환한다.

4. Profiler

* 메소드가 반복적으로 호출되는 지점을 역할을 한다.



### Garbage Collector

* 더 이상 사용하지 않는 오브젝트를 메모리에서 해제하는 역할을한다.



### Java Native Method Interface

* JVM excution engin이 네이티브 라이브러리를 이용할 수 있게 해준다.



참조

* https://d2.naver.com/helloworld/1230