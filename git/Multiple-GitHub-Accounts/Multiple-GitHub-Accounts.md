# 1 Multiple GitHub Accounts

* 한 컴퓨터에서 여러 깃헙 계정 관리하기
* 디폴트 계정과 회사용 계정을 관리해보자!



## 1.1 디폴트 계정용 SSH key 생성하기

* [Github-SSH.md](../Github-SSH/Github-SSH.md)를 참고해서 SSH key를 만들자



# 2 회사용 SSH key 생성하기

* 회사 이메일을 지정하고 파일 이름을 구분하기 위해 회사 이름과 유저 이름 기입

```bash
$ ssh-keygen -t ed25519 -C "your_email@work_mail.com" -f "id_rsa_work"
```

**확인**

* 디폴트 계정용 SSH 키(id_ed25519)와 회사용 SSH키(id_rsa_work) 확인

```
ls ~/.ssh
id_ed25519	id_ed25519.pub	id_rsa_work	id_rsa_work.pub
```



# 3 ssh-agent에 SSH Key 등록

**ssh-agent 실행 확인**

```bash
$ eval "$(ssh-agent -s)"
```

**ssh-agent에 SSH Key 등록**

```bash
$ ssh-add ~/.ssh/id_rsa
$ ssh-add ~/.ssh/id_rsa_work
```

**ssh-agent에 등록 key 확인**

```bash
ssh-add -l
```



# 4 config 파일 생성

```bash
$ vi ~/.ssh/config
```

**config**

```
# default 계정
Host github.com
   HostName github.com
   User git
   IdentityFile ~/.ssh/id_rsa

# 회사 계정
Host github.com-work  
   HostName github.com
   User git
   IdentityFile ~/.ssh/id_rsa_work
```



# 5 GitHub 설정

* 생성한 키를 회사용 깃허브 계정에 추가하기
* 아래 명령어로 키를 복사해서 아래 key 부분에 붙여넣기 해준다

```
pbcopy < ~/.ssh/id_rsa_work.pub
```

1. Go to Settings
2. Select SSH and GPG keys from the menu to the left.
3. Click on New SSH key, provide a suitable title, and paste the key in the box below
4. Click Add key — and you’re done!



# 6 리포지토리 클론

* `@{config에서 작성한 HOST}`

**리포지토리 클론**

```bash
# @github.com 디폴트 계정
git clone git@github.com:personal_account_name/repo_name.git
```

```bash
# @github.com-work_user1 회사용 계정
git clone git@github.com-work:worker_user1/repo_name.git
```

**이미 클론한 리포지토리**

```bash
git remote set-url origin git@github.com-work:worker_user1/repo_name.git
```



참고

* https://www.freecodecamp.org/news/manage-multiple-github-accounts-the-ssh-way-2dadc30ccaca/