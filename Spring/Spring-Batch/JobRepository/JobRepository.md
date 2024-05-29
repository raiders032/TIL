# 1 JobRepository

- Spring Batch는 엔터프라이즈급 배치 처리를 위한 강력하고 유연한 프레임워크입니다.
- 배치 작업의 실행 정보를 효과적으로 관리하고 추적하는 것은 매우 중요한데, 이를 위해 Spring Batch에서는 JobRepository를 제공합니다.
- 이 글에서는 JobRepository의 역할, 구성 요소, 설정 방법 등에 대해 자세히 살펴보겠습니다.

<br>

# 2 JobRepository의 역할

- JobRepository는 배치 작업의 실행에 관한 모든 정보를 저장하고 관리하는 역할을 담당합니다.

<br>

**주요 기능**

- Job 및 Step 실행 정보 저장
	- JobRepository는 JobExecution, StepExecution 등의 객체를 생성하고 관련 정보를 데이터베이스에 저장합니다.
	- 이를 통해 배치 작업의 실행 상태, 시작/종료 시간, 처리한 레코드 수 등을 추적할 수 있습니다.
- ExecutionContext 관리
	- ExecutionContext는 Job이나 Step의 실행 중 상태 정보를 저장하는 데 사용됩니다.
	- JobRepository는 이러한 ExecutionContext를 데이터베이스에 저장하고 필요할 때 조회할 수 있도록 합니다.
- 재시작 지원
	- JobRepository에 저장된 실행 정보를 바탕으로 실패한 배치 작업을 재시작할 수 있습니다.
	- 이때 이전 실행에서 성공한 Step은 건너뛰고, 실패한 Step부터 다시 시작할 수 있습니다.

<br>

# 3 JobRepository의 구성 요소

- JobRepository는 다음과 같은 주요 구성 요소로 이루어져 있습니다:

<br>

## 3.1 JobInstance

- 배치 Job의 논리적 실행 단위로, Job의 이름과 JobParameters의 조합으로 식별됩니다. 
- 동일한 JobInstance에 대해 여러 번의 JobExecution이 존재할 수 있습니다.

<br>

## 3.2 JobExecution:

- Job의 물리적 실행 단위로, 특정 시점에 실행된 Job의 상태 정보를 나타냅니다. 
- JobInstance와 생성 시간으로 식별되며, 시작/종료 시간, 상태, ExitStatus 등의 정보를 포함합니다.

<br>

## 3.3 StepExecution

- Step의 물리적 실행 단위로, 특정 JobExecution 내에서 실행된 Step의 상태 정보를 나타냅니다. 
- StepExecution은 JobExecution과 Step 이름으로 식별되며, 시작/종료 시간, 상태, commit count, rollback count 등의 정보를 포함합니다.

<br>

## 3.4 ExecutionContext

- Job 또는 Step 실행 중 필요한 상태 정보를 저장하는 Key-Value 형태의 데이터 구조입니다.
- JobExecution과 StepExecution은 각각 고유한 ExecutionContext를 가지고 있어, 실행 중 상태를 유지하고 재시작 시 이를 활용할 수 있습니다.