#### Travis CI의 흐름

1. Git hub에 코드를 push
2. travic CI가 자동적으로 코드를 가져옴
3. 가져온 코드로 테스트 코드를 실행
4. 성공하면 운영 환경 이미지를 빌드한다.
5. 빌드된 이미지를 docker hub에 업로드한다..
6. AWS Elastic Bean Stalk에 Docker hub에 이미지를 업로드 했다고 알린다.
7. AWS Elastic Bean Stalk에서 Dockerhub에 있는 이미지를 가져온 후에 배포를 한다.



#### Travis CI의 AWS접근을 위한 API 생성

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



#### .travis.yml

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
	#외부 서비스 표시
  provider: elasticbeanstalk
  #현재 사용하고 있는 AWS가 위치하는 물리적 장소
  region: "ap-northeast-2"
  # 생선된 어플리케이션의 이름
  app: "docker-react-app"
  env: "DockerReactApp-env"
  # Elastic Beanstalk를 위한 s3 버켓 이름
  bucket_name : "elasticbeanstalk-ap-northeast-2-257684788313"
  # 어플리케이션 이름과 동일하게 작성
  bucket_path : "docker-react-app"
  # 어떤 브랜치에 push를 할 때 AWS에 배포할 것인지 설정
  on:
    branch: master
  access_key_id: $AWS_ACCESS_KEY
  secret_access_key: $AWS_SECRET_ACCESS_KEY
```



```yml
laguage: generic

sudo: required

# 앱을 도커 환경에서 실행하기 떄문에  Travis CI에게 도커 환경으로 만들라고 명시
services:
  - docker

# 도커 환경에서 dockerfile.dev를 이용해서 도커 이미지를 생성
before_install:
  - docker build -t neptunes032/react-test-app -f ./frontend/Dockerfile.dev ./frontend

#생성된 이미지를 이용해서 테스트를 수행
script:
  - docker run -e CI=true neptunes032/react-test-app npm run test

after_success:
  #테스트가 성공하면 각각의 프로젝트의 운영버전 이미지를 빌드한다.
  - docker build -t neptunes032/docker-frontend ./frontend
  - docker build -t neptunes032/docker-backend ./backend
  - docker build -t neptunes032/docker-nginx ./nginx
  #도커 허브에 빌드 된 파일을 넣어주기 위해 도커 허브에 로그인
  - echo "$DOCKER_HUB_PASSWORD" | docker login -u "$DOCKER_HUB_ID" --password-stdin
  #빌드된 이미지를 도커허브에 업로드
  - docker push neptunes032/docker-frontend
  - docker push neptunes032/docker-backend
  - docker push neptunes032/docker-nginx
  #AWS Elasitc beanstalk가 업데이트 된 빌드 이미지를 가져와 배포할 수 있도록 설정

  deploy:
    #외부 서비스 표시
    provider: elasticbeanstalk
    #현재 사용하고 있는 AWS가 위치하는 물리적 장소
    region: "ap-northeast-2"
    # 생선된 어플리케이션의 이름
    app: "docker-fullstack-app"
    env: "DockerFullstackApp-env"
    # Elastic Beanstalk를 위한 s3 버켓 이름
    bucket_name: elasticbeanstalk-ap-northeast-2-972153559337
    # 어플리케이션 이름과 동일하게 작성
    bucket_path: "docker-fullstack-app"
    # 어떤 브랜치에 push를 할 때 AWS에 배포할 것인지 설정
    on:
      branch: master
    #Travis CI의 AWS접근을 위한 액세스키와 시크릿 키를 지정 Travis CI에 환경변수로 등록되어 있음
    access_key_id: $AWS_ACCESS_KEY
    secret_access_key: $AWS_SECRET_ACCESS_KEY
```

