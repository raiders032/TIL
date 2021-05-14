# Set up

## Git Config

**See all the config**

```bash
git config --list #show all the settings in gitconfig
```

**Open config to edit**

* git config를 에디터로 수정하기

```bash
git config --global -e #open .gitconfig file
```

**Set default editor**

* 기본 에디터 설정하기

```bash
git config --global core.editor "code --wait" # 기본 에디터로 vscode 사용하기
git config --global core.editor "vim" # 기본 에디터로 vim 사용하기
```

**User settings**

```bash
git config --global user.name "name" #user.name을 "name"으로 설정
git config --global user.email "email" #user.email을 "email"로 설정
git config user.name #user.name 조회
git config user.email #user.email 조회
```

**Set Auto CRLF**

* 운영체제마다 줄바꿈을 할 때 사용되는 문자열이 다르다.
  * 윈도우의 줄바꿈: `\r\n`
  * 맥의 줄바꿈: `\n`
* 윈도우는 `git config --global core.autocrlf true` 로 설정하면
  * 깃에 저장할 때는 `\r`을 삭제하고
  * 깃에서 불러올 때는  `\r`을 자동으로 붙여준다.
* 맥에서는 `git config --global core.autocrlf input` 으로 설정하면
  * 깃에서 불러올 때는 수정이 없고
  * 저장할때는 `\r` 을 삭제해준다.
  * 맥에서는 `\r` 이 사용되지 않지만 복사 붙여넣기한 문자열에 `\r` 이 들어갈 수 있기 때문에 제거해준다.

```bash
git config --global core.autocrlf true #for Windows
git config --global core.autocrlf input #for Mac
```

**Git Aliases**

```bash
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
```



## Help

**Git official site**

https://git-scm.com/docs

**See help**

```bash
git config --help #detail
git config -h #short
```

# Basic

## git init

```bash
git init #initialise git 
rm -rf .git #delete .git 
```

## git status

* working tree의 상태를 보여준다.

```bash
git status #full status
git status -s #short status
```

## Ignoring Files

* 깃으로 관리하고 싶지 않은 파일을 설정할 때 사용된다.
* `.gitignore` 파일에 깃으로 관리하지 않을 파일을 명시한다.

```bash
# ignore all .a files
*.a

# but do track lib.a, even though you're ignoring .a files above
!lib.a

# only ignore the TODO file in the current directory, not subdir/TODO
/TODO

# ignore all files in any directory named build
build/

# ignore doc/notes.txt, but not doc/server/arch.txt
doc/*.txt

# ignore all .pdf files in the doc/ directory and any of its subdirectories
doc/**/*.pdf
```

## Staging files

```bash
git add a.txt #stage a.txt file
git add a.txt b.txt #stage a.txt, b.txt files
git add *.txt #stage all files ends with .txt 
git add * #stage all files except deleted files and files that begin with a dot
git add . #stage everything 
```

## Modifying files

**Removing files**

```bash
rm file.txt #delete file
git add file.txt #add to staging area
git rm file.txt # removes file from working directory and staging area
git rm --cached file.txt #removes from staging area only
git clean -fd #removes all untracked files
```

**Moving files**

```bash
git mv from.txt to.txt
git mv from.text /logs/from.text
```

## git diff

* working directory 또는 staging area의 변경사항을 확인한다.

```bash
git diff #working directory의 변경 사항 확인
git diff --staged #staging area의 변경 사항 확인
git diff --cached #위와 같음
```

* 별도의 툴을 설정해서 더 편리하게 사용가능하다.
* 툴로 vscode를 사용하는 설정 예시

```bash
# 설정
git config --global -e
```

```bash
# .gitconfig 설정 정보
[diff]
    tool = vscode
[difftool "vscode"]
    cmd = code --wait --diff $LOCAL $REMOTE
```

```bash
# 설정후 사용
git difftool
git difftool --staged
```



## Commit

```bash
git commit #commit stagged files
git commit -m "Commit message" #commit stagged files with commit message
git commit -am "Commit message" #commit all files with commit message
```



---



## Log · History

### See history

