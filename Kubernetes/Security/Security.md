# 1 인증 이해

## 1.1 API 서버의 인증 절차

1. **인증 플러그인으로 클라이언트 인증**
   - 요청을 보낸 클라이언트를 인증하며 하나 이상으로 구성된 인증 플러그인에 의해 수행된다.
   - HTTP 요청을 검사해 수행하는데 인증 방법에 따라 클라이언트 인증서 HTTP 헤더에서 사용자를 가져온다.
   - 인증 플러그인은 다음 방법을 사용해 클라이언트의 아이덴티티를 얻는다.
	 - 클라이언트의 인증서
	 - HTTP 헤더로 전달된 인증 토큰
	 - 기본 HTTP 인증
   - 인증 플러그인은 인증된 사용자의 이름과 그룹을 반환하며 이를 인가 플러그인이 사용한다.
2. **인가 플러그인으로 클라이언트 인가**
	- 하나 이상의 인가 플러그인에 의해 인가가 수행된다.
	- 인증된 사용자가 요청한 작업이 요청한 리소스 대상으로 수행할 수 있는지를 판별
	- 예를 들어 사용자가 요청한 네임스페이스에 파드를 생성할 수 있는지 권한을 판별한다.
3. **어드미션 컨트롤 플러그인으로 요청된 리소스 확인과 수정**
	- 리소스를 생성, 수정, 삭제하려는 요청인 경우 어드미션 컨트롤로 보내진다.
	- 데이터를 읽는 요청의 경우 어드미션 컨트롤을 거치지 않는다.
	- 어드미션 컨트롤 플러그인은 리소스 정의에서 누락된 필드를 기본값으로 초기화하거나 재정의하는 역할을 한다.
4. **리소스 유효성 확인 및 영구 저장**
	- 오브젝트의 유효성을 검증하고 etcd에 저장한다.
5.   **클라이언트에 응답 반환**

<br>

## 1.2 사용자와 그룹

- 인증 플러그인은 인증된 사용자 이름과 그룹을 반환한다.
- 쿠버네티스 API 서버에 접속하는 두 종류의 클라이언트가 있다.
	- UserAccount: 사용자(실제 사람)
	- ServiceAccount: 파드
- 위 두 가지 유형의 클라이언트는 모두 인증 플러그인을 사용해 인증된다.

<br>

### 1.2.1 UserAccount

- GKE에서 구글 계정과 연결되어 있거나 EKS에서 IAM과 연결되어 있어 쿠버네티스 관리 대상이 아니다.
	- 이는 api 서버를 통해 사용자를 생성, 수정, 삭제할 수 없다는 뜻이다.
- 클러스터 수준의 존재로 **네임스페이스에 영향을 받지 않는다**.

<br>

### 1.2.2 ServiceAccount

- 쿠버네티스에서만 사용된다.
- 파드에서 실행되는 프로세스를 위해 할당된다.
	- 파드 기동 시 반드시 서비스 어카운트 한 개를 할당해야 한다.
	- 지정하지 않으면 default 서비스 어카운트가 할당된다.
- 서비스 어카운트는 **네임스페이스와 연결된 리소스**다.

<br>

### 1.2.3 group

- UserAccount와 ServiceAccount는 하나 이상의 그룹에 속할 수 있다.
- 인증 플러그인은 사용자 이름 및 사용자 ID와 함께 그룹을 반환한다.
- 그룹은 개별 사용자에게 권한을 부여하지 않고 한 번에 여러 사용자에게 권한을 부여하는데 사용된다.

<br>

**built-in group**

- `system:unauthenticated`
	- 어떤 인증 플러그인에서도 클라이언트를 인증할 수 없는 요청에 사용된다.
- `system:authenticated`
	- 성공적으로 인증된 사용자에게 자동으로 할당된다.
- `system:serviceaccounts`
	- 시스템의 모든 서비스 어카운트를 포함한다.
- `system:serviceaccounts:<namespace>`
	- 특정 네임스페이스의 모든 서비스 어카운트를 포함한다.

<br>

# 2 UserAccount

- 인간 사용자를 위한 어카운트
- UserAccount은 전역으로 지정됩니다. 
	- 이름은 클러스터의 모든 네임스페이스에서 고유하다.
	- 어떤 네임스페이스를 보든지 사용자를 나타내는 특정 사용자 이름은 동일한 사용자를 나타낸다.
