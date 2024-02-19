# 1 IO

- 프로그램은 데이터를 외부에서 읽고 다시 외부로 출력하는 작업이 빈번히 일어난다.
- 자바에서는 데이터는 스트림을 통해 입출력되므로 스트림의 특징을 잘 이해해야 한다.
	- 스트림은 단일 방향으로 연속적으로 흘러가는 것을  의미한다.
	- 스트림의 특성이 단방향이므로 하나의 스트림으로 입력과 출력을 모두 할 수 없다.
	- 따라서 네트워크상의 다른 프로그램과 데이터를 교환하기 위해서는 양쪽 모두 입력 스트림과 출력 스트림이 따로 필요하다.
- 자바에서 기본적인 데이터 입출력은 `java.io` 패키지에서 제공한다.

<br>

# 2 스트림

- 스트림 클래스는 크게 두 종류로 구분된다.
	- 하나는 바이트 기반 스트림이고 다른 하나는 문자 기반 스트림이다.
- 바이트 기반 스트림은 그림, 멀티미디어, 문자등 모든 종류의 데이터를 받고 보낼 수 있다.
- 문자 기반 스트림은 오로지 문자만 받고 보낼 수 있도록 특화되어 있다.

<br>

## 2.1 입력 스트림

- 프로그램이 데이터를 입력받을 때에는 입력 스트림이라 부른다.
- 입력 스트림의 출발지는 키보드, 파일, 네트워크상의 프로그램이 될 수 있다.
- `InputStream`은 바이트 기반의 입력 스트림 최상위 클래스이다.
- `Reader`는 문자 기반 입력 스트림의 최상위 클래스이다.

<br>

### 2.1.1 InputStream

