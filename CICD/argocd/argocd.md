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
