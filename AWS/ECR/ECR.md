# 1 Amazon Elastic Container Registry(ECR)

- Amazon Elastic Container Registry(ECR)는 AWS 클라우드에서 Docker 컨테이너 이미지를 쉽게 저장, 관리 및 배포할 수 있는 완전관리형 Docker 컨테이너 레지스트리 서비스입니다.
- 개발자는 ECR을 사용하여 컨테이너 이미지를 안전하게 저장하고, 이미지에 대한 버전 관리를 수행하며, 이미지를 다양한 AWS 서비스와 쉽게 통합할 수 있습니다.

<br>

## 1.1 Amazon ECR의 주요 특징

- 높은 확장성과 내구성
	- Amazon ECR은 AWS의 높은 확장성과 내구성을 바탕으로 대규모 컨테이너 이미지 저장소를 지원합니다.
- 안전한 이미지 저장
	- ECR은 AWS Identity and Access Management(IAM)을 사용하여 컨테이너 이미지에 대한 액세스를 제어합니다. 
	- 이를 통해 특정 사용자나 서비스만 이미지에 액세스할 수 있도록 설정할 수 있습니다.
- 간편한 통합
	- ECR은 Amazon ECS 및 Amazon Elastic Kubernetes Service(EKS)와 같은 AWS의 컨테이너 서비스와 밀접하게 통합되어 있어 컨테이너 이미지를 쉽게 배포하고 관리할 수 있습니다.
- 빠른 이미지 검색 및 배포
	- ECR은 컨테이너 이미지를 빠르게 검색하고 배포할 수 있는 강력한 API를 제공합니다. 
	- 이를 통해 개발 및 배포 프로세스를 간소화할 수 있습니다.
- 비용 효율성
	- ECR은 저장된 데이터의 양과 전송된 데이터의 양에 따라 비용이 청구되므로 사용한 만큼만 비용을 지불합니다.