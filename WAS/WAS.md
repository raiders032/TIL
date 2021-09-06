

# 1. Web Application Server(WAS)

* 웹서버의 기능을 포함하고 있다.
  * 정적 컨텐츠 제공
* WAS의 주요한 일은 비즈니스 로직을 수행하여 동적인 컨텐츠를 만들어 제공하는 것이다.



## WAS의 주요 기능

1. 프로그램 실행 환경과 DB접속 기능을 제공한다.
2. 트랜잭션 관리 기능
3. 업무를 처리하는 비즈니스 로직 수행



**주요 WAS**

* Apache Tomcat
* Jetty
* Jeus

>  **Static web-page(정적 페이지)**
>
> * 정적 페이지(Static web-page)는 누가 언제 어디서 페이지를 요구하더라도 항상 같은 결과만을 응답하는 페이지이다.
> * 웹 서비스 제공자가 사전에 준비하여 서버에 Deploy한 컨텐츠이며, 주로 HTML, CSS, JavaScript 및 각종 미디어 파일이 해당된다
> * Web Server는 파일 경로 이름을 받아 경로와 일치하는 file contents를 반환한다.
>
> **Dynamic web-page(동적 웹 페이지)**
>
> * 클라이언트의 요구나 시간, 장소에 따라 그 결과를 다르게 반환하는 페이지이다

# 2. Web Server

* 웹 서버는 WAS의 부분 집합이다.
* 웹서버는 정적인 컨텐츠를 제공하는 역할을 한다.
  * 예) HTML pages, files, images, video
* 주로 웹 브라우저의 HTTP의 요청에 응답한다.
* 대부분의 웹 서버는 웹 서버가 동적 컨텐츠를 생성할 수 있는 스크립팅 언어용 플러그인을 지원한다.
  * 예: ASP, JSP, PHP, Perl



## Web Server가 필요한 이유

* 웹 서버는 정적 콘텐츠에 적합하고 동적 콘텐츠에 앱 서버에 적합하다.
* 대부분의 프로덕션 환경에서는 웹 서버가 WAS에 `Reverse Proxy`로 작동한다. 
* 페이지 요청을 받은 웹 서버가 정적 컨텐츠를 제공하고 필터링 기술을 상용하여 동적 콘텐츠 요청을 식별하고 WAS로 전달하여 처리 결과를 클라이언트에게 전달합니다.
* Web Server를 통해 정적인 파일들을 WAS까지 가지 않고 빠르게 응답을 줄 수 있다.
* Web Server가 정적 컨텐츠만 처리하도록 기능을 분배하여 WAS의 부담을 줄일 수 있다.
* 자원 이용의 효율성 및 장애 극복, 배포 및 유지보수의 편의성 을 위해 Web Server와 WAS를 분리한다.




참고

* https://www.ibm.com/cloud/learn/web-server-vs-application-server

