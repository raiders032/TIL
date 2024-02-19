# 1 NIO

- 자바 4에서 new Input/Ouput이라는 뜻으로 java.nio 패키지가 추가되었다.
- 자바 7에서 IO와 NIO 사이의 일관성 없는 클래스 설계를 바로 잡고 비동기 채널 등의 네트워크 지원을 대폭 강화한 NIO2 API가 추가 되었다.
- NIO2는 기존 java.nio의 하위 패키지로 제공된다.

<br>

## 1.1 IO와 차이점

**스트림과 채널**

- IO는 스트림 기반이다. 따라서 데이터를 읽기 위해서는 입력 스트림을 생성해야 하고 데이터를 출력하기 위해서는 출력 스트림을 생성해야 한다.
- 하지만 NIO는 채널 기반이다. 채널은 스트림과 달리 양방향으로 입출력이 가능하다.
- 따라서 하나의 파일에서 데이터를 읽고 쓰는 작업을 모두 해야 한다면 FileChannel 하나만 생성하면 된다.

<br>

**버퍼**

- IO에서는 출력 스트림이 1바이트를 쓰면 입력 스트림이 1바이트를 읽는다.
	- IO는 스트림에서 읽은 데이터를 즉시 처리하기 때문에 입력된 전체 데이터를 별도로 저장하지 않으면 입력된 데이터 위치를 이동해 가면서 자유롭게 이용할 수 없다.
	- IO에서는 추가적으로 보조 스트림인 `BufferedInputStream`, `BufferedOutputStream`을 연결해 버퍼를 사용해 복수 개의 바이트를 한꺼번에 입력받고 출력할 수 있다.
- IO와 다르게 NIO는 기본적으로 버퍼를 사용한다.
	- Channel에서 데이터를 읽으면 Buffer에 담긴다. 
	- Channel에 데이터를 쓰려면 먼저 Buffer에 데이터를 담고 Buffer에 담긴 데이터를 Channel에 쓴다.

<br>

**논블로킹**

- IO는 블록킹된다. 입력 스트림의 read() 메서드를 호출하면 데이터가 입력되기 전까지 스레드는 블로킹된다.
- IO스레드가 블로킹되면 다른 일을 할 수 없고 블로킹을 빠져나가기 위해 인터럽트도 할 수 없다.
	- 블로킹을 빠져나가는 유일한 방법은 스트림을 닫는 것이다.
- 반면에 NIO는 블로킹과 논블로킹을 모두 지원한다. NIO의 블로킹이 IO의 블로킹과 다른점은 스레드를 인터럽트해서 빠져나갈수 있다.
- NIO의 논블로킹은 입출력 작업 준비가 완되된 채널만 선택해서 작업 스레드가 처리하기 때문에 작업 스레드가 블로킹 되지 않는다.
- NIO 논블로킹의 핵심 객체는 멀티플렉서인 셀럭터다. 
	- 셀렉터는 복수 개의 채널 중에서 준비 완료된 채널을 선택하는 방법을 제공한다.

<br>

# 2 버퍼

- NIO에서는 데이터를 입출력하기 위해 **항상 버퍼를 사용**해야 한다.
- 버퍼는 읽고 쓰기가 가능한 메모리 배열이다.
- 버퍼가 사용하는 메모리의 위치에 따라 non-direct 버퍼와 direct 버퍼로 분류된다.
	- non-direct 버퍼: JVM이 관리하는 힙 메모리 공간을 이용하는 버퍼
	- direct 버퍼: 운영체제가 관리하는 메모리 공간을 이용하는 버퍼

<br>

## 2.1 종류

### 2.1.1 non-direct buffer

- JVM힙 메모리를 사용하므로 버퍼 생성 시간이 빠르다.
- JVM의 제한된 힙 메모리를 사용하므로 버퍼의 크기가 제한된다.
- non-direct buffer는 입출력을 하기 위해 임시 다이렉트 버퍼를 생성하고 non-direct buffer의 내용을 임시 다이렉트 버퍼에 복사한다.
	- 그리고 임시 다이렉트 버퍼를 사용해서 운영체제의 native I/O 기능을 수행한다.
	- 따라서 직접 다이렉트 버퍼를 사용하는 것보다는 입출력 성능이 낮다.

<br>

### 2.1.2 direct buffer

