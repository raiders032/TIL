# 1 WebSocket

- [RFC 6455](https://tools.ietf.org/html/rfc6455),
- WebSocket 프로토콜은 클라이언트와 서버 사이에서 단일 TCP 연결을 통해 전이중, 양방향 통신 채널을 설정하는 표준화된 방법이다.
- 이 프로토콜은 HTTP와는 다른 TCP 프로토콜이지만, HTTP 위에서 동작하도록 설계되었다.
	- 따라서 80과 443 포트를 사용하며 기존의 방화벽 규칙을 재사용할 수 있다.

<br>

**WebSocket 업그레이드를 위한 handshake**


```http
GET /spring-websocket-portfolio/portfolio HTTP/1.1
Host: localhost:8080 
Upgrade: websocket 
Connection: Upgrade 
Sec-WebSocket-Key: Uc9l9TMkWGbHFD2qnFHltg==
Sec-WebSocket-Protocol: v10.stomp, v11.stomp
Sec-WebSocket-Version: 13 
Origin: http://localhost:8080
```

- WebSocket 통신은HTTP Upgrade 헤더를 사용하는 위와 같은 HTTP 요청으로 시작된다.

```http
HTTP/1.1 101 Switching Protocols 
Upgrade: websocket 
Connection: Upgrade 
Sec-WebSocket-Accept: 1qVdfYHU9hPOl4JYYNXF623Gzn0= 
Sec-WebSocket-Protocol: v10.stomp
```

- WebSocket을  지원하는 서버는 200 상태 코드 대신  위와 같은 HTTP 응답을 보낸다.
- handshake가 끝나면 프로토콜를 전환하게 된다.
- 핸드쉐이크 이후 HTTP 업그레이드 요청의 사용된 TCP 소켓 계속해서 열려 있다.
	- 이 소켓을 통해 클라이언트와 서버 모두 메시지를 계속 전송하고 받을 수 있다.
- WebSocket 서버가 웹 서버 (예: nginx) 뒤에서 실행되는 경우, WebSocket 업그레이드 요청을 WebSocket 서버로 전달하도록 설정해야 할 가능성이 있다. 

<br>

## 1.1 HTTP와 비교

- WebSocket은 HTTP와 호환되도록 설계되었으며 HTTP 요청으로 시작되지만, 두 프로토콜이 매우 다르다.

**HTTP**
- HTTP와 REST에서 응용 프로그램은 많은 URL로 모델링된다. 
- 응용 프로그램과 상호 작용하려면 클라이언트는 요청-응답 스타일로 해당 URL에 접근한다.
- 서버는 HTTP 요청의 URL, 메서드 및 헤더를 기반으로 적절한 핸들러로 라우팅한다.

<br>

**WebSocket**
- WebSocket에서는 초기 연결을 위한 URL이 하나 보통 존재한다. 
	- 이후 모든 응용 프로그램 메시지는 동일한 TCP 연결을 통해 전달된다.
	- 이는 완전히 다른 비동기식, 이벤트 기반의 메시징 아키텍처를 나타낸다.
- WebSocket은 HTTP와 달리 메시지의 내용에 대한 의미를 규정하지 않는 저수준의 전송 프로토콜이다.
	- 즉 메시지를 나타내는 규칙이 없다는 의미다.
	- 이는 클라이언트와 서버가 공통된 메시지 규칙이 없다면 메시지를 라우팅하거나 처리할 방법이 없음을 의미한다.
- WebSocket 클라이언트와 서버는 HTTP 핸드쉐이크 요청에서의 `Sec-WebSocket-Protocol` 헤더를 통해 서버와 메시지 프로토콜의 사용을 협상할 수 있다.
	- STOMP가 주로 사용된다.