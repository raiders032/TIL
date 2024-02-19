# 1 SNS(Simple Notification Service)

- [레퍼런스](https://docs.aws.amazon.com/sns/latest/dg/welcome.html)
- SNS는 publishers로부터 subscribers에게 메시지 전달을 제공하는 관리형 서비스다
- publishers는 토픽이라는 논리적 액세스 포인트 및 통신 채널에 메시지를 보내서 subscribers와 비동기적으로 통신한다.

![[Pasted image 20231020143841.png]]

<br>

# SQS와의 차이점

| SNS                                                        | SQS                                                    |
| ----------------------------------------------------------- | ------------------------------------------------------ |
| Simple Notification Service                                 | Simple Queue Service                                   |
| Pub/Sun System                                              | Queueing Service                                       |
| push                                                        | poll                                                   |
| 메시지를 토픽에 게시하면 여러 구독자에게 메시지가 전달된다. | 일반적으로 큐의 메시지는 하나의 컨슈머에 의해서 처리됨 |
|                                                             |                                                        |
