# 1 Job

- [레퍼런스](https://kubernetes.io/docs/concepts/workloads/controllers/job/)
- 쿠버네티스에서 일회성 작업을 처리하는 가장 효율적인 방법은 '잡(Job)'을 사용하는 것입니다. 
- 잡은 한 번 실행되고 종료되는 태스크를 위해 설계된 쿠버네티스 리소스로, 배치 처리, 데이터 마이그레이션, 백업과 같은 작업에 적합합니다.

<br>

## 1.1 Job의 특징

- **일회성 작업**: 잡은 지정된 작업을 수행한 후 종료되는 파드(Pod)를 생성합니다.
- **재시도 메커니즘**: 실패한 작업의 경우, 잡은 설정에 따라 작업을 재시도할 수 있습니다.
- **병렬 실행 지원**: 여러 파드를 동시에 실행하여 작업을 병렬로 처리할 수 있습니다.

<br>

## 1.2 Job 리소스 정의

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi
spec:
  template:
    spec:
      containers:
      - name: pi
        image: perl:5.34.0
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
  backoffLimit: 4
```

```bash
kubectl apply -f https://kubernetes.io/examples/controllers/job.yaml
```

```bash
Name:           pi
Namespace:      default
Selector:       batch.kubernetes.io/controller-uid=c9948307-e56d-4b5d-8302-ae2d7b7da67c
Labels:         batch.kubernetes.io/controller-uid=c9948307-e56d-4b5d-8302-ae2d7b7da67c
                batch.kubernetes.io/job-name=pi
                ...
Annotations:    batch.kubernetes.io/job-tracking: ""
Parallelism:    1
Completions:    1
Start Time:     Mon, 02 Dec 2019 15:20:11 +0200
Completed At:   Mon, 02 Dec 2019 15:21:16 +0200
Duration:       65s
Pods Statuses:  0 Running / 1 Succeeded / 0 Failed
Pod Template:
  Labels:  batch.kubernetes.io/controller-uid=c9948307-e56d-4b5d-8302-ae2d7b7da67c
           batch.kubernetes.io/job-name=pi
  Containers:
   pi:
    Image:      perl:5.34.0
    Port:       <none>
    Host Port:  <none>
    Command:
      perl
      -Mbignum=bpi
      -wle
      print bpi(2000)
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Events:
  Type    Reason            Age   From            Message
  ----    ------            ----  ----            -------
  Normal  SuccessfulCreate  21s   job-controller  Created pod: pi-xf9p4
  Normal  Completed         18s   job-controller  Job completed
```

<br>

# 2 여러 파드 실행

- 잡은 두개 이상의 파드 인스턴스를 생성해 병렬 또는 순차적으로 실행할 수 있다.
	- `spec.completions`, `spec.parallelism` 설정을 통해 조절할 수 있다.

<br>

## 2.1 잡을 두 번 이상 실행

- 잡을 두 번 이상 실행해야 하는 경우 `spec.completions`를 설정하면 된다.
- spec.completions만큼의 성공적인 파드가 있을 때 잡이 완료된다.

<br>

## 2.2 병렬 실행

- `.spec.parallelism`을 명시하지 않으면 기본 값은 1이다.
- `.spec.parallelism`을 0으로 지정하면 실질적으로 다시 올리기 전까지 잡이 중단된다

<br>

# 3 실패 핸들링

- "파드 내의 컨테이너는 여러 이유로 실패할 수 있습니다. 
- 예를 들어, 그 안의 프로세스가 0이 아닌 종료 코드로 종료되거나, 메모리 제한을 초과하여 컨테이너가 종료되는 경우 등이 있습니다. 
- 이런 상황이 발생하고 .spec.template.spec.restartPolicy가 'OnFailure'로 설정되어 있다면, 파드는 노드에 그대로 남아 있지만 컨테이너는 다시 실행됩니다. 

<br>

# 4 시간 제한하기

- **`activeDeadlineSeconds`**: 잡의 실행 시간을 제한합니다. 이 값이 설정되면, 잡은 지정된 시간 내에 완료되어야 합니다.
- **시간 초과 처리**: 설정된 시간을 초과하면 잡은 실패로 마크되고, 모든 파드는 종료됩니다.