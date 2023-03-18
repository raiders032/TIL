# 1 방화벽

- [레퍼런스](https://ubuntu.com/server/docs/security-firewall)
- ufw는 우분투의 기본 방화벽 툴이다.
- ufw 기본적으로 비활성화되어 있다.
- Uncomplicated Firewall은 이름처럼 단순한 방화벽 툴로 모든 기능을 제공하는 것의 초점을 두지 않고 쉬운 사용성에 초점을 둔다.



**방화벽 상태 보기**

```bash
sudo ufw status
sudo ufw status verbose
sudo ufw status numbered
```



**ufw 활성화 또는 비활성화**

```bash
sudo ufw enable
sudo ufw disable
```



**포트 열기**

```bash
sudo ufw allow 22
```



**포트 닫기**

```bash
sudo ufw deny 22
```



**룰 지우기**

```bash
sudo ufw delete deny 22
```