```bash
git log #list of commits 
git log --patch #shows the difference introduced in each commit
git log -p #same as --patch
git log --state #abbreviated states for each commit
git log --oneline #oneline
git log --oneline --reverse #oneline, from the oldest to the newest 
```

### Formatting

```bash
git log --pretty=oneline #same as --oneline
git log --pretty=format:"%h - %an %ar %s" #formatting
git log --pretty=format:"%h %s" --graph #show graph
git log --graph --all --pretty=format:'%C(yellow)[%ad]%C(reset) %C(green)[%h]%C(reset) | %C(white)%s %C(bold red){{%an}}%C(reset) %C(blue)%d%C(reset)' --date=short
```

### Filtering

```bash
git log -2 #shows only the last n commits
git log --author="ellie" 
git log --before="2020-09-29"
git log --after="one week ago"
git log --grep="message" #finds in commit messages
git log -S "code" #finds in the code
git log file.txt #logs only for file.txt
```

### History of a file

```bash
git log file.txt #history of file.txt
git log --state file.txt #shows statistics
git log --patch file.txt #show the changes
```

### HEAD · Hash code

```bash
git log HEAD
git log HEAD~1
git log hash
```

### Viewing a commit

```bash
git show HEAD #shows the last commit
git show hash #shows the given commit
git show hash:file.txt 
```

### Comparing

```bash
git diff hash1 hash2 #all changes between two commits
git diff hash1 hash2 file.txt #changes to file.txt only
```



---

## git checkout

* 브랜치를 변경하거나 워킹 트리의 파일을 복구하는데 사용한다.

```bash
git checkout HEAD
git checkout HEAD~1
git checkout <hash>
git checkout testing #switches to testing branch
git checkout v1.0.0 #checkout certain tag
git checkout -b testing #create and switch to testing 
```



---



## Tagging

### Creating

```bash
git tag v1.0.0 #lightweight tag on latest commit
git tag v1.0.0 hash #lightweight tag on the given commit
git show v.0.0 #shows the tag
git tag -a v.1.0.0 -m "message" #annotated tag
```

### Listing

```bash
git tag #all the tags
git tag -l "v1.0.*" #search certain tags
```

### Deleting

```bash
git tag -d v1.0.0 #delete the given tag
```

### Syncing with Remote

```bash
git push origin v1.0.0 #sharing the given tag with remote
git push origin --tags #sharing all the tags
git push origin --delete v1.0.0 #delete a remote tag 
```

### Checking out Tags

```bash
git checkout v1.0.0 #checkout certain tag
git checkout -b branchName v1.0.0 #create a new bracnh with the given tag 
```

# Branch

## Creating branch

```bash
git branch testing #create a new branch called testing
git checkout testing #switches to testing branch
git switch testing #same as the above
git checkout -b testing #create and switch to testing 
git switch -C testing #same as the above
```

### Managing Branch

```bash
git branch #simple listing of all branches
git branch -r #sees the remote branches
git branch --all #list including remote branches
git branch -v #sees the last commit on each branch
git branch --merged #sees merged branches
git branch --no-merged #sees not merged branches
git branch -d testing #deletes the branch
git push origin --delete testing
git branch --move wrong correct #rename
git push --set-upstream origin correct #push new name
```

### Comparing

```bash
git log branch1..branch2 #all the commits between branch1 and branch2
git diff branch1..branch2 #all the changes between branch1 and branch2
```

## Merge

```bash
git merge featureA #merges featureA branch into the current one
git merge --squash featureA #suqash merge, only one commit
git merge --no-ff featureA #creates a merge commit 
git merge --continue q
git merge --abort #conflicts이 발생했을 때 merge 취소
git mergetool #opens merge tool 
```

**Merge tool Config**

```bash
[merge]
    tool = vscode
[mergetool]
	keepBackup = false
[mergetool "vscode"]
    cmd = code --wait $MERGED
[mergetool "p4merge"]
    path = "/Applications/p4merge.app/Contents/MacOS/p4merge"
```

## Rebasing

* 로컬에서 작업하거나 브랜치에서 혼자 작업할 때 유용하게 쓰인다.
* 패스트 포워트 머지를 위해 사용하면 좋다.
* 이미 리모트에 커밋이 올라가 있거나 여러사람이 작업하는 브랜치에서는 사용에 주의하자

