# Elastic Stack

> "ELK"는 **Elasticsearch**, **Logstash** 및 **Kibana**, 이 오픈 소스 프로젝트 세 개의 머리글자입니다. Elasticsearch는 검색 및 분석 엔진입니다. Logstash는 여러 소스에서 동시에 데이터를 수집하여 변환한 후 Elasticsearch 같은 “stash”로 전송하는 서버 사이드 데이터 처리 파이프라인입니다. Kibana는 사용자가 Elasticsearch에서 차트와 그래프를 이용해 데이터를 시각화할 수 있게 해줍니다.
>
> Elastic Stack은 ELK Stack이 그 다음 단계로 발전한 것입니다.



___



## Elasticsearch

> JSON 기반의 분산형 오픈 소스 RESTful 검색 엔진으로, 사용하기 쉽고, 확장 가능하며, 유연하여 검색 분야에서는 사용자와 회사의 팬덤과 높은 인기를 누렸습니다.

* elasticsearch는 검색엔진이지만, NoSQL처럼 사용할 수 있다. 
* 데이터 모델을 JSON으로 사용하고 있어서, 요청과 응답을 모두 JSON 문서로 주고받고 소스 저장도 JSON 형태로 저장한다.
* 스키마를 미리 정의하지 않아도, JSON 문서를 넘겨주면 자동으로 인덱싱한다. 숫자나 날짜 등의 타입은 자동으로 매핑한다.
* Hadoop, Spark 보다 나은 성능을 제공한다.



___



### 관계형 데이터베이스와 비교

* 관계형 데이터베이스는 단순 텍스트매칭에 대한 검색만을 제공
* 텍스트를 여러 단어로 변형하거나 텍스트의 특질을 이용한 동의어나 유의어를 활용한 검색이 가능
* 관계형 데이터베이스에서 불가능한 비정형 데이터의 색인과 검색이 가능
* 형태소 분석을 통한 자연어 처리가 가능
* 역색인 지원으로 매우 빠른 검색이 가능

용어 비교

| Elasticsearch  | RDB                    |
| -------------- | ---------------------- |
| 인덱스(index)  | 데이터베이스(Database) |
| 샤드(shard)    | 파티션(Partition)      |
| 타입(Type)     | 테이블(Table)          |
| 문서(Document) | 행(Row)                |
| 필드(Field)    | 열(Column)             |
| 매핑(Mapping)  | 스키마(Schema)         |
| Query DSL      | SQL                    |

* Document
  * 유니크한 id를 가진다.
  * DB의 row와 같다.



___



### Shard

* 인덱스를 니눈 것
* 독립적인 객체
* 여러 컴퓨터에 shard를 분산 시킬 수 있다.
* document를 찾을 때 해쉬 값을 이용해  shard의 id를 특정할 수 있다.
  * 따라서 어떤 shard가 특정한 document를 소유했는지 빠르게 알 수 있다.



#### 프라이머리 샤드(Primary Shard)와 복제본(Replica)

* 인덱스를 생성할 때 별도의 설정을 하지 않으면 **7.0** 버전부터는 **디폴트로 1**개의 샤드로 인덱스가 구성된다.
* 처음 생성된 샤드를 프라이머리 샤드(Primary Shard), 복제본은 리플리카(Replica) 라고 부른다.
* 같은 샤드와 복제본은 동일한 데이터를 담고 있으며 반드시 서로 다른 노드에 저장이 된다
* 프라이머리 샤드가 유실된 경우에는 새로 프라이머리 샤드가 생성되는 것이 아니라, 남아있던 복제본이 먼저 프라이머리 샤드로 승격이 되고 다른 노드에 새로 복제본을 생성하게 된다.
* 프라이머리 샤드와 리플리카를 통해 Elasticsearch는 운영 중에 노드가 유실 되어도 데이터를 잃어버리지 않고 데이터의 가용성과 무결성을 보장한다.
* 쓰기 요청은 Primary Shard에서 처리하고 복제된다.
* 읽기 요청은 Primary Shard 또는 Replica에서 처리된다.

> 노드가 1개만 있는 경우 프라이머리 샤드만 존재하고 복제본은 생성되지 않는다. Elasticsearch는  데이터 가용성과 무결성을 위해 최소 3개의 노드로 구성 할 것을 권장한다.



#### 샤드 개수 설정

* 프라이머리 샤드 수는 인덱스를 처음 생성할 때 지정하며, 인덱스를 재색인 하지 않는 이상 바꿀 수 없다.
* Replica의 수는 변경할 수 있다.
* 프라이머리 샤드 5, 복제본 1 인 books 인덱스 생성
  * 총 10개의 샤드가 생성된다.

```shell
# 초기 세팅 프라이머리 샤드 5, 복제본 1 인 books 인덱스 생성
$ curl -XPUT "http://localhost:9200/books" -H 'Content-Type: application/json' -d'
{
  "settings": {
    "number_of_shards": 5,
    "number_of_replicas": 1
  }
}'
```

