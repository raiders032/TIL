# 1 Netty’s core components

## 1.1 채널(Channels)

- 채널은 Java NIO의 핵심 요소로, 다양한 엔터티에 대한 연결을 나타냅니다. 이러한 엔터티에는 하드웨어 장치, 파일, 네트워크 소켓 등이 포함됩니다.
- 채널은 데이터의 입출력 경로로 활용되며, 열린 상태 또는 닫힌 상태, 연결된 상태 또는 비연결 상태일 수 있습니다.

<br>

## 1.2 콜백(Callbacks)

- 콜백은 메소드 참조로서, 다른 메소드에 의해 호출됩니다.
- 적절한 시기에 작업의 완료를 알리거나 후속 조치를 취하는 데 사용됩니다.
- Netty에서는 이벤트를 처리할 때 내부적으로 콜백을 사용합니다. 
	- 예를 들어, 새로운 연결이 설정되면 `ChannelHandler` 콜백인 `channelActive()`가 호출되어 메시지를 출력합니다.

<br>

## 1.3 퓨처(Futures)

- 퓨처는 비동기 작업의 결과를 위한 자리 표시자로, 작업이 완료될 때까지 대기합니다.
- 네티는 JDK의 `Future` 인터페이스를 확장한 `ChannelFuture`를 제공합니다.
- `ChannelFuture`는 작업 완료 시 자동으로 알림을 제공하는 `ChannelFutureListener`를 등록할 수 있습니다.

<br>

## 1.4 이벤트 및 핸들러(Events and Handlers)

- Netty는 상태 변화나 작업 상태에 대한 변경을 알리는 데 사용되는 명확한 이벤트를 사용합니다. 
- 이를 통해 발생한 이벤트에 기반하여 적절한 작업을 트리거할 수 있습니다. 
- 이러한 작업에는 로깅, 데이터 변환, 흐름 제어, 애플리케이션 로직 등이 포함될 수 있습니다. 
- 각 이벤트는 핸들러 클래스의 사용자 구현 메소드로 디스패치될 수 있습니다.

<br>

## 1.5 Channel

- 네티의 `Channel` 인터페이스는 소켓을 직접 다루는 복잡성을 크게 줄이는 API를 제공합니다.
- `Channel`은 여러 특수화된 구현체를 가진 광범위한 클래스 계층의 루트입니다.

<br>

## 1.6 EventLoop

- `EventLoop`는 연결 상태 동안 발생하는 이벤트를 처리하는 네티의 핵심 추상화입니다.
- `EventLoop`는 생애 주기 동안 단일 스레드에 바인딩됩니다.
- `EventLoop`의 위해 처리되는 모든 I/O 이벤트는 전용 스레드에서 처리됩니다.
- 채널은 생애 주기 동안 단일 `EventLoop`에 등록됩니다.
- 하나의 `EventLoop`는 하나 이상의 채널에 할당될 수 있습니다.

<br>

### 1.6.1 EventLoopGroup

- An EventLoopGroup contains one or more EventLoops.

<br>

## 1.7 ChannelFuture

-  JDK는 `java.util.concurrent.Future` 인터페이스를 제공하지만, Netty는 자체적인 구현인 `ChannelFuture`를 제공합니다.
- 네티의 모든 I/O 작업은 비동기적입니다.
- `ChannelFuture`는 나중에 작업 결과를 결정하는 데 사용됩니다.
- `ChannelFuture`의 `addListener()` 메소드는 작업이 완료될 때 알림을 받기 위해 `ChannelFutureListener`를 등록합니다.
- `ChannelFuture`는 하나 이상의 `ChannelFutureListener` 인스턴스를 등록할 수 있는 추가 메서드를 제공하여, 작업 완료 시 수동으로 확인할 필요 없이 알림 메커니즘을 제공합니다.
	- 이 리스너의 콜백 메서드인 `operationComplete()`는 작업이 완료되었을 때 호출됩니다. 
	- 리스너는 그 후 작업이 성공적으로 완료되었는지, 아니면 오류와 함께 완료되었는지 판단할 수 있습니다. 
	- 오류가 발생한 경우, 발생한 `Throwable`을 얻어 처리할 수 있습니다. 
	- 간단히 말해, `ChannelFutureListener`가 제공하는 알림 메커니즘은 작업 완료를 수동으로 확인할 필요성을 없애줍니다.

**예시**

```java
Channel channel = ...; // 채널 초기화
// 비동기 연결 실행
ChannelFuture future = channel.connect(new InetSocketAddress("192.168.0.1", 25));

// 연결 완료시 실행될 리스너 추가
future.addListener(new ChannelFutureListener() {
    @Override
    public void operationComplete(ChannelFuture future) {
        if (future.isSuccess()) {
            // 연결 성공 시, 메시지 전송
            ByteBuf buffer = Unpooled.copiedBuffer("Hello", Charset.defaultCharset());
            ChannelFuture wf = future.channel().writeAndFlush(buffer);
            // 추가적인 작업...
        } else {
            // 연결 실패 시, 오류 출력
            Throwable cause = future.cause();
            cause.printStackTrace();
        }
    }
});

```



<br>

## 1.8 ChannelHandler

- 네티(Netty)에서, 애플리케이션 개발자의 관점에서 가장 중요한 구성 요소는 `ChannelHandler`입니다. 
- 들어오거나(inbound)  나가는(outbound) 데이터를 처리하는 **애플리케이션 로직** 전체를 담는 컨테이너 역할을 합니다.
- `ChannelHandler`의 메소드는 네트워크 이벤트에 의해 트리거됩니다.
- 실제로, `ChannelHandler`는 데이터 형식 변환, 처리 중 발생하는 예외 처리 등 거의 모든 종류의 작업에 사용될 수 있습니다.
- 특히, `ChannelInboundHandler`는 자주 구현되는 하위 인터페이스로, 들어오는 이벤트와 데이터를 처리합니다. 
	- 이 데이터는 애플리케이션의 비즈니스 로직에 의해 처리되며, 연결된 클라이언트에 응답을 보낼 때 `ChannelInboundHandler`에서 데이터를 flush(내보내기)할 수도 있습니다.

<br>

## 1.9 ChannelPipeline

![[Pasted image 20231012205918.png]]

- `ChannelPipeline`은 `ChannelHandlers`의 체인을 관리하고, 이 체인을 통해 인바운드 및 아웃바운드 이벤트의 흐름을 전파합니다.
- 채널이 생성될 때 각 채널에 고유한 `ChannelPipeline`이 자동으로 할당됩니다.
