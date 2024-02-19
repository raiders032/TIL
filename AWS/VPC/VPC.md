# 1 VPC

- 사용자가 정의한 논리적으로 격리된 가상 네트워크에서 AWS 리소스를 시작할 수 있도록 하는 서비스다.
- VPC는 리전의 모든 가용 영역에 적용된다.
- VPC를 생성한 후 각 가용 영역에 하나 이상의 서브넷을 추가할 수 있다. 

<br>

**예시**

![[Pasted image 20231017232957.png]]

- VPC에는 리전의 각 가용성 영역에 하나의 서브넷이 있고, 각 서브넷에 EC2 인스턴스가 있고, VPC의 리소스와 인터넷 간의 통신을 허용하는 인터넷 게이트웨이가 있다.

<br>

## 1.1 기능

* Virtual Private Cloud(VPC)
	* VPC는 자체 데이터 센터에서 운영하는 기존 네트워크와 아주 유사한 가상 네트워크다.
	* VPC를 생성한 후 서브넷을 추가할 수 있다.
* 서브넷
	* 서브넷은 VPC의 IP 주소 범위다.
	* 서브넷을 추가한 후에는 VPC에 AWS 리소스 배포할 수 있다.

<br>

# Network ACL

## Default Network ACL

- 기본 네트워크 ACL은 연결된 서브넷을 드나드는 트래픽 흐름을 모두 허용하도록 구성되어 있다.

**인바운드**

|규칙 #|Type|프로토콜|포트 범위|소스|허용/거부|
|---|---|---|---|---|---|
|100|모든 IPv4 트래픽|모두|모두|0.0.0.0/0|허용|
|*|모든 IPv4 트래픽|모두|모두|0.0.0.0/0|DENY|


**아웃바운드**

| 규칙 # | Type             | 프로토콜 | 포트 범위 | 대상 주소 | 허용/거부 |
| ------ | ---------------- | -------- | --------- | --------- | --------- |
| 100    | 모든 IPv4 트래픽 | 모두     | 모두      | 0.0.0.0/0 | 허용      |
|*|모든 IPv4 트래픽|모두|모두|0.0.0.0/0|DENY|

<br>

# NAT Gateway

- NAT 게이트웨이는 네트워크 주소 변환(Network Address Translation, NAT) 서비스다.
- NAT 게이트웨이를 사용하면 private 서브넷에 있는 인스턴스들이 VPC 외부의 서비스에 연결할 수 있다
	- 하지만 외부 서비스는 해당 인스턴스들과 연결을 시작할 수 없다.

<br>

# VPC endpoints

- [레퍼런스](https://docs.aws.amazon.com/whitepapers/latest/aws-privatelink/what-are-vpc-endpoints.html)
- VPC endpoints를 사용하면 AWS 서비스에 사설로 연결이 가능하다.
	- 즉  Amazon VPC와 서비스 간의 트래픽은 Amazon 네트워크를 떠나지 않는다.
- Amazon의 private한 네트워크안에서 통신이 이루어지기 때문에 public IP 주소가 필요하지 않다.
- VPC endpoints의 종류는 아래와 같이 두 가지가 있다.
	- interface endpoints
	- gateway endpoints

<br>

## interface endpoints

## gateway endpoints

