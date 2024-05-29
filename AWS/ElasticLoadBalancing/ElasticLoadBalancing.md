# 1 Elastic Load Balancing

- Elastic Load Balancing(ELB)는 AWS에서 제공하는 로드 밸런싱 서비스입니다.
- ELB는 다양한 타겟에 걸쳐 들어오는 애플리케이션 트래픽을 자동으로 분배합니다.
- 타겟에는 EC2 인스턴스, 컨테이너, IP 주소 등이 포함될 수 있습니다.
- ELB는 등록된 타겟의 상태를 주기적으로 확인하고, 건강한 타겟으로만 트래픽을 분배하여 애플리케이션의 가용성을 높입니다.
- ELB의 종류는 아래 4가지가 있습니다.
	- Application Load Balancers
	- Network Load Balancers
	- Gateway Load Balancers
	- Classic Load Balancers(Deprecated)

<br>

# 2 Application Load Balancer

 * [레퍼런스](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html)
 * Application Load Balancer는 주로 HTTP/HTTPS 트래픽을 처리하며 OSI 7계층에서 작동합니다.
 * ALB는 웹소켓과 HTTP/2도 지원하며, URL, 헤더, 메소드 등을 기반으로 트래픽 라우팅 규칙을 설정할 수 있습니다.
 * ALB는 사용자 세션을 특정 타겟에 고정시키는 스티키 세션 기능도 제공합니다.

<br>

## 2.1 listener

 * ALB에는 하나 이상의 listener를 추가한다.
 * listener는 설정된 프로토콜과 포트를 통해 클라이언트로부터 연결 요청을 확인한다.
 * listener에 적용한 규칙(rule)에 따라 ALB가 요청을 어떤 타겟으로 보낼지 결정된다.
 * 각각의 규칙은 우선순위, 하나 이상의 액션, 그리고 하나 이상의 조건(condition)으로 구성된다.
	 * 규칙의 조건이 충족되면 액션이 실행된다.
 * listener는 반드시 default rule을 지정해야 하며 추가적인 rule도 설정할 수 있다.

<br>

**예시**
![[Pasted image 20231104112802.png]]

- ALB에는 2개의 listener가 있다.
- 각각의 listener는 default rule를 가지고 있다.
- 두 번째 리스너는 요청을 다른 대상 그룹으로 라우팅하는 또 다른 rule을 포함하고 있다.
- 하나의 target은 두 개의 target group에 등록되어 있다.

<br>

# 3 Network Load Balancer

* [레퍼런스](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html)
* Network Load Balancer는 높은 성능과 저지연 연결을 처리하는 데 최적화되어 있습니다. 
* NLB는 주로 TCP, UDP, TLS 트래픽을 처리하며, 이는 OSI 모델의 4계층인 전송 계층에서 작동합니다.
* NLB는 수백만 개의 요청을 초당 처리할 수 있으며, 자동 스케일링 및 무중단 서비스를 제공합니다.

<br>

## 3.1 listener

* Network Load Balancer에 하나 이상의 listener를 추가한다.
* listener는 설정된 프로토콜과 포트를 통해 클라이언트로부터 연결 요청을 확인하고 해당 요청을 타겟 그룹으로 포워딩한다.

<br>

## 3.2 target group

* target group은 지정한 프로토콜과 포트 번호를 사용하여 하나 이상의 등록된 target들, 예를 들어 EC2 인스턴스들로 요청을 라우팅한다.
* NLB의 target group은 TCP, UDP, TCP_UDP, TLS 프로토콜을 지원한다.
* 하나의 target을 여러 target group에 등록할 수 있다.
* target group마다 헬스 체크를 설정 할 수 있다.
	* 헬스 체크는 target group에 등록된 모든 target들에 대해 수행된다.

<br>

# 4 Gateway Load Balancer

- [레퍼런스](https://docs.aws.amazon.com/elasticloadbalancing/latest/gateway/introduction.html)
- Gateway Load Balancer은 아래와 같은 어플라이언스를 배포, 확장 및 관리하기 위한 서비스이다.
	- 방화벽
	- 침입 탐지 시스템(IDS intrusion detection system)
	- 침입 방지 시스템(IPS intrusion prevention systems)
	- 심층 패킷 검사 시스템
- Gateway Load Balancer는 모든 트랙픽에 대해 단일 입구 및 출구 지점 역할을 하는 동시에 수요에 따라 가상 어플라이언스를 확장하는 기능을 한다.
- Gateway Load Balancer는 OSI 모델의 3계층인 네트워크 계층에서 작동한다.
- 이 로드 밸런서는 모든 포트에 걸쳐 모든 IP 패킷을 청취하고, 리스너 규칙에 지정된 대상 그룹으로 트래픽을 전달한다.