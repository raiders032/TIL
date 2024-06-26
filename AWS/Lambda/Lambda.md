# 1 Lambda

- AWS Lambda는 개발자가 서버의 프로비저닝이나 관리 없이 코드를 실행할 수 있게 해주는 서버리스 컴퓨팅 서비스입니다.
- 이벤트 중심의 설계로 다양한 애플리케이션과 백엔드 서비스에 최적화되어 있으며, 사용자는 사용한 만큼의 비용만 지불하면 됩니다. 
- AWS의 200개 이상 서비스와 다양한 SaaS 애플리케이션에서 Lambda를 트리거할 수 있습니다.

<br>

## 1.1 작동 방식

- AWS Lambda를 사용하면 서버의 설정, 스케일링 또는 관리에 신경 쓸 필요 없이 코드를 실행할 수 있습니다.
- 사용자는 단순히 코드를 Lambda로 업로드하면 됩니다.
	- 업로드는 ZIP 파일 형태나 컨테이너 이미지로 가능합니다.
- 이후, 이벤트를 기반으로 하여 코드가 자동으로 실행됩니다. 
	- 예를 들어, S3 버킷에 새 파일이 업로드 될 때마다 코드가 실행될 수 있습니다. 
- Lambda는 이벤트의 유형과 크기에 따라 자동으로 컴퓨팅 리소스를 조정하고, 실행된 코드에 대해서만 요금을 부과합니다.

<br>

# 2 Lambda의 이점

## 2.1 서버 관리 불필요

- 인프라를 프로비저닝하거나 관리하지 않고 코드를 실행합니다.
- zip 파일 또는 컨테이너 이미지로 코드를 작성하고 업로드하면 됩니다.
- AWS가 서버의 프로비저닝, 유지보수, 확장 등을 자동으로 처리합니다. 
- 개발자는 코드의 실행에만 집중할 수 있습니다.

<br>

## 2.2 자동 조정

- 하루에 수십 개의 이벤트에서 초당 수십만 개에 이르기까지 어떤 규모에서든 코드 실행 요청에 자동으로 응답합니다.
- Lambda는 요청의 수에 따라 자동으로 확장되므로, 사용자는 코드가 항상 적절한 규모로 실행되는 것을 확신할 수 있습니다.

<br>

## 2.3 종량 요금제

- 피크 용량에 대해 사전에 인프라를 프로비저닝하는 대신, 밀리초 기준으로 사용하는 컴퓨팅 시간에 대해서만 요금을 지불하여 비용을 절감합니다.
- AWS Lambda는 실행된 컴퓨팅 시간을 밀리초 단위로 측정하여 요금을 부과합니다.
	- 이는 사용하지 않는 리소스에 대한 비용이 발생하지 않음을 의미합니다. 
	- 따라서, 피크 시간에만 리소스를 사용하는 애플리케이션에 이상적입니다.

<br>

## 2.4 성능 최적화

- 올바른 함수 메모리 크기로 코드 실행 시간 및 성능을 최적화합니다.
- 프로비저닝된 동시성으로 두 자릿수 밀리초 단위에서 높은 수요에 응답합니다.