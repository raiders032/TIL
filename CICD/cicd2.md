1. Ec2 인스턴스에 역할 부여하기 
   * AmazonS3FullAccess

2. CodeDeploy 에이전트 설치

```shell
aws s3 cp s3://aws-codedeploy-ap-northeast-2/latest/install . --region ap-northeast-2
chmod +x ./install
sudo ./install auto
sudo service codedeploy-agent status
```

3. IAM user 생성
   * AmazonS3FullAccess
   * AWSCodeDeployFullAccess

```shell
aws configure
```

4. appspec.yml 작성

```yml
version: 0.0
os: linux
files:
  - source: /
    destination: /home/ubuntu/build
    overwirte: yes

permissions:
  - object: /
    pattern: "**"
    owner: jenkins
    group: jenkins

hooks:
  BeforeInstall:
    - location: deploy-before.sh
      runas: ubuntu
  ApplicationStart:
    - location: deploy.sh
      timeout: 60정
      runas: ubuntu
```

5. script 작성

```
./backend/sprint1/gradlew build
rm -rf deploy
mkdir deploy
cp ./build/libs/*.jar ./deploy
cp ./code-deploy/* ./deploy
cd deploy
zip -r deploy *
```



6. 