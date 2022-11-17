# 1 SSH 사용해서 GitHub 접속하기



# 2 SSH key 존재 유무 확인

* SSH key를 생성하기전 이미 생성된 SSH key가 있는지 확인해보자
* 터미널에서 아래 명령어 입력하고 아래와 같은 파일이 있다며 이미 존재하는 것이다
  * `id_rsa.pub`
  * `id_ecdsa.pub`
  * `id_ed25519.pub`

```bash
ls -al ~/.ssh
```



# 3 SSH key 생성하기

**Mac**

```bash
# 입력 후 계속 엔터입력하면 기본 위치에 SSH key가 생성된다 passphrase도 비워뒀다
$ ssh-keygen -t ed25519 -C "your_email@example.com"
Generating public/private ed25519 key pair.
Enter file in which to save the key (/Users/YT/.ssh/id_ed25519):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
```

**리눅스**

```bash
ssh-keygen -t ed25519 -C "nameks@naver.com"
```



# 4 ssh-agent에 SSH Key 등록

```bash
# ssh-agent 실행 확인
$ eval "$(ssh-agent -s)"

# ssh-agent에 키 등록(맥)
$ ssh-add -K ~/.ssh/id_ed25519

# ssh-agent에 키 등록(리눅스)
$ ssh-add ~/.ssh/id_ed25519
```



# 5 config 파일 생성

```bash
vi ~/.ssh/config
```

Mac

* multiple GitHub account
  * `git remote add origin git@github.com:work_user1/repo_name.git`
  * `git remote add origin git@github.com-tmax:work_user1/repo_name.git` 

```
# default 계정
Host github.com
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519

# 회사 계정
Host github.com-tmax
  HostName github.com
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519_tmax
```



리눅스

```
Host github.com
  User git
  Hostname github.com
  PreferredAuthentications publickey
  IdentityFile ~/.ssh/id_ed25519
```



# 6 GitHub 설정

* 생성한 키를 깃허브 계정에 추가하기
* 아래 명령어로 키를 복사해서 아래 key 부분에 붙여넣기 해준다

```
pbcopy < ~/.ssh/id_ed25519.pub
```



![Settings icon in the user bar](https://docs.github.com/assets/images/help/settings/userbar-account-settings.png)

![Authentication keys](https://docs.github.com/assets/images/help/settings/settings-sidebar-ssh-keys.png)

![SSH Key button](https://docs.github.com/assets/images/help/settings/ssh-add-ssh-key.png)

![The key field](https://docs.github.com/assets/images/help/settings/ssh-key-paste.png)

![The Add key button](https://docs.github.com/assets/images/help/settings/ssh-add-key.png)

![Sudo mode dialog](https://docs.github.com/assets/images/help/settings/sudo_mode_popup.png)



참고

* https://www.freecodecamp.org/news/manage-multiple-github-accounts-the-ssh-way-2dadc30ccaca/
