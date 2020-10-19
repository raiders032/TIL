## Elastic Stack

> "ELK"는 **Elasticsearch**, **Logstash** 및 **Kibana**, 이 오픈 소스 프로젝트 세 개의 머리글자입니다. Elasticsearch는 검색 및 분석 엔진입니다. Logstash는 여러 소스에서 동시에 데이터를 수집하여 변환한 후 Elasticsearch 같은 “stash”로 전송하는 서버 사이드 데이터 처리 파이프라인입니다. Kibana는 사용자가 Elasticsearch에서 차트와 그래프를 이용해 데이터를 시각화할 수 있게 해줍니다.
>
> Elastic Stack은 ELK Stack이 그 다음 단계로 발전한 것입니다.



___

### 

## Elasticsearch

> JSON 기반의 분산형 오픈 소스 RESTful 검색 엔진으로, 사용하기 쉽고, 확장 가능하며, 유연하여 검색 분야에서는 사용자와 회사의 팬덤과 높은 인기를 누렸습니다.

* elasticsearch는 검색엔진이지만, NoSQL처럼 사용할 수 있다. 
* 데이터 모델을 JSON으로 사용하고 있어서, 요청과 응답을 모두 JSON 문서로 주고받고 소스 저장도 JSON 형태로 저장한다.
* 스키마를 미리 정의하지 않아도, JSON 문서를 넘겨주면 자동으로 인덱싱한다. 숫자나 날짜 등의 타입은 자동으로 매핑한다.

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



### RESTful API를 사용하는 엘라스틱서치

* 인덱스 생성과 삭제, 매핑 생성과 삭제, 검색, 설정 변경 등 대부분의 기능을 REST API를 통해 제공한다.

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

4. Elasticsearch 실행

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



___



## Logstash

> 무료 오픈 소스 서버의 데이터 처리 파이프라인인 Logstash는 다양한 소스에서 데이터를 수집하여 변환한 후 자주 사용하는 저장소로 전달합니다.



___



## Kibana

> Kibana는 Elasticsearch 데이터를 시각화하고 Elastic Stack을 탐색하게 해주는 무료 오픈 소스 인터페이스입니다. 



