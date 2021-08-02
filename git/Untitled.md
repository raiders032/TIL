# GitLab and SSH keys

> GitLab은 SSH 프로토콜을 사용하여 Git와 안전하게 통신합니다. SSH 키를 사용하여 GitLab 원격 서버에 인증하는 경우 매번 사용자 이름과 암호를 제공하지 않아도 됩니다.



## 필수 조건

* The OpenSSH client, GNU/리눅스, macOS, 윈도우 10에 사전 설치 되어있음
* SSH version 6.5 이상



## 지원되는 SSH 키 유형

* [ED25519](https://docs.gitlab.com/ee/ssh/#ed25519-ssh-keys)
* [RSA](https://docs.gitlab.com/ee/ssh/#rsa-ssh-keys)
* DSA ([Deprecated](https://about.gitlab.com/releases/2018/06/22/gitlab-11-0-released/#support-for-dsa-ssh-keys) in GitLab 11.0.)
* ECDSA (As noted in [Practical Cryptography With Go](https://leanpub.com/gocrypto/read#leanpub-auto-ecdsa), the security issues related to DSA also apply to ECDSA.)

> Practical Cryptography With Go라는 책에서 ED25519 키가 RSA 키보다 더 안전하고 성능이 우수하다고 한다.



## 이미 SSH 키 쌍이 있는지 확인하기

1. Windows, Linux 또는 macOS에서 홈 디렉토리로 이동합니다.
2. `.ssh/` 디렉토리로 이동합니다. 
   * `.ssh/` 디렉토리가 없는 경우 홈 디렉토리에 없거나 이전에 ssh를 사용하지 않은 것입니다. 
3. 후자의 경우 SSH 키 쌍을 생성해야 합니다.
4. 다음 형식 중 하나를 사용하는 파일이 있는지 확인합니다.

| Algorithm                        | Public key       | Private key  |
| :------------------------------- | :--------------- | :----------- |
| ED25519 (preferred)              | `id_ed25519.pub` | `id_ed25519` |
| RSA (at least 2048-bit key size) | `id_rsa.pub`     | `id_rsa`     |
| DSA (deprecated)                 | `id_dsa.pub`     | `id_dsa`     |
| ECDSA                            | `id_ecdsa.pub`   | `id_ecdsa`   |



## SSH 키 쌍 생성

* SSH key 쌍이 존재하지 않으면 새로운 SSH key 쌍을 만들어 보자

1. 터미널을 엽니다.
2. `ssh-keygen -t` 다음에 키 유형 및 설명(선택 사항)을 입력합니다. 이 설명은 생성된 .pub 파일에 포함되어 있습니다. 
   * ED25519인 경우 -> `ssh-keygen -t ed25519 -C "<comment>"`
   * RSA인 경우 -> `ssh-keygen -t rsa -b 2048 -C "<comment>"`
   * "<comment>" 로 이메일 주소를 사용할 수 있습니다.

3. 엔터 누르기

   ```bash
   Generating public/private ed25519 key pair.
   Enter file in which to save the key (/home/user/.ssh/id_ed25519):
   ```

4. 암호 지정

   ```bash
   Enter passphrase (empty for no passphrase):
   Enter same passphrase again:
   ```

5. 파일이 저장된 위치에 대한 정보를 포함하여 확인 메시지가 표시됩니다.

   ```bash
   Your identification has been saved in /Users/YT/.ssh/id_ed25519.
   Your public key has been saved in /Users/YT/.ssh/id_ed25519.pub.
   The key fingerprint is:
   SHA256:RmiwYbWH5caBtBOQejUablVFrBWs4Hknpo90HIIIFMY YT@yeongsamnoui-MacBookPro.local
   The key's randomart image is:
   +--[ED25519 256]--+
   |o+. ==+o+=+.     |
   |oE .o+*X .+      |
   | . +.BB+*+       |
   |  o *.+=B .      |
   |   o   *S+       |
   |      o.o        |
   |     . +         |
   |      . .        |
   |                 |
   +----[SHA256]-----+
   ```

   * 다른 디렉토리를 가리키도록 SSH 구성싶다면 [참조](https://docs.gitlab.com/ee/ssh/#configure-ssh-to-point-to-a-different-directory)
   * [SSH 키 암호 업데이트하고싶다면](https://docs.gitlab.com/ee/ssh/#update-your-ssh-key-passphrase)



## GitLab 계정에 SSH 키 추가

* SSH를 GitLab과 함께 사용하려면 공개 키를 GitLab 계정에 등록해야 한다.

1. 퍼블릭 키 파일의 내용 복사하기

   * **macOS:**`tr -d '\n' < ~/.ssh/id_ed25519.pub | pbcopy`
   * **Git Bash on Windows:** `cat ~/.ssh/id_ed25519.pub | clip`

2. **Preferences** 클릭

   ![image-20210609195030494](/Users/YT/GoogleDrive/dev/TIL/git/Gitlb SSH/images/image-20210609195030494.png)

3. **SSH Keys**. 클릭

4. **Key** 박스에 퍼블릭 키 파일의 내용 붙여넣기

5. **Title** 입력

6. **Add key** 클릭

