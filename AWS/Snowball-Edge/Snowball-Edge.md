# 1 Snowball Edge

-  AWS Snowball Edge는 Amazon Web Services(AWS)의 데이터 전송 솔루션 중 하나로, 대량의 데이터를 AWS 클라우드로 물리적으로 전송할 수 있도록 설계된 서비스입니다.
- 이 장치는 특히 대규모 데이터 세트를 AWS로 옮기기 위해 인터넷 연결이 느리거나 비용이 많이 드는 경우에 유용합니다. 
	- 데이터 센터에서 AWS로의 대규모 데이터 전송이 필요할 때, 특히 대역폭이 제한적이거나 비용이 많이 드는 환경에서 매우 유용합니다.
- 사용자는 물리적인 스토리지 디바이스(Snowball Edge 장비)를 주문하여 자신의 데이터센터로 배송받을 수 있고, 데이터를 이 장비에 복사한 다음, 장비를 AWS로 다시 보내 데이터를 AWS 클라우드에 업로드할 수 있습니다.
- 데이터 처리 기능도 탑재되어 있어, 데이터를 AWS로 전송하기 전에 현장에서 데이터를 분석하고 처리할 수 있습니다.
- 이 장비는 AWS Lambda 함수와 같은 컴퓨팅 기능을 지원하여, 데이터를 클라우드로 보내기 전에 사전 처리할 수 있도록 합니다.

<br>

# 2 AWS Snowball Edge를 이용한 데이터 전송 과정

- AWS Management Console에서 Snowball Edge 작업 생성
	- AWS Management Console에 로그인한 후 Snowball Edge 작업을 생성합니다. 
	- 이 작업을 통해 디바이스를 요청합니다.
- Snowball Edge 디바이스 수령
	- AWS에서 물리적인 Snowball Edge 디바이스를 지정한 주소로 배송합니다.
	- 디바이스를 수령하면 안전한 장소에 설치합니다.
- Snowball Edge 클라이언트를 사용하여 데이터 전송
	- AWS Snowball Edge 클라이언트를 사용하여 온프레미스 스토리지에서 Snowball Edge 디바이스로 데이터를 전송합니다. 
	- 디바이스는 높은 내구성을 가진 장치로, 대량의 데이터를 안전하게 저장할 수 있습니다.
- 디바이스 반환
	- 데이터 전송이 완료되면 디바이스를 다시 AWS로 반송합니다. 
	- Snowball Edge 디바이스에는 디바이스가 손상되지 않도록 하는 내구성이 뛰어난 패키징이 제공됩니다
- AWS에서 데이터 가져오기:
	- AWS가 디바이스를 수령하면 데이터를 AWS 클라우드(예: Amazon S3)로 업로드합니다. 
	- 이 과정은 AWS에서 자동으로 처리됩니다.

<br>

# 3 AWS Snowball Edge의 장점

- **대용량 데이터 전송**
    - 인터넷 대역폭을 사용하지 않고 대용량 데이터를 빠르고 안전하게 전송할 수 있습니다. 
    - 수십 TB에서 수백 TB까지 데이터를 전송하는 데 이상적입니다.
- **보안**
    - 전송 중 데이터는 256비트 암호화로 보호되며, 디바이스 자체에도 내장된 암호화 키가 포함되어 있습니다.
- **비용 절감**
    - 대용량 데이터를 인터넷을 통해 전송할 때 발생하는 비용을 절감할 수 있습니다. 
    - 특히 인터넷 대역폭이 제한된 환경에서 유용합니다.
- **편리성**
    - 사용자가 데이터를 로컬로 전송한 후 AWS가 데이터를 S3로 업로드하므로 네트워크 트래픽을 최소화할 수 있습니다.