### Kubectl 자동 완성

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



### Kubectl apply

### kubectl get

### kubectl describe

### kubectl set

```shell
# "frontend" 디플로이먼트의 "www" 컨테이너 이미지를 업데이트하는 롤링 업데이트
kubectl set image deployment/frontend www=image:v2 
```



### kubectl rollout

```shell
# 완료될 때까지 "frontend" 디플로이먼트의 롤링 업데이트 상태를 감시
kubectl rollout status -w deployment/frontend   

# 이전 디플로이먼트로 롤백
kubectl rollout undo deployment/frontend

# 현 리비전을 포함한 디플로이먼트의 이력을 체크
kubectl rollout history deployment/frontend
kubectl rollout history deployment/first-app --revision=1

# 특정 리비전으로 롤백
kubectl rollout undo deployment/frontend --to-revision=2         
```



### kubectl expose

### kubectl delete

### kubectl logs