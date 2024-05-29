# 1 Amazon Data Firehose

- Amazon Data Firehose는 실시간 스트리밍 데이터를 다양한 목적지로 전달하는 완전 관리형 서비스입니다.
- 이 서비스를 사용하면 애플리케이션을 작성하거나 리소스를 관리할 필요 없이 데이터를 손쉽게 스트리밍하고 저장할 수 있습니다.

<br>

# 2 주요 기능

## 2.1 다양한 목적지 지원

- Kinesis Data Firehose는 데이터를 여러 목적지로 전송할 수 있습니다.
- 지원되는 목적지에는 다음이 포함됩니다
	- Amazon Simple Storage Service (S3)
	- Amazon Redshift
	- Amazon OpenSearch Service
	- Amazon OpenSearch Serverless
	- Splunk
	- 맞춤형 HTTP 엔드포인트 및 지원되는 서드 파티 서비스 제공자가 소유한 HTTP 엔드포인트 (Datadog, Dynatrace, LogicMonitor, MongoDB, New Relic, Coralogix, Elastic 등)

<br>

## 2.2 데이터 변환

- Kinesis Data Firehose는 데이터를 목적지로 전송하기 전에 변환할 수 있는 기능을 제공합니다.
- AWS Lambda와 통합하여 데이터를 변환하거나, 민감한 정보를 마스킹하거나, 데이터를 형식화할 수 있습니다.
- 이를 통해 데이터 품질을 향상시키고 분석에 적합한 형태로 데이터를 준비할 수 있습니다.

<br>

## 2.3 자동 스케일링

- Kinesis Data Firehose는 데이터 스트리밍 양에 따라 자동으로 스케일링됩니다.
- 사용자는 데이터의 볼륨에 대해 걱정할 필요 없이 안정적으로 데이터를 전송할 수 있습니다.
- 이를 통해 높은 데이터 볼륨에도 안정적으로 대응할 수 있습니다.

<br>


## 2.4 배치 및 압축

- Kinesis Data Firehose는 데이터를 배치로 묶어 전송할 수 있으며, 데이터를 압축하여 전송할 수도 있습니다.
- 이를 통해 데이터 전송 비용을 절감하고 전송 속도를 향상시킬 수 있습니다. 
- 지원되는 압축 형식으로는 GZIP, ZIP, Snappy 등이 있습니다.

<br>

# 3 주요 개념

- Amazon Kinesis Data Firehose를 처음 사용하기 시작할 때 이해하면 도움이 되는 몇 가지 핵심 개념이 있습니다:

<br>

## 3.1 Firehose 스트림

- Firehose 스트림은 Amazon Data Firehose의 기본 엔터티입니다. 
- Firehose 스트림을 생성하고, 그 스트림에 데이터를 전송하여 사용합니다.

<br>

## 3.2 레코드 (record)

- 레코드는 데이터 프로듀서가 Firehose 스트림으로 보내는 데이터입니다.
- 하나의 레코드는 최대 1,000 KB 크기까지 가능합니다.

<br>

## 3.3 데이터 프로듀서 (data producer)

- 데이터 프로듀서는 Firehose 스트림으로 레코드를 전송하는 주체입니다.
- 예를 들어, 웹 서버가 로그 데이터를 Firehose 스트림으로 전송할 수 있습니다. 
- 또한 기존 Kinesis 데이터 스트림에서 자동으로 데이터를 읽고 목적지로 로드하도록 Firehose 스트림을 구성할 수도 있습니다.

<br>
## 3.4 버퍼 크기 및 버퍼 간격 (buffer size and buffer interval)

- Amazon Data Firehose는 데이터를 목적지로 전달하기 전에 일정 크기 또는 일정 시간 동안 데이터를 버퍼링합니다.
- 버퍼 크기는 MB 단위로, 버퍼 간격은 초 단위로 설정됩니다.

<br>

참고

- https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html