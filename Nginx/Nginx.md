# Nginx





# NGINX Configuration Files

- [레퍼런스](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/)
- 텍스트 베이스의 설정 파일을 작성해 Nginx을 설정할 수 있다.
- 설정 파일을 작성하는 법을 알아보자.
- 기본적으로 이 설정 파일의 이름은 `nginx.conf`다.



## Feature-Specific Configuration Files

- [레퍼런스](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/)
- 관리의 용이성을 생각해서 하나의 설정 파일의 모든 설정을 하지말고 목적에 맞게 설정파일을 분리하는 것을 추천한다.
- `/etc/nginx/conf.d` 위치에 분리된 설정 파일을 놓는다.



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
- 디렉티브 문서 참고
  - https://nginx.org/en/docs/dirindex.html




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



**directive: listen**

```nginx
server {
    listen 127.0.0.1:8080;
    # Additional server configuration
}
```

- `server` configuration block은 대게 listen directive를 포함하고 있다.
  - `listen`: 가상 서버가 요청을 받을 IP 주소와 포트를 명시한다.



## Configuring Locations

- [레퍼런스](https://docs.nginx.com/nginx/admin-guide/web-server/web-server/#locations)
- `location` directive의 파라미터의 타입은 두 가지다.
  - prefix string(pathnames)
  - regular expressions




**prefix string(pathnames)**

- prefix strings 타입의 파라미터를 지정하면 request URI가 prefix strings으로 시작되면 매칭된다.

```nginx
location /some/path/ {
    #...
}
```

- 위와 같이 설정하면 `/some/path/document.html`과는 매칭되지만 `/my-site/some/path`와는 매칭되지 않는다.



**regular expressions**

- 파라미터로 regular expressions를 사용하면 정규 표현식을 사용해서 path를 매칭시킬 수 있다.

```nginx
location ~ \.html? {
    #...
}
```

- regular expressions 타입의 파라미터를 사용할 때 location과 정규표현식 사이에 `~`를 넣어준다.



**NGINX Location Priority**

- 요청에 매칭되는 Location이 여러개인 경우 어떻게 될까?
- 우선 순위가 정해져 있기 때문에 우선 순위에 맞는 최적에 location을 선택한다.



**우선 순위**

1. Test the URI against all prefix strings.
2. The `=` (equals sign) modifier defines an exact match of the URI and a prefix string. If the exact match is found, the search stops.
3. If the `^~` (caret-tilde) modifier prepends the longest matching prefix string, the regular expressions are not checked.
4. Store the longest matching prefix string.
5. Test the URI against regular expressions.
6. Stop processing when the first matching regular expression is found and use the corresponding location.
7. If no regular expression matches, use the location corresponding to the stored prefix string.





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



# HTTP Load Balancing

- [레퍼런스](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/)
- HTTP Traffic을 Load Balancing하기 위해서는 먼저 upstream 디렉티브를 사용해 그룹을 만들어야 한다.



## upstream

- [레퍼런스](https://nginx.org/en/docs/http/ngx_http_upstream_module.html?&_ga=2.137331317.434680056.1688082575-330740163.1686637760#upstream)
- sever 그룹을 설정한다.
- Syntax:  `upstream name { ... }`
- Context: `http`



**예시**

```nginx
http {
    upstream backend {
        server backend1.example.com weight=5;
        server backend2.example.com;
        server 192.0.0.1 backup;
    }
}
```

- 위 설정은 **backend**라는 이름의 그룹을 만들었고 이 그룹은 3개의 서버로 구성된다.
- upstream 블록 안에 사용된 server 디렉티브는 virtual server를 정의할 때 사용하는 server 블록 디렉티브와는 다르다.
- proxy_pass로 해당 upstream 그룹에 요청이 전달되면 load‑balancing algorithm을 통해 upstream을 구성하는  server로 트래픽이 분산된다.
  - load‑balancing algorithm을 명시하지 않으면 기본적으로 Round Robin 알고리즘이 사용된다.



## proxy_pass

- [레퍼런스](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass)
- proxy_pass는 앞서 정의한 그룹(upstream)에 요청을 전달하기 위해 사용되는 디렉티브다.



**예시**

```nginx
server {
    location / {
        proxy_pass http://backend;
    }
}
```

- server 블록 디렉티브로 virtual serve를 정의한다.
- 모든 요청을 backend upstream group으로 전달하는 설정



# ngx_http_rewrite_module

- ngx_http_rewrite_module을 사용하면 요청 URI를 변경할 수 있다.
- ngx_http_rewrite_module에 포함된 directives는 아래와 같다.
  - `break`, `if`, `return`, `rewrite`, `set`



`break`

- Context: `server`, `location`, `if`



`if`

```bash
Syntax:	if (condition) { ... }
Default:	—
Context:	server, location
```

- 



- - `break`: This stops the processing of rewrite directives in the current set.
  - `if`: This allows conditions to be set. If a condition is met, the specified directives are activated.
  - `return`: This stops processing and returns the specified value to the client.
  - `rewrite`: This rewrites the request URI based on the specified regular expression and replacement string.
  - `set`: This assigns a value to a variable.



The ngx_http_rewrite_module is a module in Nginx that is used for changing the Request URI based on Perl-Compatible Regular Expressions (PCRE), for returning redirects, and for conditionally selecting different configurations.

Here's a breakdown of the directives:

1. `break`: This stops the processing of rewrite directives in the current set.
2. `if`: This allows conditions to be set. If a condition is met, the specified directives are activated.
3. `return`: This stops processing and returns the specified value to the client.
4. `rewrite`: This rewrites the request URI based on the specified regular expression and replacement string.
5. `set`: This assigns a value to a variable.

The order of execution is as follows:

1. Directives specified on the server level are executed sequentially, in the order they appear.
2. Then, a location is chosen based on the request URI.
3. The directives within this location are then also executed sequentially.
4. If the request URI was rewritten, the process of finding a location and executing its directives repeats. But it will not repeat more than 10 times, to prevent potential infinite loops.



# Configuring Logging

- [레퍼런스](https://docs.nginx.com/nginx/admin-guide/monitoring/logging/)



## Setting Up the Error Log

- NGINX는 에러가 발생하면 해당 에러에 대한 정보를  Error Log 파일에 기록한다.
- Ubuntu, CentOS or Debian 환경에서 기본적으로 error log는 `/var/log/nginx`에 위치한다.



## Setting Up the Access Log

- NGINX는 클라이언트의 요청를 처리한 직후 요청에 대한 정보를 기록한다.
- Ubuntu, CentOS or Debian 환경에서 기본적으로 Access Log는 `/var/log/nginx`에 위치한다.
- 요청에 대한 정보는 미리 정의된 포맷으로 기록된다.



`access_log`

- [레퍼런스](https://nginx.org/en/docs/http/ngx_http_log_module.html#access_log)
- access_log를 사용하면 Access Log가 저장되는 위치를 변경하거나 포맷을 변경할 수 있다.



`log_format`

- [레퍼런스](https://nginx.org/en/docs/http/ngx_http_log_module.html#log_format)
- log_format를 사용해 로그의 포맷을 지정할 수 있다.
  - 로그 포맷 지정은 옵션이다.
  - 로그 포맷을 지정하지 않으면 기본 포맷이 사용된다.
- access_log가 log_format을 참조해 사용한다.



**예시**



예시

- log_format을 사용해서 포맷을 변경할 수 있다.
- access_log를 사용해서 Access Log의 위치와 포맷을 변경할 수 있다.

```nginx
http {
    log_format compression '$remote_addr - $remote_user [$time_local] '
                           '"$request" $status $body_bytes_sent '
                           '"$http_referer" "$http_user_agent" "$gzip_ratio"';

    server {
        gzip on;
        access_log /spool/logs/nginx-access.log compression;
        ...
    }
}

```



# Serving Static Content

- [레퍼런스](https://docs.nginx.com/nginx/admin-guide/web-server/serving-static-content/)



`try_files`

- Nginx에서 `try_files` 지시문은 클라이언트의 요청을 처리하기 위해 시도하는 파일이나 디렉토리의 목록을 지정한다.
- 지정된 경로 목록은 왼쪽에서 오른쪽으로 검사되며, Nginx는 최초로 존재하는 파일이나 디렉토리를 사용하여 요청을 처리한다.
- 만약 모든 파일이나 디렉토리가 존재하지 않는 경우, 마지막 인수가 반환되는데, 이는 일반적으로 에러 코드를 반환하는 지시문이나 다른 location으로의 내부 리디렉션이다.





# CORS

- 



**Enable CORS from all websites**

```nginx
server {
  set $cors '';
if ($http_origin ~ '^https?://(localhost|www\.yourdomain\.com|www\.yourotherdomain\.com)') {
        set $cors 'true';
}

if ($cors = 'true') {
        add_header 'Access-Control-Allow-Origin' "$http_origin" always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With' always;
        # required to be able to read Authorization header in frontend
        #add_header 'Access-Control-Expose-Headers' 'Authorization' always;
}

if ($request_method = 'OPTIONS') {
        # Tell client that this pre-flight info is valid for 20 days
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain charset=UTF-8';
        add_header 'Content-Length' 0;
        return 204;
}
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