-  쿠버네티스 관리 대상이 아니다.
	- API 서버를 통해 사용자를 생성, 수정, 삭제할 수 없다는 뜻이다.
- 모든 유저의 접근은 API Server에 의해 관리된다.
	- API Server에 kubectl로 접근하거나 http 요청으로 접근한다.
	- 일반 사용자가 API 서버를 호출하기 위해서는 몇 가지 인증 단계가 필요하다.
	- [API 서버의 인증 절차 참고](##1.1-API-서버의-인증 절차)

<br>

## 2.1 인증 방식

- API 서버는 하나 이상의 인증 플러그인으로 구성할 수 있다.
- 인증 플러그인은 요청을 검사해 보낸 사람이 누구인가를 검증한다.
	- 아이덴티티를 얻기위해 사용되는 정보로 아래와 같은 것들이 있다.
	- HTTP 헤더로 전달된 인증 토큰
	- 클라이언트의 인증서
	- 기본 HTTP 인증

<br>

### 2.1.1 static 방식

- 먼저 가장 이해하기 쉬운 static 방식의 인증 방식을 알아보자.
- 최신 버전의 Kubernetes에는 static 방식을 지원하지 않는다. 인증 방식을 이해하기위해 알아보자.

<br>

**static password file 인증 방식**

- 유저 정보를 담은 파일을 작성한다.
	- `<password,username,userID,groupID>` 엔트리로 구성된 파일이다.
- 앞서 작성한 유저 정보를 담은 파일을 `--basic-auth-file=<static_password_file>` 옵션에 추가해 kube-apiserver를 실행한다.
- `curl ` 명령어로 api-server에 요청할 때 `-u "user1:password123"` 옵션을 추가해 인증한다.
- api 서버는 `--basic-auth-file` 옵션에 명시된 유저 정보 파일을 보고 인증 절차를 거친다.

<br>

**static token file**

- static password file과 비슷한 방식이다.
- `<token,username,userID,groupID>` 엔트리로 구성된 파일으을 작성한다.
	- 비밀번호 대신 토큰 사용하는 점이 static password file과의 차이점
- `--token-auth-file=<static token file>` 옵션을 추가해 kube-apiserver를 실행한다.
- `curl ` 명령어로 api-server에 요청할 때 `--header "Authorization: Bearer <token>"` 옵션을 추가해 인증한다.

<br>

### 2.1.2 certificate를 부여하는 법

- [레퍼런스](https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests/#normal-user)
- userAccount에게 certificate를 부여해보자.



**private key 생성하기**

``````bash
openssl genrsa -out myuser.key 2048
``````

- 먼저 private key 생성한다.

<br>

**CSR 생성하기**

```bash
openssl req -new \
  -key myuser.key \
  -subj "/CN=kube-admin/O=system:masters" \
  -out myuser.csr
```

- 앞서 생성한 private key로 csr을 생성한다.
- CN과 O 속성을 명시하는 것이 중요하다.
	- CN(Common Name)
		- user의 이름
		- 이 이름은 나중에 쿠버네티스 RoleBinding이나 ClusterRoleBinding을 할당할 때 사용자를 식별하는 데 사용됩니다.
	- O: user가 속할 group

<br>

**CertificateSigningRequest 생성하기**

```yaml
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: myuser
spec:
  request: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQ1ZqQ0NBVDRDQVFBd0VURVBNQTBHQTFVRUF3d0dZVzVuWld4aE1JSUJJakFOQmdrcWhraUc5dzBCQVFFRgpBQU9DQVE4QU1JSUJDZ0tDQVFFQTByczhJTHRHdTYxakx2dHhWTTJSVlRWMDNHWlJTWWw0dWluVWo4RElaWjBOCnR2MUZtRVFSd3VoaUZsOFEzcWl0Qm0wMUFSMkNJVXBGd2ZzSjZ4MXF3ckJzVkhZbGlBNVhwRVpZM3ExcGswSDQKM3Z3aGJlK1o2MVNrVHF5SVBYUUwrTWM5T1Nsbm0xb0R2N0NtSkZNMUlMRVI3QTVGZnZKOEdFRjJ6dHBoaUlFMwpub1dtdHNZb3JuT2wzc2lHQ2ZGZzR4Zmd4eW8ybmlneFNVekl1bXNnVm9PM2ttT0x1RVF6cXpkakJ3TFJXbWlECklmMXBMWnoyalVnald4UkhCM1gyWnVVV1d1T09PZnpXM01LaE8ybHEvZi9DdS8wYk83c0x0MCt3U2ZMSU91TFcKcW90blZtRmxMMytqTy82WDNDKzBERHk5aUtwbXJjVDBnWGZLemE1dHJRSURBUUFCb0FBd0RRWUpLb1pJaHZjTgpBUUVMQlFBRGdnRUJBR05WdmVIOGR4ZzNvK21VeVRkbmFjVmQ1N24zSkExdnZEU1JWREkyQTZ1eXN3ZFp1L1BVCkkwZXpZWFV0RVNnSk1IRmQycVVNMjNuNVJsSXJ3R0xuUXFISUh5VStWWHhsdnZsRnpNOVpEWllSTmU3QlJvYXgKQVlEdUI5STZXT3FYbkFvczFqRmxNUG5NbFpqdU5kSGxpT1BjTU1oNndLaTZzZFhpVStHYTJ2RUVLY01jSVUyRgpvU2djUWdMYTk0aEpacGk3ZnNMdm1OQUxoT045UHdNMGM1dVJVejV4T0dGMUtCbWRSeEgvbUNOS2JKYjFRQm1HCkkwYitEUEdaTktXTU0xMzhIQXdoV0tkNjVoVHdYOWl4V3ZHMkh4TG1WQzg0L1BHT0tWQW9FNkpsYWFHdTlQVmkKdjlOSjVaZlZrcXdCd0hKbzZXdk9xVlA3SVFjZmg3d0drWm89Ci0tLS0tRU5EIENFUlRJRklDQVRFIFJFUVVFU1QtLS0tLQo=
  signerName: kubernetes.io/kube-apiserver-client
  expirationSeconds: 86400  # one day
  usages:
  - client auth
```

- CertificateSigningRequest 오브젝트를 생성해 관리자에게 요청한다.
- [CertificateSigningRequest 리소스 레퍼런스](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.26/#certificatesigningrequest-v1-certificates-k8s-io)
- expirationSeconds로 만료시간 지정
- request에는 CSR file content를 base64로 인코딩한 값을 넣는다.
	- 아래 명령어로 myuser.csr의 base64 인코딩 값을 얻을 수 있다.
	- `cat myuser.csr | base64 | tr -d "\n"`

<br>

**Approve certificate signing request**

- CertificateSigningRequest가 만들어지면 관리자는 `kubectl get csr` 명령어를 통해 CertificateSigningRequest를 조회할 수 있다.
- 관리자는 CertificateSigningRequest를 승인하거나 거절할 수 있다.
  - 승인: `kubectl certificate approve <certificate-signing-request-name> `  
  - 거절: `kubectl certificate deny <certificate-signing-request-name>`

<br>

**Get the certificate**

- 관리자가 CertificateSigningRequest를 승인해주면 Certificate를 얻을 수 있다.
- Certificate의 값은 `status.certificate`에 Base64로 인코딩되어 있다
- 따라서 아래의 명령어로  Certificate의 값을 myuser.crt로 저장할 수 있다.
- `kubectl get csr myuser -o jsonpath='{.status.certificate}'| base64 -d > myuser.crt`



> certificate 정보 보기
>
> `openssl x509 -in <certificate-path> -text -noout`

<br>

# 3 ServiceAccount

- 클라이언트가 API 서버에서 작업을 수행하기 전에 자신을 인증해야 한다.
- 서비스 어카운트는 파드 내부에서 실행되는 애플리케이션이 API 서버에 자신을 인증하는 방법이다.
- 애플리케이션은 요청에 서비스 어카운트의 토큰을 전달해 인증 과정을 수행한다.

<br>

## 3.1 파드

- 모든 파드는 파드에서 실행중인 애플리케이션의 아이덴티티를 나타내는 서비스어카운트와 연계돼 있다.
- 파드는 딱 하나의 서비스어카운트와 연계되지만 여러 파드가 같은 서비스어카운트를 사용할 수 있다.
- 파드 매니페스트에 서비스어카운트 이름을 지정해 파드에 서비스어카운트를 할당할 수 있다.
- 파드에 서로 다른 서비스어카운트롤 할당하면 각 파드가 액세스 할 수 있는 리소스를 제어할 수 있다.

<br>

**서비스어카운트를 파드에 할당하기**

- 파드 정의의 `spec.serviceAccountName` 필드에 서비스어카운트 이름을 설정한다.
- 파드 생성 시점에 설정하며 나중에 변경할 수 없음

<br>

## 3.2 네임스페이스

- 파드는 같은 네임스페이스의 ServiceAccount만 사용할 수 있다.
- 각 네임스페이스마다 `default`라는 이름의 ServiceAccount가 자동으로 생성된다.
- ServiceAccount를 명시적으로 할당하지 않으면 파드는 네임스페이스에 있는 default ServiceAccount를 사용한다.

<br>

## 3.3 생성

- 모든 네임스페이스에는 고유한 default ServiceAccount가 포함돼 있지만 필요한 경우 추가로 만들 수 있다.
- ServiceAccount를 추가로 만드는 이유는 보안 때문이다
	- 최소한의 권한으로 제한된 계정으로 실행하야 한다.

<br>

**생성**

```bash
$ kubectl create serviceaccount foo
```

<br>

**확인**

```bash
$ kubectl describe sa foo
Name:                foo
Namespace:           default
Labels:              <none>
Annotations:         <none>
Image pull secrets:  <none>
Mountable secrets:   foo-token-8nhbb
Tokens:              foo-token-8nhbb
Events:              <none>
```

- Mountable secrets
	- 기본적으로 파드는 원하는 모든 시크릿을 마운트할 수 있다.
	- 서비스어카운트가 `kubernetes.io/enforce-mountable-secrets="true"` 애노테이션을 가지고 있으면 이 서비스어카운트와 연계된 파드는 Mountable secrets 목록에 있는 시크릿만 마운트할 수 있다.
- Image pull secrets
	- 서비스어카운트에 Image pull secrets을 추가하면 해당 서비스어카운트와 연계된 모든 파드에 이미지 풀 시크릿이 자동으로 추가된다.
- Tokens
	- 인증 토큰
	- 첫 번째 토큰이 컨테이너에 마운트된다.

<br>

**시크릿 확인**

- 생성할 때 지정하지 않는 시크릿 항목이 존재한다.
- kubernetes.io/service-account-token 타입의 시크릿을 쿠버네티스가 자동으로 생성한다.
- 여기 token이 시크릿 볼륨으로 각 컨테이너의 파일 시스템에 마운트된다
	- 마운트 위치 `/var/run/secrets/kubernetes.io/serviceaccount/token`
	- 컨테이너는 api 서버와 통신할 때 이 토큰을 사용한다.

```bash
$ kubectl describe secret foo-token-8nhbb
Name:         foo-token-8nhbb
Namespace:    default
Labels:       <none>
Annotations:  kubernetes.io/service-account.name: foo
              kubernetes.io/service-account.uid: 3c4abf9b-63a3-4221-a0b4-f45949990f1e

Type:  kubernetes.io/service-account-token

Data
====
ca.crt:     1025 bytes
namespace:  7 bytes
token:      eyJhbGciOiJSUzI1NiIsImtpZCI6IjhhNmpaaVI5VVdRR3dzWGJDX09PS1ZSSHRHMXpRX3cwLUNhalU4cFZiS3cifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJjbTEtMi1zdHVkeSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJmb28tdG9rZW4tOG5oYmIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiZm9vIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQudWlkIjoiM2M0YWJmOWItNjNhMy00MjIxLWEwYjQtZjQ1OTQ5OTkwZjFlIiwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50OmNtMS0yLXN0dWR5OmZvbyJ9.W9t4oWRwPfnu9sHI7WfKiRTBgKKEM8wVf0Mhtp5vEGSfbGyE8yceHE5exa7W37xKCvmG-Cug1RJ_PjTuZBL8KBSFZ6zUXYyCXFVgsCEgGp9O9voeHLs-dgLl92gdy-KFMI_4ihYxaDmJfeSk_gP77QP7lkxQLOaSYzreq4qvP17BC-LZyI4q2rpvNYYx__4MzrRF6-gaGr1QmUZ3FbjX6w2ZbXtBFyXKXj3tiZ6B_rjprqXQfJnQZb3Ia8FQ4dSqXtW02e-dCTCwLX_0FhoGVZV0zqYVSlFFYVP4ql5cT81B0Tg3j-9dtgx-WDlJPJgVeGYdr57oJw7K6sTQpnB8gQ
```

<br>

## 3.4 image pull secret

```yaml
apiVersion: v1
imagePullSecrets:
- name: secretName
kind: ServiceAccount
metadata:
  creationTimestamp: "2023-03-22T03:11:37Z"
  name: default
  namespace: oom
  resourceVersion: "6419330"
  uid: 8adcfda0-baa4-40fe-8479-8228daa0e8d1
```

<br>

# 4 RBAC

- 쿠버네티스 1.6.0 버전부터 클러스터 보안이 크게 강화되었다.
- 이전 버전에서는 파드 중 하나에서 인증 토큰을 획득하는데 성공하면 이를 이용해 클러스터에서 어떤 작업이든 가능했다.
- 1.8.0 버전에서 RBAC 인가 플러그인이 GA로 승격되어 클러스터 보안이 강화되었다.
- RBAC는 권한이 없는 사용자가 클러스터 상태를 보거나 수정하지 못한다.
- default 서비스어카운트는 추가 권한을 부여하지 않는 한 클러스터 상태를 볼 수 없으며 수정도 불가능하다.

<br>

## 4.1 RBAC 인가 플러그인

- kube-apiserver는 RBAC 인가 플러그인을 사용해 액션을 요청하는 사용자가 액션을 수행할 수 있는지 점검한다.
- kube-apiserver는 REST 인터페이스를 제공하므로 사용자는 HTTP 요청을 통해 액션을 수행한다.
  - HTTP 요청에는 자격증명 정보가 포함되어 있다.
    - 자격증명 정보에는 인증 토큰, 클라이언트 인증서 등이 있다.

<br>

## 4.2 액션

- REST 클라이언트는 GET, POST, PUT, DELETE 유형의 메서드 요청을 특정 리소스를 나타내는 URL 경로로 보낸다.
- 리소스에는 파드, 서비스, 시크릿 등이 있다.

<br>

# 5 RBAC 리소스

- RBAC 인가 규칙은 네 개의 리소스로 구성된다.
	- 롤: 리소스에 수행할 수 있는 동사를 지정한다.
	- 클러스터 롤: 리소스에 수행할 수 있는 동사를 지정한다.
	- 롤바인딩: 롤을 특정 사용자, 그룹 서비스 어카운트에 바인딩한다.
	- 클러스터롤바인딩: 롤을 특정 사용자, 그룹 서비스 어카운트에 바인딩한다.
- 롤과 롤바인딩은 네임스페이스가 지정된 리소스이며 클러스터롤과 클러스터롤바인딩은 네임스페이스를 지정하지 않는 클러스터 수준의 리소스다.

<br>

## 5.1 Role

- 네임스페이스가 지정된 리소스이기 때문에 반드시 네임스페이스를 명시해야한다.
	- namespace를 지정하지 않으면 default namespace가 지정된다.
- 리소스가 `core` 그룹에 속하면 apiGroups에 `""`으로 지정한다.
	- 임의의 리소스가 core 그룹에 속하는지 알고 싶다면 [여기를 참고](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.26/#-strong-api-overview-strong-)


```yml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""] # "" indicates the core API group
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
```

<br>

## 5.2 RoleBinding

- 네임스페이스가 지정된 리소스이며 namespace를 지정하지 않으면 default namespace가 지정된다.
- RoleBinding은 다른 네이스페이스의 서비스 어카운트도 참조할 수 있다.

```yml
apiVersion: rbac.authorization.k8s.io/v1
# This role binding allows "jane" to read pods in the "default" namespace.
# You need to already have a Role named "pod-reader" in that namespace.
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
# You can specify more than one "subject"
- kind: User
  name: jane # "name" is case sensitive
  apiGroup: rbac.authorization.k8s.io
roleRef:
  # "roleRef" specifies the binding to a Role / ClusterRole
  kind: Role #this must be Role or ClusterRole
  name: pod-reader # this must match the name of the Role or ClusterRole you wish to bind to
  apiGroup: rbac.authorization.k8s.io
```

<br>

## 5.3 ClusterRole

**일반 Role이 해결할 수 없는 문제**

- 일반 Role은 동일한 네임스페이스의 리소스에만 액세스 할 수 있다.
	- 따라서 다른 네임스페이스에 리소스에 누군가 액세세할 수 있게 하려면 해당 네임스페이스마다 롤과 롤바인딩을 만들어야 한다.
	- 이를 모든 네임스페이스로 확장하려면 각 네임스페이스에서 동일한 롤과 롤바인딩을 만들어야 함
	- 추가적으로 네임스페이스가 추가되면 해당 네임스페이스에 롤과 롤바인딩을 만들어야 한다는 것을 기억해야 한다.
- 네임스페이스를 지정하지 않는 리소스에 대한 액세스 권한을 부여할 수 없다.
	- 네임스페이스를 지정하지 않는 리소스는 아래 명령어로 확인 가능
	- `kubectl api-resources --namespaced=false`

<br>

**ClusterRole을 사용하는 경우**

- 일반 Role이 해결할 수 없는 문제는 ClusterRole를 사용해 해결한다.
- `네임스페이스 리소스`에 대한 사용 권한을 정의하고 `모든 네임스페이스에 대한 액세스 권한 부여`할 때
- `클러스터 범위 리소스`에 대한 사용 권한 정의할 때

```yml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  # "namespace" omitted since ClusterRoles are not namespaced
  name: secret-reader
rules:
- apiGroups: [""]
  #
  # at the HTTP level, the name of the resource for accessing Secret
  # objects is "secrets"
  resources: ["secrets"]
  verbs: ["get", "watch", "list"]
```

<br>

## 5.4 ClusterRoleBinding

```yml
apiVersion: rbac.authorization.k8s.io/v1
# This cluster role binding allows anyone in the "manager" group to read secrets in any namespace.
kind: ClusterRoleBinding
metadata:
  name: read-secrets-global
subjects:
- kind: Group
  name: manager # Name is case sensitive
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```

<br>

# 7 NetworkPolicy

- [레퍼런스](https://kubernetes.io/docs/concepts/services-networking/network-policies/#networkpolicy-resource)



## 7.1 생성

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: test-network-policy
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: db
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - ipBlock:
            cidr: 172.17.0.0/16
            except:
              - 172.17.1.0/24
        - namespaceSelector:
            matchLabels:
              project: myproject
        - podSelector:
            matchLabels:
              role: frontend
      ports:
        - protocol: TCP
          port: 6379
  egress:
    - to:
        - ipBlock:
            cidr: 10.0.0.0/24
      ports:
        - protocol: TCP
          port: 5978
```



# 8 KubeConfig

- `curl `을 이용해 kube-apiserver에  https 요청할 때 인증을 아래와 같이 자격 증명을 위한 파일을 함께 보낸다.

```bash
curl https://my-kube:6443/api/v1/pods \
  --key admin.key \
  --cert admin.crt \
  --cacert ca.crt
```

- kubectl를 사용할 때 마찬가지로 옵션을 사용해 자격 증명을 위한 파일을 보낸다.

```bash
kubectl get pods \
  --server my-kube:6443 \
  --client-key admin.key \
  --client-certificate admin.crt \
  --certificate-authority ca.crt
```

- 하지만 매 요청마다 이러한 옵션을 추가하는 것은 매우 번거로운 일이다. 
- 따라서 이러한 정보를 config 파일에 담고 `--kubeconfig` 옵션으로 명시해주면 보다 편리하게 사용 가능

````bash
kubectl get pods \
  --kubeconfig config
````

- 기본적으로 kubectl은 `~/.kube/config` 파일을 설정 파일로 사용한다.
- 따라서 `--kubeconfig` 옵션으로 컨피그 파일을 지정하지 않으면 `~/.kube/config`를 기본으로 사용한다.



## 8.1 KubeConfig의 구조

- [레퍼런스](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#define-clusters-users-and-contexts)
- KubeConfig은 yaml 형식이다.
- `~/.kube/config` 파일의 구조는 크게 세 가지로 구분된다.
	- clusters
	- contexts
	- users

<br>

**예시**

```yaml
apiVersion: v1
kind: Config
clusters:
- cluster:
    certificate-authority: fake-ca-file
    server: https://1.2.3.4
  name: development
- cluster:
    insecure-skip-tls-verify: true
    server: https://5.6.7.8
  name: test
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
- context:
    cluster: development
    namespace: storage
    user: developer
  name: dev-storage
- context:
    cluster: test
    namespace: default
    user: experimenter
  name: exp-test
current-context: ""
preferences: {}
users:
- name: developer
  user:
    client-certificate: fake-cert-file
    client-key: fake-key-file
- name: experimenter
  user:
    # Documentation note (this comment is NOT part of the command output).
    # Storing passwords in Kubernetes client config is risky.
    # A better alternative would be to use a credential plugin
    # and store the credentials separately.
    # See https://kubernetes.io/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins
    password: some-password
    username: exp
```

