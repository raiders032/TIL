# 1 HTTP

> 하이퍼텍스트 전송 프로토콜(HTTP)은 HTML과 같은 하이퍼미디어 문서를 전송하기위한 애플리케이션 레이어 프로토콜입니다. 웹 브라우저와 웹 서버간의 커뮤니케이션을위해 디자인되었지만, 다른 목적으로도 사용될 수 있습니다. HTTP는 클라이언트가 요청을 생성하기 위한 연결을 연다음 응답을 받을때 까지 대기하는 전통적인 클라이언트-서버 모델을 따릅니다. HTTP는 무상태 프로토콜이며, 이는 서버가 두 요청간에 어떠한 데이터(상태)도 유지하지 않음을 의미합니다. 일반적으로 안정적인 전송 레이어로 UDP와 달리 메세지를 잃지 않는 프로토콜인 TCP/IP 레이어를 기반으로 사용 합니다.



## 1.1 클라이언트-서버

**클라이언트**

* 사용자 에이전트는 사용자를 대신하여 동작하는 모든 도구입니다. 
* 이 역할은 주로 **브라우저**에 의해 수행됩니다
* 브라우저는 **항상** 요청을 보내는 개체입니다. 결코 서버가 될 수 없습니다

**서버**

* 통신 채널의 반대편에는 클라이언트에 의한 요청에 대한 문서를 *제공*하는 서버가 존재합니다



## 1.2 Stateless

> HTTP는 **상태를 저장하지 않습니다(Stateless)**. 동일한 연결 상에서 연속하여 전달된 **두 개의 요청 사이에는 연결고리가 없습니다**. 이는 e-커머스 쇼핑 바구니처럼, 일관된 방식으로 사용자가 페이지와 상호작용하길 원할 때 문제가 됩니다. 하지만, HTTP의 핵심은 상태가 없는 것이지만 HTTP 쿠키는 상태가 있는 세션을 만들도록 해줍니다.
> 헤더 확장성을 사용하여, 동일한 컨텍스트 또는 동일한 상태를 공유하기 위해 각각의 요청들에 세션을 만들도록 HTTP 쿠키가 추가됩니다.

* 서버가 클라이언트의 상태를 보존하지 않는다
* 장점
  * 서버 확장성(스케일 아웃)
* 단점
  * 클라이언트가 추가 데이터 전송(필요한 모든 정보를 요청에 담아야하기 때문)



## 1.3 Connectionless(비연결성)

* HTTP는 기본이 연결을 유지하지 않는 모델 
* 일반적으로 초 단위의 이하의 빠른 속도로 응답
* 1시간 동안 수천명이 서비스를 사용해도 실제 서버에서 동시에 처리하는 요청은 수십개 이 하로 매우 작음
  * 예) 웹 브라우저에서 계속 연속해서 검색 버튼을 누르지는 않는다. 
* 서버 자원을 매우 효율적으로 사용할 수 있음

**한계**

* TCP/IP 연결을 새로 맺어야 함 - 3 way handshake 시간 추가
* 웹 브라우저로 사이트를 요청하면 HTML 뿐만 아니라 자바스크립트, css, 추가 이미지 등 수 많은 자원이 함께 다운로드
* 지금은 HTTP 지속 연결(Persistent Connections)로 문제 해결
* HTTP/2, HTTP/3에서 더 많은 최적화

# 2 HTTP Request Method(HTTP 요청 메서드)

* HTTP는 **요청 메서드**를 정의하여, 주어진 리소스에 수행하길 원하는 행동을 나타냅니다.

![HTTP request methods](136h7s2robdd4v9ev6xe.png)

## 2.1 GET

* **HTTP `GET` 메서드**는 특정한 리소스를 가져오도록 요청합니다.
*  `GET` 요청은 데이터를 가져올 때만 사용해야 합니다.
* 서버에 전달하고 싶은 데이터는 query(쿼리 파라미터, 쿼리 스트링)를 통해서 전달
* 메시지 바디를 사용해서 데이터를 전달할 수 있지만, 지원하지 않는 곳이 많아서 권장하지 않음



## 2.2 POST

* `POST` 메서드는 특정 리소스에 엔티티를 제출할 때 쓰입니다.
* 메시지 바디를 통해 서버로 요청 데이터 전달
* 주로 전달된 데이터로 신규 리소스 등록, 프로세스 처리에 사용
* 종종 서버의 상태의 변화나 부작용을 일으킵니다.

**POST 사용처**

