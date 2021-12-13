

# 1 JWT

* JSON 웹 토큰(JWT)은 당사자 간의 정보를 안전하게 전송하기 위한 간편하고 독립적인 방법이다.
  * 정보는 JSON으로 나타낸다.
* [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519) 웹 표준으로 지정되어 있다.



# 2 JWT의 용도

**인가(Authorization)**

* 인가는 JWT를 사용하는 가장 일반적인 시나리오다. 
* 사용자가 로그인하면 각 후속 요청에는 JWT가 포함되어 사용자가 해당 토큰으로 허용된 경로, 서비스 및 리소스에 액세스할 수 있다.

**정보 교환**

* JSON 웹 토큰은 당사자 간에 정보를 안전하게 전송하는 좋은 방법이다.
* JWT는 public/private 키 쌍을 사용하여 서명할 수 있으므로 **보낸 사람이 누구인지 확인**할 수 있습니다. 
* 또한 헤더와 페이로드를 사용하여 서명을 계산할 때 콘텐츠가 **변조되지 않았는지도 확인**할 수 있습니다.
  * 페이로드를 조작하면 헤더와 페이로드를 해싱한 Signature가 달라져 변조를 쉽게 알 수 있다.



# 3 JWT의 구조

* JWT는 Header, Payload, Signature 3가지로 부분으로 구성되어 있다.
* JWT `xxxxx.yyyyy.zzzzz` 와 같이 생겼으며 3가지 부분은 `.` 으로 구분된다..



## 3.1**Header**

* header는 해시 알고리즘과 토큰의 타입 두가지 부분으로 구성되어 있다.
  * alg: Signature를 만들기 위해 사용뒤는 해시 알고리즘
  * typ: `JWT`(고정 값)



**Header 예시**

* 아래의 JSON이 **Base64Url** 인코딩 되어 토큰의 첫 번째 파트를 구성한다.

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```



## 3.2 Payload

* Payload는 토큰의 두 번째 파트이다. 
* 서버와 클라이언트가 주고받는 시스템에서 실제로 사용될 정보를 담고있다
* 여기서 정보를 **claim**이라고 부른다.
  * claim은 3가지의 종류가 있다. registered, public, private

**[Registered claims](https://tools.ietf.org/html/rfc7519#section-4.1)**

* 미리 정의된 클레임 집합이다.
  * iss (발급자), exp (만료 시간), sub (subject), aud (audience), and others.

**[Public claims](https://tools.ietf.org/html/rfc7519#section-4.2)**

* Public claim은 JWT를 사용하는 사람들이 마음대로 정의할 수 있다.
* 그러나 충돌을 방지하기위해 [IANA JSON Web Token Registry](https://www.iana.org/assignments/jwt/jwt.xhtml))에 정의하거나 충돌 방지 네임스페이스를 포함하는 URI로 정의해야 한다..

**[Private claims](https://tools.ietf.org/html/rfc7519#section-4.3)**

* private claim는 커스텀 claim이다.
* 정보 공유를 위해 사용자간의 합의 후 커스텀할 클레임을 만들어 사용한다. 



**Payload 예시**

* 아래의 JSON이 **Base64Url** 인코딩 되어 토큰의 두 번째 파트를 구성한다.

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```



## 3.3 Signature

* 시그니처 파트를 만들려면 인코딩된 헤더, 인코딩된 페이로드, secret, 헤더에 지정된 알고리즘을 가져와서 서명해야 합니다.



**Signature 예시**

* 헤더의 지정된 알고리즘이 HMAC SHA256 algorithm인 경우
* `Signature = HMACSHA256(base64UrlEncode(header) + "." +  base64UrlEncode(payload), secret)`

**Signature 용도**

* 서명은 메시지가 도중에 변경되지 않았음을 확인하는 데 사용된다.
* private 키로 서명된 토큰의 경우 JWT의 발신자가 누구인지도 확인할 수 있다.



# 4 장단점

## 4.1 장점

* stateless
  * 중앙의 인증서버, 데이터 스토어에 대한 의존성이 없어 시스템 수평 확장에 유리하다
* Base64 URL Safe Encoding을 통해 URL, Cookie, Header 모두 사용이 가능하다



## 4.2 단점

* stateless
  * 서버에서 상태를 기록하지 않기 때문에 동시 접속 문제를 해결하기 어렵다.
* Payload의 정보가 많아지면 네트워크 사용량 증가
* 토큰이 클라이언트에 저장되어서 서버가 토큰을 조작할 수 없다
* 토큰이 탈취당했을 경우에도 해당 토큰을 무효화할 방법이 없다.
  * 보완책으로 액세스 토큰과 리프레시 토큰을 사용한다.
  * 액세스 토큰 만료 시간을 짧아 탈취 당해도 곧 효력이 없어진다.
  * 액세스 토큰의 만료 시간이 짧기 때문에 사용자가 자주 로그인을 해야하는 불편함
  * 그래서 리프레스 토큰을 같이 주는데 리프레시 토큰은 서버에 기록된다
  * 액세스 토큰이 만료된 사용자는 리프레시 토큰을 보내고 서버는 기록된 리프레시 토큰과 대조하고 유효하다면 새 액세스 토큰을 준다.
* 이러한 단점 때문에 실서비스에서 JWT만을 이용해서 인가를 구현하는 경우는 많지 않다



참고 및 더 보기

* https://datatracker.ietf.org/doc/html/rfc7519
* https://jwt.io/introduction