```bash
git rebase master #rebase current branch onto the master
git rebase --onto master service ui #take commits of the ui branch forked from the service branch and move them to master
```

## Cherry picking

```bash
git cherry-pick hash #applies the given commit 
```

# Stashing

* working directory에 변경사항이 있고 브랜치를 전환해야 할 때 변경사항을 잠시 저장해두고 브랜치를 전환할 수 있다.
* 여러가지 시도를 할 때 잠시 저장하는데 사용하기도 한다.

### Saving

```bash
git stash push -m "message" #make a new stash
git stash #same as above
git stash --keep-index #stash but keep them in the staging area
git stash -u #--include-untracked 
```

### Listing

```bash
git stash list #see all the stashes
git stash show hash #see the given stash
git stash show hash -p #see the given stash with details 
```

### Applying

```bash
git stash apply hash #applies the given stash
git stash apply #applies the latest stash
git stash apply --index #apply the stated changes
git stash pop #apply and drop 
git stash branch branchName #apply stash in a new branch
```

### Deleting

```bash
git stash drop hash #deletes the given stash
git stash clear #deletes all the stashes
```

# Undo

## Local Changes

**Unstaging a staged file**

```bash
git reset HEAD file.txt
```

**Unmodifying a modified file**

```bash
git checkout -- file.txt
```

**Discarding local changes**

```bash
git restore --staged file.txt #unstaging a staged file
git restore file.txt #unmodifying a modified file
git restore . #unmodifying all modified files in the directory
git clean -fd #removes all untracked files
```

**Restoring file from certain commit**

```bash
git restore --source=hash file.txt
git restore --source=HEAD~2 file.txt
```

## Commit

**Amending the last commit**

```bash
git commit --amend
```

## Reset

```bash
git reset --soft HEAD #removes the commit and keep changes at staging area
git reset --mixed HEAD #removes the commit and keep changes at working directory
git reset --hard HEAD #removes the commit and don't keep the code
```

## Undo action - reflog

```bash
git reflog
git reset --hard hash
```

## Revert

* 이미 서버에 올라간 커밋을 취소할 떄 사용한다.

```bash
git revert hash #reverts the given commit
git revert HEAD~1 
gut revert --no-commit hash #reverts the given commit without revert commit
```

## Interactive Rebasing

```bash
git rebase -i HEAD~2
git rebase --continue
git rebase --abort
```

# Remote

```bash
git clone URL #cloning
git remote -v #shows all the remote URLs
git remote add name URL #add a new remote with name
```

**Inspecting**

```bash
git remote
git remote show 
git remote show origin
```

**Syncing with remotes**

```bash
git fetch #pulls down all the data from remote 
git fetch origin #same as the above
git fetch origin master #pulls down only master branch
git pull #fetch and merge
git pull --rebase #use rebase when pulling instead of merge
git push
git push origin master 
```

**Renaming or Removing**

```bash
git remote rename sec second
git remote remove second
```

# Tools

## Basic Debugging

```bash
git blame file.txt
```

## Bisect

```bash
git bisect start
git bisect good hash
git bisect good 
git bisect bad
git bisect reset
```

## Config

```bash
[alias]
	s = status
	l = log --graph --all --pretty=format:'%C(yellow)%h%C(cyan)%d%Creset %s %Cgreen(%cr) %C(magenta)<%an>%Creset'
	up = !git fetch origin master && git rebase origin/master
	co = checkout
	ca = !git add -A && git commit -m 
	cad = !git add -A && git commit -m "."
	c = commit
	b = branch
  list = stash list
  save = stash save 
	pop = stash pop
	apply = stash apply
	rc = rebase —continue
	get = "!f(){ git fetch && git checkout $1 && git reset --hard origin/$1; };f"
	new = "!f(){ git co -b ellie-$1 origin/master && git pull; };f"
	st = status
	hist = log --graph --all --pretty=format:'%C(yellow)[%ad]%C(reset) %C(green)[%h]%C(reset) | %C(white)%s %C(bold red){{%an}}%C(reset) %C(blue)%d%C(reset)' --date=short
```

