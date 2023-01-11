# 1 Ingress

- `Ingress`는 L7 로드 밸런싱을 제공하는 리소스다.
- 인그레스는 서비스들을 묶는 서비스들의 상위 객체다.
- 인그레스 리소스를 작동시키려면 클러스터에 인그레스 컨트롤러를 실행해야 한다.



## 1.1 서비스와 비교

- `Service`는 L4 로드 밸런싱을 제공하는 리소스다.
- `Ingress`는 L7 로드 밸런싱을 제공하는 리소스다.
- 인그레스는 네트워크 스택의 애플리케이션 계층에서 작동하여 서비스가 할 수 없는 쿠키 기반 세션 어피니티 등과 같은 기능을 제공한다.



## 1.2 인그레스의 기본 기능

**외부 요청 라우팅**

- /apple, /apple/red 등과 같이 특정 경로로 들어온 요청을 어떠한 서비스로 전달할지 정의하는 라우팅 규칙을 설정할 수 있다.



**가상 호스트 기반의 요청 처리**

- 같은 IP에 대해 다른 도메인 이름으로 요청이 왔을 때 어떻게 처리할 것인지 정의할 수 있다.



**SSL/TLS 보안 연결 처리**

- 여러 개의 서비스로 요청을 라우팅할 때 보안연결을 위한 인증서를 쉽게 적용할 수 있다.



## 1.3 인그레스 리소스 생성

```yml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-example
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    kubernetes.io/ingress.class: "nginx"
spec:
  rules:
  - host: alicek106.example.com                   # [1]
    http:
      paths:
      - path: /echo-hostname                     # [2]
        pathType: Prefix
        backend: 
          service: 
            name: hostname-service               # [3]
            port: 
              number: 80
```

`host`

- 해당 도메인 이름으로 접근하는 요청에 대해서 처리 규칙을 적용한다.



`path`

- 해당 경로에 들어온 요청을 어느 서비스로 전달할 것인지 정의합니다.
- `/echo-hostname`이라는 경로의 요청을 backend에 정의된 서비스로 전달합니다.

`

`service.name` 와 `service.port.number`

- path로 들어온 요청이 전달될 서비스와 포트입니다.
- 예시에서는 hostname-service 서비스의 80 포트로 전달합니다.



**Nginx 설정**

`metadata.annotations.kubernetes.io/ingress.class`

- 해당 인그레스 규칙을 어떤 인그레스 컨트롤러에 적용할 것인지를 의미한다.



`metadata.annotations.kubernetes.nginx.ingress.kubernetes.io/rewrite-target`

- Nginx 인그레스 컨트롤러에만 사용할 수 있는 기능이다.
- 이 주석은 인그레스에 정의된 경로로 들어오는 요청을 rewite-target에 설정된 경로로 전달합니다. 



# 2 인그레스 컨트롤러

- 인그레스를 생성하면 아무 일도 일어나지 않는다.
- 인그레스는 외부 요청을 받아들일 수 있는 실제 서버가 아니다
- 인그레스는 인그레스 컨트롤러라고 하는 특수한 서버에 적용해야만 그 규칙을 사용할 수 있다.
- 실제로 외부 요청을 받아들이는 것은 인그레스 컨트롤러 서버이며 이 서버가 인그레스 규칙을 로드해 사용한다.



## 2.1 인그레스 컨트롤러의 종류

- 인그레스의 구현 방법은 여러가지가 있지만 실제로 많이 사용되는 것은 GKE 인그레스 컨트롤러와 Nginx 컨트롤러다.
- 이 두가지 컨트롤러는 인그레스 리소스를 생성했을 때 처리를 담당하는 컨트롤러다.



## 2.2 Nginx 컨트롤러

**클라우드가 아닌 환경에서 인그레스**

- 클라우드 환경이 아니라면 LoadBalancer 타입 대신 NodePort 타입의 서비스를 사용한다.
- 이 경우 각 노드에서 `nodePort` 로 Nginx 인그레스 컨트롤러에 접근할 수 있다.



**Nginx 컨트롤러 생성**

- [deploy.yaml](https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.4.0/deploy/static/provider/baremetal/deploy.yaml)

```bash
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.4.0/deploy/static/provider/baremetal/deploy.yaml
```



**Nginx 컨트롤러 생성 시 오류 발생**

```
Error from server (InternalError): error when creating "ingress.yaml": Internal error occurred: failed calling webhook "validate.nginx.ingress.kubernetes.io": failed to call webhook: Post "https://ingress-nginx-controller-admission.ingress-nginx.svc:443/networking/v1/ingresses?timeout=10s": dial tcp 10.111.72.43:443: connect: connection refused
```

```bash
$ kubectl delete validatingwebhookconfiguration ingress-nginx-admission
```



# 3 인그레스 동작 방식

1. 클라이언트가 먼저 example.com 을 DNS에 조회하여 인그레스 컨트롤러의 IP를 얻는다.
2. 클라이언트가 HTTP 요청을 인그레스 컨트롤러에 전송하고 host 헤더에 example.com을 지정한다.
3. 컨트롤러는 헤더에서 클라이언트가 접근하려는 서비스를 결정하고 서비스와 관련된 엔드포인트 오브젝트로 파드 IP를 조회한 다음 클라이언트 요청을 파드에 전달한다.

- 위와 같이 인그레스 컨트롤러는 요청을 서비스로 전달하지 않고 서비스는 파드를 선택하는 데만 사용한다.
- 대부분의 컨트롤러가 위와 같이 동작한다.



참고

- [시작하세요! 도커/쿠버네티스](http://www.yes24.com/Product/Goods/84927385)
- https://kubernetes.io/docs/concepts/services-networking/ingress/