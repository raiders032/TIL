# 1 Elastic Block Store

- Amazon Elastic Block Store(EBS)는 Amazon EC2 인스턴스와 함께 사용하도록 특별히 설계된 사용자 친화적이고 확장 가능한 고성능 블록 스토리지 서비스입니다.
- Amazon EBS를 사용하면 스토리지 볼륨을 만들어 Amazon EC2 인스턴스에 연결할 수 있다.

<br>

## 1.1 volume type

- Amazon EBS는 다양한 스토리지 요구 사항을 충족하기 위해 다양한 볼륨 유형을 제공합니다.
- `gp2` and `gp3`
	- 일반적인 용도의 SSD
	- 균형적인 비용과 성능
- `io1` and `io2`
	- 높은 성능의 SSD
	- 미션 크리티컬하거나 낮은 레이턴시가 필요한 경우에 적합하다.
- st1
	- 비용이 저럼한 HDD
	- boot volumes으로는 사용할 수 없다.
- sc1
	- 비용이 가장 저렴한 HDD
	- boot volumes으로는 사용할 수 없다.

<br>

# 2 Snapshot

- Amazon EBS는 볼륨의 특정 시점 스냅샷을 Amazon S3에 저장할 수 있다.
- Amazon EBS 스냅샷은 증분 방식으로 저장된다.
	- 즉, 마지막 스냅샷을 저장한 이후에 변경된 블록만 저장된다.
	- 변경된 블록에 해당하는 비용만 청구된다.
- 스냅샷은 새로운 여러 볼륨을 인스턴스화하고, 볼륨의 크기를 확대하거나, 가용 영역 간에 볼륨을 이동하는 데 사용할 수 있다.

<br>

## 2.1 Fast SnapShot Restore

- Amazon EBS는 Fast Snapshot Restore(FSR) 기능을 통해 스냅샷에서 EBS 볼륨을 복원할 때 초기화 시간을 대폭 줄일 수 있습니다.
- 이 기능은 스냅샷에서 새로운 EBS 볼륨을 생성할 때 발생할 수 있는 성능 오버헤드를 최소화합니다.
- FSR 기능을 사용할 때는 추가 비용이 발생할 수 있으므로, 비용과 이점을 고려하여 사용 여부를 결정해야 합니다.
- 이점
	- **즉각적인 볼륨 성능 제공**: FSR을 활성화하면, 스냅샷에서 생성된 볼륨이 즉시 전체 성능을 발휘할 수 있습니다. 이는 스냅샷 데이터의 볼륨 초기화 없이도 가능합니다.
	- **대량 복원 작업 가속화**: 대규모 데이터 복구 또는 클론 작업을 수행할 때 특히 유용합니다. 여러 볼륨을 동시에 빠르게 복원하여 작업 시간을 단축할 수 있습니다.
	- **준비 시간 최소화**: 테스트 환경, 데이터 분석, 또는 백업에서 복구와 같은 작업을 위해, 볼륨의 준비 시간을 거의 없애어 프로젝트 시간을 단축합니다.

<br>

# 3 EBS Multi-Attach

- [레퍼런스](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volumes-multi.html)
- 하나의  IOPS SSD (`io1` or `io2`) volume을 같은 AZ에 있는 여러 인스턴스에 부착할 수 있다.
- 모든 연결된 인스턴스에서 데이터를 읽고 쓸 수 있으므로, 여러 인스턴스가 동일한 데이터 세트를 사용하여 작업할 수 있다.
- Multi-Attach를 사용할 때는 동시에 볼륨에 액세스하는 인스턴스들 간에 데이터 일관성을 유지하기 위한 클러스터링 소프트웨어 또는 다른 동기화 메커니즘이 필요하다.
- 현재 이 기능은 io1/io2 볼륨 타입에만 지원되며, 일부 지역에서만 사용 가능할 수 있다.