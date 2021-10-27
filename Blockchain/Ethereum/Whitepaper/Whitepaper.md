## Introduction to Bitcoin and Existing Concepts

> 2009년 나카모토 사토시는 공개키 암호를 통한 coin의 소유권 관리할 수 있는 최초의 실용적인 분산 화폐를 만들었다. 이미 확립된 기본 요소와 "작업 증명"이라고 알려진 coin 소유자를 추적하기 위한 합의 알고리즘을 결합했다.



**Pow는 두가지 문제를 동시에 해결했다**

* 첫째, 간단하고 적당히 효과적인 합의 알고리즘을 제공하여 네트워크의 노드가 비트코인 원장 상태에 대한 일련의 업데이트에 대해 집단적으로 합의할 수 있도록 했다. 
* 둘째, 합의 과정에 자유롭게 진입할 수 있는 장치를 마련하여 합의 과정에 누가 영향을 미칠지를 결정하는 정치적 문제를 해결하는 동시에 Sybil 공격을 방지하였다.



**POW와 POS**

* 합의 투표 과정에서 단일 노드의 가중치는 노드의 컴퓨팅 능력에 정비례한다. 
* 그 이후로, 노드 가중치를 컴퓨팅 능력이 아닌 통화 보유량에 비례하는 것으로 계산하는 지분 증명이라고 불리는 대체 접근법이 제안되었다.



## Bitcoin As A State Transition System

* 비트코인은 상태 전환 시스템이라고 생각할 수 있다.

* 상태

  * 아직 사용되지 않은 코인(UTXO)의 모음이며 각 UTXO는 액면금액과 소유자가 있다.

* 상태 전환

  * 상태와 거래를 가지고 그 결과 새로운 상태를 만드는 것을 의미한다.

* 거래

  * 거래는 하나 이상의 입력을 포함한다
  * 각 입력은 현재 사용되는 UTXO와 소유자의 주소와 관련된 개인 키에 의해 생성된 암호화 서명을 포함한다.
  * 각 출력은 상태에 추가될 새로운 UTXO들이다.

* 상태 전환 funtion

  * ```
    APPLY(S,TX) -> S' or ERROR
    APPLY({ Alice: $50, Bob: $50 },"send $20 from Alice to Bob") = { Alice: $30, Bob: $70 }
    ```



**비트코인 거래**

1. TX의 각 입력에 대해:
   * 참조된 UTXO가 S에 속하지 않으면 오류를 반환합니다. -> 존재하지 않는 코인
   * 제공된 서명이 UTXO의 소유자와 일치하지 않으면 오류를 반환합니다. -> 다른 사람의 코인을 사용하지 못함
2. 모든 입력 UTXO의 합계가 모든 출력 UTXO의 합보다 작으면 오류를 반환합니다.
3. 모든 입력 UTXO가 제거되고 모든 출력 UTXO가 추가된 상태를 반환합니다.



**비트코인 거래 예시**

1. 앨리스는 밥에게 11.7 BTC를 보내고싶다
2. 먼저, Alice는 최소 11.7 BTC이상의 이용 가능한 UTXO들을 찾는다. 
3. 현실적으로, 앨리스는 정확히 액면가가 11.7 BTC인 UTXO를 얻을 수 없을 것이다; 
4. 그녀가 얻을 수 있는 가장 작은 UTXO들의 합은 6+4+2=12(UTXO)라고 가정하자. 
5. 그리고 나서 그녀는 그 세 개의 입력과 두 개의 출력으로 거래를 만든다.
6. 첫 번째 출력물은 밥의 주소를 소유자로 둔 11.7 BTC이며, 두 번째 출력물은 나머지 0.3 BTC "잔돈"으로 소유자는 앨리스 자신이 될 것이다.



## Mining

