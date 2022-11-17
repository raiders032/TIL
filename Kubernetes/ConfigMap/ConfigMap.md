# 1 ConfigMap

- `ConfigMap`은 키 밸류 쌍을 저장할 수 있는 오브젝트다
- 파드는 `ConfigMap`의 키 밸류 쌍을 환경변수, 커맨드 라인 아규먼트, 컨피그 파일로 사용한다.
- 보안이 필요한 키 밸류 쌍의 경우 `ConfigMap` 보다 `Secret`을 사용하는 것이 좋다.



## 1.1 ConfigMap의 용도

- 애플리케이션 구성의 요점은 환경에 따라 다르거나 자주 변경되는 설정 옵션을 애플리케이션 소스 코드와 별도로 유지하는 것이다.
- 환경 설정(환경변수, 커맨드 라인 아규먼트, 컨피그 파일)을 컨테이너로 부터 분리해 ConfigMap이라는 중앙 집중화 된 장소에 관리할 수 있다.
- ConfigMap의 밸류를 변경하면 이를 참조하는 모든 컨테이너에 동시에 적용되어 관리가 용이하다.



# 2 Configmap 생성

## 2.1 Imperative 방식

```bash
kubectl create configmap fortune-config --from-literal=bar=baz --from-literal=one=two
```



컨피그맵의 yaml 정의를 출력해보자

```bash
kubectl create configmap fortune-config --from-literal=bar=baz --from-literal=one=two --dry-run=client -o yaml
```

```yaml
apiVersion: v1
data:
  bar: baz
  one: two
kind: ConfigMap
metadata:
  creationTimestamp: null
  name: fortune-config
```



**파일 내용으로 컨피그맵 생성**

- 컨피그맵에는 전체 설정 파일 같은 데이터를 통째로 저장하는 것도 가능하다.
- 아래의 명령을 실행하면 kubectl을 실행한 디렉토리에서 config-file.conf 파일을 찾는다.
- 그리고 파일 내용을 컨피그맵의 `config-file.conf `키의 값으로 지정한다.
  - 파일의 이름이 키가 되고 파일의 내용이 값이 된다.

```bash
$ kubectl create configmap my-config --from-file=config-file.conf
```

- 키를 파일의 이름 대신 `customkey`로 지정하려면 아래와 같이 한다.

```bash
$ kubectl create configmap my-config --from-file=customkey=config-file.conf
```



**디렉토리에 있는 파일로 컨피그맵 생성**

- 각 파일을 개별적으로 추가하는 대신 디렉터리 안에 있는 모든 파일을 추가할 수 있다.
- 디럭터리 안에 있는 각 파일을 추가한다.
- 파일 이름이 컨피그맵 키로 사용하기 유효한 파일만 추가된다.

```bash
$ kubectl create configmap my-config --from-file=/path/to/dir
```





## 2.2 declarative 방식

**ConfigMaps definition**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: game-demo
data:
  # property-like keys; each key maps to a simple value
  player_initial_lives: "3"
  ui_properties_file_name: "user-interface.properties"
  # file-like keys
  game.properties: |
    enemy.types=aliens,monsters
    player.maximum-lives=5    
  user-interface.properties: |
    color.good=purple
    color.bad=yellow
    allow.textmode=true    
```



# 3 Pods definition

- ConfigMap을 참조하기 위해서는 spec 부분에 명시하면 된다.
- Pod와 ConfigMap이 같은 네임스페이스에 속해야한다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: configmap-demo-pod
spec:
  containers:
    - name: demo
      image: alpine
      command: ["sleep", "3600"]
      env:
        # Define the environment variable
        - name: PLAYER_INITIAL_LIVES # Notice that the case is different here
                                     # from the key name in the ConfigMap.
          valueFrom:
            configMapKeyRef:
              name: game-demo           # The ConfigMap this value comes from.
              key: player_initial_lives # The key to fetch.
        - name: UI_PROPERTIES_FILE_NAME
          valueFrom:
            configMapKeyRef:
              name: game-demo
              key: ui_properties_file_name
      volumeMounts:
      - name: config
        mountPath: "/config"
        readOnly: true
  volumes:
  # You set volumes at the Pod level, then mount them into containers inside that Pod
  - name: config
    configMap:
      # Provide the name of the ConfigMap you want to mount.
      name: game-demo
      # An array of keys from the ConfigMap to create as files
      items:
      - key: "game.properties"
        path: "game.properties"
      - key: "user-interface.properties"
        path: "user-interface.properties"
```



참고

- https://kubernetes.io/docs/concepts/configuration/configmap/
- [쿠버네티스 인 액션](https://product.kyobobook.co.kr/detail/S000001804912)
