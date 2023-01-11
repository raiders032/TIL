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
- Pod와 ConfigMap이 **같은 네임스페이스에 속해야한다**.
- 컨피그 맵의 값을 파드의 컨테이너로 전달하는 방법은 세 가지가 있다.



## 3.1 환경변수로 컨테이너에 전달

- valueFrom 필드에 키를 지정하면 컨피그맵에서 해당 키로 값을 가져온다. 



**CongifMap Definition**

```yaml
apiVersion: v1
  kind: ConfigMap
  metadata:
    name: special-config
    namespace: default
  data:
    special.how: very
```



**Pod Definition**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: dapi-test-pod
spec:
  containers:
    - name: test-container
      image: registry.k8s.io/busybox
      command: [ "/bin/sh", "-c", "env" ]
      env:
        # Define the environment variable
        - name: SPECIAL_LEVEL_KEY
          valueFrom:
            configMapKeyRef:
              # The ConfigMap containing the value you want to assign to SPECIAL_LEVEL_KEY
              name: special-config
              # Specify the key associated with the value
              key: special.how
```



## 3.2 컨피그맵의 모든 항목을 한 번에 환경변수로 전달

- envFrom 필드로 컨피그맵을 참조하면 해당 컨피그맵의 모든 데이터가 컨테이너의 환경별수로 등록된다.
- 아래의 예시에서 두개의 `SPECIAL_LEVEL=very` , `SPECIAL_TYPE=charm` 환경변수가 등록된다.



**CongifMap Definition**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: special-config
  namespace: default
data:
  SPECIAL_LEVEL: very
  SPECIAL_TYPE: charm
```



**Pod Definition**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: dapi-test-pod
spec:
  containers:
  	- name: test-container
  		image: registry.k8s.io/busybox
  		command: [ "/bin/sh", "-c", "env" ]
  		envFrom:
  		- configMapRef:
  				name: special-config
```



## 3.3 컨피그맵으로 정의된 환경변수 command에서 사용하기

- 컨피그맵으로 정의된 환경변수를 `command`나 `args` 에서 사용할 수 있다.
- 사용 문법: `$(VAR_NAME)`



**예시**

- 컨피그맵으로 정의된 환경변수인 `SPECIAL_LEVEL_KEY`와 `SPECIAL_TYPE_KEY`를 command에서 사용하고 있다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: dapi-test-pod
spec:
  containers:
    - name: test-container
      image: registry.k8s.io/busybox
      command: [ "/bin/echo", "$(SPECIAL_LEVEL_KEY) $(SPECIAL_TYPE_KEY)" ]
      env:
        - name: SPECIAL_LEVEL_KEY
          valueFrom:
            configMapKeyRef:
              name: special-config
              key: SPECIAL_LEVEL
        - name: SPECIAL_TYPE_KEY
          valueFrom:
            configMapKeyRef:
              name: special-config
              key: SPECIAL_TYPE
  restartPolicy: Never
```



## 3.4 컨피그맵 볼륨을 사용해 컨테이너에 설정 파일 전달하기 

- 컨피그맵 볼륨을 사용해 설정 파일을 컨테이너에 전달해보자
- 환경변수로 설정 옵션을 전달하는 것은 일반적으로 짧은 변숫값에 대해 사용된다.
- 컨피그맵은 설정 파일도 포함하기 떄문에 이 파일들을 컨테이너에 노출시키려면 특수 볼륨 유형 중 하나인 컨피그맵 불륨을 사용할 수 있다.
- 대형 설정 파일들을 컨테이너에 전달하기 좋은 방법이지만 짮은 단일 값을 전달할 때도 문제없다. 



**ConfigMap Definition**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: special-config
  namespace: default
data:
  SPECIAL_LEVEL: very
  SPECIAL_TYPE: charm
```



**Pod Definition**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: dapi-test-pod
spec:
  containers:
    - name: test-container
      image: registry.k8s.io/busybox
      command: [ "/bin/sh", "-c", "ls /etc/config/" ]
      volumeMounts:
      - name: config-volume
        mountPath: /etc/config
  volumes:
    - name: config-volume
      configMap:
        # Provide the name of the ConfigMap containing the files you want
        # to add to the container
        name: special-config
```

파드를 실행하고 컨테이너 내부에서 `ls /etc/config/` 명령어를 실행하면 아래와 같은 결과가 출력된다.

```
SPECIAL_LEVEL
SPECIAL_TYPE
```



## 3.5 볼륨에 특정 컨피그맵 항목만 노출하기

- 앞서 예시는 컨피그 맵의 모든 데이터를 볼륨에 노출했다.
- 컨피그 맵의 특정 항목만 노출하려면 items 필드를 사용하면 된다.
- path 필드로 컨피그맵 아이템에 대한 파일 경로를 지정할 수 있다.
  - 아래의 예시에서 SPECIAL_LEVEL 아이템은 `/etc/config/keys` 경로에 마운트 된다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: dapi-test-pod
spec:
  containers:
    - name: test-container
      image: registry.k8s.io/busybox
      command: [ "/bin/sh","-c","cat /etc/config/keys" ]
      volumeMounts:
      - name: config-volume
        mountPath: /etc/config
  volumes:
    - name: config-volume
      configMap:
        name: special-config
        items:
        - key: SPECIAL_LEVEL
          path: keys
```

파드를 실행하고 컨테이너 내부에서 `cat /etc/config/keys` 명령어를 실행하면 결과는 아래와 같다.

```bash
very
```



참고

- https://kubernetes.io/docs/concepts/configuration/configmap/
- [쿠버네티스 인 액션](https://product.kyobobook.co.kr/detail/S000001804912)