![ethereum-blocks](https://ethereum.org/static/6f7d50fd4fab9f8abb94b5e610ade7e4/bf8c1/ethereum-blocks.png)

* 비트코인을 통해 우리는 탈중앙화 화폐 시스템을 구축하려 하고 있기 때문에 모든 사람이 거래 순서에 동의하도록 하기 위해 State Transition System과 합의 시스템을 결합할 필요가 있을 것이다.
* 비트코인의 분산된 합의 프로세스는 네트워크상의 노드들이 "블록"이라고 불리는 트랜잭션 패키지를 지속적으로 생성하려고 시도하도록 요구한다.
* 네트워크는 10분마다 대략 하나의 블록을 생성하도록 되어 있다
* 각 블록은 타임스탬프, 논스, 이전 블록(해시)과 이전 블록 이후 발생한 모든 트랜잭션의 목록으로 구성된다.
* 시간이 지남에 따라 비트코인 원장의 최신 상태를 나타내기 위해 끊임없이 업데이트되는 "블록체인"을 만든다.



**블록 유효성 검사 알고리즘**

1. 블록에서 참조한 이전 블록이 존재하며 유효한지 확인합니다.
2. 블록의 타임스탬프가 이전 블록의 타임스탬프 보다 크고 향후 2시간 이내인지 확인합니다.
3. 블록의 작업증명이 유효한지 확인합니다.
4. S[0]를 이전 블록의 끝에 있는 상태라고 하자.
5. TX가 n개의 트랜잭션이 있는 블록의 트랜잭션 리스트라고 가정해 보자. 
   * 0...n-1의 모든 i에 대해 S[i+1] = APPLY(S[i],TX[i]) 
   * 오류를 반환하는 경우 종료하고 false를 반환합니다.
6. true를 반환하고 S[n]를 이 블록의 끝에 있는 상태로 등록합니다.

* 블록의 각 트랜잭션은 트랜잭션이 실행되기 전의 표준 상태에서 어떤 새로운 상태로 유효한 상태 전환을 제공해야 한다.
* 상태는 블록에 인코딩되지 않는다.
* 상태는 검증 노드에 의해 기억되어야한다.
* 상태는 발생 상태에서 시작하여 모든 블록의 모든 트랜잭션을 순차적으로 적용함으로써 계산될 수 있다.



**POW**

* POW의 조건은 256비트 숫자로 취급되는 모든 블록의 이중 SHA256 해시가 동적으로 조절되는 target보다 작아야 한다.
* 블록 생성을 전산적으로 '힘들게' 만들어 공격자가 자신들에게 유리하게 전체 블록체인을 다시 만드는 것을 막는 것이 목적이다. 
* SHA256은 완전히 예측할 수 없는 유사 난수 함수로 설계되었으므로 유효한 블록을 생성하는 유일한 방법은 시행착오를 반복하여 nonce를 증가시키고 새 해시가 일치하는지 확인하는 방법밖에 없다.
* 평균적으로 10분마다 새로운 블록이 생성되도록 2016 블록마다 네트워크에 의해 target이 조절된다.



**보상**

* POW 작업에 대해 마이너를 보상하기 위해, 모든 블록의 마이너는 인풋없이 자신에게 25 BTC를 주는 트랜잭션을 포함시킨다.
  * 이 트랜잭션을 코인베이스라고한다.
  * BTC가 발행되는 유일한 메커니즘이다
  * genesis 상태에는 coin이 전혀 존재하지 않았다
* 어떤 거래가 그것의 아웃풋보다 인풋이 더 높은 총액을 가지고 있다면, 그 차이는 "거래 수수료"로서 마이너에게 돌아간다. 



**공격자 시나리오**

* 공격자는 암호학에 의해 직접적으로 보호되지 않는 비트코인 시스템의 한 부분인 거래 순서를 바꾸는 것을 목표로 함

1. 일부 제품(가급적 빠른 배송 디지털 상품)과 교환하여 100 BTC를 판매점에 보냅니다.
2. 제품이 배송될 때까지 기다립니다.
3. 동일한 100 BTC를 자신에게 보내는 다른 트랜잭션을 생성합니다.
4. 자기 자신과의 거래가 먼저였다고 네트워크를 속이기

> 일단 (1) 단계가 실행되면, 몇 분 후에 일부 마이너는 트랜잭션을 블록(블록 번호 270000)에 포함할 것이다. 약 1시간 후, 블록 이후에 5개의 블록이 체인에 추가되며, 각 블록은 트랜잭션을 간접적으로 가리키며 "confirming"한다. 이 시점에서 판매자는 결제를 확정된 것으로 받아들이고 상품을 배송할 것이다; 우리는 이것이 디지털 상품이라고 가정하고 있기 때문에 배송은 즉시 이루어진다. 이제 공격자는 100 BTC를 자신에게 보내는 또 다른 거래를 만든다. 만약 공격자가 단순히 그것을 네트워크에 브로드캐스팅한다면, 트랜잭션은 처리되지 않을 것이다; 마이너는 APPLY(S,TX)를 실행하려고 시도하고 TX가 더 이상 state에 있지 않은 UTXO를 소비한다는 것을 알 수 있기때문이다.
>
>  따라서 공격자는 다른 버전의 블록 270000을 마이닝하는 것으로 시작하여 블록 체인의 "포크"를 생성한다. 다른 버전의 블록은 부모 블록 269999를 가리키지만 위조된 트랜잭션을 포함하고 있다. 블록 데이터가 달라졌기 때문에 POW를 다시 해야한다. 게다가 공격자의 새로운 버전인 270000블록이 다른 해시를 가지기 때문에 270001 부터 270005까지 블록의 해시도 모두 다르다. 이렇게 원본 체인과 공격자의 새로운 체인은 완전히 달라진다. 포크에서는 가장 긴 체인이 진실로 받아들여지는 규칙 있다. 그래서 올바른 마이너들은 270005 뒤에 연결할 블록을 만들 때 공격자혼자 270000블록을 작업하고 있을 것이다. 공격자가 자신의 체인을 가장 길게 만들기 위해선 그는 나머지 노드들의 컴퓨팅 파워를 합친 것 보다 더 많은 컴퓨팅 파워가 필요하다.("51% attack")



## Merkle Trees

![spv-bitcoin](https://ethereum.org/static/47aecc91895df6cd1b3e8089aa7e9a7c/e4900/spv-bitcoin.png)

**머클 트리란?**

* Merkle 트리는 이진 트리의 일종이다.
* 머클 트리는 많은 노드로 구성된다
* 리프 노드에는 저장하고자 하는 데이터가 들어있다.
* 중간 노드는 두 자식의 해시이다.
* 루트 노드 또한 두 자식의 해시이다.

**머클 트리의 용도**

* 머클 트리를 사용하는 목적은 블록의 데이터를 단편적으로 전달하기 위해서이다.
* 노드는 한 소스에서 블록의 헤더만 다운로드할 수 있고, 다른 소스에서 블록과 관련된 트리의 작은 부분만 다운로드할 수 있으며, 모든 데이터가 정확한지 확인할 수 있다.
* 이것이 가능한 이유는 해시가 위로 전파되기 때문이다.
  * 공격자가 머클 트리의 최하단인 트랜잭션을 위조하면 상위 노드의 해시가 달라지고 위로 전파뒤어 결국 머클 트리의 루트가 달라진다.
* 머클 트리 프로토콜은 장기적인 지속가능성에 필수적이다.
  * 모든 블록 전체를 저장하고 처리하는 비트코인 네트워크의 "풀 노드"는 2014년 4월 비트코인 네트워크에서 약 15GB의 디스크 공간을 차지하며 매월 1기가바이트 이상 커짐

**블록 헤더**

* 비트코인의 중요한 확장성 특징은 블록이 다단계 데이터 구조로 저장된다는 것이다. 
* 블록의 "해시"는 블록 헤더의 해시이다
* 블록 헤더의 구성 요소
  * 블록 내의 모든 트랜잭션을 저장하는 Merkle 트리라고 불리는 데이터 구조의 루트 해시 
  * 타임스탬프
  * nonce
  * 이전 블록의 해시



**SPV**

* SPV는 모든 블록체인을 다운로드 하지 않고 거래를 검증하는 간이 결제 확인 방법이다
* 라이트 노드
  * 라이트노드는 블록체인 거래내역 중 일종의 핵심본만 저장하는 노드이다. 
  * 모든 블록 정보를 가지고 있지 않고, 필요한 부분만 저장한다는 특징이 있다.
  * 모든 블록정보를 가지고 있지 않기 때문에 어떤 새로운 거래 정보를 수신받았을 경우 이 거래가 정상적인지 검증할 수 없다.
* 라이트노드는 개별 거래에 대한 트랜잭션을 확인하기 위한 SPV(Simple Payment Verify, 단순 지불 검증)를 사용한다. 
* SPV는 라이트노드에서 거래를 검증하기 위해 풀노드에게 블록정보를 요청하여 머클트리를 통해 이 거래가 검증된 거래인지를 확인하는 방법이다.



# Ethereum