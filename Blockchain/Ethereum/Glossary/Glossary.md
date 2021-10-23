## Account

* 이더리움에서 state는 `account`라고 불리는 객체로 구성된다
* account는 20바이트 주소를 가진다
* state 전환은 account 간의 직접적인 가치 및 정보 전송이다 
* 이더리움 계정에는 네 가지 필드가 있다.
  * nonce: 각 트랜잭션이 한 번만 처리될 수 있도록 하기 위해 사용되는 카운터
  * ether balance
  * contract code
  * storage



**externally owned accounts**

* 비밀키에 의해 통제됨
* code를 가지고 있지 않다
* 트랜잭션을 만들고 서명함으로써 메시지를 전송할 수 있다.



**contract accounts**

* contract code에 의해 통제됨
* 메시지를 받을 때 마다 code가 작동한다
* storage를 읽고 쓸 수 있다
* 메시지를 보내거나 contract를 만들 수 있다.



## Contract

* 이더리움에서의 "계약"은 "충족"되거나 "준수"되어야 하는 것으로 간주되어서는 안 된다. 
* contract는 메시지나 트랜잭션을 트리거로 항상 특정 코드의 일부를 실행하는 자동화된 에이전트이다
* contract는 자신이 소유한 ether balance와 key/valuce store 대한 직접적인 통제권을 가지고 있다.



## Ether

* 이더리움의 주요 내부 암호화 화폐로 거래 수수료 지불에 사용된다.



## Gas

* 계산의 기본 단위
* 보통, 계산 단계는 1개의 가스가 들어간다.
* 일부 작업은 계산 비용이 더 많이 들 수 있다.
* state의 일부로 저장되어야 하는 데이터의 양을 증가하면 더 많은 양의 가스가 든다. 
* 거래 데이터의 1바이트당 5가스의 수수료가 발생한다. 
* 요금 시스템의 목적은 공격자가 컴퓨팅, 대역폭 및 스토리지를 포함하여 소비하는 모든 자원에 대해 비례적으로 지불하도록 요구하는 것이다. 
* 따라서 네트워크가 이러한 자원 중 더 많은 양을 소비하도록 유도하는 모든 거래는 비례하는 가스 요금을 지불해야 한다.



## Message

* contract는 다른 contract으로 message를 보낼 수 있는 기능이 있습니다. 
* message는 직렬화되지 않고 이더리움 실행 환경에만 존재하는 가상 객체입니다.



## Transaction

* transaction은 externally owned accounts에서 보낼 메시지를 저장하는 서명된 데이터 패키지를 말한다.

**Transaction 구성 요소**

* 메시지의 수신인
* 발신인을 식별하는 서명
* 보낸 사람에서 받는 사람에게 전송할 ether 양
* 선택적 데이터 필드
* 트랜잭션 실행이 수행할 수 있는 최대 계산 단계 수를 나타내는 `STARTGAS` 값
* 발송인이 계산 단계당 지불하는 요금을 나타내는 `GASPRICE` 값

