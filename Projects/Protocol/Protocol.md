# 1 Protocol

- 채팅 서비스의 경우 어떤 통신 프로토콜을 사용할 것인가는 중요한 문제다.

<br>

# 2 HTTP

- HTTP는 클라이언트가 연결을 만드는 프로토콜이다.
	- 따라서 서버에서 임의 시점에 메시지를 보내는데 쉽게 쓰일 수 없다.
- 서버가 연결을 만드는 것처럼 동작할 수 있도록 하기 위해 아래와 같은 기법이 있다.
	- 폴링
	- 롱폴링
	- 웹소켓
- 폴링, 롱폴링

<br>

**폴링**

- 폴링은 클라이언트가 주기적으로 서버에게 새 메시지가 있냐고 물어보는 방법이다.
- 폴링의 비용은 폴링을 자주하면 올라간다.
- 새로운 메시지가 없는 경우에는 서버 자원이 불필요하게 낭비된다.

<br>

**롱 폴링**

- 폴링의 단점을 보완하기 위한 기법이다.
- 롱 폴링의 경우 클라이언트는 새 메시지가 반환되거나 타임아웃이 될 때까지 연결을 유지한다.
- 클라이언트가 새 메시지를 받으면 기존 연결을 종료하고 서버에 새로운 요청을 보내며 이를 계속 반복한다.
- 서버 입장에서 클라이언트가 연결을 해제했는지 알 좋은 방법이 없다.
- 폴링 방식에 비해 요청수가 줄었지만 여전히 비효율적이다.
	- 새로운 메시지가 없는 경우에는 서버 자원이 불필요하게 낭비된다.

<br>

# 3 WebSocket

- WebSocket을 도입하면 연결되어 있는 하나의 커넥션에서 낮은 레이턴시로 쌍방향 커뮤니케이션을 할 수 있습니다.
- 이로써 빠른 속도로 유입되는 코멘트를 실시간으로 유저에게 전달할 수 있을 뿐만 아니라, 유저가 코멘트를 보낼 때마다 HTTP 리퀘스트를 보낼 필요가 없기 때문에 서버 리소스를 효과적으로 사용할 수 있다는 이점을 얻을 수 있습니다.
- 단, 하나의 커넥션에서 메시징을 할 때는 Web API처럼 엔드포인트에 따라 응답 형식을 나눌 수 없기 때문에 서버와 클라이언트 모두 수신한 페이로드를 적절하게 식별하여 핸들링해야 합니다.
- 채팅을 구현할 때는 JSON 형식의 페이로드를 주고받는데, 모든 페이로드에 공통된 필드를 하나 추가한 후 그 값을 통해 페이로드가 무엇을 나타내는지를 식별하여, 이에 대응되는 클래스에 맵핑했습니다.
	- 이 방법을 사용한 덕분에 유료 기프트의 구현 등 새로운 페이로드 정의가 필요한 경우에도 유연하게 대응할 수 있습니다.
- 여기서 주목해야 할 점은 모바일 기기에서 긴 스트리밍을 시청하는 경우 커넥션이 불안정해지는 경우가 자주 있다는 점입니다.
- 이를 막기 위해, 페이로드의 송신 상태를 감시하여 커넥션이 불안정하다고 판단될 경우에는 일단 커넥션을 끊고 재접속을 유도하는 등의 방법으로 대응하고 있습니다.(라인)
- 현재 띠잉 채팅의 클라이언트는 웹뷰이기 때문에 서버와의 통신은 웹소켓을 이용합니다.
	- 향후 앱기반 클라이언트가 붙게 되면 웹소켓 연결부만 소켓방식으로 갈아끼면 됩니다.

<br>

# 4 선택