- 운영체제의 메모리를 할당받기 위해 운영체제의 네이티브 C 함수를 호출하고 여러가지 처리를 해야하므로 상대적으로 버퍼 생성이 느리다.
	- 따라서 자주 생성하지 않고 생성한 버퍼를 재사용하는 것이 적합하다.
- 운영체제가 관리하는 메모리를 사용하므로 운영체제가 허용하는 범위 내에서 대용량 버퍼를 사용할 수 있다.

<br>

## 2.2 버퍼 생성

- 데이터 타입별로 넌다이렉트 버퍼를 생성하기 위해서는 각 Buffer 클래스의 `allocate()`와 `wrap()` 메서드를 호출하면 된다.
- 다이렉트 버퍼는 `allocateDirect()` 메서드를 호출하면 된다.

<br>

**allocate() 메서드**

```java
ByteBuffer byteBuffer = ByteBuffer.allocate(100);  
CharBuffer charBuffer = CharBuffer.allocate(100);
```

- 최대 100개의 바이트를 저장하는 ByteBuffer를 생성하고 최대 100개의 문자를 저장하는 CharBuffer를 생성하는 코드

<br>

**wrap() 메서드**

```java
byte[] bytes = new byte[100];  
ByteBuffer byteBuffer = ByteBuffer.wrap(bytes);
```

- 각 타일별 Buffer는 모두 wrap() 메서드를 가지고 있다.
- wrap()는 이미 생성되어 있는 자바 배열을 래핑해서 Buffer 객체를 생성한다.

<br>

**allocateDirect()**

```java
ByteBuffer byteBuffer = ByteBuffer.allocateDirect(100);  
CharBuffer charBuffer = byteBuffer.asCharBuffer();
```

- allocateDirect() 메서드는 JVM 힙 메모리 바깥쪽 즉 운영체제가 관리하는 메모리에 다이렉트 버퍼를 생성한다.
- 이 메서드는 각 타입별 Buffer 클래스에는 없고 ByteBuffer만 제공한다.
	- 따라서 각 타입별로 다이렉트 버퍼를 생성하고 싶다면 asXX() 메서드를 호출해 얻을 수 있다.

<br>

## 2.3 Buffer의 위치 속성

- 버퍼를 사용하기 위해선 먼저 버퍼의 위치 속성을 잘 알아야 한다.
- 버퍼는 네 가지의 위치 속성을 가진다.
	- position
		- 현재 읽거나 쓰는 위치 값이다.
		- 인덱스 값이기 때문에 0부터 시작한다.
		- limit보다 큰 값을 가지 수 없다.
		- 만약 limit 값과 같다면 더 이상 데이터를 쓰거나 읽을 수 없다는 뜻이다.
	- limit
		- 버퍼에서 읽거나 쓸 수 있는 위치의 한계를 나타낸다.
		- 이 값은 capacity보다 같거나 작은 값을 가진다.
		- 최초에 버퍼를 만들면 capacity와 같은 값을 가진다.
	- capacity
		- 버퍼의 최대 데이터 개수
		- 메모리의 크기를 나타낸다.
	- mark
		- reset() 메서드를 호출했을 때 돌아갈 위치를 기록하는 속성이다.

<br>

## 2.4 Buffer 메서드

- [레퍼런스](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/nio/Buffer.html)


### 2.4.1 clear()

```java
public Buffer clear() {  
    position = 0;  
    limit = capacity;  
    mark = -1;  
    return this;
}
```

- 버퍼의 위치 속성을 초기화 한다.

<br>

### 2.4.2 flip()

```java
public Buffer flip() {  
    limit = position;  
    position = 0;  
    mark = -1;  
    return this;
}
```

- 데이터를 읽기 위해 위치 속성값을 변경한다.

<br>


### 2.4.3 mark()
```java
public Buffer mark() {  
    mark = position;  
    return this;
}
```

- 현재 위치를 마킹한다.

<br>

### 2.4.3 reset()

```java
public Buffer reset() {  
    int m = mark;  
    if (m < 0)  
        throw new InvalidMarkException();  
    position = m;  
    return this;
}
```

- 현재 위치(position)을 마킹한 위치로 변경한다.

<br>

# 3 Channel

