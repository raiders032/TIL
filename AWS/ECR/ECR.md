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

<br>

# 2 Lifecycle Policy

-   라이프사이클 정책(Lifecycle Policy)은 ECR 리포지토리 내의 이미지를 자동으로 관리하고 정리하는 데 사용될 수 있어 비용 절감과 저장소 효율성을 향상시킬 수 있습니다.
- 이 정책을 통해 불필요하게 오래된 이미지나 사용하지 않는 이미지 버전을 자동으로 삭제하여 저장 공간을 확보하고 비용을 절약할 수 있습니다.

<br>

## 2.1 Lifecycle Policy의 주요 사용 사례

### 2.1.1 오래된 이미지 자동 삭제

- **정책 설정**: 특정 기간이 지난 이미지(예: 30일, 60일, 90일 후)를 자동으로 삭제하도록 라이프사이클 정책을 설정할 수 있습니다. 이는 개발 또는 테스트 중 생성된 오래된 이미지가 자동으로 정리되도록 보장합니다.

<br>

### 2.1.2 태그되지 않은 이미지 삭제

- **정책 적용**: 프로덕션 또는 중요하지 않은 태그가 없는 이미지를 자동으로 삭제하도록 정책을 설정합니다. 이러한 태그되지 않은 이미지는 종종 개발 과정에서 임시로 생성되며, 필요 없어진 후에는 저장소를 차지하기만 합니다.

<br>

### 2.1.3 특정 태그 유지

- **버전 관리**: 프로덕션 환경에서 사용되는 중요한 이미지 태그(예: 최신, 안정적, 또는 버전 번호)는 유지되도록 정책을 구성할 수 있습니다. 이는 중요한 이미지가 실수로 삭제되지 않도록 보호합니다.

<br>

## 2.4 비용 절감 전략

- **저장 공간 최적화**: 불필요한 이미지를 정기적으로 삭제함으로써 저장 공간을 최적화하고, ECR에 대한 비용을 절감할 수 있습니다.
- **데이터 전송 비용 관리**: 필요 없는 이미지를 자동으로 삭제함으로써, 이러한 이미지를 다운로드하는 데 발생할 수 있는 추가 데이터 전송 비용을 줄일 수 있습니다.

<br>

## 2.5 라이프사이클 정책 설정 방법

1. **ECR 리포지토리로 이동**: AWS 관리 콘솔에서 ECR 리포지토리를 선택합니다.
2. **라이프사이클 정책 생성**: 'Lifecycle Policies' 탭에서 'Create' 버튼을 클릭하여 새로운 라이프사이클 정책을 생성합니다.
3. **정책 규칙 정의**: 필요에 따라 JSON 형식으로 정책 규칙을 작성하고, 'Save' 버튼을 클릭하여 정책을 저장합니다.

<br>

**예시**
```json
{
  "rules": [
    {
      "rulePriority": 1,
      "description": "이미지를 1일 후 삭제",
      "selection": {
        "tagStatus": "any",
        "countType": "sinceImagePushed",
        "countUnit": "days",
        "countNumber": 1
      },
      "action": {
        "type": "expire"
      }
    }
  ]
}
```

```json
{
  "rules": [
    {
      "rulePriority": 3,
      "description": "Delete images tagged as 'beta' or 'alpha' that are older than 90 days",
      "selection": {
        "tagStatus": "tagged",
        "tagPrefixList": ["beta", "alpha"],
        "countType": "sinceImagePushed",
        "countUnit": "days",
        "countNumber": 90
      },
      "action": {
        "type": "expire"
      }
    }
  ]
}
```