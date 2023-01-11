# Kubectl 자동 완성

## BASH

```bash
source <(kubectl completion bash) # bash-completion 패키지를 먼저 설치한 후, bash의 자동 완성을 현재 셸에 설정한다
echo "source <(kubectl completion bash)" >> ~/.bashrc # 자동 완성을 bash 셸에 영구적으로 추가한다
```

## ZSH

```bash
source <(kubectl completion zsh)  # 현재 셸에 zsh의 자동 완성 설정
echo "[[ $commands[kubectl] ]] && source <(kubectl completion zsh)" >> ~/.zshrc # 자동 완성을 zsh 셸에 영구적으로 추가한다.
```

 

# Basic

## kubectl create

- [레퍼런스](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#create)



**deployment**

```bash
# Usage
kubectl create deployment NAME --image=image -- [COMMAND] [args...]

# Create a deployment named my-dep that runs the nginx image with 3 replicas
kubectl create deployment my-dep --image=nginx --replicas=3

# Create a deployment named my-dep that runs the busybox image and expose port 5701
kubectl create deployment my-dep --image=busybox --port=5701
```



**namespace**

```bash
# Usage
kubectl create namespace NAME [--dry-run=server|client|none]

# Create a new namespace named my-namespace
kubectl create namespace my-namespace
```





## kubectl get

> 간단한 정보를 확인할 수 있다

```shell
# 네임스페이스 내 모든 파드의 목록 조회
kubectl get pods
kubectl get po

# 라벨과 함께 파드 목록 조회
kubectl get pods --show-labels

# 모든 네임스페이스 내 모든 파드의 목록 조회
kubectl get pods --all-namespaces

# kube-system 네임스페이스 내 모든 파드의 목록 조회
kubectl get pod -n kube-system

# 해당하는 네임스페이스 내 모든 파드의 상세 목록 조회
kubectl get pods -o wide

# 네임스페이스 내 모든 서비스의 목록 조회
kubectl get services
kubectl get svc

kubectl get pod --all-namespaces
```



## kubectl run

- 특정 이미지를 파드로 실행함
- [레퍼런스](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#run)

**Usage**

```bash
$ kubectl run NAME --image=image [--env="key=value"] [--port=port] [--dry-run=server|client] [--overrides=inline-json] [--command] -- [COMMAND] [args...]
```

```bash
# Start a hazelcast pod and let the container expose port 5701
kubectl run hazelcast --image=hazelcast/hazelcast --port=5701

# Dry run; print the corresponding API objects without creating them
kubectl run nginx --image=nginx --dry-run=client

# Start the nginx pod using the default command, but use custom arguments (arg1 .. argN) for that command
kubectl run nginx --image=nginx -- <arg1> <arg2> ... <argN>

# Start the nginx pod using a different command and custom arguments
kubectl run nginx --image=nginx --command -- <cmd> <arg1> ... <argN
```



## kubectl expose

- [레퍼런스](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#expose)

**Usage**

```bash
$ kubectl expose (-f FILENAME | TYPE NAME) [--port=port] [--protocol=TCP|UDP|SCTP] [--target-port=number-or-name] [--name=name] [--external-ip=external-ip-of-service] [--type=type]
```

```bash
kubectl expose deployment http-go --port=8080 --target-port=8080 --type=LoadBalancer

# Create a service for a pod valid-pod, which serves on port 444 with the name "frontend"
kubectl expose pod valid-pod --port=444 --name=frontend

# Create a service for a replicated nginx using replica set, which serves on port 80 and connects to the containers on port 8000
kubectl expose rs nginx --port=80 --target-port=8000

# Create a service for an nginx deployment, which serves on port 80 and connects to the containers on port 8000
kubectl expose deployment nginx --port=80 --target-port=8000
```



## kubectl delete

```shell
# webapp pod 삭제
kubectl delete pod webapp

# name=myLabel 라벨을 가진 파드와 서비스 삭제
kubectl delete pods,services -l name=myLabel

# deployment.yaml과 service.yaml 설정 파일을 사용하여 리소스 삭제
kubectl delete -f deployment.yaml -f service.yaml

# "production" 네임스페이스 삭제 (네임스페이스 삭제 시 네임스페이스에 존재하는 모든 리소스 또한 삭제된다)
kubectl delete namespace production
```



# APP Management



## kubectl apply

> `apply`는 쿠버네티스 리소스를 정의하는 파일을 통해 애플리케이션을 관리한다. `kubectl apply`를 실행하여 클러스터에 리소스를 생성하고 업데이트한다. 이것은 프로덕션 환경에서 쿠버네티스 애플리케이션을 관리할 때 권장된다.

* 쿠버네티스 매니페스트는 JSON이나 YAML로 정의된다.
* 파일 확장자는 `.yaml` , `.yml`, `.json` 이 사용된다.

```shell
# 리소스 생성
kubectl apply -f ./my-manifest.yaml            
```



## kubectl edit

```bash
kubectl edit pod redis
```



## kubectl label

```bash
# new-label=awesome 라벨 추가
kubectl label pods my-pod new-label=awesome

# new-label=awesome 라벨 삭제
kubectl label pods my-pod new-label-
```



## kubectl rollout

```shell
# 완료될 때까지 "frontend" 디플로이먼트의 롤링 업데이트 상태를 감시
kubectl rollout status -w deployment/frontend   

# 이전 디플로이먼트로 롤백
kubectl rollout undo deployment/frontend

# 현 리비전을 포함한 디플로이먼트의 이력을 체크
kubectl rollout history deployment/frontendkubectl rollout history deployment/first-app --revision=1

# 특정 리비전으로 롤백
kubectl rollout undo deployment/frontend --to-revision=2         
```



## kubectl scale

```bash
# 'foo'라는 레플리카셋을 3으로 스케일
kubectl scale --replicas=3 rs/foo

# 'foo'라는 deployment를 1으로 스케일
kubectl scale --replicas=1 deployment foo

# "foo.yaml"에 지정된 리소스의 크기를 3으로 스케일
kubectl scale --replicas=3 -f foo.yaml                          
```



## kubectl set

- [레퍼런스](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#set)

```shell
# "frontend" 디플로이먼트의 "www" 컨테이너 이미지를 업데이트하는 롤링 업데이트
kubectl set image deployment/frontend www=image:v2

# "my-nginx-depolyment" deployment의 "nginx"라는 이름을 가지는 컨테이너의 이미지를 "nginx:1.11"로 변경
kubectl set image deployment my-nginx-deployment nginx=nginx:1.11 --record

# Update deployment 'registry' with a new environment variable
kubectl set env deployment/registry STORAGE_DIR=/local
```



# Working with apps



## kubectl describe

> 생성된 리소스의 자세한 정보를 확인할 수 있다

```bash
# my-nginx-pod의 자세한 정보 조회하기
kubectl describe pods my-nginx-pod
```



## kubectl exec

- Execute a command in a container.
- [레퍼런스](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#exec)



**Usage**

```
$ kubectl exec (POD | TYPE/NAME) [-c CONTAINER] [flags] -- COMMAND [args...]
```

```shell
# Get output from running the 'date' command from pod mypod, using the first container by default
kubectl exec mypod -- date

# Get output from running the 'date' command in ruby-container from pod mypod
kubectl exec mypod -c ruby-container -- date

# Switch to raw terminal mode; sends stdin to 'bash' in ruby-container from pod mypod # and sends stdout/stderr from 'bash' back to the client
kubectl exec mypod -c ruby-container -i -t -- bash -il
```



## kubectl logs

- [레퍼런스](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#logs)

> pod의 로그를 확인할 수 있다

```bash
# 파드 로그 덤프 (stdout)
kubectl logs my-pod

# 이전 켄테이너 로그 확인
kubectl logs my-pod --previous

# Return snapshot logs from pod nginx with multi containers
kubectl logs nginx --all-containers=true

# Begin streaming the logs of the ruby container in pod web-1
kubectl logs -f -c ruby web-1

# Display only the most recent 20 lines of output in pod nginx
kubectl logs --tail=20 nginx

# Show all logs from pod nginx written in the last hour
kubectl logs --since=1h nginx
```



# Cluster Management

- [레퍼런스](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#-strong-cluster-management-strong-)



## kubectl cordon

- Mark node as unschedulable.

**Usage**

```bash
$ kubectl cordon NODE
```



## kubectl drain

- [레퍼런스](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#drain)
- 노드를 비우고 노드를 unschedulable로 표시한다.

**Usage**

```bash
$ kubectl drain NODE
```

```bash
#Drain node "foo", even if there are pods not managed by a replication controller, replica set, job, daemon set or stateful set on it
kubectl drain foo --force

#As above, but abort if there are pods not managed by a replication controller, replica set, job, daemon set or stateful set, and use a grace period of 15 minutes
kubectl drain foo --grace-period=900
```



**Flags**

| Name                         | Shorthand | Default | Usage                                                        |
| :--------------------------- | :-------- | :------ | :----------------------------------------------------------- |
| chunk-size                   |           | 500     | Return large lists in chunks rather than all at once. Pass 0 to disable. This flag is beta and may change in the future. |
| delete-emptydir-data         |           | false   | Continue even if there are pods using emptyDir (local data that will be deleted when the node is drained). |
| delete-local-data            |           | false   | Continue even if there are pods using emptyDir (local data that will be deleted when the node is drained). |
| disable-eviction             |           | false   | Force drain to use delete, even if eviction is supported. This will bypass checking PodDisruptionBudgets, use with caution. |
| dry-run                      |           | none    | Must be "none", "server", or "client". If client strategy, only print the object that would be sent, without sending it. If server strategy, submit server-side request without persisting the resource. |
| force                        |           | false   | Continue even if there are pods that do not declare a controller. |
| grace-period                 |           | -1      | Period of time in seconds given to each pod to terminate gracefully. If negative, the default value specified in the pod will be used. |
| ignore-daemonsets            |           | false   | Ignore DaemonSet-managed pods.                               |
| pod-selector                 |           |         | Label selector to filter pods on the node                    |
| selector                     | l         |         | Selector (label query) to filter on, supports '=', '==', and '!='.(e.g. -l key1=value1,key2=value2). Matching objects must satisfy all of the specified label constraints. |
| skip-wait-for-delete-timeout |           | 0       | If pod DeletionTimestamp older than N seconds, skip waiting for the pod. Seconds must be greater than 0 to skip. |
| timeout                      |           | 0s      | The length of time to wait before giving up, zero means infinite |



## kubectl taint

- [레퍼런스](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#taint)

**Usage**

```bash
$ kubectl taint NODE NAME KEY_1=VAL_1:TAINT_EFFECT_1 ... KEY_N=VAL_N:TAINT_EFFECT_N
```



```bash
#Update node 'foo' with a taint with key 'dedicated' and value 'special-user' and effect 'NoSchedule' # If a taint with that key and effect already exists, its value is replaced as specified
kubectl taint nodes foo dedicated=special-user:NoSchedule

# remove from node 'foo' the taint with key 'dedicated' and effect 'NoSchedule' if one exists
kubectl taint nodes foo dedicated:NoSchedule-
```



## kubectl uncordon

- Mark node as schedulable.

**Usage**

```yaml
$ kubectl uncordon NODE
```



# KUBECTL SETTINGS AND USAGE



## kubectl explain

- 리소스의 필드 목록을 보여준다.

- [레퍼런스](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#explain)



**USAGE**

```bash
kubectl explain RESOURCE
```

```bash
#Get the documentation of the resource and its fields
$kubectl explain pods
KIND:     Pod
VERSION:  v1

DESCRIPTION:
     Pod is a collection of containers that can run on a host. This resource is
     created by clients and scheduled onto hosts.

FIELDS:
   apiVersion	<string>
     APIVersion defines the versioned schema of this representation of an
     object. Servers should convert recognized schemas to the latest internal
     value, and may reject unrecognized values. More info:
     https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

   kind	<string>
     Kind is a string value representing the REST resource this object
     represents. Servers may infer this from the endpoint the client submits
     requests to. Cannot be updated. In CamelCase. More info:
     https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

   metadata	<Object>
     Standard object's metadata. More info:
     https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

   spec	<Object>
     Specification of the desired behavior of the pod. More info:
     https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

   status	<Object>
     Most recently observed status of the pod. This data may not be up to date.
     Populated by the system. Read-only. More info:
     https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
     
# Get the documentation of a specific field of a resource
kubectl explain pods.spec.containers
```



참고

* https://kubernetes.io/ko/docs/reference/kubectl/cheatsheet/
* https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#-strong-getting-started-strong-