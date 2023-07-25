# 1 EFK

-  EFK를 쿠버네티스 cluster-level logging 솔루션으로 적용하기 전에 쿠버네티스의 [Logging Architecture](../Logging-Architecture/Logging-Architecture.md)를 먼저 이해하는 것이 좋다.
-  EFK는 Using a node logging agent 방식으로 Cluster Level Logging Architecture를 구성한다.
   -  Flent Bit이 각 노드마다 하나씩 작동하는 logging agent의 역할을 한다.
   -  Elastic Search는 logging 백엔드로 로그 저장, 분석, 조회 기능을 담당한다.
   -  Kibana는 Elastic Search를 시각화하는 역할을 한다.

-  CRI 프로토콜에 의해 컨테이너의 로그는 `/var/log/pods` 위치에 쌓인다.



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



# 3 Fluent Bit

- [Fluent-Bit.md](../../DevOps/Fluent-Bit/Fluent-Bit.md) 참고



## 3.1 Fluent Bit 설치

- [레퍼런스](https://docs.fluentbit.io/manual/installation/kubernetes)



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



**차트 설치**

-  values.yaml 작성은 아래 참고

```bash
helm install fluent-bit fluent/fluent-bit \
-n efk \
--values values.yaml
```



## 3.2 values.yaml 작성

- https://github.com/fluent/helm-charts/blob/main/charts/fluent-bit/values.yaml
- 컨테이너의 로그를 읽고 Elasticsearch 클러스터로 전송하도록 기본 설정되어 있다.



**로깅 레벨 수정**

```yaml
logLevel: info
```

- Fluent Bit의 로그 레벨을 수정한다.
- 기본 값은 `info`로 디버깅이 필요하면 `debug`, `trace` 등을 사용할 수 있다.



**인풋 플러그인 설정**

```yaml
config:  
  inputs: |
    [INPUT]
        Name tail
        Path /var/log/containers/*.log
        multiline.parser docker, cri
        Tag kube.*
        Mem_Buf_Limit 5MB
        Skip_Long_Lines On
```



**커스텀 파서 등록**

```yaml
config:  
  customParsers: |
    [PARSER]
        Name docker_no_time
        Format json
        Time_Keep Off
        Time_Key time
        Time_Format %Y-%m-%dT%H:%M:%S.%L
```

- 위와 같이 커스텀 파서를 등록하고 인풋 설정에서 파서의 이름(docker_no_time)을 참조해서 사용한다.



**주의: Docker가 아닌 CRI 구현체를 사용할 경우**

```yaml
config:
  inputs: |
    [INPUT]
        Name tail
        Path /var/log/containers/*.log
        Parser cri
        Tag kube.*
        Mem_Buf_Limit 5MB
        Skip_Long_Lines On
  customParsers: |
    [PARSER]
        Name cri
        Format regex
        Regex ^(?<time>[^ ]+) (?<stream>stdout|stderr) (?<logtag>[^ ]*) (?<message>.*)$
        Time_Key    time
        Time_Format %Y-%m-%dT%H:%M:%S.%L%z
```

- 컨테이너 런타임으로 Docker가 아닌 CRI 구현체를 사용할 경우 위와 같이 커스텀 파서를 등록해야 한다.
- 커스텀 파서 cri를 사용하도록 위와 같이 INPUT 플러그인을 설정한다.
- [레퍼런스](https://docs.fluentbit.io/manual/installation/kubernetes#container-runtime-interface-cri-parser)



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



**삭제**

```bash
helm uninstall kibana
```

````bash
kubectl delete -n efk configmaps kibana-kibana-helm-scripts
kubectl delete -n efk serviceaccounts pre-install-kibana-kibana
kubectl delete -n efk rolebindings.rbac.authorization.k8s.io pre-install-kibana-kibana
kubectl delete -n efk role pre-install-kibana-kibana
kubectl delete -n efk jobs.batch pre-install-kibana-kibana
````



참고

- https://www.youtube.com/watch?v=B2IS-XS-cc0
- https://www.youtube.com/watch?v=5ofsNyHZwWE