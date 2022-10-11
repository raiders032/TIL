# 1 Redis Cluster

- Redis Cluster를 사용하면 여러 노드로 레디스를 Horizontal scaling하는 것이 가능하다.



## 1.1 Redis Cluster의 기능

1. 데이터를 자동으로 분리해 여러 노드에 저장하고 조회할 수 있다.
2. Redis Cluster는 고가용성을 보장해 몇개의 노드에 장애가 나더라도 시스템은 정상 작동한다
   - 하지만 과반 이상의 마스터에 장애가 나면 전체 클러스가 장애가 난다.



## 1.2 Redis Cluster TCP Port

- 모든 레디스 클러스터의 노드는 두 가지 포트가 필요하다
- data port: 클라이언트 서빙을 위해 필요한 포트넘버
  - 일반적으로 `6379` 포트 사용
- bus port: 클러스터의 속한 노드끼리 소통을 위한 포트넘버
  - 일반적으로 data port에 10000을 더해 `16379` 포트 사용
- 두 포트넘버는 `cluster-port`로 설정할 수 있다. 



**bus port**

- 버스 포트를 이용해 노드 실패 감지, 설정 업데이트 등의 기능을 한다.



# 2 data sharding

- 레디스 클러스터는 16384개의 해시 슬롯을 가지고 있다
- key를 CRC16으로 해싱하고 해시 값을 16384로 나누어 슬롯을 찾는다.
- 클러스터에 속한 모든 노드는 해시 슬롯의 일부를 담당한다.
  - 만약 클러스터가 3개의 노드로 구성되었다면 슬롯은 아래와 같이 배분된다.
  - Node A contains hash slots from 0 to 5500.
  - Node B contains hash slots from 5501 to 11000.
  - Node C contains hash slots from 11001 to 16383.



## 2.1 data sharding과 노드의 추가 및 제거

- 노드가 추가되거나 삭제되면 해당 노드가 담당하고 있던 해시 슬롯을 다른 노드에 할당해야한다.
- 해시 슬롯을 옮기는 작업은 다운 타임이 없다



# 3 master-replica model

- 가용성을 확보하기 위해 레디스 클러스터는 master-replica model을 제공한다.
- master가 지고있는 데이터를 replica에 복제하고 master에 문제가 생긴 경우 replica가 새로운 master로 승격된다.
- 그러나 master와 replica가 동시에 장애가 나면 클러스터의 장애가 생긴다.
- 클러스터 생성 시 마스터 노드에 레플리카 노드를 추가할 수 있다.



## 3.1 consistency guarantees

- 레디스 클러스터는 **strong consistency**를 보장하지 않는다.
- strong consistency를 보장하지 못한다는 것은 클라이언트가 정상 응답을 받았음에도 레디스 클러스터가 특정 조건아래 쓰기 작업을 잃을 수 있다는 것이다.
- 그 이유는 비동기 복제에 있다.



**복제 과정**

1. 클라이언트가 마스터 A에 쓰기를 한다.
2. 마스터 A가 클라이언트에게 OK 응답을한다.
3. 마스터 A가 레플리카 A1, A2, A3에 쓰기 작업을 전달한다.



**strong consistency가 보장되지 않는 이유**

- 복제 과정에서 마스터 A가 레플리카에 정상적으로 복제가 되었는지 기다렸다가 클라이언트에게 응답하지 않는다.
- 정상적으로 복제가 되었는지 확인하고 클라이언트에게 응답을 주면 성능상 좋지 않기 때문
- 마스터 A가 쓰기 작업에 대해 성공을 응답하고 레플리카에 쓰기 작업 전달을 실패한다. 이후 레플리카가 마스터로 승격되면 쓰기 작업은 사라진다.



> strong consistency와 eventual consistency 참고
>
> - https://cloud.google.com/datastore/docs/articles/balancing-strong-and-eventual-consistency-with-google-cloud-datastore?hl=ko



# 4 configuration parameters

- redis.conf에 아래와 같은 레디스 노드 설정 파라미터를 사용할 수 있다.



`cluster-enabled`

- 레디스 클러스터의 노드로 띄우려면 yes로 설정 no로 설정하면 standalone 인스턴스로 시작

`cluster-config-file`

- 해당 노드의 설정 파일을 지정한다.
- 설정 파일은 사용자가 직접 편집하지 않는다.
- 레디스 인스턴스가 시작할 때 설정 파일이 자동으로 만들어진다.
- 레디스 클러스터가 자동으로 클러스터 설정을 config file에 기록한다.

`cluster-node-timeout`

- milliseconds 단위
- 만약 마스터 노드가 설정된 타임아웃 시간동안 접근할 수 없으면 

`cluster-slave-validity-factor`

`cluster-migration-barrier`

`cluster-require-full-coverage`

`cluster-allow-reads-when-down`



# 5 Create a Redis Cluster



**클러스터 생성**

```bash
redis-cli --cluster create 127.0.0.1:7000 127.0.0.1:7001 \
127.0.0.1:7002 127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005 \
--cluster-replicas 1
```

정상 결과

```css
[OK] All 16384 slots covered
```



**클러스터 노드 확인**

```bash
# 노드 접속
$ redis-cli -c -p 7000 
$ cluster nodes
01f92c5de0480db58411198058b154e7d7d4a015 192.168.158.143:7000@17000 master - 0 1665390986736 3 connected 10923-16383
2f1bef298e927410c9db819527aad94fe6d706e3 192.168.158.141:7000@17000 myself,master - 0 1665390985000 1 connected 0-5460
3b8b1380188cf9be239abcefaf3c9937c056d972 192.168.158.142:7000@17000 master - 0 1665390986535 2 connected 5461-10922
```



참고

- https://redis.io/docs/manual/scaling/
- https://redis.io/docs/reference/cluster-spec/
- https://redis.com/redis-enterprise/technology/linear-scaling-redis-enterprise/?_ga=2.233865374.1601271799.1665377689-435773788.1664429697