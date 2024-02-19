# 테스트 우분투 실행

```bash
$ kubectl run ubuntu --image=ubuntu --restart=Never -- sleep infinity
$ kubectl exec -it ubuntu -- /bin/bash
$ apt-get update && apt-get install -y curl
```

<br>

## Curl 이미지 사용

```bash
$ kubectl run curl --image=curlimages/curl --restart=Never -- sleep infinity
$ kubectl exec -it curl -- sh
```



```

curl -X GET $APISERVER/api/v1/namespaces/default/pods \ -H "Authorization: Bearer $TOKEN" \ -H 'Accept: application/json' \ -k

```