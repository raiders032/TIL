# What is REST?

___

REST는 Representational State Transfer를 의미한다. 이는 네트워크 통신을 보다 확장성 있고 유연하게 만들기위한 디자인 원칙의 모음이다. 어떤 시스템이 RESTful 하다는 것은 아래 6가지 조건을 만족할 때이다.



 [REST의 representation이란 무엇인가](https://blog.npcode.com/2017/04/03/rest%ec%9d%98-representation%ec%9d%b4%eb%9e%80-%eb%ac%b4%ec%97%87%ec%9d%b8%ea%b0%80/)



## REST 아키텍처에 적용되는 6가지 제한 조건

### 1. Client-server

>  아키텍처를 단순화시키고 작은 단위로 분리(decouple)함으로써 클라이언트-서버의 각 파트가 독립적으로 개선될 수 있도록 해준다.



### 2. Stateless

> Stateless란 서버와 클라이언트가 상대방의 상태를 지속적으로 추적할 필요가 없다는 것을 뜻한다. 즉 서버는 과거의 요청을 기록하지 않고 모든 요청을 독립적으로 다룬다. 따라서 요청에는 필요한 모든 정보를 담고 있어야 하며 이로인해 서버와 클라이언트는 각각 상대의 상태를 저장할 필요가 없으므로 규모 확장성 면에서 도움이된다.



### 3. Uniform interface

> `Uniform interface`는 서버와 클라이언트 사이의 공용어라고 생각하면 된다. 공용어를 사용하므로써 서버가 바뀌거나 수정되더라도 전체적인 시스템이 파괴되지 않는다. Uniform interface는 아래의 4가지 조건을 포함하고 있다.
>
> #### 1. identification of resources(자원의 식별)
>
> > REST 용어 안에서 리소스는 HTML 문서, 이미지, 특정 유저에대한 정보 등등 모든 것이 될 수 있습니다. `identification of resources`는 이 리소스가 안정적인 식별자의 의해 고유하게 식별되어야 한다는 것을 의미합니다. 여기서 안정적인 식별자라는 의미는 서버와 클라이언트 사이의 상호작용 속에서도 바뀌지 않는 것을 의미합니다. 또한 리소스의 상태가 변해도 식별자는 바뀌지 않는 것을 의미합니다.
>
> 
>
> #### 2. Manipulation of resources through representations(메시지를 통한 리소스의 조작)
>
> > 클라이언트가 representations을 서버에 보내므로써 리소스를 조작할 수 있어야한다는 제약조건입니다. REST에서는 서버가 리소스에 대한 완전한 제어권을 가지고 있습니다. 즉 서버만이 리소스를 변경할 수 있습니다. 클라이언트가 리소스를 변경하고 싶을 때 클라이언트는 리소스가 최종적으로 이런식을 수정되길 원한다는 representation을 서버에 보내고 서버가 이 요청을 받아 리소스를 수정하게 됩니다.
> >
> > 예) HTTP 메서드를 GET/POST/PUT/DELETE 를 통하여 서버측에 데이터를 컨트롤합니다
>
> 
>
> ### 3. self-descriptive message
>
> > ### 메시지는 스스로를 설명해야한다.
> >
> > `self-descriptive message`는 수신자가 메세지를 받았을 때 메세지를 이해하는데 필요한 모든 정보를 가진message를 뜻합니다. 따라서 수신자가 메세지만 봐도 이를 완전히 이해할 수 있습니다. 
> >
> > **self-descriptive message** 
> >
> > ```HTTP
> > Content-Type: text/html
> > 
> > <!DOCTYPE html>
> > <html>
> >   <head>
> >     <title>Home Page</title>
> >   </head>
> >   </body>
> >     <div>Hello World!</div>
> >     <a href= “http://www.recurse.com”> Check out the Recurse Center! </a>
> >     <img src="awesome-pic.jpg">
> >   </body>
> > </html>
> > ```
> >
> > * 응답 메시지의 Content-Type을 보고 미디어 타입이 text/html 확인
> > * HTTP 명세에 미디어 타입은 IANA에 등록되어 있으므로 IANA에서 text/html 명세를 찾는다.
> > * IANA에 따르면 text/html 명세는 http://www.w3.org/TR/html 에 있다.
> > * 명세에 모든 태그의 해석 방법이 있으므로 이를 이용해 클라이언트는 메세지를 온전히 해석할 수 있다.
> >
> > 
> >
> > **self-descriptive 하지 못한 message**
> >
> > ```json
> > GET /todos HTTP/1.1
> > Host: example.org
> > 
> > HTTP/1.1 200 OK
> > Content-Type: application/json
> > 
> > [
> > 	{"id": 1, "title": "회사 가기"},
> > 	{"id": 2, "title": "집에 가기"}
> > ]
> > ```
> >
> > * 응답 메시지의 Content-Type을 보고 미디어 타입이 application/json 확인
> > * HTTP 명세에 미디어 타입은 IANA에 등록되어 있으므로 IANA에서 application/json 명세를 찾는다.
> > * IANA에 따르면 application/json 명세는 draft-ietf-jsonvis-rfc7159bis-04 이므로 링크를 찾아가 명세 해석
> > * 명세에 JSON 문서 파싱 방법이 명시되어 있으므로 문서를 성공적으로 파싱할 수 있다.
> > * 그러나 "id"가 무엇을 의미하고, "title"이 무엇을 의미하는지 알 수 없으므로  클라이언트가 메세지를 온전히 해석할 수 없다.
>
> 
>
> #### 4. Hypermedia as the engine of application state(HATEOAS) 또는 hypermedia
>
> > ### 애플리케이션의 상태는 Hyperlink를 이용해 전이되어야 한다.
> >
> > `hypermedia`란 클라이언트가 서버로 부터 받은 응답에 클라이언트의 다음 행동을 하이퍼링크로 제공하는 것을 의미합니다.
> >
> > 
> >
> > **hypermedia 예시1**
> >
> > ```http
> > HTTP/1.1 200 OK
> > Content-Type: text/html
> > 
> > <!DOCTYPE html>
> > <html>
> >   <head>
> >     <title>Home Page</title>
> >   </head>
> >   </body>
> >     <div>Hello World!</div>
> >     <a href= “http://www.recurse.com”> Check out the Recurse Center! </a>
> >     <img src="awesome-pic.jpg">
> >   </body>
> > </html>
> > ```
> >
> > 위와 같은 응답을 받았을 때 클라이언트의 다음 행동이 하이퍼링크로 아래와 같이 제공된다.
> >
> > 1. http://www.recurse.com -> 다른 사이트 방문하기
> > 2. *http://www.example.com/awesome-pic.jpg* -> 사진보기
> >
> > **hypermedia 예시2**
> >
> > ```json
> > HTTP/1.1 200 OK
> > Content-Type: application/json
> > Link: </articles/1>; rel="previous",
> > 			</articles/3>; rel="next";
> > 
> > {
> > 	"title": "The second article",
> > 	"contents": "blah blah..."
> > }
> > ```
> >
> > Link라는 헤더를 통해 현재 리소스에서 할 수 있는 다음 행동을 제공한다.
> >
> > 1. `/articles/1` -> 이전 게시글 보기
> > 2. `/articles/2` -> 다음 게시글 보기



