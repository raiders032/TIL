# 1 CORS

* 교차 출처 리소스 공유(Cross-Origin Resource Sharing, CORS)는 추가 HTTP 헤더를 사용하여, 한 출처에서 실행 중인 웹 애플리케이션이 다른 출처의 선택한 자원에 접근할 수 있는 권한을 부여하도록 브라우저에 알려주는 체제입니다
* 보안상 브라우저는 스크립트에서 시작한 교차 출처 HTTP 요청을 제한합니다
  * XMLHttpRequest와 Fetch API는 동일 출처 정책(same-origin policy)을 따릅니다
  * 이 API를 사용하는 웹 애플리케이션은 자신의 출처와 동일한 리소스만 불러올 수 있다



# 2

> 서버 데이터에 부수 효과(side effect)를 일으킬 수 있는 HTTP 요청 메서드(GET을 제외한 HTTP 메서드)에 대해, CORS 명세는 브라우저가 요청을 OPTIONS 메서드로 "프리플라이트"(preflight, 사전 전달)하여 지원하는 메서드를 요청하고, 서버의 "허가"가 떨어지면 실제 요청을 보내도록 요구하고 있습니다.

# 3 CORS Header



## 3.1 request Header

`Access-Control-Request-Method`

* 같은 리소스에 미래의 CORS 요청이 사용할 method를 의미한다.

`Access-Control-Request-Headers`

* 같은 리소스에 미래의 CORS 요청이 사용할 header들을 의미한다.



## 3.2 response Header

`Access-Control-Allow-Origin`

* 응답이 공유될 수 있는 origin을 나타낸다.
* `Access-Control-Allow-Origin: *` : 모든 도메인에서 접근할 수 있음을 의미
* `Access-Control-Allow-Origin: https://foo.example` : `https://foo.example` 이외의 도메인은 corss-site 방식으로 리소스에 접근할 수 없다

`Access-Control-Allow-Methods`

`Access-Control-Allow-Headers`

`Access-Control-Max-Age`

`Access-Control-Expose-Headers`





참고

* https://developer.mozilla.org/ko/docs/Web/HTTP/CORS
* https://fetch.spec.whatwg.org/#http-cors-protocol