## Account

* 이더리움에서 state는 `account`라고 불리는 객체로 구성된다
* account는 20바이트 주소를 가진다
  * Keccak-256을 사용하여 공개키를의 해시를 계산 마지막 20바이트가 주소가된다.
* state 전환은 account 간의 직접적인 value 및 information 전송이다

**account 구성요소**

* nonce: 각 트랜잭션이 한 번만 처리될 수 있도록 하기 위해 사용되는 카운터
* ether balance
* contract code
* storage



### **externally owned accounts**

* 비밀키에 의해 통제됨
* code를 가지고 있지 않다
* 트랜잭션을 만들고 서명함으로써 메시지를 전송할 수 있다.



### **contract accounts**

* contract code에 의해 통제됨
  * 여기서 code란 컨트랙트 계정 생성시 이더리움 블록체인에 기록되고 EVM에 의해 실행되는 소프트웨어 프로그램이다.
* 메시지를 받을 때 마다 code가 작동한다
* storage를 읽고 쓸 수 있다
* 메시지를 보내거나 contract를 만들 수 있다.
* 컨트랙트 계정에는 개인키가 없다
  * 트랜잭션을 시작할 수 없다
  * EOA만 트랜잭션을 시작할 수 있다.



## Contract

* 이더리움에서의 "계약"은 "충족"되거나 "준수"되어야 하는 것으로 간주되어서는 안 된다. 
* contract는 메시지나 트랜잭션을 트리거로 항상 특정 코드를 실행하는 자동화된 에이전트이다
* contract는 자신이 소유한 ether balance와 key/valuce store 대한 직접적인 통제권을 가지고 있다.
* 컨트랙트는 블록체인에 바이트코드를 등록하는 특별한 트랜잭션에 의해 생성된다.
* 컨트랙트가 생성되면 지갑과 마찬가지로 주소를 가지게된다.
  * 누간가 컨트랙트 주소로 트랜잭션을 보낼 때마다 그 트랜잭션을 입력값으로 하여 컨트랙트가 EVM에서 실행된다.
* 트랜잭션에는 이더, 데이터가 포함된다
  * 이더가 포함되어 있으면 컨트랙트 잔액에 예치된다.
  * 데이터가 포함되어 있으면 데이터에서는 컨트랙트에서 명명된 함수를 지정하고 호출하여 함수에 인수를 전달할 수 있다



## Code Execution

* 이더리움 Contract의 코드는 "이더리움 가상 머신 코드" 또는 "EVM 코드"라고 하는 저수준의 스택 기반 바이트코드 언어로 작성된다. 
* 코드는 일련의 바이트로 구성되며, 여기서 각 바이트는 operation을 나타냅니다. 
* 일반적으로 코드 실행은 코드 끝에 도달하거나 오류 또는 STOP 또는 RETURN 명령이 감지될 때까지 현재 프로그램 카운터(0에서 시작)에서 작업을 반복적으로 수행한 다음 프로그램 카운터를 하나씩 증가시키는 무한 루프이다. 
* operation은 데이터를 저장할 수 있는 세 가지 유형의 공간에 액세스할 수 있습니다.



* 스택: 값을 넣고 뺄 수 있는 선입선출 저장소
* 메모리: 무한 확장 가능한 바이트 배열
* 스토리지: 계약의 장기 보관, 키/밸류 스토어. 연산이 끝나면 리셋되는 스택이나 메모리와 달리 스토리지는 장기간 지속된다.



## Dapp

* Dapp은 공개되고 탈중앙화된 피어투피어 기반 서비스 위에 제공되는 웹 애플리케이션



**Dapp의 구성 요소**

* 최소 구성 요소
  * 블록체인 스마트 컨트랙트
  * 웹 프론트엔드 사용자 인터페이스
* 추가 요소 
  * 탈중앙화 스토리지 프로토콜과 플랫폼
  * 탈장앙화 메시지 프로토콜과 플랫폼



## Ether

* 이더리움의 주요 내부 암호화 화폐로 거래 수수료 지불에 사용된다.
* 월드 컴퓨터로서의 이더리움 플랫폼 사용료를 지불하기위한 화폐

**Ether와 Gas**

