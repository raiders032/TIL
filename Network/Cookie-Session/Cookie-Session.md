# 1 Cookie

> HTTP 쿠키(웹 쿠키, 브라우저 쿠키)는 서버가 사용자의 웹 브라우저에 전송하는 작은 데이터 조각입니다. 브라우저는 그 데이터 조각들을 저장해 놓았다가, 동일한 서버에 재 요청 시 저장된 데이터를 함께 전송합니다. 쿠키는 두 요청이 동일한 브라우저에서 들어왔는지 아닌지를 판단할 때 주로 사용합니다. 이를 이용하면 사용자의 로그인 상태를 유지할 수 있습니다. 상태가 없는([stateless](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview#HTTP_is_stateless_but_not_sessionless)) HTTP 프로토콜에서 상태 정보를 기억시켜주기 때문입니다.
>
> 과거엔 클라이언트 측에 정보를 저장할 때 쿠키를 주로 사용하곤 했습니다. 쿠키를 사용하는 게 데이터를 클라이언트 측에 저장할 수 있는 유일한 방법이었을 때는 이 방법이 타당했지만, 지금은 modern storage APIs를 사용해 정보를 저장하는 걸 권장합니다. 모든 요청마다 쿠키가 함께 전송되기 때문에, (특히 mobile data connections에서) 성능이 떨어지는 원인이 될 수 있습니다. 정보를 클라이언트 측에 저장하려면 Modern APIs의 종류인 [웹 스토리지 API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) (`localStorage`와 `sessionStorage`) 와[ IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)를 사용하면 됩니다.

* 쿠키 정보는 항상 서버에 전송되기 떄문에 네트워크 트래픽이 추가적으로 발생
  * 최소한의 정보만 사용한다. 예) 세션ID, 인증 토큰
* 보안에 민감한 데이터는 저장하면 안된다
  * 주민번호, 신용카드 번호 등



## 1.1 쿠키의 용도

* 쿠키는 주로 세 가지 목적을 위해 사용됩니다

1. 세션 관리(Session management)
   * 서버에 저장해야 할 로그인, 장바구니, 게임 스코어 등의 정보 관리
2. 개인화(Personalization)
   * 사용자 선호, 테마 등의 세팅
3. 트래킹(Tracking)
   * 사용자 행동을 기록하고 분석하는 용도



## 1.2 Set-Cookie & Cookie 헤더



### 1.2.1 Set-Cookie

* Set-Cookie HTTP 응답 헤더는 서버로부터 사용자 에이전트로 전송됩니다. 
* 간단한 쿠키는 다음과 같이 설정될 수 있습니다

```
Set-Cookie: <cookie-name>=<cookie-value>
```

```http
HTTP/1.0 200 OK
Content-type: text/html
Set-Cookie: yummy_cookie=choco
Set-Cookie: tasty_cookie=strawberry
```

**쿠키의 생명주기**

* `Set-Cookie: id=a3fWa; Expires=Thu, 31 Oct 2021 07:28:00 GMT;`(만료일 지정 만료일 지나면 쿠키 삭제)
* Set-Cookie: max-age=3600(3600초)
* 세션 쿠키: 만료 날짜를 생략하면 브라우저 종료시 까지만 유지
* 영속 쿠키: 만료 날짜를 입력하면 해당 날짜까지 유지

**Domain**

* Domain을 명시하면 클라이언트가 명시된 Domain에만 쿠키를 전송한다 
* Domain 명시
  * 명시한 문서 기준 도메인 + 서브 도메인 포함
  * Ex) `domain=example.org` 지정 -> `example.org` , `dev.example.org` 
* Domain 생략
  * 현재 문서 기준 도메인만 적용
  * Ex) example.org에서 Domain 생략하고 쿠키 생성 -> `example.org`

**Path**

* Path을 명시하면 클라이언트가 명시된 Path에만 쿠키를 전송한다 
* 일반적으로 `path=/` 로 지정
* 예시) `path=/home` -> 
  * /home, home/level1, home/level1/level2 -> 전부 가능
  * /hello -> 불가능

**Secure**

* 쿠키는 http, https 구분 없이 전송
* Secure 적용하면 https인 경우만 전송



### 1.2.1  Cookie

* 브라우저는 서버로 전송되는 모든 요청에[`Cookie`](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Cookie)헤더를 사용하여 서버로 이전에 저장했던 모든 쿠키들을 포함시킨다

