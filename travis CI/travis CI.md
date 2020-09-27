## Travis CI의 흐름

1. Git hub에 코드를 push
2. travic CI가 자동적으로 코드를 가져옴
3. 가져온 코드로 테스트 코드를 실행
4. 성공하면 운영 환경 이미지를 빌드한다.
5. 빌드된 이미지를 docker hub에 업로드한다..
6. AWS Elastic Bean Stalk에 Docker hub에 이미지를 업로드 했다고 알린다.
7. AWS Elastic Bean Stalk에서 Dockerhub에 있는 이미지를 가져온 후에 배포를 한다.



## Travis CI의 AWS접근을 위한 API 생성



1. IAM 유저 생성
   * Identity and Access Management
   * AWS 리소스에 대한 액세스를 안전하게 제어 할 수 있는 웹 서비스이다.
   * Root 사용자 :  aws에 가입하여 사용하고 있는 계정
     * AWS 서비스 및 리소스에 대한 완전한 액세스 권한이 있다.
     * 루트 사용자를 직접 사용하는 것은 보안성 좋지 않다.
   * IAM 사용자 : root 사용자가 부여한 권한만 가지고 있다.

2. IAM 유저에게 elasticbeanstalk 액세스 권한을 부여한다.
3. IAM 유저 생성 후 액세스 키와 비밀 액세스 키를 발급 받는다.
4. 발급 받은 키들을 Travis ci 설정에서 환경 변수로 추가한다
5. .travis.yml에서 등록한 환경변수를  다음과 같이 사용한다. `$지정한이름`

```yml
sudo: required

language: generic

services:
  - docker

before_install:
  - echo "start Creating an image with dockerfile"
  - docker build -t nys/docker-react-app -f Dockerfile.dev .

script:
  - docker run -e CI=true nys/docker-react-app npm run test -- --coverage

after_success:
  - echo "Test Success"

deploy:
  provider: elasticbeanstalk
  region: "ap-northeast-2"
  app: "docker-react-app"
  env: "DockerReactApp-env"
  bucket_name : "elasticbeanstalk-ap-northeast-2-257684788313"
  bucket_path : "docker-react-app"
  on:
    branch: master
  access_key_id: $AWS_ACCESS_KEY
  secret_access_key: $AWS_SECRET_ACCESS_KEY
```