```shell
# Replica 수 변경
$ curl -XPUT "http://localhost:9200/books/_settings" -H 'Content-Type: application/json' -d'
{
  "number_of_replicas": 2
}'
```



### 매핑

* 스키마의 정의다.
* 미리 정의하지 않고 document를 추가하면 필드의 값을 보고 타입을 예상해 자동적으로 매핑을 생성한다.
* 필드를 추가 가능
* 필드를 삭제 불가능
* 타입 및 설정값 변경 불가능
* 정의하지 않은 필드가 document에 있으면 매핑에 필드가 자동적으로 추가된다. 



___



### Analyzer

- 검색어를 추출하기 위한 과정을 Text Analysis라 하고 이 기능을 하는 것이 `Analyzer`
- `Analyzer` 는 `Character Filter` , `Tokenizer`, `Token Filter`로 구성된다.

![ElasticSearch - 분석](2019-03-04-21-22-10.png)

#### Character Filter

* 특정 문자를 대치하거나 삭제하는 전처리 과정
* HTML Strip
  * HTML 태그들을 제거하여 일반 텍스트로 만든다.
* Mapping
  * 특정 문자를 다른 문자로 대치한다.
* Pattern Replace
  * 정규 표현식을 사용해 보다 정교하게 문자를 대치한다.
* 0~3개 적용 가능



#### Tokenizer

* 문장을 텀 단위로 쪼개는 역할
* Standard
* Letter
* Whitespace
* 하나만 적용 가능



#### Token Filter

* `lowercase`

*  `stopword`

  * 불용어를 제거한다.
  * a, an, the 등등

*  `snowball`

  * 텀을 기본 형태로 바꾼다.

*  `synonym`

* 0~n개 적용 가능

  



___



### RESTful API

* 인덱스 생성과 삭제, 매핑 생성과 삭제, 검색, 설정 변경 등 대부분의 기능을 REST API를 통해 제공한다.
* Java Client API가 존재한다. 찾아보고 적용하자.
  * HLRC

| Elasticsearch | RDB    | CRUD   |
| ------------- | ------ | ------ |
| GET           | SELECT | READ   |
| PUT           | UPDATE | UPDATE |
| POST          | INSERT | CREATE |
| DELETE        | DELETE | DELETE |



형식

```
http://host:port/(index)/(type)/(action|id)  
```



예시

1. 인덱스 만들기 

   ```
   PUT /my-index-000001
   ```



___



### 설치

우분투 기준

1. Java jdk 설치

Elasticsearch는 JVM위에서 작동하기 때문에 java jdk 설치가 우선적으로 필요하다.

```shell
java -version
sudo apt update
sudo apt install openjdk-8-jdk
java -version
```

2. Elasticsearch Repository 추가하기

```shell
#To allow access to your repositories via HTTPS, you need to install an APT transport package
sudo apt install apt-transport-https
#update the GPG key for the Elasticsearch repository.
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
#add the repository to your system.
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-7.x.list
```

3. Elasticsearch 설치

```shell
sudo apt update
sudo apt install elasticsearch
```

4. config

* sudo vi /etc/elasticsearch/elasticsearch.yml

```shell
sudo vi /etc/elasticsearch/elasticsearch.yml

# ------------------------------------ Node ------------------------------------
#
# Use a descriptive name for the node:
#
node.name: node-1
#
# Add custom attributes to the node:
#
#node.attr.rack: r1
# ---------------------------------- Network -----------------------------------
#
# Set the bind address to a specific IP (IPv4 or IPv6):
#
network.host: 0.0.0.0
#
# Set a custom port for HTTP:
#
#http.port: 9200
#
# For more information, consult the network module documentation.
# --------------------------------- Discovery ----------------------------------
#
# Pass an initial list of hosts to perform discovery when this node is started:
# The default list of hosts is ["127.0.0.1", "[::1]"]
#
discovery.seed_hosts: ["127.0.0.1"]
#
# Bootstrap the cluster using an initial set of master-eligible nodes:
#
cluster.initial_master_nodes: ["node-1"]
#
# For more information, consult the discovery and cluster formation module documentation.
```

5. Elasticsearch 실행

```shell
#reload the systemd configuration
sudo systemctl daemon-reload
#enable the Elasticsearch service
sudo systemctl enable elasticsearch.service
#start Elasticsearch
sudo systemctl start elasticsearch.service
#restart Elasticsearch
sudo systemctl restart elasticsearch.service
#stop the service
sudo systemctl stop elasticsearch.service
#check the status of the service.
service elasticsearch status
```

5, 작동 확인

```shell
service elasticsearch status

curl -XGET localhost:9200
{
  "name" : "ip-172-31-1-243",
  "cluster_name" : "elasticsearch",
  "cluster_uuid" : "xHfGaw7BRgmniTwMmeggFQ",
  "version" : {
    "number" : "7.9.3",
    "build_flavor" : "default",
    "build_type" : "deb",
    "build_hash" : "c4138e51121ef06a6404866cddc601906fe5c868",
    "build_date" : "2020-10-16T10:36:16.141335Z",
    "build_snapshot" : false,
    "lucene_version" : "8.6.2",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```



