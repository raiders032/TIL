# Amazon Route 53

> Amazon Route 53은 가용성과 확장성이 우수한 DNS(도메인 이름 시스템) 웹 서비스입니다. Route 53을 사용하여 세 가지 주요 기능, 즉 도메인 등록, DNS 라우팅, 상태 확인을 조합하여 실행할 수 있습니다. 세 기능 모두에 Route 53을 사용하도록 선택한 경우 이 순서대로 단계를 수행합니다.



## 주요기능

1. **도메인 이름 등록**

   > 웹사이트에는 example.com 같은 이름이 필요합니다. Route 53을 통해 *도메인 이름*이라고 하는 웹사이트 또는 웹 애플리케이션의 이름을 등록할 수 있습니다.

2. **인터넷 트래픽을 도메인의 리소스로 라우팅**

   > 사용자가 웹 브라우저를 열어 주소 표시줄에 도메인 이름(example.com) 또는 하위 도메인 이름(acme.example.com)을 입력한 경우 Route 53은 브라우저를 웹 사이트 또는 웹 애플리케이션에 연결하도록 돕습니다.

3. **리소스의 상태 확인**

   > Route 53은 인터넷을 통해 웹 서버 같은 리소스로 자동화된 요청을 보내어 접근 및 사용이 가능하고 정상 작동 중인지 확인합니다. 리소스를 사용할 수 없게 될 때 알림을 수신하고 비정상 리소스가 아닌 다른 곳으로 인터넷 트래픽을 라우팅할 수도 있습니다.



___



## AWS에서 도메인 구매하기

* https://console.aws.amazon.com/route53/v2/home#Dashboard

![image-20210129210140340](image-20210129210140340.png)

1. 도메인 검색

   ![image-20210129211206105](image-20210129211206105.png)

2. 연락처 세부 정보

   ![image-20210129211527404](image-20210129211527404.png)

3. 확인 및 구매

   ![image-20210129211709588](image-20210129211709588.png)



## 도메인네임 서버 (hosted zone) 생성

* Amazon Route 53을 통해 도메인을 구매하면 자동적으로 생성된다.

![image-20210129213621730](image-20210129213621730.png)

* 수동 생성

![Route_53_Console_Hosted_Zones](Route_53_Console_Hosted_Zones.png)

![Route_53_Console_Hosted_Zones-3542658](Route_53_Console_Hosted_Zones-3542658.png)

네임서버 확인하기

```bash
$ dig +trace momelet.world
```

![YT_yeongsamnoui-MacBookPro__](YT_yeongsamnoui-MacBookPro__.png)



### 도메인의 네임서버 갱신하기

![Route_53_Management_Console_및_Route_53_md](Route_53_Management_Consol_Route_53_md.png)

![Route_53_Management_Console](/Users/YT/GoogleDrive/dev/md/AWS/Route 53/images/Route_53_Management_Console.png)



![Route_53_Management_Console-3729335](Route_53_Management_Console-3729335.png)

![Route_53_Management_Console-3729375](Route_53_Management_Console-3729375.png)



## Amazon EC2 인스턴스로 트래픽을 라우팅

* [참고](https://docs.aws.amazon.com/ko_kr/Route53/latest/DeveloperGuide/routing-to-ec2-instance.html)

1. Amazon EC2 인스턴스의 IP 주소 가져옵니다.
   * 인스턴스와 탄력적 IP를 연결하지 않은 경우 **IPv4 퍼블릭 IP**. 값을 가져옵니다.
2. 트래픽을 라우팅할 도메인의 이름과 일치하는 호스팅 영역 이름을 선택합니다.
   * [https://console.aws.amazon.com/route53](https://console.aws.amazon.com/route53/)
3. **Create Record Set(레코드 세트 생성)**.를 선택합니다.

![image-20210129224329812](image-20210129224329812.png)

참고

* https://www.youtube.com/watch?v=AnViePe2mj8&list=PLuHgQVnccGMCas8a4f0uIg5X4uERoG6gb&index=1