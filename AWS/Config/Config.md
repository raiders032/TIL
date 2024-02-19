# 1 AWS Config

- [레퍼런스](https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html)
- AWS Config는 여러분의 AWS 계정에 있는 AWS 리소스의 구성에 대한 상세한 정보를 제공한다. 
- 이는 리소스 간의 관계뿐만 아니라 과거에 어떻게 구성되었는지에 대한 정보를 포함하여, 시간에 따라 config외 관계가 어떻게 변화하는지 볼 수 있게 한다.
	- AWS 리소스는 AWS에서 작업할 수 있는 개체로, 예를 들어 Amazon Elastic Compute Cloud (EC2) 인스턴스, Amazon Elastic Block Store (EBS) 볼륨, 보안 그룹 또는 Amazon Virtual Private Cloud (VPC)가 있다. 
	- AWS Config에서 지원하는 AWS 리소스의 전체 목록을 보려면 지원되는 리소스 유형을 확인하면 된다.
		- [Supported Resource Types](https://docs.aws.amazon.com/config/latest/developerguide/resource-config-reference.html).
- 이 서비스를 사용하면 S3 버킷과 같은 AWS 리소스에 대한 원하는 구성 상태를 정의할 수 있는 규칙을 설정할 수 있다.
	- AWS Config는 설정된 규칙에 따라 리소스의 구성 변경 사항을 지속적으로 모니터링하고, 원치 않는 변경이 발생했을 때 알림을 받을 수 있도록 한다.

