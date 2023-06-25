# 1 EFK

-  EFK를 쿠버네티스 전체 로깅 솔루션으로 적용하기 전에 쿠버네티스의 [Logging Architecture](../Logging-Architecture/Logging-Architecture.md)를 먼저 이해하는 것이 좋다.



# 2 Elastic Search



## 2.1 Elastic Search 설치

**Elastic Helm charts repo 등록**

```bash
$ helm repo add elastic https://helm.elastic.co
```



**repo 등록 확인**

```bash
$ helm repo list
NAME        	URL
elastic     	https://helm.elastic.co
```



**elastic repo 차트 확인**

``` bash
$ helm search repo elastic
NAME                     	CHART VERSION	APP VERSION	DESCRIPTION
elastic/eck-elasticsearch	0.4.0        	           	Elasticsearch managed by the ECK operator
elastic/elasticsearch    	8.5.1        	8.5.1      	Official Elastic helm chart for Elasticsearch
elastic/apm-attacher     	0.1.0        	           	A Helm chart installing the Elastic APM mutatin...
elastic/apm-server       	8.5.1        	8.5.1      	Official Elastic helm chart for Elastic APM Server
...
```



**elastic/elasticsearch 차트 버전 확인**

```bash
$ helm search repo elastic/elasticsearch --versions
NAME                 	CHART VERSION	APP VERSION	DESCRIPTION
elastic/elasticsearch	8.5.1        	8.5.1      	Official Elastic helm chart for Elasticsearch
elastic/elasticsearch	7.17.3       	7.17.3     	Official Elastic helm chart for Elasticsearch
elastic/elasticsearch	7.17.1       	7.17.1     	Official Elastic helm chart for Elasticsearch
...
```



**values.yaml 작성**

- https://github.com/elastic/helm-charts/blob/main/elasticsearch/values.yaml



```yaml
volumeClaimTemplate:
  storageClassName: ceph-filesystem
  accessModes: ["ReadWriteOnce"]
  resources:
    requests:
      storage: 10Gi
```

- storageClassName을 지정해준다.



**차트 설치**

```bash
helm install elasticsearch elastic/elasticsearch \
-n efk \
--values values.yaml
```



# 3 Fluent Bit 설치

- [Fluent-Bit.md](../../DevOps/Fluent-Bit/Fluent-Bit.md) 참고
- https://docs.fluentbit.io/manual/installation/kubernetes



**Fluent Bit Helm charts repo 등록**

- https://github.com/fluent/helm-charts

```bash
$ helm repo add fluent https://fluent.github.io/helm-charts
```



**repo 등록 확인**

```bash
$ helm repo list
NAME        	URL
elastic     	https://helm.elastic.co
fluent      	https://fluent.github.io/helm-charts
```



**fluent repo 차트 확인**

``` bash
$ helm search repo fluent
NAME                  	CHART VERSION	APP VERSION	DESCRIPTION
fluent/fluent-bit     	0.33.0       	2.1.6      	Fast and lightweight log processor and forwarde...
fluent/fluent-operator	2.3.0        	2.3.0      	Fluent Operator provides great flexibility in b...
fluent/fluentd        	0.4.3        	v1.15.2    	A Helm chart for Kubernetes
```



**fluent/fluent-bit 차트 버전 확인**

```bash
$ helm search repo fluent/fluent-bit --versions
NAME             	CHART VERSION	APP VERSION	DESCRIPTION
fluent/fluent-bit	0.33.0       	2.1.6      	Fast and lightweight log processor and forwarde...
fluent/fluent-bit	0.32.2       	2.1.5      	Fast and lightweight log processor and forwarde...
fluent/fluent-bit	0.32.1       	2.1.5      	Fast and lightweight log processor and forwarde...
fluent/fluent-bit	0.32.0       	2.1.5      	Fast and lightweight log processor and forwarde...
```



**values.yaml 작성**

- https://github.com/fluent/helm-charts/blob/main/charts/fluent-bit/values.yaml
- 컨테이너의 로그를 읽고 Elasticsearch 클러스터로 전송하도록 기본 설정되어 있다.



```yaml
[INPUT]
    Name tail
    Path /var/log/containers/*.log
    Parser cri
    Tag kube.*
    Mem_Buf_Limit 5MB
    Skip_Long_Lines On
```

```
[PARSER]
    # http://rubular.com/r/tjUt3Awgg4
    Name cri
    Format regex
    Regex ^(?<time>[^ ]+) (?<stream>stdout|stderr) (?<logtag>[^ ]*) (?<message>.*)$
    Time_Key    time
    Time_Format %Y-%m-%dT%H:%M:%S.%L%z
```

- 컨테이너 런타임으로 Docker가 아닌 CRI 구현체를 사용할 경우 위와 같이 설정을 변경해야 한다.
- [레퍼런스](https://docs.fluentbit.io/manual/installation/kubernetes#container-runtime-interface-cri-parser)



**차트 설치**

```bash
helm install fluent-bit fluent/fluent-bit \
-n efk \
--values values.yaml
```



# 4 Kibana



## 4.1 Kibana 설치



**values.yaml 작성**

- https://github.com/elastic/helm-charts/blob/main/kibana/values.yaml



**elastic/kibana 차트 설치**

```bash
helm install kibana elastic/kibana \
-n efk \
--values values.yaml
```





참고

- https://www.youtube.com/watch?v=B2IS-XS-cc0
- https://www.youtube.com/watch?v=5ofsNyHZwWE