- 채널은 NIO에서 데이터를 읽고 쓰는 연결을 나타낸다.
- 각 채널은 특정 I/O 서비스(예: 파일 I/O, 소켓 I/O)에 바인딩된다.
- 채널은 항상 버퍼와 함께 사용되며, 데이터는 버퍼를 통해 채널로 흐르거나 채널에서 버퍼로 흐른다.
- 채널은 블로킹과 논블로킹 모드를 모두 지원할 수 있다.

<br>

## 3.1 FileChannel

- [레퍼런스](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/nio/channels/FileChannel.html)
- `java.nio.channels.FileChannel`을 이용하면 파일 읽기와 쓰기를 할 수 있다.
- FileChannel은 동기화 처리가 되어 있어 쓰레드 세이프하다.

<br>

### 3.1.1 FileChannel 생성과 닫기

```java
public static FileChannel open(Path path, OpenOption... options) 
```

- 정적 메서드인 open 메서드로 FileChannel을 생성할 수 있다.
- 첫 번째 path는 열거나 생성하고자 하는 파일의 경로를 Path 객체로 생성해 지정한다.
- 두 번째 옵션은 [StandardOpenOption의](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/nio/file/StandardOpenOption.html) 열거 상수를 나열하면 된다.


```java
FileChannel open = FileChannel.open(  
        Paths.get("/test.txt"),  
        StandardOpenOption.CREATE_NEW,  
        StandardOpenOption.WRITE  
);
```

- `/test.txt`  파일을 생성하고 쓰려면 위와 같이 채널을 생성한다.

<br>

### 3.1.2 파일 읽기와 쓰기

- FileChannel의 read와 write 메서드는 블로킹된다.
- NIO에서는 비동기 파일 입출력 작업을 위해  AsynchronousFileChannel 클래스를 별도로 제공한다.

```java
public abstract int write(ByteBuffer src)
```

- 파일에 바이트를 쓰려면 FileChannel의 write() 메서드를 호출하면 된다.
- 매개값으로 ByteBuffer 객체를 주면 된다.
- ByteBuffer의 position부터 limit까지 파일에 쓰여진다.
- ByteBuffer에서 파일로 쓰여진 바이트 수가 반환된다.


```java
public abstract int read(ByteBuffer dst)
```

- 파일로부터 바이트를 읽기 위해 read() 메서드를 사용한다.
- 매개값으로 ByteBuffer 객체를 주면 파일에서 읽혀지는 바이트를 ByteBuffer의 position 부터 ByteBuffer에 저장한다.
- 반환값은 파일에서 ByteBuffer로 읽혀진 바이트 수다.
- 더 이상 읽을 바이트가 없다면 `-1`을 반환한다.

<br>

**파일 복사 예시**

```java
Path from = Paths.get("/Users/YT/Documents/test.txt");  
Path to = Paths.get("/Users/YT/Documents/test2.txt");  
  
FileChannel fileChannelFrom = FileChannel.open(from, StandardOpenOption.READ);  
FileChannel fileChannelTo = FileChannel.open(to, StandardOpenOption.CREATE, StandardOpenOption.WRITE);  
  
ByteBuffer byteBuffer = ByteBuffer.allocateDirect(100);  
int byteCount = 0;  
while (true) {  
    byteBuffer.clear();  
    byteCount = fileChannelFrom.read(byteBuffer);  
    if (byteCount == -1) break;  
    byteBuffer.flip();  
    fileChannelTo.write(byteBuffer);  
}  
  
fileChannelFrom.close();  
fileChannelTo.close();
```

- `/Users/YT/Documents/test.txt`파일을 `/Users/YT/Documents/test2.txt`로 복사하는 예시

<br>

# 4 Selctor

- Selctor는 하나의 스레드가 여러 채널의 이벤트를 모니터링할 수 있게 해주는 구성 요소이다.
- 선택자는 여러 채널을 등록하고, 이 채널들 중에서 I/O 작업이 가능한 채널을 결정한다.
	- 이를 통해 하나의 스레드가 여러 네트워크 연결을 효율적으로 관리할 수 있다.
- 선택자는 논블로킹 I/O 작업에 사용되며, 블로킹 방식의 문제를 해결해주는 중요한 기능이다.
- `Selector.open()` 메소드로 선택자를 생성하고, 채널에 `configureBlocking(false)`를 호출하여 논블로킹 모드로 설정한 후 선택자에 채널을 등록한다.

<br>

## 4.1 Selctor 생성

