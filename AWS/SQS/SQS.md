# 1 SQS

- AWS에서 제공하는 Simple Queue Service(SQS)는 완전 관리형 메시지 대기열 서비스로, 대규모 분산 애플리케이션에서 컴포넌트 간의 메시지를 안정적으로 전송하고 받을 수 있게 합니다. 
- SQS는 거의 무제한의 메시지 처리량과 규모 조정 가능성을 제공하여, 애플리케이션의 다양한 요구 사항을 충족시킵니다.

<br>

## 1.1 SQS의 두 가지 큐 유형

- SQS는 두 가지 주요 큐 유형을 제공합니다
	- Standard Queues
	- FIFO Queues
- Standard Queues는 애플리케이션이 한 번 이상 도착하고 순서대로 처리되지 않는 메시지를 처리할 수 있는 경우 사용할 수 있습니다.
- FIFO Queues는 작업 및 이벤트의 순서가 중요하거나 중복을 허용할 수 없는 애플리케이션 간의 메시징 전송을 위해 사용할 수 있습니다.

<br>

### 1.1.1 Standard Queues

- **무제한 처리량**: 표준 큐는 API 호출당 거의 무제한의 트랜잭션을 지원합니다.
- **적어도 한 번의 전달 보장**: 각 메시지는 최소 한 번 전달됩니다. 그러나 네트워크 지연이나 다른 요인으로 인해 가끔 메시지가 중복으로 전달될 수 있습니다.
- **Best-Effort Ordering**: 메시지는 대부분 전송된 순서대로 전달되지만, 완벽한 순서는 보장되지 않습니다.

<br>

### 1.1.2 FIFO Queues

- **높은 처리량**: FIFO 큐는 초당 최대 3,000개의 메시지 처리를 지원합니다(배치 사용 시). 높은 처리량 모드를 활성화하면 이 수치가 증가합니다.
	- 배치를 사용하지 않을 경우 초당 최대 300개의 메시지(초당 300번의 전송, 수신 또는 삭제 작업)를 지원합니다.
- **단 한 번의 처리 보장**: 각 메시지는 정확히 한 번만 전달됩니다, 중복 없이.
- **엄격한 선입선출 순서**: 메시지는 엄격한 순서대로 전달되어, 전송된 순서를 정확하게 유지합니다.

<br>

## 1.2 SNS와 SQS의 차이점

| SNS (Simple Notification Service) | SQS (Simple Queue Service) |
| --------------------------------- | -------------------------- |
| 퍼블리시/구독 모델 (Pub/Sub)              | 큐 기반 메시징 서비스               |
| 푸시 메커니즘                           | 폴 메커니즘                     |
| 메시지를 토픽에 게시하면 여러 구독자에게 전달됨        | 일반적으로 메시지는 단일 컨슈머에 의해 처리됨  |

<br>

## 2 Short and Long Polling

- SQS는 메시지를 효율적으로 검색하기 위해 short polling과 long polling 두 가지 방법을 제공합니다.
<br>

**Short Polling**
- 기본 설정으로, 큐가 비어 있는 경우 즉시 응답을 반환합니다.

<br>

**Long Polling**
- 더 효율적인 메시지 처리를 위해, 큐가 비어 있더라도 서버는 메시지가 도착할 때까지 응답을 지연시킵니다. 
- 이는 불필요한 API 호출 수를 줄이고, 메시지가 도착하는 즉시 처리할 수 있도록 합니다.
- Long polling은 비용을 절감하고 메시지 처리의 효율성을 높이는 방법으로 권장됩니다.