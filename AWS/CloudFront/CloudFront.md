# 1 Cloud Front

- [레퍼런스](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html)
- Amazon CloudFront는 사용자에게 HTML, CSS, JS, 이미지 파일과 같은 정적 및 동적 웹 콘텐츠의 배포 속도를 높여주는 CDN 서비스다.
- CloudFront는 전 세계 데이터 센터 네트워크인 엣지 로케이션을 통해 콘텐츠를 사용자와 가까운 곳에서 전달한다.
- 사용자가 CloudFront로 제공되는 콘텐츠를 요청하면, 요청은 최소의 지연 시간을 제공하는 엣지 로케이션으로 전달된다, 따라서 최상의 성능으로 콘텐츠가 제공된다.

<br>


> [!NOTE] CDN (Content Delivery Network)
 CDN은 Content Delivery Network의 약자로, 사용자에게 웹 콘텐츠를 빠르게 전달하기 위해 전 세계 여러 지점에 데이터를 복제해 놓는 네트워크 시스템을 의미한다. 기본 원리는 사용자가 어떤 콘텐츠(이미지, 동영상, 웹 페이지 등)에 접근하려 할 때, 가장 가까운 서버에서 해당 콘텐츠를 받아볼 수 있도록 하는 것이다. 이를 통해 콘텐츠 로딩 시간을 줄이고, 서버의 부하를 분산시켜 웹 서비스의 효율과 속도를 향상시킨다.

<br>

## 1.1 동작 방식

- 만약 콘텐츠가 지연 시간이 가장 적은 엣지 로케이션에 이미 있다면, CloudFront는 즉시 그것을 전달한다.
- 만약 그 엣지 로케이션에 콘텐츠가 없다면, CloudFront는 사용자가 정의한 Origin에서 그 콘텐츠를 가져온다.
	- 해당 컨텐츠는 엣지 로케이션에 캐시되어 다음 요청에는 빠르게 응답할 수 있다.

<br>

# 2 Invalidating files

- [레퍼런스](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html)
- CloudFront는 콘텐츠를 캐싱하기 때문에 Origin의 콘텐츠를 업데이트해도 TTL이 지나기 전까지는 CloudFront는 업데이트 된 콘텐츠를 가져오지 않는다.
- 콘텐츠를 업데이트하고 이를 바로 CloudFront에 반영하고 싶다면 Invalidating 기능을 사용해서 캐시의 일부분을 제거할 수 있다.
	- 캐시에서 콘텐츠를 제거하면 다음 요청에 의해서 최신 버전의 콘텐츠를 Origin에서 가져올 것이다.