```shell
wget http://media.sundog-soft.com/es7/shakes-mapping.json

curl -H 'Content-Type: application/json' -XPUT 127.0.0.1:9200/shakespeare --data-binary @shakes-mapping.json

wget http://media.sundog-soft.com/es7/shakespeare_7.0.json

curl -H 'Content-Type: application/json' -XPOST '127.0.0.1:9200/shakespeare/_bulk?pretty' --data-binary @shakespeare_7.0.json

curl -H 'Content-Type: application/json' -XGET '127.0.0.1:9200/shakespeare/_search?pretty' -d '
{
"query" : {
"match_phrase" : {
"text_entry" : "to be or not to be"
}
}
}
'

```



도커로 설치

```shell
#이미지 가져오기
docker pull docker.elastic.co/elasticsearch/elasticsearch:7.10.0

#싱글 노드 클러스터 실행하기
docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.10.0
```





___

## Logstash

	### 설치

```shell
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -

sudo apt-get install apt-transport-https

echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-7.x.list

sudo apt-get update && sudo apt-get install logstash
```



> 무료 오픈 소스 서버의 데이터 처리 파이프라인인 Logstash는 다양한 소스에서 데이터를 수집하여 변환한 후 자주 사용하는 저장소로 전달합니다.

* 로그스태시를 이용해서 효율적으로 데이터베이스의 레코드(records)를 엘라스틱서치로 가져온다.
* **input plugin**, **filter plugin**, **output plugin**과 같은 플러그인 구조로 되어 있다. 
* jdbc input plugin
  * 주기적으로 MySQL을 폴링(polling)해서 마지막 작업 다음에 새로 추가되거나 수정된 레코드가 있으면 엘라스틱서치로 인덱싱할 수 있습니다.
* 다양한 소스에서 데이터를 수집할 수 있다.
  * S3, Kafka, DB



### 싱크 작업시 주의점

* id
* 생성시간
* 수정시간

  

### **로그스태시 파이프라인(pipeline)**

```
input {
  jdbc {
    jdbc_driver_library => "<path>/mysql-connector-java-8.0.16.jar"
    jdbc_driver_class => "com.mysql.jdbc.Driver"
    jdbc_connection_string => "jdbc:mysql://<MySQL host>:3306/es_db"
    jdbc_user => <my username>
    jdbc_password => <my password>
    jdbc_paging_enabled => true
    tracking_column => "unix_ts_in_secs"
    use_column_value => true
    tracking_column_type => "numeric"
    schedule => "*/5 * * * * *"
    statement => "SELECT *, UNIX_TIMESTAMP(modification_time) AS unix_ts_in_secs FROM es_table WHERE (UNIX_TIMESTAMP(modification_time) > :sql_last_value AND modification_time < NOW()) ORDER BY modification_time ASC"
  }
}
filter {
  mutate {
    copy => { "id" => "[@metadata][_id]"}
    remove_field => ["id", "@version", "unix_ts_in_secs"]
  }
}
output {
  # stdout { codec =>  "rubydebug"}
  elasticsearch {
      index => "rdbms_sync_idx"
      document_id => "%{[@metadata][_id]}"
  }
}
```

* tracking_column
  * 로그스태시가 읽은 마지막 레코드를 식별하기 위해서 사용된다.
  * 다음 번에 로그스태시가 레코드를 읽을 때 이 시간 이후로 싱크 작업이 이루어지도록 설정하는 데 사용됩니다.
* unix_ts_in_secs
* sql_last_value



___



## Kibana

> Kibana는 Elasticsearch 데이터를 시각화하고 Elastic Stack을 탐색하게 해주는 무료 오픈 소스 인터페이스입니다. 



### Install from the APT repository

```
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
sudo apt-get install apt-transport-https
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-7.x.list
sudo apt-get update && sudo apt-get install kibana
```



### Download and install the Debian package manually

```shell
wget https://artifacts.elastic.co/downloads/kibana/kibana-7.9.3-amd64.deb
shasum -a 512 kibana-7.9.3-amd64.deb 
sudo dpkg -i kibana-7.9.3-amd64.deb
```



### 설정

* /etc/kibana/kibana.yml

```
elasticsearch.url:YOUR_ELASTICSEARCH_URL
server.host:the address to which kibana server will bind
```



### 실행

* systemd 경우

```shell
ps -p 1
  PID TTY          TIME CMD
    1 ?        00:00:13 systemd
sudo /bin/systemctl daemon-reload
sudo /bin/systemctl enable kibana.service
sudo systemctl start kibana.service
sudo systemctl stop kibana.service
```

* init

```shell
sudo update-rc.d kibana defaults 95 10
sudo -i service kibana start
sudo -i service kibana stop
```





참고

* https://m.blog.naver.com/olpaemi/221644176875



오류

* FATAL CLI ERROR Error: ENOENT: no such file or directory, open '/usr/share/kibana/config/kibana.yml'

