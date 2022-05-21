# 문자열 연결은 느리니 주의하라



# 1 개요

* 문자열 연결 연산자인 `+` 는 여러 문자열을 하나로 합쳐주는 편리한 수단이다
* `+` 연산자의 성능은 O(n^2)에 비례한다
* String은 불변이기 때문에 String을 연결하기 위해서는 양쪽의 내용을 모두 복사해 새로운 String을 만들어내므로 성능 저하를 피할 수 없다



# 2 성능 측정

* `+` 연산자, StringBuilder, StringBuffer를 이용해서 문자열을 연결해보고 성능을 측정해보자 



## 2.1 + 연산자

```java
@Test
void string_plus_operator() {
  String name = "youngThree";
  String result = "";

  StopWatch stopWatch = new StopWatch("+ Operator");
  stopWatch.start();
  for (int i = 0; i < 100_000; i++) {
    result += name;
  }
  stopWatch.stop();

  System.out.println(stopWatch.prettyPrint());
}
```

```
StopWatch '+ Operator': running time = 5559258559 ns
```



## 2.2 StringBuilder

```java
@Test
void string_plus_StringBuilder() {
  String name = "youngThree";
  StringBuilder stringBuilder = new StringBuilder();

  StopWatch stopWatch = new StopWatch("StringBuilder");
  stopWatch.start();
  for (int i = 0; i < 100_000; i++) {
    stringBuilder.append(name);
  }
  stopWatch.stop();

  System.out.println(stopWatch.prettyPrint());
}
```

```
StopWatch 'StringBuilder': running time = 3960074 ns
```



## 2.3 StringBuffer

```java
@Test
void string_plus_StringBuffer() {
  String name = "youngThree";
  StringBuffer stringBuffer = new StringBuffer();

  StopWatch stopWatch = new StopWatch("StringBuffer");
  stopWatch.start();
  for (int i = 0; i < 100_000; i++) {
    stringBuffer.append(name);
  }
  stopWatch.stop();

  System.out.println(stopWatch.prettyPrint());
}
```

```
StopWatch 'StringBuffer': running time = 5186206 ns
```



## 2.4 성능 비교

* n = 100,000

|               | 시간          |
| ------------- | ------------- |
| + 연산자      | 5559258559 ns |
| StringBuilder | 3960074 ns    |
| StringBuffer  | 5186206 ns    |



# 3 StringBuilder & StringBuffer



## 3.1 StringBuilder

* 클래스 내부 버퍼에 문자열을 저장해 두고 추가, 수정, 삭제 작업을 할 수 있도록 설계되어 있다.
* StringBuilder와 StringBuffer의 사용법은 동일하다
* **StringBuilder**는 단일 스레드 환경에서만 사용하도록 설계되어 있다.
  * **Thread Safe하지 않다.**
  * **StringBuffer는 Thread Safe**하다
* 버퍼가 부족할 경우 자동으로 버퍼의 크기를 늘리기 때문에 초기 버퍼의 크기는 그다지 중요하지 않다



## 3.2 StringBuffer

* StringBuilder의 API와 같다고 볼 수 있다
* 멀티 스레드 환경에서 사용할 수 있도록 동기화가 적용되어 있어 **Thread Safe**하다
* 싱글 스레드에서만 쓰이는 StringBuffer는 StringBuilder로 대체하는 것이 성능상 유리하다



## 3.3 메서드 비교

* 메서드에 synchronized 키워드를 적용 멀티 스레드 환경에서도 thread-safe하다

**StringBuilder의 append 메서드**

```java
@Override
@HotSpotIntrinsicCandidate
public StringBuilder append(String str) {
  super.append(str);
  return this;
}
```

**StringBuffer의 append 메서드**

```java
@Override
@HotSpotIntrinsicCandidate
public synchronized StringBuffer append(String str) {
  toStringCache = null;
  super.append(str);
  return this;
}
```



# 4 결론

* 많은 문자열을 연결할 때는 문자열 연결 연산자 `+`를 피하고 StringBuilder를 사용하자
* 추가적으로 thread-safe를 원한다면 StringBuffer를 사용하자