1. 새 리소스 생성(등록)
* 서버가 아직 식별하지 않은 새 리소스 생성
2. 요청 데이터 처리
* 단순히 데이터를 생성하거나, 변경하는 것을 넘어서 프로세스를 처리해야 하는 경우
* 예) 주문에서 결제완료 -> 배달시작 -> 배달완료 처럼 단순히 값 변경을 넘어 프로세스의 상태가 변경되는 경우 POST의 결과로 새로운 리소스가 생성되지 않을 수도 있음
* 예) POST /orders/{orderId}/start-delivery (컨트롤 URI)
3. 다른 메서드로 처리하기 애매한 경우
* 예) JSON으로 조회 데이터를 넘겨야 하는데, GET 메서드를 사용하기 어려운 경우 애매하면 POST



## 2.3 PUT

* `PUT` 메서드는 목적 리소스 모든 현재 표시를 요청 payload로 바꿉니다.
* 해당 리소스가 없으면 생성한다
* 이와 달리 `PATCH` 메서드는 리소스의 부분만을 수정하는 데 쓰입니다.
* 클라이언트가 리소스를 식별
  * 클라이언트가 리소스 위치를 알고 URI 지정 
  * POST와 차이점



## 2.4 PATCH

* `PATCH` 메서드는 리소스의 부분만을 수정하는 데 쓰입니다.



## 2.5 DELETE

* `DELETE` 메서드는 특정 리소스를 삭제합니다.



## 2.6 HEAD

* `HEAD` 메서드는 `GET` 메서드의 요청과 동일한 응답을 요구하지만, 응답 본문을 포함하지 않습니다.



## 2.7 OPTIONS

* `OPTIONS` 메서드는 통신을 설정하는 데 쓰입니다.



# 3 HTTP 메서드의 속성

* 안전(Safe Methods) 
* 멱등(Idempotent Methods) 
* 캐시가능(Cacheable Methods)



## 3.1 Safe

* 호출해도 리소스를 변경하지 않는다



## 3.2 Idempotent

* `f(f(x)) = f(x)`
* 한 번 호출하든 두 번 호출하든 100번 호출하든 결과가 똑같다.
* 멱등 메서드
  * GET: 한 번 조회하든, 두 번 조회하든 같은 결과가 조회된다.
  * PUT: 결과를 대체한다. 따라서 같은 요청을 여러번 해도 최종 결과는 같다. 
  * DELETE: 결과를 삭제한다. 같은 요청을 여러번 해도 삭제된 결과는 똑같다. 
  * POST: 멱등이 아니다! 두 번 호출하면 같은 결제가 중복해서 발생할 수 있다.



## 3.3 **Cacheable**

* 응답 결과 리소스를 캐시해서 사용해도 되는가? 
* GET, HEAD, POST, PATCH 캐시가능 
  * 실제로는 GET, HEAD 정도만 캐시로 사용
* POST, PATCH는 본문 내용까지 캐시 키로 고려해야 하는데, 구현이 쉽지 않음

# 4 HTTP 상태 코드

## 4.1 정보 응답(1XX)

* 1xx (Informational): 요청이 수신되어 처리중
* 거의 사용되지 않음



## 4.2 성공 응답(2XX)

* 2xx (Successful): 요청 정상 처리

`200 OK`

* 요청이 성공적으로 되었습니다. 성공의 의미는 HTTP 메소드에 따라 달라집니다:
* `GET`: 리소스를 불러와서 메시지 바디에 전송되었습니다.
* `HEAD`: 개체 해더가 메시지 바디에 있습니다.
* `PUT` 또는 `POST`: 수행 결과에 대한 리소스가 메시지 바디에 전송되었습니다.
* `TRACE`: 메시지 바디는 서버에서 수신한 요청 메시지를 포함하고 있습니다.



`201 Created`

* 요청이 성공적이었으며 그 결과로 새로운 리소스가 생성되었습니다. 
* 이 응답은 일반적으로 `POST`요청 또는 일부` PUT` 요청 이후에 따라옵니다.
* 생성된 리소스는 응답의 Location 헤더 필드로 식별합니다



`202 Accepted`

* 요청이 접수되었으나 처리가 안료되지 않았음
* 배치 처리 같은 곳에서 사용한다.
  * 예시) 요청 접수 후 1시간 뒤에 배치 프로세스가 요청을 처리한다



`204 No Content`

* 서버가 성공적으로 수행했지만 응답 페이로드 본문에 보낼 데이터가 없음
* 예시
  * 웹 문서 편집기에 저장 버튼
  * 저장 버튼의 결과로 아무 내용이 없어도 된다.
  * 결과 내용이 없어고 204 메시지만으로 성공을 인식할 수 있기 때문



## 4.3 리다이렉션 메시지(3XX)

* 3xx (Redirection): 요청을 완료하려면 추가 행동이 필요
* 유저 에이전트(웹브라우저)의 추가 조치가 필요하다
* 리다이렉션
  * 웹 브라우저는 3xx 응답의 결과에 Location 헤더가 있으면, Location 위치로 자동 이동

