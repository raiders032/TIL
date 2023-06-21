# 1 ImagePullBackOff

- kubelet이 container runtime을 이용해 pod를 위한 container를 생성할 때 `ImagePullBackOff`가 발생할 수 있다.
- ImagePullBackOff 상태는 container image를 가져오지 못해 container를 실행하지 못하는 것을 의미한다.
- 이런 상황이 발생하면 Kubernetes는 시간 간격을 두어 container image를 가져오는 시도를 한다.



# 2 원인

1. 이미지 또는 태그가 존재하지 않는다.
2. 이미지 또는 태그에 오타가 존재한다.
3. private 이미지 레지스트리에서 imagePullSecret 없이 이미지를 불러왔다.
4. 이미지 레지스트리의 다운로드 제한을 넘겼다.



# 3 원인 파악

- 더 자세한 원인을 파악하기 위해 연관된 노드의 kubelet의 로그를 확인하자.
- `journalctl -u kubelet -r`



참고

- https://www.tutorialworks.com/kubernetes-imagepullbackoff/