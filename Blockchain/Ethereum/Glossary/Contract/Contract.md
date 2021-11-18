# 1 Contract

* 스마트 컨트랙트란?
  * `당사자들이 다른 약속에 따라 수행하는 프로토콜을 포함하여 디지털 형식으로 지정된 일련의 약속` - 닉 사보

* 이더리움에서 **컨트랙트(스마트 컨트랙트)란 불변적인 컴퓨터 프로그램**을 말한다.
  * 이 프로그램은 이더리움 네트워크 프로토콜의 일부인 **이더리움 가상 머신의 컨텍스트상에서 결정론적으로 작동**한다.

* 컨트랙트는, 수행되거나 컴파일 되어야 할 어떤 것이라기 보다는이더리움의 실행 환경안에 살아있는 일종의 자율 에이전트이다
* 컨트랙트는 자신이 소유한 ether balance와 key/valuce store 대한 직접적인 통제권을 가지고 있다.



## 1.1 Contract의 정의

* **컴퓨터 프로그램**
  * 스마트 컨트랙트는 단순히 컴퓨터 프로그램이다
  * `컨트랙트` 라는 단어에 법적인 의미는 없다
* **immutable**
  * 스마트 컨트랙트 코드는 일단 배포되면 변경할 수 없다
  * 스마트 컨트랙트를 수정하는 유일한 방법은 새로운 인스턴스를 배포하는 것이다
* **결정론적(deterministic)**
  * 스마트 컨트랙트를 실행한 결과는 실행한 모든 이에게 동일하다
  * 어떤 노드에서 실행하더라도 스마트 컨트랙트를 실행한 트랜잭션 컨텍스트와 실행 시점에서의 이더리움 블록체인 상태가 같으면 실행 결과는 같습니다.
* **EVM 컨텍스트**
  * 스마트 컨트랙트는 매우 제한적인 실행 컨텍스트에서 작동된다
  * 자신의 상태 호출한 트랜잭션의 컨테스트 및 가장 최근 블록의 일부 정보에만 접근할 수 있다
* **탈중앙화된 월드 컴퓨터(decentralized world computer)**
  * EVM은 모든 이더리움 노드에서 로컬 인스턴스로 실행된다.
  * EVM의 모든 인스턴스 동일한 초기 상태에서 동작하고 동일한 최종 상태를 생성하기 때문에 시스템 전체가 단일 월드 컴퓨터로 작동한다.
    * 결정론적으로 스마트 컨트랙트를 실행하기 때문에 전체가 단일 월드 컴퓨터 처럼 작동합니다.



# 2 컨트랙트의 생명주기

1. 코드 작성
2. 컴파일
3. 컨트랙트 생성 트랜잭션
4. 컨트랙트 실행
4. 컨트랙트 삭제



## 2.1 컨트랙트 코드 작성

* [Solidity.md](../Solidity/Solidity.md)

```solidity
contract Faucet {

    function withdraw(uint withdraw_amount) public {
        require(withdraw_amount <= 100000000000000000);

        msg.sender.transfer(withdraw_amount);
    }
    
    function () public payable {}
}

```



## 2.2 컴파일

* 고급 언어(솔리디티)로 작성한 스마트 컨트랙트는 EVM에서 사용되는 바이트 코드로 컴파일되어야 한다.
* solidity로 작성한 컨트랙트는 solc라는 컴파일러로 EVM 바이트 코드로 변환한다.

**컴파일된 바이트코드**

```bash
solc --bin Faucet.sol
```

```
6060604052341561000f57600080fd5b60e58061001d6000396000f300606060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632e1a7d4d146041575b005b3415604b57600080fd5b605f60048080359060200190919050506061565b005b67016345785d8a00008111151515607757600080fd5b3373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050151560b657600080fd5b505600a165627a7a7230582071ed64dc2b534bdf3c7c54a9f8e0e4a29ef9adefe21681a724303852faf5ddb40029
```

```
{
	"linkReferences": {},
	"object": "6060604052341561000f57600080fd5b60e58061001d6000396000f300606060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632e1a7d4d146041575b005b3415604b57600080fd5b605f60048080359060200190919050506061565b005b67016345785d8a00008111151515607757600080fd5b3373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050151560b657600080fd5b505600a165627a7a7230582071ed64dc2b534bdf3c7c54a9f8e0e4a29ef9adefe21681a724303852faf5ddb40029",
	"opcodes": "PUSH1 0x60 PUSH1 0x40 MSTORE CALLVALUE ISZERO PUSH2 0xF JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0xE5 DUP1 PUSH2 0x1D PUSH1 0x0 CODECOPY PUSH1 0x0 RETURN STOP PUSH1 0x60 PUSH1 0x40 MSTORE PUSH1 0x4 CALLDATASIZE LT PUSH1 0x3F JUMPI PUSH1 0x0 CALLDATALOAD PUSH29 0x100000000000000000000000000000000000000000000000000000000 SWAP1 DIV PUSH4 0xFFFFFFFF AND DUP1 PUSH4 0x2E1A7D4D EQ PUSH1 0x41 JUMPI JUMPDEST STOP JUMPDEST CALLVALUE ISZERO PUSH1 0x4B JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x5F PUSH1 0x4 DUP1 DUP1 CALLDATALOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP2 SWAP1 POP POP PUSH1 0x61 JUMP JUMPDEST STOP JUMPDEST PUSH8 0x16345785D8A0000 DUP2 GT ISZERO ISZERO ISZERO PUSH1 0x77 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH2 0x8FC DUP3 SWAP1 DUP2 ISZERO MUL SWAP1 PUSH1 0x40 MLOAD PUSH1 0x0 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP6 DUP9 DUP9 CALL SWAP4 POP POP POP POP ISZERO ISZERO PUSH1 0xB6 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP JUMP STOP LOG1 PUSH6 0x627A7A723058 KECCAK256 PUSH18 0xED64DC2B534BDF3C7C54A9F8E0E4A29EF9AD 0xef 0xe2 AND DUP2 0xa7 0x24 ADDRESS CODESIZE MSTORE STATICCALL 0xf5 0xdd 0xb4 STOP 0x29 ",
	"sourceMap": "25:221:0:-;;;;;;;;;;;;;;;;;"
}
```