### 4. caching

> 클라이언트가 응답을 캐싱하는 것을 의미한다. 잘 관리되는 캐싱은 클라이언트-서버 간 상호작용을 부분적으로 또는 완전하게 제거하여 scalability와 성능을 향상시킨다.



### 5. layered system

> 클라이언트와 서버 사이의 다른 요소(프록시 서버, 게이트웨이 등)가 존재할 수 있으며 모든 요소가 자신과 바로 맞닿아 있는 요소하고만 상호작용을 한다는 것을 의미합니다.이로 인해 클라이언트는 보통 대상 서버에 직접 연결되었는지, 또는 중간 서버를 통해 연결되었는지를 알 수 없습니다. 따라서 중간 서버는 로드 밸런싱 기능이나 공유 캐시 기능을 제공함으로써 시스템 규모 확장성을 향상시키는 데 유용합니다.



### 6. code on demand(optional)

> 자바 애플릿이나 자바스크립트의 제공을 통해 서버가 클라이언트가 실행시킬 수 있는 로직을 전송하여 기능을 확장시킬 수 있다.



___



## 실제로 잘 지켜지고 있는가?

* HTTP만 잘 따라도 Client-Server, Stateless, Cache, Layered System의 조건은 다 지킬 수 있다. 
* Code-on-Demand는 서버에서 코드를 클라이언트로 보내서 실행할 수 있어야 한다는 것을 의미, 즉 자바스크립트를 의미한다. 이는 필수는 아니다.
* 하지만 대부분의 API가 Uniform Interface를 만족하지 못하지 못한다.
* 대부분의 API가 Uniform Interface의 4가지 제약 조건 중 **Self-descriptive messages** 와 **Hypermedia as the engine of application state(HATEOAS)** 조건을 만족하지 못한다.



## 진짜 RESTful API 만들기

*  **Self-descriptive messages** 와 **Hypermedia as the engine of application state(HATEOAS)** 조건을 만족시켜 보자



### Self-descriptive messages 



**Hypermedia as the engine of application state(HATEOAS)**





## REST API 디자인 가이드

1. URI는 정보의 자원을 표현해야 한다

2. 자원에 대한 행위는 HTTP Method로 표현한다.

| METHOD | 역할                                                         |
| :----: | :----------------------------------------------------------- |
|  POST  | POST를 통해 해당 URI를 요청하면 리소스를 생성합니다.         |
|  GET   | GET를 통해 해당 리소스를 조회합니다. 리소스를 조회하고 해당 도큐먼트에 대한 자세한 정보를 가져온다. |
|  PUT   | PUT를 통해 해당 리소스를 수정합니다.                         |
| DELETE | DELETE를 통해 리소스를 삭제합니다.                           |



참조

* https://codewords.recurse.com/issues/five/what-restful-actually-means
* https://blog.npcode.com/2017/03/02/%eb%b0%94%ec%81%9c-%ea%b0%9c%eb%b0%9c%ec%9e%90%eb%93%a4%ec%9d%84-%ec%9c%84%ed%95%9c-rest-%eb%85%bc%eb%ac%b8-%ec%9a%94%ec%95%bd/