- Selector는 `Selector.open()` 정적 메소드를 호출하여 생성할 수 있다. 이 메소드는 새로운 Selector 객체를 반환한다.
- 생성된 Selector는 여러 채널을 관리하며, 이 채널들은 Selector에 등록되어야 한다.
	- `java.nio.channels.SelectableChannel` 하위 채널만 등록할 수 있다.
		- ServerSocketChannel, SocketChannel 등
	- 논블로킹으로 설정된 채널만 등록할 수 있다.
- Selector는 특정 이벤트(예: 연결 요청, 데이터 도착)가 발생할 때까지 블로킹하거나, 블로킹하지 않고 주기적으로 채널의 상태를 확인할 수 있다.

<br>

## 4.2 Channel 등록

- Selector에 채널을 등록하기 위해서는 채널을 논블로킹 모드로 설정해야 한다. 
	- 이는 `configureBlocking(false)` 메소드를 호출하여 수행할 수 있다.
- 채널을 Selector에 등록하기 위해서는 채널의 `register()` 메소드를 사용한다. 
	- 이 메소드는 `SelectionKey` 객체를 반환한다. 
	- 이 키는 Selector와 채널 간의 관계를 나타낸다.
- `register()` 메소드는 관심 있는 I/O 이벤트 유형을 인자로 받는다. 
	- 예를 들어, 읽기, 쓰기, 연결 가능, 수락 가능 등의 이벤트가 있다.

<br>

**예시**

```java
ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
serverSocketChannel.configureBlocking(false);
SelectionKey key = serverSocketChannel.register(selector, SelectionKey.OP_ACCEPT);

```

- 위 코드에서 `ServerSocketChannel`은 논블로킹 모드로 설정되고, Selector에 등록된다. 
- 등록 시, 관심 있는 이벤트 유형으로 `OP_ACCEPT`를 지정하여, 연결 수락을 감지할 수 있다.
- 클라이언트 연결이 들어오면, Selector는 해당 이벤트를 감지하고, 애플리케이션은 이 정보를 사용하여 해당 이벤트를 처리할 수 있다.

<br>

# 4.3 준비된 채널 선택

- Selector는 등록된 채널들 중에서 I/O 작업이 가능한 채널을 선택하는 역할을 한다.
- `select()` 메소드를 호출하여 준비된 채널들을 선택할 수 있다.
	-  이 메소드는 하나 이상의 채널이 작업 준비가 되었을 때까지 블로킹된다.
	- 최소 하나의 SelectionKey로부터 작업 처리가 준비되었다는 통보가 올 때까지 블로킹된다.
- `select(long timeout)`은 지정된 시간 동안 블로킹되며, `selectNow()`는 즉시 반환된다.
- select, selectNow 메서드의 반환 값은 준비된 SelectionKey의 수이다.

<br>

**예시**

```java
while (true) {  
    int readyChannels = selector.select();  
    if (readyChannels == 0) continue;  
  
    Set<SelectionKey> selectedKeys = selector.selectedKeys();  
    Iterator<SelectionKey> keyIterator = selectedKeys.iterator();  
    while (keyIterator.hasNext()) {  
        SelectionKey key = keyIterator.next();  
        if (key.isAcceptable()) {  
            // 연결 수락 처리...  
        } else if (key.isReadable()) {  
            // 읽기 처리...  
        } else if (key.isWritable()) {  
            // 쓰기 처리...  
        }  
        keyIterator.remove();  
    }
}
```

- `select()` 메소드가 반환되면, 준비된 채널들의 집합을 처리할 수 있다.
- `selectedKeys()` 메소드를 사용하여 선택된 채널들의 `SelectionKey` 집합을 얻을 수 있습니다.
- 각 `SelectionKey`는 특정 채널의 준비된 이벤트를 나타낸다.
	- `isAcceptable()`, `isConnectable()`, `isReadable()`, `isWritable()` 등의 메소드를 사용하여 해당 이벤트에 따라 적절한 처리를 할 수 있다.

<br>

# 5 TCP 블로킹 채널

