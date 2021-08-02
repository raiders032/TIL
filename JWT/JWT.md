# JWT

* RFC 7519 웹 표준으로 지정되어 있다.
* JSON을 사용해서 토크 자체에 정보를 저장하고 있는 Web Token 이라고 정의할 수 있다.
* JWT는 Header, Payload, Signature 3가지로 구성되어 있다.
* Header
  * Signature를 해싱하기 위한 알고리즘 정보가 담겨있다.
* Payload
  * 서버와 클라이언트가 주고받는 시스템에서 실제로 사용될 정보를 담고있다
* Signature
  * 토큰의 문자열 검증을 위한 문자열
  * 이 문자열을 통해 서버에서 토큰이 유효한지 검증할 수 있다
* 장점
  * 중앙의 인증서버, 데이터 스토어에 대한 의존성이 없어 시스템 수평 확장에 유리하다
  * Base64 URL Safe Encoding을 통해 URL, Cookie, Header 모두 사용이 가능하다
* 단점
  * Payload의 정보가 많아지면 네트워크 사용량 증가
  * 토큰이 클라이언트에 저장되어서 서버가 토큰을 조작할 수 없다