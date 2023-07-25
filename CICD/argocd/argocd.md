# 1 argocd









# 2 Private Repositories

- 매니페스트가 Private Repositories에 있는 경우 자격 인증서가 필요하다.
- Argo CD는 HTTPS 또는 SSH Git 자격 인증을 제공한다.
- [레퍼런스](https://argo-cd.readthedocs.io/en/stable/user-guide/private-repositories/)



## 2.1 SSH Private Key Credential



**CLI**

```bash
argocd repo add git@github.com:argoproj/argocd-example-apps.git --ssh-private-key-path ~/.ssh/id_rsa
```



# 3 Notification

- [레퍼런스](https://argo-cd.readthedocs.io/en/stable/operator-manual/notifications/)
- Argo CD Notifications는 Argo CD 응용 프로그램을 지속적으로 모니터링하고 응용 프로그램 상태의 중요한 변경 사항을 사용자에게 알리는 방법을 제공한다.
- [triggers](https://argo-cd.readthedocs.io/en/stable/operator-manual/notifications/triggers/)와 [templates](https://argo-cd.readthedocs.io/en/stable/operator-manual/notifications/templates/)의 메커니즘을 사용하여 알림 내용뿐만 아니라 알림을 보내야 하는 시기를 설정할 수 있다.
- Argo CD Notifications에는 유용한 트리거 및 템플릿 카탈로그가 포함되어 있습니다. 



## 3.1 Triggers

- [레퍼런스](https://argo-cd.readthedocs.io/en/stable/operator-manual/notifications/triggers/)
- trigger는 `argocd-notifications-cm` ConfigMap에 정의한다.
- trigger란 argo cd가 알림을 보내는 조건을 말한다.
- trigger는 이름, 조건, template 참조로 구성된다.
  - 이름: 트리거의 이름
  - 조건: 알림을 발생시키기 위한 조건



**예시**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-notifications-cm
data:
  trigger.on-sync-status-unknown: |
    - when: app.status.sync.status == 'Unknown'     # trigger condition
      send: [app-sync-status, github-commit-status] # template names
```

- `trigger.[트리거 이름]`: 트리거의 이름을 지정한다.
- `when`: trigger의 조건을 명시한다.
- `send`: 참조하려는 template의 이름을 명시한다.



## 3.2 template

- trigger로 알림을 언제 보내는지 시기를 결정했으면 이제 template을 이용해서 알림의 내용을 설정한다.
- trigger와 마찬가지로 template은 `argocd-notifications-cm` ConfigMap에 정의한다.



**예시**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-notifications-cm
data:
  template.my-custom-template-slack-template: |
    message: |
      Application {{.app.metadata.name}} sync is {{.app.status.sync.status}}.
      Application details: {{.context.argocdUrl}}/applications/{{.app.metadata.name}}.
```

