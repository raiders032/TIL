# 1 AWS Config

- [레퍼런스](https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html)
- AWS Config는 AWS 계정 내의 AWS 리소스 구성에 대한 자세한 뷰를 제공하는 서비스입니다.
- 이를 통해 리소스들이 서로 어떻게 연결되어 있는지, 과거에는 어떻게 구성되었는지 파악할 수 있으며, 시간에 따라 구성과 관계가 어떻게 변하는지 살펴볼 수 있습니다.
- AWS 리소스는 AWS에서 작업할 수 있는 엔티티로, 예를 들어 Amazon Elastic Compute Cloud(EC2) 인스턴스, Amazon Elastic Block Store(EBS) 볼륨, 보안 그룹, Amazon Virtual Private Cloud(VPC) 등이 있습니다. 
	- AWS Config가 지원하는 리소스 유형의 전체 목록을 보려면, AWS Config 지원 리소스 유형 페이지를 참조하시기 바랍니다.
	- [Supported Resource Types](https://docs.aws.amazon.com/config/latest/developerguide/resource-config-reference.html).

<br>

# 2 AWS Config 기능

## 2.1 리소스 관리

- AWS Config 설정 시, 기록하려는 리소스 유형을 지정할 수 있습니다.
- 요청 시 configuration 스냅샷 및 configuration 이력을 받을 Amazon S3 버킷을 설정합니다.
- configuration 스트림 알림을 보내기 위해 Amazon SNS를 설정합니다.
- AWS Config가 Amazon S3 버킷과 Amazon SNS 주제에 접근하는 데 필요한 권한을 부여합니다.

<br>

# 3 AWS Config 규칙을 통한 리소스 평가

- AWS Config를 사용하여 AWS 리소스의 구성 설정을 평가할 수 있습니다.
- 이를 위해 AWS Config 규칙을 생성할 수 있으며, 이 규칙은 이상적인 구성 설정을 나타냅니다.
- AWS Config는 시작을 돕기 위해 사용자 정의가 가능한 사전 정의 규칙인 managed rules을 제공합니다.


<br>

**AWS Config 규칙 작동 방식**

- AWS Config는 리소스 간 구성 변경 사항을 지속적으로 추적하면서 이러한 변경 사항이 규칙의 조건을 준수하는지 여부를 확인합니다. 
- 리소스가 규칙을 준수하지 않으면 AWS Config는 해당 리소스와 규칙을 비준수로 표시합니다.
- AWS Config 규칙의 가능한 평가 결과는 다음과 같습니다
    - **COMPLIANT**: 규칙이 준수 조건을 통과합니다.
    - **NON_COMPLIANT**: 규칙이 준수 조건을 통과하지 못합니다.
    - **ERROR**: 필수 또는 선택적 매개변수가 유효하지 않거나 올바른 유형이 아니거나 형식이 잘못되었습니다.
    - **NOT_APPLICABLE**: 규칙의 논리가 적용될 수 없는 리소스를 필터링하는 데 사용됩니다. 예를 들어, alb-desync-mode-check 규칙은 Application Load Balancer만 검사하고 Network Load Balancer 및 Gateway Load Balancer는 무시합니다.

<br>

**예시**

- 예를 들어, EC2 볼륨이 생성될 때 AWS Config는 해당 볼륨이 암호화되어야 한다는 규칙에 따라 볼륨을 평가할 수 있습니다. 
- 볼륨이 암호화되지 않은 경우 AWS Config는 해당 볼륨과 규칙을 비준수(NON_COMPLIANT)로 표시합니다. 
- AWS Config는 계정 전체 요구 사항에 대해 모든 리소스를 확인할 수도 있습니다.
- 예를 들어, 계정에서 EC2 볼륨의 총 수가 원하는 범위 내에 있는지, 계정에서 AWS CloudTrail을 사용하여 로깅하고 있는지 확인할 수 있습니다.

<br>

참고

- https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config.html