## 2.3 Contract의 생성

* 컴파일된 컨트랙트 코드는 특수한 형태의 트랜잭션을 통해 이더리움 블록체인에 배포가 되고 이때부터 공개된다.
  * 이 특수한 형태의 트랜잭션을 `contract creation trasaction`이라 한다.
  * `contract creation trasaction`은 to 필드로 고유한 컨트랙트 생성 주소(0x0)를 가지고 있다. 
* 트랙트가 생성되면 지갑과 마찬가지로 주소를 가지게된다.
  * 이 주소는 원래 계정 및 논스의 함수로 컨트랙트 생성 트랜잭션에서 파생된다.

```
src = web3.eth.accounts[0]
faucet_code = "6060604052341561000f57600080fd5b60e58061001d6000396000f300606060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632e1a7d4d146041575b005b3415604b57600080fd5b605f60048080359060200190919050506061565b005b67016345785d8a00008111151515607757600080fd5b3373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050151560b657600080fd5b505600a165627a7a7230582071ed64dc2b534bdf3c7c54a9f8e0e4a29ef9adefe21681a724303852faf5ddb40029"

web3.eth.sendTransaction({from: src, to: 0, data: faucet_code, gas:113558, gasPrice:200000000000})

"0x7babc2939834dfae2966710ab097346861aeb3112c2"
```





```javascript
var abi = "
[
	{
		"constant": false,
		"inputs": [
			{
				"name": "withdraw_amount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	}
]
"

var faucetContract = new web3.eth.Contract(abi);
var faucet = faucetContract.deploy({
  data: '0x6060604052341561000f57600080fd5b60e58061001d6000396000f300606060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632e1a7d4d146041575b005b3415604b57600080fd5b605f60048080359060200190919050506061565b005b67016345785d8a00008111151515607757600080fd5b3373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050151560b657600080fd5b505600a165627a7a7230582071ed64dc2b534bdf3c7c54a9f8e0e4a29ef9adefe21681a724303852faf5ddb40029', 
  arguments: []
}).send({
  from: web3.eth.accounts[0], 
  gas: '4700000'
}, function (e, contract){
  console.log(e, contract);
  if (typeof contract.address !== 'undefined') {
    console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
  }
})
```



## 2.4 Contract의 실행

* 컨트랙트는 트랜잭션에 의해 호출된 경우에만 실행된다.
  * 모든 컨트랙트는 EOA에서 시작된 트랜잭션으로 시작된다.
  * 컨트랙트가 다른 컨트랙트를 호출하여 체인을 구성하지만 첫 번째 컨트랙트는 항상 EOA의 트랜잭션으로 호출된다.
  * 컨트랙트가 다른 컨트랙트를 호출: 메시지, 인터널 트랜잭션
* 스마트 컨트랙트는 병렬적으로 실행되지 않는다
* 트랜잭션 원자성의 특징을 지닌다.
  * 모든 실행이 성공적으로 종료된 경우에만 글로벌 상태의 모든 변경사항이 기록되고 전체가 실행된다.
  * 오류로 인해 실행이 실패하면 모든 상태 변경이 트랜잭션이 실행되지 않은 것처럼 롤백된다.
  * 실패한 트랜잭션은 시도된 것으로 기록되면 가스로 소비된 이더는 원 계정에서 차감되지만, 컨트랙트 또는 계좌 상태에 영향을 미치지 않는다



## 2.5 Contract 삭제

* 컨트랙트 코드는 변경할 수 없으나 삭제 할 수 있다. 
* 컨트랙트를 삭제하면 해당 주소에서 코드와 내부 상태(스토리지)를 제거하고 빈 계정으로 남김으로 자원을 반환하는 효과가 있다. 
* 컨트랙트를 삭제하려면 SELFDESTRUCT라는 EVM 연산코드를 실행해야 한다. 
* SELFDESTRUCT 기능은 컨트랙트 작성자가 해당 기능을 프로그래밍한 경우에만 사용할 수 있다. 
* 컨트랙트를 삭제하면 가스 환불이 일어난다.