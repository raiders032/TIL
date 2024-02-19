# 1 Pub-Sub

- [레퍼런스](https://redis.io/docs/interact/pubsub/)
- SUBSCRIBE, UNSUBSCRIBE 및 PUBLISH 커맨드를 통해서 Publish/Subscribe 메시징 패러다임을 구현할 수 있다

<br>

**Publish/Subscribe 메시징 패러다임**

- Publish/Subscribe 메시징 패러다임에서는 발행자가 메시지를 특정 수신자에게 보내도록 프로그래밍 하지 않는다.
- 대신 발행자는는 채널에 메시지를 발행하기 때문에 발생자는 채널의 구독자가 누구인지, 또는 구독자가 있는지 없는지에 대한 지식 없이 메시지를 발행한다.
- 구독자는 하나 이상의 채널을 구독하고 구독한 채널에 발행된 메시지만 받게 된다.
- 여기에서도 발행자가 누구인지 또는 발행자가 있는지 없는지에 대한 지식 없이 메시지를 받을 수 있다.
- 이러한 발행자와 구독자의 분리하여 서로를 잘 모르게 하는 것을 decoupling이라 하며 이로써 더 큰 확장성을 얻게된다.

<br>

# CLI

## SUBSCRIBE

- SUBSCRIBE 명령어로 channels을 구독할 수 있다.

<br>

**예시**

``` bash
SUBSCRIBE channel11 ch:00
```

- "channel11"  "ch:00"을 동시에 구독한다.

<br>

## PUBLISH

- PUBLISH로 channels에 메시지를 전송할 수 있다.


**예시**

```
PUBLISH channel11 Hello
```