- NIO를 이용해 TCP 서버/클라이언트를 개발할 때 블로킹, 넌블로킹, 비동기 구현 방식 중 하나를 선택한다.
- NIO에서 TCP 네트워크 통신을 위해 사용되는 채널은`java.nio.channels.ServerSocketChannel`과 `java.nio.channels.SocketChannel`이다. 
	- 이 두 채널은 IO의 ServerSocket과 Socket에 대응된다.
	- [[IO]] 참고
	- ServerSocket과 Socket은 버퍼를 사용하지 않고 블로킹 방식만 지원한다.
	- ServerSocketChannel과 SocketChannel은 버퍼를 이용하고 블로킹과 논블로킹 방식 모두 지원한다.

<br>

## 5.1 ServerSocketChannel

- [레퍼런스](<https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/nio/channels/ServerSocketChannel.html>)
- ServerSocketChannel을 사용해서 서버 소켓을 생성하고 연결을 수락해보자.


**예시**
```java
ServerSocketChannel serverSocketChannel = null;  
try {  
    // ServerSocketChannel 객체 얻기  
    serverSocketChannel = ServerSocketChannel.open();  
  
    // ServerSocketChannel은 기본적으로 블로킹 방식으로 동작하지만 명시적으로 표시했다.   
serverSocketChannel.configureBlocking(true);  
  
    // 포트 바인딩  
    serverSocketChannel.bind(new InetSocketAddress(8080));  
  
    while (true) {  
        // 클라이언트 연결 수락 연결 요청이 들어오기까지 블로킹된다. 반환값은 클라이언트와 통실할 SocketChannel 객체  
        SocketChannel socketChannel = serverSocketChannel.accept();  
  
        // 연결된 클라이언트의 IP와 포트를 알고 싶으면 아래와 같이 InetSocketAddress 객체를 얻을 수 있다.  
        InetSocketAddress socketAddress = (InetSocketAddress) socketChannel.getRemoteAddress();  
  
        log.info("연결 된 호스트: {}", socketAddress.getHostName());  
    }  
} catch (Exception e){}  
  
if (serverSocketChannel.isOpen()){  
    try {  
        // 더 이상 연결 수락이 필요 없다면 포트를 언바인딩 한다.  
        serverSocketChannel.close();  
    } catch (Exception e) {}  
}
```

<br>

## 5.2 SocketChannel

- 클라이언트가 서버에 요청할 때 SocketChannel을 이용한다.

<br>

**예시**

```java
SocketChannel socketChannel = null;  
  
try {  
    // SocketChannel은 기본적으로 블로킹 방식으로 동작하지만 명시적으로 표시했다.  
    socketChannel.configureBlocking(true);  
  
    // 서버 연결 요청 서버와 연결이 완료될 때까지 블로킹 된다.  
    socketChannel.connect(new InetSocketAddress("localhost", 8080));  
}catch (Exception e) {}  
  
if (socketChannel.isOpen()){  
    try {  
        socketChannel.close();  
    } catch (Exception e) {}  
}
```

<br>

# 6 TCP 논블로킹

- 논블로킹 방식은 connect(), accept(), read(), write() 메서드가 블로킹되지 않는다.

<br>

## 6.1 ServerSocketChannel

- [레퍼런스](<https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/nio/channels/ServerSocketChannel.html>)

<br>

**주요 메서드**

```java
public abstract SocketChannel accept() throws IOException
```

- 클라이언트의 연결 요청이 없으면 즉시 null을 반환한다.
- 연결 요청이 있다면 새로운 연결이 가능해지거나 I/O error가 발생하기 전까지만 블록된다.

<br>

**예시**

```java
while(true){
	SocketChannel socketChannel = serverSocketChannel.accept();
}
```

- accept 메서드는 클라이언트 요청이 없다면 블로킹되지 않고 바로 리턴되기 때문에 while 루프를 쉴새 없이 실행되어 CPU를 과도하게 사용하는 문제가 있다.
- 이런 경우 이벤트 리스너 역할을 하는 셀렉터를 사용한다.
- 논블로킹 채널을 셀렉터에 등록하면 클라이언트의 연결 요청이 들어오거나 데이터가 도착하는 경우 채널은 셀렉터에 통보한다.
- 셀렉터는 통보한 채널들을 선택해서 작업 스레드가 accept 또는 read 메서드를 실행해서 즉시 작업을 처리하도록 한다.


## 6.2 SocketChannel

- [레퍼런스](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/nio/channels/SocketChannel.html)

<br>

**주요 메서드**

```java
public abstract boolean connect(SocketAddress remote)
                         throws IOException
```

- 