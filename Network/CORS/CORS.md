# 1 CORS

* 교차 출처 리소스 공유(Cross-Origin Resource Sharing, CORS)는 추가 HTTP 헤더를 사용하여, 한 출처에서 실행 중인 웹 애플리케이션이 다른 출처의 선택한 자원에 접근할 수 있는 권한을 부여하도록 브라우저에 알려주는 체제입니다
* 보안상 **브라우저는 스크립트에서 시작한 교차 출처 HTTP 요청을 제한**합니다
  * XMLHttpRequest와 Fetch API는 동일 출처 정책(same-origin policy)을 따릅니다
  * 이 API를 사용하는 웹 애플리케이션은 자신의 출처와 동일한 리소스만 불러올 수 있다
  * [Same-Origin-Policy.md](../Same-Origin-Policy/Same-Origin-Policy.md)
* 즉 다른 출처간에 리소스를 공유 할 수 있도록 CORS의 추가 헤더를 사용해 브라우저에게 알려주는 것
* 백엔드 서버에서 허용해줄 다른 오리진을 명시해주면 다른 오리진에서 해당 서버의 리소스를 접근할 수 있다



**CORS 요청 예시**

* https://domain-a.com의 프론트 엔드 JavaScript 코드가 XMLHttpRequest를 사용하여 https://domain-b.com/data.json을 요청하는 경우
* 출처가 다르므로 Cross-Origin CORS 요청이다.
* `https://domain-b.com/data.json` 엔드포인트로 요청을 받는 백엔드 서버에서 CORS를 허용할 오리진 `https://domain-a.com` 를 등록한다
* https://domain-a.com의 프론트엔드에서  https://domain-b.com/data.json로 요청을 보낸 후 응답을 받으면 응답 헤더 `Access-Control-Allow-Origin` 의 값으로  https://domain-a.com이 있으므로 브라우저가 이를 읽고 더 이상 요청을 제한하지 않는다.



**브라우저**

- `브라우저`가 스크립트에서 시작한 교차 출처 HTTP 요청을 제한한다.
- 따라서 브라우저를 통하지 않는 서버에서 다른 출처의 서버로 API 요청을 하면 CORS 에러로부터 자유로워 진다.



# 2 CORS 요청 종류

## 2.1 Simple request

- [레퍼런스](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests)

* 서버 데이터에 부수 효과(side effect)를 일으키지 않는 HTTP 요청 메서드에 대해 적용됨
* 프리플라이트 없이 바로 본 요청을 보낸다.



 **아래 3가지 경우를 모두 만족 할때 만 Simple request가 적용된다.**

1. 요청의 메소드는 GET, HEAD, POST 중 하나여야 한다.
2. Accept, Accept-Language, Content-Language, Content-Type, DPR, Downlink, Save-Data, Viewport-Width, Width 헤더일 경우 에만 적용된다.
3. Content-Type 헤더가 application/x-www-form-urlencoded, multipart/form-data, text/plain중 하나여야한다.



## 2.2 preflighted request

* 서버 데이터에 부수 효과(side effect)를 일으킬 수 있는 HTTP 요청 메서드(GET을 제외한 HTTP 메서드)에 대해 적용됨
* 부수 효과를 일으킬 수 있기 때문에 먼저 [`OPTIONS`](https://developer.mozilla.org/ko/docs/Web/HTTP/Methods/OPTIONS) 메서드를 통해 다른 도메인의 리소스로 HTTP 요청을 보내 실제 요청이 전송하기에 안전한지 확인합니다.
* CORS 명세는 브라우저가 요청을 OPTIONS 메서드로 "프리플라이트"(preflight, 사전 전달)하여 지원하는 메서드를 요청하고, 서버의 "허가"가 떨어지면 실제 요청을 보내도록 요구하고 있습니다.



# 3 CORS Header



## 3.1 request Header

`Access-Control-Request-Method`

* preflighted request의 헤더로 사용되며 실제 요청에서 사용될 Method를 의미한다.

`Access-Control-Request-Headers`

* preflighted request의 헤더로 사용되며 실제 요청에서 사용될 Header를 의미한다.



## 3.2 response Header

`Access-Control-Allow-Origin`

* 응답이 공유될 수 있는 origin을 나타낸다.
* `Access-Control-Allow-Origin: *` : 모든 도메인에서 접근할 수 있음을 의미
* `Access-Control-Allow-Origin: https://foo.example` : `https://foo.example` 이외의 도메인은 corss-site 방식으로 리소스에 접근할 수 없다

`Access-Control-Allow-Methods`

`Access-Control-Allow-Headers`

`Access-Control-Max-Age`

`Access-Control-Expose-Headers`



**예시**

* 실제 POST 요청에는 `Access-Control-Request-Method` , `Access-Control-Request-Headers` 헤더가 포함되지 않습니다. OPTIONS 요청에만 필요합니다

![img](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/preflight_correct.png)

**preflight request/response**

*  OPTIONS 메서드를 사용한 preflight request를 나타냅니다.

```HTTP
OPTIONS /resources/post-here/ HTTP/1.1
Host: bar.other
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:71.0) Gecko/20100101 Firefox/71.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-us,en;q=0.5
Accept-Encoding: gzip,deflate
Connection: keep-alive
Origin: http://foo.example
Access-Control-Request-Method: POST
Access-Control-Request-Headers: X-PINGOTHER, Content-Type
```

```http
HTTP/1.1 204 No Content
Date: Mon, 01 Dec 2008 01:15:39 GMT
Server: Apache/2
Access-Control-Allow-Origin: https://foo.example
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
Access-Control-Max-Age: 86400
Vary: Accept-Encoding, Origin
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
```

**request/response**

```http
POST /resources/post-here/ HTTP/1.1
Host: bar.other
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:71.0) Gecko/20100101 Firefox/71.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-us,en;q=0.5
Accept-Encoding: gzip,deflate
Connection: keep-alive
X-PINGOTHER: pingpong
Content-Type: text/xml; charset=UTF-8
Referer: https://foo.example/examples/preflightInvocation.html
Content-Length: 55
Origin: https://foo.example
Pragma: no-cache
Cache-Control: no-cache

<person><name>Arun</name></person>
```

```http
HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 01:15:40 GMT
Server: Apache/2
Access-Control-Allow-Origin: https://foo.example
Vary: Accept-Encoding, Origin
Content-Encoding: gzip
Content-Length: 235
Keep-Alive: timeout=2, max=99
Connection: Keep-Alive
Content-Type: text/plain

[Some GZIP'd payload]
```



참고자료

* https://developer.mozilla.org/ko/docs/Web/HTTP/CORS
* https://fetch.spec.whatwg.org/#http-cors-protocol
* https://www.youtube.com/watch?v=bW31xiNB8Nc
* https://evan-moon.github.io/2020/05/21/about-cors/