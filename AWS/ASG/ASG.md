# 1 Auto Scaling groups

- [레퍼런스](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-groups.html)
- Amazon EC2는 EC2 인스턴스의 효율적인 관리 및 확장을 위한 기능인 Auto Scaling Group (ASG)를 제공한다.
- Auto Scaling groups이란 EC2 인스턴스의 집합이라고 할 수 있다.

<br>

## 1.1 주요 기능

**Auto Scaling**

- ASG는 확장 및 축소라고 하는 동적 확장 작업을 지원합니다. 
- 이는 변화하는 수요에 맞게 그룹의 EC2 인스턴스 수를 자동으로 조정하여 애플리케이션이 가능한 최저 비용으로 일관된 성능을 유지할 수 있습니다.

<br>

**상태 확인 및 인스턴스 교체**

- ASG는 그룹 내 인스턴스의 상태를 지속적으로 모니터링합니다.
- 인스턴스가 비정상이 되면 ASG는 이를 자동으로 제거하고 새 인스턴스를 시작하여 애플리케이션이 항상 정상적인 하드웨어에서 실행되도록 합니다.

<br>

**AWS 서비스와의 통합**
- ASG는 Elastic Load Balancing(ELB), Amazon CloudWatch 및 AWS Lambda와 같은 다른 AWS 서비스와 원활하게 통합됩니다. 
- 예를 들어, ELB는 들어오는 트래픽을 ASG의 인스턴스 전체에 분산하여 워크로드 분산을 개선할 수 있습니다.

<br>

**Scaling 예약**

- 수요 패턴을 예상하여 Scaling 작업을 예약할 수 있습니다. 
- 예를 들어 업무 시간 동안 인스턴스 수를 늘리고 사용량이 적은 시간에는 축소합니다.

<br>

**비용 관리**

- 스팟 인스턴스 및 예약 인스턴스와 함께 ASG를 사용하면 성능과 가용성을 유지하면서 AWS 청구서를 크게 줄일 수 있습니다.

<br>

# 2 launch templates

- Auto Scaling groups를 사용하면 Scale Out 기능을 사용할 수 있다.
	- Scale Out 할 때 어떤 상태의 EC2 인스턴스를 띄워야 하는지 ASG에게 알려줄 필요가 있다.
	- 이런 경우 launch templates을 작성한다.
- launch templates은 AMI ID, instance type, key pair, security groups, and block device과 같은 정보를 가지고 있다.

<br>

