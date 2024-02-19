# 1 Auto Scaling groups

- [레퍼런스](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-groups.html)
- Amazon EC2는 EC2 인스턴스의 효율적인 관리 및 확장을 위한 기능인 Auto Scaling Group (ASG)를 제공한다.
- Auto Scaling groups이란 EC2 인스턴스의 집합이라고 할 수 있다.

<br>

## 1.1 주요 기능

- Auto Scaling groups을 통해 Scale Out과 Scale In을 지원한다.
	- 수요에 따라 자동으로 Auto Scaling groups에 EC2 인스턴스를 추가하거나 제거한다.
- Health Check
	- 그룹 내 인스턴스에 주기적인 Health 체크를 수행하여 이 EC2 인스턴스의 수를 유지한다.
	- 인스턴스가 비정상적이면 비정상 인스턴스를 종료하고 다른 인스턴스로 대체한다.

<br>

# 2 launch templates

- Auto Scaling groups를 사용하면 Scale Out 기능을 사용할 수 있다.
	- Scale Out 할 때 어떤 상태의 EC2 인스턴스를 띄워야 하는지 ASG에게 알려줄 필요가 있다.
	- 이런 경우 launch templates을 작성한다.
- launch templates은 AMI ID, instance type, key pair, security groups, and block device과 같은 정보를 가지고 있다.

<br>