```http
GET /sample_page.html HTTP/1.1
Host: www.example.org
Cookie: yummy_cookie=choco; tasty_cookie=strawberry
```



## 1.3 보안 문제

* 쿠키만 사용해서 로그인을 유지할때 발생할 수 있는 보안 문제가 있다
* 쿠키 값은 임의로 변경할 수 있다.
  * 클라이언트가 쿠키를 강제로 변경하면 다른 사용자가 된다.
* 쿠키에 보관된 정보는 훔쳐갈 수 있다.
  * 쿠키의 정보가 나의 로컬 PC가 털릴 수도 있고, 네트워크 전송 구간에서 털릴 수도 있다.
* 해커가 쿠키를 한번 훔쳐가면 평생 사용할 수 있다.

**대안**

* 쿠키에 중요한 값을 노출하지 않고, 사용자 별로 예측 불가능한 임의의 토큰(랜덤 값)을 노출하고, 서버에서 토큰과 사용자 id를 매핑해서 인식한다. 
* 그리고 서버에서 토큰을 관리한다.
* 토큰은 해커가 임의의 값을 넣어도 찾을 수 없도록 예상 불가능 해야 한다.
* 해커가 토큰을 털어가도 시간이 지나면 사용할 수 없도록 서버에서 해당 토큰의 만료시간을 짧게(예: 30분) 유지한다. 
* 또는 해킹이 의심되는 경우 서버에서 해당 토큰을 강제로 제거하면 된다.

# 2 Session

> 세션(session)이란 웹 사이트의 여러 페이지에 걸쳐 사용되는 사용자 정보를 저장하는 방법을 의미합니다. 사용자가 브라우저를 닫아 서버와의 연결을 끝내는 시점까지를 세션이라고 합니다. 앞서 살펴본 쿠키는 클라이언트 측의 컴퓨터에 모든 데이터를 저장합니다. 하지만 세션은 서비스가 돌아가는 서버 측에 데이터를 저장하고, 세션의 키값만을 클라이언트 측에 남겨둡니다. 브라우저는 필요할 때마다 이 키값을 이용하여 서버에 저장된 데이터를 사용하게 됩니다.

**이러한 세션은 보안에 취약한 쿠키를 보완해주는 역할을 하고 있습니다.**

* 세션은 쿠키를 기반하고 있지만, 사용자 정보 파일을 브라우저에 저장하는 쿠키와 달리 세션은 서버 측에서 관리합니다. 
* 서버에서는 클라이언트를 구분하기 위해 세션 ID를 부여하며 웹 브라우저가 서버에 접속해서 브라우저를 종료할 때까지 인증상태를 유지합니다.
* 물론 접속 시간에 제한을 두어 일정 시간 응답이 없다면 정보가 유지되지 않게 설정이 가능 합니다.
* 사용자에 대한 정보를 서버에 두기 때문에 쿠키보다 보안에 좋지만, 사용자가 많아질수록 서버 메모리를 많이 차지하게 됩니다.
* 즉 동접자 수가 많은 웹 사이트인 경우 서버에 과부하를 주게 되므로 성능 저하의 요인이 됩니다.
* 클라이언트가 Request를 보내면, 해당 서버의 엔진이 클라이언트에게 유일한 ID를 부여하는 데 이것이 세션ID다.



## 2.1 세션의 동작 방식

1. 클라이언트가 서버에 접속 시 세션 ID를 발급받습니다.
2. 클라이언트는 세션 ID에 대해 쿠키를 사용해서 저장하고 가지고 있습니다.
3. 클라리언트는 서버에 요청할 때, 이 쿠키의 세션 ID를 서버에 전달해서 사용합니다.
4. 서버는 세션 ID를 전달 받아서 별다른 작업없이 세션 ID로 세션에 있는 클라언트 정보를 가져옵니다.
5. 클라이언트 정보를 가지고 서버 요청을 처리하여 클라이언트에게 응답합니다.



## 2.2 세션의 특징

- 각 클라이언트에게 고유 ID를 부여
- 세션 ID로 클라이언트를 구분해서 클라이언트의 요구에 맞는 서비스를 제공
- 보안 면에서 쿠키보다 우수
- 사용자가 많아질수록 서버 메모리를 많이 차지하게 됨



참조

*  https://developer.mozilla.org/ko/docs/Web/HTTP/Cookies
*  https://interconnection.tistory.com/74 
*  http://tcpschool.com/php/php_cookieSession_session