**영구 리다이렉션**

* 리소스의 URI가 영구적으로 이동
* 원래의 URL를 사용하지 않는다
* 검색 엔진 등에서도 변경 인지한다

`301 Moved Permanently`

* 리다이렉트시 요청 메서드가 GET으로 변하고, 본문이 제거될 수 있음

`308 Permanent Redirect`

* 301과 기능은 같음
* 리다이렉트시 요청 메서드와 본문 유지
* 처음 POST를 보내면 리다이렉트도 POST 유지

**일시적 리다이렉션**

* 리소스의 URI가 일시적으로 변경
* 따라서 검색 엔진 등에서 URL을 변경하면 안됨
* 307, 303을 권장하지만 현실적으로 이미 많은 애플리케이션 라이브러리들이 302를 기본값으로 사용한다
* 자동 리다이렉션시에 GET으로 변해도 되면 그냥 302를 사용해도 큰 문제 없음

`302 Found`

* 리다이렉트시 요청 메서드가 GET으로 변하고, 본문이 제거될 수 있음

`303 See Other`

* 302와 기능은 같음
* 리다이렉트시 요청 메서드가 GET으로 변경

`307 Temporary Redirect`

* 302와 기능은 같음
* 리다이렉트시 요청 메서드와 본문 유지

**기타**

`300 Multiple Choices`

* 사용 X

`304 Not Modified`

* 캐시를 목적으로 사용
* 클라이언트에게 리소스가 수정되지 않았음을 알려준다. 
* 따라서 클라이언트는 로컬PC에 저장된 캐시를 재사용한다.
* 304 응답은 응답에 메시지 바디를 포함하면 안된다.
* 조건부 GET, HEAD 요청시 사용



## 4.4 클라이언트 에러 응답(4XX)

* 4xx (Client Error): 클라이언트 오류, 잘못된 문법등으로 서버가 요청을 수행할 수 없음
* 오류의 원인이 클라이언트에 있음
* 클라이언트가 이미 잘못된 요청, 데이터를 보내고 있기 때문에, 똑같은 재시도가 실패함

`400 Bad Request`

* 이 응답은 잘못된 문법으로 인하여 서버가 요청을 이해할 수 없음을 의미합니다.
* 클라이언트는 요청 내용을 다시 검토하고, 보내야함
* 예) 요청 파라미터가 잘못되거나, API 스펙이 맞지 않을 때

`401 Unauthorized`

* 클라이언트가 해당 리소스에 대한 **인증**이 필요함
* 인증(Authentication) 되지 않음
* 401 오류 발생시 응답에 WWW-Authenticate 헤더와 함께 인증 방법을 설명

`403 Forbidden`

* 클라이언트는 콘텐츠에 접근할 권리를 가지고 있지 않습니다. 
* 401과 다른 점은 서버가 클라이언트가 누구인지 알고 있습니다.
* 주로 인증 자격 증명은 있지만, **접근 권한이 불충분**한 경우
* 예) 어드민 등급이 아닌 사용자가 로그인은 했지만, 어드민 등급의 리소스에 접근하는 경우

`404 Not Found`

* 서버는 요청받은 리소스를 찾을 수 없습니다.
* 브라우저에서는 알려지지 않은 URL을 의미합니다.
* 또는 클라이언트가 권한이 부족한 리소스에 접근할 때 해당 리소스를 숨기고 싶을 때



## 4.5 서버 에러 응답(5XX)

* 5xx (Server Error): 서버 오류, 서버가 정상 요청을 처리하지 못함
* 서버에 문제가 있기 때문에 재시도 하면 성공할 수도 있음(복구가 되거나 등등)

`500 Internal Server Error` 

* 서버가 처리 방법을 모르는 상황이 발생했습니다. 
* 서버가 아직 처리 방법을 알 수 없는상태

`503 Service Unavailable`

* 서비스 이용 불가
* 서버가 일시적인 과부하 또는 예정된 작업으로 잠시 요청을 처리할 수 없음 
* Retry-After 헤더 필드로 얼마뒤에 복구되는지 보낼 수도 있음



# 6 HTTP Header

* HTTP 전송에 필요한 모든 부가정보



## 6.1 표현

* Content-Type: 표현 데이터의 형식 
* Content-Encoding: 표현 데이터의 압축 방식 
* Content-Language: 표현 데이터의 자연 언어 
* Content-Length: 표현 데이터의 길이

**표현**

![image-20211026183512668](file:///Users/YT/GoogleDrive/dev/TIL/Computer-Science/Network/HTTP/images/HTTP-Message.png?lastModify=1635241072)

- 표현은 리소스를 어떻게 보여줄 것인지를 의미한다.
  - 예시) 회원이라는 리소스를 html로 표현할 것인지 JSON으로 표현할 것인지



