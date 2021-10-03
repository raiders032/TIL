# Kubectl 자동 완성

#### BASH

```bash
source <(kubectl completion bash) # bash-completion 패키지를 먼저 설치한 후, bash의 자동 완성을 현재 셸에 설정한다
echo "source <(kubectl completion bash)" >> ~/.bashrc # 자동 완성을 bash 셸에 영구적으로 추가한다
```

#### ZSH

```bash
source <(kubectl completion zsh)  # 현재 셸에 zsh의 자동 완성 설정
echo "[[ $commands[kubectl] ]] && source <(kubectl completion zsh)" >> ~/.zshrc # 자동 완성을 zsh 셸에 영구적으로 추가한다.
```



# kubectl apply

> `apply`는 쿠버네티스 리소스를 정의하는 파일을 통해 애플리케이션을 관리한다. `kubectl apply`를 실행하여 클러스터에 리소스를 생성하고 업데이트한다. 이것은 프로덕션 환경에서 쿠버네티스 애플리케이션을 관리할 때 권장된다.

* 쿠버네티스 매니페스트는 JSON이나 YAML로 정의된다.
* 파일 확장자는 `.yaml` , `.yml`, `.json` 이 사용된다.

```shell
# 리소스 생성
kubectl apply -f ./my-manifest.yaml            
```



# kubectl describe

> 생성된 리소스의 자세한 정보를 확인할 수 있다

```bash
# my-nginx-pod의 자세한 정보 조회하기
kubectl describe pods my-nginx-pod
```



# kubectl get

> 간단한 정보를 확인할 수 있다

```shell
# 네임스페이스 내 모든 파드의 목록 조회
kubectl get pods
kubectl get po

# 모든 네임스페이스 내 모든 파드의 목록 조회
kubectl get pods --all-namespaces

# kube-system 네임스페이스 내 모든 파드의 목록 조회
kubectl get pod -n kube-system

# 해당하는 네임스페이스 내 모든 파드의 상세 목록 조회
kubectl get pods -o wide

# 네임스페이스 내 모든 서비스의 목록 조회
kubectl get services
kubectl get svc
```



# kubectl edit

```bash
kubectl edit pod redis
```



# kubectl scale

```bash
# 'foo'라는 레플리카셋을 3으로 스케일
kubectl scale --replicas=3 rs/foo

# 'foo'라는 deployment를 1으로 스케일
kubectl scale --replicas=1 deployment foo

# "foo.yaml"에 지정된 리소스의 크기를 3으로 스케일
kubectl scale --replicas=3 -f foo.yaml                          
```



# kubectl set

```shell
# "frontend" 디플로이먼트의 "www" 컨테이너 이미지를 업데이트하는 롤링 업데이트
kubectl set image deployment/frontend www=image:v2

# "my-nginx-depolyment" deployment의 "nginx"라는 이름을 가지는 컨테이너의 이미지를 "nginx:1.11"로 변경
kubectl set image deployment my-nginx-deployment nginx=nginx:1.11 --record
```



# kubectl rollout

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



# kubectl run

```bash
# Start a nginx pod.
kubectl run nginx --image=nginx
```



# kubectl expose

```bash
kubectl expose deployment http-go --port=8080 --target-port=8080 --type=LoadBalancer
```



# kubectl exec

```shell
# 기존 파드에서 명령 실행(한 개 컨테이너 경우)
kubectl exec my-pod -- ls /   
```



# kubectl delete

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



# kubectl logs

> pod의 로그를 확인할 수 있다

```bash
# 파드 로그 덤프 (stdout)
kubectl logs my-pod                   
```



참고

* https://kubernetes.io/ko/docs/reference/kubectl/cheatsheet/