- [레퍼런스](https://docs.oracle.com/javase/8/docs/api/java/io/InputStream.html)
- `InputStream`은 바이트 기반 입력 스트림위 최상위 클래스로 추상 클래스이다.
- 모든 바이트 기반 입력 스트림은 이 클래스를 상속받아 만들어진다.
- `BufferedInputStream`, `DataInputStream`, `FileInputStream` 클래스 모두 InputStream 클래스를 상속하고 있다.

<br>

**주요 메서드**

```java
public abstract int read() throws IOException
```

- `read()` 메서드는 입력 스트림으로부터 1바이트를 읽고 4 바이트 int 타입으로 리턴한다.
- 따라서 리턴된 4바이트 중 끝의 1바이트만 데이터가 들어가 있다.
- 입력 스트림 끝에 도달해 더 이상 바이트를 읽을 수 없다면 `-1`이 반환된다.
- 이 메서드를 호출하면 데이터가 들어올 때 까지 블록된다.



```java
public int read(byte[] b) throws IOException
```

- 위 메서드는 입력 스트림으로부터 매개값으로 주어진 바이트 배열 길이만큼 바이트를 읽고 해당 배열에 저장한다. 그리고 읽는 바이트 수를 리턴한다.
- 입력 스트림 끝에 도달해 더 이상 바이트를 읽을 수 없다면 `-1`이 반환된다.
- 이 메서드는 인풋 데이터가 준비될 때 까지 블록된다.
- 많은 양의 바이트를 읽는 경우 `read()` 보다 `read(byte[] b)` 를 사용하는 것이 좋다.

<br>

### 2.1.2 Reader

- 문자 기반 입력 스트림의 최상위 클래스다.

<br>

**주요 메서드**

```java
public int read() throws IOException
```

- 입력 스트림으로부터 한 개의 문자를 읽고 반환한다.
- 입력 스트림으로부터 문자를 읽을 때까지 블록된다.
- 입력 스트림의 끝에 도달하면 -1이 반환된다.

```java
public int read(char[] cbuf) throws IOException
```

- 입력 스트림으로부터 읽은 문자들을 매개값으로 주어진 문자 배열에 저장하고 실제 읽은 문자 수를 반환한다.
- 입력 스트림으로부터 문자를 읽을 때까지 블록된다.
- 입력 스트림의 끝에 도달하면 -1이 반환된다.

<br>

## 2.2 출력 스트림

- 프로그램이 데이터를 보낼 때에는 출력 스트림이라고 부른다.
- 출력 스트림의 도착지는 모니터, 파일, 네트워크상의 프로그램이 될 수 있다.
- `OutStream`은 바이트 기반의 출력 스트림 최상위 클래스이다.
- `Writer`는 문자 기반 출력 스트림의 최상위 클래스이다.

<br>

### 2.2.1 OutputStream

- [레퍼런스](https://docs.oracle.com/javase/8/docs/api/java/io/OutputStream.html)
- OutputStream은 바이트 기반 출력 스트림의 최상위 클래스다.
- 모든 바이트 기반 출력 스트림은 이 클래스를 상속받아 만들어진다.

<br>

**주요 메서드**

```java
public abstract void write(int b) throws IOException
```

- 매개 변수로 주어진 int 값에서 끝에 있는 1 바이트만 출력 스트림으로 보낸다.


```java
public void write(byte b[]) throws IOException
```

- 매개값으로 주어진 바이트 배열의 모든 바이트를 출력 스트림으로 보낸다.


```java
public void flush() throws IOException
```

- 출력 스트림은 내부에 작은 버퍼가 있어 데이터가 출력되기 전에 버퍼에 쌓여있다가 순서대로 출력된다.
- flush 메서드는 버퍼에 있는 데이터를 모두 출력시키고 버퍼를 비우는 역할을 한다.


```java
public void close() throws IOException
```

- OutputStream을 더 이상 사용하지 않을 경우 close 메서드를 호출해서 OutputStream에서 사용했던 시스템 자원을 반납한다.
<br>

### 2.2.2 Writer

- 문자 기반 출력 스트림의 최상위 클래스다.

<br>

# 3 File

## 3.1 File

- [레퍼런스](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/io/File.html)
- File 클래스가 제공하는 기능
	- 파일 크기, 파일 속성, 파일 이름 등의 정보 얻기
	- 파일 생성 및 삭제
	- 디렉토리 생성 및 삭제
	- 디렉토리에 존재하는 파일 목록 얻기
	- 그러나 파일의 데이터를 읽고 쓰는 기능은 지원하지 않는다.

<br>

**메서드**

- [레퍼런스](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/io/File.html#method-summary)


```java
public boolean createNewFile() throws IOException
```

- 원자적으로 새로운 빈 파일을 생성한다.
- 원자적이란 파일의 존재 여부 확인과 파일 생성이 한 번에 이루어지는 것을 의미한다.
- 해당 연산이 수행되고 있을 때 다른 파일 시스템이 작업에 끼어들 수 없다.

<br>

## 3.2 FileInputStream

- [레퍼런스](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/io/FileInputStream.html)
- FileInputStream 클래스는 파일로부터 바이트 단위로 읽어들일 때 사용하는 바이트 기반 입력 스트립이다.
- 바이트 기반이기 때문에 그림, 오디오, 비디오, 텍스트 등 모든 종류의 파일을 읽을 수 있다.
- FileInputStream은 InputStream의 하위 클래스이기 때문에 사용 방법이 InputStream과 동일 하다.

<br>

**FileInputStream 생성자**


```java
public FileInputStream(File file) throws FileNotFoundException
```

- 앞서 배운 File 타입을 받는 생성자.


```java
public FileInputStream(String name) throws FileNotFoundException
```

- 파일의 경로를 나타내는 문자열을 받는 생성자.

<br>

## 3.3 FileOutputStream

- [레퍼런스](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/io/FileOutputStream.html)

**생성자**

- `FileOutputStream(File file)` : 파일 객체로 FileOutputStream 생성하기 
- `FileOutputStream(File file, boolean append)`
	- 파일 객체로 FileOutputStream 생성하기 
	- 파일을 덮어쓰지 않고 기존 파일 내용 끝에 데이터를 추가할 경우 append를 `true로` 설정하자.

<br>

# 4 보조 스트림

- 

# 5 TCP 네트워킹

- TCP는 연결 지향적 프로토콜이다.
- 따라서 클라이언트가 연결 요청을 하고, 서버가 연결을 수락하면 통신 선로가 고정되고, 모든 데이터는 고정된 통신 선로를 통해서 순차적으로 전달된다.
- 자바에서는 `java.net.ServerSocket` 과 `java.net.Socket` 클래스를 통해 TCP 네트워킹을 지원한다.

<br>

## 5.1 ServerSocket

- 클라이언트의 연결 요청을 기다리면서 연결 수락을 담당하는 클래스다.

<br>

### 5.1.1 생성

```java
ServerSocket serverSocket = new ServerSocket(8080);
```

- `public ServerSocket(int port)` 생성자를 통해 포트를 지정하면 해당 포트에 바인딩하는 ServerSocket 객체를 생성할 수 있다.

```java
ServerSocket serverSocket = new ServerSocket();  
serverSocket.bind(new InetSocketAddress("localhost", 8080));
```

- `public ServerSocket()` 생성자로 ServerSocket 객체를 생성한 다음 bind 메서드로 IP 주소와 포트를 지정할 수 있다.

<br>

### 5.3.2 accept 메서드

- 포트 바인딩이 끝나면 ServerSocket은 연결 수락을 위해 accept 메서드를 실행해야 한다.
- accept 메서드는 클라이언트가 연결 요청하기 전까지 블록킹된다.
- 클라이언트가 연결 요청하면 accept 메서드는 클라이언트와 통신할 Socket을 만들고 리턴한다.

<br>

## 5.2 Socket

- ServerSocket이 연결 수락을 담당하는 클래스라면 Socket은 연결된 클라이언트와 통신을 담당한다.
- 또한 클라이언트가 서버에 연결을 요청할 때 Socket을 사용한다.

<br>

### 5.2.1 생성자

```java
public Socket()
```

- Socket을 생성한다.
- 이 후 connect() 메서드를 호출 해 서버에 연결을 요청한다.

```java
public Socket(String host, int port) 
	throws UnknownHostException,IOException
```

- Socket을 생성하면서 동시에 연결을 요청하는 생성자
- 서버의 IP 주소와 바인딩 포트 번호를 매개값으로 준다.

<br>

## 5.2.2 데이터 통신

- 클라이언트가 연결을 요청(connect() 메서드 호출)하고 서버가 연결을 수락(accept() 메서드  호출)하면 양쪽의 Socket 객체로부터 각각 InputStream과 OutputStream을 얻을 수 있다.