### 6.1.1 Content-Type

* 표현 데이터의 형식 설명
* 미디어 타입, 문자 인코딩
* 예시
  * text/html; charset=utf-8
  * application/json 
  * image/png

```http
HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8 
Content-Length: 3423

<html> 
	<body>...</body>
</html>
```

```http
HTTP/1.1 200 OK 
Content-Type: application/json 
Content-Length: 16

{"data":"hello"}
```



### 6.1.2 Content-Encoding

* 표현 데이터를 압축하기 위해 사용
* 데이터를 전달하는 곳에서 압축 후 인코딩 헤더 추가 
* 데이터를 읽는 쪽에서 인코딩 헤더의 정보로 압축 해제
* 예시
  * gzip, deflate, identity

```http
HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8 
Content-Encoding: gzip 
Content-Length: 521

lkj123kljoiasudlkjaweioluywlnfdo912u34ljko98udjkl
```



### 6.1.3 **Content-Language**

* 표현 데이터의 자연 언어
* 예시
  * ko, en, en-US

```http
HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8 
Content-Language: ko 
Content-Length: 521

<html> 
안녕하세요.
</html>
```



### 6.1.4 Content-Length

* 표현 데이터의 길이

```http
HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8 
Content-Length: 5

hello
```



## 6.2 협상

* Accept: 클라이언트가 선호하는 미디어 타입 전달 
* Accept-Charset: 클라이언트가 선호하는 문자 인코딩 
* Accept-Encoding: 클라이언트가 선호하는 압축 인코딩 
* Accept-Language: 클라이언트가 선호하는 자연 언어
* 협상 헤더는 요청시에만 사용한다.



**협상과 우선순위**

```http
GET /event
Accept-Language: ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7
```

* Quality Values(q) 값 사용
* 0~1, 클수록 높은 우선순위
* 생략하면 1

```http
GET /event
Accept: text/*, text/plain, text/plain;format=flowed, */*
```

* 구체적인 것이 우선한다
* 우선순위
  1. `text/plain;format=flowed`
  2. `text/plain`
  3. `text/*`
  4. `*/*`



## 6.3 일반

### 6.3.1 Referer

* 이전 웹 페이지 주소
* 현재 요청된 페이지의 이전 웹 페이지 주소
*  A -> B로 이동하는 경우 B를 요청할 때 Referer: A 를 포함해서 요청 
* Referer를 사용해서 유입 경로 분석 가능
* 요청에서 사용
* 참고: referer는 단어 referrer의 오타



### 6.3.2 **User-Agent**

* **유저 에이전트 애플리케이션 정보**
* 예시
  * user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/ 537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36
* 클리이언트의 애플리케이션 정보(웹 브라우저 정보, 등등) 통계 정보
* 어떤 종류의 브라우저에서 장애가 발생하는지 파악 가능 
* 요청에서 사용



### 6.3.3 Server

* 요청을 처리하는 ORIGIN 서버의 소프트웨어 정보
  * 여러 서버중 응답을 만들어 준 서버를 ORIGIN 서버라고한다.
* Server: Apache/2.2.22 (Debian)
* server: nginx
* 응답에서 사용



### 6.3.4 Host

* 요청한 호스트 정보

* 요청에서 사용
* 필수
* 하나의 서버가 여러 도메인을 처리해야 할 때 
* 하나의 IP 주소에 여러 도메인이 적용되어 있을 때



### 6.3.5 Location

* 웹 브라우저는 3xx 응답의 결과에 Location 헤더가 있으면, Location 위치로 자동 이동 (리다이렉트)
* 201 (Created): Location 값은 요청에 의해 생성된 리소스 URI
* 3xx (Redirection): Location 값은 요청을 자동으로 리디렉션하기 위한 대상 리소스를 가리킴



## 6.4 인증

### 6.4.1 Authorization

* 클라이언트 인증 정보를 서버에 전달
* Authorization: Basic xxxxxxxxxxxxxxxx



### 6.4.2 WWW-Authenticate

* 리소스 접근시 필요한 인증 방법 정의
* 401 Unauthorized 응답과 함께 사용
* WWW-Authenticate: Newauth realm="apps", type=1,  title="Login to \"apps\"", Basic realm="simple"



## 6.5 쿠키

### 6.5.1 Set-Cookie

* 서버에서 클라이언트로 쿠키 전달(응답)



### 6.5.2 Cookie 

* 클라이언트가 서버에서 받은 쿠키를 저장하고, HTTP 요청시 서버로 전달



## 6.6 캐시









참고

* https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods