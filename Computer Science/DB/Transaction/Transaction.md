# Transaction

> 데이터베이스 트랜잭션은 데이터베이스에 대해 데이터베이스 관리 시스템 내에서 수행되는 작업 단위를 의미합니다. 트랜잭션은 다른 트랜잭션과 독립적으로 일관되고 신뢰할 수 있는 방식으로 처리됩니다. 트랜잭션은 일반적으로 데이터베이스의 모든 변경을 나타냅니다

* Transaction이란 간단히 말하면 여러개의 query를 묶은 것이다.
* 트랜잭션은 작업의 완정성을 보장해준다.
  * 즉 논리적인 작업 셋을 모두 완벽하게 처리하거나 또는 처리하지 못할 경우에는 원 상태로 복구해서 작업의 일부만 적용되는 현상(partial update)이 발생하지 않게 만드는 기능이다.
* Lock과 서로 비슷한 개념이지만 Lock은 동시성을 제어하기 위한 기능이다.
  * 트랜잭션은 데이터의 정합성을 보장하기 위한 기능이다.



## Transaction의 목적

* 데이터베이스 환경의 트랜잭션에는 두 가지 주요 목적이 있습니다.

1. 회복

   > 실행이 중지되거나 시스템 오류가 발생한 경우에도 데이터베이스를 일관성있게 유지하고 오류로부터 올바른 복구를 허용하는 안정적인 작업 단위를 제공한다.

2. 동시성 제어

   > 데이터베이스에 동시에 액세스하는 프로그램간에 격리를 제공합니다. 이 격리가 제공되지 않으면 프로그램의 결과가 잘못되었을 수 있습니다.



## ACID 원칙

* 데이터베이스 트랜잭션은 아래의 4가지 원칙을 지켜야 한다. 

### Atomicity(원자성)

* 트랜잭션은 종종 여러 명령문으로 구성됩니다.
* 원자성은 각 트랜잭션이 완전히 성공하거나 완전히 실패하는 단일 "단위"로 처리되도록 보장합니다.
  * 트랜잭션의 모든 연산이 데이터베이스에 반영되던가 아니면 한개의 연산도 반영되지 말아야한다
  * 데이터베이스 업데이트가 부분적으로 발생하는 것을 방지합니다.

### Consistency(일관성)

* 데이터베이스의 제약사항이 트랜잭션을 시작하기 전과 후 같아야한다.
* 데이터베이스에 기록 된 모든 데이터는 제약 조건, 캐스케이드, 트리거 및 그 조합을 포함하여 정의 된 모든 규칙에 따라 유효해야합니다.

### Isolation(독립성/고립성)

* 트랜잭션은 종종 동시에 실행됩니다
* 각각의 트랜잭션이 동시에 실행되고 있는 다른 트랜잭션을 인지하지 못한다는 것을 의미한다.
* 트랜잭션의 중간 결과과 동시에 실행되고 있는 다른 트랜잭션으로부터 감쳐줘야한다.
  * 트랜잭션 연산중에 다른 트랜잭션이 값을 읽어버리면 잘못 된 값을 읽을 수 있기 때문이다.
* 고립성은 동시성 제어의 주요 목표입니다.

### Durability(지속성)

* 내구성은 트랜잭션이 커밋 된 후 시스템 오류(예 : 정전 또는 충돌)의 경우에도 커밋 된 상태로 유지되도록 보장합니다.
* 일반적으로 완료된 트랜잭션이 비 휘발성 메모리에 기록된다는 것을 의미합니다.



## Transaction State

* Active
  * 초기 상태
  * 트랜잭션이 실행 중에 있는 상태, 연산들이 정상적으로 실행 중인 상태
* Partially commited
  * 트랜잭션의 마지막 명령문이 실행된 이후 상태
  * Commit 연산이 실행되기 직전의 상태
* Aborted
  * 트랜잭션이 비정상적으로 종료되어 Rollback 연산을 수행한 상태
* Commited
  * 트랜잭션이 성공적으로 종료되어 Commit 연산을 실행한 후의 상태



## 목적

> 데이터 무결성을 최우선으로 취급하는 데이터베이스 및 기타 데이터 저장소에는 종종 데이터 무결성을 유지하기 위해 트랜잭션을 처리하는 기능이 포함됩니다. 단일 트랜잭션은 하나 이상의 독립적인 작업 단위로 구성되며 각 작업 단위는 데이터베이스 또는 기타 데이터 저장소에 정보를 읽고 / 씁니다. 이 경우 이러한 모든 처리가 데이터베이스 또는 데이터 저장소를 일관된 상태로 유지하도록하는 것이 종종 중요합니다.
>
> 간단한 트랜잭션은 아래 양식의 SQL 언어로 데이터베이스 내에서 실행된다.
>
> - Begin the transaction
> - Execute several queries (DB내 갱신이 아직 적용되지 않는다)
> - Commit the transaction (트랜잭션이 성공적이며, 갱신이 실제 적용됨)
>
> 만약 쿼리 하나가 실패하면, 데이터베이스 시스템은 전체 트랜잭션 또는 실패한 쿼리를 롤백한다. 이것은 DBMS가 어떻게 사용되고 셋업 되었느냐에 따라 다르다. 트랜잭션은 커밋전에 언제든지 수동으로 롤백될 수 있다.

## Transactional databases

> 트랜잭션 데이터베이스는 괄호로 묶인 데이터베이스 작업 (시작-커밋) 집합에 대해 ACID 속성을 제공하는 DBMS입니다. 트랜잭션 내의 모든 쓰기 작업은 모두 또는 전혀 효과가 없습니다. 즉, 트랜잭션이 성공하고 모든 쓰기가 적용되거나 그렇지 않으면 데이터베이스가 트랜잭션의 쓰기를 포함하지 않는 상태가됩니다. 트랜잭션은 또한 동시 트랜잭션의 효과가 격리 수준이라고하는 특정 보장을 충족하는지 확인합니다. 가장 높은 격리 수준은 직렬 성이며, 이는 동시 트랜잭션의 효과가 직렬 (즉, 순차적) 실행과 동일 함을 보장합니다.
>
> 간단한 트랜잭션은 일반적으로 다음과 유사한 패턴을 사용하여 트랜잭션에 래핑 된 SQL과 같은 언어로 데이터베이스 시스템에 발행됩니다.
>
> 1. 거래를 시작하십시오.
> 2. 일련의 데이터 조작 및 / 또는 쿼리를 실행합니다.
> 3. 오류가 발생하지 않으면 트랜잭션을 커밋합니다.
> 4. 오류가 발생하면 트랜잭션을 롤백하십시오.