* 이더리움 월드 컴퓨터에서 계산 비용을 지급하기 위한 가스를 이더로만 살 수 있다.
* 이더는 트랜잭션과함께 보내야하고 가스 구매를 위한 허용 가능한 가격을 명시적으로 지정한다.
* 가스의 가격은 정해져있지 않다.
* 트랜잭션을 위해 가스가 구매되고, 계산을 수행하고, 사용 후 남은 가스는 발신자에게 반환된다.



## EVM

* 이더리움 가상 머신이라고 하는 에뮬레이트된 컴퓨터에서 스마트 컨트랙트라는 프로그램을 실행한다.
* EVM은 싱글톤으로 전 세계에 걸친 단일 인스턴스 컴퓨터인 것처럼 작동한다.
* 각 노드들은 컨트랙트 실행을 확인하기 위해 EVM의 로컬 사본을 실행하고 이더리움 블록체인은 트랜잭션과 스마트 컨트랙트를 처리할 때 월드 컴퓨터의 변화하는 상태를 기록한다.



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

**Message 구성요소**

* 메시지 발신인
* 메시지 수신인
* ether 양
* 선택적 데이터 필드
* STARTGAS

**Transaction과 비교**

* 본질적으로 메시지는 외부 행위자가 아닌 계약에 의해 생산된다는 점을 제외하면 거래와 같다. 
* contract가 `CALL` opcode를 실행할 때 메세지가 생성된다.
* 트랜잭션과 마찬가지로 메시지는 수신자 계정으로 코드를 실행되게한다. 
* 그러므로 계약들은 외부 행위자들이 할 수 있는 것과 정확히 같은 방식으로 다른 계약들과 관계를 맺을 수 있다.



## Nonce

* 해당 주소에서 보낸 트랜잭션 건수
* 또는 연결된 코드가 있는 계정의 경우 이 계정에서 만든 컨트랙트 생성 건수와 동일한 스칼라 값



## Private key

* 계정 주소는 Private key에서 파생된다.
  * 공개키는 개인키에서 파생된다.
  * 외부 소유 계정의 이더리움 주소는 공개키-개인키 쌍의 공개키 부분에서 생성된다.
* 공개키는 은행 계좌번호와 개인키는 PIN(개인 식별 번호)와 유사하다
* 개인키는 대부분 암호화된 형태로 특수 파일에 저장하고 이더리움 지갑 소프트웨어로 관리한다
* 외부 소유 계정의 이더리움 주소는 공개키-개인키 쌍의 공개키 부분에서 생성된다.



## Smart Contract

* EVM에서 실행되는 컴퓨터 프로그램



## Transaction

* transaction은 externally owned accounts에서 보낼 메시지를 저장하는 서명된 데이터 패키지를 말한다.
* 이더리움 네트워크에 위해 전송되고 이더리움 블록체인에 기록된다.
* 트랜잭션은 EVM에서 상태 변경을 유발하거나 컨트랙트를 실행할 수 있는 유일한 방법이다.
* 컨트랜션은 독자적으로 실행되지 않는다 모든 것이 트랜잭션으로부터 시작된다.



**Transaction 구성 요소**

* nonce(논스)
  * 발신 EOA에 의해 발행되어 메시지 재사용을 방지하는 데 사용되는 일련번호
* gas price(가스 가격)
  * 발신자가 지급하는 가스의 가격(웨이)
* gas limit(가스 한도)
  * 이 트랜잭션을 위해 구입할 가스의 최대량
* recipient(수신자)
  * 목적지 이더리움 주소
* value(값)
  * 목적지에 보낼 이더의 양
* Data(데이터)
  * 가변 길이 바이너리 데이터 페이로드
* v, r, s
  * EOA의 ECDSA 디지털 서명의 세 가지 구성요소



**Transaction과 컨트랙트**

* 트랜잭션의 목적지가 컨트랙트 주소일 때 트랜잭션과 트랜잭션 데이터를 입력으로 사용하여 컨트랙트가 EVM에서 실행된다.
* 트랜잭션에는 실행할 컨트랙트의 특정 함수와 해당 함수에 전달할 파라미터를 포함할 수 있다.
* 이렇게 트랜잭션은 컨트랙트 내의 함수를 호출할 수 있다.





## Wallet

* 이더리움 계정을 관리하는데 도움을 주는 소프트웨어 애플리케이션
* 지갑은 사용자의 키를 보유하고 사용자를 대신하여 트랜잭션을 생성하고 브로드캐스팅한다.