# 1 Elastic Block Store

- EBS는 사용이 쉽고 확장 가능한 고성능 블록 스토리지 서비스다.
- EC2용으로 설계되었다.
- Amazon EBS를 사용하면 스토리지 볼륨을 만들어 Amazon EC2 인스턴스에 연결할 수 있다.

<br>

## 1.1 volume type

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

# 3 EBS Multi-Attach

- [레퍼런스](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volumes-multi.html)
- 하나의  IOPS SSD (`io1` or `io2`) volume을 같은 AZ에 있는 여러 인스턴스에 부착할 수 있다.
- 모든 연결된 인스턴스에서 데이터를 읽고 쓸 수 있으므로, 여러 인스턴스가 동일한 데이터 세트를 사용하여 작업할 수 있다.
- Multi-Attach를 사용할 때는 동시에 볼륨에 액세스하는 인스턴스들 간에 데이터 일관성을 유지하기 위한 클러스터링 소프트웨어 또는 다른 동기화 메커니즘이 필요하다.
- 현재 이 기능은 io1/io2 볼륨 타입에만 지원되며, 일부 지역에서만 사용 가능할 수 있다.