# Nginx





# NGINX Configuration Files

- [레퍼런스](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/)
- 텍스트 베이스의 설정 파일을 작성해 Nginx을 설정할 수 있다.
- 설정 파일을 작성하는 법을 알아보자.
- 기본적으로 이 설정 파일의 이름은 `nginx.conf`다.



## Feature-Specific Configuration Files

- [레퍼런스](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/)
- 관리의 용이성을 생각해서 하나의 설정 파일의 모든 설정을 하지말고 목적에 맞게 설정파일을 분리하는 것을 추천한다.



**예시**

- main `nginx.conf`에서 목적에 맞게 분리된 설정 파일을 불러올 수 있다.

```nginx
include conf.d/http;
include conf.d/stream;
include conf.d/exchange-enhanced;
```



## Directives

- 설정 파일은 Directives와 Directives의 파라미터로 구성된다.
- Directive는 Simple directive와 directive로 구분된다.
- directive는 관련된 여러 directive를 중괄호를 묶어 block을 가질 수 있다.



**예시**

- Simple directive는 아래와 같이 한줄로 적을 수 있다.

```nginx
user             nobody;
error_log        logs/error.log notice;
worker_processes 1;
```



## Contexts

- Top Level Directive 중 몇개를 Contexts라고 부른다.
  - [events](https://nginx.org/en/docs/ngx_core_module.html#events) – General connection processing
  - [http](https://nginx.org/en/docs/http/ngx_http_core_module.html#http) – HTTP traffic
  - [mail](https://nginx.org/en/docs/mail/ngx_mail_core_module.html#mail) – Mail traffic
  - [stream](https://nginx.org/en/docs/stream/ngx_stream_core_module.html#stream) – TCP and UDP traffic



**예시**

```nginx
user nobody; # a directive in the 'main' context

events {
    # configuration of connection processing
}

http {
    # Configuration specific to HTTP and affecting all virtual servers  

    server {
        # configuration of HTTP virtual server 1       
        location /one {
            # configuration for processing URIs starting with '/one'
        }
        location /two {
            # configuration for processing URIs starting with '/two'
        }
    } 
    
    server {
        # configuration of HTTP virtual server 2
    }
}

stream {
    # Configuration specific to TCP/UDP and affecting all virtual servers
    server {
        # configuration of TCP virtual server 1 
    }
}
```





# Configuring Web Server

- [레퍼런스](https://docs.nginx.com/nginx/admin-guide/web-server/web-server/)
- configuration 파일에는 적어도 한개의 server Directive가 있어여한다.
  - Nginx가 요청을 처리할 때 Nginx 먼저 해당 요청을 처리할 virtual server를 선택하기 때문이다.



## Setting Up Virtual Servers

```nginx
http {
    server {
        # Server configuration
    }
}
```

- Virtual Server를 만드려면 위와 같이 http 컨텍스트 안에 server Directive를 정의한다.
- http 컨텍스트 안에 여러 가상 서버를 만드려면 여러개의 server Directive를 정의하면 된다.



```nginx
server {
    listen 127.0.0.1:8080;
    # Additional server configuration
}
```

- `server` configuration block은 대게 listen directive를 포함하고 있다.
  - `listen`: 가상 서버가 요청을 받을 IP 주소와 포트를 명시한다.



## Configuring Locations

- 



## Rewriting HTTP Responses

- HTTP 응답을 수정하는 방법



**예시**

```nginx
http {
    server {
        # Server configuration
    }
}
```



# CORS

- 



**Enable CORS from all websites**

```nginx
server {
	add_header Access-Control-Allow-Origin *;
}
```



**Enable CORS from one domain**

```nginx
server {
	add_header Access-Control-Allow-Origin "example1.com";
	add_header Access-Control-Allow-Origin "example2.com";
	add_header Access-Control-Allow-Origin "example3.com";
}
```

