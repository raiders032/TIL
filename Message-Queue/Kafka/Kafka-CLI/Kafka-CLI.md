## 토픽

### 토픽 생성

```bash
kafka-topics.sh --create --topic quickstart-events --bootstrap-server localhost:9092
```

```bash
./kafka-topics.sh --bootstrap-server 139.150.75.240:9092 --create --topic slack --partitions 3 --replication-factor 1
```



### 토픽 수정

```bash
kafka-topics.sh --bootstrap-server broker_host:port --alter --topic my_topic_name \
        --partitions 40
```



### 토픽 리스트 확인

```bash
kafka-topics.sh --bootstrap-server localhost:9092 --list
```



### 토픽 상세보기

```bash
kafka-topics.sh --bootstrap-server localhost:9092 --describe --topic quickstart-events 
```



## 컨슈머



### 컨슈머 그룹 목록 조회

```bash
kafka-consumer-groups.sh --bootstrap-server localhost:9092 --list
```



### 컨슈머 상태와 오프셋 확인

```bash
kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group email --describe
```

